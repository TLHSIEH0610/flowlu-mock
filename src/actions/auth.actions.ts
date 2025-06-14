"use server";

import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { logToSentry } from "@/utils/sentry";
import { signAuthToken, setAuthCookie, removeAuthCookie } from "@/lib/auth";

type ResponseResult = {
  success: boolean;
  message: string;
};

// Register new user
export async function registerUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      logToSentry(
        "Validation error: Missing register fields",
        "auth",
        { name, email },
        "warning"
      );

      return { success: false, message: "All fields are required" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logToSentry(
        `Registration failed: User already exists - ${email}`,
        "auth",
        { email },
        "warning"
      );

      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Sign and set auth token
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    logToSentry(
      `User registered succcessfully: ${email}`,
      "auth",
      { userId: user.id, email },
      "info"
    );

    return { success: true, message: "Registration" };
  } catch (error) {
    logToSentry(
      "Unexpected error during registration",
      "auth",
      {},
      "error",
      error
    );
    console.error(error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

// Log user out and remove auth cookie
export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await removeAuthCookie();

    logToSentry("User logged out successfully", "auth", {}, "info");

    return { success: true, message: "Logout Successful" };
  } catch (error) {
    logToSentry("Unexpected error during logout", "auth", {}, "error", error);

    return { success: false, message: "Logout failed. Please try again" };
  }
}

// Log user in
export async function loginUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      logToSentry(
        "Validation error: Missing login fields",
        "auth",
        { email },
        "warning"
      );
      return { success: false, message: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      logToSentry(
        `Login Failed: User not found - ${email}`,
        "auth",
        { email },
        "warning"
      );

      return { success: false, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logToSentry(
        "Login Failed: Incorrect password",
        "auth",
        { email },
        "warning"
      );

      return { success: false, message: "Invalid email or password" };
    }

    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    return { success: true, message: "Login successful" };
  } catch (error) {
    logToSentry("Unexpected error during login", "auth", {}, "error", error);

    return { success: false, message: "Error during log in" };
  }
}
