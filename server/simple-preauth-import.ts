import fs from 'fs';
import path from 'path';
import { pool } from './db';

export async function importPreAuthFromCSV(): Promise<number> {
  const csvFilePath = path.join(process.cwd(), 'attached_assets', 'preauthorization_data_1754583207436.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found:', csvFilePath);
    return 0;
  }

  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  console.log('Starting preauthorization data import...');
  console.log(`Found ${lines.length - 1} records to import`);
  
  let importCount = 0;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Process records in batches
    for (let i = 1; i < lines.length && i <= 1000; i++) { // Limit to first 1000 records for testing
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      if (values.length < 18) continue; // Skip malformed lines
      
      const query = `
        INSERT INTO preauthorization_data (
          preauthid, accountid, servicetype, proceduredate, requestdate, responsedate,
          daysbeforeprocedure, completedontime, status, authnumber, expirationdate,
          requestedunits, approvedunits, denialreason, priority, physicinadvisorreview,
          appealeligible, delayimpact
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) ON CONFLICT (preauthid) DO UPDATE SET
          status = EXCLUDED.status,
          updateddt = NOW()
      `;
      
      const insertValues = [
        values[0]?.replace(/"/g, '') || '',  // PreAuthID
        values[1]?.replace(/"/g, '') || '',  // AccountID
        values[2]?.replace(/"/g, '') || '',  // ServiceType
        values[3]?.replace(/"/g, '') || null, // ProcedureDate
        values[4]?.replace(/"/g, '') || null, // RequestDate
        values[5]?.replace(/"/g, '') || null, // ResponseDate
        values[6] ? parseFloat(values[6]) : null, // DaysBeforeProcedure
        values[7]?.replace(/"/g, '') || 'N',  // CompletedOnTime
        values[8]?.replace(/"/g, '') || '',   // Status
        values[9]?.replace(/"/g, '') || null, // AuthNumber
        values[10]?.replace(/"/g, '') || null, // ExpirationDate
        values[11] ? parseInt(values[11]) : null, // RequestedUnits
        values[12] ? parseInt(values[12]) : null, // ApprovedUnits
        values[13]?.replace(/"/g, '') || null, // DenialReason
        values[14]?.replace(/"/g, '') || '',   // Priority
        values[15]?.replace(/"/g, '') || 'N',  // PhysicianAdvisorReview
        values[16]?.replace(/"/g, '') || 'N',  // AppealEligible
        values[17]?.replace(/"/g, '') || null  // DelayImpact
      ];
      
      await client.query(query, insertValues);
      importCount++;
      
      if (importCount % 50 === 0) {
        console.log(`Imported ${importCount} records...`);
      }
    }
    
    await client.query('COMMIT');
    console.log(`✓ Import completed: ${importCount} preauthorization records imported`);
    return importCount;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Import failed:', error);
    throw error;
  } finally {
    client.release();
  }
}