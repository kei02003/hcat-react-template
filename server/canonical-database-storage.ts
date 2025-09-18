import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  type CanonicalMetric,
  type InsertCanonicalMetric,
  type CanonicalMetricVersion,
  type InsertCanonicalMetricVersion,
  type CanonicalResult,
  type InsertCanonicalResult,
  type CanonicalStagingResult,
  type InsertCanonicalStagingResult,
  type CanonicalMetricLineage,
  type InsertCanonicalMetricLineage,
  type Transaction,
  type InsertTransaction,
  type Account,
  type InsertAccount,
  type Payer,
  type InsertPayer,
  type BenefitPlan,
  type InsertBenefitPlan,
  type Procedure,
  type InsertProcedure,
  type Diagnosis,
  type InsertDiagnosis,
  type DenialRemark,
  type InsertDenialRemark,
  createGrainKey,
  canonicalMetric,
  canonicalMetricVersion,
  canonicalResult,
  canonicalStagingResult,
  canonicalMetricLineage,
  transactions,
  accounts,
  payers,
  benefit_plans,
  procedures,
  diagnoses,
  denial_remarks,
  canonicalClaimHeaders,
  canonicalClaimLines,
  canonicalClaimStatus,
  canonicalRemittance,
  canonicalPriorAuth,
  canonicalEligibility,
  type SelectClaimHeader,
  type SelectClaimLine,
  type SelectClaimStatus,
  type SelectRemittance,
  type SelectPriorAuth,
  type SelectEligibility,
  type InsertClaimHeader,
  type InsertClaimLine,
  type InsertClaimStatus,
  type InsertRemittance,
  type InsertPriorAuth,
  type InsertEligibility
} from "@shared/schema";

export class CanonicalDatabaseStorage {
  // Base Metrics
  async getCanonicalMetrics(): Promise<CanonicalMetric[]> {
    const results = await db.select().from(canonicalMetric);
    return results;
  }

  async createCanonicalMetric(metric: InsertCanonicalMetric): Promise<CanonicalMetric> {
    const [result] = await db.insert(canonicalMetric).values(metric).returning();
    return result;
  }

  async updateCanonicalMetric(key: string, metric: Partial<InsertCanonicalMetric>): Promise<CanonicalMetric | undefined> {
    const updateData: Partial<{
      metric_key?: string;
      metric?: string;
      metric_description?: string;
      tags?: string[] | null;
    }> = {};
    
    if (metric.metric_key !== undefined) updateData.metric_key = metric.metric_key;
    if (metric.metric !== undefined) updateData.metric = metric.metric;
    if (metric.metric_description !== undefined) updateData.metric_description = metric.metric_description;
    if (metric.tags !== undefined) updateData.tags = metric.tags;
    
    const [result] = await db
      .update(canonicalMetric)
      .set(updateData)
      .where(eq(canonicalMetric.metric_key, key))
      .returning();
    return result;
  }

  // Metric Versions
  async getMetricVersions(metricKey?: string): Promise<CanonicalMetricVersion[]> {
    if (metricKey) {
      return await db
        .select()
        .from(canonicalMetricVersion)
        .where(eq(canonicalMetricVersion.metric_key, metricKey))
        .orderBy(desc(canonicalMetricVersion.created_datetime));
    }
    
    return await db
      .select()
      .from(canonicalMetricVersion)
      .orderBy(desc(canonicalMetricVersion.created_datetime));
  }

  async createMetricVersion(version: InsertCanonicalMetricVersion): Promise<CanonicalMetricVersion> {
    const [result] = await db.insert(canonicalMetricVersion).values(version).returning();
    return result;
  }

