import { defineConfig, devices } from '@playwright/test';

// BASE_URL unset: test the files in site/ with a local server.
// BASE_URL set (for example a Netlify preview): test that address instead.
const remote = !!process.env.BASE_URL;
const baseURL = process.env.BASE_URL || 'http://localhost:4173';
const chrome = process.env.LOCAL_CHROME ? { launchOptions: { executablePath: process.env.LOCAL_CHROME } } : {};

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, ...chrome } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'], ...chrome } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
  ],
  webServer: remote ? undefined : {
    command: 'npm run serve',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
