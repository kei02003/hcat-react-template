import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Heart, 
  Stethoscope, 
  TrendingUp, 
  Users,
  Eye,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample patient monitoring data
const patientMonitoringData = [
  {
    id: "pt-001",
    patientName: "Robert Johnson",
    admissionId: "ADM-2024-001",
    currentStatus: "observation",
    recommendedStatus: "inpatient",
    admissionDate: "2024-08-10T14:30:00",
    lengthOfStay: 36,
    primaryDiagnosis: "Heart Failure with Reduced EF",
    payer: "Medicare",
    department: "Cardiology",
    physician: "Dr. Chen",
    complianceScore: 0.92,
    alerts: ["Status upgrade recommended", "24-hour milestone reached"]
  },
  {
    id: "pt-002",
    patientName: "Maria Garcia",
    admissionId: "ADM-2024-002",
    currentStatus: "inpatient",
    recommendedStatus: "inpatient",
    admissionDate: "2024-08-09T08:15:00",
    lengthOfStay: 52,
    primaryDiagnosis: "Pneumonia with Complications",
    payer: "Blue Cross",
    department: "Internal Medicine",
    physician: "Dr. Wilson",
    complianceScore: 0.88,
    alerts: []
  },
  {
    id: "pt-003",
    patientName: "James Wilson",
    admissionId: "ADM-2024-003",
    currentStatus: "inpatient",
    recommendedStatus: "observation",
    admissionDate: "2024-08-11T19:45:00",
    lengthOfStay: 18,
    primaryDiagnosis: "Chest Pain, Rule Out MI",
    payer: "Aetna",
    department: "Emergency Department",
    physician: "Dr. Davis",
    complianceScore: 0.75,
    alerts: ["Status downgrade suggested", "Insufficient justification for inpatient"]
  }
];

// Clinical indicators sample data
const clinicalIndicators = [
  {
    patientId: "pt-001",
    indicators: [
      { type: "vital_signs", name: "Heart Rate", value: "102", unit: "bpm", isAbnormal: true },
      { type: "lab_results", name: "BNP", value: "850", unit: "pg/mL", isAbnormal: true },
      { type: "medications", name: "IV Furosemide", value: "40mg", isAbnormal: false },
      { type: "vital_signs", name: "O2 Saturation", value: "89%", unit: "%", isAbnormal: true }
    ]
  }
];

// Real-time alerts data
const realTimeAlerts = [
  {
    id: "alert-001",
    patientName: "Robert Johnson",
    alertType: "status_change",
    priority: "high",
    title: "Status Upgrade Recommended",
    message: "Clinical indicators support inpatient status: IV diuretics, hypoxia, elevated BNP",
    department: "Cardiology",
    timeAgo: "15 min ago"
  },
  {
    id: "alert-002",
    patientName: "Sarah Martinez",
    alertType: "documentation_gap",
    priority: "medium",
    title: "Missing Documentation",
    message: "Medical necessity documentation incomplete for observation status",
    department: "Internal Medicine",
    timeAgo: "32 min ago"
  },
  {
    id: "alert-003",
    patientName: "David Kim",
    alertType: "coding_opportunity",
    priority: "low",
    title: "CC/MCC Opportunity",
    message: "Additional diagnosis codes available based on clinical indicators",
    department: "Oncology",
    timeAgo: "1 hour ago"
  }
];

// Compliance metrics data
const complianceData = [
  { month: "Feb", accuracy: 92.3, target: 95 },
  { month: "Mar", accuracy: 93.1, target: 95 },
  { month: "Apr", accuracy: 94.2, target: 95 },
  { month: "May", accuracy: 95.8, target: 95 },
  { month: "Jun", accuracy: 96.1, target: 95 },
  { month: "Jul", accuracy: 95.4, target: 95 }
];

const statusDistribution = [
  { name: "Compliant", value: 89, color: "#22c55e" },
  { name: "Needs Review", value: 8, color: "#f59e0b" },
  { name: "Non-Compliant", value: 3, color: "#ef4444" }
];

