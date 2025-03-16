import { defineConfig, devices } from '@playwright/test';
import path from 'path';  // Correct import for the path module

export default defineConfig({
  timeout: 30000,  // Set a global timeout for all tests (30 seconds)
  retries: 1,      // Retry failed tests up to 2 times
  use: {
    headless: false,  // Run tests in headless mode (no browser UI)
    screenshot: 'only-on-failure',  // Take a screenshot only if a test fails
    video: 'on-first-retry',  // Record video of the test run for debugging
  },
  projects: [
    {
      name: 'Chrome',  // Test on Chrome
      use: {
        ...devices['Desktop Chrome'],
        // Specify the executablePath for Chrome
       // launchOptions: {
       //   executablePath: path.resolve('C:/Program Files/Google/Chrome/Application/chrome.exe'),  // Windows path (adjust accordingly)
          // For macOS, use the following path:
          // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          // For Linux, use '/usr/bin/google-chrome-stable'
      //  },
      },
    },
  ],
  testDir: './tests',  // The directory where the test files are located
  testMatch: '**/*.spec.ts',  // Match test files ending with `.spec.ts`
});
