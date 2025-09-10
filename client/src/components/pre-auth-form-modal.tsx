import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Building,
  FileText,
  Sparkles,
  Send,
  Loader2,
  Eye,
  Shield,
  Wand2,
  Target,
  Copy,
  Download,
} from "lucide-react";

interface PreAuthRequest {
  id: string;
  patientId: string;
  patientName: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  payer: string;
  payerId: string;
  status: "pending" | "approved" | "denied" | "requires_review";
  priority: "standard" | "urgent";
  estimatedCost: string;
  department: string;
  providerId: string;
  providerName: string;
}

interface InsurerCriteria {
  id: string;
  payerId: string;
  payerName: string;
  procedureCode: string;
  procedureName: string;
  criteriaType: string;
  criteria: {
    requiresAuth: boolean;
    medicalNecessityCriteria: string[];
    timeFrameRequired: number;
    authValidityDays: number;
    denialReasons: string[];
  };
  effectiveDate: string;
  expirationDate?: string | null;
  isActive: boolean;
  updatedAt: string;
}

interface PatientData {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  memberID: string;
  groupNumber: string;
  primaryInsurance: string;
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

interface PreAuthFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PreAuthRequest | null;
  insurerCriteria: InsurerCriteria | null;
  patientData: PatientData | null;
}

