import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Target,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Wand2,
  ArrowRight,
  Copy,
  Settings
} from "lucide-react";

interface PatientDataField {
  path: string;
  label: string;
  type: string;
  example: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "checkbox" | "number";
  required: boolean;
  position: { x: number; y: number; page: number };
  mappedTo?: string;
  confidence?: number;
  validationRules?: string[];
}

interface FieldMappingProps {
  templateFields: TemplateField[];
  onMappingChange: (fieldId: string, mapping: string) => void;
  onSave: () => void;
  templateName: string;
}

const PATIENT_DATA_FIELDS: PatientDataField[] = [
  // Patient Demographics
  { path: "patient.firstName", label: "Patient First Name", type: "string", example: "Sarah" },
  { path: "patient.lastName", label: "Patient Last Name", type: "string", example: "Johnson" },
  { path: "patient.middleInitial", label: "Patient Middle Initial", type: "string", example: "M" },
  { path: "patient.fullName", label: "Patient Full Name", type: "string", example: "Johnson, Sarah M" },
  { path: "patient.dateOfBirth", label: "Date of Birth", type: "date", example: "1985-03-15" },
  { path: "patient.ssn", label: "Social Security Number", type: "string", example: "***-**-1234" },
  { path: "patient.phoneNumber", label: "Phone Number", type: "string", example: "(555) 123-4567" },
  { path: "patient.address.street", label: "Street Address", type: "string", example: "123 Main St" },
  { path: "patient.address.city", label: "City", type: "string", example: "Las Vegas" },
  { path: "patient.address.state", label: "State", type: "string", example: "NV" },
  { path: "patient.address.zipCode", label: "ZIP Code", type: "string", example: "89101" },
  
  // Insurance Information
  { path: "insurance.primaryInsurer", label: "Primary Insurance", type: "string", example: "Nevada Medicaid" },
  { path: "insurance.memberId", label: "Member ID", type: "string", example: "NV12345678" },
  { path: "insurance.subscriberId", label: "Subscriber ID", type: "string", example: "SUB789012" },
  { path: "insurance.groupNumber", label: "Group Number", type: "string", example: "GRP001" },
  { path: "insurance.planName", label: "Plan Name", type: "string", example: "Nevada Medicaid Managed Care" },
  
  // Clinical Information
  { path: "diagnosis.primary.code", label: "Primary Diagnosis Code", type: "string", example: "M25.511" },
  { path: "diagnosis.primary.description", label: "Primary Diagnosis Description", type: "string", example: "Pain in right shoulder" },
  { path: "diagnosis.secondary.codes", label: "Secondary Diagnosis Codes", type: "array", example: "M79.1, Z87.891" },
  { path: "procedure.cpt", label: "Procedure CPT Code", type: "string", example: "29827" },
  { path: "procedure.description", label: "Procedure Description", type: "string", example: "Arthroscopy, shoulder, surgical" },
  { path: "procedure.scheduledDate", label: "Scheduled Procedure Date", type: "date", example: "2024-12-15" },
  { path: "clinical.symptoms", label: "Clinical Symptoms", type: "text", example: "Severe shoulder pain limiting range of motion" },
  { path: "clinical.duration", label: "Symptom Duration", type: "string", example: "6 months" },
  { path: "clinical.priorTreatments", label: "Prior Treatments", type: "text", example: "Physical therapy, NSAIDs, steroid injections" },
  { path: "clinical.labResults", label: "Lab Results", type: "text", example: "WBC: 8.2, ESR: 15, CRP: <3" },
  { path: "clinical.imagingResults", label: "Imaging Results", type: "text", example: "MRI shows rotator cuff tear" },
  
  // Provider Information
  { path: "provider.ordering.name", label: "Ordering Provider Name", type: "string", example: "Dr. Michael Chen" },
  { path: "provider.ordering.npi", label: "Ordering Provider NPI", type: "string", example: "1234567890" },
  { path: "provider.ordering.phone", label: "Ordering Provider Phone", type: "string", example: "(555) 987-6543" },
  { path: "provider.facility.name", label: "Facility Name", type: "string", example: "Nevada Medical Center" },
  { path: "provider.facility.npi", label: "Facility NPI", type: "string", example: "0987654321" },
  { path: "provider.facility.address", label: "Facility Address", type: "string", example: "456 Hospital Blvd, Las Vegas, NV 89102" },
  
  // Service Details
  { path: "service.type", label: "Service Type", type: "string", example: "Surgical" },
  { path: "service.urgency", label: "Service Urgency", type: "string", example: "Elective" },
  { path: "service.lengthOfStay", label: "Estimated Length of Stay", type: "string", example: "Outpatient" },
  { path: "service.dischargeplan", label: "Discharge Plan", type: "text", example: "Home with physical therapy" }
];

