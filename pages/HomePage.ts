
import { Page } from 'playwright';

export class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for Customer and Manager Login Buttons
  private customerLoginButton = '.btn.btn-primary.btn-lg[ng-click="customer()"]';
  private managerLoginButton = '.btn.btn-primary.btn-lg[ng-click="manager()"]';

  // Method to click on Customer Login
  async clickCustomerLogin() {
    await this.page.click(this.customerLoginButton);
  }

  // Method to click on Manager Login
  async clickManagerLogin() {
    await this.page.click(this.managerLoginButton);
  }
}
