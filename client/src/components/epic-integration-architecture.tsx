import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeftRight,
  Database, 
  Server, 
  Shield, 
  Clock, 
  Users, 
  FileText,
  Activity,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Network,
  Eye,
  UserCheck
} from "lucide-react";

interface IntegrationPoint {
  id: string;
  name: string;
  type: "api" | "feed" | "sync" | "auth";
  direction: "inbound" | "outbound" | "bidirectional";
  frequency: string;
  security: string;
  description: string;
}

const integrationPoints: IntegrationPoint[] = [
  {
    id: "patient_data",
    name: "Patient Demographics & Registration",
    type: "api",
    direction: "inbound",
    frequency: "Real-time",
    security: "TLS 1.3 + OAuth 2.0",
    description: "Patient demographics, insurance information, and registration data"
  },
  {
    id: "clinical_data",
    name: "Clinical Documentation",
    type: "feed",
    direction: "inbound",
    frequency: "15 minutes",
    security: "FHIR R4 + SMART on FHIR",
    description: "Diagnoses, procedures, clinical notes, and lab results"
  },
  {
    id: "billing_claims",
    name: "Claims & Billing Data",
    type: "sync",
    direction: "bidirectional",
    frequency: "5 minutes",
    security: "X12 EDI + PKI Encryption",
    description: "Claims submission, status updates, and billing reconciliation"
  },
  {
    id: "pre_auth",
    name: "Prior Authorization Requests",
    type: "api",
    direction: "outbound",
    frequency: "Real-time",
    security: "HTTPS + Digital Signatures",
    description: "Pre-authorization requests and status tracking"
  },
  {
    id: "user_activity",
    name: "User Action Tracking",
    type: "sync",
    direction: "outbound",
    frequency: "Real-time",
    security: "Audit Logs + HIPAA Compliant",
    description: "User actions, workflow completions, and system interactions"
  },
  {
    id: "financial_data",
    name: "Financial & AR Data",
    type: "feed",
    direction: "inbound",
    frequency: "30 minutes",
    security: "Encrypted Data Lakes",
    description: "Accounts receivable, payments, and financial reporting data"
  }
];

const complianceIndicators = [
  { name: "HIPAA Compliance", status: "active", icon: Shield },
  { name: "SOC 2 Type II", status: "certified", icon: CheckCircle2 },
  { name: "Data Encryption", status: "enforced", icon: Lock },
  { name: "Audit Logging", status: "enabled", icon: FileText },
  { name: "Access Controls", status: "role-based", icon: UserCheck },
  { name: "Data Retention", status: "7-year policy", icon: Database }
];

export function EpicIntegrationArchitecture() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Epic Integration Architecture</h1>
            <p className="text-gray-600 mt-2">Healthcare Revenue Cycle Management System Integration Overview</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            data-testid="button-back-to-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Architecture Overview Diagram */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-6 w-6 text-blue-600" />
              <span>System Architecture Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8 p-6">
              {/* Epic EMR */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-24 bg-purple-100 border-2 border-purple-300 rounded-lg flex flex-col items-center justify-center">
                  <Database className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="font-semibold text-purple-900">Epic EMR</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Source System</Badge>
              </div>

              {/* Integration Layer */}
              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="h-8 w-8 text-gray-400 transform rotate-0 lg:rotate-0" />
                <div className="w-40 h-32 bg-blue-100 border-2 border-blue-300 rounded-lg flex flex-col items-center justify-center p-4">
                  <Server className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="font-semibold text-blue-900 text-center">Integration Platform</span>
                  <span className="text-xs text-blue-700 text-center mt-1">FHIR R4, HL7, X12 EDI</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Middleware</Badge>
              </div>

              <ArrowRight className="h-8 w-8 text-gray-400" />

              {/* Revenue Cycle Application */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-40 h-32 bg-green-100 border-2 border-green-300 rounded-lg flex flex-col items-center justify-center p-4">
                  <Activity className="h-8 w-8 text-green-600 mb-2" />
                  <span className="font-semibold text-green-900 text-center">RCM Dashboard</span>
                  <span className="text-xs text-green-700 text-center mt-1">Analytics & Workflows</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Target Application</Badge>
              </div>

              <ArrowLeftRight className="h-8 w-8 text-gray-400" />

              {/* External Systems */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-24 bg-orange-100 border-2 border-orange-300 rounded-lg flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="font-semibold text-orange-900 text-center text-sm">Payers & Clearinghouses</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">External APIs</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Points */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle>API Connection Points & Data Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrationPoints.map((point) => (
                <div 
                  key={point.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {point.type === "api" && <Network className="h-5 w-5 text-blue-500" />}
                      {point.type === "feed" && <Database className="h-5 w-5 text-green-500" />}
                      {point.type === "sync" && <RefreshCw className="h-5 w-5 text-orange-500" />}
                      {point.type === "auth" && <Shield className="h-5 w-5 text-purple-500" />}
                      <span className="font-semibold text-sm">{point.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        point.direction === "inbound" ? "border-green-300 text-green-700" :
                        point.direction === "outbound" ? "border-blue-300 text-blue-700" :
                        "border-purple-300 text-purple-700"
                      }`}
                    >
                      {point.direction}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{point.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium">{point.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Security:</span>
                      <span className="font-medium text-green-700">{point.security}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Flow & Processing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <span>Data Refresh Intervals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Real-time Data</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Patient Demographics, Pre-auth</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">5-minute intervals</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Claims & Billing</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">15-minute intervals</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Clinical Documentation</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">30-minute intervals</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Financial & AR Data</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span>User Action Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 border-l-4 border-blue-400 bg-blue-50">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Workflow Completions</div>
                    <div className="text-gray-600">Pre-auth submissions, appeal approvals</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border-l-4 border-green-400 bg-green-50">
                  <Activity className="h-4 w-4 text-green-600" />
                  <div className="text-sm">
                    <div className="font-medium">System Interactions</div>
                    <div className="text-gray-600">Dashboard views, report generation</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border-l-4 border-purple-400 bg-purple-50">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div className="text-sm">
                    <div className="font-medium">Documentation Updates</div>
                    <div className="text-gray-600">Clinical notes, status changes</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border-l-4 border-red-400 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div className="text-sm">
                    <div className="font-medium">Security Events</div>
                    <div className="text-gray-600">Failed logins, permission changes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & HIPAA Compliance */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Security & HIPAA Compliance Indicators</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complianceIndicators.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                  <div key={index} className="flex flex-col items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Icon className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-center">{indicator.name}</span>
                    <Badge className="bg-green-100 text-green-800 text-xs mt-2">
                      {indicator.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-2">Compliance Summary</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• End-to-end encryption for all PHI data transmission</li>
                    <li>• Role-based access controls with audit logging</li>
                    <li>• Automated data retention and purging policies</li>
                    <li>• Real-time monitoring and breach detection</li>
                    <li>• Regular security assessments and penetration testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}