import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateAge } from "../shared/age";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.options("/api/age", (_req, res) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }).sendStatus(204);
  });

  app.get("/api/age", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");

    const dob = typeof req.query.dob === "string" ? req.query.dob : undefined;
    if (!dob) return res.status(400).json({ error: "Invalid date of birth" });

    const result = calculateAge(dob);
    if (!result) return res.status(400).json({ error: "Invalid date of birth" });

    return res.json(result);
  });

  const httpServer = createServer(app);

  return httpServer;
}
