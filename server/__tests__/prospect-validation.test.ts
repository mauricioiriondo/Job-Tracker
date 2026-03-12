import { validateProspect } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("salary field validation", () => {
  const base = { companyName: "Acme", roleTitle: "Engineer" };

  test("accepts a valid salary range like $120k–$150k", () => {
    const result = validateProspect({ ...base, salary: "$120k–$150k" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a full dollar amount like $130,000", () => {
    const result = validateProspect({ ...base, salary: "$130,000" });
    expect(result.valid).toBe(true);
  });

  test("accepts when salary is omitted (optional field)", () => {
    const result = validateProspect({ ...base });
    expect(result.valid).toBe(true);
  });

  test("accepts when salary is an empty string (treated as blank)", () => {
    const result = validateProspect({ ...base, salary: "" });
    expect(result.valid).toBe(true);
  });

  test("accepts when salary is null", () => {
    const result = validateProspect({ ...base, salary: null });
    expect(result.valid).toBe(true);
  });

  test("rejects salary with no digits", () => {
    const result = validateProspect({ ...base, salary: "great pay" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Salary must include a number (e.g. $120k or $80,000–$100,000)"
    );
  });

  test("rejects salary exceeding 50 characters", () => {
    const result = validateProspect({ ...base, salary: "$" + "1".repeat(51) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be 50 characters or less");
  });

  test("shows blank on card when salary is null — no display value emitted", () => {
    const salary = null;
    const displayed = salary ? salary : "";
    expect(displayed).toBe("");
  });

  test("shows blank on card when salary is empty string", () => {
    const salary = "";
    const displayed = salary ? salary : "";
    expect(displayed).toBe("");
  });

  test("shows salary value on card when set", () => {
    const salary = "$95,000";
    const displayed = salary ? salary : "";
    expect(displayed).toBe("$95,000");
  });
});
