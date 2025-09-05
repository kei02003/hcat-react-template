import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const aiRecommendations = [
  {
    id: 1,
    type: "urgent",
    priority: "High",
    title: "BCBS Pattern Detection",
    description: "AI detected BCBS requesting 73% redundant operative reports. Implement auto-challenge system.",
    impact: "$45,100",
    confidence: 94.2,
    actions: [
      "Enable auto-challenge for BCBS operative report requests",
      "Create template response citing previous submissions",
      "Schedule meeting with BCBS to address pattern"
    ],
    timeframe: "Implement within 2 days",
    category: "Automation Opportunity"
  },
  {
    id: 2,
    type: "optimization",
    priority: "Medium",
    title: "Orthopedic Documentation Enhancement",
    description: "Claims from orthopedics have 3x higher denial rates. Recommend proactive documentation checklist.",
    impact: "$28,400",
    confidence: 87.6,
    actions: [
      "Create orthopedic-specific documentation checklist",
      "Train staff on common denial triggers",
      "Implement pre-submission review process"
    ],
    timeframe: "Deploy within 1 week",
    category: "Process Improvement"
  },
  {
    id: 3,
    type: "prediction",
    priority: "High",
    title: "Timely Filing Risk Alert",
    description: "ML model predicts 15 claims totaling $38.2K will exceed filing deadlines within 30 days.",
    impact: "$38,200",
    confidence: 91.8,
    actions: [
      "Prioritize the 15 identified claims for immediate filing",
      "Set up automated alerts for claims approaching deadlines",
      "Review current filing workflow for bottlenecks"
    ],
    timeframe: "Action required within 48 hours",
    category: "Risk Mitigation"
  },
  {
    id: 4,
    type: "insight",
    priority: "Medium",
    title: "Seasonal Pattern Recognition",
    description: "AI identified 45% spike in documentation requests during month-end. Suggest resource reallocation.",
    impact: "$15,600",
    confidence: 83.4,
    actions: [
      "Adjust staffing levels for month-end periods",
      "Pre-process predictable documentation needs",
      "Create month-end preparation checklist"
    ],
    timeframe: "Plan for next month-end cycle",
    category: "Resource Optimization"
  }
];

const smartActions = [
  {
    action: "Auto-Respond to Redundant Requests",
    description: "Automatically challenge 89 identified redundant requests",
    savings: "$67,800",
    timeToImplement: "1 day",
    riskLevel: "Low",
    aiConfidence: 96.3
  },
  {
    action: "Proactive Documentation Attachment",
    description: "Pre-attach high-risk documents based on procedure patterns",
    savings: "$124,500",
    timeToImplement: "2 weeks",
    riskLevel: "Medium",
    aiConfidence: 84.7
  },
  {
    action: "Dynamic Filing Prioritization",
    description: "AI-powered queue management based on denial risk scores",
    savings: "$89,200",
    timeToImplement: "1 week",
    riskLevel: "Low",
    aiConfidence: 92.1
  }
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 border-red-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}


function getRiskColor(risk: string) {
  switch (risk) {
    case "Low": return "text-green-600";
    case "Medium": return "text-yellow-600";
    case "High": return "text-red-600";
    default: return "text-gray-600";
  }
}

export function AIRecommendations() {
  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card className="healthcare-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              4 New Insights
            </Badge>
          </div>
          
          <div className="space-y-4">
            {aiRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
                data-testid={`ai-recommendation-${recommendation.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600">{recommendation.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(recommendation.priority)} border`}>
                      {recommendation.priority} Priority
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ${recommendation.impact.toLocaleString()} Impact
                      </p>
                      <p className="text-xs text-gray-500">
                        {recommendation.confidence}% Confidence
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{recommendation.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recommendation.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {recommendation.timeframe}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid={`button-dismiss-${recommendation.id}`}>
                        Dismiss
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid={`button-implement-${recommendation.id}`}>
                        Implement
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Actions */}
      <Card className="healthcare-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Actions Available</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                Total Potential Savings: $281,500
              </p>
              <p className="text-xs text-gray-500">
                Based on AI analysis
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smartActions.map((action, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                data-testid={`smart-action-${index}`}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{action.action}</h4>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Savings:</span>
                    <span className="font-medium text-green-600">{action.savings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Implementation:</span>
                    <span className="font-medium">{action.timeToImplement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`font-medium ${getRiskColor(action.riskLevel)}`}>
                      {action.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-medium">{action.aiConfidence}%</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" 
                  size="sm"
                  data-testid={`button-activate-${index}`}
                >
                  Activate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}