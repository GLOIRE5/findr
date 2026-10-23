import express from "express";
import itemsRouter from "./items.js";

// All API routes in one place. app.js only imports this file.
// To add a new group of routes, import it here and add one router.use line.
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/items", itemsRouter);

export default router;
