import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Download,
  Trash2,
  Wand2,
  Settings,
  Plus,
  Copy
} from "lucide-react";

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "checkbox" | "number";
  required: boolean;
  position: { x: number; y: number; page: number };
  options?: string[];
  mappingRules?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

interface UploadedTemplate {
  id: string;
  name: string;
  payerName: string;
  formType: string;
  uploadDate: string;
  status: "processing" | "ready" | "error" | "mapping_required";
  fields: TemplateField[];
  originalFile: string;
  extractedText?: string;
  mappingProgress: number;
  processingNotes: string[];
}

export function TemplateUploadWorkflow() {
  const [uploadedTemplates, setUploadedTemplates] = useState<UploadedTemplate[]>([
    {
      id: "tmpl-001",
      name: "Nevada Medicaid Prior Auth FA-8",
      payerName: "Nevada Medicaid",
      formType: "Inpatient Medical and Surgical",
      uploadDate: "2024-12-07",
      status: "ready",
      mappingProgress: 95,
      processingNotes: [
        "Successfully extracted 25 form fields",
        "Identified required fields: 18",
        "Auto-mapped 23 fields to patient data",
        "Requires manual mapping for 2 specialty fields"
      ],
      fields: [
        {
          id: "recipient_name",
          label: "Recipient Name (Last, First, MI)",
          type: "text",
          required: true,
          position: { x: 100, y: 200, page: 1 },
          mappingRules: ["patient.lastName + ', ' + patient.firstName + ' ' + patient.middleInitial"]
        },
        {
          id: "recipient_id",
          label: "Recipient ID",
          type: "text",
          required: true,
          position: { x: 100, y: 220, page: 1 },
          mappingRules: ["patient.medicaidId", "patient.memberID"]
        },
        {
          id: "dob",
          label: "DOB",
          type: "date",
          required: true,
          position: { x: 400, y: 220, page: 1 },
          mappingRules: ["patient.dateOfBirth"]
        },
        {
          id: "ordering_provider",
          label: "Ordering Provider Name",
          type: "text",
          required: true,
          position: { x: 100, y: 300, page: 1 },
          mappingRules: ["patient.referringProvider", "patient.orderingPhysician"]
        },
        {
          id: "service_type",
          label: "Service Type",
          type: "select",
          required: true,
          position: { x: 100, y: 450, page: 1 },
          options: ["Medical", "Surgical", "Maternity", "Pediatric", "Observation"]
        },
        {
          id: "admission_date",
          label: "Estimated Admission Date",
          type: "date",
          required: true,
          position: { x: 100, y: 480, page: 1 },
          mappingRules: ["procedure.scheduledDate", "admission.estimatedDate"]
        },
        {
          id: "admission_diagnosis_1",
          label: "Admission Diagnosis 1",
          type: "text",
          required: true,
          position: { x: 100, y: 520, page: 1 },
          mappingRules: ["diagnosis.primary.code"]
        },
        {
          id: "severity_illness",
          label: "Severity of Illness",
          type: "textarea",
          required: true,
          position: { x: 100, y: 200, page: 2 },
          mappingRules: ["clinical.symptoms", "clinical.labFindings"]
        },
        {
          id: "intensity_service",
          label: "Intensity of Service",
          type: "textarea",
          required: true,
          position: { x: 100, y: 300, page: 2 },
          mappingRules: ["treatment.plan", "clinical.services"]
        }
      ],
      originalFile: "NV_MCAID_PriorAuth_FA-8.pdf",
      extractedText: "Prior Authorization Request Nevada Medicaid and Nevada Check Up..."
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulated file upload and processing
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsProcessing(true);
    const file = files[0];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newTemplate: UploadedTemplate = {
      id: `tmpl-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      payerName: "Unknown Payer",
      formType: "Prior Authorization",
      uploadDate: new Date().toISOString().split('T')[0],
      status: "processing",
      mappingProgress: 0,
      processingNotes: [
        "File uploaded successfully",
        "OCR processing initiated",
        "Field detection in progress..."
      ],
      fields: [],
      originalFile: file.name
    };
    
    setUploadedTemplates(prev => [...prev, newTemplate]);
    setIsProcessing(false);
    setShowUploadDialog(false);
    
    // Simulate processing stages
    setTimeout(() => {
      setUploadedTemplates(prev => prev.map(t => 
        t.id === newTemplate.id 
          ? { ...t, status: "mapping_required", mappingProgress: 65, processingNotes: [...t.processingNotes, "15 fields detected", "Manual mapping required"] }
          : t
      ));
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing...</Badge>;
      case "mapping_required":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Mapping Required</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getMappingProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Template Upload & Management</h3>
          <p className="text-gray-600 mt-1">Upload payer-specific forms and configure intelligent field mapping</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#6e53a3] hover:bg-[#6e53a3]/90">
              <Plus className="h-4 w-4 mr-2" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Pre-Authorization Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Supported formats: PDF, Word documents, images (JPG, PNG). The system will extract form fields and create mapping rules automatically.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Select Template File</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="template-upload"
                      disabled={isProcessing}
                    />
                    <label htmlFor="template-upload" className="cursor-pointer">
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6e53a3]"></div>
                          <span>Processing template...</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payer Name</Label>
                    <Input placeholder="e.g., Nevada Medicaid" />
                  </div>
                  <div>
                    <Label>Form Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select form type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inpatient">Inpatient Medical/Surgical</SelectItem>
                        <SelectItem value="outpatient">Outpatient Services</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy Prior Auth</SelectItem>
                        <SelectItem value="dme">DME Equipment</SelectItem>
                        <SelectItem value="imaging">Diagnostic Imaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Processing Options</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Auto-detect form fields using OCR</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Generate smart mapping rules</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Create fillable PDF overlay</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {uploadedTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.payerName} • {template.formType}</p>
                    </div>
                    {getStatusBadge(template.status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-gray-600">Upload Date</p>
                      <p className="font-medium">{template.uploadDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fields Detected</p>
                      <p className="font-medium">{template.fields.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mapping Progress</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getMappingProgressColor(template.mappingProgress)}`}
                            style={{ width: `${template.mappingProgress}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{template.mappingProgress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Notes */}
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <Label className="text-xs font-medium text-gray-700">Processing Notes</Label>
                    <div className="space-y-1 mt-1">
                      {template.processingNotes.map((note, idx) => (
                        <p key={idx} className="text-xs text-gray-600 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Template Preview: {template.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label className="font-medium">Extracted Fields ({template.fields.length})</Label>
                            <div className="space-y-2 mt-2 max-h-96 overflow-y-auto">
                              {template.fields.map((field, idx) => (
                                <div key={field.id} className="border rounded p-3 text-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{field.label}</span>
                                    <div className="flex items-center space-x-1">
                                      <Badge variant="outline" className="text-xs">{field.type}</Badge>
                                      {field.required && <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>}
                                    </div>
                                  </div>
                                  {field.mappingRules && field.mappingRules.length > 0 && (
                                    <div className="text-xs text-gray-600">
                                      <span className="font-medium">Mapping:</span> {field.mappingRules[0]}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 mt-1">
                                    Position: Page {field.position.page}, X:{field.position.x}, Y:{field.position.y}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">Template Information</Label>
                            <div className="space-y-3 mt-2">
                              <div className="border rounded p-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">File:</span>
                                    <p className="font-medium">{template.originalFile}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Status:</span>
                                    <div className="mt-1">{getStatusBadge(template.status)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Total Fields:</span>
                                    <p className="font-medium">{template.fields.length}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Required Fields:</span>
                                    <p className="font-medium">{template.fields.filter(f => f.required).length}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {template.extractedText && (
                                <div className="border rounded p-3">
                                  <Label className="text-xs font-medium">Extracted Text (Preview)</Label>
                                  <div className="text-xs text-gray-600 mt-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                                    {template.extractedText.substring(0, 500)}...
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Field Mapping Configuration: {template.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 gap-4">
                          {template.fields.map((field, idx) => (
                            <div key={field.id} className="border rounded p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Label className="font-medium">{field.label}</Label>
                                    <Badge variant="outline" className="text-xs">{field.type}</Badge>
                                    {field.required && <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs">Mapping Rules</Label>
                                      <Select defaultValue={field.mappingRules?.[0] || ""}>
                                        <SelectTrigger className="text-xs">
                                          <SelectValue placeholder="Select mapping rule..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="patient.firstName">Patient First Name</SelectItem>
                                          <SelectItem value="patient.lastName">Patient Last Name</SelectItem>
                                          <SelectItem value="patient.dateOfBirth">Date of Birth</SelectItem>
                                          <SelectItem value="patient.memberID">Member ID</SelectItem>
                                          <SelectItem value="patient.medicaidId">Medicaid ID</SelectItem>
                                          <SelectItem value="diagnosis.primary.code">Primary Diagnosis Code</SelectItem>
                                          <SelectItem value="procedure.scheduledDate">Procedure Date</SelectItem>
                                          <SelectItem value="provider.referring">Referring Provider</SelectItem>
                                          <SelectItem value="clinical.symptoms">Clinical Symptoms</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label className="text-xs">Validation Rules</Label>
                                      <Input 
                                        placeholder="e.g., required, minLength:5, pattern:/^\d{10}$/"
                                        className="text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Configuration
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
                              Cancel
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Save Configuration
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" className="bg-[#6e53a3] hover:bg-[#6e53a3]/90 text-white">
                    <Wand2 className="h-4 w-4 mr-1" />
                    Test Fill
                  </Button>

                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {uploadedTemplates.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Uploaded</h3>
            <p className="text-gray-600 mb-4">Upload your first payer form template to get started with intelligent form prepopulation.</p>
            <Button onClick={() => setShowUploadDialog(true)} className="bg-[#6e53a3] hover:bg-[#6e53a3]/90">
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}