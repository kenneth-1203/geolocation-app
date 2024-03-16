"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};

type FormValues = {
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/");
    }
  });

  const handleLogin = async (data: FormValues) => {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(response.user);
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = credential.accessToken;
      GoogleAuthProvider.credentialFromResult(credential);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = credential.accessToken;
      GoogleAuthProvider.credentialFromResult(credential);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen w-full items-center justify-center">
      <div className="flex flex-col w-96">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form
          className="flex flex-col space-y-2"
          onSubmit={handleSubmit(handleLogin)}
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
          <Button
            variant={"outline"}
            type="button"
            onClick={() => router.push("/sign-up")}
          >
            Sign up
          </Button>
          <Button type="submit">Login</Button>
          <Button type="button" onClick={loginWithGoogle}>
            Login with Google
          </Button>
          <Button type="button" onClick={loginWithFacebook}>
            Login with Facebook
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
