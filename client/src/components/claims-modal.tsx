import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
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

  // Handler functions for claim actions
  const handleReviewClaim = (claim: Claim) => {
    alert(`Reviewing claim details:\n\nClaim ID: ${claim.claimId}\nPatient: ${claim.patientName}\nSubmission Date: ${claim.submissionDate}\nStatus: ${claim.redundancyStatus}\nPrevious Submissions: ${claim.previousSubmissions}\nAssigned To: ${claim.assignedTo}\nNotes: ${claim.notes}`);
  };

  const handleContactPayer = (claim: Claim) => {
    alert(`Contacting payer for claim:\n\nClaim ID: ${claim.claimId}\nPatient: ${claim.patientName}\nPayer: ${payer}\nRedundancy Status: Confirmed\n\nAction: Automated contact request will be sent to payer to resolve redundant documentation requests.`);
  };

  const handleMarkResolved = (claim: Claim) => {
    alert(`Marking claim as resolved:\n\nClaim ID: ${claim.claimId}\nPatient: ${claim.patientName}\nStatus: Changing from 'Suspected' to 'Resolved'\n\nThis will remove the claim from pending review queue.`);
  };
  
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

  const getStatusChip = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Chip label="Confirmed Redundant" color="error" size="small" />;
      case "suspected":
        return <Chip label="Suspected" color="warning" size="small" />;
      case "resolved":
        return <Chip label="Resolved" color="success" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const redundantCount = claims.filter(c => c.redundancyStatus === "confirmed").length;
  const suspectedCount = claims.filter(c => c.redundancyStatus === "suspected").length;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" gutterBottom>
          {payer} - {documentType} Claims
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <Chip label={`${count} total claims`} color="primary" variant="outlined" />
          <Chip label={`${redundantCount} confirmed redundant`} color="error" variant="outlined" />
          <Chip label={`${suspectedCount} suspected`} color="warning" variant="outlined" />
          <Chip label={`${rate}% redundancy rate`} color="info" variant="outlined" />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Filters and Controls */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search by patient or claim ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            data-testid="input-search-claims"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
              data-testid="select-status-filter"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="confirmed">Confirmed Redundant</MenuItem>
              <MenuItem value="suspected">Suspected</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
              data-testid="select-sort-by"
            >
              <MenuItem value="submissionDate">Submission Date</MenuItem>
              <MenuItem value="redundancyStatus">Status</MenuItem>
              <MenuItem value="patientName">Patient Name</MenuItem>
            </Select>
          </FormControl>

          <Chip
            icon={<Filter />}
            label={`${filteredClaims.length} claims shown`}
            variant="outlined"
            color="primary"
          />
        </Box>

        {/* Claims Table */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Claim ID</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell>Last Request</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Previous Submissions</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={16} style={{ color: '#999' }} />
                      {claim.patientName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileText size={16} style={{ color: '#999' }} />
                      {claim.claimId}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={16} style={{ color: '#999' }} />
                      {claim.submissionDate}
                    </Box>
                  </TableCell>
                  <TableCell>{claim.lastRequestDate}</TableCell>
                  <TableCell>{getStatusChip(claim.redundancyStatus)}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: claim.previousSubmissions > 2 ? 'error.main' : 'text.primary'
                      }}
                    >
                      {claim.previousSubmissions}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {claim.assignedTo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        data-testid={`button-review-${claim.id}`}
                        onClick={() => handleReviewClaim(claim)}
                      >
                        Review
                      </Button>
                      {claim.redundancyStatus === "confirmed" && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="error"
                          startIcon={<AlertTriangle size={16} />}
                          onClick={() => handleContactPayer(claim)}
                          data-testid={`button-contact-payer-${claim.id}`}
                        >
                          Contact Payer
                        </Button>
                      )}
                      {claim.redundancyStatus === "suspected" && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="success"
                          startIcon={<CheckCircle size={16} />}
                          onClick={() => handleMarkResolved(claim)}
                          data-testid={`button-mark-resolved-${claim.id}`}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClaims.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <FileText size={32} style={{ color: '#ccc' }} />
                    <Typography color="text.secondary">No claims match your current filters</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Box>

        {/* Summary Footer */}
        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, textAlign: 'center' }}>
            <Box>
              <Typography variant="h6" color="text.primary">{claims.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Claims</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="error.main">{redundantCount}</Typography>
              <Typography variant="caption" color="text.secondary">Confirmed Redundant</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="warning.main">{suspectedCount}</Typography>
              <Typography variant="caption" color="text.secondary">Suspected</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main">
                {claims.reduce((sum, claim) => sum + claim.previousSubmissions, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Total Resubmissions</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}