import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Users,
  Shield,
  Activity,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Healthcare Revenue Cycle
              </span>
            </div>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-[#006d9a] hover:bg-[#006d9a]/90 text-white"
              data-testid="button-login"
            >
              <Shield className="h-4 w-4 mr-2" />
              Staff Login
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Advanced Healthcare
            <span className="text-blue-600"> Revenue Cycle Management</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Comprehensive analytics platform for denial management, AR optimization, 
            collections tracking, and predictive insights with role-based access control.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button 
              onClick={() => window.location.href = "/api/login"}
              size="lg"
              className="w-full sm:w-auto bg-[#006d9a] hover:bg-[#006d9a]/90 text-white"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Comprehensive Revenue Cycle Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to optimize healthcare revenue operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Denial Management */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Denial Management
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced denial tracking, clinical review workflows, appeal management, 
                and reason analysis with prevention strategies.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Clinical denial workflows</li>
                <li>• Appeal tracking & success rates</li>
                <li>• Prevention recommendations</li>
                <li>• Payer-specific patterns</li>
              </ul>
            </CardContent>
          </Card>

          {/* AR Management */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  AR Management
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Statistical process control for AR trends, aging analysis, 
                financial performance tracking with changepoint detection.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• SPC charting & analysis</li>
                <li>• AR aging breakdown</li>
                <li>• Trend analysis</li>
                <li>• Performance metrics</li>
              </ul>
            </CardContent>
          </Card>

          {/* Collections */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Collections Analytics
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Discharge location performance analysis, payer class breakdowns, 
                aging subcategories, and priority account management.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Discharge location analysis</li>
                <li>• Payer class tracking</li>
                <li>• High-priority accounts</li>
                <li>• Performance benchmarks</li>
              </ul>
            </CardContent>
          </Card>

          {/* Timely Filing */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Timely Filing
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Critical claims deadline monitoring, department performance tracking, 
                and automated risk assessment for filing deadlines.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Deadline monitoring</li>
                <li>• Risk assessment</li>
                <li>• Department performance</li>
                <li>• Automated alerts</li>
              </ul>
            </CardContent>
          </Card>

          {/* Predictive Analytics */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-[#6e53a3]" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  AI Predictions
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                OpenAI-powered denial risk scoring, pattern recognition, 
                intelligent recommendations, and predictive insights.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Denial risk scoring</li>
                <li>• Pattern recognition</li>
                <li>• Smart recommendations</li>
                <li>• Predictive modeling</li>
              </ul>
            </CardContent>
          </Card>

          {/* Role-Based Access */}
          <Card className="healthcare-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Role-Based Access
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Comprehensive RBAC system for healthcare staff with 10 standard roles, 
                permission management, and audit logging.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 10 healthcare roles</li>
                <li>• Permission management</li>
                <li>• Audit trail</li>
                <li>• Department access</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Healthcare Roles Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Built for Healthcare Teams
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored access levels for every role in your revenue cycle operation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { role: "System Admin", color: "bg-red-100 text-red-800", level: "Full Access" },
              { role: "Clinical Director", color: "bg-purple-100 text-purple-800", level: "Clinical Oversight" },
              { role: "Revenue Manager", color: "bg-[#006d9a]/20 text-[#006d9a]", level: "Complete RCM" },
              { role: "Billing Manager", color: "bg-green-100 text-green-800", level: "Billing & AR" },
              { role: "Clinical Reviewer", color: "bg-indigo-100 text-indigo-800", level: "Clinical Review" },
              { role: "Denial Specialist", color: "bg-orange-100 text-orange-800", level: "Denial Focus" },
              { role: "AR Specialist", color: "bg-teal-100 text-teal-800", level: "AR Management" },
              { role: "Collections", color: "bg-pink-100 text-pink-800", level: "Collections" },
              { role: "Financial Analyst", color: "bg-cyan-100 text-cyan-800", level: "Analytics" },
              { role: "Read Only", color: "bg-gray-100 text-gray-800", level: "View Only" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${item.color} mb-2`}>
                  {item.role}
                </div>
                <p className="text-xs text-gray-500">{item.level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#006d9a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Optimize Your Revenue Cycle?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Access comprehensive analytics and insights tailored for your healthcare role.
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => window.location.href = "/api/login"}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Shield className="h-4 w-4 mr-2" />
                Login with Healthcare Credentials
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 mr-2" />
              <span className="font-semibold">Healthcare Revenue Cycle Management</span>
            </div>
            <p className="text-sm">
              Secure • HIPAA Compliant • Role-Based Access • Audit Logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}