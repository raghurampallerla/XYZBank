import { Page } from 'playwright';

export class ManagerLoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for Manager Login Operations
  private addCustomerButton = 'button.btn.btn-lg.tab:has-text("Add Customer")';
  private openAccountButton = '.btn.btn-lg.tab[ng-click="openAccount()"]';
  private customersButton = '.btn.btn-lg.tab[ng-click="showcust()"]';

  // Method to click on Add Customer
  async clickmanager() {
    // Wait for the button to be visible and clickable
    await this.page.waitForSelector(this.addCustomerButton, { state: 'visible' });
    await this.page.click(this.addCustomerButton);
  }

  // Method to click on Add Customer
  async clickAddCustomer() {
    // Wait for the button to be visible and clickable
    await this.page.click(this.addCustomerButton);
  }
  
  // Method to click on Open Account
  async clickOpenAccount() {
    await this.page.click(this.openAccountButton);
  }

  // Method to click on Customers
  async clickCustomers() {
    await this.page.click(this.customersButton);
  }
}
