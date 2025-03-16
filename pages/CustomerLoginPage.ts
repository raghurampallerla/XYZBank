import { Page } from 'playwright';

export class CustomerLoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private customerSelectDropdown = '#userSelect';
  private loginButton = 'button:has-text("Login")';

  // Method to login as a customer
  async login(customerName: string) {
    try {
      await this.page.click(this.customerSelectDropdown);
      await this.page.selectOption(this.customerSelectDropdown, { label: customerName });
      // Click the login button
      await this.page.click(this.loginButton);
    } catch (error) {
      console.error("Error during login process:", error);
      throw error; // Re-throw the error to see the details in the test output
    }
  }
}
