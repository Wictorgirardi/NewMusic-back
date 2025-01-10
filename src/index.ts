import express from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT!;

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Hey! Server running on http://localhost:${PORT}`);
});