  async updateMetricVersion(key: string, version: Partial<InsertCanonicalMetricVersion>): Promise<CanonicalMetricVersion | undefined> {
    const updateData: any = {
      updated_datetime: new Date()
    };
    
    // Only include defined fields
    if (version.metric_key !== undefined) updateData.metric_key = version.metric_key;
    if (version.version_number !== undefined) updateData.version_number = version.version_number;
    if (version.valid_from_datetime !== undefined) updateData.valid_from_datetime = version.valid_from_datetime;
    if (version.valid_to_datetime !== undefined) updateData.valid_to_datetime = version.valid_to_datetime;
    if (version.metric_version_name !== undefined) updateData.metric_version_name = version.metric_version_name;
    if (version.metric_version_description !== undefined) updateData.metric_version_description = version.metric_version_description;
    if (version.grain !== undefined) updateData.grain = version.grain;
    if (version.grain_description !== undefined) updateData.grain_description = version.grain_description;
    if (version.domain !== undefined) updateData.domain = version.domain;
    if (version.result_type !== undefined) updateData.result_type = version.result_type;
    if (version.result_unit !== undefined) updateData.result_unit = version.result_unit;
    if (version.frequency !== undefined) updateData.frequency = version.frequency;
    if (version.source_category !== undefined) updateData.source_category = version.source_category;
    if (version.is_regulatory !== undefined) updateData.is_regulatory = version.is_regulatory;
    if (version.regulatory_program !== undefined) updateData.regulatory_program = version.regulatory_program;
    if (version.steward !== undefined) updateData.steward = version.steward;
    if (version.developer !== undefined) updateData.developer = version.developer;
    if (version.is_active !== undefined) updateData.is_active = version.is_active;
    if (version.metadata_schema !== undefined) updateData.metadata_schema = version.metadata_schema;
    if (version.required_metadata_fields !== undefined) updateData.required_metadata_fields = version.required_metadata_fields;
    
    const [result] = await db
      .update(canonicalMetricVersion)
      .set(updateData)
      .where(eq(canonicalMetricVersion.metric_version_key, key))
      .returning();
    return result;
  }

  async getActiveMetricVersions(): Promise<CanonicalMetricVersion[]> {
    const results = await db
      .select({
        metric_version_key: canonicalMetricVersion.metric_version_key,
        metric_key: canonicalMetricVersion.metric_key,
        version_number: canonicalMetricVersion.version_number,
        valid_from_datetime: canonicalMetricVersion.valid_from_datetime,
        valid_to_datetime: canonicalMetricVersion.valid_to_datetime,
        metric_version_name: canonicalMetricVersion.metric_version_name,
        metric_version_description: canonicalMetricVersion.metric_version_description,
        grain: canonicalMetricVersion.grain,
        grain_description: canonicalMetricVersion.grain_description,
        domain: canonicalMetricVersion.domain,
        result_type: canonicalMetricVersion.result_type,
        result_unit: canonicalMetricVersion.result_unit,
        frequency: canonicalMetricVersion.frequency,
        source_category: canonicalMetricVersion.source_category,
        is_regulatory: canonicalMetricVersion.is_regulatory,
        regulatory_program: canonicalMetricVersion.regulatory_program,
        steward: canonicalMetricVersion.steward,
        developer: canonicalMetricVersion.developer,
        is_active: canonicalMetricVersion.is_active,
        metadata_schema: canonicalMetricVersion.metadata_schema,
        required_metadata_fields: canonicalMetricVersion.required_metadata_fields,
        created_datetime: canonicalMetricVersion.created_datetime,
        updated_datetime: canonicalMetricVersion.updated_datetime,
        tags: canonicalMetric.tags
      })
      .from(canonicalMetricVersion)
      .innerJoin(canonicalMetric, eq(canonicalMetricVersion.metric_key, canonicalMetric.metric_key))
      .where(eq(canonicalMetricVersion.is_active, true))
      .orderBy(desc(canonicalMetricVersion.created_datetime));
    return results as CanonicalMetricVersion[];
  }

  // Results
  async getResults(orgId?: string, entityId?: string, metricVersionKey?: string): Promise<CanonicalResult[]> {
    let whereConditions = [];
    
    if (orgId) {
      whereConditions.push(sql`${canonicalResult.grain_keys}->>'org_id' = ${orgId}`);
    }
    
    if (entityId) {
      whereConditions.push(sql`${canonicalResult.grain_keys}->>'entity_id' = ${entityId}`);
    }
    
    if (metricVersionKey) {
      whereConditions.push(eq(canonicalResult.metric_version_key, metricVersionKey));
    }
    
    if (whereConditions.length > 0) {
      return await db
        .select()
        .from(canonicalResult)
        .where(and(...whereConditions))
        .orderBy(desc(canonicalResult.calculated_at));
    }
    
    return await db
      .select()
      .from(canonicalResult)
      .orderBy(desc(canonicalResult.calculated_at));
  }

  async createResult(result: InsertCanonicalResult): Promise<CanonicalResult> {
    const [insertedResult] = await db.insert(canonicalResult).values([result]).returning();
    return insertedResult;
  }

