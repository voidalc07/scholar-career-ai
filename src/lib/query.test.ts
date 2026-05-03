import { describe, expect, it } from "vitest";
import { buildOpportunityQuery } from "./query";

describe("buildOpportunityQuery", () => {
  it("returns encoded query parameters", () => {
    const query = buildOpportunityQuery("tech fellowship", "undergraduate");
    expect(query).toContain("search=tech+fellowship");
    expect(query).toContain("educationLevel=undergraduate");
  });

  it("returns empty string when no filters", () => {
    expect(buildOpportunityQuery("", "")).toBe("");
  });
});
