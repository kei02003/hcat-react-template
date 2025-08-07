import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Building, Calendar, AlertCircle, CheckCircle, Wand2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PatientData {
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  medicaidId: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface ProviderData {
  npi: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax: string;
  contactName: string;
}

interface FormData {
  // Request Info
  dateOfRequest: string;
  requestType: string;
  currentPANumber: string;
  notes: string;
  
  // Recipient Info
  recipientName: string;
  recipientId: string;
  dob: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
  guardianName: string;
  guardianPhone: string;
  medicarePartA: boolean;
  medicarePartB: boolean;
  medicareId: string;
  otherInsuranceName: string;
  otherInsuranceId: string;
  
  // Provider Info
  orderingProviderName: string;
  orderingProviderNPI: string;
  orderingProviderAddress: string;
  orderingProviderCity: string;
  orderingProviderState: string;
  orderingProviderZip: string;
  orderingProviderPhone: string;
  orderingProviderFax: string;
  orderingProviderContact: string;
  
  // Facility Info
  facilityName: string;
  facilityNPI: string;
  facilityAddress: string;
  facilityCity: string;
  facilityState: string;
  facilityZip: string;
  facilityPhone: string;
  facilityFax: string;
  facilityContact: string;
  
  // Clinical Info
  isHealthyKids: boolean;
  serviceType: string;
  estimatedAdmissionDate: string;
  dateFrom: string;
  dateTo: string;
  numberOfDays: string;
  
  // Diagnoses
  admissionDiagnosis1: string;
  admissionDiagnosis1Desc: string;
  admissionDiagnosis2: string;
  admissionDiagnosis2Desc: string;
  admissionDiagnosis3: string;
  admissionDiagnosis3Desc: string;
  otherDiagnosis1: string;
  otherDiagnosis1Desc: string;
  otherDiagnosis2: string;
  otherDiagnosis2Desc: string;
  otherDiagnosis3: string;
  otherDiagnosis3Desc: string;
  
  // Procedures
  requestedProcedure1: string;
  requestedProcedure1Desc: string;
  requestedProcedure2: string;
  requestedProcedure2Desc: string;
  requestedProcedure3: string;
  requestedProcedure3Desc: string;
  otherService1: string;
  otherService1Desc: string;
  otherService2: string;
  otherService2Desc: string;
  otherService3: string;
  otherService3Desc: string;
  
  // Clinical Details
  severityOfIllness: string;
  intensityOfService: string;
  dischargePlan: string;
}

export function NevadaMedicaidPriorAuthForm() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    dateOfRequest: new Date().toISOString().split('T')[0],
    requestType: "Admission",
    currentPANumber: "",
    notes: "",
    
    recipientName: "",
    recipientId: "",
    dob: "",
    address: "",
    phone: "",
    city: "",
    state: "NV",
    zipCode: "",
    guardianName: "",
    guardianPhone: "",
    medicarePartA: false,
    medicarePartB: false,
    medicareId: "",
    otherInsuranceName: "",
    otherInsuranceId: "",
    
    orderingProviderName: "",
    orderingProviderNPI: "",
    orderingProviderAddress: "",
    orderingProviderCity: "",
    orderingProviderState: "NV",
    orderingProviderZip: "",
    orderingProviderPhone: "",
    orderingProviderFax: "",
    orderingProviderContact: "",
    
    facilityName: "",
    facilityNPI: "",
    facilityAddress: "",
    facilityCity: "",
    facilityState: "NV",
    facilityZip: "",
    facilityPhone: "",
    facilityFax: "",
    facilityContact: "",
    
    isHealthyKids: false,
    serviceType: "Medical",
    estimatedAdmissionDate: "",
    dateFrom: "",
    dateTo: "",
    numberOfDays: "",
    
    admissionDiagnosis1: "",
    admissionDiagnosis1Desc: "",
    admissionDiagnosis2: "",
    admissionDiagnosis2Desc: "",
    admissionDiagnosis3: "",
    admissionDiagnosis3Desc: "",
    otherDiagnosis1: "",
    otherDiagnosis1Desc: "",
    otherDiagnosis2: "",
    otherDiagnosis2Desc: "",
    otherDiagnosis3: "",
    otherDiagnosis3Desc: "",
    
    requestedProcedure1: "",
    requestedProcedure1Desc: "",
    requestedProcedure2: "",
    requestedProcedure2Desc: "",
    requestedProcedure3: "",
    requestedProcedure3Desc: "",
    otherService1: "",
    otherService1Desc: "",
    otherService2: "",
    otherService2Desc: "",
    otherService3: "",
    otherService3Desc: "",
    
    severityOfIllness: "",
    intensityOfService: "",
    dischargePlan: ""
  });

  // Fetch available patients from your database
  const { data: patients = [] } = useQuery<any[]>({
    queryKey: ["/api/revenue-cycle-accounts/patients"],
  });

  // Auto-populate form with patient data
  const autoPopulateForm = (patientData: any) => {
    setFormData(prev => ({
      ...prev,
      recipientName: `${patientData.patientLastName || 'Unknown'}, ${patientData.patientFirstName || 'Patient'}`,
      recipientId: patientData.hospitalaccountid || "",
      dob: patientData.admitdt ? new Date(patientData.admitdt).toISOString().split('T')[0] : "",
      address: "123 Patient Street", // Mock data - would come from patient system
      city: "Las Vegas",
      state: "NV",
      zipCode: "89101",
      phone: "(702) 555-0123",
      
      // Provider info from the case
      orderingProviderName: patientData.attendingprovidernm || "Dr. Smith",
      orderingProviderNPI: patientData.attendingproviderid || "1234567890",
      orderingProviderAddress: "456 Medical Plaza",
      orderingProviderCity: "Las Vegas",
      orderingProviderState: "NV",
      orderingProviderZip: "89102",
      orderingProviderPhone: "(702) 555-0456",
      orderingProviderFax: "(702) 555-0457",
      orderingProviderContact: "Medical Assistant",
      
      // Facility info
      facilityName: patientData.hospitalnm || "Nevada Medical Center",
      facilityNPI: patientData.facilityid || "9876543210",
      facilityAddress: "789 Hospital Drive",
      facilityCity: "Las Vegas",
      facilityState: "NV",
      facilityZip: "89103",
      facilityPhone: "(702) 555-0789",
      facilityFax: "(702) 555-0790",
      facilityContact: "Prior Auth Department",
      
      // Clinical info from database
      admissionDiagnosis1: patientData.denialcd || "Z51.11",
      admissionDiagnosis1Desc: patientData.denialcodedsc || "Medical evaluation and treatment",
      requestedProcedure1: patientData.procedurecd || "99223",
      requestedProcedure1Desc: patientData.proceduredsc || "Initial hospital care",
      
      estimatedAdmissionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dateFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dateTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      numberOfDays: "3",
      
      severityOfIllness: "Patient presents with acute condition requiring inpatient level of care with continuous monitoring and intervention.",
      intensityOfService: "Comprehensive medical evaluation, diagnostic workup including laboratory studies and imaging, medication management, and multidisciplinary care planning.",
      dischargePlan: "Patient will be discharged home with appropriate follow-up care and medication management once condition is stabilized."
    }));
  };

  const handleSubmit = async () => {
    // In a real implementation, this would submit to Nevada Medicaid system
    console.log("Submitting prior auth request:", formData);
    alert("Prior Authorization Request submitted successfully! (Demo mode)");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Nevada Medicaid Prior Authorization
          </h2>
          <p className="text-muted-foreground">Inpatient Medical and Surgical - Form FA-8</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setSelectedPatient("")} variant="outline">
            <Wand2 className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Submit Request
          </Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Auto-Populate from Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPatient}
            onValueChange={(value) => {
              setSelectedPatient(value);
              const patient = patients.find(p => p.hospitalaccountid === value);
              if (patient) autoPopulateForm(patient);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a patient to auto-populate form..." />
            </SelectTrigger>
            <SelectContent>
              {patients.slice(0, 10).map((patient) => (
                <SelectItem key={patient.hospitalaccountid} value={patient.hospitalaccountid}>
                  Account: {patient.hospitalaccountid} - {patient.currentpayornm} - ${Number(patient.totalchargeamt || 0).toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPatient && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Form auto-populated with patient data
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Information */}
      <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfRequest">Date of Request</Label>
              <Input
                id="dateOfRequest"
                type="date"
                value={formData.dateOfRequest}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfRequest: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="requestType">Request Type</Label>
              <Select value={formData.requestType} onValueChange={(value) => setFormData(prev => ({ ...prev, requestType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admission">Admission</SelectItem>
                  <SelectItem value="Concurrent Review">Concurrent Review</SelectItem>
                  <SelectItem value="Retrospective Review">Retrospective Review</SelectItem>
                  <SelectItem value="Unscheduled Revision">Unscheduled Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="currentPANumber">Current PA Number (if applicable)</Label>
            <Input
              id="currentPANumber"
              value={formData.currentPANumber}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPANumber: e.target.value }))}
              placeholder="Prior authorization number"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes for this request"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name (Last, First, MI)</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Last, First, Middle Initial"
              />
            </div>
            <div>
              <Label htmlFor="recipientId">Recipient ID</Label>
              <Input
                id="recipientId"
                value={formData.recipientId}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                placeholder="Medicaid ID"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(702) 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="medicareId">Medicare ID#</Label>
              <Input
                id="medicareId"
                value={formData.medicareId}
                onChange={(e) => setFormData(prev => ({ ...prev, medicareId: e.target.value }))}
                placeholder="Medicare ID"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Las Vegas"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="NV"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="89101"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicarePartA"
                checked={formData.medicarePartA}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, medicarePartA: !!checked }))}
              />
              <Label htmlFor="medicarePartA">Medicare Part A</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicarePartB"
                checked={formData.medicarePartB}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, medicarePartB: !!checked }))}
              />
              <Label htmlFor="medicarePartB">Medicare Part B</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle>Ordering Provider Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderingProviderName">Provider Name</Label>
              <Input
                id="orderingProviderName"
                value={formData.orderingProviderName}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderName: e.target.value }))}
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <Label htmlFor="orderingProviderNPI">NPI</Label>
              <Input
                id="orderingProviderNPI"
                value={formData.orderingProviderNPI}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderNPI: e.target.value }))}
                placeholder="1234567890"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="orderingProviderAddress">Address</Label>
            <Input
              id="orderingProviderAddress"
              value={formData.orderingProviderAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderAddress: e.target.value }))}
              placeholder="Provider address"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="orderingProviderCity">City</Label>
              <Input
                id="orderingProviderCity"
                value={formData.orderingProviderCity}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderCity: e.target.value }))}
                placeholder="Las Vegas"
              />
            </div>
            <div>
              <Label htmlFor="orderingProviderState">State</Label>
              <Input
                id="orderingProviderState"
                value={formData.orderingProviderState}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderState: e.target.value }))}
                placeholder="NV"
              />
            </div>
            <div>
              <Label htmlFor="orderingProviderZip">Zip</Label>
              <Input
                id="orderingProviderZip"
                value={formData.orderingProviderZip}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderZip: e.target.value }))}
                placeholder="89102"
              />
            </div>
            <div>
              <Label htmlFor="orderingProviderContact">Contact Name</Label>
              <Input
                id="orderingProviderContact"
                value={formData.orderingProviderContact}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderContact: e.target.value }))}
                placeholder="Medical Assistant"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderingProviderPhone">Phone</Label>
              <Input
                id="orderingProviderPhone"
                value={formData.orderingProviderPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderPhone: e.target.value }))}
                placeholder="(702) 555-0456"
              />
            </div>
            <div>
              <Label htmlFor="orderingProviderFax">Fax</Label>
              <Input
                id="orderingProviderFax"
                value={formData.orderingProviderFax}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingProviderFax: e.target.value }))}
                placeholder="(702) 555-0457"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isHealthyKids"
              checked={formData.isHealthyKids}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHealthyKids: !!checked }))}
            />
            <Label htmlFor="isHealthyKids">Is this request for Healthy Kids (EPSDT) referral/services?</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Surgical">Surgical</SelectItem>
                  <SelectItem value="Maternity">Maternity</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
                  <SelectItem value="Observation">Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimatedAdmissionDate">Estimated Admission Date</Label>
              <Input
                id="estimatedAdmissionDate"
                type="date"
                value={formData.estimatedAdmissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedAdmissionDate: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Admission Diagnoses</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`admissionDiagnosis${num}`}>Diagnosis {num}</Label>
                    <Input
                      id={`admissionDiagnosis${num}`}
                      value={formData[`admissionDiagnosis${num}` as keyof FormData] as string}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`admissionDiagnosis${num}`]: e.target.value }))}
                      placeholder="ICD-10 Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`admissionDiagnosis${num}Desc`}>Description</Label>
                    <Input
                      id={`admissionDiagnosis${num}Desc`}
                      value={formData[`admissionDiagnosis${num}Desc` as keyof FormData] as string}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`admissionDiagnosis${num}Desc`]: e.target.value }))}
                      placeholder="Diagnosis description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Requested Procedures</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`requestedProcedure${num}`}>Procedure {num}</Label>
                    <Input
                      id={`requestedProcedure${num}`}
                      value={formData[`requestedProcedure${num}` as keyof FormData] as string}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`requestedProcedure${num}`]: e.target.value }))}
                      placeholder="CPT Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`requestedProcedure${num}Desc`}>Description</Label>
                    <Input
                      id={`requestedProcedure${num}Desc`}
                      value={formData[`requestedProcedure${num}Desc` as keyof FormData] as string}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`requestedProcedure${num}Desc`]: e.target.value }))}
                      placeholder="Procedure description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="severityOfIllness">Severity of Illness (signs and symptoms, abnormal lab or other test findings)</Label>
            <Textarea
              id="severityOfIllness"
              value={formData.severityOfIllness}
              onChange={(e) => setFormData(prev => ({ ...prev, severityOfIllness: e.target.value }))}
              placeholder="Describe the patient's condition and clinical indicators..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="intensityOfService">Intensity of Service (plan of treatment including diagnostic and other services)</Label>
            <Textarea
              id="intensityOfService"
              value={formData.intensityOfService}
              onChange={(e) => setFormData(prev => ({ ...prev, intensityOfService: e.target.value }))}
              placeholder="Describe the treatment plan and services to be provided..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="dischargePlan">Discharge Plan</Label>
            <Textarea
              id="dischargePlan"
              value={formData.dischargePlan}
              onChange={(e) => setFormData(prev => ({ ...prev, dischargePlan: e.target.value }))}
              placeholder="Describe the planned discharge and follow-up care..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Print Form
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Submit Prior Authorization Request
        </Button>
      </div>
    </div>
  );
}