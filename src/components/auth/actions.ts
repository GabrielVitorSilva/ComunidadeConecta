// src/components/auth/actions.ts
"use server";

import * as z from "zod";
import { getUserByEmail, addMockUser, getUserById } from '@/lib/data';
import type { User } from '@/types';

// Schemas for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Basic check, real app would hash/compare
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  user?: User; // For returning user on success
  error?: string;
}

export async function loginUser(values: z.infer<typeof loginSchema>): Promise<ActionResult> {
  try {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Dados inválidos." };
    }

    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { success: false, error: "Usuário não encontrado." };
    }

    // Mock password check - In a real app, compare hashed passwords
    if (password === "password123") { // Replace with a generic password for mock or enhance mock data
      return { success: true, user: existingUser };
    } else {
      // A more specific check for the default mock users:
      // For user1@example.com (Ana Silva), user2@example.com (Bruno Costa), user3@example.com (Carla Dias)
      // Let's assume their passwords are 'password' followed by their user number
      const userNumberMatch = existingUser.id.match(/user(\d+)/);
      if (userNumberMatch && password === `password${userNumberMatch[1]}`) {
         return { success: true, user: existingUser };
      }
      return { success: false, error: "Senha incorreta." };
    }

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Ocorreu um erro no servidor." };
  }
}

export async function registerUser(values: z.infer<typeof registerSchema>): Promise<ActionResult> {
  try {
    const validatedFields = registerSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Dados de registro inválidos." };
    }

    const { name, email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { success: false, error: "Este email já está registrado." };
    }
    
    const userId = `user${Date.now()}`; // Simple unique ID for mock
    const newUser: User = {
      id: userId,
      name,
      email,
      avatarUrl: `https://placehold.co/100x100.png?text=${name.substring(0,2).toUpperCase()}`
      // Password is not stored directly in mock User object
    };

    addMockUser(newUser); // Add to our mock database

    // In a real app, you'd hash password here before saving.
    // For mock, we assume successful registration.

    return { success: true, user: newUser };

  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Ocorreu um erro no servidor durante o registro." };
  }
}
