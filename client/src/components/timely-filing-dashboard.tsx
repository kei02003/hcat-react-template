import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, CheckCircle, XCircle, Calendar, Filter, FileText, User, Building } from "lucide-react";

interface TimelyFilingClaim {
  id: string;
  patientName: string;
  patientId: string;
  accountNumber: string;
  claimId: string;
  payer: string;
  serviceDate: string;
  filingDeadline: string;
  daysRemaining: number;
  agingCategory: string;
  claimAmount: string;
  department: string;
  procedureDescription: string;
  denialStatus: string;
  denialReason?: string;
  assignedBiller: string;
  priority: string;
  status: string;
  notes: string;
}

export function TimelyFilingDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [agingFilter, setAgingFilter] = useState("all");
  const [denialFilter, setDenialFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [billerFilter, setBillerFilter] = useState("all");
  const [payerFilter, setPayerFilter] = useState("all");

  // Fetch timely filing claims with filters
  const { data: claims = [], isLoading: isLoadingClaims } = useQuery({
    queryKey: ["/api/timely-filing-claims", agingFilter, denialFilter, departmentFilter, billerFilter, payerFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (agingFilter !== "all") params.append("agingCategory", agingFilter);
      if (denialFilter !== "all") params.append("denialStatus", denialFilter);
      if (departmentFilter !== "all") params.append("department", departmentFilter);
      if (billerFilter !== "all") params.append("assignedBiller", billerFilter);
      if (payerFilter !== "all") params.append("payer", payerFilter);

      const response = await fetch(`/api/timely-filing-claims?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch timely filing claims');
      return response.json();
    }
  });

  // Fetch metrics
  const { data: metricsData } = useQuery({
    queryKey: ["/api/timely-filing-metrics"],
  });

  const metrics = metricsData?.metrics;
  const categories = metricsData?.categories;

  const filteredClaims = claims.filter((claim: TimelyFilingClaim) => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.procedureDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayer = payerFilter === "all" || claim.payer === payerFilter;

    return matchesSearch && matchesPayer;
  });

  const getAgingBadge = (agingCategory: string, daysRemaining: number) => {
    switch (agingCategory) {
      case "safe":
        return (
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Safe</Badge>
            <div className="text-xs text-muted-foreground mt-1">{daysRemaining}d</div>
          </div>
        );
      case "warning":
        return (
          <div className="text-center">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Warning</Badge>
            <div className="text-xs text-muted-foreground mt-1">{daysRemaining}d</div>
          </div>
        );
      case "critical":
        return (
          <div className="text-center">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">Critical</Badge>
            <div className="text-xs text-muted-foreground mt-1">{daysRemaining}d</div>
          </div>
        );
      case "overdue":
        return (
          <div className="text-center">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Overdue</Badge>
            <div className="text-xs text-muted-foreground mt-1">{Math.abs(daysRemaining)}d</div>
          </div>
        );
      case "severely_overdue":
        return (
          <div className="text-center">
            <Badge className="bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100">Severe</Badge>
            <div className="text-xs text-muted-foreground mt-1">{Math.abs(daysRemaining)}d</div>
          </div>
        );
      default:
        return <Badge variant="secondary">{agingCategory}</Badge>;
    }
  };

  const getDenialStatusBadge = (denialStatus: string) => {
    switch (denialStatus) {
      case "denied":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Denied</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "at_risk":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"><AlertTriangle className="w-3 h-3 mr-1" />At Risk</Badge>;
      default:
        return <Badge variant="secondary">{denialStatus}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string, daysRemaining: number) => {
    if (priority === "urgent" || priority === "critical" || daysRemaining <= 7) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (priority === "medium" || daysRemaining <= 14) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (isLoadingClaims) {
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
        <h2 className="text-3xl font-bold tracking-tight">Timely Filing Management</h2>
        <p className="text-muted-foreground">
          Monitor and manage claims by aging categories and denial status for timely filing deadlines
        </p>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Action Required</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalActionRequired}</div>
              <p className="text-xs text-muted-foreground">Claims requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filing Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.filingSuccessRate}%</div>
              <p className="text-xs text-muted-foreground">Claims filed on time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Denial Amount</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${metrics.totalDenialAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Due to timely filing denials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Days to Deadline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.averageDaysToDeadline}</div>
              <p className="text-xs text-muted-foreground">Days remaining across all claims</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by patient, claim ID, payer, or procedure..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-timely-filing"
        />

        <Select value={agingFilter} onValueChange={setAgingFilter}>
          <SelectTrigger className="w-48" data-testid="select-aging-filter">
            <SelectValue placeholder="Filter by Aging" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Aging Categories</SelectItem>
            <SelectItem value="severely_overdue">Severely Overdue</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="critical">Critical (1-14 days)</SelectItem>
            <SelectItem value="warning">Warning (15-29 days)</SelectItem>
            <SelectItem value="safe">Safe (30+ days)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={denialFilter} onValueChange={setDenialFilter}>
          <SelectTrigger className="w-48" data-testid="select-denial-filter">
            <SelectValue placeholder="Filter by Denial Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Denial Statuses</SelectItem>
            <SelectItem value="denied">Denied Claims Only</SelectItem>
            <SelectItem value="at_risk">At Risk Claims</SelectItem>
            <SelectItem value="pending">Pending Claims</SelectItem>
            <SelectItem value="approved">Approved Claims</SelectItem>
          </SelectContent>
        </Select>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48" data-testid="select-department-filter">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Cardiology">Cardiology</SelectItem>
            <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
            <SelectItem value="Pulmonology">Pulmonology</SelectItem>
            <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
            <SelectItem value="Surgery">Surgery</SelectItem>
            <SelectItem value="Family Practice">Family Practice</SelectItem>
            <SelectItem value="Dermatology">Dermatology</SelectItem>
          </SelectContent>
        </Select>

        <Select value={billerFilter} onValueChange={setBillerFilter}>
          <SelectTrigger className="w-48" data-testid="select-biller-filter">
            <SelectValue placeholder="Filter by Biller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Billers</SelectItem>
            <SelectItem value="Jennifer Martinez">Jennifer Martinez</SelectItem>
            <SelectItem value="David Rodriguez">David Rodriguez</SelectItem>
            <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
          </SelectContent>
        </Select>

        <Select value={payerFilter} onValueChange={setPayerFilter}>
          <SelectTrigger className="w-48" data-testid="select-payer-filter">
            <SelectValue placeholder="Filter by Payer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payers</SelectItem>
            <SelectItem value="Aetna">Aetna</SelectItem>
            <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
            <SelectItem value="Medicare">Medicare</SelectItem>
            <SelectItem value="Medicaid">Medicaid</SelectItem>
            <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
            <SelectItem value="Humana">Humana</SelectItem>
            <SelectItem value="Cigna">Cigna</SelectItem>
            <SelectItem value="Anthem">Anthem</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="outline" className="flex items-center gap-1">
          <Filter className="w-3 h-3" />
          {filteredClaims.length} claims shown
        </Badge>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Aging and Denial Status</CardTitle>
          <CardDescription>
            Manage claims based on filing deadlines and denial status. Filter by aging categories to focus on urgent items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Aging Status</TableHead>
                <TableHead>Denial Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Biller</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim: TimelyFilingClaim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    {getPriorityIcon(claim.priority, claim.daysRemaining)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div>{claim.patientName}</div>
                      <div className="text-sm text-muted-foreground">{claim.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.claimId}</div>
                      <div className="text-sm text-muted-foreground">{claim.accountNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{claim.payer}</TableCell>
                  <TableCell className="font-medium">{claim.claimAmount}</TableCell>
                  <TableCell>
                    {getAgingBadge(claim.agingCategory, claim.daysRemaining)}
                  </TableCell>
                  <TableCell>
                    {getDenialStatusBadge(claim.denialStatus)}
                    {claim.denialReason && (
                      <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={claim.denialReason}>
                        {claim.denialReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-muted-foreground" />
                      {claim.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {claim.assignedBiller}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-view-claim-${claim.id}`}>
                        <FileText className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {claim.denialStatus === 'denied' && (
                        <Button variant="outline" size="sm" className="text-blue-600" data-testid={`button-appeal-${claim.id}`}>
                          Appeal
                        </Button>
                      )}
                      {claim.daysRemaining <= 14 && claim.denialStatus !== 'denied' && (
                        <Button variant="outline" size="sm" className="text-orange-600" data-testid={`button-expedite-${claim.id}`}>
                          Expedite
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClaims.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No claims found matching the current filters</p>
              <p className="text-sm">Adjust filters to see more results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}