import { Router } from "express";
import { listingsController } from "../controllers/listings.controller";

const router = Router();

// GET /listings?suburb=Northside&price_min=500000&price_max=1000000&beds=3&baths=2&type=house&keyword=modern&page=1&limit=10
router.get("/", listingsController.getAll);

// GET /listings/:id
router.get("/:id", listingsController.getById);

export default router;