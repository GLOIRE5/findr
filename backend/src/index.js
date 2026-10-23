// Loads variables from .env into process.env. Must be the first import.
import "dotenv/config";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 3000;

createApp().listen(PORT, () => {
  console.log(`Findr API running at http://localhost:${PORT}`);
});
