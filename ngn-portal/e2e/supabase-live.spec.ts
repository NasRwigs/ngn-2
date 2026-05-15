import fs from "node:fs";
import path from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const canRun = Boolean(supabaseUrl && publishableKey && serviceRoleKey);

test.describe("supabase live smoke", () => {
  test.describe.configure({ mode: "serial" });

  test.skip(!canRun, "Requires .env.local with Supabase URL, publishable key, and service role");

  let email: string;
  let password: string;
  let userId: string;
  let admin: SupabaseClient;

  test.beforeAll(async () => {
    email = `pw-smoke-${Date.now()}@ngn-smoke.test`;
    password = "SmokeTest123!Aa";
    admin = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Smoke Tester" },
    });
    if (error) throw error;
    userId = data.user!.id;

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        title: "Engineer",
        organisation: "NGN Smoke",
        country: "Nigeria",
      })
      .eq("id", userId);
    if (profileError) throw profileError;
  });

  test.afterAll(async () => {
    if (admin && userId) {
      await admin.auth.admin.deleteUser(userId);
    }
  });

  test("onboarding wizard loads account step", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText("Account", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel(/^Password/i)).toBeVisible();
  });

  test("sign-in, directory, and discuss spaces", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/morning|afternoon|evening/i);

    await page.goto("/connect");
    await expect(page.getByRole("heading", { name: "Connect" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Smoke Tester" }),
    ).toBeVisible();

    await page.goto("/discuss/spaces/general");
    await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Threads" })).toBeVisible();
    await expect(page.getByText("No threads yet")).toBeVisible();
  });
});
