// Shared Mobile Navigation & Newsletter Module for Tayoca
// Include this script on all pages after the DOM content

(function() {
    'use strict';

    // Mobile Navigation
    function initMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const mobileClose = mobileMenu?.querySelector('.mobile-menu-close');

        if (!hamburger || !mobileMenu || !mobileOverlay) return;

        let lastFocusedElement = null;

        function openMenu() {
            lastFocusedElement = document.activeElement;
            hamburger.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('open');
            mobileOverlay.classList.add('open');
            mobileOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Focus trap - focus first focusable element
            const focusable = mobileMenu.querySelector('button, a');
            if (focusable) focusable.focus();
        }

        function closeMenu() {
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            mobileOverlay.classList.remove('open');
            mobileOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // Return focus to hamburger
            if (lastFocusedElement) lastFocusedElement.focus();
        }

        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            if (isExpanded) closeMenu(); else openMenu();
        });

        mobileClose?.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Trap focus in mobile menu
        mobileMenu.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            const focusableElements = mobileMenu.querySelectorAll('button, a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });

        // Close menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Newsletter Form Handler
    function initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        const messageEl = document.getElementById('newsletter-message');

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = form.querySelector('input[name="email"]').value;
            const name = email.split('@')[0];
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            messageEl.classList.add('hidden');

            try {
                // Submit to InsForge (newsletter database)
                const insforgeResponse = await fetch('https://v7mhrspk.function2.insforge.app/newsletter-subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                // Submit to n8n for personalized follow-up email
                try {
                    await fetch('https://n8n.tca-infraforge.site/webhook/tayoca-newsletter-signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, name })
                    });
                } catch (n8nError) {
                    console.warn('n8n webhook failed, but InsForge succeeded:', n8nError);
                }

                const data = await insforgeResponse.json();

                if (insforgeResponse.ok && data.success) {
                    messageEl.textContent = 'Thanks for subscribing! Check your inbox for confirmation.';
                    messageEl.className = 'text-sm text-green-400 mt-2';
                    form.reset();
                } else {
                    messageEl.textContent = data.error || 'Something went wrong. Please try again.';
                    messageEl.className = 'text-sm text-red-400 mt-2';
                }
            } catch (error) {
                messageEl.textContent = 'Network error. Please check your connection and try again.';
                messageEl.className = 'text-sm text-red-400 mt-2';
            }

            messageEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileNav();
            initNewsletterForm();
        });
    } else {
        initMobileNav();
        initNewsletterForm();
    }
})();