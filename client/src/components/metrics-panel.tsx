import {
  Box,
  Paper,
  Typography,
  Drawer,
} from '@mui/material';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  status?: "positive" | "negative" | "warning" | "neutral";
  borderColor?: string;
}

function MetricCard({ title, value, subtitle, status = "neutral", borderColor }: MetricCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColorMUI = () => {
    switch (status) {
      case "positive":
        return "success.main";
      case "negative":
        return "error.main";
      case "warning":
        return "warning.main";
      default:
        return "text.secondary";
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case "positive":
        return "success.main";
      case "negative":
        return "error.main";
      case "warning":
        return "warning.main";
      default:
        return "divider";
    }
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        borderLeft: 4, 
        borderLeftColor: getBorderColor(),
        bgcolor: 'background.paper',
      }}
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {getStatusIcon()}
      </Box>
      <Typography variant="caption" sx={{ color: getStatusColorMUI() }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}

export function MetricsPanel() {
  return (
    <Box 
      component="aside" 
      sx={{ 
        width: '20%', 
        bgcolor: 'background.default',
        borderRight: 1,
        borderColor: 'divider',
        p: 2, 
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MetricCard
          title="Total AR"
          value="$912.79K"
          subtitle="Avg: 399.46K (+128.51%)"
          status="positive"
        />
        
        <MetricCard
          title="AR Days"
          value="44.7"
          subtitle="Avg: 40.4 (+10.73%)"
          status="positive"
        />
        
        <MetricCard
          title="Denied Dollars"
          value="$57.32K"
          subtitle="Avg: $51.35K (+11.62%)"
          status="negative"
        />
        
        <MetricCard
          title="Documentation Requests"
          value="342"
          subtitle="2nd highest denial type"
          status="warning"
        />
        
        <MetricCard
          title="Redundant Doc Requests"
          value="128"
          subtitle="37% of total"
          status="negative"
        />
        
        <MetricCard
          title="Timely Filing at Risk"
          value="$142.5K"
          subtitle="47 claims"
          status="negative"
        />
        
        <MetricCard
          title="Appeal Window Expiring"
          value="$38.2K"
          subtitle="15 claims <30 days"
          status="warning"
        />
        
        <MetricCard
          title="Auto-Detected Duplicates"
          value="89"
          subtitle="$67.8K recoverable"
          status="positive"
        />
        
        <MetricCard
          title="Clean Claim Rate"
          value="88%"
          subtitle="Target: 98%"
          status="neutral"
        />
        
        <MetricCard
          title="Doc Request Response Time"
          value="6.2 days"
          subtitle="Target: <3 days"
          status="neutral"
        />
        
        <MetricCard
          title="Payments"
          value="($232.62K)"
          subtitle="Avg: ($185.58K) (-25.35%)"
          status="negative"
        />
      </Box>
    </Box>
  );
}
