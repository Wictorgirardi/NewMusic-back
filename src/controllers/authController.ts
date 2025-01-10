import { Request, RequestHandler, Response } from "express";
import { createUser } from "../models/user";

export const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {

    if (!name || !email || !password) {
      res.status(400).json({ error: "Os campos Nome, E-mail e senha são obrigatórios!" });
    } else {
        
      const newUser = await createUser(name, email, password);

      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: userWithoutPassword,
      });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
