import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMetricsSchema, insertDocumentationRequestSchema, insertPayerBehaviorSchema, insertRedundancyMatrixSchema, insertPredictiveAnalyticsSchema, insertDenialPredictionsSchema, insertRiskFactorsSchema } from "@shared/schema";
import { predictDenialRisk, generateSmartRecommendations, analyzeDenialPatterns } from "./openai";

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

  // Predictive Analytics routes
  app.get("/api/predictive-analytics", async (req, res) => {
    try {
      const analytics = await storage.getPredictiveAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictive analytics" });
    }
  });

  app.post("/api/predictive-analytics", async (req, res) => {
    try {
      const validatedData = insertPredictiveAnalyticsSchema.parse(req.body);
      const analytics = await storage.createPredictiveAnalytics(validatedData);
      res.json(analytics);
    } catch (error) {
      res.status(400).json({ message: "Invalid predictive analytics data" });
    }
  });

  // Denial Predictions routes
  app.get("/api/denial-predictions", async (req, res) => {
    try {
      const predictions = await storage.getDenialPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch denial predictions" });
    }
  });

  app.post("/api/denial-predictions", async (req, res) => {
    try {
      const validatedData = insertDenialPredictionsSchema.parse(req.body);
      const predictions = await storage.createDenialPredictions(validatedData);
      res.json(predictions);
    } catch (error) {
      res.status(400).json({ message: "Invalid denial predictions data" });
    }
  });

  // Risk Factors routes
  app.get("/api/risk-factors", async (req, res) => {
    try {
      const factors = await storage.getRiskFactors();
      res.json(factors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk factors" });
    }
  });

  app.post("/api/risk-factors", async (req, res) => {
    try {
      const validatedData = insertRiskFactorsSchema.parse(req.body);
      const factors = await storage.createRiskFactors(validatedData);
      res.json(factors);
    } catch (error) {
      res.status(400).json({ message: "Invalid risk factors data" });
    }
  });

  // AI-powered routes
  app.post("/api/ai/predict-denial-risk", async (req, res) => {
    try {
      const prediction = await predictDenialRisk(req.body);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to predict denial risk", error: (error as Error).message });
    }
  });

  app.post("/api/ai/generate-recommendations", async (req, res) => {
    try {
      const recommendations = await generateSmartRecommendations(req.body);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations", error: (error as Error).message });
    }
  });

  app.post("/api/ai/analyze-patterns", async (req, res) => {
    try {
      const analysis = await analyzeDenialPatterns(req.body.denialData);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze patterns", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
