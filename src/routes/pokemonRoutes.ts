import { Router } from "express";
import { listKantoPokemons } from "../controllers/pokemonController";
import { isAuthenticated } from "../middlewares/authMiddleware";


const router = Router();

// Rota protegida para listar Pokémons de Kanto
router.get("/", isAuthenticated, listKantoPokemons);

export default router;
