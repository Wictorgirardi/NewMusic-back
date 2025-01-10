import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../interfaces/auth";

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Erro de autenticação!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido!" });
  }
};
