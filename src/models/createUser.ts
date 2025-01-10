import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";
import { User } from "../interfaces/user";

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("E-mail já está em uso.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as User;
};
