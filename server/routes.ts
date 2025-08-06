import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMetricsSchema, insertDocumentationRequestSchema, insertPayerBehaviorSchema, insertRedundancyMatrixSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const validatedData = insertMetricsSchema.parse(req.body);
      const metric = await storage.createMetric(validatedData);
      res.json(metric);
    } catch (error) {
      res.status(400).json({ message: "Invalid metric data" });
    }
  });

  // Documentation requests routes
  app.get("/api/documentation-requests", async (req, res) => {
    try {
      const requests = await storage.getDocumentationRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documentation requests" });
    }
  });

  app.post("/api/documentation-requests", async (req, res) => {
    try {
      const validatedData = insertDocumentationRequestSchema.parse(req.body);
      const request = await storage.createDocumentationRequest(validatedData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid documentation request data" });
    }
  });

  // Payer behavior routes
  app.get("/api/payer-behavior", async (req, res) => {
    try {
      const behavior = await storage.getPayerBehavior();
      res.json(behavior);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payer behavior data" });
    }
  });

  app.post("/api/payer-behavior", async (req, res) => {
    try {
      const validatedData = insertPayerBehaviorSchema.parse(req.body);
      const behavior = await storage.createPayerBehavior(validatedData);
      res.json(behavior);
    } catch (error) {
      res.status(400).json({ message: "Invalid payer behavior data" });
    }
  });

  // Redundancy matrix routes
  app.get("/api/redundancy-matrix", async (req, res) => {
    try {
      const matrix = await storage.getRedundancyMatrix();
      res.json(matrix);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch redundancy matrix data" });
    }
  });

  app.post("/api/redundancy-matrix", async (req, res) => {
    try {
      const validatedData = insertRedundancyMatrixSchema.parse(req.body);
      const matrix = await storage.createRedundancyMatrix(validatedData);
      res.json(matrix);
    } catch (error) {
      res.status(400).json({ message: "Invalid redundancy matrix data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