  async getResultsByGrain(grainKeys: Record<string, string>): Promise<CanonicalResult[]> {
    // Build dynamic where conditions for grain_keys JSONB matching
    const whereConditions = Object.entries(grainKeys).map(([key, value]) =>
      sql`${canonicalResult.grain_keys}->>${key} = ${value}`
    );
    
    const results = await db
      .select()
      .from(canonicalResult)
      .where(and(...whereConditions))
      .orderBy(desc(canonicalResult.calculated_at));
    return results;
  }

  // Staging Results Methods
  async createStagingResult(stagingResult: InsertCanonicalStagingResult): Promise<CanonicalStagingResult> {
    const [result] = await db.insert(canonicalStagingResult).values(stagingResult).returning();
    return result;
  }

  async getStagingResults(orgId?: string, metricVersionKey?: string): Promise<CanonicalStagingResult[]> {
    let query = db
      .select()
      .from(canonicalStagingResult)
      .orderBy(desc(canonicalStagingResult.calculated_at));

    if (orgId && metricVersionKey) {
      query = query.where(
        and(
          sql`${canonicalStagingResult.grain_keys}->>'org_id' = ${orgId}`,
          eq(canonicalStagingResult.metric_version_key, metricVersionKey)
        )
      );
    } else if (orgId) {
      query = query.where(sql`${canonicalStagingResult.grain_keys}->>'org_id' = ${orgId}`);
    } else if (metricVersionKey) {
      query = query.where(eq(canonicalStagingResult.metric_version_key, metricVersionKey));
    }

    return await query;
  }

  // Metric Lineage Methods
  async createMetricLineage(lineage: InsertCanonicalMetricLineage): Promise<CanonicalMetricLineage> {
    const [result] = await db.insert(canonicalMetricLineage).values(lineage).returning();
    return result;
  }

  async getMetricLineage(parentResultKey?: string): Promise<CanonicalMetricLineage[]> {
    let query = db.select().from(canonicalMetricLineage);

    if (parentResultKey) {
      query = query.where(eq(canonicalMetricLineage.parent_result_key, parentResultKey));
    }

    return await query;
  }

  async getLatestResults(metricVersionKey: string, orgId?: string, entityId?: string): Promise<CanonicalResult[]> {
    let whereConditions = [eq(canonicalResult.metric_version_key, metricVersionKey)];
    
    if (orgId) {
      whereConditions.push(sql`${canonicalResult.grain_keys}->>'org_id' = ${orgId}`);
    }
    
    if (entityId) {
      whereConditions.push(sql`${canonicalResult.grain_keys}->>'entity_id' = ${entityId}`);
    }
    
    const results = await db
      .select()
      .from(canonicalResult)
      .where(and(...whereConditions))
      .orderBy(desc(canonicalResult.calculated_at))
      .limit(10);
    return results;
  }

  // Staging Results
  async getStagingResults(metricVersionKey?: string): Promise<CanonicalStagingResult[]> {
    if (metricVersionKey) {
      return await db
        .select()
        .from(canonicalStagingResult)
        .where(eq(canonicalStagingResult.metric_version_key, metricVersionKey))
        .orderBy(desc(canonicalStagingResult.calculated_at));
    }
    
    return await db
      .select()
      .from(canonicalStagingResult)
      .orderBy(desc(canonicalStagingResult.calculated_at));
  }

  async createStagingResult(result: InsertCanonicalStagingResult): Promise<CanonicalStagingResult> {
    const [insertedResult] = await db.insert(canonicalStagingResult).values([result]).returning();
    return insertedResult;
  }

  async promoteStagingResults(metricVersionKey: string): Promise<number> {
    // Get all staging results for the metric version
    const stagingResults = await db
      .select()
      .from(canonicalStagingResult)
      .where(eq(canonicalStagingResult.metric_version_key, metricVersionKey));

    // Insert them into the main results table
    if (stagingResults.length > 0) {
      const resultsToInsert = stagingResults.map(staging => ({
        result_key: staging.result_key,
        grain_keys: staging.grain_keys,
        metric_version_key: staging.metric_version_key,
        result_value_numeric: staging.result_value_numeric,
        result_value_datetime: staging.result_value_datetime,
        result_value_text: staging.result_value_text,
        result_value_boolean: staging.result_value_boolean,
        result_value_json: staging.result_value_json,
        measurement_period_start_datetime: staging.measurement_period_start_datetime,
        measurement_period_end_datetime: staging.measurement_period_end_datetime,
        as_of_datetime: staging.as_of_datetime,
        result_metadata: staging.result_metadata,
        calculated_at: staging.calculated_at,
        calculation_version: staging.calculation_version
      }));

      await db.insert(canonicalResult).values(resultsToInsert);
    }

    // Clear the staging results
    const deleteResult = await db
      .delete(canonicalStagingResult)
      .where(eq(canonicalStagingResult.metric_version_key, metricVersionKey));

    return stagingResults.length;
  }

