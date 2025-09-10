import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileText, User, DollarSign, Calendar, Building, Stethoscope, CheckCircle, Download, RefreshCw, ExternalLink } from "lucide-react";

interface PatientAppealModalProps {
  denial: {
    denialId: string;
    claimId: string;
    patientName: string;
    payerName: string;
    denialReason: string;
    deniedAmount: number;
    category: string;
    department: string;
    provider: string;
    serviceDate: string;
    denialDate: string;
    appealDeadline: string;
    daysToAppeal: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface ClinicalEvidence {
  vitalSigns?: {
    findings: string[];
    supportingDocumentation: string;
  };
  labResults?: {
    findings: string[];
    supportingDocumentation: string;
  };
  medications?: {
    findings: string[];
    supportingDocumentation: string;
  };
  imaging?: {
    findings: string[];
    supportingDocumentation: string;
  };
  respiratorySupport?: {
    findings: string[];
    supportingDocumentation: string;
  };
}

interface AppealData {
  challengeLetter: string;
  clinicalEvidence: ClinicalEvidence;
  appealProbability: number;
  appealStrength: {
    strongPoints: string[];
    medicalJustification: string;
    regulatorySupport: string;
  };
}

export function PatientAppealModal({
  denial,
  isOpen,
  onClose,
}: PatientAppealModalProps) {
  const [activeTab, setActiveTab] = useState("generate");
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("standard");

  // Fetch or generate appeal data for this specific patient/claim
  const {
    data: appealData,
    isLoading,
    refetch,
  } = useQuery<AppealData>({
    queryKey: ["/api/challenge-letters", denial.denialId],
    enabled: isOpen,
  });

  const generateAppeal = useMutation({
    mutationFn: async (data: {
      denialId: string;
      notes?: string;
      urgency?: string;
    }) => {
      return apiRequest("POST", `/api/challenge-letters/generate`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/challenge-letters", denial.denialId],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appeal-cases"] });
    },
  });

  const submitAppeal = useMutation({
    mutationFn: async (data: { denialId: string; challengeLetter: string }) => {
      return apiRequest("POST", `/api/appeals/submit`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appeal-cases"] });
      onClose();
    },
  });

  const handleGenerateAppeal = async () => {
    setIsGenerating(true);
    try {
      await generateAppeal.mutateAsync({
        denialId: denial.denialId,
        notes: additionalNotes,
        urgency: urgencyLevel,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return "text-green-600 bg-green-100";
    if (probability >= 80) return "text-blue-600 bg-blue-100";
    if (probability >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getDaysToAppealColor = (days: number) => {
    if (days <= 14) return "text-red-600 font-semibold";
    if (days <= 30) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Appeal Generation - {denial.denialId}</span>
            <Badge className="ml-2 bg-purple-100 text-purple-800">
              {denial.patientName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Denial Context Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Denial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-semibold">
                      ${denial.deniedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Days to Appeal:</span>
                    <p
                      className={`font-semibold ${getDaysToAppealColor(denial.daysToAppeal)}`}
                    >
                      {denial.daysToAppeal} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Payer:</span>
                    <p className="font-semibold">{denial.payerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <p className="font-semibold">{denial.department}</p>
                  </div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Denial Reason:</span>
                  <p className="font-medium text-red-600">
                    {denial.denialReason}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Provider:</span>
                  <p className="font-medium">{denial.provider}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tab Interface */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="generate"
                className="flex items-center space-x-2"
              >
                <span>Generate Appeal</span>
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="flex items-center space-x-2"
                disabled={!appealData}
              >
                <FileText className="h-4 w-4" />
                <span>Review Letter</span>
              </TabsTrigger>
              <TabsTrigger
                value="evidence"
                className="flex items-center space-x-2"
                disabled={!appealData}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Clinical Evidence</span>
              </TabsTrigger>
            </TabsList>

            {/* Generate Appeal Tab */}
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    
                    <span>Appeal Generation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Appeal Urgency
                      </label>
                      <Select
                        value={urgencyLevel}
                        onValueChange={setUrgencyLevel}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">
                            Urgent (&lt; 15 days)
                          </SelectItem>
                          <SelectItem value="standard">
                            Standard (15-30 days)
                          </SelectItem>
                          <SelectItem value="routine">
                            Routine (&gt; 30 days)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Clinical Notes (Optional)
                      </label>
                      <Textarea
                        placeholder="Enter any additional clinical context, specific medical justifications, or special circumstances that should be included in the appeal letter..."
                        value={additionalNotes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setAdditionalNotes(e.target.value)
                        }
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleGenerateAppeal}
                      disabled={isGenerating || generateAppeal.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isGenerating || generateAppeal.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating Appeal...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate AI Appeal Letter
                        </>
                      )}
                    </Button>

                    {appealData && (
                      <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    )}
                  </div>

                  {appealData && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Appeal Generated Successfully
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(appealData.appealProbability)}`}
                        >
                          Success Probability: {appealData.appealProbability}%
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveTab("review")}
                          className="text-green-700 border-green-300 hover:bg-green-100"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Review Letter
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review Letter Tab */}
            <TabsContent value="review" className="space-y-4">
              {appealData && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      
                      <span>Challenge Letter</span>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${getProbabilityColor(appealData.appealProbability)}`}
                      >
                        {appealData.appealProbability}% Success Rate
                      </div>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          submitAppeal.mutate({
                            denialId: denial.denialId,
                            challengeLetter: appealData.challengeLetter,
                          })
                        }
                        disabled={submitAppeal.isPending}
                      >
                        {submitAppeal.isPending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-1" />
                            Submit Appeal
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {appealData.challengeLetter}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Clinical Evidence Tab */}
            <TabsContent value="evidence" className="space-y-4">
              {appealData?.clinicalEvidence && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(appealData.clinicalEvidence).map(
                    ([key, evidence]) => (
                      <Card key={key}>
                        <CardHeader>
                          <CardTitle className="text-base capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-1">
                                Key Findings:
                              </h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {evidence.findings?.map(
                                  (finding: string, index: number) => (
                                    <li key={index} className="text-gray-600">
                                      {finding}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-1">
                                Documentation:
                              </h4>
                              <p className="text-sm text-gray-600">
                                {evidence.supportingDocumentation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
