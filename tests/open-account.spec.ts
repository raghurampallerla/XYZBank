import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ManagerLoginPage } from '../pages/ManagerLoginPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { readTestData, logMessage, writeReport } from '../utils/common_functions';  // Import from common_functions.ts
import path from 'path';

// Define an interface for the test result
interface TestResult {
  customer: string;
  accounnumb: string;
  result: string;
  error?: string;
}

test.describe('Manager Open Account (Data Driven)', () => {
  // Define the path to the test data Excel file
  const testDataPath = path.join(__dirname, '../test_data/account_data.xlsx');
  
  // Define report path and template path
  const reportPath = path.join(__dirname, '../reports/test_report.html');
  const templatePath = path.join(__dirname, '../templates/openaccount-report-template.html');

  // Read test data from Excel file
  const accountData = readTestData(testDataPath,'Open Account');

  // Initialize the report structure with explicit typing
  const report = {
    testResults: [] as TestResult[], // Specify the type of testResults
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
  };

  for (const account of accountData) {
    test(`Open Account for ${account.CustomerName} with ${account.Currency}`, async ({ page }) => {
      logMessage(`Starting test for ${account.CustomerName} - Currency: ${account.Currency}`);

      const homePage = new HomePage(page);
      const managerLoginPage = new ManagerLoginPage(page);
      const openAccountPage = new OpenAccountPage(page);

      try {
        // Navigate to the manager login page
        logMessage('Navigating to the login page...');
        await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login/');
        
        // Click on 'manager login' to navigate to the Manager Login page
        await homePage.clickManagerLogin();
        logMessage('Clicked on Manager Login');

        // Click on 'Open Account' to navigate to the Open Account page
        await managerLoginPage.clickOpenAccount();
        logMessage('Navigating to Open Account page...');

        // Open account for the given customer and currency
        logMessage(`Opening account for ${account.CustomerName} with ${account.Currency} currency.`);
        const accounnumb=await openAccountPage.openAccount(account.CustomerName, account.Currency);

        // If successful, update the report and log
        logMessage(`Account for ${account.CustomerName} created successfully with ${account.Currency}.`);
        report.testResults.push({
          customer: account.CustomerName,
          accounnumb:  `${accounnumb}`,
          result: 'Passed',
        });
        report.passedTests++;

      } catch (error: any) {
        // If failed, update the report and log the error
        logMessage(`Test failed for ${account.CustomerName} - Currency: ${account.Currency}. Error: ${error.message}`);
        report.testResults.push({
          customer: account.CustomerName,
          accounnumb: ` `,
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
    writeReport(report, reportPath, templatePath);
    logMessage('Test execution completed. Report generated.');
  });
});
