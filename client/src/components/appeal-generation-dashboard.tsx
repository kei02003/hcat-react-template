import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, TrendingUp, FileText, Clock, CheckCircle, Target, Stethoscope, Activity, TestTube, Pill } from "lucide-react";

interface AppealCase {
  id: string;
  patientName: string;
  patientId: string;
  payer: string;
  denialReason: string;
  denialAmount: string;
  appealProbability: number;
  department: string;
  attendingPhysician: string;
  clinicalEvidence: {
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
  };
  appealStrength: {
    strongPoints: string[];
    medicalJustification: string;
    regulatorySupport: string;
  };
  status: string;
  createdAt: string;
}

interface ChallengeLetterResponse {
  appealCase: AppealCase;
  challengeLetter: string;
  clinicalEvidence: any;
  appealProbability: number;
}

export function AppealGenerationDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppeal, setSelectedAppeal] = useState<string | null>(null);

  // Fetch high-probability appeal cases
  const { data: appealCases = [], isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/appeal-cases"],
  });

  // Fetch performance metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/appeal-metrics"],
  });

  // Fetch challenge letter for selected appeal
  const { data: challengeLetterData, isLoading: isLoadingLetter } = useQuery<ChallengeLetterResponse>({
    queryKey: ["/api/challenge-letters", selectedAppeal],
    enabled: !!selectedAppeal,
  });

  const filteredCases = appealCases.filter((appealCase: AppealCase) =>
    appealCase.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appealCase.denialReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appealCase.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appealCase.payer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProbabilityBadge = (probability: number) => {
    if (probability >= 90) return <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Excellent ({probability}%)</Badge>;
    if (probability >= 80) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">Very High ({probability}%)</Badge>;
    if (probability >= 70) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">High ({probability}%)</Badge>;
    return <Badge variant="secondary">Below Threshold ({probability}%)</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"><CheckCircle className="w-3 h-3 mr-1" />Generated</Badge>;
      case "pending_generation":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "not_recommended":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Not Recommended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoadingCases) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Automated Appeal Generation</h2>
        <p className="text-muted-foreground">
          AI-powered challenge letter generation for high-probability appeals (&gt;70% success rate)
        </p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenge Letter Production</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.4%</div>
            <p className="text-xs text-muted-foreground">
              Unreasonable denials challenged within 5 days
            </p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-green-600 font-medium">Target: 100%</div>
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">On Track</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denial Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">22.3%</div>
            <p className="text-xs text-muted-foreground">
              Reduction in clinical/DRG/prior auth denials
            </p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-blue-600 font-medium">Target: 20%</div>
              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Exceeded</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Probability Appeals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredCases.filter((c: AppealCase) => c.appealProbability > 70).length}
            </div>
            <p className="text-xs text-muted-foreground">Cases &gt;70% success rate</p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-purple-600 font-medium">
                Avg: {Math.round(filteredCases.reduce((sum: number, c: AppealCase) => sum + c.appealProbability, 0) / filteredCases.length || 0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${filteredCases.reduce((sum: number, c: AppealCase) => 
                sum + parseFloat(c.denialAmount.replace(/[$,]/g, '')), 0
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">High-probability appeal value</p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-green-600 font-medium">
                {filteredCases.filter((c: AppealCase) => c.status === "generated").length} letters ready
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search by patient, denial reason, department, or payer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-appeals"
        />
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Target className="w-3 h-3 mr-1" />
          Showing High-Probability Cases (&gt;70%)
        </Badge>
      </div>

      {/* Appeals Table */}
      <Card>
        <CardHeader>
          <CardTitle>High-Probability Appeal Cases</CardTitle>
          <CardDescription>
            Cases with &gt;70% probability of successful appeal based on clinical evidence analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Denial Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Success Probability</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((appealCase: AppealCase) => (
                <TableRow key={appealCase.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{appealCase.patientName}</div>
                      <div className="text-sm text-muted-foreground">{appealCase.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{appealCase.payer}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={appealCase.denialReason}>
                      {appealCase.denialReason}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-red-600">
                    {appealCase.denialAmount}
                  </TableCell>
                  <TableCell>
                    {getProbabilityBadge(appealCase.appealProbability)}
                  </TableCell>
                  <TableCell>{appealCase.department}</TableCell>
                  <TableCell>
                    {getStatusBadge(appealCase.status)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppeal(appealCase.id)}
                          data-testid={`button-view-appeal-${appealCase.id}`}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Generate Letter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>
                            Appeal Challenge Letter - {appealCase.patientName}
                          </DialogTitle>
                          <DialogDescription>
                            AI-generated challenge letter with clinical evidence extraction
                          </DialogDescription>
                        </DialogHeader>
                        
                        {isLoadingLetter ? (
                          <div className="animate-pulse space-y-4 p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="space-y-2">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-3 bg-gray-200 rounded"></div>
                              ))}
                            </div>
                          </div>
                        ) : challengeLetterData ? (
                          <Tabs defaultValue="letter" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="letter">Challenge Letter</TabsTrigger>
                              <TabsTrigger value="evidence">Clinical Evidence</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="letter" className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">Success Probability: {challengeLetterData.appealProbability}%</h4>
                                  <p className="text-sm text-muted-foreground">Based on clinical evidence strength</p>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Submit Appeal
                                </Button>
                              </div>
                              
                              <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <pre className="text-sm whitespace-pre-wrap font-mono">
                                  {challengeLetterData.challengeLetter}
                                </pre>
                              </ScrollArea>
                            </TabsContent>
                            
                            <TabsContent value="evidence" className="space-y-4">
                              <ScrollArea className="h-96 w-full">
                                <div className="space-y-6">
                                  {/* Vital Signs Evidence */}
                                  {challengeLetterData.clinicalEvidence.vitalSigns && (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Activity className="h-4 w-4 text-red-500" />
                                        <h4 className="font-semibold">Critical Vital Signs</h4>
                                      </div>
                                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                        {challengeLetterData.clinicalEvidence.vitalSigns.findings.map((finding: string, index: number) => (
                                          <div key={index} className="flex items-start space-x-2">
                                            <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{finding}</span>
                                          </div>
                                        ))}
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Source: {challengeLetterData.clinicalEvidence.vitalSigns.supportingDocumentation}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* IV Medications Evidence */}
                                  {challengeLetterData.clinicalEvidence.medications && (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Pill className="h-4 w-4 text-blue-500" />
                                        <h4 className="font-semibold">IV Medication Requirements</h4>
                                      </div>
                                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                        {challengeLetterData.clinicalEvidence.medications.findings.map((finding: string, index: number) => (
                                          <div key={index} className="flex items-start space-x-2">
                                            <Pill className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{finding}</span>
                                          </div>
                                        ))}
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Source: {challengeLetterData.clinicalEvidence.medications.supportingDocumentation}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lab Results Evidence */}
                                  {challengeLetterData.clinicalEvidence.labResults && (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <TestTube className="h-4 w-4 text-purple-500" />
                                        <h4 className="font-semibold">Laboratory Evidence</h4>
                                      </div>
                                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                        {challengeLetterData.clinicalEvidence.labResults.findings.map((finding: string, index: number) => (
                                          <div key={index} className="flex items-start space-x-2">
                                            <TestTube className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{finding}</span>
                                          </div>
                                        ))}
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Source: {challengeLetterData.clinicalEvidence.labResults.supportingDocumentation}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Respiratory Support Evidence */}
                                  {challengeLetterData.clinicalEvidence.respiratorySupport && (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Stethoscope className="h-4 w-4 text-green-500" />
                                        <h4 className="font-semibold">Respiratory Support Requirements</h4>
                                      </div>
                                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                        {challengeLetterData.clinicalEvidence.respiratorySupport.findings.map((finding: string, index: number) => (
                                          <div key={index} className="flex items-start space-x-2">
                                            <Stethoscope className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{finding}</span>
                                          </div>
                                        ))}
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Source: {challengeLetterData.clinicalEvidence.respiratorySupport.supportingDocumentation}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <Separator />

                                  {/* Appeal Strength Analysis */}
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Appeal Strength Analysis</h4>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg space-y-2">
                                      <div>
                                        <p className="font-medium text-sm text-green-700 dark:text-green-300">Strong Points:</p>
                                        {challengeLetterData.appealCase.appealStrength.strongPoints.map((point: string, index: number) => (
                                          <div key={index} className="flex items-start space-x-2 mt-1">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{point}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Medical Justification:</p>
                                        <p className="text-sm text-muted-foreground">{challengeLetterData.appealCase.appealStrength.medicalJustification}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Regulatory Support:</p>
                                        <p className="text-sm text-muted-foreground">{challengeLetterData.appealCase.appealStrength.regulatorySupport}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
                            </TabsContent>
                          </Tabs>
                        ) : null}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No high-probability appeal cases found</p>
              <p className="text-sm">Cases with &gt;70% success probability will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}