export function TemplateFieldMapper({ templateFields, onMappingChange, onSave, templateName }: FieldMappingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPreview, setShowPreview] = useState(false);
  const [autoMappingInProgress, setAutoMappingInProgress] = useState(false);

  const categories = [
    { value: "all", label: "All Fields" },
    { value: "demographics", label: "Patient Demographics" },
    { value: "insurance", label: "Insurance Information" },
    { value: "clinical", label: "Clinical Information" },
    { value: "provider", label: "Provider Information" },
    { value: "service", label: "Service Details" }
  ];

  const filteredPatientFields = PATIENT_DATA_FIELDS.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    
    const categoryMatch = 
      (selectedCategory === "demographics" && field.path.startsWith("patient.")) ||
      (selectedCategory === "insurance" && field.path.startsWith("insurance.")) ||
      (selectedCategory === "clinical" && (field.path.startsWith("diagnosis.") || field.path.startsWith("procedure.") || field.path.startsWith("clinical."))) ||
      (selectedCategory === "provider" && field.path.startsWith("provider.")) ||
      (selectedCategory === "service" && field.path.startsWith("service."));
    
    return matchesSearch && categoryMatch;
  });

  const handleAutoMapping = async () => {
    setAutoMappingInProgress(true);
    
    // Simulate AI-powered auto-mapping
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    templateFields.forEach(field => {
      // Smart mapping logic based on field labels
      const fieldLabelLower = field.label.toLowerCase();
      let bestMatch = "";
      let confidence = 0;
      
      // Look for the best matching patient data field
      PATIENT_DATA_FIELDS.forEach(patientField => {
        const patientLabelLower = patientField.label.toLowerCase();
        const pathLower = patientField.path.toLowerCase();
        
        // Direct label match
        if (fieldLabelLower.includes(patientLabelLower.replace("patient ", "")) ||
            patientLabelLower.includes(fieldLabelLower)) {
          if (confidence < 100) {
            bestMatch = patientField.path;
            confidence = 100;
          }
        }
        
        // Semantic matching
        const semanticMatches = [
          { template: "recipient name", patient: "patient.fullName", conf: 95 },
          { template: "recipient id", patient: "insurance.memberId", conf: 90 },
          { template: "member id", patient: "insurance.memberId", conf: 100 },
          { template: "dob", patient: "patient.dateOfBirth", conf: 100 },
          { template: "date of birth", patient: "patient.dateOfBirth", conf: 100 },
          { template: "ordering provider", patient: "provider.ordering.name", conf: 95 },
          { template: "facility name", patient: "provider.facility.name", conf: 95 },
          { template: "diagnosis", patient: "diagnosis.primary.description", conf: 85 },
          { template: "procedure", patient: "procedure.description", conf: 85 },
          { template: "admission date", patient: "procedure.scheduledDate", conf: 90 },
          { template: "severity", patient: "clinical.symptoms", conf: 75 },
          { template: "intensity", patient: "clinical.priorTreatments", conf: 75 }
        ];
        
        semanticMatches.forEach(match => {
          if (fieldLabelLower.includes(match.template) && confidence < match.conf) {
            bestMatch = match.patient;
            confidence = match.conf;
          }
        });
      });
      
      if (bestMatch && confidence > 70) {
        onMappingChange(field.id, bestMatch);
      }
    });
    
    setAutoMappingInProgress(false);
  };

  const getMappedField = (fieldId: string) => {
    const field = templateFields.find(f => f.id === fieldId);
    if (!field?.mappedTo) return null;
    return PATIENT_DATA_FIELDS.find(pf => pf.path === field.mappedTo);
  };

  const mappedCount = templateFields.filter(f => f.mappedTo).length;
  const mappingProgress = Math.round((mappedCount / templateFields.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Field Mapping Configuration</h3>
          <p className="text-gray-600 mt-1">Map template fields to patient data for automatic form population</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mappingProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{mappedCount}/{templateFields.length}</span>
            </div>
          </div>
          <Button 
            onClick={handleAutoMapping}
            disabled={autoMappingInProgress}
            className="bg-[#6e53a3] hover:bg-[#6e53a3]/90"
          >
            {autoMappingInProgress ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI Mapping...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Auto-Map Fields
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Search Patient Data Fields</Label>
              <Input
                placeholder="Search by field name or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapping Interface */}
      <div className="grid grid-cols-2 gap-6">
        {/* Template Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template Fields ({templateFields.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {templateFields.map((field) => {
              const mappedField = getMappedField(field.id);
              return (
                <div key={field.id} className="border rounded p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{field.label}</span>
                      {field.required && <Badge className="bg-[#f13c45]/20 text-[#f13c45]/95 text-xs">Required</Badge>}
                    </div>
                    <Badge variant="outline" className="text-xs">{field.type}</Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Position: Page {field.position.page}, X:{field.position.x}, Y:{field.position.y}
                  </div>
                  
                  {mappedField ? (
                    <div className="flex items-center space-x-2 text-xs">
                      <Target className="h-3 w-3 text-green-500" />
                      <span className="text-green-700 font-medium">Mapped to: {mappedField.label}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => onMappingChange(field.id, "")}
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Not mapped</span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Available Patient Data Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Patient Data Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatientFields.map((patientField) => (
              <div
                key={patientField.path}
                className="border rounded p-3 hover:bg-[#006d9a]/10 transition-colors cursor-pointer"
                onClick={() => {
                  // Find the first unmapped required field or any unmapped field
                  const unmappedField = templateFields.find(tf => 
                    !tf.mappedTo && (tf.required || templateFields.filter(f => f.required && !f.mappedTo).length === 0)
                  );
                  if (unmappedField) {
                    onMappingChange(unmappedField.id, patientField.path);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{patientField.label}</span>
                  <Badge variant="outline" className="text-xs">{patientField.type}</Badge>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Path: <code className="bg-gray-100 px-1 rounded">{patientField.path}</code>
                </div>
                <div className="text-xs text-gray-500">
                  Example: {patientField.example}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Mapping
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button 
            onClick={onSave}
            disabled={mappedCount < templateFields.filter(f => f.required).length}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Mapping ({mappedCount}/{templateFields.length})
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mapping Preview: {templateName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {mappedCount} of {templateFields.length} fields mapped ({mappingProgress}% complete)
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {templateFields.map(field => {
                const mappedField = getMappedField(field.id);
                return (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{field.label}</div>
                        <div className="text-xs text-gray-500">{field.type} {field.required && "• Required"}</div>
                      </div>
                      {mappedField ? (
                        <>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-green-700">{mappedField.label}</div>
                            <div className="text-xs text-gray-500">{mappedField.path}</div>
                          </div>
                          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            Example: {mappedField.example}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-[#f13c45] bg-[#f13c45]/20 px-2 py-1 rounded">
                          Not mapped
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}