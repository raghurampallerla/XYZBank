import { Page } from 'playwright';
// import { DateTime } from 'luxon';

export class DepositPage {
  private page: Page;
  private depositButton = 'button[ng-click="deposit()"]';
  private depositField = '[ng-model="amount"]';
  private submitButton = 'button[type="submit"].btn.btn-default';
  private successMessageSelector = 'span.error.ng-binding';
  private accountBalanceSelector = '.account-balance';

  constructor(page: Page) {
    this.page = page;
  }

  // Method to click on Add Customer
  async clickDeposit() {
    // Wait for the button to be visible and clickable
    await this.page.click(this.depositButton);
  }

  // Method to make a deposit
  async makeDeposit(amount: string) {
    await this.page.click(this.depositButton);
    await this.page.fill(this.depositField, String(amount));
    await this.page.click(this.submitButton);
  }

  // Method to verify deposit success
  async verifyDepositSuccess() {
    // Wait for the error message to be visible (if message is truthy, the span will be visible)
    const message = await this.page.locator(this.successMessageSelector);

    // Check if the message contains "Deposit Successful"
    const messageText = await message.innerText();

    if (messageText.includes('Deposit Successful')) {
      console.log('Deposit was successful!');
    } else {
      console.log('Deposit failed or message not displayed.');
    }
  }

  // Method to verify the transaction
  async verifyTransaction() {
    // Click on the transaction button to view transaction history
    const transactionRow = await this.page.locator('button[ng-click="transactions()"]');
    await transactionRow.click();
    const startvalue=await this.page.inputValue('input#start');
    console.log(startvalue)
    const endvalue=await this.page.inputValue('input#end');
    console.log(endvalue)
    
  }

  // Method to validate the first row in the transaction table
  async validateTransaction() {
    // Step 3: Validate the first row in the transaction table
    const firstRow = await this.page.locator('table.table.table-bordered.table-striped tbody tr:first-child');
    console.log(firstRow);

    // Get the transaction details from the first row
    const firstRowText = await firstRow.innerText();

    if (firstRowText.includes('Credit')) {
      console.log('Credit was successful!');
    } else {
      console.log('Credit failed or message not displayed.');
    }
  }
}

