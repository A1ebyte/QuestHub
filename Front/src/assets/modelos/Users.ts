import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signInWithDiscord: () => Promise<{ data: any; error: any }>;
  signInWithGithub: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

export interface UserResponse {
  uuid: string,
  email: string,
  token: string
}