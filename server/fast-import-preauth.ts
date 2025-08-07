import fs from 'fs';
import path from 'path';
import { pool } from './db';

export async function fastImportPreAuth(): Promise<number> {
  const csvFilePath = path.join(process.cwd(), 'attached_assets', 'preauthorization_data_1754583207436.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found:', csvFilePath);
    return 0;
  }

  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  
  console.log(`Starting fast import of ${lines.length} preauthorization records...`);
  
  const client = await pool.connect();
  let importCount = 0;
  
  try {
    await client.query('BEGIN');
    
    // Clear existing data first
    await client.query('TRUNCATE TABLE preauthorization_data');
    
    // Prepare batch insert
    const batchSize = 1000;
    const batches = [];
    
    for (let i = 0; i < lines.length; i += batchSize) {
      const batch = lines.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    console.log(`Processing ${batches.length} batches of up to ${batchSize} records each...`);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const values = [];
      const placeholders = [];
      let paramIndex = 1;
      
      for (const line of batch) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        const cols = trimmedLine.split(',');
        if (cols.length < 18) continue;
        
        // Clean and prepare values
        const recordValues = [
          cols[0]?.replace(/"/g, '') || '', // PreAuthID
          cols[1]?.replace(/"/g, '') || '', // AccountID
          cols[2]?.replace(/"/g, '') || '', // ServiceType
          cols[3]?.replace(/"/g, '') || null, // ProcedureDate
          cols[4]?.replace(/"/g, '') || null, // RequestDate
          cols[5]?.replace(/"/g, '') || null, // ResponseDate
          cols[6] ? parseFloat(cols[6]) : null, // DaysBeforeProcedure
          cols[7]?.replace(/"/g, '') || 'N', // CompletedOnTime
          cols[8]?.replace(/"/g, '') || '', // Status
          cols[9]?.replace(/"/g, '') || null, // AuthNumber
          cols[10]?.replace(/"/g, '') || null, // ExpirationDate
          cols[11] ? parseInt(cols[11]) : null, // RequestedUnits
          cols[12] ? parseInt(cols[12]) : null, // ApprovedUnits
          cols[13]?.replace(/"/g, '') || null, // DenialReason
          cols[14]?.replace(/"/g, '') || '', // Priority
          cols[15]?.replace(/"/g, '') || 'N', // PhysicianAdvisorReview
          cols[16]?.replace(/"/g, '') || 'N', // AppealEligible
          cols[17]?.replace(/"/g, '') || null // DelayImpact
        ];
        
        values.push(...recordValues);
        placeholders.push(`(${recordValues.map(() => `$${paramIndex++}`).join(', ')})`);
        importCount++;
      }
      
      if (placeholders.length > 0) {
        const query = `
          INSERT INTO preauthorization_data (
            preauthid, accountid, servicetype, proceduredate, requestdate, responsedate,
            daysbeforeprocedure, completedontime, status, authnumber, expirationdate,
            requestedunits, approvedunits, denialreason, priority, physicinadvisorreview,
            appealeligible, delayimpact
          ) VALUES ${placeholders.join(', ')}
        `;
        
        await client.query(query, values);
        console.log(`✓ Batch ${batchIndex + 1}/${batches.length} completed (${importCount} total records)`);
      }
    }
    
    await client.query('COMMIT');
    console.log(`✅ Fast import completed: ${importCount} preauthorization records imported successfully`);
    return importCount;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Fast import failed:', error);
    throw error;
  } finally {
    client.release();
  }
}