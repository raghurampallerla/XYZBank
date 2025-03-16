import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ManagerLoginPage } from '../pages/ManagerLoginPage';
import path from 'path';
import { AddCustomerPage } from '../pages/AddCustomerPage';
import { readTestData, logMessage, writeReport } from '../utils/common_functions';  // Import from common_functions.ts

// Define an interface for the test result
interface TestResult {
  customer: string;
  customerInfo : string;
  result: string;
  error?: string;
}

test.describe('Manager Add Customer (Data Driven)', () => {
  // Define the path to the test data Excel file
  const testDataPath = path.join(__dirname, '../test_data/customer_data.xlsx');
  
  // Define report path and template path
  const reportPath = path.join(__dirname, '../reports/test_report.html');
  const templatePath = path.join(__dirname, '../templates/Addcust-report-template.html');

  // Read test data from Excel file
  const customerData = readTestData(testDataPath,'Add Cutomer');

  // Initialize the report structure with explicit typing
  const report = {
    testResults: [] as TestResult[], // Specify the type of testResults
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
  };

  for (const customer of customerData) {
    test(`${customer.FirstName} ${customer.LastName} - Add Customer`, async ({ page }) => {
      logMessage(`Starting test for ${customer.FirstName} ${customer.LastName}`);

      const managerLoginPage = new ManagerLoginPage(page);
      const homepage = new HomePage(page);
      const addCustomerPage = new AddCustomerPage(page);

      try {
        // Navigate to the manager login page
        logMessage('Navigating to the login page...');
        await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login/');

        // Click on 'manager login' to navigate to the Manager Login page
        await homepage.clickManagerLogin();
        logMessage('Clicked on Manager Login');

        // Click on 'Add Customer' to navigate to the Add Customer page
        await managerLoginPage.clickAddCustomer();
        logMessage('Navigating to Add Customer page...');

        // Add a customer with details from the test data
        logMessage(`Adding customer: ${customer.FirstName} ${customer.LastName}, ${customer.Postcode}`);
        const customerId =await addCustomerPage.addCustomer(customer.FirstName, customer.LastName, customer.Postcode);
        
        // If successful, update the report and log
        logMessage(`Customer ${customer.FirstName} ${customer.LastName} added successfully.`);
        report.testResults.push({
          customer: `${customer.FirstName} ${customer.LastName}`,
          customerInfo:`${customerId}`,
          result: 'Passed',
        });
        report.passedTests++;

      } catch (error: any) {
        // If failed, update the report and log the error
        logMessage(`Test failed for ${customer.FirstName} ${customer.LastName}. Error: ${error.message}`);
        report.testResults.push({
          customer: `${customer.FirstName} ${customer.LastName}`,
          customerInfo:'',
          result: 'Failed',
          error: error.message,
        });
        report.failedTests++;
      }

      report.totalTests++;
    });
  }

  // Write the report once all tests are finished
  test.afterAll(() => {
    // Call writeReport with the required parameters
    writeReport(report, reportPath, templatePath);
    logMessage('Test execution completed. Report generated.');
  });
});
