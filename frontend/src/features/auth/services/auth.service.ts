const TOKEN_KEY = "token";

interface JwtPayload {
    id: string;
    role: string;
    exp: number;
    iat: number;
}

interface ApiUser {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

export const AuthService = {
    saveToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isTokenExpired: (token: string): boolean => {
        try {
            const payload = AuthService.decodeToken(token);
            if (!payload) return true;
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    },

    decodeToken: (token: string): JwtPayload | null => {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) return null;
            const payload = JSON.parse(atob(parts[1]));
            return payload as JwtPayload;
        } catch {
            return null;
        }
    },

    mapUserResponse: (apiUser: ApiUser): User => ({
        id: apiUser._id || apiUser.id || "",
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
        avatarUrl: apiUser.avatarUrl,
    }),

    getAuthHeader: (token: string | null): Record<string, string> => {
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    },

    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];
        if (password.length < 6) {
            errors.push("Password must be at least 6 characters");
        }
        return { valid: errors.length === 0, errors };
    },
};
