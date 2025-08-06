import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Send,
  Brain,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Sample appeal data
const appealData = [
  {
    id: "app-001",
    claimId: "CLM-2024-001",
    patientName: "Robert Johnson",
    payer: "Blue Cross Blue Shield",
    denialReason: "Inappropriate inpatient status",
    denialCode: "CO-119",
    denialDate: "2024-08-05",
    claimAmount: 45000,
    successProbability: 0.85,
    priorityScore: 92,
    status: "generated",
    appealDeadline: "2024-09-04",
    daysUntilDeadline: 25,
    appealType: "written_appeal",
    appealLevel: "first_level"
  },
  {
    id: "app-002", 
    claimId: "CLM-2024-002",
    patientName: "Sarah Davis",
    payer: "Medicare",
    denialReason: "Medical necessity not established",
    denialCode: "CO-50",
    denialDate: "2024-08-03",
    claimAmount: 28000,
    successProbability: 0.72,
    priorityScore: 88,
    status: "pending_generation",
    appealDeadline: "2024-09-02",
    daysUntilDeadline: 23,
    appealType: "peer_to_peer",
    appealLevel: "first_level"
  },
  {
    id: "app-003",
    claimId: "CLM-2024-003", 
    patientName: "Michael Chen",
    payer: "Aetna",
    denialReason: "DRG mismatch - coding error",
    denialCode: "CO-197",
    denialDate: "2024-07-28",
    claimAmount: 15000,
    successProbability: 0.91,
    priorityScore: 95,
    status: "submitted",
    appealDeadline: "2024-08-27",
    daysUntilDeadline: 17,
    appealType: "written_appeal",
    appealLevel: "first_level"
  }
];

// Appeal success metrics
const successMetrics = [
  { month: "Feb", firstLevel: 78, secondLevel: 65, external: 45 },
  { month: "Mar", firstLevel: 82, secondLevel: 68, external: 48 },
  { month: "Apr", firstLevel: 85, secondLevel: 72, external: 52 },
  { month: "May", firstLevel: 79, secondLevel: 69, external: 49 },
  { month: "Jun", firstLevel: 87, secondLevel: 75, external: 54 },
  { month: "Jul", firstLevel: 89, secondLevel: 73, external: 51 }
];

// Denial reason analysis
const denialReasonData = [
  { reason: "Medical Necessity", count: 45, successRate: 85, color: "#3b82f6" },
  { reason: "Inappropriate Status", count: 32, successRate: 78, color: "#f59e0b" },
  { reason: "DRG Mismatch", count: 28, successRate: 92, color: "#22c55e" },
  { reason: "Prior Auth Missing", count: 18, successRate: 65, color: "#ef4444" },
  { reason: "Documentation Gap", count: 15, successRate: 88, color: "#8b5cf6" }
];

// Template performance data
const templatePerformance = [
  { name: "Heart Failure - Inpatient Status", usage: 24, successRate: 0.87, lastUpdated: "2024-07-15" },
  { name: "Medical Necessity - Surgery", usage: 18, successRate: 0.91, lastUpdated: "2024-07-20" },
  { name: "DRG Mismatch - General", usage: 15, successRate: 0.94, lastUpdated: "2024-07-10" },
  { name: "Prior Auth - Commercial", usage: 12, successRate: 0.72, lastUpdated: "2024-07-25" }
];

