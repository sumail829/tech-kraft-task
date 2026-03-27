import { Request, Response } from "express";
import { listingsService } from "../services/listings.service";

export const listingsController = {
  async getAll(req: Request, res: Response) {
    try {
      const {
        suburb,
        price_min,
        price_max,
        beds,
        baths,
        type,
        keyword,
        page,
        limit,
      } = req.query;

        

      
      const filters = {
        suburb: suburb as string | undefined,
        price_min: price_min ? Number(price_min) : undefined,
        price_max: price_max ? Number(price_max) : undefined,
        beds: beds ? Number(beds) : undefined,
        baths: baths ? Number(baths) : undefined,
        type: type as string | undefined,
        keyword: keyword as string | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      };

      const result = await listingsService.getAll(filters, req.isAdmin);
      res.json(result);
    } catch (err: any) {
      console.error("getAll error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(String(req.params.id));

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const property = await listingsService.getById(id, req.isAdmin);

      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }

      res.json(property);
    } catch (err: any) {
      console.error("getById error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};