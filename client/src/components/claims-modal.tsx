import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, User, Calendar, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";

interface Claim {
  id: string;
  patientName: string;
  claimId: string;
  submissionDate: string;
  lastRequestDate: string;
  redundancyStatus: "confirmed" | "suspected" | "resolved";
  previousSubmissions: number;
  assignedTo: string;
  notes: string;
}

interface ClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  payer: string;
  count: number;
  rate: number;
}

// Mock data for demonstration - in real app this would come from API
const generateMockClaims = (documentType: string, payer: string, count: number): Claim[] => {
  const claims: Claim[] = [];
  const patients = ["Johnson, Mary", "Williams, John", "Brown, Sarah", "Davis, Michael", "Miller, Lisa"];
  const assignees = ["Jennifer Martinez", "David Rodriguez", "Maria Garcia"];
  
  for (let i = 0; i < count; i++) {
    claims.push({
      id: `claim-${i + 1}`,
      patientName: patients[i % patients.length],
      claimId: `CLM-2024-${1000 + i}`,
      submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      lastRequestDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      redundancyStatus: Math.random() > 0.6 ? "confirmed" : Math.random() > 0.3 ? "suspected" : "resolved",
      previousSubmissions: Math.floor(Math.random() * 4) + 1,
      assignedTo: assignees[i % assignees.length],
      notes: `${documentType} requested by ${payer} - ${Math.random() > 0.5 ? 'Review needed' : 'Pending resolution'}`
    });
  }
  
  return claims;
};

export function ClaimsModal({ isOpen, onClose, documentType, payer, count, rate }: ClaimsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submissionDate");
  
  const claims = generateMockClaims(documentType, payer, count);
  
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.redundancyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    switch (sortBy) {
      case "submissionDate":
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      case "redundancyStatus":
        return a.redundancyStatus.localeCompare(b.redundancyStatus);
      case "patientName":
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="destructive">Confirmed Redundant</Badge>;
      case "suspected":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspected</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const redundantCount = claims.filter(c => c.redundancyStatus === "confirmed").length;
  const suspectedCount = claims.filter(c => c.redundancyStatus === "suspected").length;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {payer} - {documentType} Claims
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{count} total claims found</span>
            <span>•</span>
            <span className="text-red-600">{redundantCount} confirmed redundant</span>
            <span>•</span>
            <span className="text-yellow-600">{suspectedCount} suspected</span>
            <span>•</span>
            <span>{rate}% redundancy rate</span>
          </div>
        </DialogHeader>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient or claim ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              data-testid="input-search-claims"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed Redundant</SelectItem>
              <SelectItem value="suspected">Suspected</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48" data-testid="select-sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="submissionDate">Submission Date</SelectItem>
              <SelectItem value="redundancyStatus">Status</SelectItem>
              <SelectItem value="patientName">Patient Name</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline" className="flex items-center gap-1">
            <Filter className="w-3 h-3" />
            {filteredClaims.length} claims shown
          </Badge>
        </div>

        {/* Claims Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Last Request</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Previous Submissions</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClaims.map((claim) => (
                <TableRow key={claim.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {claim.patientName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {claim.claimId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {claim.submissionDate}
                    </div>
                  </TableCell>
                  <TableCell>{claim.lastRequestDate}</TableCell>
                  <TableCell>{getStatusBadge(claim.redundancyStatus)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${claim.previousSubmissions > 2 ? 'text-red-600' : 'text-gray-900'}`}>
                      {claim.previousSubmissions}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{claim.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-review-${claim.id}`}>
                        Review
                      </Button>
                      {claim.redundancyStatus === "confirmed" && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Contact Payer
                        </Button>
                      )}
                      {claim.redundancyStatus === "suspected" && (
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClaims.length === 0 && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No claims match your current filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{claims.length}</div>
              <div className="text-gray-600">Total Claims</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{redundantCount}</div>
              <div className="text-gray-600">Confirmed Redundant</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{suspectedCount}</div>
              <div className="text-gray-600">Suspected</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {claims.reduce((sum, claim) => sum + claim.previousSubmissions, 0)}
              </div>
              <div className="text-gray-600">Total Resubmissions</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}