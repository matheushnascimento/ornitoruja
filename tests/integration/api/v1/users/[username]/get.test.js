//#region imports
import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
//#endregion

beforeAll(async () => {
  await orchestrator.waitForWallServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      //#region first request
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "mesmocase",
          email: "mesmo.case@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);
      //#endregion

      //#region second request
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/mesmocase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "mesmocase",
        email: "mesmo.case@email.com",
        password: "senha123",
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();

      //#endregion
    });
    test("With case mismatch", async () => {
      //#region first request
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "DifferentCase",
          email: "different.case@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);
      //#endregion

      //#region second request
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/differentcase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "DifferentCase",
        email: "different.case@email.com",
        password: "senha123",
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();

      //#endregion
    });
    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/unexisteUser",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
