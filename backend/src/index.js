// Loads variables from .env into process.env. Must be the first import.
import "dotenv/config";
import { createApp } from "./app.js";
import { closeStore, initStore } from "./store/itemStore.js";

const PORT = process.env.PORT || 3000;

// Connect to the database before accepting requests
const storeName = await initStore();

const server = createApp().listen(PORT, () => {
  console.log(`Findr API running at http://localhost:${PORT} (storage: ${storeName})`);
});

// Docker sends SIGTERM when it stops a container. Finish open requests and
// close the database connection before exiting.
function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await closeStore();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
