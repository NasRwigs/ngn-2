import { describe, expect, it } from "vitest";

import { formatDate, formatTime, greeting } from "@/lib/format/date";

describe("format/date", () => {
  it("formatDate matches the design language", () => {
    expect(formatDate("2026-10-15T00:00:00Z")).toMatch(/Oct 15, 2026/);
  });

  it("formatTime returns HH:mm", () => {
    expect(formatTime("2026-10-15T14:05:00Z")).toMatch(/^\d{2}:\d{2}$/);
  });

  it("greeting changes by hour of day", () => {
    expect(greeting(new Date("2026-05-12T09:00:00Z"))).toMatch(/morning|afternoon|evening/);
  });
});
