import { Request, RequestHandler, Response } from "express";
import { createUser } from "../models/createUser";
import { loginUser } from "../models/login";
import { generateToken } from "../utils/jwt";

export const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "Os campos Nome, E-mail e senha são obrigatórios!" });
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

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    } else {
      const user = await loginUser(email, password);
      const token = generateToken(user.id);

      res.status(200).json({
        message: "Usuário logado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error: any) {
    res.status(401).json({ error: "Usuário não encontrado!" });
  }
};
