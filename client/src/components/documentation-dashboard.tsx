import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { Download, Bot } from "lucide-react";
import { PayerVolumeChart } from "./charts/payer-volume-chart";
import { RedundancyMatrix } from "./charts/redundancy-matrix";
import { DocumentationTracker } from "./documentation-tracker";
import { PayerAnalytics } from "./payer-analytics";

export function DocumentationDashboard() {
  return (
    <Container 
      component="main" 
      maxWidth={false}
      sx={{ 
        flex: 1, 
        p: 3, 
        overflow: 'auto', 
        bgcolor: 'background.default' 
      }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Dashboard Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 600 }}>
            Additional Documentation Request Analysis & Automation
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained"
              color="primary"
              startIcon={<Download size={20} />}
              data-testid="button-export-report"
            >
              Export Report
            </Button>
            <Button 
              variant="contained"
              color="secondary"
              startIcon={<Bot size={20} />}
              data-testid="button-auto-process"
            >
              Auto-Process
            </Button>
          </Box>
        </Box>

        {/* Documentation Request Overview Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Summary Stats */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
                Request Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} data-testid="summary-total-requests">
                  <Typography variant="body2" color="text.secondary">Total Requests:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>342</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} data-testid="summary-redundant">
                  <Typography variant="body2" color="text.secondary">Redundant:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>128 (37%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} data-testid="summary-auto-resolved">
                  <Typography variant="body2" color="text.secondary">Auto-Resolved:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>89 (26%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} data-testid="summary-pending">
                  <Typography variant="body2" color="text.secondary">Pending Review:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>125 (37%)</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Volume Chart */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
                Documentation Requests by Payer
              </Typography>
              <PayerVolumeChart />
            </Paper>
          </Grid>
        </Grid>

        {/* Redundancy Heat Map */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
            Documentation Redundancy Matrix
          </Typography>
          <RedundancyMatrix />
        </Paper>

        {/* Documentation Tracker and Payer Analytics */}
        <Grid container spacing={3}>
          <Grid item xs={12} xl={6}>
            <DocumentationTracker />
          </Grid>
          <Grid item xs={12} xl={6}>
            <PayerAnalytics />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
