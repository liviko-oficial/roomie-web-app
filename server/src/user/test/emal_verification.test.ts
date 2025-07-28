import verificatior, { VerificationEmail } from "../models/emailVerification";
import { describe, expect, it } from "vitest";

describe("verification-email", () => {
  it("should-exist", () => {
    expect(verificatior).toBeInstanceOf(VerificationEmail);
    const email = "mock@tec.mx";
    const token = verificatior.get_link_id({ email });
    expect(verificatior.verify({ email, token: "UN_TOKEN_NO_VALIDO" })).toEqual(
      { error: "Token not found" }
    );
    expect(verificatior.verify({ email, token })).toEqual({ error: undefined });
    expect(verificatior.verify({ email, token })).toEqual({
      error: "Token not found",
    });
  });
});
