"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth.actions";

const LoginForm = () => {
  const router = useRouter();

  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Login successful!");
      router.push("/tickets");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h1>

        <form action={formAction} className="space-y-4 text-gray-700">
          <input
            className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            name="email"
            placeholder="Your Email"
            autoComplete="email"
            required
          />
          <input
            className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
            type="submit"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
