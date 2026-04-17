import type { Page, Locator } from '@playwright/test';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
}

export function generateValidFormData(): FormData {
  const ts = Date.now();
  return {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser+${ts}@example.com`,
    password: 'Secure@Pass1',
    confirmPassword: 'Secure@Pass1',
    username: `testuser_${ts}`,
  };
}

export function generateInvalidEmailData(): Partial<FormData> {
  return { email: 'not-an-email@' };
}

export function generateWeakPasswordData(): Partial<FormData> {
  return { password: 'weak', confirmPassword: 'weak' };
}

/**
 * Page Object Model for a multi-step registration form.
 */
export class RegistrationPage {
  readonly page: Page;

  // Step 1: Personal info
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly step1Next: Locator;

  // Step 2: Account credentials
  readonly username: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly step2Next: Locator;
  readonly step2Back: Locator;

  // Step 3: Review & submit
  readonly submitButton: Locator;
  readonly step3Back: Locator;

  // Progress / step indicators
  readonly stepIndicator: Locator;

  // Error messages
  readonly errorMessages: Locator;

  // Success state
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.email = page.getByTestId('email');
    this.step1Next = page.getByTestId('step1-next');

    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.confirmPassword = page.getByTestId('confirm-password');
    this.step2Next = page.getByTestId('step2-next');
    this.step2Back = page.getByTestId('step2-back');

    this.submitButton = page.getByTestId('submit');
    this.step3Back = page.getByTestId('step3-back');

    this.stepIndicator = page.getByRole('progressbar');
    this.errorMessages = page.locator('[role="alert"]');
    this.successMessage = page.getByTestId('success-message');
  }

  async goto() {
    await this.page.goto('/#/register');
  }

  async fillStep1(data: Pick<FormData, 'firstName' | 'lastName' | 'email'>) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
  }

  async fillStep2(data: Pick<FormData, 'username' | 'password' | 'confirmPassword'>) {
    if (data.username) await this.username.fill(data.username);
    await this.password.fill(data.password);
    await this.confirmPassword.fill(data.confirmPassword);
  }

  async completeStep1(data: FormData) {
    await this.fillStep1(data);
    await this.step1Next.click();
  }

  async completeStep2(data: FormData) {
    await this.fillStep2(data);
    await this.step2Next.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async completeFullRegistration(data: FormData) {
    await this.goto();
    await this.completeStep1(data);
    await this.completeStep2(data);
    await this.submit();
  }

  async getErrorCount(): Promise<number> {
    return this.errorMessages.count();
  }

  async getVisibleErrors(): Promise<string[]> {
    const errors: string[] = [];
    const count = await this.errorMessages.count();
    for (let i = 0; i < count; i++) {
      errors.push(await this.errorMessages.nth(i).innerText());
    }
    return errors;
  }
}