  async clearStagingResults(metricVersionKey?: string): Promise<number> {
    if (metricVersionKey) {
      const result = await db
        .delete(canonicalStagingResult)
        .where(eq(canonicalStagingResult.metric_version_key, metricVersionKey));
      return result.rowCount || 0;
    }
    
    const result = await db.delete(canonicalStagingResult);
    return result.rowCount || 0;
  }

  // Metric Lineage
  async getMetricLineage(parentResultKey?: string, childResultKey?: string): Promise<CanonicalMetricLineage[]> {
    let whereConditions = [];
    
    if (parentResultKey) {
      whereConditions.push(eq(canonicalMetricLineage.parent_result_key, parentResultKey));
    }
    
    if (childResultKey) {
      whereConditions.push(eq(canonicalMetricLineage.child_result_key, childResultKey));
    }
    
    if (whereConditions.length > 0) {
      return await db
        .select()
        .from(canonicalMetricLineage)
        .where(and(...whereConditions));
    }
    
    return await db.select().from(canonicalMetricLineage);
  }

  async createMetricLineage(lineage: InsertCanonicalMetricLineage): Promise<CanonicalMetricLineage> {
    const [result] = await db.insert(canonicalMetricLineage).values([lineage]).returning();
    return result;
  }

  async getMetricHierarchy(metricVersionKey: string): Promise<CanonicalResult[]> {
    // Get all results for the metric version, then find related metrics through lineage
    const baseResults = await db
      .select()
      .from(canonicalResult)
      .where(eq(canonicalResult.metric_version_key, metricVersionKey));

    // Get all lineage relationships where these results are involved
    if (baseResults.length === 0) return [];

    const resultKeys = baseResults.map(r => r.result_key);
    
    // Find parent and child relationships
    const lineageRelations = await db
      .select()
      .from(canonicalMetricLineage)
      .where(
        sql`${canonicalMetricLineage.parent_result_key} = ANY(${resultKeys}) OR ${canonicalMetricLineage.child_result_key} = ANY(${resultKeys})`
      );

    // Get all related result keys
    const allRelatedKeys = new Set([
      ...resultKeys,
      ...lineageRelations.map(l => l.parent_result_key),
      ...lineageRelations.map(l => l.child_result_key)
    ]);

    // Fetch all related results
    const allResults = await db
      .select()
      .from(canonicalResult)
      .where(sql`${canonicalResult.result_key} = ANY(${Array.from(allRelatedKeys)})`);

    return allResults;
  }

  // Billing Data Methods
  async createPayer(payer: InsertPayer): Promise<Payer> {
    const [result] = await db.insert(payers).values(payer).returning();
    return result;
  }

  async getPayers(orgId?: string): Promise<Payer[]> {
    let query = db.select().from(payers).orderBy(payers.payer_name);
    if (orgId) {
      query = query.where(eq(payers.org_id, orgId));
    }
    return await query;
  }

  async createBenefitPlan(plan: InsertBenefitPlan): Promise<BenefitPlan> {
    const [result] = await db.insert(benefit_plans).values(plan).returning();
    return result;
  }

  async getBenefitPlans(orgId?: string): Promise<BenefitPlan[]> {
    let query = db.select().from(benefit_plans).orderBy(benefit_plans.plan_name);
    if (orgId) {
      query = query.where(eq(benefit_plans.org_id, orgId));
    }
    return await query;
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [result] = await db.insert(accounts).values(account).returning();
    return result;
  }

  async getAccounts(orgId?: string, entityId?: string): Promise<Account[]> {
    let query = db.select().from(accounts).orderBy(desc(accounts.meta_created));
    
    if (orgId && entityId) {
      query = query.where(and(
        eq(accounts.org_id, orgId),
        eq(accounts.entity_id, entityId)
      ));
    } else if (orgId) {
      query = query.where(eq(accounts.org_id, orgId));
    }
    
    return await query;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [result] = await db.insert(transactions).values(transaction).returning();
    return result;
  }

