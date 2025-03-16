XYZ BANK Automation using Playwright with Typescript

#Project Structure: 

XYZ Bank
    pages/                  # Page object models for the application
     HomePage.ts
     ManagerLoginPage.ts
     AddCustomerPage.ts
     OpenAccountPage.ts
     DepositPage.ts
     CustomerLoginPage.ts
     test_data/              # Test data files (Excel sheets)
     customer_data.xlsx
     deposit_data.xlsx
    account_data.xlsx
  tests/                  # Test scripts
      add-customer.spec.ts
      open-account.spec.ts
      make-deposit.spec.ts
  utils/                  # Utility functions
      common_functions.ts
  playwright.config.ts
  tsconfig.json
  reports/                # Generated test reports
  logs/                   # Logs generated during test execution
  templates/              # HTML templates for reports
  package.json            # Project dependencies and scripts
  README.md               # Project documentation
  
#Installation and Setup:
Prerequisites:
Ensure you have the following installed:

   node.js
   Visual Studio Code
   Playwright tool
   XLS  ( to be added to node_modules)

#Setup instructions:
 
1. Clone the repsoitory https://github.com/raghurampallerla/XYZBank.git
2. Open Visual Studio Code
3. Open XYZ Bank project  which was cloned in step 1 and  available in the local repository
4. Open Terminal from Visual Studio code
5. Type npm install playwright
6. type npm install xls
   
#To run the tests, use the following commands:

To Run all tests:
          npx playwright test
Run specific test files:
      Individual Test 1:
          npx playwright test add-customer.spec.ts  
          Note: If you want to run in headed mode use --headed in the above command
      Individual Test 2:
          npx playwright test oen-account.spec.ts
          Note: If you want to run in headed mode use --headed in the above command
      Individual Test 3: 
          npx playwright test make-deposit.spec.ts
          Note: If you want to run in headed mode use --headed in the above command
Run tests in headed mode (to see the browser UI):
          npx playwright test --headed
Run tests in debug mode (to debug tests step-by-step):
          npx playwright test --debug

3. To view Reports:
Go the path locally and open Reports folder
Double click on the html file to see the report

