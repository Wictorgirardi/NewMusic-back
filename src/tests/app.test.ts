import request from "supertest";
import { expect, describe, it } from "@jest/globals";
import { app, server } from "../index";
import { supabase } from "../config/supabase";

describe("POST /api/auth/register", () => {
  afterAll((done) => {
    server.close(done);
  });
  it("deve registrar um usuário com sucesso", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Wictor Girardi",
      email: "wictor@example.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário criado com sucesso!"
    );
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("name", "Wictor Girardi");
    expect(response.body.user).toHaveProperty("email", "wictor@example.com");
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", response.body.user.id);
      if (error) {
        throw error;
      }
      return { message: "Usúario deletado.", data };
    } catch (error: any) {
      return { error: error.message };
    }
  });

  it("deve retornar erro se o email já estiver em uso", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Ash Ketchum",
      email: "ash@example.com",
      password: "pikachu123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "E-mail já está em uso.");
  });
});

describe("POST /api/auth/login", () => {
  it("deve fazer login e retornar um token JWT", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "ash@example.com",
      password: "pikachu123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("deve retornar erro se as credenciais forem inválidas", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "wictor@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Usuário não encontrado!");
  });
});

describe("GET /api/pokemons", () => {
  it("deve retornar os pokémons de Kanto com paginação", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "ash@example.com",
      password: "pikachu123",
    });

    const response = await request(app)
      .get("/api/pokemons?page=1")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Sucesso ao buscar pokemons."
    );
    expect(response.body).toHaveProperty("totalPokemons");
    expect(response.body).toHaveProperty("totalPages");
    expect(response.body).toHaveProperty("currentPage");
    expect(response.body.pokemons.length).toBe(20);
  });

  it("deve retornar erro se o token não for fornecido", async () => {
    const response = await request(app).get("/api/pokemons?page=1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Erro de autenticação!");
  });

  it("deve retornar pokémons filtrados por nome ou número", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "ash@example.com",
      password: "pikachu123",
    });
    const response = await request(app)
      .get("/api/pokemons?search=bulba&page=1")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.pokemons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining("bulba"),
        }),
      ])
    );
  });
});
