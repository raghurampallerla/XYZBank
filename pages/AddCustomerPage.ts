import { Page } from 'playwright';

export class AddCustomerPage {
  private page: Page;

  // Locators for Add Customer Form
  private firstNameField = '[ng-model="fName"]';
  private lastNameField = '[ng-model="lName"]';
  private postCodeField = '[ng-model="postCd"]';
  private addCustomerButton = 'button[type="submit"]:text("Add Customer")';

  constructor(page: Page) {
    this.page = page;
  }
// Method to add a customer and handle the success alert
async addCustomer(firstName: string, lastName: string, postCode: string) {
  let customerId: string | null = null;

  // Fill in customer details
  await this.page.fill(this.firstNameField, firstName);
  await this.page.fill(this.lastNameField, lastName);
  await this.page.fill(this.postCodeField, String(postCode));

  // Set up the dialog listener before interacting with the page
  const dialogPromise = new Promise<string | null>((resolve) => {
    this.page.on('dialog', async (dialog) => {
      console.log('Dialog Type:', dialog.type());
      if (dialog.type() === 'alert') {
        const message = dialog.message();
        console.log('Alert message:', message); // Log the full alert message

        // Updated regex to account for optional spaces after colon
        const regex = /Customer added successfully with customer id\s*:\s*(\d+)/;
        const match = message.match(regex);

        console.log('Regex match result:', match); // Log the result of the regex match

        if (match && match[1]) {
          customerId = match[1]; // Extract the customer ID
          console.log('Extracted Customer ID:', customerId);

          // Resolve the promise with the customer ID
          resolve(customerId);
        } else {
          console.error('Alert message does not match expected format:', message);
          resolve(null); // If no customer ID was found, resolve with null
        }

        // Accept the alert to close it
        await dialog.accept();
      }
    });
  });

  // Click the "Add Customer" button
  await this.page.click(this.addCustomerButton);

  // Wait for the dialog listener to resolve
  const result = await dialogPromise;

  // Return the customerId (null if no ID was found)
  return result;
}

    
 }

