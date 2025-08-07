import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download, 
  RefreshCw,
  Building,
  User,
  Calendar,
  Shield,
  Wand2
} from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "number";
  required: boolean;
  options?: string[];
  value?: string;
  autoFilled?: boolean;
  confidence?: number;
}

interface PayerFormTemplate {
  id: string;
  payerName: string;
  payerLogo?: string;
  formTitle: string;
  processingTime: string;
  submitUrl: string;
  fields: FormField[];
  requiredDocuments: string[];
  specialInstructions: string;
}

interface PatientData {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  memberID: string;
  groupNumber: string;
  primaryInsurance: string;
  secondaryInsurance?: string;
  address: string;
  phone: string;
  primaryCareProvider: string;
  referringProvider: string;
  diagnosisCode: string;
  diagnosisDescription: string;
  procedureCode: string;
  procedureDescription: string;
  scheduledDate: string;
  urgency: "routine" | "urgent" | "emergent";
  clinicalHistory: string;
  priorTreatments: string;
  currentMedications: string;
  allergies: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
  };
}

export function FormPrepopulationDemo() {
  const [selectedOption, setSelectedOption] = useState<"option1" | "option2">("option1");
  const [selectedPayer, setSelectedPayer] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [showMappingRules, setShowMappingRules] = useState(false);

  // Sample patient data
  const samplePatients: PatientData[] = [
    {
      patientId: "PAT-001",
      firstName: "Maria",
      lastName: "Rodriguez", 
      dateOfBirth: "1978-03-15",
      memberID: "BCB123456789",
      groupNumber: "GRP001234",
      primaryInsurance: "Blue Cross Blue Shield",
      address: "123 Main St, Austin, TX 78701",
      phone: "(555) 123-4567",
      primaryCareProvider: "Dr. Sarah Johnson",
      referringProvider: "Dr. Michael Chen",
      diagnosisCode: "M17.11",
      diagnosisDescription: "Unilateral primary osteoarthritis, right knee",
      procedureCode: "27447",
      procedureDescription: "Total knee replacement, right knee",
      scheduledDate: "2025-02-15",
      urgency: "routine",
      clinicalHistory: "Progressive knee pain and stiffness over 3 years, conservative treatment failed",
      priorTreatments: "Physical therapy (6 months), NSAIDs, cortisone injections (3)",
      currentMedications: "Ibuprofen 600mg TID, Glucosamine 1500mg daily",
      allergies: "Penicillin (rash)",
      vitalSigns: {
        bloodPressure: "128/84",
        heartRate: "72",
        temperature: "98.6°F",
        weight: "165 lbs"
      }
    },
    {
      patientId: "PAT-002",
      firstName: "James",
      lastName: "Wilson",
      dateOfBirth: "1965-11-22",
      memberID: "UHC987654321", 
      groupNumber: "GRP005678",
      primaryInsurance: "United Healthcare",
      address: "456 Oak Ave, Dallas, TX 75201",
      phone: "(555) 987-6543",
      primaryCareProvider: "Dr. Lisa Thompson",
      referringProvider: "Dr. Robert Kumar",
      diagnosisCode: "I25.10",
      diagnosisDescription: "Atherosclerotic heart disease of native coronary artery",
      procedureCode: "92928",
      procedureDescription: "Percutaneous transcatheter placement of intracoronary stent(s)",
      scheduledDate: "2025-01-20",
      urgency: "urgent",
      clinicalHistory: "Recent onset chest pain, positive stress test, 70% LAD stenosis on catheterization",
      priorTreatments: "Medical management with beta-blockers, statins, antiplatelet therapy",
      currentMedications: "Metoprolol 50mg BID, Atorvastatin 40mg daily, Clopidogrel 75mg daily",
      allergies: "Shellfish (anaphylaxis)",
      vitalSigns: {
        bloodPressure: "142/92",
        heartRate: "68",
        temperature: "98.4°F",
        weight: "185 lbs"
      }
    }
  ];

  // Payer form templates
  const payerTemplates: PayerFormTemplate[] = [
    {
      id: "bcbs-standard",
      payerName: "Blue Cross Blue Shield",
      payerLogo: "🔵",
      formTitle: "Prior Authorization Request - Surgical Procedures",
      processingTime: "3-5 business days",
      submitUrl: "https://provider.bcbs.com/prior-auth",
      requiredDocuments: [
        "Physician treatment plan",
        "Clinical notes (last 6 months)", 
        "Imaging results (if applicable)",
        "Conservative treatment documentation"
      ],
      specialInstructions: "All orthopedic procedures require peer-to-peer review if initial request is denied.",
      fields: [
        { id: "member_id", label: "Member ID", type: "text", required: true },
        { id: "group_number", label: "Group Number", type: "text", required: true },
        { id: "patient_name", label: "Patient Full Name", type: "text", required: true },
        { id: "patient_dob", label: "Date of Birth", type: "date", required: true },
        { id: "provider_npi", label: "Provider NPI", type: "text", required: true },
        { id: "provider_name", label: "Provider Name", type: "text", required: true },
        { id: "diagnosis_code", label: "Primary Diagnosis Code (ICD-10)", type: "text", required: true },
        { id: "diagnosis_desc", label: "Diagnosis Description", type: "textarea", required: true },
        { id: "procedure_code", label: "Procedure Code (CPT)", type: "text", required: true },
        { id: "procedure_desc", label: "Procedure Description", type: "textarea", required: true },
        { id: "service_date", label: "Requested Service Date", type: "date", required: true },
        { id: "urgency", label: "Urgency Level", type: "select", required: true, options: ["Routine", "Urgent", "Emergent"] },
        { id: "clinical_rationale", label: "Clinical Rationale", type: "textarea", required: true },
        { id: "prior_treatments", label: "Previous Conservative Treatments", type: "textarea", required: true },
        { id: "duration_symptoms", label: "Duration of Symptoms", type: "text", required: false },
        { id: "supporting_documentation", label: "Supporting Documentation", type: "textarea", required: false }
      ]
    },
    {
      id: "uhc-standard",
      payerName: "United Healthcare",
      payerLogo: "🔶",
      formTitle: "UnitedHealth Prior Authorization Request",
      processingTime: "2-3 business days",
      submitUrl: "https://www.uhcprovider.com/prior-authorization",
      requiredDocuments: [
        "Complete medical records",
        "Diagnostic test results",
        "Treatment history summary",
        "Provider attestation form"
      ],
      specialInstructions: "Cardiac procedures require cardiothoracic surgery consultation notes.",
      fields: [
        { id: "subscriber_id", label: "Subscriber ID", type: "text", required: true },
        { id: "patient_full_name", label: "Patient Name (Last, First MI)", type: "text", required: true },
        { id: "birth_date", label: "Birth Date (MM/DD/YYYY)", type: "date", required: true },
        { id: "requesting_provider", label: "Requesting Provider Name", type: "text", required: true },
        { id: "provider_phone", label: "Provider Contact Phone", type: "text", required: true },
        { id: "primary_diagnosis", label: "Primary Diagnosis (ICD-10)", type: "text", required: true },
        { id: "procedure_requested", label: "Procedure/Service Requested", type: "text", required: true },
        { id: "cpt_code", label: "CPT/HCPCS Code", type: "text", required: true },
        { id: "date_of_service", label: "Anticipated Date of Service", type: "date", required: true },
        { id: "clinical_information", label: "Clinical Information & Justification", type: "textarea", required: true },
        { id: "treatment_history", label: "Relevant Treatment History", type: "textarea", required: true },
        { id: "alternative_treatments", label: "Alternative Treatments Considered", type: "textarea", required: false },
        { id: "patient_condition", label: "Current Patient Condition", type: "textarea", required: true },
        { id: "expected_outcome", label: "Expected Treatment Outcome", type: "textarea", required: false }
      ]
    },
    {
      id: "aetna-standard", 
      payerName: "Aetna",
      payerLogo: "🟣",
      formTitle: "Aetna Prior Authorization Form",
      processingTime: "1-3 business days",
      submitUrl: "https://www.aetna.com/health-care-professionals/precertification",
      requiredDocuments: [
        "Completed PA request form",
        "Clinical documentation",
        "Lab results (if applicable)",
        "Specialist consultation notes"
      ],
      specialInstructions: "Expedited processing available for urgent cases with proper documentation.",
      fields: [
        { id: "aetna_id", label: "Aetna ID Number", type: "text", required: true },
        { id: "member_name", label: "Member Name", type: "text", required: true },
        { id: "member_dob", label: "Member Date of Birth", type: "date", required: true },
        { id: "physician_name", label: "Requesting Physician", type: "text", required: true },
        { id: "physician_npi", label: "Physician NPI Number", type: "text", required: true },
        { id: "diagnosis_primary", label: "Primary Diagnosis Code", type: "text", required: true },
        { id: "service_code", label: "Service/Procedure Code", type: "text", required: true },
        { id: "service_description", label: "Service Description", type: "textarea", required: true },
        { id: "service_date_requested", label: "Requested Service Date", type: "date", required: true },
        { id: "medical_necessity", label: "Medical Necessity Statement", type: "textarea", required: true },
        { id: "clinical_notes", label: "Relevant Clinical Notes", type: "textarea", required: true },
        { id: "lab_values", label: "Pertinent Lab Values", type: "textarea", required: false },
        { id: "imaging_results", label: "Imaging Results Summary", type: "textarea", required: false }
      ]
    }
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Auto-fill logic based on patient data and payer requirements
  const autoFillForm = async (patientId: string, payerId: string) => {
    setIsAutoFilling(true);
    
    const patient = samplePatients.find(p => p.patientId === patientId);
    const template = payerTemplates.find(t => t.id === payerId);
    
    if (!patient || !template) {
      setIsAutoFilling(false);
      return;
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mappedData: Record<string, string> = {};
    
    // Smart mapping based on field IDs and patient data
    template.fields.forEach(field => {
      let value = "";
      let confidence = 0;
      
      switch (field.id) {
        case "member_id":
        case "subscriber_id":
        case "aetna_id":
          value = patient.memberID;
          confidence = 100;
          break;
        case "group_number":
          value = patient.groupNumber;
          confidence = 100;
          break;
        case "patient_name":
        case "patient_full_name":
        case "member_name":
          value = `${patient.lastName}, ${patient.firstName}`;
          confidence = 100;
          break;
        case "patient_dob":
        case "birth_date":
        case "member_dob":
          value = patient.dateOfBirth;
          confidence = 100;
          break;
        case "provider_name":
        case "requesting_provider":
        case "physician_name":
          value = patient.referringProvider;
          confidence = 95;
          break;
        case "diagnosis_code":
        case "primary_diagnosis":
        case "diagnosis_primary":
          value = patient.diagnosisCode;
          confidence = 100;
          break;
        case "diagnosis_desc":
          value = patient.diagnosisDescription;
          confidence = 100;
          break;
        case "procedure_code":
        case "cpt_code":
        case "service_code":
          value = patient.procedureCode;
          confidence = 100;
          break;
        case "procedure_desc":
        case "procedure_requested":
        case "service_description":
          value = patient.procedureDescription;
          confidence = 100;
          break;
        case "service_date":
        case "date_of_service":
        case "service_date_requested":
          value = patient.scheduledDate;
          confidence = 100;
          break;
        case "urgency":
          value = patient.urgency.charAt(0).toUpperCase() + patient.urgency.slice(1);
          confidence = 90;
          break;
        case "clinical_rationale":
        case "clinical_information":
        case "medical_necessity":
          value = `${patient.clinicalHistory}. Patient has exhausted conservative treatment options including ${patient.priorTreatments}.`;
          confidence = 85;
          break;
        case "prior_treatments":
        case "treatment_history":
          value = patient.priorTreatments;
          confidence = 100;
          break;
        case "clinical_notes":
          value = `Patient presents with ${patient.diagnosisDescription}. Current medications: ${patient.currentMedications}. Allergies: ${patient.allergies}. Vital signs: BP ${patient.vitalSigns.bloodPressure}, HR ${patient.vitalSigns.heartRate}.`;
          confidence = 90;
          break;
        case "provider_phone":
          value = "(555) 123-4567";
          confidence = 70;
          break;
        case "provider_npi":
        case "physician_npi":
          value = "1234567890";
          confidence = 70;
          break;
      }
      
      if (value) {
        mappedData[field.id] = value;
        // Mark field as auto-filled with confidence
        template.fields.find(f => f.id === field.id)!.autoFilled = true;
        template.fields.find(f => f.id === field.id)!.confidence = confidence;
      }
    });
    
    setFormData(mappedData);
    setIsAutoFilling(false);
  };

  const getFieldBorderColor = (field: FormField) => {
    if (!field.autoFilled) return "border-gray-300";
    if (field.confidence! >= 95) return "border-green-500";
    if (field.confidence! >= 80) return "border-blue-500";
    return "border-yellow-500";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-green-600";
    if (confidence >= 80) return "text-blue-600";
    return "text-yellow-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pre-Authorization Form Prepopulation</h2>
          <p className="text-gray-600 mt-1">Demonstrate intelligent form filling capabilities</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">DEMO</Badge>
      </div>

      {/* Option Selection */}
      <Tabs value={selectedOption} onValueChange={(value) => setSelectedOption(value as "option1" | "option2")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="option1">Option 1: Interactive Real-time Prepopulation</TabsTrigger>
          <TabsTrigger value="option2">Option 2: Payer Template Comparison</TabsTrigger>
        </TabsList>

        {/* Option 1: Interactive Real-time Prepopulation */}
        <TabsContent value="option1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>Option 1: Interactive Real-time Prepopulation</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Select a patient and payer to see intelligent form prepopulation in action. The system automatically maps patient data to payer-specific form fields.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {samplePatients.map(patient => (
                        <SelectItem key={patient.patientId} value={patient.patientId}>
                          {patient.firstName} {patient.lastName} - {patient.primaryInsurance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Payer</Label>
                  <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a payer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {payerTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.payerLogo} {template.payerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Auto-fill Button */}
              {selectedPatient && selectedPayer && (
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => autoFillForm(selectedPatient, selectedPayer)}
                    disabled={isAutoFilling}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isAutoFilling ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        AI Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto-Fill Form
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowMappingRules(!showMappingRules)}>
                    View Mapping Rules
                  </Button>
                </div>
              )}

              {/* Form Display */}
              {selectedPayer && (
                <Card className="mt-6">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{payerTemplates.find(t => t.id === selectedPayer)?.payerLogo}</span>
                        <div>
                          <CardTitle className="text-lg">{payerTemplates.find(t => t.id === selectedPayer)?.formTitle}</CardTitle>
                          <p className="text-sm text-gray-600">Processing Time: {payerTemplates.find(t => t.id === selectedPayer)?.processingTime}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {payerTemplates.find(t => t.id === selectedPayer)?.fields.map((field) => (
                        <div key={field.id} className={`space-y-2 ${field.type === 'textarea' ? 'col-span-2' : ''}`}>
                          <Label className="flex items-center space-x-2">
                            <span>{field.label}</span>
                            {field.required && <span className="text-red-500">*</span>}
                            {field.autoFilled && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Auto-filled ({field.confidence}%)
                              </Badge>
                            )}
                          </Label>
                          {field.type === 'textarea' ? (
                            <Textarea
                              value={formData[field.id] || ""}
                              onChange={(e) => setFormData(prev => ({...prev, [field.id]: e.target.value}))}
                              className={`transition-colors ${getFieldBorderColor(field)} ${field.autoFilled ? 'bg-green-50' : ''}`}
                              rows={3}
                            />
                          ) : field.type === 'select' ? (
                            <Select value={formData[field.id] || ""} onValueChange={(value) => setFormData(prev => ({...prev, [field.id]: value}))}>
                              <SelectTrigger className={`${getFieldBorderColor(field)} ${field.autoFilled ? 'bg-green-50' : ''}`}>
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map(option => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={field.type}
                              value={formData[field.id] || ""}
                              onChange={(e) => setFormData(prev => ({...prev, [field.id]: e.target.value}))}
                              className={`transition-colors ${getFieldBorderColor(field)} ${field.autoFilled ? 'bg-green-50' : ''}`}
                            />
                          )}
                          {field.autoFilled && (
                            <p className={`text-xs ${getConfidenceColor(field.confidence!)}`}>
                              Confidence: {field.confidence}% - Mapped from patient record
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Option 2: Payer Template Comparison */}
        <TabsContent value="option2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Option 2: Payer Template Comparison</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Compare different payer form templates side-by-side to see how the same patient data maps to different requirements.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {payerTemplates.map((template, index) => (
                  <Card key={template.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{template.payerLogo}</span>
                        <div>
                          <CardTitle className="text-sm">{template.payerName}</CardTitle>
                          <p className="text-xs text-gray-500">{template.processingTime}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="text-xs space-y-1">
                        <p><strong>Fields:</strong> {template.fields.length}</p>
                        <p><strong>Required:</strong> {template.fields.filter(f => f.required).length}</p>
                        <p><strong>Documents:</strong> {template.requiredDocuments.length}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Form Fields Preview:</Label>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {template.fields.slice(0, 6).map(field => (
                            <div key={field.id} className="text-xs p-2 border rounded bg-gray-50">
                              <div className="flex items-center justify-between">
                                <span className="truncate">{field.label}</span>
                                {field.required && <AlertCircle className="h-3 w-3 text-red-500" />}
                              </div>
                            </div>
                          ))}
                          {template.fields.length > 6 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{template.fields.length - 6} more fields
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Required Documents:</Label>
                        <div className="space-y-1">
                          {template.requiredDocuments.slice(0, 3).map((doc, idx) => (
                            <div key={idx} className="text-xs flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span className="truncate">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            View Full Template
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span className="text-xl">{template.payerLogo}</span>
                              <span>{template.payerName} - {template.formTitle}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                              <div>
                                <Label className="font-medium">Processing Time</Label>
                                <p className="text-sm">{template.processingTime}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Submission URL</Label>
                                <p className="text-sm text-blue-600">{template.submitUrl}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="font-medium">Special Instructions</Label>
                              <p className="text-sm text-gray-700 mt-1">{template.specialInstructions}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <Label className="font-medium">Form Fields ({template.fields.length})</Label>
                                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                                  {template.fields.map((field, idx) => (
                                    <div key={field.id} className="flex items-center justify-between p-2 border rounded text-sm">
                                      <span className="flex items-center space-x-2">
                                        <span>{idx + 1}.</span>
                                        <span>{field.label}</span>
                                        {field.required && <AlertCircle className="h-3 w-3 text-red-500" />}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {field.type}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-medium">Required Documents ({template.requiredDocuments.length})</Label>
                                <div className="space-y-2 mt-2">
                                  {template.requiredDocuments.map((doc, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 p-2 border rounded text-sm">
                                      <FileText className="h-4 w-4" />
                                      <span>{doc}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mapping Rules Dialog */}
      <Dialog open={showMappingRules} onOpenChange={setShowMappingRules}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Intelligent Mapping Rules</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              The system uses these mapping rules to intelligently populate payer-specific forms:
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { category: "Patient Identity", rules: [
                  { from: "Patient Name", to: "member_name, patient_full_name, patient_name", confidence: "100%" },
                  { from: "Member ID", to: "member_id, subscriber_id, aetna_id", confidence: "100%" },
                  { from: "Date of Birth", to: "patient_dob, birth_date, member_dob", confidence: "100%" }
                ]},
                { category: "Clinical Information", rules: [
                  { from: "Diagnosis Code", to: "diagnosis_code, primary_diagnosis, diagnosis_primary", confidence: "100%" },
                  { from: "Procedure Code", to: "procedure_code, cpt_code, service_code", confidence: "100%" },
                  { from: "Clinical History", to: "clinical_rationale, clinical_information, medical_necessity", confidence: "85%" }
                ]},
                { category: "Provider Information", rules: [
                  { from: "Referring Provider", to: "provider_name, requesting_provider, physician_name", confidence: "95%" },
                  { from: "Provider NPI", to: "provider_npi, physician_npi", confidence: "70% (lookup)" }
                ]}
              ].map((section, idx) => (
                <div key={idx} className="border rounded p-4">
                  <Label className="font-medium text-sm">{section.category}</Label>
                  <div className="mt-2 space-y-2">
                    {section.rules.map((rule, ruleIdx) => (
                      <div key={ruleIdx} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                        <span className="font-medium">{rule.from}</span>
                        <span className="text-gray-600 flex-1 mx-2">→ {rule.to}</span>
                        <Badge variant="outline" className="text-xs">{rule.confidence}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}