  async getTransactions(orgId?: string, accountKey?: string): Promise<Transaction[]> {
    let query = db.select().from(transactions).orderBy(desc(transactions.service_date));
    
    if (orgId && accountKey) {
      query = query.where(and(
        eq(transactions.org_id, orgId),
        eq(transactions.billing_account_key, accountKey)
      ));
    } else if (orgId) {
      query = query.where(eq(transactions.org_id, orgId));
    }
    
    return await query;
  }

  async createProcedure(procedure: InsertProcedure): Promise<Procedure> {
    const [result] = await db.insert(procedures).values(procedure).returning();
    return result;
  }

  async getProcedures(orgId?: string, accountKey?: string): Promise<Procedure[]> {
    let query = db.select().from(procedures).orderBy(desc(procedures.performed_datetime));
    
    if (orgId && accountKey) {
      query = query.where(and(
        eq(procedures.org_id, orgId),
        eq(procedures.billing_account_key, accountKey)
      ));
    } else if (orgId) {
      query = query.where(eq(procedures.org_id, orgId));
    }
    
    return await query;
  }

  async createDiagnosis(diagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const [result] = await db.insert(diagnoses).values(diagnosis).returning();
    return result;
  }

  async getDiagnoses(orgId?: string, accountKey?: string): Promise<Diagnosis[]> {
    let query = db.select().from(diagnoses).orderBy(desc(diagnoses.diagnosis_datetime));
    
    if (orgId && accountKey) {
      query = query.where(and(
        eq(diagnoses.org_id, orgId),
        eq(diagnoses.billing_account_key, accountKey)
      ));
    } else if (orgId) {
      query = query.where(eq(diagnoses.org_id, orgId));
    }
    
    return await query;
  }

  async createDenialRemark(denialRemark: InsertDenialRemark): Promise<DenialRemark> {
    const [result] = await db.insert(denial_remarks).values(denialRemark).returning();
    return result;
  }

  async getDenialRemarks(orgId?: string, active?: boolean): Promise<DenialRemark[]> {
    let query = db.select().from(denial_remarks).orderBy(desc(denial_remarks.received_datetime));
    
    if (orgId && active !== undefined) {
      query = query.where(and(
        eq(denial_remarks.org_id, orgId),
        eq(denial_remarks.active, active)
      ));
    } else if (orgId) {
      query = query.where(eq(denial_remarks.org_id, orgId));
    } else if (active !== undefined) {
      query = query.where(eq(denial_remarks.active, active));
    }
    
    return await query;
  }

  // Initialize canonical metrics and sample data
  async initializeCanonicalMetrics(): Promise<void> {
    try {
      // Check if we already have canonical metrics initialized
      const existingMetrics = await this.getCanonicalMetrics();
      if (existingMetrics.length > 0) {
        console.log("✓ Canonical metrics already initialized");
        // Still check and initialize billing data if needed
        await this.initializeBillingData();
        return;
      }

      console.log("Initializing canonical metrics...");

      // Load canonical metric definitions from our existing definitions
      const { CANONICAL_METRICS, CANONICAL_METRIC_VERSIONS, generateSampleCanonicalResults } = 
        await import("./canonical-metric-definitions");

      // Insert base metrics
      for (const metric of CANONICAL_METRICS) {
        await this.createCanonicalMetric(metric);
      }

      // Insert metric versions
      for (const version of CANONICAL_METRIC_VERSIONS) {
        await this.createMetricVersion(version);
      }

      // Generate and insert sample results with proper multi-tenant grain keys
      const sampleResults = generateSampleCanonicalResults();
      for (const result of sampleResults) {
        await this.createResult(result);
      }

      // Generate and insert staging results
      const { generateSampleStagingResults, generateSampleMetricLineage } = 
        await import("./canonical-metric-definitions");
      
      const stagingResults = generateSampleStagingResults();
      for (const stagingResult of stagingResults) {
        await this.createStagingResult(stagingResult);
      }

      // Generate and insert metric lineage data
      const lineageData = generateSampleMetricLineage(sampleResults);
      for (const lineage of lineageData) {
        await this.createMetricLineage(lineage);
      }

      console.log(`✓ Initialized ${CANONICAL_METRICS.length} canonical metrics`);
      console.log(`✓ Initialized ${CANONICAL_METRIC_VERSIONS.length} metric versions`);
      console.log(`✓ Initialized ${sampleResults.length} sample results`);
      console.log(`✓ Initialized ${stagingResults.length} staging results`);
      console.log(`✓ Initialized ${lineageData.length} metric lineage records`);

      // Initialize billing data
      await this.initializeBillingData();

    } catch (error) {
      console.error("Failed to initialize canonical metrics:", error);
      throw error;
    }
  }

