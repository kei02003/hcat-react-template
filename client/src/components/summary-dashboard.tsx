import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

// Sample data for SPC Chart
const spcData = [
  { month: '2021-12-31', actual: 5_000_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2022-06-30', actual: 4_900_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2022-12-31', actual: 5_100_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2023-06-30', actual: 5_000_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2023-12-31', actual: 5_150_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2024-06-30', actual: 4_850_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 },
  { month: '2024-11-30', actual: 5_300_000, expected: 5_050_000, controlUpper: 5_200_000, controlLower: 4_800_000 }, // Changepoint
];

// Sample forest plot data for different dimensions
const forestPlotData = {
  'Patient Type': [
    { category: 'System Point', estimate: 5276.84, lower: 5000, upper: 5500, count: 163 },
    { category: 'Emergency', estimate: 4800, lower: 4200, upper: 5400, count: 89 },
    { category: 'Inpatient', estimate: 5100, lower: 4300, upper: 5900, count: 145 },
    { category: 'Extended Recovery', estimate: 4500, lower: 3800, upper: 5200, count: 76 },
    { category: 'Outpatient', estimate: 3900, lower: 3200, upper: 4600, count: 234 },
    { category: 'Rehabilitation/Overflow Services', estimate: 4200, lower: 3500, upper: 4900, count: 98 },
    { category: 'Observation', estimate: 3700, lower: 3000, upper: 4400, count: 167 },
    { category: 'Discharged Inpatient', estimate: 4600, lower: 3900, upper: 5300, count: 112 },
    { category: 'Emergency Services', estimate: 4400, lower: 3700, upper: 5100, count: 189 },
    { category: 'Critical Services', estimate: 5800, lower: 5100, upper: 6500, count: 67 },
  ],
  'Discharge Department': [
    { category: 'Emergency Medicine', estimate: 4800, lower: 4200, upper: 5400, count: 156 },
    { category: 'Internal Medicine', estimate: 5200, lower: 4600, upper: 5800, count: 234 },
    { category: 'Surgery', estimate: 6100, lower: 5500, upper: 6700, count: 89 },
    { category: 'Cardiology', estimate: 5900, lower: 5300, upper: 6500, count: 67 },
    { category: 'Orthopedics', estimate: 5700, lower: 5100, upper: 6300, count: 78 },
  ],
  'Discharge Location': [
    { category: 'Home', estimate: 4200, lower: 3800, upper: 4600, count: 543 },
    { category: 'SNF', estimate: 5800, lower: 5200, upper: 6400, count: 123 },
    { category: 'Rehab Facility', estimate: 6200, lower: 5600, upper: 6800, count: 89 },
    { category: 'Transfer to Hospital', estimate: 7100, lower: 6300, upper: 7900, count: 45 },
    { category: 'Home Health', estimate: 4800, lower: 4200, upper: 5400, count: 167 },
  ],
  'DRG': [
    { category: 'DRG 292', estimate: 4500, lower: 3900, upper: 5100, count: 78 },
    { category: 'DRG 313', estimate: 5200, lower: 4600, upper: 5800, count: 134 },
    { category: 'DRG 470', estimate: 6800, lower: 6000, upper: 7600, count: 56 },
    { category: 'DRG 690', estimate: 3800, lower: 3200, upper: 4400, count: 189 },
    { category: 'DRG 871', estimate: 5900, lower: 5300, upper: 6500, count: 98 },
  ],
  'Financial Class': [
    { category: 'Medicare', estimate: 4800, lower: 4200, upper: 5400, count: 345 },
    { category: 'Medicaid', estimate: 4200, lower: 3600, upper: 4800, count: 267 },
    { category: 'Commercial', estimate: 5600, lower: 5000, upper: 6200, count: 198 },
    { category: 'Self Pay', estimate: 3200, lower: 2600, upper: 3800, count: 89 },
    { category: 'Worker\'s Comp', estimate: 6400, lower: 5800, upper: 7000, count: 45 },
  ],
  'Payor': [
    { category: 'Blue Cross', estimate: 5400, lower: 4800, upper: 6000, count: 156 },
    { category: 'United Healthcare', estimate: 5200, lower: 4600, upper: 5800, count: 134 },
    { category: 'Aetna', estimate: 5800, lower: 5200, upper: 6400, count: 98 },
    { category: 'Cigna', estimate: 5600, lower: 5000, upper: 6200, count: 89 },
    { category: 'Medicare', estimate: 4800, lower: 4200, upper: 5400, count: 234 },
  ],
  'Procedure': [
    { category: 'Cardiac Catheterization', estimate: 6800, lower: 6000, upper: 7600, count: 67 },
    { category: 'Hip Replacement', estimate: 7200, lower: 6400, upper: 8000, count: 45 },
    { category: 'Appendectomy', estimate: 3800, lower: 3200, upper: 4400, count: 123 },
    { category: 'Colonoscopy', estimate: 2400, lower: 2000, upper: 2800, count: 189 },
    { category: 'MRI', estimate: 1800, lower: 1400, upper: 2200, count: 234 },
  ],
  'Revenue Location': [
    { category: 'Main Hospital', estimate: 5200, lower: 4600, upper: 5800, count: 456 },
    { category: 'Outpatient Clinic', estimate: 3600, lower: 3000, upper: 4200, count: 234 },
    { category: 'Emergency Department', estimate: 4800, lower: 4200, upper: 5400, count: 189 },
    { category: 'Surgery Center', estimate: 6400, lower: 5800, upper: 7000, count: 123 },
    { category: 'Imaging Center', estimate: 2800, lower: 2200, upper: 3400, count: 167 },
  ],
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  status?: "positive" | "negative" | "warning" | "neutral";
  isSelected?: boolean;
  onClick?: () => void;
}

function ClickableMetricCard({ title, value, subtitle, status = "neutral", isSelected, onClick }: MetricCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "positive":
        return <TrendingUp size={16} style={{ color: '#28a745' }} />;
      case "negative":
        return <TrendingDown size={16} style={{ color: '#dc3545' }} />;
      case "warning":
        return <AlertTriangle size={16} style={{ color: '#ffc107' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "positive":
        return "#28a745";
      case "negative":
        return "#dc3545";
      case "warning":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  return (
    <Card 
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? 'primary.light' : 'background.paper',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-1px)',
        },
      }}
      onClick={onClick}
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: isSelected ? 'primary.contrastText' : 'text.primary', fontSize: '1.1rem' }}>
            {value}
          </Typography>
          {getStatusIcon()}
        </Box>
        <Typography variant="caption" sx={{ color: getStatusColor(), fontSize: '0.65rem' }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function SummaryDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('Total AR');
  const [selectedDimension, setSelectedDimension] = useState('Patient Type');

  const metrics = [
    { title: "Total AR", value: "$912.79K", subtitle: "Avg: 399.46K (+128.51%)", status: "positive" as const },
    { title: "AR Days", value: "44.7", subtitle: "Avg: 40.4 (+10.73%)", status: "warning" as const },
    { title: "Adjustments", value: "($18.87K)", subtitle: "Avg: ($38.33K) (-13.24%)", status: "positive" as const },
    { title: "Charges", value: "$5.03M", subtitle: "Avg: $5M (+0.65%)", status: "neutral" as const },
    { title: "Denied Dollars", value: "$57.32K", subtitle: "Avg: ($51.12K) (+11.75%)", status: "negative" as const },
    { title: "DNFB Days", value: "6.9", subtitle: "Avg: 7.2 (-4.17%)", status: "positive" as const },
    { title: "Gross Collection Rate", value: "91.2%", subtitle: "Avg: 89.7% (+1.67%)", status: "positive" as const },
    { title: "Net Collection Rate", value: "92.8%", subtitle: "Avg: 91.2% (+1.75%)", status: "positive" as const },
    { title: "Payments", value: "($232.62K)", subtitle: "Avg: ($165.96K) (+40.17%)", status: "negative" as const },
  ];

  const dimensionOptions = [
    'Patient Type',
    'Discharge Department', 
    'Discharge Location',
    'DRG',
    'Financial Class',
    'Payor',
    'Procedure',
    'Revenue Location'
  ];

  const currentForestData = forestPlotData[selectedDimension as keyof typeof forestPlotData] || forestPlotData['Patient Type'];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar - Clickable Metrics */}
      <Box sx={{ width: '300px', p: 2, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {metrics.map((metric) => (
            <ClickableMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              status={metric.status}
              isSelected={selectedMetric === metric.title}
              onClick={() => setSelectedMetric(metric.title)}
            />
          ))}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        {/* Measure Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select measure:</InputLabel>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              label="Select measure:"
            >
              {metrics.map((metric) => (
                <MenuItem key={metric.title} value={metric.title}>
                  {metric.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* SPC Chart */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              SPC Chart
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              SPC chart with changepoint detection
            </Typography>
            
            <Box sx={{ height: 400, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spcData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${(value as number).toLocaleString()}`, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  
                  {/* Control Limits */}
                  <ReferenceLine y={5200000} stroke="#ff6b6b" strokeDasharray="5 5" label="Control Limit (High)" />
                  <ReferenceLine y={4800000} stroke="#ff6b6b" strokeDasharray="5 5" label="Control Limit (Low)" />
                  
                  {/* Expected/Median Line */}
                  <Line type="monotone" dataKey="expected" stroke="#74c0fc" strokeDasharray="3 3" name="Expected (median)" />
                  
                  {/* Actual Values */}
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                    dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 2, bgcolor: '#1976d2' }} />
                <Typography variant="caption">Actual</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 2, bgcolor: '#74c0fc', opacity: 0.7 }} />
                <Typography variant="caption">Expected (median)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 2, bgcolor: '#ff6b6b' }} />
                <Typography variant="caption">Control Limits (root 1.96)</Typography>
              </Box>
              <Chip label="Limit Violation" color="error" size="small" />
              <Chip label="Run Violation" color="warning" size="small" />
              <Chip label="Detected Change" color="info" size="small" />
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              No persistent shifts detected. The last two extreme data points were Nov 2024 and Oct 2024.
            </Typography>
          </CardContent>
        </Card>

        {/* Forest Plot Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Forest Plot</Typography>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Select dimension:</InputLabel>
                <Select
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value)}
                  label="Select dimension:"
                >
                  {dimensionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 80, bottom: 20, left: 200 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={['dataMin - 500', 'dataMax + 500']} />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    tick={{ fontSize: 10 }}
                    width={180}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `$${(value as number).toLocaleString()}`,
                      name === 'estimate' ? 'Estimate' : name === 'lower' ? 'Lower CI' : 'Upper CI'
                    ]}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  
                  {/* Reference line at system point */}
                  <ReferenceLine x={5276.84} stroke="#666" strokeDasharray="2 2" />
                  
                  {/* Error bars would be drawn manually here */}
                  {currentForestData.map((item: any, index: number) => (
                    <g key={index}>
                      {/* This would typically require custom components for proper forest plot */}
                    </g>
                  ))}
                  
                  <Scatter data={currentForestData} fill="#1976d2">
                    {currentForestData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.estimate > 5276.84 ? "#f44336" : "#4caf50"} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#1976d2', borderRadius: '50%' }} />
                <Typography variant="caption">Actual</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#f44336', borderRadius: '50%' }} />
                <Typography variant="caption">Worse</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%' }} />
                <Typography variant="caption">Better</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#9e9e9e', borderRadius: '50%' }} />
                <Typography variant="caption">Direction of Good</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 2, bgcolor: '#666' }} />
                <Typography variant="caption">Forecast</Typography>
              </Box>
              <Chip label="A" color="primary" size="small" />
              <Typography variant="caption">Cluster</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}