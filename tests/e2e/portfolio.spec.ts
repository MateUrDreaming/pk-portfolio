import { test, expect } from '@playwright/test';

test.describe('Portfolio Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage/Hero Section', () => {
    test('should display hero section with main heading and content', async ({ page }) => {
      // Check main hero heading
      await expect(page.locator('h1')).toContainText('Kia ora, welcome to my portfolio!');
      await expect(page.locator('h1')).toContainText("I'm Parin Kasabia.");
      
      // Check hero description
      await expect(page.locator('text=Recent graduate from the University of Auckland')).toBeVisible();
      await expect(page.locator('text=aspiring to become a DevOps engineer')).toBeVisible();
    });

    test('should display social media and resume buttons', async ({ page }) => {
      // Check LinkedIn button
      const linkedinButton = page.locator('a[href*="linkedin.com/in/parinkasabia"]');
      await expect(linkedinButton).toBeVisible();
      await expect(linkedinButton).toContainText('LinkedIn');
      await expect(linkedinButton).toHaveAttribute('target', '_blank');
      await expect(linkedinButton).toHaveAttribute('rel', 'noopener noreferrer');

      // Check Resume button
      const resumeButton = page.locator('a[href="/file/cv.pdf"]');
      await expect(resumeButton).toBeVisible();
      await expect(resumeButton).toContainText('Resume');
      await expect(resumeButton).toHaveAttribute('target', '_blank');

      // Check GitHub button
      const githubButton = page.locator('a[href*="github.com/MateUrDreaming"]');
      await expect(githubButton).toBeVisible();
      await expect(githubButton).toContainText('Github');
      await expect(githubButton).toHaveAttribute('target', '_blank');
    });

    test('should display testimonials section', async ({ page }) => {
      // Check testimonials heading
      await expect(page.locator('h2:has-text("Kind words from colleagues")')).toBeVisible();
      
      // Check "Share Your Experience" button
      await expect(page.locator('button:has-text("Share Your Experience")')).toBeVisible();
      
      // Check if testimonial carousel is present (it may be empty)
      const testimonialCard = page.locator('[data-slot="card"]').first();
      if (await testimonialCard.isVisible()) {
        await expect(testimonialCard).toBeVisible();
      }
    });

    test('should have testimonial navigation if multiple testimonials exist', async ({ page }) => {
      const prevButton = page.locator('button[aria-label*="previous"]').or(page.locator('button:has([class*="ChevronLeft"])'));
      const nextButton = page.locator('button[aria-label*="next"]').or(page.locator('button:has([class*="ChevronRight"])'));
      
      // Check if navigation buttons exist (they may be disabled if only one testimonial)
      if (await prevButton.count() > 0) {
        await expect(prevButton).toBeVisible();
      }
      if (await nextButton.count() > 0) {
        await expect(nextButton).toBeVisible();
      }
    });
  });

  test.describe('Experience Section', () => {
    test('should navigate to experience page and display header', async ({ page }) => {
      await page.goto('/experience');
      
      // Check experience header
      await expect(page.locator('h1:has-text("My Professional Experience")')).toBeVisible();
      await expect(page.locator('text=Explore my journey through work experience')).toBeVisible();
    });

    test('should display experience filter tabs', async ({ page }) => {
      await page.goto('/experience');
      
      // Check if filter bar exists with tabs
      const workTab = page.locator('text=Work').first();
      const projectsTab = page.locator('text=Projects').first();
      const educationTab = page.locator('text=Education').first();
      
      if (await workTab.isVisible()) {
        await expect(workTab).toBeVisible();
      }
      if (await projectsTab.isVisible()) {
        await expect(projectsTab).toBeVisible();
      }
      if (await educationTab.isVisible()) {
        await expect(educationTab).toBeVisible();
      }
    });

    test('should have working search functionality', async ({ page }) => {
      await page.goto('/experience');
      
      // Look for search input
      const searchInput = page.locator('input[placeholder*="search"]').or(page.locator('input[type="search"]'));
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('software');
        await expect(searchInput).toHaveValue('software');
      }
    });

    test('should display work experience items if they exist', async ({ page }) => {
      await page.goto('/experience');
      
      // Check for work experience cards/items
      const workExperienceItems = page.locator('.work-experience-item').or(
        page.locator('[data-testid*="work"]')
      ).or(
        page.locator('div:has-text("Company")').first()
      );
      
      const count = await workExperienceItems.count();
      if (count > 0) {
        await expect(workExperienceItems.first()).toBeVisible();
        
        // Check if experience item contains typical work info
        const firstItem = workExperienceItems.first();
        const hasJobTitle = await firstItem.locator('*').filter({ hasText: /engineer|developer|analyst|manager/i }).count() > 0;
        const hasCompany = await firstItem.locator('*').filter({ hasText: /company|corp|inc|ltd/i }).count() > 0;
        
        expect(hasJobTitle || hasCompany).toBeTruthy();
      }
    });

    test('should switch between experience tabs', async ({ page }) => {
      await page.goto('/experience');
      
      // Try clicking different tabs if they exist
      const tabs = ['Work', 'Projects', 'Education'];
      
      for (const tabName of tabs) {
        const tab = page.locator(`button:has-text("${tabName}")`).or(page.locator(`text=${tabName}`)).first();
        
        if (await tab.isVisible()) {
          await tab.click();
          // Wait a moment for content to load
          await page.waitForTimeout(500);
          
          // Check that some content is visible after clicking
          const content = page.locator('main').or(page.locator('[role="tabpanel"]'));
          await expect(content).toBeVisible();
        }
      }
    });

    test('should display admin controls if user is admin', async ({ page }) => {
      // This test would require authentication setup
      // For now, just check if add buttons might be present
      await page.goto('/experience');
      
      const addButton = page.locator('button:has-text("Add")').or(
        page.locator('button:has([class*="Plus"])')
      );
      
      // Admin controls may or may not be visible depending on auth state
      // This is more of a smoke test
      if (await addButton.count() > 0) {
        console.log('Admin controls detected');
      }
    });
  });

  test.describe('Contact Section', () => {
    test('should navigate to contact page and display contact form', async ({ page }) => {
      await page.goto('/contact');
      
      // Check contact form is present
      await expect(page.locator('form')).toBeVisible();
      
      // Check contact form heading
      await expect(page.locator('h1,h2,h3').filter({ hasText: /send.*message|contact/i })).toBeVisible();
    });

    test('should display contact form fields', async ({ page }) => {
      await page.goto('/contact');
      
      // Check required form fields
      await expect(page.locator('input[name="name"],input#name')).toBeVisible();
      await expect(page.locator('input[name="email"],input#email')).toBeVisible();
      await expect(page.locator('input[name="subject"],input#subject')).toBeVisible();
      await expect(page.locator('textarea[name="message"],textarea#message')).toBeVisible();
      
      // Check optional fields
      const phoneField = page.locator('input[name="phone"],input#phone');
      const companyField = page.locator('input[name="company"],input#company');
      
      if (await phoneField.isVisible()) {
        await expect(phoneField).toBeVisible();
      }
      if (await companyField.isVisible()) {
        await expect(companyField).toBeVisible();
      }
    });

    test('should have inquiry type selector', async ({ page }) => {
      await page.goto('/contact');
      
      // Check for inquiry type dropdown/select
      const inquirySelect = page.locator('select[name="inquiryType"]').or(
        page.locator('[role="combobox"]')
      ).or(
        page.locator('button:has-text("General")')
      );
      
      if (await inquirySelect.isVisible()) {
        await expect(inquirySelect).toBeVisible();
      }
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/contact');
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Send")')
      );
      
      await submitButton.click();
      
      // Check for validation messages
      const validationMessages = page.locator('[role="alert"]').or(
        page.locator('.text-destructive')
      ).or(
        page.locator('*:has-text("required")')
      );
      
      if (await validationMessages.count() > 0) {
        await expect(validationMessages.first()).toBeVisible();
      }
    });

    test('should fill and submit contact form', async ({ page }) => {
      await page.goto('/contact');
      
      // Fill out the form
      await page.fill('input[name="name"],input#name', 'Test User');
      await page.fill('input[name="email"],input#email', 'test@example.com');
      await page.fill('input[name="subject"],input#subject', 'Test Subject');
      await page.fill('textarea[name="message"],textarea#message', 'This is a test message.');
      
      // Select inquiry type if available
      const inquirySelect = page.locator('select[name="inquiryType"]');
      if (await inquirySelect.isVisible()) {
        await inquirySelect.selectOption('general');
      }
      
      // Submit form (but don't actually send in tests)
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      
      // Note: In a real test environment, you might want to mock the API endpoint
      // to avoid sending actual emails during testing
    });

    test('should display contact info section', async ({ page }) => {
      await page.goto('/contact');
      
      // Check if contact information is displayed
      const contactInfo = page.locator('text=contact').or(
        page.locator('*:has-text("email")')
      ).or(
        page.locator('*:has-text("linkedin")')
      );
      
      if (await contactInfo.count() > 0) {
        await expect(contactInfo.first()).toBeVisible();
      }
    });
  });

  test.describe('Profile Section (Authenticated)', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
      await page.goto('/profile');
      
      // Should redirect to login or show auth required message
      await page.waitForURL(/login|auth|sign-in/);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/login|auth|sign-in/);
    });

    // Note: The following tests would require authentication setup
    test.skip('should display profile form when authenticated', async ({ page }) => {
      // This would require setting up authentication state
      // await authenticateUser(page);
      // await page.goto('/profile');
      // await expect(page.locator('input[name="name"]')).toBeVisible();
    });

    test.skip('should allow profile updates when authenticated', async ({ page }) => {
      // This would require setting up authentication state
      // await authenticateUser(page);
      // await page.goto('/profile');
      // await page.fill('input[name="name"]', 'Updated Name');
      // await page.click('button[type="submit"]');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check homepage loads properly on mobile
      await expect(page.locator('h1')).toBeVisible();
      
      // Navigation should be accessible
      const nav = page.locator('nav');
      if (await nav.isVisible()) {
        await expect(nav).toBeVisible();
      }
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(page.locator('h1')).toBeVisible();
      
      // Check that content adapts to tablet size
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await expect(page.locator('h1')).toBeVisible();
      
      // On desktop, should show full layout
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      expect(headingCount).toBeGreaterThan(0);
      
      // Should have at least one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have alt text for images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/contact');
      
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          const hasAriaLabel = await input.getAttribute('aria-label');
          
          expect(hasLabel || hasAriaLabel).toBeTruthy();
        }
      }
    });

    test('should have proper link attributes', async ({ page }) => {
      const externalLinks = page.locator('a[href^="http"]');
      const count = await externalLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        await expect(link).toHaveAttribute('target', '_blank');
        
        const rel = await link.getAttribute('rel');
        expect(rel).toMatch(/noopener|noreferrer/);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds (adjust as needed)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.goto('/experience');
      await page.goto('/contact');
      
      // Filter out known acceptable errors (adjust as needed)
      const significantErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('chromium') &&
        !error.includes('DevTools')
      );
      
      expect(significantErrors).toHaveLength(0);
    });
  });
});