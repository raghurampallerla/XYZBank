import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

// Function to read data from an Excel file based on the provided test case name
export function readTestData(filePath: string, testCaseName: string): any[] {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
  
    switch (testCaseName) {
      case 'Open Account':
        // Process data for Open Account (CustomerName, Currency)
        return data.map((row: any) => ({
          CustomerName: row.CustomerName,
          Currency: row.Currency,
        }));
  
      case 'Add Cutomer':
        // Process data for Add Cutomer (FirstName, LastName, PostalCode)
        return data.map((row: any) => ({
          FirstName: row.FirstName,
          LastName: row.LastName,
          PostalCode: row.PostalCode,
        }));
  
      case 'Deposit':
        // Process data for Deposit (CustomerName, DepositAmount)
        return data.map((row: any) => ({
          CustomerName: row.CustomerName,
          DepositAmount: row.DepositAmount,
        }));
  
      default:
        throw new Error(`Unknown test case: ${testCaseName}`);
    }
  }

// Function to log test steps and results
export function logMessage(message: string): void {
  const logPath = path.join(__dirname, '../logs/test_log.txt');
  const timestamp = new Date().toISOString();
  const logContent = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logPath, logContent);
}

// Function to read the HTML template and replace placeholders with data
export function generateHTMLReport(templatePath: string, reportContent: { testResults: any[], totalTests: number, passedTests: number, failedTests: number }): string {
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace the placeholders in the template with actual data
  template = template.replace('{{totalTests}}', reportContent.totalTests.toString());
  template = template.replace('{{passedTests}}', reportContent.passedTests.toString());
  template = template.replace('{{failedTests}}', reportContent.failedTests.toString());

  // Generate the test results rows in HTML format, adapting to different types of tests
  const testResultsHTML = reportContent.testResults
    .map(result => {
      // For different test cases, handle the details accordingly (Add Customer, Deposit, etc.)
      if (result.depositAmounts) {
        // For Deposit tests, include deposit amounts
        return `
          <tr class="${result.result === 'Passed' ? 'passed' : 'failed'}">
            <td>${result.customer}</td>
            <td>${result.depositAmounts}</td>
            <td>${result.result}</td>
            <td>${result.error || 'N/A'}</td>
          </tr>
        `;
      } else if (result.customerInfo) {
        // For Add Customer tests, include customer info (FirstName, LastName, Postcode)
        return `
          <tr class="${result.result === 'Passed' ? 'passed' : 'failed'}">
            <td>${result.customer}</td>
            <td>${result.customerInfo}</td>
            <td>${result.result}</td>
            <td>${result.error || 'N/A'}</td>
          </tr>
        `;
      } else if(result.accounnumb) {
        // Default case for other types of tests (if any)
        return `
          <tr class="${result.result === 'Passed' ? 'passed' : 'failed'}">
            <td>${result.customer}</td>
            <td>${result.accounnumb}</td>
            <td>${result.result}</td>
            <td>${result.error || 'N/A'}</td>
          </tr>
        `;
      }
    })
    .join('');

  // Replace the placeholder for test results with the generated rows
  template = template.replace('{{testResults}}', testResultsHTML);

  return template;
}

// Function to write the report to an HTML file, accepting both reportPath and templatePath as parameters
export function writeReport(
    reportContent: { testResults: any[], totalTests: number, passedTests: number, failedTests: number },
    reportPath: string,
    templatePath: string
  ): void {
    const reportHTML = generateHTMLReport(templatePath, reportContent);
  
    // Write the generated HTML to the specified report path
    fs.writeFileSync(reportPath, reportHTML);
  }
  
