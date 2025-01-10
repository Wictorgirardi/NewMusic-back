import { Request, RequestHandler, Response } from "express";
import { fetchPokemons } from "../models/pokemon";

export const listKantoPokemons: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const pokemons = await fetchPokemons(limitNumber, offset, search as string);

    res.status(200).json({
      message: "Sucesso ao buscar pokemons.",
      pokemons,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Oops! Algo deu errado.' });
  }
};
