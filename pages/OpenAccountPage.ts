import { Page } from 'playwright';

export class OpenAccountPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for Open Account Form
  private customerSelectDropdown = '#userSelect';
  private currencySelectDropdown = '#currency';
  private processButton = 'button[type="submit"]:text("Process")';

  // Method to open an account
async openAccount(customerName: string, currency: string) {
  let accountNumber: string | null = null;

  await this.page.click(this.customerSelectDropdown);
  await this.page.selectOption(this.customerSelectDropdown, { label: customerName });
  await this.page.click(this.currencySelectDropdown);
  await this.page.selectOption(this.currencySelectDropdown, { label: currency });

  // Set up a listener for the dialog event
  const dialogPromise = new Promise<string | null>((resolve) => {
    this.page.on('dialog', async (dialog) => {
      // Check if it's an alert
      if (dialog.type() === 'alert') {
        const message = dialog.message();
        console.log('Alert message:', message);  // Log the message

        // Regex pattern to extract account number
        const regex = /Account created successfully with account Number\s*:\s*(\d+)/;
        const match = message.match(regex);
        console.log('Alert message match:', match);

        if (match && match[1]) {
          accountNumber = match[1]; // Extract the account number
          console.log('Extracted Account Number:', accountNumber);

          // Resolve the promise with the extracted account number
          resolve(accountNumber);
        } else {
          console.error('Alert message does not match expected format:', message);
          resolve(null); // Resolve with null if no match
        }

        // Accept the alert
        await dialog.accept();
      }
    });
  });

  // Click the "Process" button to trigger the account creation
  await this.page.click('button[type="submit"]:text("Process")');
  await this.page.waitForTimeout(3000);  // Wait to ensure the dialog has time to trigger

  // Wait for the dialogPromise to resolve, which will return the account number
  const result = await dialogPromise;

  // Return the account number (null if no ID was found)
  return result;
}


  
}
