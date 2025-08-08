import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle, Clock, Search, Plus, FileText, Calendar, User, Building, Sparkles, Flag, FormInput, CheckSquare, Square, Loader2, Send, Wand2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { FormPrepopulationDemo } from "./form-prepopulation-demo";

interface PreAuthRequest {
  id: string;
  patientId: string;
  patientName: string;
  memberID: string;
  payer: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  requestDate: string;
  status: "pending" | "approved" | "denied" | "requires_review";
  priority: "standard" | "urgent";
  authRequiredBy: string;
  providerId: string;
  providerName: string;
  diagnosis: string;
  clinicalJustification: string;
  priorAuthNumber: string | null;
  estimatedCost: string;
}

interface InsurerCriteria {
  id: string;
  payer: string;
  procedureCode: string;
  procedureName: string;
  requiresAuth: boolean;
  medicalNecessityCriteria: string[];
  timeFrameRequired: number;
  authValidityDays: number;
  denialReasons: string[];
}

interface ProcedureAuthRequirement {
  id: string;
  procedureCode: string;
  procedureName: string;
  category: string;
  requiresPreAuth: boolean;
  riskLevel: string;
  averageProcessingDays: number;
  approvalRate: number;
  commonDenialReasons: string[];
}

export function PreAuthorizationDashboard() {
  const [selectedTab, setSelectedTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  
  // Bulk operations state
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [isBulkAutoPopulating, setIsBulkAutoPopulating] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkOperationResults, setBulkOperationResults] = useState<{successful: string[], failed: string[]}>({successful: [], failed: []});

  // Helper function to calculate days until procedure
  const calculateDaysUntilProcedure = (scheduledDate: string): number => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    return Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Filter states for pre-auth requests
  const [filterProcedure, setFilterProcedure] = useState("");
  const [filterPayer, setFilterPayer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDaysUntil, setFilterDaysUntil] = useState("");
  
  // Search state for procedure requirements
  const [procedureSearchTerm, setProcedureSearchTerm] = useState("");
  const [selectedPayerFilter, setSelectedPayerFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const queryClient = useQueryClient();

  // Fetch data
  const { data: preAuthRequests = [], isLoading: loadingRequests } = useQuery<PreAuthRequest[]>({
    queryKey: ["/api/pre-auth-requests"]
  });

  const { data: insurerCriteria = [] } = useQuery<InsurerCriteria[]>({
    queryKey: ["/api/insurer-criteria"]
  });

  const { data: procedureRequirements = [] } = useQuery<ProcedureAuthRequirement[]>({
    queryKey: ["/api/procedure-auth-requirements"]
  });

  const getStatusBadge = (status: string, daysUntil: number) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    if (status === "denied") return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
    if (daysUntil <= 3) return <Badge className="bg-red-100 text-red-800">Urgent - {daysUntil} days</Badge>;
    if (status === "requires_review") return <Badge className="bg-yellow-100 text-yellow-800">Review Required</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
  };

  const getPriorityIcon = (priority: string, daysUntil: number) => {
    if (priority === "urgent" || daysUntil <= 3) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getMatchingCriteria = (procedureCode: string, payerName: string) => {
    const criteria = insurerCriteria.find(c => 
      c.procedureCode === procedureCode && c.payer === payerName
    );
    
    if (criteria) {
      return {
        ...criteria,
        payerName: criteria.payer,
        procedureCode: criteria.procedureCode,
        procedureName: criteria.procedureName
      };
    }
    return null;
  };

  // Just return a simple component for now to test if this fixes the issue
  return (
    <div className="flex-1 p-6 space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pre-Authorization Management</h1>
        <div className="text-sm text-gray-600">
          Target: 90% completion 3+ days prior to procedures
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pre-Authorization Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preAuthRequests.map((request) => (
              <div 
                key={request.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getPriorityIcon(request.priority, calculateDaysUntilProcedure(request.scheduledDate))}
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        {getStatusBadge(request.status, calculateDaysUntilProcedure(request.scheduledDate))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Procedure: {request.procedureCode} - {request.procedureName}</p>
                        <p>Payer: {request.payer}</p>
                        <p>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${request.estimatedCost ? parseFloat(request.estimatedCost).toLocaleString() : "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}