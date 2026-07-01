/* ═══════════════════════════════════════════════════════════
   AI4BOTSWANA — MAIN.JS
   Shared across index.html and register.html
═══════════════════════════════════════════════════════════ */

/* ─── NAV: scroll shadow + hamburger ────────────────────── */
(function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();

/* ─── TICKER: pause on hover ─────────────────────────────── */
(function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ═══════════════════════════════════════════════════════════
   REGISTRATION FORM — only runs on register.html
═══════════════════════════════════════════════════════════ */

(function initRegisterForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;                   // not on this page

  const submitBtn   = document.getElementById('submitBtn');
  const formWrap    = document.getElementById('formWrap');
  const successScreen = document.getElementById('successScreen');

  /* ── Read URL params to pre-fill event details ─────────── */
  const params = new URLSearchParams(window.location.search);

  const eventName = decodeURIComponent(params.get('event')    || 'AI4Botswana Event');
  const eventType = decodeURIComponent(params.get('type')     || 'Event');
  const eventDate = decodeURIComponent(params.get('date')     || 'TBC');
  const eventTime = decodeURIComponent(params.get('time')     || 'TBC');
  const eventLoc  = decodeURIComponent(params.get('location') || 'Gaborone, Botswana');

  // Populate hero and sidebar
  const els = {
    heroTitle:        document.getElementById('heroEventName'),
    heroType:         document.getElementById('heroEventType'),
    heroDate:         document.getElementById('heroDate'),
    heroTime:         document.getElementById('heroTime'),
    heroLocation:     document.getElementById('heroLocation'),
    sidebarName:      document.getElementById('sidebarEventName'),
    sidebarType:      document.getElementById('sidebarEventType'),
    sidebarDate:      document.getElementById('sidebarDate'),
    sidebarTime:      document.getElementById('sidebarTime'),
    sidebarLocation:  document.getElementById('sidebarLocation'),
    formHiddenEvent:  document.getElementById('hiddenEvent'),
  };

  if (els.heroTitle)       els.heroTitle.textContent       = eventName;
  if (els.heroType)        els.heroType.textContent        = eventType;
  if (els.heroDate)        els.heroDate.textContent        = eventDate;
  if (els.heroTime)        els.heroTime.textContent        = eventTime;
  if (els.heroLocation)    els.heroLocation.textContent    = eventLoc;
  if (els.sidebarName)     els.sidebarName.textContent     = eventName;
  if (els.sidebarType)     els.sidebarType.textContent     = eventType;
  if (els.sidebarDate)     els.sidebarDate.textContent     = eventDate;
  if (els.sidebarTime)     els.sidebarTime.textContent     = eventTime;
  if (els.sidebarLocation) els.sidebarLocation.textContent = eventLoc;
  if (els.formHiddenEvent) els.formHiddenEvent.value       = eventName;

  /* ── Validation helpers ─────────────────────────────────── */
  function showError(inputEl, msg) {
    inputEl.classList.add('error');
    const errEl = inputEl.parentElement.querySelector('.field-error-msg');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  }

  function clearError(inputEl) {
    inputEl.classList.remove('error');
    const errEl = inputEl.parentElement.querySelector('.field-error-msg');
    if (errEl) errEl.classList.remove('visible');
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function isValidPhone(val) {
    return /^[\d\s\+\-\(\)]{7,}$/.test(val);
  }

  /* ── Proof of payment: file upload UI ────────────────────── */
  const paymentInput      = document.getElementById('paymentProof');
  const fileUploadLabel   = document.getElementById('fileUploadLabel');
  const fileUploadText    = document.getElementById('fileUploadText');
  const fileRemoveBtn     = document.getElementById('fileRemoveBtn');
  const paymentProofError = document.getElementById('paymentProofError');

  const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const DEFAULT_FILE_TEXT = 'Click to upload receipt or screenshot · JPG, PNG or PDF · max 5MB';

  function isValidPaymentFile(file) {
    return ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_BYTES;
  }

  function formatFileSize(bytes) {
    return bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)}KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  function clearPaymentFileError() {
    if (fileUploadLabel) fileUploadLabel.classList.remove('file-error');
    if (paymentProofError) paymentProofError.classList.remove('visible');
  }

  function showPaymentFileError(msg) {
    if (fileUploadLabel) fileUploadLabel.classList.add('file-error');
    if (paymentProofError) {
      paymentProofError.textContent = msg;
      paymentProofError.classList.add('visible');
    }
  }

  function resetPaymentFile() {
    if (paymentInput) paymentInput.value = '';
    if (fileUploadLabel) fileUploadLabel.classList.remove('has-file', 'file-error');
    if (fileUploadText) fileUploadText.textContent = DEFAULT_FILE_TEXT;
    if (fileRemoveBtn) fileRemoveBtn.classList.remove('visible');
    clearPaymentFileError();
  }

  if (paymentInput) {
    paymentInput.addEventListener('change', () => {
      clearPaymentFileError();
      const file = paymentInput.files && paymentInput.files[0];

      if (!file) { resetPaymentFile(); return; }

      if (!isValidPaymentFile(file)) {
        const reason = !ALLOWED_FILE_TYPES.includes(file.type)
          ? 'That file type isn\u2019t supported — use JPG, PNG or PDF.'
          : 'That file is too large — max size is 5MB.';
        showPaymentFileError(reason);
        paymentInput.value = '';
        if (fileUploadLabel) fileUploadLabel.classList.remove('has-file');
        if (fileUploadText) fileUploadText.textContent = DEFAULT_FILE_TEXT;
        if (fileRemoveBtn) fileRemoveBtn.classList.remove('visible');
        return;
      }

      if (fileUploadLabel) fileUploadLabel.classList.add('has-file');
      if (fileUploadText) fileUploadText.textContent = `${file.name} (${formatFileSize(file.size)})`;
      if (fileRemoveBtn) fileRemoveBtn.classList.add('visible');
    });
  }

  if (fileRemoveBtn) {
    fileRemoveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetPaymentFile();
    });
  }

  /* ── Live validation: clear error on change ─────────────── */
  form.querySelectorAll('.field-input, .field-select, .field-textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  /* ── Full validation on submit ──────────────────────────── */
  function validateForm() {
    let valid = true;

    const firstName = form.querySelector('#firstName');
    const lastName  = form.querySelector('#lastName');
    const email     = form.querySelector('#email');
    const phone     = form.querySelector('#phone');
    const consent1  = form.querySelector('#consent1');

    if (!firstName.value.trim()) {
      showError(firstName, 'First name is required.');
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, 'Last name is required.');
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!phone.value.trim()) {
      showError(phone, 'Phone number is required.');
      valid = false;
    } else if (!isValidPhone(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number.');
      valid = false;
    }
    if (!consent1.checked) {
      const box = document.querySelector('.consent-box');
      box.style.borderColor = '#E05050';
      setTimeout(() => box.style.borderColor = '', 2000);
      valid = false;
      alert('Please accept the Privacy Policy to complete your registration.');
    }

    return valid;
  }

  /* ── Collect all form data ───────────────────────────────── */
  function collectFormData() {
    const getValue  = (id)     => (form.querySelector(`#${id}`)?.value || '').trim();
    const getChecked = (name)  => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value).join(', ') || 'Not specified';
    const getRadio  = (name)   => form.querySelector(`input[name="${name}"]:checked`)?.value || 'In-Person';

    return {
      // Event
      event:       eventName,
      eventType:   eventType,
      eventDate:   eventDate,
      eventTime:   eventTime,
      eventLoc:    eventLoc,
      // Personal
      firstName:   getValue('firstName'),
      lastName:    getValue('lastName'),
      email:       getValue('email'),
      phone:       getValue('phone'),
      org:         getValue('org')        || 'Not provided',
      role:        getValue('role')       || 'Not provided',
      industry:    getValue('industry')   || 'Not specified',
      // Attendance
      attendance:  getRadio('attendance'),
      guests:      getValue('guests')     || '0',
      dietary:     getValue('dietary')    || 'None',
      // Sources
      sources:     getChecked('source'),
      // Extra
      expectations: getValue('expectations') || 'Not provided',
      notes:        getValue('notes')        || 'None',
      // Consent
      newsletter:   form.querySelector('#consent2')?.checked ? 'Yes — opted in' : 'No',
      // Timestamp
      timestamp:    new Date().toLocaleString('en-BW', { timeZone: 'Africa/Gaborone' }),
    };
  }

  /* ── Build email body ───────────────────────────────────── */
  function buildEmailBody(d) {
    return `
AI4BOTSWANA — EVENT REGISTRATION
══════════════════════════════════════════

EVENT
──────────────────────────────────────────
Event Name : ${d.event}
Event Type : ${d.eventType}
Date       : ${d.eventDate}
Time       : ${d.eventTime}
Location   : ${d.eventLoc}

REGISTRANT
──────────────────────────────────────────
Name       : ${d.firstName} ${d.lastName}
Email      : ${d.email}
Phone      : ${d.phone}
Organisation: ${d.org}
Role/Title : ${d.role}
Industry   : ${d.industry}

ATTENDANCE
──────────────────────────────────────────
Type       : ${d.attendance}
Extra Guests: ${d.guests}
Dietary    : ${d.dietary}

HEARD ABOUT EVENT VIA
──────────────────────────────────────────
${d.sources}

EXPECTATIONS / GOALS
──────────────────────────────────────────
${d.expectations}

SPECIAL NOTES
──────────────────────────────────────────
${d.notes}

CONSENT
──────────────────────────────────────────
Privacy Policy  : Accepted
Newsletter Opt-in: ${d.newsletter}

──────────────────────────────────────────
Submitted via AI4Botswana Events Portal
${d.timestamp}
`.trim();
  }

  /* ── Step indicator ─────────────────────────────────────── */
  function updateStep(stepNum) {
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 < stepNum) dot.classList.add('done'), dot.textContent = '✓';
      else if (i + 1 === stepNum) dot.classList.add('active');
    });
  }

  /* ── Submit handler ─────────────────────────────────────── */
  const submitErrorBox  = document.getElementById('submitError');
  const submitErrorText = document.getElementById('submitErrorText');
  const formspreeEndpoint = form.dataset.formspreeEndpoint || '';

  function hideSubmitError() {
    if (submitErrorBox) submitErrorBox.classList.remove('visible');
  }

  function showSubmitError(msg) {
    if (!submitErrorBox) return;
    if (msg && submitErrorText) submitErrorText.textContent = msg;
    submitErrorBox.classList.add('visible');
    submitErrorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  submitBtn.addEventListener('click', async () => {
    hideSubmitError();
    if (!validateForm()) return;

    const d = collectFormData();
    const paymentFile = paymentInput && paymentInput.files && paymentInput.files[0];

    // Disable button immediately to prevent double-submits
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Guard: catch a forgotten/placeholder endpoint before wasting a request
    if (!formspreeEndpoint || formspreeEndpoint.includes('YOUR_FORM_ID')) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Registration \u00A0\u2192';
      showSubmitError('Registration sending isn\u2019t configured yet — the Formspree endpoint is missing. Please contact the site admin.');
      return;
    }

    try {
      // FormData (not JSON) so the proof-of-payment file can attach as multipart
      const fd = new FormData();
      fd.append('_subject', `[AI4BW Registration] ${d.event} — ${d.firstName} ${d.lastName}`);
      fd.append('event', d.event);
      fd.append('eventType', d.eventType);
      fd.append('eventDate', d.eventDate);
      fd.append('eventTime', d.eventTime);
      fd.append('eventLocation', d.eventLoc);
      fd.append('firstName', d.firstName);
      fd.append('lastName', d.lastName);
      fd.append('email', d.email);
      fd.append('phone', d.phone);
      fd.append('organisation', d.org);
      fd.append('role', d.role);
      fd.append('industry', d.industry);
      fd.append('attendanceType', d.attendance);
      fd.append('extraGuests', d.guests);
      fd.append('dietary', d.dietary);
      fd.append('heardVia', d.sources);
      fd.append('expectations', d.expectations);
      fd.append('notes', d.notes);
      fd.append('newsletterOptIn', d.newsletter);
      fd.append('submittedAt', d.timestamp);
      fd.append('paymentProofAttached', paymentFile ? 'Yes' : 'No');
      fd.append('message', buildEmailBody(d) + (paymentFile ? `\n\nProof of Payment: attached (${paymentFile.name})` : '\n\nProof of Payment: not provided'));

      if (paymentFile) {
        fd.append('proofOfPayment', paymentFile, paymentFile.name);
      }

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd,
      });

      if (!response.ok) {
        // Try to surface Formspree's own error message if present
        let detail = '';
        try {
          const errData = await response.json();
          detail = errData?.errors?.map(e => e.message).join(', ') || '';
        } catch (_) { /* ignore parse errors */ }

        throw new Error(detail || `Request failed (status ${response.status})`);
      }

      // Success
      formWrap.style.display = 'none';
      successScreen.classList.add('active');
      resetPaymentFile();

      const successEmailEl = document.getElementById('successEmail');
      if (successEmailEl) successEmailEl.textContent = d.email;

      updateStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Registration submission failed:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Registration \u00A0\u2192';
      showSubmitError(
        'We couldn\u2019t send your registration — please check your connection and try again, or email us directly at rockbisonbyjimin@gmail.com.'
      );
    }
  });

  // Start on step 1
  updateStep(1);

  // Move to step 2 when first section is interacted with
  const firstInput = form.querySelector('.field-input');
  if (firstInput) {
    firstInput.addEventListener('focus', () => updateStep(2), { once: true });
  }
})();

/* ─── INDEX PAGE: open register page with params ─────────── */
function registerForEvent(name, type, date, time, location) {
  const params = new URLSearchParams({
    event:    name,
    type:     type,
    date:     date,
    time:     time,
    location: location,
  });
  window.location.href = `register.html?${params.toString()}`;
}