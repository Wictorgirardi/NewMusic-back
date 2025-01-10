import { Router } from "express";
import { listKantoPokemons } from "../controllers/pokemonController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /pokemons:
 *   get:
 *     summary: Lista os Pokémons de Kanto com paginação
 *     tags: [Pokemons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página para paginação
 *     responses:
 *       200:
 *         description: Lista de Pokémons de Kanto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalPokemons:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       401:
 *         description: Erro de autenticação
 */
router.get("/", isAuthenticated, listKantoPokemons);

export default router;
