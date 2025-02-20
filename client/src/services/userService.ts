import UserModel from "../models/userModel";

const url = 'http://localhost:3000/api/user';

export async function createUser(newUser: UserModel) {
    try {
        const response = await fetch(`${url}/create-user`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating user: ', error.message);
        }
    }
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
    user?: UserModel;
}

export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json(); 

        if (!response.ok) {
            return { success: false, message: data.message || "Login failed" };
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error authenticating user:", error.message);
        }
        return { success: false, message: "An error occurred" }; 
    }
}

export interface UserProfile {
    success: boolean;
    message?: string;
    user?: UserModel;
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
    try {
        const response = await fetch(`${url}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }) 

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();

        return { success: true, ...data };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error authenticating token:", error.message);
        }
        return { success: false, message: "An error occurred" }; 
    }
}

