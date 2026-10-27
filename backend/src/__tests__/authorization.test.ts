import { hasAdminAuthority, isSuperAdminEmail, resolveRole } from "../config/authorization";

describe("authorization policy", () => {
  it("recognizes only the configured super-admin email", () => {
    expect(isSuperAdminEmail("kathirkalidass005@gmail.com")).toBe(true);
    expect(isSuperAdminEmail("KATHIRKALIDASS005@GMAIL.COM")).toBe(true);
    expect(isSuperAdminEmail("other@example.com")).toBe(false);
  });

  it("elevates the configured email without elevating other users", () => {
    expect(resolveRole("kathirkalidass005@gmail.com", "USER")).toBe("SUPER_ADMIN");
    expect(resolveRole("other@example.com", "admin")).toBe("ADMIN");
    expect(resolveRole("other@example.com")).toBe("USER");
  });

  it("allows both normal admins and super admins through admin routes", () => {
    expect(hasAdminAuthority("ADMIN")).toBe(true);
    expect(hasAdminAuthority("SUPER_ADMIN")).toBe(true);
    expect(hasAdminAuthority("TEACHER")).toBe(false);
  });
});