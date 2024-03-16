"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Login = (props: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const password = useWatch({ name: "password", control });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/");
    }
  });

  const handleSignUp = (data: FormValues) => {
    setError(null);
    createUserWithEmailAndPassword(auth, data.email, data.password).catch(
      (error) => {
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            setError("Invalid email");
            break;
          case AuthErrorCodes.WEAK_PASSWORD:
            setError("Password must be more than 6 characters");
            break;
          case AuthErrorCodes.EMAIL_EXISTS:
            setError("Email already in use");
            break;
          default:
            setError(error.message);
        }
      }
    );
  };

  return (
    <main className="flex flex-col min-h-screen w-full items-center justify-center">
      <div className="flex flex-col w-96">
        <h1 className="text-3xl font-bold mb-4">Sign up</h1>
        <form
          className="flex flex-col space-y-2"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm password is required",
              },
              validate: {
                matches: (value) =>
                  value === password || "Passwords do not match",
              },
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <Button type="submit">Create account</Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
