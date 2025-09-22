import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign in page', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/sign-in');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });


  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/sign-in');

    await page.click('text=Sign up');

    await expect(page).toHaveURL('/sign-up');
    await expect(page.locator('div[data-slot="card-title"]')).toContainText('Sign Up');
  });

  test('should display social login options', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.locator('text=Sign in with Google')).toBeVisible();
    await expect(page.locator('text=Sign in with GitHub')).toBeVisible();
  });
  
  test('should redirect to home after successful sign up', async ({ page }) => {
    await page.goto('/sign-up');

    const timestamp = Date.now();
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', `test-${timestamp}@example.com`);
    await page.locator('input[name="password"]').fill('your-password');
    await page.locator('input[name="passwordConfirmation"]').fill('your-password');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/(verify-email|dashboard|$)/);
  });

  test('should display forgot password link', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.locator('text=Forgot your password?')).toBeVisible();
    
    await page.click('text=Forgot your password?');
    await expect(page).toHaveURL('/forgot-password');
  });
});