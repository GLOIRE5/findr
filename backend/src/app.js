import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// Builds the app without starting the server, so tests can use it directly.
export function createApp() {
  const app = express();

  // Only the frontend address in CORS_ORIGIN may call the API from a browser.
  // Several addresses can be given, separated by commas.
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
  app.use(cors({ origin: allowedOrigins }));

  app.use(express.json());

  app.use("/api", routes);

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
