import express from "express";
import { createItem, getItem } from "../controllers/reportController.js";
import { listItems } from "../controllers/searchController.js";
import { claimItem, markReturned } from "../controllers/claimController.js";

const router = express.Router();

router.get("/", listItems);
router.post("/", createItem);
router.get("/:id", getItem);
router.post("/:id/claim", claimItem);
router.patch("/:id/returned", markReturned);

export default router;
