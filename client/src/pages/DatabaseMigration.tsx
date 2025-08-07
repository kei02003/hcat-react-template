import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Database, Upload, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface MigrationStatus {
  database_counts: Record<string, number>;
  total_records: number;
}

interface MigrationResult {
  message: string;
  migrated_counts?: Record<string, number>;
  database_counts?: Record<string, number>;
  status?: string;
}

export default function DatabaseMigration() {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { data: migrationStatus, isLoading } = useQuery<MigrationStatus>({
    queryKey: ['/api/migration-status'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const migrationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/migrate-data', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/migration-status'] });
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Migration failed:', error);
      setIsProcessing(false);
    },
  });

  const handleMigration = () => {
    setIsProcessing(true);
    migrationMutation.mutate();
  };

  const totalRecords = migrationStatus?.total_records || 0;
  const databaseCounts = migrationStatus?.database_counts || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Database Migration Status
          </h1>
          <p className="text-lg text-gray-600">
            Transition your imported CSV data to persistent database storage
          </p>
        </div>

        {/* Migration Status Card */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Current Database Status
            </CardTitle>
            <CardDescription>
              Real-time view of records stored in the PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading status...</span>
              </div>
            ) : (
              <>
                {/* Total Records Summary */}
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {totalRecords.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Records in Database</div>
                </div>

                {/* Individual Table Counts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(databaseCounts).map(([table, count]) => (
                    <div
                      key={table}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {table.replace(/_/g, ' ')}
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {count.toLocaleString()}
                          </div>
                        </div>
                        {count > 0 && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Migration Progress */}
                {totalRecords > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Migration Progress</span>
                      <span>{totalRecords > 0 ? '100%' : '0%'}</span>
                    </div>
                    <Progress value={totalRecords > 0 ? 100 : 0} className="h-3" />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Migration Actions */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6 text-green-600" />
              Migration Actions
            </CardTitle>
            <CardDescription>
              Migrate your imported CSV data to persistent database storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {totalRecords > 0 ? (
              <div className="text-center space-y-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ Database Migration Complete
                </Badge>
                <p className="text-gray-600">
                  Your data has been successfully migrated to the PostgreSQL database.
                  All {totalRecords.toLocaleString()} records are now stored persistently.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Your CSV data is currently stored in memory. Click below to migrate
                  it to the PostgreSQL database for permanent storage.
                </p>
                <Button
                  onClick={handleMigration}
                  disabled={isProcessing || migrationMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-migrate-data"
                >
                  {isProcessing || migrationMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Migrating Data...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Migrate to Database
                    </>
                  )}
                </Button>
                
                {migrationMutation.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      Migration failed: {migrationMutation.error.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Migration Results */}
        {migrationMutation.data && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Migration Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-green-700 font-medium">
                  {(migrationMutation.data as MigrationResult).message}
                </p>
                {(migrationMutation.data as MigrationResult).migrated_counts && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {Object.entries((migrationMutation.data as MigrationResult).migrated_counts!).map(([table, count]) => (
                      <div key={table} className="flex justify-between">
                        <span className="capitalize">{table.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}