  // Initialize canonical billing data
  async initializeBillingData(): Promise<void> {
    try {
      // Check if we already have billing data initialized
      const existingPayers = await this.getPayers();
      if (existingPayers.length > 0) {
        console.log("✓ Canonical billing data already initialized");
        return;
      }

      console.log("Initializing canonical billing data...");

      // Generate comprehensive billing mock data
      const { generateAllBillingMockData } = await import("./canonical-billing-mock-data");
      const billingData = generateAllBillingMockData();

      // Insert payers
      for (const payer of billingData.payers) {
        await this.createPayer(payer);
      }

      // Insert benefit plans
      for (const plan of billingData.benefitPlans) {
        await this.createBenefitPlan(plan);
      }

      // Insert accounts
      for (const account of billingData.accounts) {
        await this.createAccount(account);
      }

      // Insert transactions
      for (const transaction of billingData.transactions) {
        await this.createTransaction(transaction);
      }

      // Insert procedures
      for (const procedure of billingData.procedures) {
        await this.createProcedure(procedure);
      }

      // Insert diagnoses
      for (const diagnosis of billingData.diagnoses) {
        await this.createDiagnosis(diagnosis);
      }

      // Insert denial remarks
      for (const denialRemark of billingData.denialRemarks) {
        await this.createDenialRemark(denialRemark);
      }

      console.log(`✓ Initialized ${billingData.summary.payers} payers`);
      console.log(`✓ Initialized ${billingData.summary.benefitPlans} benefit plans`);
      console.log(`✓ Initialized ${billingData.summary.accounts} patient accounts`);
      console.log(`✓ Initialized ${billingData.summary.transactions} billing transactions`);
      console.log(`✓ Initialized ${billingData.summary.procedures} procedures`);
      console.log(`✓ Initialized ${billingData.summary.diagnoses} diagnoses`);
      console.log(`✓ Initialized ${billingData.summary.denialRemarks} denial remarks`);
      console.log("✓ Canonical billing data initialization complete");

    } catch (error) {
      console.error("Failed to initialize canonical billing data:", error);
      throw error;
    }
  }

  // =====================================================
  // CANONICAL CLAIMS STORAGE METHODS
  // =====================================================

  // Claim Headers
  async createClaimHeader(claimHeader: InsertClaimHeader): Promise<SelectClaimHeader> {
    const [result] = await db.insert(canonicalClaimHeaders).values(claimHeader).returning();
    return result;
  }

  async getClaimHeaders(orgId: string, entityId?: string): Promise<SelectClaimHeader[]> {
    const conditions = [eq(canonicalClaimHeaders.org_id, orgId)];
    if (entityId) {
      conditions.push(eq(canonicalClaimHeaders.entity_id, entityId));
    }
    
    return await db
      .select()
      .from(canonicalClaimHeaders)
      .where(and(...conditions))
      .orderBy(desc(canonicalClaimHeaders.original_submission_date));
  }

  async getClaimHeadersByStatus(orgId: string, status: string): Promise<SelectClaimHeader[]> {
    return await db
      .select()
      .from(canonicalClaimHeaders)
      .where(and(
        eq(canonicalClaimHeaders.org_id, orgId),
        eq(canonicalClaimHeaders.current_status, status)
      ))
      .orderBy(desc(canonicalClaimHeaders.status_date));
  }

  async getClaimHeadersByPayer(orgId: string, payerKey: string): Promise<SelectClaimHeader[]> {
    return await db
      .select()
      .from(canonicalClaimHeaders)
      .where(and(
        eq(canonicalClaimHeaders.org_id, orgId),
        eq(canonicalClaimHeaders.payer_key, payerKey)
      ))
      .orderBy(desc(canonicalClaimHeaders.original_submission_date));
  }

  // Claim Lines
  async createClaimLine(claimLine: InsertClaimLine): Promise<SelectClaimLine> {
    const [result] = await db.insert(canonicalClaimLines).values(claimLine).returning();
    return result;
  }

