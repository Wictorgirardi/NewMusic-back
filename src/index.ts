import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import pokemonRoutes from "./routes/pokemonRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT!;
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);
app.use("/api/pokemons", pokemonRoutes);

const server = app.listen(PORT, () => {
  console.log(`Hey! Server running on http://localhost:${PORT}`);
});

export { app, server };