export function PreAuthFormModal({
  isOpen,
  onClose,
  request,
  insurerCriteria,
  patientData,
}: PreAuthFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<{
    passed: string[];
    failed: string[];
    warnings: string[];
  }>({ passed: [], failed: [], warnings: [] });

  // Sample form fields based on common payer requirements
  const formFields: FormField[] = [
    { id: "member_id", label: "Member ID", type: "text", required: true },
    { id: "group_number", label: "Group Number", type: "text", required: true },
    {
      id: "patient_name",
      label: "Patient Full Name",
      type: "text",
      required: true,
    },
    { id: "patient_dob", label: "Date of Birth", type: "date", required: true },
    { id: "provider_npi", label: "Provider NPI", type: "text", required: true },
    {
      id: "provider_name",
      label: "Provider Name",
      type: "text",
      required: true,
    },
    {
      id: "diagnosis_code",
      label: "Primary Diagnosis Code (ICD-10)",
      type: "text",
      required: true,
    },
    {
      id: "diagnosis_desc",
      label: "Diagnosis Description",
      type: "textarea",
      required: true,
    },
    {
      id: "procedure_code",
      label: "Procedure Code (CPT)",
      type: "text",
      required: true,
    },
    {
      id: "procedure_desc",
      label: "Procedure Description",
      type: "textarea",
      required: true,
    },
    {
      id: "service_date",
      label: "Requested Service Date",
      type: "date",
      required: true,
    },
    {
      id: "urgency",
      label: "Urgency Level",
      type: "select",
      required: true,
      options: ["Routine", "Urgent", "Emergent"],
    },
    {
      id: "clinical_rationale",
      label: "Clinical Rationale",
      type: "textarea",
      required: true,
    },
    {
      id: "prior_treatments",
      label: "Previous Conservative Treatments",
      type: "textarea",
      required: true,
    },
    {
      id: "duration_symptoms",
      label: "Duration of Symptoms",
      type: "text",
      required: false,
    },
    {
      id: "supporting_documentation",
      label: "Supporting Documentation",
      type: "textarea",
      required: false,
    },
  ];

  // Handler functions for form actions
  const handlePreviewForm = () => {
    const formContent = formFields
      .map((field) => {
        const value =
          formData[field.id] || (field.autoFilled ? field.value : "");
        return `${field.label}: ${value || "Not filled"}`;
      })
      .join("\n");

    alert(
      `Form Preview:\n\n${formContent}\n\nRequest: ${request?.procedureName || "N/A"}\nPayer: ${request?.payer || "N/A"}`,
    );
  };

  const handleCopyForm = async () => {
    const formContent = formFields
      .map((field) => {
        const value =
          formData[field.id] || (field.autoFilled ? field.value : "");
        return `${field.label}: ${value || "Not filled"}`;
      })
      .join("\n");

    try {
      await navigator.clipboard.writeText(formContent);
      alert("Form content copied to clipboard successfully!");
    } catch (err) {
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  const handleExportForm = () => {
    const formContent = formFields
      .map((field) => {
        const value =
          formData[field.id] || (field.autoFilled ? field.value : "");
        return `${field.label}: ${value || "Not filled"}`;
      })
      .join("\n");

    const blob = new Blob([formContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pre-auth-form-${request?.id || "export"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Form exported successfully!");
  };

  // Auto-fill form based on patient data
  const autoPopulateForm = async () => {
    if (!patientData || !request) return;

    setIsProcessing(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mappedData: Record<string, string> = {};

    // Smart mapping based on field IDs and patient data
    formFields.forEach((field) => {
      let value = "";
      let confidence = 0;

      switch (field.id) {
        case "member_id":
          value = patientData.memberID;
          confidence = 100;
          break;
        case "group_number":
          value = patientData.groupNumber;
          confidence = 100;
          break;
        case "patient_name":
          value = `${patientData.lastName}, ${patientData.firstName}`;
          confidence = 100;
          break;
        case "patient_dob":
          value = patientData.dateOfBirth;
          confidence = 100;
          break;
        case "provider_name":
          value = patientData.referringProvider;
          confidence = 95;
          break;
        case "diagnosis_code":
          value = patientData.diagnosisCode;
          confidence = 100;
          break;
        case "diagnosis_desc":
          value = patientData.diagnosisDescription;
          confidence = 100;
          break;
        case "procedure_code":
          value = patientData.procedureCode;
          confidence = 100;
          break;
        case "procedure_desc":
          value = patientData.procedureDescription;
          confidence = 100;
          break;
        case "service_date":
          value = patientData.scheduledDate;
          confidence = 100;
          break;
        case "urgency":
          value =
            patientData.urgency.charAt(0).toUpperCase() +
            patientData.urgency.slice(1);
          confidence = 90;
          break;
        case "clinical_rationale":
          value = `${patientData.clinicalHistory}. Patient has exhausted conservative treatment options including ${patientData.priorTreatments}.`;
          confidence = 85;
          break;
        case "prior_treatments":
          value = patientData.priorTreatments;
          confidence = 100;
          break;
        case "provider_npi":
          value = "1234567890"; // Would come from provider database
          confidence = 70;
          break;
        case "duration_symptoms":
          value = "6 months"; // Would be extracted from clinical notes
          confidence = 75;
          break;
      }

      if (value) {
        mappedData[field.id] = value;
        // Mark field as auto-filled with confidence
        const fieldIndex = formFields.findIndex((f) => f.id === field.id);
        if (fieldIndex !== -1) {
          formFields[fieldIndex].autoFilled = true;
          formFields[fieldIndex].confidence = confidence;
        }
      }
    });

    setFormData(mappedData);
    setIsProcessing(false);
  };

  // Validate against insurer criteria
  const validateAgainstCriteria = () => {
    if (!insurerCriteria) return;

    const results = {
      passed: [] as string[],
      failed: [] as string[],
      warnings: [] as string[],
    };

    // Check medical necessity criteria
    if (insurerCriteria.criteria.medicalNecessityCriteria) {
      insurerCriteria.criteria.medicalNecessityCriteria.forEach((criteria) => {
        if (
          formData.clinical_rationale
            ?.toLowerCase()
            .includes(criteria.toLowerCase().substring(0, 10))
        ) {
          results.passed.push(`Medical necessity: ${criteria}`);
        } else {
          results.warnings.push(`Consider addressing: ${criteria}`);
        }
      });
    }

    // Check timing requirements
    if (request && insurerCriteria.criteria.timeFrameRequired) {
      const daysUntilProcedure = Math.ceil(
        (new Date(request.scheduledDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysUntilProcedure >= insurerCriteria.criteria.timeFrameRequired) {
        results.passed.push(
          `Timing: ${daysUntilProcedure} days notice provided (${insurerCriteria.criteria.timeFrameRequired} required)`,
        );
      } else {
        results.failed.push(
          `Insufficient notice: Only ${daysUntilProcedure} days (${insurerCriteria.criteria.timeFrameRequired} required)`,
        );
      }
    }

    // Check required fields
    const requiredFields = formFields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !formData[f.id]);

    if (missingFields.length === 0) {
      results.passed.push("All required fields completed");
    } else {
      results.failed.push(
        `Missing required fields: ${missingFields.map((f) => f.label).join(", ")}`,
      );
    }

    setValidationResults(results);
  };

  useEffect(() => {
    if (currentStep === 3) {
      validateAgainstCriteria();
    }
  }, [currentStep, formData, insurerCriteria]);

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Step 1: Flag Procedure for Pre-Authorization
              </h3>
              <p className="text-gray-600">
                Review procedure details and requirements
              </p>
            </div>

            {request && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Procedure Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Patient</Label>
                      <p className="text-gray-900">{request.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Procedure</Label>
                      <p className="text-gray-900">
                        {request.procedureCode} - {request.procedureName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payer</Label>
                      <p className="text-gray-900">{request.payer}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Scheduled Date
                      </Label>
                      <p className="text-gray-900">
                        {new Date(request.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      This procedure has been automatically flagged for
                      pre-authorization based on payer requirements.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Step 2: Compare Against Insurer Criteria
              </h3>
              <p className="text-gray-600">
                Review payer-specific authorization requirements
              </p>
            </div>

            {insurerCriteria && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>{insurerCriteria.payerName} Requirements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Authorization Required
                      </Label>
                      <Badge
                        className={
                          insurerCriteria.criteria.requiresAuth
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {insurerCriteria.criteria.requiresAuth ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Processing Time
                      </Label>
                      <p className="text-gray-900">
                        {insurerCriteria.criteria.timeFrameRequired} days
                      </p>
                    </div>
                  </div>

                  {insurerCriteria.criteria.medicalNecessityCriteria && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Medical Necessity Criteria
                      </Label>
                      <ul className="space-y-2">
                        {insurerCriteria.criteria.medicalNecessityCriteria.map(
                          (criteria, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {criteria}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {insurerCriteria.criteria.denialReasons && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Common Denial Reasons
                      </Label>
                      <ul className="space-y-2">
                        {insurerCriteria.criteria.denialReasons.map(
                          (reason, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2"
                            >
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {reason}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Step 3: Pre-populate Authorization Form
              </h3>
              <p className="text-gray-600">
                AI-powered form completion with validation
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Button
                onClick={autoPopulateForm}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Auto-Populating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Auto-Populate Form
                  </>
                )}
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewForm}
                  data-testid="button-preview-form"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyForm}
                  data-testid="button-copy-form"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportForm}
                  data-testid="button-export-form"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pre-Authorization Request Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map((field) => (
                    <div
                      key={field.id}
                      className={
                        field.type === "textarea" ? "md:col-span-2" : ""
                      }
                    >
                      <Label className="text-sm font-medium">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                        {field.autoFilled && field.confidence && (
                          <Badge
                            variant="outline"
                            className={`ml-2 text-xs ${getConfidenceColor(field.confidence)}`}
                          >
                            {field.confidence}% confidence
                          </Badge>
                        )}
                      </Label>

                      {field.type === "textarea" ? (
                        <Textarea
                          value={formData[field.id] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          className={`mt-1 ${getFieldBorderColor(field)}`}
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          value={formData[field.id] || ""}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              [field.id]: value,
                            }))
                          }
                        >
                          <SelectTrigger
                            className={`mt-1 ${getFieldBorderColor(field)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          value={formData[field.id] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          className={`mt-1 ${getFieldBorderColor(field)}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Validation Results */}
            {validationResults.passed.length > 0 ||
            validationResults.failed.length > 0 ||
            validationResults.warnings.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Criteria Validation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {validationResults.passed.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-green-700">{item}</span>
                    </div>
                  ))}

                  {validationResults.warnings.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm text-yellow-700">{item}</span>
                    </div>
                  ))}

                  {validationResults.failed.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span className="text-sm text-red-700">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Pre-Authorization Workflow</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={validationResults.failed.length > 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            )}

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
