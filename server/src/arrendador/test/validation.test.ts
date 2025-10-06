import { describe, it, expect } from "vitest";
import {
  CreateArrendadorSchema,
  UpdateArrendadorSchema,
  UpdateArrendadorProfileSchema,
  CreatePropertySchema,
  UpdatePropertySchema,
  ArrendadorLoginSchema,
  ChangePasswordSchema
} from "../validation/arrendador.validation";
import {
  ArrendadorAuthSubmissionSchema,
  ArrendadorAuthSchema
} from "../models/arrendadorAuth.schema";

describe("Arrendador Validation Tests", () => {
  describe("ArrendadorAuthSubmissionSchema", () => {
    const validAuthData = {
      email: "test@tec.mx",
      password: "ValidPassword123!"
    };

    it("should validate correct auth submission data", () => {
      const result = ArrendadorAuthSubmissionSchema.safeParse(validAuthData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email domain", () => {
      const invalidData = {
        ...validAuthData,
        email: "test@gmail.com"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const invalidData = {
        ...validAuthData,
        password: "validpassword123!"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password without lowercase", () => {
      const invalidData = {
        ...validAuthData,
        password: "VALIDPASSWORD123!"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const invalidData = {
        ...validAuthData,
        password: "ValidPassword!"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password without special character", () => {
      const invalidData = {
        ...validAuthData,
        password: "ValidPassword123"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password too short", () => {
      const invalidData = {
        ...validAuthData,
        password: "Val1!"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password too long", () => {
      const invalidData = {
        ...validAuthData,
        password: "A".repeat(33) + "1!"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        ...validAuthData,
        email: "invalid-email"
      };
      const result = ArrendadorAuthSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept all supported email domains", () => {
      const supportedDomains = ["tec.mx", "exatec.tec.mx", "itesm.mx"];
      
      supportedDomains.forEach(domain => {
        const validData = {
          ...validAuthData,
          email: `test@${domain}`
        };
        const result = ArrendadorAuthSubmissionSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("CreateArrendadorSchema", () => {
    const validArrendadorData = {
      email: "test@tec.mx",
      password: "ValidPassword123!",
      profile: {
        fullName: "Test Arrendador",
        phone: "+52 55 1234 5678"
      },
      isEmailVerified: false,
      isActive: true
    };

    it("should validate correct arrendador creation data", () => {
      const result = CreateArrendadorSchema.safeParse(validArrendadorData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal arrendador data", () => {
      const minimalData = {
        email: "test@tec.mx",
        password: "ValidPassword123!"
      };
      const result = CreateArrendadorSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const invalidData = {
        email: "test@tec.mx"
        // Missing password
      };
      const result = CreateArrendadorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateArrendadorProfileSchema", () => {
    const validProfileData = {
      profilePicture: "https://example.com/profile.jpg",
      officialId: {
        type: "INE",
        fileUrl: "https://example.com/ine.pdf",
        fileName: "INE_Test.pdf"
      },
      dateOfBirth: {
        day: 15,
        month: 8,
        year: 1990
      },
      gender: "masculino",
      phone: "+52 55 1234 5678",
      fullName: "Test Arrendador"
    };

    it("should validate correct profile data", () => {
      const result = UpdateArrendadorProfileSchema.safeParse(validProfileData);
      expect(result.success).toBe(true);
    });

    it("should validate partial profile data", () => {
      const partialData = {
        fullName: "Updated Name",
        phone: "+52 55 9876 5432"
      };
      const result = UpdateArrendadorProfileSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid profile picture URL", () => {
      const invalidData = {
        ...validProfileData,
        profilePicture: "not-a-url"
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid official ID type", () => {
      const invalidData = {
        ...validProfileData,
        officialId: {
          type: "invalid",
          fileUrl: "https://example.com/doc.pdf",
          fileName: "doc.pdf"
        }
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date of birth - invalid day", () => {
      const invalidData = {
        ...validProfileData,
        dateOfBirth: {
          day: 35,
          month: 8,
          year: 1990
        }
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date of birth - invalid month", () => {
      const invalidData = {
        ...validProfileData,
        dateOfBirth: {
          day: 15,
          month: 13,
          year: 1990
        }
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date of birth - future year", () => {
      const invalidData = {
        ...validProfileData,
        dateOfBirth: {
          day: 15,
          month: 8,
          year: new Date().getFullYear() + 1
        }
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date of birth - too old year", () => {
      const invalidData = {
        ...validProfileData,
        dateOfBirth: {
          day: 15,
          month: 8,
          year: 1899
        }
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid gender", () => {
      const invalidData = {
        ...validProfileData,
        gender: "invalid"
      };
      const result = UpdateArrendadorProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept all valid genders", () => {
      const validGenders = ["masculino", "femenino", "otro"];
      
      validGenders.forEach(gender => {
        const validData = {
          ...validProfileData,
          gender
        };
        const result = UpdateArrendadorProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should accept all valid official ID types", () => {
      const validIdTypes = ["INE", "passport", "license"];
      
      validIdTypes.forEach(type => {
        const validData = {
          ...validProfileData,
          officialId: {
            type,
            fileUrl: "https://example.com/doc.pdf",
            fileName: "doc.pdf"
          }
        };
        const result = UpdateArrendadorProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("CreatePropertySchema", () => {
    const validPropertyData = {
      propertyType: "Departamento",
      rentalType: "Departamento completo",
      genderPreference: "Mixto",
      monthlyPrice: 8500,
      includesServices: true,
      services: ["Luz", "Agua", "Internet"],
      isFurnished: true,
      furniture: ["Cama", "Escritorio", "Refrigerador"],
      address: {
        street: "Test Street 123",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "México"
      },
      images: ["https://example.com/image1.jpg"],
      description: "Test property description"
    };

    it("should validate correct property data", () => {
      const result = CreatePropertySchema.safeParse(validPropertyData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal property data", () => {
      const minimalData = {
        propertyType: "Casa",
        rentalType: "Casa completa",
        genderPreference: "Solo mujeres",
        monthlyPrice: 5000,
        includesServices: false,
        isFurnished: false
      };
      const result = CreatePropertySchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid property type", () => {
      const invalidData = {
        ...validPropertyData,
        propertyType: "InvalidType"
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid rental type", () => {
      const invalidData = {
        ...validPropertyData,
        rentalType: "Invalid rental type"
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid gender preference", () => {
      const invalidData = {
        ...validPropertyData,
        genderPreference: "Invalid preference"
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject negative price", () => {
      const invalidData = {
        ...validPropertyData,
        monthlyPrice: -1000
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject zero price", () => {
      const invalidData = {
        ...validPropertyData,
        monthlyPrice: 0
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid service", () => {
      const invalidData = {
        ...validPropertyData,
        services: ["InvalidService"]
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept all valid services", () => {
      const validServices = [
        "Luz", "Agua", "Gas", "Internet", 
        "Limpieza", "Mantenimiento", "Agua potable", 
        "Todos los servicios"
      ];
      
      const validData = {
        ...validPropertyData,
        services: validServices
      };
      const result = CreatePropertySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept all valid property types", () => {
      const validTypes = ["Casa", "Departamento", "Loft"];
      
      validTypes.forEach(propertyType => {
        const validData = {
          ...validPropertyData,
          propertyType
        };
        const result = CreatePropertySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should accept all valid rental types", () => {
      const validRentalTypes = [
        "Casa completa",
        "Departamento completo",
        "Habitación dentro de una casa",
        "Habitación dentro de un departamento",
        "Loft"
      ];
      
      validRentalTypes.forEach(rentalType => {
        const validData = {
          ...validPropertyData,
          rentalType
        };
        const result = CreatePropertySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should accept all valid gender preferences", () => {
      const validPreferences = ["Solo hombres", "Solo mujeres", "Mixto"];
      
      validPreferences.forEach(genderPreference => {
        const validData = {
          ...validPropertyData,
          genderPreference
        };
        const result = CreatePropertySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid image URLs", () => {
      const invalidData = {
        ...validPropertyData,
        images: ["not-a-url", "also-not-a-url"]
      };
      const result = CreatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("ArrendadorLoginSchema", () => {
    const validLoginData = {
      email: "test@tec.mx",
      password: "somepassword"
    };

    it("should validate correct login data", () => {
      const result = ArrendadorLoginSchema.safeParse(validLoginData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        ...validLoginData,
        email: "invalid-email"
      };
      const result = ArrendadorLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const invalidData = {
        ...validLoginData,
        password: ""
      };
      const result = ArrendadorLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing email", () => {
      const invalidData = {
        password: "somepassword"
      };
      const result = ArrendadorLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing password", () => {
      const invalidData = {
        email: "test@tec.mx"
      };
      const result = ArrendadorLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("ChangePasswordSchema", () => {
    const validPasswordChangeData = {
      currentPassword: "CurrentPassword123!",
      newPassword: "NewPassword123!"
    };

    it("should validate correct password change data", () => {
      const result = ChangePasswordSchema.safeParse(validPasswordChangeData);
      expect(result.success).toBe(true);
    });

    it("should reject missing current password", () => {
      const invalidData = {
        newPassword: "NewPassword123!"
      };
      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing new password", () => {
      const invalidData = {
        currentPassword: "CurrentPassword123!"
      };
      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject weak new password", () => {
      const invalidData = {
        ...validPasswordChangeData,
        newPassword: "weak"
      };
      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty current password", () => {
      const invalidData = {
        ...validPasswordChangeData,
        currentPassword: ""
      };
      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should apply same password rules as registration", () => {
      // Test all password requirements for new password
      const passwordTests = [
        { password: "nouppercases123!", shouldFail: true },
        { password: "NOLOWERCASES123!", shouldFail: true },
        { password: "NoNumbers!", shouldFail: true },
        { password: "NoSpecialChars123", shouldFail: true },
        { password: "Short1!", shouldFail: true },
        { password: "A".repeat(33) + "1!", shouldFail: true },
        { password: "ValidPassword123!", shouldFail: false }
      ];

      passwordTests.forEach(({ password, shouldFail }) => {
        const testData = {
          ...validPasswordChangeData,
          newPassword: password
        };
        const result = ChangePasswordSchema.safeParse(testData);
        expect(result.success).toBe(!shouldFail);
      });
    });
  });

  describe("UpdatePropertySchema", () => {
    const validUpdateData = {
      monthlyPrice: 9500,
      description: "Updated description",
      isActive: false
    };

    it("should validate correct property update data", () => {
      const result = UpdatePropertySchema.safeParse(validUpdateData);
      expect(result.success).toBe(true);
    });

    it("should validate partial property update", () => {
      const partialData = {
        monthlyPrice: 10000
      };
      const result = UpdatePropertySchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("should validate empty update", () => {
      const emptyData = {};
      const result = UpdatePropertySchema.safeParse(emptyData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid update data", () => {
      const invalidData = {
        monthlyPrice: -5000
      };
      const result = UpdatePropertySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});