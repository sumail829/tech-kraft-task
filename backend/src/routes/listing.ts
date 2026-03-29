import { Router } from "express";
import { listingsController } from "../controllers/listings.controller";

const router = Router();


router.get("/", listingsController.getAll);


router.get("/:id", listingsController.getById);

export default router;