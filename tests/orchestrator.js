//#region imports
import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import migrator from "models/migrator.js";
import user from "models/user";
import session from "models/session";
//#endregion

async function waitForWallServices() {
  await waitForWebServer();
}
async function clearDatabase() {
  await database.query("DROP schema public cascade; create schema public;");
}
async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}
async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });

  async function fetchStatusPage() {
    const response = await fetch("http://localhost:3000/api/v1/status");
    if (!response.ok) {
      throw new Error();
    }
  }
}
async function createUser(userObject) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "validPassword",
  });
}
async function createSession(userId) {
  return await session.create(userId);
}

const orchestrator = {
  waitForWallServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
};

export default orchestrator;
