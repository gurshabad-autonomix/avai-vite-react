/**
 * Jotai atoms to persist authenticated user info from /users/me
 */
import { atom } from "jotai";
import type { MeResponse } from "@/types/auth";

export const meAtom = atom<MeResponse | null>(null);
