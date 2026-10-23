import express from "express";
import itemsRouter from "./routes/items.js";

// Builds the app without starting the server, so tests can use it directly.
export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/items", itemsRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Bad JSON in a request body, or any other error
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
  });

  return app;
}
