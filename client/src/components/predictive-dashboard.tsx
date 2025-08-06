import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, AlertCircle, TrendingUp, Shield, Zap } from "lucide-react";
import { PredictiveRiskChart } from "./charts/predictive-risk-chart";
import { DenialForecastChart } from "./charts/denial-forecast-chart";
import { AIRecommendations } from "./ai-recommendations";

const highRiskClaims = [
  {
    id: "CLM-45825",
    patient: "Brown, Michael",
    payer: "BCBS",
    procedure: "29827 - Arthroscopy",
    amount: "$18,500",
    riskScore: 87.4,
    level: "critical",
    reasons: ["Missing operative report", "Insufficient documentation"],
    actions: ["Attach operative report", "Include surgeon notes", "Submit prior auth"]
  },
  {
    id: "CLM-45828",
    patient: "Wilson, Karen",
    payer: "BCBS", 
    procedure: "47562 - Laparoscopy",
    amount: "$12,750",
    riskScore: 73.2,
    level: "high",
    reasons: ["Prior auth incomplete", "Documentation gaps"],
    actions: ["Complete prior auth", "Add pathology report"]
  },
  {
    id: "CLM-45826",
    patient: "Taylor, Lisa",
    payer: "Medicare",
    procedure: "93306 - Echo",
    amount: "$3,250", 
    riskScore: 52.3,
    level: "medium",
    reasons: ["Timely filing risk"],
    actions: ["File within 3 days", "Include ECG results"]
  }
];

const riskFactors = [
  {
    factor: "BCBS Operative Reports",
    category: "Payer Pattern",
    weight: 85.3,
    description: "73% redundant request rate for operative reports",
    impact: "High"
  },
  {
    factor: "Orthopedic Procedures",
    category: "Procedure Risk",
    weight: 78.2,
    description: "3x higher documentation request rate",
    impact: "High"
  },
  {
    factor: "Missing Prior Auth",
    category: "Documentation",
    weight: 92.1,
    description: "92% denial rate without authorization",
    impact: "Critical"
  },
  {
    factor: "End of Month Filing",
    category: "Timing",
    weight: 65.4,
    description: "Higher denial rates in last week",
    impact: "Medium"
  }
];

function getRiskBadgeColor(level: string) {
  switch (level) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getImpactColor(impact: string) {
  switch (impact) {
    case "Critical": return "text-red-600";
    case "High": return "text-orange-600";
    case "Medium": return "text-yellow-600";
    default: return "text-gray-600";
  }
}

export function PredictiveDashboard() {
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Advanced Predictive Analytics & Denial Prevention
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-run-analysis">
              <Zap className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
            <Button variant="outline" data-testid="button-export-predictions">
              <Target className="h-4 w-4 mr-2" />
              Export Predictions
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="healthcare-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Predicted Denials</p>
                  <p className="text-2xl font-bold text-red-600">23</p>
                  <p className="text-xs text-gray-500">Next 7 days</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="healthcare-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At-Risk Amount</p>
                  <p className="text-2xl font-bold text-orange-600">$145.6K</p>
                  <p className="text-xs text-gray-500">82.3% confidence</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="healthcare-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prevention Score</p>
                  <p className="text-2xl font-bold text-green-600">78%</p>
                  <p className="text-xs text-gray-500">Preventable denials</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="healthcare-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Model Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">89.2%</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Analysis Chart */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Predictive Risk Analysis - Claims by Amount & Risk Score
            </h3>
            <PredictiveRiskChart />
          </CardContent>
        </Card>

        {/* Denial Forecast */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Denial Forecast & Department Trends
            </h3>
            <DenialForecastChart />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High Risk Claims */}
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                High Risk Claims Requiring Immediate Action
              </h3>
              <div className="space-y-4">
                {highRiskClaims.map((claim, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`high-risk-claim-${claim.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{claim.id}</span>
                          <Badge className={`${getRiskBadgeColor(claim.level)} border`}>
                            {claim.level.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700">
                            {claim.riskScore}% Risk
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{claim.patient}</p>
                        <p className="text-sm text-gray-600">{claim.procedure}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{claim.amount}</p>
                        <p className="text-sm text-gray-600">{claim.payer}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Predicted Denial Reasons:</p>
                        <div className="flex flex-wrap gap-1">
                          {claim.reasons.map((reason, idx) => (
                            <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {claim.actions.map((action, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" data-testid={`button-review-${claim.id}`}>
                        Review Claim
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" data-testid={`button-auto-fix-${claim.id}`}>
                        Auto-Fix Issues
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Risk Factors & Patterns
              </h3>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                    data-testid={`risk-factor-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{factor.factor}</p>
                        <p className="text-sm text-gray-600">{factor.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{factor.weight}%</p>
                        <p className={`text-sm font-medium ${getImpactColor(factor.impact)}`}>
                          {factor.impact}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                    
                    {/* Weight Bar */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.weight >= 80 ? 'bg-red-500' : 
                            factor.weight >= 60 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations />
      </div>
    </main>
  );
}