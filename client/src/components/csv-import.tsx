import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Upload, FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react';

interface ImportResult {
  message: string;
  success?: number;
  errors?: string[];
  total?: number;
  database_import?: {
    success: number;
    errors: string[];
  };
  memory_import?: {
    success: number;
    errors: string[];
  };
  total_database_records?: number;
}

interface CSVPreview {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export function CSVImportComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch available entities for import
  const { data: entities = [], isLoading: entitiesLoading } = useQuery({
    queryKey: ['/api/revenue-cycle/import/entities'],
  });

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async ({ file, entityType }: { file: File; entityType: string }) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch(`/api/revenue-cycle/import/preview/${entityType}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as CSVPreview;
    },
    onSuccess: () => {
      setShowPreview(true);
    },
    onError: (error) => {
      toast({
        title: 'Preview Failed',
        description: error instanceof Error ? error.message : 'Failed to preview CSV',
        variant: 'destructive',
      });
    },
  });

  // Import mutation - now imports directly to database
  const importMutation = useMutation({
    mutationFn: async ({ file, entityType }: { file: File; entityType: string }) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      // Use the database import endpoint for persistent storage
      const response = await fetch(`/api/revenue-cycle/import-to-database/${entityType}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as ImportResult;
    },
    onSuccess: (result) => {
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ['/api/revenue-cycle'] });
      queryClient.invalidateQueries({ queryKey: ['/api/migration-status'] });
      const dbSuccess = result.database_import?.success || result.success;
      const totalRecords = result.total_database_records || result.total;
      toast({
        title: 'Database Import Complete',
        description: `Successfully imported ${dbSuccess} records to database. Total database records: ${totalRecords}`,
      });
    },
    onError: (error) => {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import CSV',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowPreview(false);
      setImportResult(null);
    }
  };

  const handlePreview = () => {
    if (selectedFile && selectedEntity) {
      previewMutation.mutate({ file: selectedFile, entityType: selectedEntity });
    }
  };

  const handleImport = () => {
    if (selectedFile && selectedEntity) {
      importMutation.mutate({ file: selectedFile, entityType: selectedEntity });
    }
  };

  const formatEntityName = (entity: string) => {
    return entity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFieldMappingHelp = (entityType: string) => {
    const mappings: Record<string, string[]> = {
      revenue_cycle_accounts: [
        'hospitalAccountID', 'revenueCycleID', 'patientID', 'patientNM', 
        'admitDT', 'dischargeDT', 'currentPayorID', 'currentPayorNM',
        'attendingProviderID', 'departmentNM', 'totalChargeAMT', 'denialCD'
      ],
      clinical_decisions: [
        'hospitalAccountID', 'patientID', 'patientNM', 'departmentNM',
        'recommendedAccountClassCD', 'appealProbability', 'reviewStatus'
      ],
      denial_workflows: [
        'hospitalAccountID', 'denialDate', 'appealDeadline', 'workflowStatus',
        'assignedTo', 'priorityLevel', 'appealOutcome'
      ],
      appeal_cases: [
        'hospitalAccountID', 'denialCD', 'currentPayorID', 'appealProbability',
        'expectedRecoveryAMT', 'workflowStatus'
      ],
      timely_filing_claims: [
        'hospitalAccountID', 'claimID', 'patientID', 'serviceDT', 
        'filingDeadlineDT', 'daysRemaining', 'riskLevel'
      ],
      payors: ['payorNM', 'payorType', 'filingDeadlineDays', 'preAuthRequired'],
      departments: ['departmentNM', 'serviceAreaNM', 'averageChargeAMT'],
      providers: ['providerNM', 'providerType', 'specialtyCD']
    };

    return mappings[entityType] || [];
  };

  return (
    <div className="p-6 space-y-6" data-testid="csv-import-container">
      <div className="flex items-center gap-2">
        <Upload className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Import Healthcare Data</h1>
      </div>

      <Card data-testid="card-upload-form">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Import your healthcare revenue cycle data from CSV files. Select the data type and upload your file to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="entity-select">Data Type</Label>
            <Select 
              value={selectedEntity} 
              onValueChange={setSelectedEntity}
              disabled={entitiesLoading}
            >
              <SelectTrigger data-testid="select-entity-type">
                <SelectValue placeholder="Select data type to import" />
              </SelectTrigger>
              <SelectContent>
                {(entities as string[]).map((entity: string) => (
                  <SelectItem key={entity} value={entity}>
                    {formatEntityName(entity)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              data-testid="input-csv-file"
            />
          </div>

          {selectedEntity && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Expected Fields for {formatEntityName(selectedEntity)}</AlertTitle>
              <AlertDescription>
                <div className="mt-2 flex flex-wrap gap-1">
                  {getFieldMappingHelp(selectedEntity).map((field) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={!selectedFile || !selectedEntity || previewMutation.isPending}
              variant="outline"
              data-testid="button-preview"
            >
              {previewMutation.isPending ? 'Previewing...' : 'Preview Data'}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || !selectedEntity || importMutation.isPending}
              data-testid="button-import"
            >
              {importMutation.isPending ? 'Importing...' : 'Import Data'}
            </Button>
          </div>

          {importMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 animate-spin" />
                <span>Importing data...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && previewMutation.data && (
        <Card data-testid="card-preview">
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Preview of your CSV data ({previewMutation.data?.totalRows || 0} total rows)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewMutation.data?.headers.map((header: string, index: number) => (
                      <TableHead key={index} data-testid={`header-${index}`}>
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewMutation.data?.rows.map((row: string[], rowIndex: number) => (
                    <TableRow key={rowIndex} data-testid={`preview-row-${rowIndex}`}>
                      {row.map((cell: string, cellIndex: number) => (
                        <TableCell key={cellIndex} data-testid={`cell-${rowIndex}-${cellIndex}`}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResult && (
        <Card data-testid="card-import-results">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.errors.length === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600" data-testid="text-success-count">
                  {importResult.success}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600" data-testid="text-error-count">
                  {importResult.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div>
                <div className="text-2xl font-bold" data-testid="text-total-count">
                  {importResult.total}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Import Errors:</h4>
                <ScrollArea className="h-32 w-full rounded-md border p-4">
                  <div className="space-y-1">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600" data-testid={`error-${index}`}>
                        {error}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}