function StatusBadge({ status }: { status: string }) {
  const variants = {
    inpatient: "bg-red-100 text-red-800",
    observation: "bg-yellow-100 text-yellow-800",
    outpatient: "bg-blue-100 text-blue-800",
    emergency: "bg-purple-100 text-purple-800"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
}

function AlertBadge({ priority }: { priority: string }) {
  const variants = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900"
  };
  
  return (
    <Badge className={variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {priority}
    </Badge>
  );
}

export function ClinicalDecisionDashboard() {
  const [selectedTab, setSelectedTab] = useState("monitoring");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patientMonitoringData.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6" data-testid="clinical-decision-dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Decision Support</h1>
          <p className="text-gray-600 mt-2">Real-time patient status monitoring and documentation alerts</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" data-testid="button-new-review">
          <Stethoscope className="mr-2 h-4 w-4" />
          New Review
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status Accuracy</p>
                <p className="text-2xl font-bold text-green-600">95.4%</p>
                <p className="text-xs text-green-600 mt-1">↑ 0.4% from target</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
                <p className="text-xs text-red-600 mt-1">↑ 3 from yesterday</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CC/MCC Capture</p>
                <p className="text-2xl font-bold text-blue-600">87.2%</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% this quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients Monitored</p>
                <p className="text-2xl font-bold text-purple-600">147</p>
                <p className="text-xs text-gray-600 mt-1">Real-time tracking</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitoring">Patient Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Real-Time Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="criteria">Clinical Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search patients, diagnoses, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              data-testid="input-search-patients"
            />
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
                <SelectItem value="status_mismatch">Status Mismatch</SelectItem>
                <SelectItem value="high_risk">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patient Monitoring Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alerts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{patient.patientName}</div>
                            <div className="text-sm text-gray-500">{patient.primaryDiagnosis}</div>
                            <div className="text-sm text-gray-500">{patient.department} • {patient.physician}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={patient.currentStatus} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={patient.recommendedStatus} />
                          {patient.currentStatus !== patient.recommendedStatus && (
                            <AlertCircle className="h-4 w-4 text-orange-500 inline ml-2" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{patient.lengthOfStay}h</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {(patient.complianceScore * 100).toFixed(1)}%
                            </div>
                            <div 
                              className={`ml-2 h-2 w-8 rounded ${
                                patient.complianceScore >= 0.9 ? 'bg-green-400' : 
                                patient.complianceScore >= 0.8 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {patient.alerts.length > 0 ? (
                            <Badge className="bg-orange-100 text-orange-800">
                              {patient.alerts.length} alert{patient.alerts.length > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${patient.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {patient.alerts.length > 0 && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Review
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {realTimeAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertBadge priority={alert.priority} />
                        <span className="text-sm text-gray-500">{alert.timeAgo}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{alert.title}</h3>
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{alert.patientName}</span> • {alert.department}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Status Accuracy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[85, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Actual" />
                      <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Compliance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="text-center">
                      <div 
                        className="w-4 h-4 rounded-full mx-auto mb-1" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="text-sm font-medium">{item.value}%</div>
                      <div className="text-xs text-gray-500">{item.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">12.3%</div>
                  <div className="text-sm text-gray-600">Status Changes Implemented</div>
                  <div className="text-xs text-green-600 mt-1">↑ 3.2% revenue impact</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">94.8%</div>
                  <div className="text-sm text-gray-600">Documentation Accuracy</div>
                  <div className="text-xs text-green-600 mt-1">Above 90% target</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">2.1 hrs</div>
                  <div className="text-sm text-gray-600">Avg Alert Response Time</div>
                  <div className="text-xs text-green-600 mt-1">Under 4 hour target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Criteria Management</CardTitle>
              <p className="text-sm text-gray-600">
                Configure payer-specific clinical guidelines and thresholds
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Clinical Guidelines Database</h3>
                  <p className="text-gray-600 mb-4">
                    Set up insurer-specific clinical criteria for status determination and medical necessity validation.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Configure Guidelines
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}