/**
 * Form Validation and Input Handling Script
 * Task 4: HTML Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const form = document.getElementById('contactForm');
  const successCard = document.getElementById('successCard');
  const submissionSummary = document.getElementById('submissionSummary');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Input Fields
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const inquirySelect = document.getElementById('inquiryType');
  const messageInput = document.getElementById('message');
  const termsInput = document.getElementById('terms');
  const charCounter = document.getElementById('charCounter');

  // Regex Patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

  // ----------------------------------------------------
  // Helper: Display / Clear Errors
  // ----------------------------------------------------
  function showError(inputElement, errorElementId, message) {
    const errorSpan = document.getElementById(errorElementId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
    if (inputElement) {
      inputElement.classList.add('input-invalid');
      inputElement.classList.remove('input-valid');
      inputElement.setAttribute('aria-invalid', 'true');
    }
  }

  function clearError(inputElement, errorElementId) {
    const errorSpan = document.getElementById(errorElementId);
    if (errorSpan) {
      errorSpan.textContent = '';
    }
    if (inputElement) {
      inputElement.classList.remove('input-invalid');
      inputElement.classList.add('input-valid');
      inputElement.removeAttribute('aria-invalid');
    }
  }

  // ----------------------------------------------------
  // Field Validators
  // ----------------------------------------------------
  function validateFullName() {
    const value = fullNameInput.value.trim();
    if (!value) {
      showError(fullNameInput, 'fullNameError', 'Full name is required.');
      return false;
    }
    if (value.length < 2) {
      showError(fullNameInput, 'fullNameError', 'Full name must be at least 2 characters.');
      return false;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      showError(fullNameInput, 'fullNameError', 'Full name should only contain letters and basic punctuation.');
      return false;
    }
    clearError(fullNameInput, 'fullNameError');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      showError(emailInput, 'emailError', 'Email address is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      showError(emailInput, 'emailError', 'Please enter a valid email address (e.g., name@example.com).');
      return false;
    }
    clearError(emailInput, 'emailError');
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    // Phone is optional, but if provided, validate format
    if (value && !PHONE_REGEX.test(value)) {
      showError(phoneInput, 'phoneError', 'Please enter a valid phone number (min 7 digits).');
      return false;
    }
    clearError(phoneInput, 'phoneError');
    if (!value) {
      // Remove green check for empty optional field
      phoneInput.classList.remove('input-valid');
    }
    return true;
  }

  function validateInquiry() {
    const value = inquirySelect.value;
    if (!value) {
      showError(inquirySelect, 'inquiryTypeError', 'Please select a reason for contact.');
      return false;
    }
    clearError(inquirySelect, 'inquiryTypeError');
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
      showError(messageInput, 'messageError', 'Message cannot be empty.');
      return false;
    }
    if (value.length < 10) {
      showError(messageInput, 'messageError', `Message must be at least 10 characters (currently ${value.length}).`);
      return false;
    }
    clearError(messageInput, 'messageError');
    return true;
  }

  function validateTerms() {
    if (!termsInput.checked) {
      const errorSpan = document.getElementById('termsError');
      if (errorSpan) errorSpan.textContent = 'You must accept the privacy terms to submit.';
      return false;
    }
    const errorSpan = document.getElementById('termsError');
    if (errorSpan) errorSpan.textContent = '';
    return true;
  }

  // ----------------------------------------------------
  // Real-time Event Listeners
  // ----------------------------------------------------
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.classList.contains('input-invalid')) validateFullName();
  });
  fullNameInput.addEventListener('blur', validateFullName);

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-invalid')) validateEmail();
  });
  emailInput.addEventListener('blur', validateEmail);

  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('input-invalid')) validatePhone();
  });
  phoneInput.addEventListener('blur', validatePhone);

  inquirySelect.addEventListener('change', validateInquiry);

  messageInput.addEventListener('input', () => {
    // Update live character count
    const length = messageInput.value.length;
    charCounter.textContent = `${length} / 500 characters`;
    if (length >= 450) {
      charCounter.style.color = 'var(--danger)';
    } else {
      charCounter.style.color = 'var(--text-muted)';
    }

    if (messageInput.classList.contains('input-invalid')) {
      validateMessage();
    }
  });
  messageInput.addEventListener('blur', validateMessage);

  termsInput.addEventListener('change', validateTerms);

  // ----------------------------------------------------
  // Form Reset Handling
  // ----------------------------------------------------
  form.addEventListener('reset', () => {
    // Delay slightly to let standard reset clear values
    setTimeout(() => {
      const allInputs = form.querySelectorAll('input, select, textarea');
      allInputs.forEach(input => {
        input.classList.remove('input-valid', 'input-invalid');
        input.removeAttribute('aria-invalid');
      });
      const errorSpans = form.querySelectorAll('.error-message');
      errorSpans.forEach(span => (span.textContent = ''));
      charCounter.textContent = '0 / 500 characters';
      charCounter.style.color = 'var(--text-muted)';
    }, 10);
  });

  // ----------------------------------------------------
  // Form Submission Handling
  // ----------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent standard browser submission/reloading

    // Run all validations
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isInquiryValid = validateInquiry();
    const isMessageValid = validateMessage();
    const isTermsValid = validateTerms();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isInquiryValid && isMessageValid && isTermsValid;

    if (!isFormValid) {
      // Find first invalid input and focus it
      const firstInvalid = form.querySelector('.input-invalid, input:invalid, textarea:invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Process Form Data
    const formData = new FormData(form);
    const selectedInterests = formData.getAll('interests');
    const contactMethod = formData.get('contactMethod');
    const newsletter = formData.get('newsletter') ? 'Yes' : 'No';

    // Build Summary UI
    submissionSummary.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Full Name:</span>
        <span class="summary-value">${escapeHtml(formData.get('fullName'))}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Email:</span>
        <span class="summary-value">${escapeHtml(formData.get('email'))}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Phone:</span>
        <span class="summary-value">${escapeHtml(formData.get('phone') || 'Not provided')}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Reason:</span>
        <span class="summary-value">${escapeHtml(formData.get('inquiryType'))}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Contact Method:</span>
        <span class="summary-value">${escapeHtml(contactMethod)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Topics:</span>
        <span class="summary-value">${selectedInterests.length > 0 ? escapeHtml(selectedInterests.join(', ')) : 'None selected'}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Newsletter:</span>
        <span class="summary-value">${escapeHtml(newsletter)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Message:</span>
        <span class="summary-value">${escapeHtml(formData.get('message'))}</span>
      </div>
    `;

    // Swap Form with Success Card
    form.classList.add('hidden');
    successCard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // "Send Another Message" Handler
  resetFormBtn.addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    successCard.classList.add('hidden');
    fullNameInput.focus();
  });

  // Utility to prevent XSS in summary rendering
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
