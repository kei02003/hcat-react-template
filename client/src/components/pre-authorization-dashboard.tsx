import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Users, FileText, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Sample data for demonstration
const preAuthData = [
  {
    id: "pa-001",
    patientName: "John Smith",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    scheduledDate: "2024-08-15",
    payer: "Blue Cross Blue Shield",
    status: "approved",
    submissionDate: "2024-08-01",
    responseDate: "2024-08-03",
    daysToComplete: 2,
    authNumber: "AUTH-12345",
    estimatedCost: 45000,
    department: "Orthopedics",
    provider: "Dr. Johnson",
    priority: "routine"
  },
  {
    id: "pa-002",
    patientName: "Sarah Davis",
    procedureCode: "33533",
    procedureName: "Coronary Artery Bypass",
    scheduledDate: "2024-08-12",
    payer: "Medicare",
    status: "pending",
    submissionDate: "2024-08-05",
    daysToComplete: null,
    estimatedCost: 75000,
    department: "Cardiology",
    provider: "Dr. Chen",
    priority: "urgent"
  },
  {
    id: "pa-003",
    patientName: "Michael Johnson",
    procedureCode: "43644",
    procedureName: "Laparoscopic Gastric Bypass",
    scheduledDate: "2024-08-18",
    payer: "Aetna",
    status: "denied",
    submissionDate: "2024-07-28",
    responseDate: "2024-08-02",
    daysToComplete: 5,
    estimatedCost: 38000,
    department: "General Surgery",
    provider: "Dr. Martinez",
    priority: "routine"
  }
];

const completionTimeData = [
  { department: "Cardiology", avgDays: 2.1, target: 3, completed90Percent: 94 },
  { department: "Orthopedics", avgDays: 2.8, target: 3, completed90Percent: 87 },
  { department: "General Surgery", avgDays: 3.2, target: 3, completed90Percent: 82 },
  { department: "Neurology", avgDays: 2.5, target: 3, completed90Percent: 91 },
  { department: "Oncology", avgDays: 1.8, target: 3, completed90Percent: 96 }
];

const statusData = [
  { name: "Approved", value: 156, color: "#22c55e" },
  { name: "Pending", value: 43, color: "#f59e0b" },
  { name: "Denied", value: 12, color: "#ef4444" },
  { name: "Expired", value: 5, color: "#6b7280" }
];

const trendsData = [
  { month: "Feb", submitted: 180, approved: 165, denied: 15 },
  { month: "Mar", submitted: 195, approved: 178, denied: 17 },
  { month: "Apr", submitted: 210, approved: 192, denied: 18 },
  { month: "May", submitted: 225, approved: 205, denied: 20 },
  { month: "Jun", submitted: 240, approved: 218, denied: 22 },
  { month: "Jul", submitted: 216, approved: 201, denied: 15 }
];

function StatusBadge({ status }: { status: string }) {
  const variants = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    denied: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants = {
    routine: "bg-blue-100 text-blue-800",
    urgent: "bg-orange-100 text-orange-800",
    emergent: "bg-red-100 text-red-800"
  };
  
  return (
    <Badge className={variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {priority}
    </Badge>
  );
}

export function PreAuthorizationDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = preAuthData.filter(item => {
    const matchesFilter = selectedFilter === "all" || item.status === selectedFilter;
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.procedureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.payer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6" data-testid="pre-authorization-dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Authorization Management</h1>
          <p className="text-gray-600 mt-2">Streamline pre-authorizations and ensure timely approvals</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-new-request">
          <FileText className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">216</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-green-600">93.1%</p>
                <p className="text-xs text-green-600 mt-1">↑ 2.1% from target</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-blue-600">2.4 days</p>
                <p className="text-xs text-green-600 mt-1">0.6 days under target</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">3+ Days Prior</p>
                <p className="text-2xl font-bold text-purple-600">89.7%</p>
                <p className="text-xs text-red-600 mt-1">0.3% below target</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="requests">Active Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="criteria">Insurer Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Request Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Completion Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={completionTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="department" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgDays" fill="#3b82f6" name="Avg Days" />
                      <Bar dataKey="target" fill="#ef4444" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="submitted" stroke="#8884d8" name="Submitted" />
                    <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
                    <Line type="monotone" dataKey="denied" stroke="#ffc658" name="Denied" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search patients, procedures, or payers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              data-testid="input-search"
            />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48" data-testid="select-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days to Complete</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.patientName}</div>
                            <div className="text-sm text-gray-500">{request.department}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.procedureName}</div>
                            <div className="text-sm text-gray-500">{request.procedureCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{request.payer}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{request.scheduledDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.daysToComplete ? `${request.daysToComplete} days` : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm" data-testid={`button-view-${request.id}`}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completionTimeData.map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">{dept.department}</h4>
                        <p className="text-sm text-gray-600">{dept.completed90Percent}% completed 3+ days prior</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{dept.avgDays} days avg</p>
                        <p className={`text-sm ${dept.avgDays <= dept.target ? 'text-green-600' : 'text-red-600'}`}>
                          Target: {dept.target} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-red-900">High Risk Procedures</h4>
                      <p className="text-sm text-red-700">7 procedures scheduled within 2 days requiring urgent pre-auth</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded border-yellow-200 bg-yellow-50">
                    <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Pending Reviews</h4>
                      <p className="text-sm text-yellow-700">43 requests pending payer response</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded border-blue-200 bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-900">Staff Workload</h4>
                      <p className="text-sm text-blue-700">Authorization team at 85% capacity this week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurer Criteria Management</CardTitle>
              <p className="text-sm text-gray-600">
                Manage and update payer-specific pre-authorization requirements
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Coming soon placeholder */}
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Insurer Criteria Database</h3>
                  <p className="text-gray-600 mb-4">
                    Configure BCBS medical necessity guidelines, Medicare requirements, and other payer-specific criteria.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Configure Criteria
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