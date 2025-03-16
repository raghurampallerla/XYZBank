import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CustomerLoginPage } from '../pages/CustomerLoginPage';
import { DepositPage } from '../pages/DepositPage';
import { readTestData, logMessage, writeReport } from '../utils/common_functions';  // Import from common_functions.ts
import path from 'path';

// Define an interface for the test result
interface TestResult {
  customer: string;
  depositAmounts: string;
  result: string;
  error?: string;
}

test.describe('Customer Deposit Test (Data Driven)', () => {
  // Define the path to the test data Excel file
  const testDataPath = path.join(__dirname, '../test_data/deposit_data.xlsx');
  
  // Define report path and template path
  const reportPath = path.join(__dirname, '../reports/test_report.html');
  const templatePath = path.join(__dirname, '../templates/Deposit-report-template.html');

  // Read test data from Excel file
  const depositData = readTestData(testDataPath,'Deposit');

  // Initialize the report structure with explicit typing
  const report = {
    testResults: [] as TestResult[], // Specify the type of testResults
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
  };

  // Iterate over each customer and perform multiple deposits
  depositData.forEach((deposit) => {
    test(`Customer ${deposit.CustomerName} - Multiple Deposits`, async ({ page }) => {
      logMessage(`Starting test for ${deposit.CustomerName} - Depositing amounts: ${deposit.DepositAmount}`);
      test.setTimeout(60000); // Set the timeout to 1 minute
      const homePage = new HomePage(page);
      const customerLoginPage = new CustomerLoginPage(page);
      const depositPage = new DepositPage(page);

      // Split the deposit amounts from the Excel file (comma-separated)
      const depositAmounts = deposit.DepositAmount.split(',').map((amount:String) => amount.trim());

      try {
        // Navigate to the login page
        logMessage('Navigating to the login page...');
        await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login/');

        // Click on 'Customer Login' to navigate to the Customer Login page
        await homePage.clickCustomerLogin();
        logMessage('Clicked on Customer Login');

        // Login as the customer
        await customerLoginPage.login(deposit.CustomerName);
        logMessage(`Logged in as ${deposit.CustomerName}`);

        // Make all deposits sequentially with a delay in between each deposit
        for (let depositAmount of depositAmounts) {
          logMessage(`Making a deposit of ${depositAmount}`);
          await depositPage.makeDeposit(depositAmount);
          logMessage(`Deposit of ${depositAmount} made successfully`);

          // Add a delay of 2 seconds between each deposit
          await page.waitForTimeout(5000);  // Wait for 5000ms (5 seconds)
        }

        // Once all deposits are made, verify the transaction
        await depositPage.verifyTransaction();
        logMessage('Transaction verified successfully after all deposits');

        await depositPage.validateTransaction();
        logMessage('Transaction validated successfully');

        // If successful, update the report and log
        report.testResults.push({
          customer: deposit.CustomerName,
          depositAmounts: deposit.DepositAmount,  // Store all amounts
          result: 'Passed',
        });
        report.passedTests++;

      } catch (error: any) {
        // If failed, update the report and log the error
        logMessage(`Test failed for ${deposit.CustomerName} - Deposits: ${deposit.DepositAmount}. Error: ${error.message}`);
        report.testResults.push({
          customer: deposit.CustomerName,
          depositAmounts: deposit.DepositAmount,  // Store all amounts
          result: 'Failed',
          error: error.message,
        });
        report.failedTests++;
      }

      report.totalTests++;
    });
  });

  // Write the report once all tests are finished
  test.afterAll(() => {
    // Call writeReport with the required parameters
    writeReport(report, reportPath, templatePath);
    logMessage('Test execution completed. Report generated.');
  });
});
