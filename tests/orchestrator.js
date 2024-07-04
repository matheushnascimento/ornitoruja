import retry from "async-retry";
async function waitForWallServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });

  async function fetchStatusPage(bail, tryNumber) {
    console.log(`tryNumber: ${tryNumber}`);
    const response = await fetch("http://localhost:3000/api/v1/status");
    if (!response.ok) {
      throw new Error();
    }
  }
}
const orchestrator = {
  waitForWallServices,
};

export default orchestrator;