function StatusBadge({ status }: { status: string }) {
  const variants = {
    pending_generation: "bg-yellow-100 text-yellow-800",
    generated: "bg-blue-100 text-blue-800",
    reviewed: "bg-purple-100 text-purple-800",
    submitted: "bg-green-100 text-green-800",
    approved: "bg-green-200 text-green-900",
    denied: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

function PriorityBadge({ score }: { score: number }) {
  if (score >= 90) return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
  if (score >= 80) return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
  if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
  return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
}

export function AppealGenerationDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  const filteredAppeals = appealData.filter(appeal => {
    const matchesFilter = selectedFilter === "all" || appeal.status === selectedFilter;
    const matchesSearch = appeal.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appeal.denialReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appeal.payer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6" data-testid="appeal-generation-dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automated Appeal Generation</h1>
          <p className="text-gray-600 mt-2">AI-powered challenge letter generation and appeal management</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700" 
          onClick={() => setShowGenerationModal(true)}
          data-testid="button-generate-appeal"
        >
          <Zap className="mr-2 h-4 w-4" />
          Generate Appeal
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appeals Generated</p>
                <p className="text-2xl font-bold text-purple-600">127</p>
                <p className="text-xs text-green-600 mt-1">↑ 18% this month</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">89.2%</p>
                <p className="text-xs text-green-600 mt-1">Above 70% target</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Generation Time</p>
                <p className="text-2xl font-bold text-blue-600">3.2 min</p>
                <p className="text-xs text-green-600 mt-1">85% faster than manual</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Recovered</p>
                <p className="text-2xl font-bold text-green-600">$2.1M</p>
                <p className="text-xs text-green-600 mt-1">↑ 15% this quarter</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appeals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appeals">Active Appeals</TabsTrigger>
          <TabsTrigger value="templates">Letter Templates</TabsTrigger>
          <TabsTrigger value="analytics">Success Analytics</TabsTrigger>
          <TabsTrigger value="patterns">Denial Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="appeals" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search appeals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              data-testid="input-search-appeals"
            />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_generation">Pending Generation</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appeals Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denial Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Probability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppeals.map((appeal) => (
                      <tr key={appeal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{appeal.patientName}</div>
                            <div className="text-sm text-gray-500">{appeal.claimId}</div>
                            <div className="text-sm text-gray-500">{appeal.payer}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{appeal.denialReason}</div>
                            <div className="text-sm text-gray-500">{appeal.denialCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${appeal.claimAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {(appeal.successProbability * 100).toFixed(0)}%
                            </div>
                            <div 
                              className={`ml-2 h-2 w-8 rounded ${
                                appeal.successProbability >= 0.8 ? 'bg-green-400' : 
                                appeal.successProbability >= 0.7 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <PriorityBadge score={appeal.priorityScore} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={appeal.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">{appeal.appealDeadline}</div>
                            <div className={`text-sm ${
                              appeal.daysUntilDeadline <= 7 ? 'text-red-600' : 
                              appeal.daysUntilDeadline <= 14 ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {appeal.daysUntilDeadline} days left
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${appeal.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {appeal.status === "generated" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          {appeal.status === "reviewed" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Send className="h-4 w-4 mr-1" />
                              Submit
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appeal Letter Templates</CardTitle>
              <p className="text-sm text-gray-600">
                Manage and optimize AI-powered appeal letter templates
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templatePerformance.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">Used {template.usage} times</span>
                        <span className="text-sm text-green-600">
                          {(template.successRate * 100).toFixed(0)}% success rate
                        </span>
                        <span className="text-sm text-gray-500">Updated {template.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Stats
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Success Rate Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Appeal Success Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={successMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="firstLevel" stroke="#3b82f6" name="First Level" />
                      <Line type="monotone" dataKey="secondLevel" stroke="#f59e0b" name="Second Level" />
                      <Line type="monotone" dataKey="external" stroke="#ef4444" name="External Review" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border rounded bg-green-50">
                    <div className="text-3xl font-bold text-green-600 mb-2">$2.1M</div>
                    <div className="text-lg text-green-800 mb-1">Total Recovered</div>
                    <div className="text-sm text-green-600">↑ 15% vs last quarter</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-xl font-semibold text-gray-900">$387K</div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-xl font-semibold text-gray-900">$42K</div>
                      <div className="text-sm text-gray-600">Avg per Appeal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">127</div>
                  <div className="text-sm text-gray-600">Appeals Generated</div>
                  <div className="text-xs text-green-600 mt-1">100% within 5 days</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">3.2 min</div>
                  <div className="text-sm text-gray-600">Avg Generation Time</div>
                  <div className="text-xs text-green-600 mt-1">vs 4 hours manual</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">89.2%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-xs text-green-600 mt-1">Above 70% target</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">23%</div>
                  <div className="text-sm text-gray-600">Denial Reduction</div>
                  <div className="text-xs text-green-600 mt-1">Above 20% target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Denial Pattern Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Analyze denial patterns to improve appeal strategies and prevent future denials
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={denialReasonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="reason"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {denialReasonData.map((item, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.reason}</h4>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Count: {item.count}</div>
                      <div className="text-green-600">Success Rate: {item.successRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appeal Generation Modal */}
      {showGenerationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Generate New Appeal</CardTitle>
              <p className="text-sm text-gray-600">
                AI will analyze the denial and generate a comprehensive appeal letter
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim ID</label>
                <Input placeholder="CLM-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Denial Reason</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select denial reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical_necessity">Medical Necessity</SelectItem>
                    <SelectItem value="inappropriate_status">Inappropriate Status</SelectItem>
                    <SelectItem value="drg_mismatch">DRG Mismatch</SelectItem>
                    <SelectItem value="prior_auth">Prior Authorization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <Textarea 
                  placeholder="Any specific clinical evidence or documentation to highlight..."
                  className="h-24"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowGenerationModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowGenerationModal(false)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Appeal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}