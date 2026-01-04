import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("saveToken", () => {
        it("should save token to localStorage", () => {
            AuthService.saveToken("test-token");
            expect(localStorage.getItem("token")).toBe("test-token");
        });
    });

    describe("getToken", () => {
        it("should get token from localStorage", () => {
            localStorage.setItem("token", "stored-token");
            expect(AuthService.getToken()).toBe("stored-token");
        });

        it("should return null when no token", () => {
            expect(AuthService.getToken()).toBeNull();
        });
    });

    describe("removeToken", () => {
        it("should remove token from localStorage", () => {
            localStorage.setItem("token", "to-remove");
            AuthService.removeToken();
            expect(localStorage.getItem("token")).toBeNull();
        });
    });

    describe("decodeToken", () => {
        it("should decode valid JWT token", () => {
            const payload = { id: "123", role: "admin", exp: 9999999999, iat: 1234567890 };
            const token = `header.${btoa(JSON.stringify(payload))}.signature`;

            const decoded = AuthService.decodeToken(token);

            expect(decoded).toEqual(payload);
        });

        it("should return null for invalid token format", () => {
            expect(AuthService.decodeToken("invalid")).toBeNull();
        });

        it("should return null for token with invalid base64", () => {
            expect(AuthService.decodeToken("a.!!invalid!!.b")).toBeNull();
        });
    });

    describe("isTokenExpired", () => {
        it("should return true for expired token", () => {
            vi.setSystemTime(new Date("2025-01-01"));
            const payload = { id: "123", role: "user", exp: 1704067100, iat: 1234567890 };
            const token = `header.${btoa(JSON.stringify(payload))}.signature`;

            expect(AuthService.isTokenExpired(token)).toBe(true);
        });

        it("should return false for valid token", () => {
            vi.setSystemTime(new Date("2025-01-01"));
            const futureExp = Math.floor(Date.now() / 1000) + 3600;
            const payload = { id: "123", role: "user", exp: futureExp, iat: 1234567890 };
            const token = `header.${btoa(JSON.stringify(payload))}.signature`;

            expect(AuthService.isTokenExpired(token)).toBe(false);
        });

        it("should return true for invalid token", () => {
            expect(AuthService.isTokenExpired("invalid-token")).toBe(true);
        });
    });

    describe("mapUserResponse", () => {
        it("should map user with _id", () => {
            const apiUser = {
                _id: "mongo-id",
                name: "John Doe",
                email: "john@example.com",
                role: "admin",
            };

            const result = AuthService.mapUserResponse(apiUser);

            expect(result.id).toBe("mongo-id");
            expect(result.name).toBe("John Doe");
            expect(result.email).toBe("john@example.com");
            expect(result.role).toBe("admin");
        });

        it("should map user with id fallback", () => {
            const apiUser = {
                id: "regular-id",
                name: "Jane Doe",
                email: "jane@example.com",
                role: "user",
            };

            const result = AuthService.mapUserResponse(apiUser);

            expect(result.id).toBe("regular-id");
        });

        it("should include avatarUrl if present", () => {
            const apiUser = {
                _id: "123",
                name: "User",
                email: "user@example.com",
                role: "user",
                avatarUrl: "https://example.com/avatar.png",
            };

            const result = AuthService.mapUserResponse(apiUser);

            expect(result.avatarUrl).toBe("https://example.com/avatar.png");
        });
    });

    describe("getAuthHeader", () => {
        it("should return authorization header with token", () => {
            const header = AuthService.getAuthHeader("my-token");
            expect(header).toEqual({ Authorization: "Bearer my-token" });
        });

        it("should return empty object when no token", () => {
            expect(AuthService.getAuthHeader(null)).toEqual({});
        });
    });

    describe("isValidEmail", () => {
        it("should return true for valid email", () => {
            expect(AuthService.isValidEmail("test@example.com")).toBe(true);
            expect(AuthService.isValidEmail("user.name@domain.co")).toBe(true);
        });

        it("should return false for invalid email", () => {
            expect(AuthService.isValidEmail("invalid")).toBe(false);
            expect(AuthService.isValidEmail("no@domain")).toBe(false);
            expect(AuthService.isValidEmail("@domain.com")).toBe(false);
            expect(AuthService.isValidEmail("user@")).toBe(false);
        });
    });

    describe("isValidPassword", () => {
        it("should return valid for password with 6+ characters", () => {
            const result = AuthService.isValidPassword("password123");
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it("should return invalid for short password", () => {
            const result = AuthService.isValidPassword("12345");
            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Password must be at least 6 characters");
        });
    });
});
