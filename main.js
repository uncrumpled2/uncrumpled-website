/**
 * Main JavaScript for Uncrumpled Landing Page
 * Handles form submissions, smooth scrolling, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initSmoothScrolling();
    initSignupForm();
    initPollForm();
    initCTAButtons();
    initScrollAnimations();
});

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Hero CTA button handlers
 */
function initCTAButtons() {
    const joinWaitlistBtn = document.getElementById('join-waitlist-hero');
    const shareFeedbackBtn = document.getElementById('share-feedback');

    if (joinWaitlistBtn) {
        joinWaitlistBtn.addEventListener('click', () => {
            const signupSection = document.getElementById('signup');
            if (signupSection) {
                signupSection.scrollIntoView({ behavior: 'smooth' });
                // Focus on email input after scroll
                setTimeout(() => {
                    const emailInput = document.getElementById('email-input');
                    if (emailInput) emailInput.focus();
                }, 500);
            }
        });
    }

    if (shareFeedbackBtn) {
        shareFeedbackBtn.addEventListener('click', () => {
            const pollSection = document.getElementById('poll');
            if (pollSection) {
                pollSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Email signup form handler
 */
function initSignupForm() {
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email-input');
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                showFormError(emailInput, 'Please enter a valid email address');
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Joining...';

            try {
                // Simulate API call (replace with actual endpoint)
                await simulateApiCall({ email, type: 'waitlist' });

                // Show success message
                showFormSuccess(signupForm, 'You\'re on the list! We\'ll be in touch soon.');
                emailInput.value = '';
            } catch (error) {
                showFormError(emailInput, 'Something went wrong. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

/**
 * Poll form handler (feature priority)
 */
function initPollForm() {
    const pollForm = document.getElementById('poll-form');

    if (pollForm) {
        pollForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = pollForm.querySelector('button[type="submit"]');
            const formData = new FormData(pollForm);

            // Get all checked features
            const features = formData.getAll('features');
            const email = formData.get('poll-email');

            // Validate at least one feature is selected
            if (features.length === 0) {
                alert('Please select at least one feature before submitting.');
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';

            try {
                // Simulate API call (replace with actual endpoint)
                await simulateApiCall({
                    features,
                    email: email || null,
                    type: 'poll'
                });

                // Show success message
                showFormSuccess(pollForm, 'Thanks for your input! Your feedback helps us prioritize.');
            } catch (error) {
                alert('Something went wrong. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.problem-item, .feature-card, .audience-item, .why-item, .preview-card, .discussion-card'
    );

    animatableElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Utility: Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Utility: Show form error
 */
function showFormError(input, message) {
    // Remove any existing error
    const existingError = input.parentElement.querySelector('.form-error');
    if (existingError) existingError.remove();

    // Add error styling to input
    input.style.borderColor = '#f92672';

    // Create and show error message
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        color: #f92672;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    `;
    input.parentElement.appendChild(errorEl);

    // Remove error on input
    input.addEventListener('input', () => {
        input.style.borderColor = '';
        errorEl.remove();
    }, { once: true });
}

/**
 * Utility: Show form success
 */
function showFormSuccess(form, message) {
    // Create success message
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>${message}</p>
    `;

    // Replace form content with success message
    form.innerHTML = '';
    form.appendChild(successEl);
}

/**
 * Utility: Simulate API call
 * Replace this with actual API integration
 */
function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
        console.log('Form submission data:', data);

        // Simulate network delay
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 1000);
    });
}

/**
 * Keyboard navigation for checkbox groups
 */
document.querySelectorAll('.poll-options').forEach(group => {
    const options = group.querySelectorAll('.checkbox-option');

    options.forEach((option, index) => {
        option.setAttribute('tabindex', '0');

        option.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const input = option.querySelector('input');
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change'));
            }

            let nextIndex;
            switch (e.key) {
                case 'ArrowDown':
                    nextIndex = (index + 1) % options.length;
                    break;
                case 'ArrowUp':
                    nextIndex = (index - 1 + options.length) % options.length;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            options[nextIndex].focus();
        });
    });
});