  async getClaimLines(orgId: string, claimKey?: string): Promise<SelectClaimLine[]> {
    const conditions = [eq(canonicalClaimLines.org_id, orgId)];
    if (claimKey) {
      conditions.push(eq(canonicalClaimLines.claim_key, claimKey));
    }
    
    return await db
      .select()
      .from(canonicalClaimLines)
      .where(and(...conditions))
      .orderBy(canonicalClaimLines.claim_key, canonicalClaimLines.line_number);
  }

  async getClaimLinesByStatus(orgId: string, status: string): Promise<SelectClaimLine[]> {
    return await db
      .select()
      .from(canonicalClaimLines)
      .where(and(
        eq(canonicalClaimLines.org_id, orgId),
        eq(canonicalClaimLines.line_status, status)
      ))
      .orderBy(canonicalClaimLines.claim_key, canonicalClaimLines.line_number);
  }

  // Claim Status
  async createClaimStatus(claimStatus: InsertClaimStatus): Promise<SelectClaimStatus> {
    const [result] = await db.insert(canonicalClaimStatus).values(claimStatus).returning();
    return result;
  }

  async getClaimStatus(orgId: string, claimKey?: string): Promise<SelectClaimStatus[]> {
    const conditions = [eq(canonicalClaimStatus.org_id, orgId)];
    if (claimKey) {
      conditions.push(eq(canonicalClaimStatus.claim_key, claimKey));
    }
    
    return await db
      .select()
      .from(canonicalClaimStatus)
      .where(and(...conditions))
      .orderBy(desc(canonicalClaimStatus.status_date));
  }

  async getClaimStatusByStatus(orgId: string, statusCode: string): Promise<SelectClaimStatus[]> {
    return await db
      .select()
      .from(canonicalClaimStatus)
      .where(and(
        eq(canonicalClaimStatus.org_id, orgId),
        eq(canonicalClaimStatus.status_code, statusCode)
      ))
      .orderBy(desc(canonicalClaimStatus.status_date));
  }

  // Remittance
  async createRemittance(remittance: InsertRemittance): Promise<SelectRemittance> {
    const [result] = await db.insert(canonicalRemittance).values(remittance).returning();
    return result;
  }

  async getRemittance(orgId: string, claimKey?: string): Promise<SelectRemittance[]> {
    const conditions = [eq(canonicalRemittance.org_id, orgId)];
    if (claimKey) {
      conditions.push(eq(canonicalRemittance.claim_key, claimKey));
    }
    
    return await db
      .select()
      .from(canonicalRemittance)
      .where(and(...conditions))
      .orderBy(desc(canonicalRemittance.payment_date));
  }

  async getRemittanceByPaymentMethod(orgId: string, paymentMethod: string): Promise<SelectRemittance[]> {
    return await db
      .select()
      .from(canonicalRemittance)
      .where(and(
        eq(canonicalRemittance.org_id, orgId),
        eq(canonicalRemittance.payment_method, paymentMethod)
      ))
      .orderBy(desc(canonicalRemittance.payment_date));
  }

  // Prior Authorization
  async createPriorAuth(priorAuth: InsertPriorAuth): Promise<SelectPriorAuth> {
    const [result] = await db.insert(canonicalPriorAuth).values(priorAuth).returning();
    return result;
  }

  async getPriorAuth(orgId: string, entityId?: string): Promise<SelectPriorAuth[]> {
    const conditions = [eq(canonicalPriorAuth.org_id, orgId)];
    if (entityId) {
      conditions.push(eq(canonicalPriorAuth.entity_id, entityId));
    }
    
    return await db
      .select()
      .from(canonicalPriorAuth)
      .where(and(...conditions))
      .orderBy(desc(canonicalPriorAuth.request_date));
  }

  async getPriorAuthByStatus(orgId: string, authStatus: string): Promise<SelectPriorAuth[]> {
    return await db
      .select()
      .from(canonicalPriorAuth)
      .where(and(
        eq(canonicalPriorAuth.org_id, orgId),
        eq(canonicalPriorAuth.auth_status, authStatus)
      ))
      .orderBy(desc(canonicalPriorAuth.request_date));
  }

