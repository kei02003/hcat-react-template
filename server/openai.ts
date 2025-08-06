import OpenAI from "openai";

/*
Follow these instructions when using this blueprint:
1. Note that the newest OpenAI model is "gpt-4o", not "gpt-4". gpt-4o was released after your knowledge cutoff. Always prefer using gpt-4o as it is the latest model. When copying code from this blueprint, ensure you also mention this information verbatim as a comment so that you don't revert it to "gpt-4": `// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user`
2. Use the response_format: { type: "json_object" } option
3. Request output in JSON format in the prompt
*/

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DenialPredictionRequest {
  claimData: {
    id: string;
    patientName: string;
    payer: string;
    procedureCode: string;
    department: string;
    amount: number;
    documentationType: string;
    historicalDenials?: any[];
  };
}

export interface DenialPredictionResponse {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedDenialReasons: string[];
  recommendedActions: string[];
  confidence: number;
}

export interface SmartRecommendationRequest {
  systemData: {
    recentDenials: any[];
    documentationRequests: any[];
    payerBehavior: any[];
    redundancyMatrix: any[];
  };
}

export interface SmartRecommendationResponse {
  recommendations: {
    type: 'urgent' | 'optimization' | 'prediction' | 'insight';
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    impact: string;
    confidence: number;
    actions: string[];
    timeframe: string;
    category: string;
  }[];
}

export async function predictDenialRisk(request: DenialPredictionRequest): Promise<DenialPredictionResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert healthcare revenue cycle analyst. Analyze the provided claim data and predict denial risk based on healthcare industry patterns, payer behaviors, and documentation requirements. 

          Consider these factors:
          - Payer-specific denial patterns (BCBS often requests operative reports, Medicare has strict timely filing)
          - Procedure complexity and documentation requirements
          - Department-specific risk factors
          - Historical patterns and seasonal variations
          
          Respond with JSON in this exact format: {
            "riskScore": number (0-100),
            "riskLevel": "low" | "medium" | "high" | "critical",
            "predictedDenialReasons": [array of specific reasons],
            "recommendedActions": [array of specific actions],
            "confidence": number (0-100)
          }`
        },
        {
          role: "user",
          content: JSON.stringify(request.claimData)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      riskScore: Math.max(0, Math.min(100, result.riskScore || 0)),
      riskLevel: result.riskLevel || 'low',
      predictedDenialReasons: result.predictedDenialReasons || [],
      recommendedActions: result.recommendedActions || [],
      confidence: Math.max(0, Math.min(100, result.confidence || 0)),
    };
  } catch (error) {
    console.error('Error predicting denial risk:', error);
    throw new Error('Failed to predict denial risk: ' + (error as Error).message);
  }
}

export async function generateSmartRecommendations(request: SmartRecommendationRequest): Promise<SmartRecommendationResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert healthcare revenue cycle management consultant with deep knowledge of denial patterns, payer behaviors, and process optimization. 

          Analyze the provided system data to identify actionable insights and recommendations that can:
          1. Reduce denial rates
          2. Improve documentation processes
          3. Optimize payer interactions
          4. Identify automation opportunities
          5. Predict future issues

          Focus on:
          - Redundant documentation request patterns
          - Payer-specific behaviors and requirements
          - Department-specific risk factors
          - Timely filing risks
          - Process inefficiencies
          - Revenue impact calculations

          Respond with JSON in this exact format: {
            "recommendations": [
              {
                "type": "urgent" | "optimization" | "prediction" | "insight",
                "priority": "High" | "Medium" | "Low",
                "title": "Brief descriptive title",
                "description": "Detailed explanation of the finding",
                "impact": "Dollar amount as string (e.g., '$45,100')",
                "confidence": number (0-100),
                "actions": [array of specific actionable steps],
                "timeframe": "Implementation timeline",
                "category": "Category name"
              }
            ]
          }`
        },
        {
          role: "user",
          content: JSON.stringify(request.systemData)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error('Error generating smart recommendations:', error);
    throw new Error('Failed to generate recommendations: ' + (error as Error).message);
  }
}

export async function analyzeDenialPatterns(denialData: any[]): Promise<{
  patterns: string[];
  insights: string[];
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a healthcare data analyst specializing in denial pattern recognition. Analyze the denial data to identify:
          1. Common denial patterns and trends
          2. Root cause analysis
          3. Actionable insights for prevention
          
          Focus on statistical patterns, seasonal variations, and systemic issues.
          
          Respond with JSON: {
            "patterns": [array of identified patterns],
            "insights": [array of analytical insights],
            "suggestions": [array of improvement suggestions]
          }`
        },
        {
          role: "user",
          content: JSON.stringify(denialData)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      patterns: result.patterns || [],
      insights: result.insights || [],
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Error analyzing denial patterns:', error);
    throw new Error('Failed to analyze patterns: ' + (error as Error).message);
  }
}