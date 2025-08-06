import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, XCircle, Clock, Search, FileText, Activity, Heart, TrendingUp, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ClinicalDecision {
  id: string;
  patientName: string;
  patientId: string;
  admissionId: string;
  currentStatus: "inpatient" | "observation" | "outpatient" | "emergency";
  denialReason: string;
  payer: string;
  payerId: string;
  department: string;
  clinicalIndicators: {
    vitalSigns: {
      systolicBP: number;
      diastolicBP: number;
      heartRate: number;
      respiratoryRate: number;
      oxygenSaturation: number;
      temperature: number;
    };
    labResults: {
      troponinI: number;
      bnp: number;
      creatinine: number;
      sodium: number;
      hemoglobin: number;
    };
    physicianNotes: string[];
    symptoms: string[];
    medications: string[];
  };
  insurerCriteria: {
    inpatientRequirements: string[];
    observationCriteria: string[];
    exclusionFactors: string[];
  };
  recommendedStatus: "inpatient" | "observation" | "outpatient";
  confidenceScore: number;
  complianceScore: number;
  aiRecommendations: string[];
  reviewStatus: "pending" | "approved" | "needs_revision" | "escalated";
  createdAt: string;
  updatedAt: string;
}

export function ClinicalDecisionDashboard() {
  const [selectedTab, setSelectedTab] = useState("screening");
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // Fetch clinical decision cases
  const { data: clinicalCases = [], isLoading } = useQuery<ClinicalDecision[]>({
    queryKey: ["/api/clinical-decisions"]
  });

  const filteredCases = clinicalCases.filter(case_ =>
    case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.denialReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "inpatient": "bg-red-100 text-red-800",
      "observation": "bg-yellow-100 text-yellow-800",
      "outpatient": "bg-green-100 text-green-800",
      "emergency": "bg-purple-100 text-purple-800"
    };
    return <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>;
  };

  const getReviewStatusBadge = (status: string) => {
    const statusInfo = {
      "pending": { color: "bg-blue-100 text-blue-800", icon: Clock },
      "approved": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "needs_revision": { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      "escalated": { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    const info = statusInfo[status as keyof typeof statusInfo];
    const Icon = info.icon;
    return (
      <Badge className={info.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const selectedCaseData = clinicalCases.find(c => c.id === selectedCase);

  // Calculate metrics
  const totalCases = clinicalCases.length;
  const pendingReview = clinicalCases.filter(c => c.reviewStatus === "pending").length;
  const highConfidence = clinicalCases.filter(c => c.confidenceScore >= 90).length;
  const complianceRate = clinicalCases.length > 0 ? 
    ((clinicalCases.filter(c => c.complianceScore >= 95).length / clinicalCases.length) * 100).toFixed(1) : "0";

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading clinical decision data...</div>;
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Decision Support</h1>
        <div className="text-sm text-gray-600">
          Target: 95% compliance accuracy for patient status determinations
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReview}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Confidence</p>
                <p className="text-2xl font-bold text-green-600">{highConfidence}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{complianceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screening" data-testid="tab-screening">Denial Screening</TabsTrigger>
          <TabsTrigger value="analysis" data-testid="tab-analysis">Medical Record Analysis</TabsTrigger>
          <TabsTrigger value="recommendations" data-testid="tab-recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="screening" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Denied Claims Screening</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient, denial reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="input-search-cases"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCases.map((case_) => (
                  <div 
                    key={case_.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCase(case_.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          <h3 className="font-semibold text-gray-900">{case_.patientName}</h3>
                          {getStatusBadge(case_.currentStatus)}
                          {getReviewStatusBadge(case_.reviewStatus)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Denial Reason</p>
                            <p className="font-medium text-red-700">{case_.denialReason}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Payer</p>
                            <p className="font-medium">{case_.payer}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Department</p>
                            <p className="font-medium">{case_.department}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Recommended Status</p>
                            <p className="font-medium text-blue-700">{case_.recommendedStatus}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Confidence Score</p>
                            <p className={`font-bold text-lg ${getConfidenceColor(case_.confidenceScore)}`}>
                              {case_.confidenceScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Compliance Score</p>
                            <p className={`font-bold text-lg ${getConfidenceColor(case_.complianceScore)}`}>
                              {case_.complianceScore}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {selectedCaseData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Medical Record Analysis - {selectedCaseData.patientName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vital Signs */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Vital Signs</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Blood Pressure:</span>
                            <span className="ml-2 font-medium">
                              {selectedCaseData.clinicalIndicators.vitalSigns.systolicBP}/
                              {selectedCaseData.clinicalIndicators.vitalSigns.diastolicBP} mmHg
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Heart Rate:</span>
                            <span className="ml-2 font-medium">
                              {selectedCaseData.clinicalIndicators.vitalSigns.heartRate} bpm
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Respiratory Rate:</span>
                            <span className="ml-2 font-medium">
                              {selectedCaseData.clinicalIndicators.vitalSigns.respiratoryRate} /min
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">O2 Saturation:</span>
                            <span className="ml-2 font-medium">
                              {selectedCaseData.clinicalIndicators.vitalSigns.oxygenSaturation}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Temperature:</span>
                            <span className="ml-2 font-medium">
                              {selectedCaseData.clinicalIndicators.vitalSigns.temperature}°F
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lab Results */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Laboratory Results</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Troponin I:</span>
                            <span className="font-medium">
                              {selectedCaseData.clinicalIndicators.labResults.troponinI} ng/mL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">BNP:</span>
                            <span className="font-medium">
                              {selectedCaseData.clinicalIndicators.labResults.bnp} pg/mL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Creatinine:</span>
                            <span className="font-medium">
                              {selectedCaseData.clinicalIndicators.labResults.creatinine} mg/dL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sodium:</span>
                            <span className="font-medium">
                              {selectedCaseData.clinicalIndicators.labResults.sodium} mEq/L
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hemoglobin:</span>
                            <span className="font-medium">
                              {selectedCaseData.clinicalIndicators.labResults.hemoglobin} g/dL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Information */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Physician Notes</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        {selectedCaseData.clinicalIndicators.physicianNotes.map((note, idx) => (
                          <p key={idx} className="text-sm text-gray-700 mb-2 last:mb-0">
                            • {note}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Presenting Symptoms</h3>
                        <div className="space-y-1">
                          {selectedCaseData.clinicalIndicators.symptoms.map((symptom, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {symptom}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Current Medications</h3>
                        <div className="space-y-1">
                          {selectedCaseData.clinicalIndicators.medications.map((med, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                              {med}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurer Criteria Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span>Insurer Criteria Analysis - {selectedCaseData.payer}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Inpatient Requirements</h3>
                      <div className="space-y-2">
                        {selectedCaseData.insurerCriteria.inpatientRequirements.map((req, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Observation Criteria</h3>
                      <div className="space-y-2">
                        {selectedCaseData.insurerCriteria.observationCriteria.map((criteria, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Exclusion Factors</h3>
                      <div className="space-y-2">
                        {selectedCaseData.insurerCriteria.exclusionFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Case for Analysis</h3>
                <p className="text-gray-600">
                  Choose a denied claim from the screening tab to view detailed medical record analysis
                  and insurer criteria comparison.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {selectedCaseData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span>AI-Powered Clinical Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Status Recommendation */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Recommended Patient Status</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Current:</span>
                        {getStatusBadge(selectedCaseData.currentStatus)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Recommended:</span>
                        {getStatusBadge(selectedCaseData.recommendedStatus)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Confidence:</span>
                        <span className={`font-bold ${getConfidenceColor(selectedCaseData.confidenceScore)}`}>
                          {selectedCaseData.confidenceScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Clinical Decision Support Recommendations</h3>
                    <div className="space-y-3">
                      {selectedCaseData.aiRecommendations.map((recommendation, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-approve-recommendation"
                    >
                      Approve Recommendation
                    </Button>
                    <Button 
                      variant="outline"
                      data-testid="button-request-peer-review"
                    >
                      Request Peer Review
                    </Button>
                    <Button 
                      variant="outline"
                      data-testid="button-escalate-case"
                    >
                      Escalate to Clinical Director
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Recommendations Available</h3>
                <p className="text-gray-600">
                  Select a case from the screening tab to view AI-powered clinical decision support
                  recommendations and status change suggestions.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}