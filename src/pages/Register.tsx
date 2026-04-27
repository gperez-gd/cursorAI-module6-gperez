import { useState, FormEvent } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

function validateStep1(d: FormData): string[] {
  const errs: string[] = [];
  if (!d.firstName.trim()) errs.push('First name is required.');
  if (!d.lastName.trim()) errs.push('Last name is required.');
  if (!d.email.trim()) errs.push('Email is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errs.push('Please enter a valid email address.');
  return errs;
}

function validateStep2(d: FormData): string[] {
  const errs: string[] = [];
  if (!d.username.trim()) errs.push('Username is required.');
  if (d.password.length < 8) errs.push('Password must be at least 8 characters.');
  if (!/[A-Z]/.test(d.password)) errs.push('Password must contain an uppercase letter.');
  if (!/[0-9]/.test(d.password)) errs.push('Password must contain a number.');
  if (d.password !== d.confirmPassword) errs.push('Passwords do not match.');
  return errs;
}

const STEPS = ['Personal info', 'Account', 'Review'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors.length) setErrors([]);
  }

  function goNext(validate: () => string[]) {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setStep(s => s + 1);
  }

  function goBack() {
    setErrors([]);
    setStep(s => s - 1);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2
            data-testid="success-message"
            className="text-xl font-bold text-green-600 dark:text-green-400 mb-2"
          >
            Registration successful!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Welcome, {form.firstName}. You can now sign in.
          </p>
          <a href="#/login" className="text-indigo-600 hover:underline text-sm font-medium">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Create an account
        </h1>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            {STEPS.map((label, i) => (
              <span key={label} className={i + 1 <= step ? 'text-indigo-600 font-semibold' : ''}>
                {label}
              </span>
            ))}
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-4 space-y-1">
            {errors.map(err => (
              <div
                key={err}
                role="alert"
                className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-2 text-sm text-red-700 dark:text-red-300"
              >
                {err}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Personal info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First name
              </label>
              <input
                data-testid="first-name"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={e => update('firstName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last name
              </label>
              <input
                data-testid="last-name"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={e => update('lastName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                data-testid="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              data-testid="step1-next"
              type="button"
              onClick={() => goNext(() => validateStep1(form))}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 — Account credentials */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                data-testid="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={e => update('username', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                data-testid="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm password
              </label>
              <input
                data-testid="confirm-password"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                data-testid="step2-back"
                type="button"
                onClick={goBack}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                data-testid="step2-next"
                type="button"
                onClick={() => goNext(() => validateStep2(form))}
                className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review & submit */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              {[
                ['First name', form.firstName],
                ['Last name', form.lastName],
                ['Email', form.email],
                ['Username', form.username],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-2">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                data-testid="step3-back"
                type="button"
                onClick={goBack}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                data-testid="submit"
                type="submit"
                className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-sm transition-colors"
              >
                Create account
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <a href="#/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
