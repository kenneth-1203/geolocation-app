"use server";

import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function loginWithGoogle() {
  const user = await signInWithPopup(auth, new GoogleAuthProvider());
  return user;
}

export async function loginWithFacebook() {
  const user = await signInWithPopup(auth, new FacebookAuthProvider());
  return user;
}

export async function login(email: string, password: string) {
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
