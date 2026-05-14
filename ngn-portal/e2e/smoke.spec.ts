import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/landing");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/home for Africa/i);
  });

  test("home dashboard renders for default persona", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/morning|afternoon|evening/i);
  });

  test("connect directory renders members", async ({ page }) => {
    await page.goto("/connect");
    await expect(page.getByRole("heading", { name: "Connect" })).toBeVisible();
  });

  test("events list renders", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();
  });

  test("discussion space shows thread list", async ({ page }) => {
    await page.goto("/discuss/spaces/general");
    await expect(
      page.getByRole("heading", { name: "Threads" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Introduce yourself/i }),
    ).toBeVisible();
  });
});