  async getPriorAuthByPayer(orgId: string, payerKey: string): Promise<SelectPriorAuth[]> {
    return await db
      .select()
      .from(canonicalPriorAuth)
      .where(and(
        eq(canonicalPriorAuth.org_id, orgId),
        eq(canonicalPriorAuth.payer_key, payerKey)
      ))
      .orderBy(desc(canonicalPriorAuth.request_date));
  }

  // Eligibility
  async createEligibility(eligibility: InsertEligibility): Promise<SelectEligibility> {
    const [result] = await db.insert(canonicalEligibility).values(eligibility).returning();
    return result;
  }

  async getEligibility(orgId: string, active?: boolean): Promise<SelectEligibility[]> {
    const conditions = [eq(canonicalEligibility.org_id, orgId)];
    if (active !== undefined) {
      if (active) {
        conditions.push(eq(canonicalEligibility.verification_status, 'active'));
      } else {
        conditions.push(sql`${canonicalEligibility.verification_status} != 'active'`);
      }
    }
    
    return await db
      .select()
      .from(canonicalEligibility)
      .where(and(...conditions))
      .orderBy(desc(canonicalEligibility.verification_date));
  }

  async getEligibilityByPayer(orgId: string, payerKey: string): Promise<SelectEligibility[]> {
    return await db
      .select()
      .from(canonicalEligibility)
      .where(and(
        eq(canonicalEligibility.org_id, orgId),
        eq(canonicalEligibility.payer_key, payerKey)
      ))
      .orderBy(desc(canonicalEligibility.verification_date));
  }

  async getEligibilityByPatient(orgId: string, patientId: string): Promise<SelectEligibility[]> {
    return await db
      .select()
      .from(canonicalEligibility)
      .where(and(
        eq(canonicalEligibility.org_id, orgId),
        eq(canonicalEligibility.patient_id, patientId)
      ))
      .orderBy(desc(canonicalEligibility.verification_date));
  }

  // Initialize canonical claims data
  async initializeClaimsData(): Promise<void> {
    try {
      // Check if we already have claims data initialized
      const existingHeaders = await this.getClaimHeaders('HC001');
      if (existingHeaders.length > 0) {
        console.log("✓ Canonical claims data already initialized");
        return;
      }

      console.log("Initializing canonical claims data...");

      // Generate comprehensive claims mock data for all organizations
      const { generateCompleteClaimsDataset } = await import("./canonical-claims-mock-data");
      
      const organizations = ['HC001', 'HC002', 'PMC001'];
      let totalCounts = {
        headers: 0,
        lines: 0,
        status: 0,
        remittance: 0,
        priorAuth: 0,
        eligibility: 0
      };

      for (const orgId of organizations) {
        const claimsData = generateCompleteClaimsDataset(orgId);

        // Insert claim headers
        for (const header of claimsData.claimHeaders) {
          await this.createClaimHeader(header);
        }

        // Insert claim lines
        for (const line of claimsData.claimLines) {
          await this.createClaimLine(line);
        }

        // Insert claim status records
        for (const status of claimsData.claimStatus) {
          await this.createClaimStatus(status);
        }

        // Insert remittance records
        for (const remittance of claimsData.remittance) {
          await this.createRemittance(remittance);
        }

        // Insert prior auth records
        for (const auth of claimsData.priorAuth) {
          await this.createPriorAuth(auth);
        }

        // Insert eligibility records
        for (const eligibility of claimsData.eligibility) {
          await this.createEligibility(eligibility);
        }

        totalCounts.headers += claimsData.claimHeaders.length;
        totalCounts.lines += claimsData.claimLines.length;
        totalCounts.status += claimsData.claimStatus.length;
        totalCounts.remittance += claimsData.remittance.length;
        totalCounts.priorAuth += claimsData.priorAuth.length;
        totalCounts.eligibility += claimsData.eligibility.length;
      }

      console.log(`✓ Initialized ${totalCounts.headers} claim headers`);
      console.log(`✓ Initialized ${totalCounts.lines} claim lines`);
      console.log(`✓ Initialized ${totalCounts.status} status records`);
      console.log(`✓ Initialized ${totalCounts.remittance} remittance records`);
      console.log(`✓ Initialized ${totalCounts.priorAuth} prior authorizations`);
      console.log(`✓ Initialized ${totalCounts.eligibility} eligibility verifications`);
      console.log("✓ Canonical claims data initialization complete");

    } catch (error) {
      console.error("Failed to initialize canonical claims data:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const canonicalDb = new CanonicalDatabaseStorage();