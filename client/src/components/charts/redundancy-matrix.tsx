import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  Grid,
} from '@mui/material';
import { AlertTriangle, TrendingUp } from "lucide-react";
import { ClaimsModal } from "@/components/claims-modal";

interface MatrixData {
  documentType: string;
  medicare: { count: number; rate: number };
  medicaid: { count: number; rate: number };
  bcbs: { count: number; rate: number };
  commercial: { count: number; rate: number };
}

const matrixData: MatrixData[] = [
  {
    documentType: "Medical Records",
    medicare: { count: 23, rate: 45 },
    medicaid: { count: 18, rate: 32 },
    bcbs: { count: 31, rate: 67 },
    commercial: { count: 12, rate: 15 },
  },
  {
    documentType: "Prior Authorization",
    medicare: { count: 15, rate: 28 },
    medicaid: { count: 22, rate: 41 },
    bcbs: { count: 8, rate: 18 },
    commercial: { count: 19, rate: 35 },
  },
  {
    documentType: "Physician Notes",
    medicare: { count: 9, rate: 12 },
    medicaid: { count: 14, rate: 29 },
    bcbs: { count: 27, rate: 52 },
    commercial: { count: 11, rate: 21 },
  },
  {
    documentType: "Lab Results",
    medicare: { count: 17, rate: 31 },
    medicaid: { count: 35, rate: 58 },
    bcbs: { count: 16, rate: 34 },
    commercial: { count: 7, rate: 19 },
  },
  {
    documentType: "Imaging",
    medicare: { count: 5, rate: 11 },
    medicaid: { count: 12, rate: 26 },
    bcbs: { count: 14, rate: 31 },
    commercial: { count: 8, rate: 17 },
  },
  {
    documentType: "Operative Reports",
    medicare: { count: 13, rate: 29 },
    medicaid: { count: 6, rate: 14 },
    bcbs: { count: 42, rate: 73 },
    commercial: { count: 15, rate: 28 },
  },
];

function getCellColor(rate: number) {
  if (rate >= 60) return { bgcolor: 'error.main', color: 'error.contrastText' };
  if (rate >= 30) return { bgcolor: 'warning.main', color: 'warning.contrastText' };
  return { bgcolor: 'success.light', color: 'success.contrastText' };
}

function MatrixCell({ 
  count, 
  rate, 
  documentType, 
  payer, 
  onClick 
}: { 
  count: number; 
  rate: number; 
  documentType: string; 
  payer: string; 
  onClick: () => void; 
}) {
  const cellColors = getCellColor(rate);
  
  return (
    <TableCell 
      sx={{
        textAlign: 'center',
        p: 2,
        cursor: 'pointer',
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.2s',
        borderRadius: 1,
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 2,
        },
        ...cellColors,
      }}
      onClick={onClick}
      data-testid={`matrix-cell-${documentType.toLowerCase().replace(/\s+/g, '-')}-${payer.toLowerCase()}`}
    >
      <Tooltip title={`${documentType} - ${payer}: ${count} claims (${rate}% redundancy rate)`}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {count} ({rate}%)
          </Typography>
          <Box sx={{ mt: 0.5, opacity: 0.8 }}>
            {rate >= 50 ? (
              <AlertTriangle size={12} />
            ) : (
              <TrendingUp size={12} />
            )}
          </Box>
        </Box>
      </Tooltip>
    </TableCell>
  );
}

export function RedundancyMatrix() {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    documentType: string;
    payer: string;
    count: number;
    rate: number;
  }>({
    isOpen: false,
    documentType: "",
    payer: "",
    count: 0,
    rate: 0
  });

  const handleCellClick = (documentType: string, payer: string, count: number, rate: number) => {
    setModalConfig({
      isOpen: true,
      documentType,
      payer,
      count,
      rate
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Heat Map */}
        <Grid item xs={12} lg={9}>
          <Paper elevation={0} sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Document Type
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Medicare
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Medicaid
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    BCBS
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Commercial
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matrixData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {row.documentType}
                    </TableCell>
                    <MatrixCell 
                      count={row.medicare.count} 
                      rate={row.medicare.rate} 
                      documentType={row.documentType}
                      payer="Medicare"
                      onClick={() => handleCellClick(row.documentType, "Medicare", row.medicare.count, row.medicare.rate)}
                    />
                    <MatrixCell 
                      count={row.medicaid.count} 
                      rate={row.medicaid.rate} 
                      documentType={row.documentType}
                    payer="Medicaid"
                    onClick={() => handleCellClick(row.documentType, "Medicaid", row.medicaid.count, row.medicaid.rate)}
                  />
                  <MatrixCell 
                    count={row.bcbs.count} 
                    rate={row.bcbs.rate} 
                    documentType={row.documentType}
                    payer="BCBS"
                    onClick={() => handleCellClick(row.documentType, "BCBS", row.bcbs.count, row.bcbs.rate)}
                  />
                  <MatrixCell 
                    count={row.commercial.count} 
                    rate={row.commercial.rate} 
                    documentType={row.documentType}
                    payer="Commercial"
                    onClick={() => handleCellClick(row.documentType, "Commercial", row.commercial.count, row.commercial.rate)}
                  />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Pattern Analysis Panel */}
        <Grid item xs={12} lg={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                bgcolor: 'error.light', 
                borderLeft: 4, 
                borderLeftColor: 'error.main' 
              }} 
              data-testid="pattern-alert"
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <AlertTriangle size={16} color="#d32f2f" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.dark' }}>
                    PATTERN ALERT
                  </Typography>
                  <Typography variant="caption" color="error.dark">
                    BCBS requesting operative reports 73% already submitted
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                bgcolor: 'warning.light', 
                borderLeft: 4, 
                borderLeftColor: 'warning.main' 
              }} 
              data-testid="trend-alert"
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TrendingUp size={16} color="#ed6c02" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                    TREND
                  </Typography>
                  <Typography variant="caption" color="warning.dark">
                    Medicaid lab result requests up 45% this month
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Claims Modal */}
      <ClaimsModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        documentType={modalConfig.documentType}
        payer={modalConfig.payer}
        count={modalConfig.count}
        rate={modalConfig.rate}
      />
    </>
  );
}
