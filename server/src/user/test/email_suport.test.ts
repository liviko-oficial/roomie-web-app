import { AuthSubmissionSchema } from "@/user/models/userAuth.schema";
import { describe, expect, it } from "vitest";

describe("support", () => {
  it("valid", () => {
    let resutl = AuthSubmissionSchema.shape.email.safeParse("mock@tec.mx");
    expect(resutl.success).toBe(true);
    expect(resutl.data).toBe("mock@tec.mx");
    resutl = AuthSubmissionSchema.shape.email.safeParse("mock@exatec.tec.mx");
    expect(resutl.success).toBe(true);
    expect(resutl.data).toBe("mock@exatec.tec.mx");
    resutl = AuthSubmissionSchema.shape.email.safeParse("mock@itesm.mx");
    expect(resutl.success).toBe(true);
    expect(resutl.data).toBe("mock@itesm.mx");
  });
  it("invalid", () => {
    let resutl = AuthSubmissionSchema.shape.email.safeParse("mock@itec.mx");
    expect(resutl.success).toBe(false);
    resutl = AuthSubmissionSchema.shape.email.safeParse(
      'mock@"exatec.tec.mx_moredata'
    );
    expect(resutl.success).toBe(false);
  });
});
