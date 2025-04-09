//#region imports
import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
//#endregion

beforeAll(async () => {
  await orchestrator.waitForWallServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "matheusnascimento",
          email: "matheus@matheus.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "matheusnascimento",
        email: "matheus@matheus.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With duplicated email", async () => {
      //#region first request
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail1",
          email: "duplicated@email.com",
          password: "senha123",
        }),
      });

      const response1Body = await response1.json();
      expect(response1.status).toBe(201);

      expect(response1Body).toEqual({
        id: response1Body.id,
        username: "duplicatedemail1",
        email: "duplicated@email.com",
        password: "senha123",
        created_at: response1Body.created_at,
        updated_at: response1Body.updated_at,
      });
      //#endregion

      //#region second request
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail2",
          email: "Duplicated@email.com",
          password: "senha123",
        }),
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });

      //#endregion
    });
    test("With duplicated username", async () => {
      //#region first request
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedUsername",
          email: "duplicated@user.com",
          password: "senha123",
        }),
      });
      const response1Body = await response1.json();

      expect(response1.status).toBe(201);

      expect(response1Body).toEqual({
        id: response1Body.id,
        username: "duplicatedUsername",
        email: "duplicated@user.com",
        password: "senha123",
        created_at: response1Body.created_at,
        updated_at: response1Body.updated_at,
      });

      //#endregion

      //#region first request
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedUsername",
          email: "duplicated2@email.com",
          password: "senha123",
        }),
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });

      //#endregion
    });
  });
});
