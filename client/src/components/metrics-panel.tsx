import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card 
      className={`healthcare-card ${borderColor ? `border-l-4 ${borderColor}` : ''}`}
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-4">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
          {value}
          {getStatusIcon()}
        </div>
        <div className={`text-xs ${getStatusColor()}`}>{subtitle}</div>
      </CardContent>
    </Card>
  );
}

export function MetricsPanel() {
  return (
    <aside className="w-1/5 healthcare-sidebar p-4 overflow-y-auto">
      <div className="space-y-4">
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
          borderColor="border-l-yellow-500"
        />
        
        <MetricCard
          title="Redundant Doc Requests"
          value="128"
          subtitle="37% of total"
          status="negative"
          borderColor="border-l-red-500"
        />
        
        <MetricCard
          title="Timely Filing at Risk"
          value="$142.5K"
          subtitle="47 claims"
          status="negative"
          borderColor="border-l-red-500"
        />
        
        <MetricCard
          title="Appeal Window Expiring"
          value="$38.2K"
          subtitle="15 claims <30 days"
          status="warning"
          borderColor="border-l-yellow-500"
        />
        
        <MetricCard
          title="Auto-Detected Duplicates"
          value="89"
          subtitle="$67.8K recoverable"
          status="positive"
          borderColor="border-l-green-500"
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
      </div>
    </aside>
  );
}
