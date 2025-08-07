import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  TextField,
  Container,
  Paper,
  IconButton,
} from '@mui/material';
import { LocalHospital, Help, CalendarToday } from '@mui/icons-material';
import { MetricsPanel } from "@/components/metrics-panel";
import { DocumentationDashboard } from "@/components/documentation-dashboard";
import { PredictiveDashboard } from "@/components/predictive-dashboard";
import { ArManagementDashboard } from "@/components/ar-management-dashboard";
import { CollectionsDashboard } from "@/components/collections-dashboard";
import { TimelyFilingDashboard } from "@/components/timely-filing-dashboard";
import { ClinicalDenialsDashboard } from "@/components/clinical-denials-dashboard";
import { PreAuthorizationDashboard } from "@/components/pre-authorization-dashboard";
import { FeasibilityDashboard } from "@/components/feasibility-dashboard";

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState("Denials");
  const [activeSubTab, setActiveSubTab] = useState("Clinical Denials");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-15",
    end: "2024-12-31"
  });

  const mainTabs = ["Summary", "AR Management", "Denials", "Collections", "Feasibility", "Pre-Authorization"];
  const subTabs = ["Clinical Denials", "Timely Filing", "Documentation Requests", "Appeals Management", "Predictive Analytics"];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Navigation */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }} data-testid="logo">
            <LocalHospital />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              RevenueCycle
            </Typography>
          </Box>
          
          {/* Main Navigation Tabs */}
          <Tabs
            value={activeMainTab}
            onChange={(_, newValue) => setActiveMainTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flexGrow: 1 }}
          >
            {mainTabs.map((tab) => (
              <Tab
                key={tab}
                label={tab}
                value={tab}
                data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                }}
              />
            ))}
          </Tabs>
          
          {/* Date Range Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              size="small"
              data-testid="date-input-start"
              sx={{ 
                '& .MuiInputBase-root': { 
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }
              }}
            />
            <Typography variant="body2" sx={{ color: 'inherit' }}>to</Typography>
            <TextField
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              size="small"
              data-testid="date-input-end"
              sx={{ 
                '& .MuiInputBase-root': { 
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }
              }}
            />
            <IconButton color="inherit" size="small">
              <Help />
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* Secondary Navigation for Denials */}
        {activeMainTab === "Denials" && (
          <Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
            <Container maxWidth={false}>
              <Tabs
                value={activeSubTab}
                onChange={(_, newValue) => setActiveSubTab(newValue)}
                textColor="inherit"
                indicatorColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  '& .MuiTab-root': { 
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minHeight: 48,
                    opacity: 0.7,
                    '&.Mui-selected': { opacity: 1 }
                  }
                }}
              >
                {subTabs.map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    value={tab}
                    data-testid={`sub-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                ))}
              </Tabs>
            </Container>
          </Box>
        )}
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar with Metrics */}
        <MetricsPanel />

        {/* Main Content Area */}
        {activeMainTab === "Denials" && activeSubTab === "Documentation Requests" ? (
          <DocumentationDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Predictive Analytics" ? (
          <PredictiveDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Timely Filing" ? (
          <TimelyFilingDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Clinical Denials" ? (
          <ClinicalDenialsDashboard />
        ) : activeMainTab === "AR Management" ? (
          <ArManagementDashboard />
        ) : activeMainTab === "Collections" ? (
          <CollectionsDashboard />
        ) : activeMainTab === "Feasibility" ? (
          <FeasibilityDashboard />
        ) : activeMainTab === "Pre-Authorization" ? (
          <PreAuthorizationDashboard />
        ) : (
          <Container 
            component="main" 
            maxWidth={false}
            sx={{ 
              flex: 1, 
              p: 3, 
              overflow: 'auto', 
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom color="text.primary">
                {activeMainTab} - {activeSubTab || "Overview"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This section is under development. Available dashboards include all major revenue cycle modules plus new RFP features: Pre-Authorization Management, Clinical Decision Support, and Appeal Generation.
              </Typography>
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
}
