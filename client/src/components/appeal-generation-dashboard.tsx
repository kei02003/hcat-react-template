import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingUp, FileText, Clock, CheckCircle, Target, Search } from "lucide-react";
import { PatientAppealModal } from "./patient-appeal-modal";

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
  status: string;
  createdAt: string;
}

export function AppealGenerationDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDenialForAppeal, setSelectedDenialForAppeal] = useState<any>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);

  // Fetch high-probability appeal cases
  const { data: appealCases = [], isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/appeal-cases"],
  });

  // Fetch performance metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/appeal-metrics"],
  });

  // Filter cases based on search and high probability criteria
  const filteredCases = appealCases.filter((appealCase: AppealCase) => {
    const matchesSearch = appealCase.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appealCase.denialReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appealCase.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appealCase.payer.toLowerCase().includes(searchQuery.toLowerCase());
    const isHighProbability = appealCase.appealProbability > 70;
    return matchesSearch && isHighProbability;
  });

  const getProbabilityBadge = (probability: number) => {
    if (probability >= 90) {
      return <Badge className="bg-green-100 text-green-800">Excellent ({probability}%)</Badge>;
    } else if (probability >= 80) {
      return <Badge className="bg-blue-100 text-blue-800">Very Good ({probability}%)</Badge>;
    } else if (probability >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">Good ({probability}%)</Badge>;
    }
    return <Badge variant="secondary">{probability}%</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'generated':
        return <Badge className="bg-blue-100 text-blue-800"><FileText className="w-3 h-3 mr-1" />Generated</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateAppeal = (appealCase: AppealCase) => {
    // Transform AppealCase to denial format for consistency with PatientAppealModal
    const denial = {
      denialId: appealCase.id,
      claimId: `CLM-${appealCase.patientId}`,
      patientName: appealCase.patientName,
      payerName: appealCase.payer,
      denialReason: appealCase.denialReason,
      deniedAmount: parseFloat(appealCase.denialAmount.replace(/[$,]/g, '')),
      category: "Clinical",
      department: appealCase.department,
      provider: appealCase.attendingPhysician,
      serviceDate: new Date(appealCase.createdAt).toISOString().split('T')[0],
      denialDate: new Date(appealCase.createdAt).toISOString().split('T')[0],
      appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysToAppeal: 30
    };
    setSelectedDenialForAppeal(denial);
    setShowAppealModal(true);
  };

  const closeAppealModal = () => {
    setSelectedDenialForAppeal(null);
    setShowAppealModal(false);
  };

  if (isLoadingCases) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>;
  }

  return (
    <main className="space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Appeal Generation</h1>
        </div>
        <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
          AI-Powered Challenge Letters
        </Badge>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.successRate || '89.4%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Appeals won with AI letters
            </p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-green-600 font-medium">Target: 75%</div>
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Exceeded</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
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
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient, denial reason, department, or payer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-appeals"
          />
        </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateAppeal(appealCase)}
                      data-testid={`button-generate-appeal-${appealCase.id}`}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Generate Appeal
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCases.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No High-Probability Cases Found</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {searchQuery ? "Try adjusting your search terms to find more appeal cases." : 
                 "All cases are currently below the 70% probability threshold for automated appeal generation."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient-specific Appeal Generation Modal */}
      {selectedDenialForAppeal && (
        <PatientAppealModal
          denial={selectedDenialForAppeal}
          isOpen={showAppealModal}
          onClose={closeAppealModal}
        />
      )}
    </main>
  );
}