import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";
import { User } from "../interfaces/user";

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new Error("Usuário não encontrado.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Senha inválida.");
    }

    return user as User;
  } catch (error: any) {
    console.error("Erro:", error.message);
    throw new Error("Erro ao fazer login.");
  }
};
