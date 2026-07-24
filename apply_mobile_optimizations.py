#!/usr/bin/env python3
"""
Apply mobile optimizations to all HTML files in public/
Adds: CSS variables, skip link, mobile nav, hamburger, responsive styles, shared mobile.js
"""
import os
import re
from pathlib import Path

PUBLIC_DIR = Path("/Volumes/512-B/Documents/Hermes/AGENTS/workspace/tayoca-www/public")

# CSS variables and mobile styles to inject
MOBILE_STYLES = '''
    <style>
        :root {
            --bg: #0d0d0d;
            --bg-elevated: #1a1a1a;
            --fg: #e5e7eb;
            --fg-muted: #9ca3af;
            --accent: #f97316;
            --accent-hover: #ea580c;
            --border: #374151;
            --border-hover: #4b5563;
            --card-bg: #111827;
            --focus-ring: #f97316;
            --header-height: 64px;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        body { background-color: var(--bg); color: var(--fg); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; line-height: 1.6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .skip-link { position: absolute; top: -100%; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; z-index: 10000; font-weight: 600; text-decoration: none; }
        .skip-link:focus { top: 1rem; }
        :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }

        /* Mobile menu */
        .mobile-menu { position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 320px; background: var(--bg); border-left: 1px solid var(--border); z-index: 100; transform: translateX(100%); transition: transform 0.3s ease-out; padding: calc(var(--header-height) + 1rem) 1.5rem 2rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 99; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
        .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
        .mobile-menu a { display: block; padding: 1rem; color: var(--fg); text-decoration: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 500; transition: background 0.2s ease, color 0.2s ease; touch-action: manipulation; }
        .mobile-menu a:hover, .mobile-menu a:focus { background: var(--bg-elevated); color: var(--accent); }
        .mobile-menu a[aria-current="page"] { color: var(--accent); background: rgba(249, 115, 22, 0.1); }
        .mobile-menu-close { position: absolute; top: 1rem; right: 1rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--fg); cursor: pointer; touch-action: manipulation; }
        .mobile-menu-close:hover, .mobile-menu-close:focus { background: var(--border); }

        /* Hamburger */
        .hamburger { display: flex; flex-direction: column; justify-content: space-between; width: 28px; height: 20px; background: transparent; border: none; cursor: pointer; padding: 0; touch-action: manipulation; }
        .hamburger span { display: block; width: 100%; height: 3px; background: var(--fg); border-radius: 2px; transition: transform 0.3s ease, opacity 0.3s ease; }
        .hamburger[aria-expanded="true"] span:nth-child(1) { transform: translateY(8.5px) rotate(45deg); }
        .hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .hamburger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-8.5px) rotate(-45deg); }
        @media (min-width: 768px) { .hamburger { display: none; } }

        /* Responsive typography */
        .hero-title { font-size: clamp(2rem, 8vw, 3.5rem); line-height: 1.1; }
        .hero-subtitle { font-size: clamp(1rem, 3vw, 1.25rem); }
        .section-title { font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.2; }

        /* Card hover - reduced motion safe */
        .card { transition: border-color 0.2s ease, transform 0.2s ease; }
        @media (prefers-reduced-motion: no-preference) { .card:hover { border-color: var(--accent); transform: translateY(-2px); } }
        .card:focus-within { border-color: var(--focus-ring); }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; font-size: 1rem; font-weight: 600; border-radius: 0.5rem; text-decoration: none; border: 2px solid transparent; cursor: pointer; touch-action: manipulation; min-height: 48px; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        .btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
        .btn-primary:hover, .btn-primary:focus { background: var(--accent-hover); border-color: var(--accent-hover); }
        .btn-secondary { background: transparent; color: var(--accent); border-color: var(--accent); }
        .btn-secondary:hover, .btn-secondary:focus { background: rgba(249, 115, 22, 0.1); }
        .btn-ghost { background: transparent; color: var(--fg); border-color: var(--border); }
        .btn-ghost:hover, .btn-ghost:focus { background: var(--bg-elevated); border-color: var(--border-hover); }

        /* Forms */
        .form-input { width: 100%; padding: 0.875rem 1rem; font-size: 1rem; background: var(--bg-elevated); border: 2px solid var(--border); border-radius: 0.5rem; color: var(--fg); min-height: 48px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .form-input::placeholder { color: var(--fg-muted); }
        .form-input:focus { outline: none; border-color: var(--focus-ring); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2); }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--fg); margin-bottom: 0.5rem; }
        .newsletter-form { display: flex; flex-direction: column; gap: 0.75rem; }
        @media (min-width: 640px) { .newsletter-form { flex-direction: row; } }

        /* Footer links */
        .footer-link { color: var(--fg-muted); transition: color 0.2s ease; }
        .footer-link:hover, .footer-link:focus { color: var(--fg); }

        /* Table responsiveness */
        .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1.5rem 0; }
        .table-wrapper::-webkit-scrollbar { height: 8px; }
        .table-wrapper::-webkit-scrollbar-track { background: var(--bg); }
        .table-wrapper::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .table-wrapper::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }
        table { width: 100%; min-width: 600px; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: var(--bg-elevated); color: var(--fg-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; position: sticky; top: 0; z-index: 1; }
        tr:hover td { background: var(--bg-elevated); }

        /* Code blocks */
        .code-block { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; overflow-x: auto; margin: 1.5rem 0; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-size: 0.875rem; line-height: 1.7; -webkit-overflow-scrolling: touch; }
        .code-block code { background: transparent; padding: 0; font-size: inherit; color: var(--fg); }

        /* Images */
        img { max-width: 100%; height: auto; display: block; }

        /* Blog card images */
        .blog-card-image { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 0.5rem; }
        @media (min-width: 768px) { .blog-card-image { width: 100%; height: 192px; } }

        /* Safe area */
        @supports (padding: max(0px)) { .mobile-menu { padding-right: max(1.5rem, env(safe-area-inset-right)); padding-left: max(1.5rem, env(safe-area-inset-left)); padding-bottom: max(2rem, env(safe-area-inset-bottom)); } }

        @media print { .mobile-menu, .hamburger, .newsletter-form, footer { display: none !important; } body { background: white; color: black; } }
    </style>
'''

# Navigation HTML to replace old nav
NAV_HTML = '''
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)] border-b border-[var(--border)]" style="height: var(--header-height);" role="navigation" aria-label="Main navigation">
        <div class="flex items-center justify-between h-full px-4 md:px-6">
            <div class="flex items-center space-x-3">
                <a href="./index.html" class="text-xl font-semibold text-[var(--accent)] nav-link flex items-center" aria-label="Temitayo Charles Akinniranye - Home">
                    <svg class="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3L4 14h7v7l9-9h-7V3z"/></svg>
                    <span class="hidden sm:inline">temitayo</span>
                </a>
            </div>
            <div class="hidden md:flex items-center space-x-1">
                <a href="./index.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Home</a>
                <a href="./services.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Services</a>
                <a href="./products.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Products</a>
                <a href="./blog.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Blog</a>
                <a href="./about.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">About</a>
            </div>
            <button class="hamburger md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu" type="button">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" aria-hidden="true"></div>
    <aside class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="true">
        <button class="mobile-menu-close" aria-label="Close navigation menu" type="button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <nav>
            <a href="./index.html" class="nav-link">Home</a>
            <a href="./services.html" class="nav-link">Services</a>
            <a href="./products.html" class="nav-link">Products</a>
            <a href="./blog.html" class="nav-link">Blog</a>
            <a href="./about.html" class="nav-link">About</a>
        </nav>
    </aside>
'''

# Footer replacement
FOOTER_HTML = '''
    <footer class="border-t border-[var(--border)] mt-16 py-8 px-4">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-[var(--fg-muted)] text-sm">© 2025 Temitayo Charles Akinniranye. All rights reserved.</p>
            <a href="#" class="footer-link text-sm">Privacy Policy</a>
        </div>
    </footer>
'''

# Script tag to add at end of body
SCRIPT_TAG = '''
    <script src="./shared-mobile.js"></script>
'''

# Constants
MOBILE_STYLES = '''
    <style>
        :root {
            --bg: #0d0d0d;
            --bg-elevated: #1a1a1a;
            --fg: #e5e7eb;
            --fg-muted: #9ca3af;
            --accent: #f97316;
            --accent-hover: #ea580c;
            --border: #374151;
            --border-hover: #4b5563;
            --card-bg: #111827;
            --focus-ring: #f97316;
            --header-height: 64px;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        body { background-color: var(--bg); color: var(--fg); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; line-height: 1.6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .skip-link { position: absolute; top: -100%; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; z-index: 10000; font-weight: 600; text-decoration: none; }
        .skip-link:focus { top: 1rem; }
        :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
        .mobile-menu { position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 320px; background: var(--bg); border-left: 1px solid var(--border); z-index: 100; transform: translateX(100%); transition: transform 0.3s ease-out; padding: calc(var(--header-height) + 1rem) 1.5rem 2rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 99; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
        .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
        .mobile-menu a { display: block; padding: 1rem; color: var(--fg); text-decoration: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 500; transition: background 0.2s ease, color 0.2s ease; touch-action: manipulation; }
        .mobile-menu a:hover, .mobile-menu a:focus { background: var(--bg-elevated); color: var(--accent); }
        .mobile-menu a[aria-current="page"] { color: var(--accent); background: rgba(249, 115, 22, 0.1); }
        .mobile-menu-close { position: absolute; top: 1rem; right: 1rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--fg); cursor: pointer; touch-action: manipulation; }
        .mobile-menu-close:hover, .mobile-menu-close:focus { background: var(--border); }
        .hamburger { display: flex; flex-direction: column; justify-content: space-between; width: 28px; height: 20px; background: transparent; border: none; cursor: pointer; padding: 0; touch-action: manipulation; }
        .hamburger span { display: block; width: 100%; height: 3px; background: var(--fg); border-radius: 2px; transition: transform 0.3s ease, opacity 0.3s ease; }
        .hamburger[aria-expanded="true"] span:nth-child(1) { transform: translateY(8.5px) rotate(45deg); }
        .hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .hamburger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-8.5px) rotate(-45deg); }
        @media (min-width: 768px) { .hamburger { display: none; } }
        .hero-title { font-size: clamp(2rem, 8vw, 3.5rem); line-height: 1.1; }
        .hero-subtitle { font-size: clamp(1rem, 3vw, 1.25rem); }
        .section-title { font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.2; }
        .card { transition: border-color 0.2s ease, transform 0.2s ease; }
        @media (prefers-reduced-motion: no-preference) { .card:hover { border-color: var(--accent); transform: translateY(-2px); } }
        .card:focus-within { border-color: var(--focus-ring); }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; font-size: 1rem; font-weight: 600; border-radius: 0.5rem; text-decoration: none; border: 2px solid transparent; cursor: pointer; touch-action: manipulation; min-height: 48px; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        .btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
        .btn-primary:hover, .btn-primary:focus { background: var(--accent-hover); border-color: var(--accent-hover); }
        .btn-secondary { background: transparent; color: var(--accent); border-color: var(--accent); }
        .btn-secondary:hover, .btn-secondary:focus { background: rgba(249, 115, 22, 0.1); }
        .btn-ghost { background: transparent; color: var(--fg); border-color: var(--border); }
        .btn-ghost:hover, .btn-ghost:focus { background: var(--bg-elevated); border-color: var(--border-hover); }
        .form-input { width: 100%; padding: 0.875rem 1rem; font-size: 1rem; background: var(--bg-elevated); border: 2px solid var(--border); border-radius: 0.5rem; color: var(--fg); min-height: 48px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .form-input::placeholder { color: var(--fg-muted); }
        .form-input:focus { outline: none; border-color: var(--focus-ring); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2); }
        .newsletter-form { display: flex; flex-direction: column; gap: 0.75rem; }
        @media (min-width: 640px) { .newsletter-form { flex-direction: row; } }
        .footer-link { color: var(--fg-muted); transition: color 0.2s ease; }
        .footer-link:hover, .footer-link:focus { color: var(--fg); }
        @supports (padding: max(0px)) { .mobile-menu { padding-right: max(1.5rem, env(safe-area-inset-right)); padding-left: max(1.5rem, env(safe-area-inset-left)); padding-bottom: max(2rem, env(safe-area-inset-bottom)); } }
        @media print { .mobile-menu, .hamburger, .newsletter-form, footer { display: none !important; } body { background: white; color: black; } }
        /* Blog card image responsive */
        .blog-card-image { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 0.5rem; }
        @media (min-width: 768px) { .blog-card-image { width: 100%; height: 192px; } }
        /* Table wrapper for horizontal scroll */
        .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1.5rem 0; }
        .table-wrapper::-webkit-scrollbar { height: 8px; }
        .table-wrapper::-webkit-scrollbar-track { background: var(--bg); }
        .table-wrapper::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .table-wrapper::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }
        table { width: 100%; min-width: 600px; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: var(--bg-elevated); color: var(--fg-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; position: sticky; top: 0; z-index: 1; }
        tr:hover td { background: var(--bg-elevated); }
        /* Code blocks */
        .code-block, pre { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; overflow-x: auto; margin: 1.5rem 0; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-size: 0.875rem; line-height: 1.7; -webkit-overflow-scrolling: touch; }
        .code-block code, pre code { background: transparent; padding: 0; font-size: inherit; color: var(--fg); }
        img { max-width: 100%; height: auto; display: block; }
    </style>
'''

NAV_HTML = '''
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)] border-b border-[var(--border)]" style="height: var(--header-height);" role="navigation" aria-label="Main navigation">
        <div class="flex items-center justify-between h-full px-4 md:px-6">
            <div class="flex items-center space-x-3">
                <a href="./index.html" class="text-xl font-semibold text-[var(--accent)] nav-link flex items-center" aria-label="Temitayo Charles Akinniranye - Home">
                    <svg class="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3L4 14h7v7l9-9h-7V3z"/></svg>
                    <span class="hidden sm:inline">temitayo</span>
                </a>
            </div>
            <div class="hidden md:flex items-center space-x-1">
                <a href="./index.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Home</a>
                <a href="./services.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Services</a>
                <a href="./products.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Products</a>
                <a href="./blog.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">Blog</a>
                <a href="./about.html" class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors">About</a>
            </div>
            <button class="hamburger md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu" type="button">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>
    </nav>
    <!-- Mobile Menu -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" aria-hidden="true"></div>
    <aside class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="true">
        <button class="mobile-menu-close" aria-label="Close navigation menu" type="button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <nav>
            <a href="./index.html" class="nav-link">Home</a>
            <a href="./services.html" class="nav-link">Services</a>
            <a href="./products.html" class="nav-link">Products</a>
            <a href="./blog.html" class="nav-link">Blog</a>
            <a href="./about.html" class="nav-link">About</a>
        </nav>
    </aside>
'''

FOOTER_HTML = '''
    <footer class="border-t border-[var(--border)] mt-16 py-8 px-4">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-[var(--fg-muted)] text-sm">© 2025 Temitayo Charles Akinniranye. All rights reserved.</p>
            <a href="#" class="footer-link text-sm">Privacy Policy</a>
        </div>
    </footer>
'''

SCRIPT_TAG = '''
    <script src="./shared-mobile.js"></script>
'''

PUBLIC_DIR = Path("/Volumes/512-B/Documents/Hermes/AGENTS/workspace/tayoca-www/public")

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Skip if already has mobile menu
    if 'mobile-menu' in content and 'hamburger' in content:
        print(f"  Skipping {filepath.name} - already has mobile menu")
        return False

    # 1. Add CSS variables and mobile styles after Tailwind script
    if '<style>' in content:
        if '</style>' in content:
            content = content.replace('</style>', MOBILE_STYLES + '</style>', 1)
        else:
            content = content.replace('</head>', MOBILE_STYLES + '</head>')
    else:
        content = content.replace('</head>', MOBILE_STYLES + '</head>')

    # 2. Replace navigation
    nav_replaced = False
    # Try to find any nav tag
    content, nav_count = re.subn(r'<nav[^>]*>.*?</nav>', NAV_HTML, content, flags=re.DOTALL, count=1)
    if nav_count == 0:
        # Try commented nav
        content, nav_count = re.subn(r'<!-- Navigation -->.*?</nav>', NAV_HTML, content, flags=re.DOTALL, count=1)
    if nav_count == 0:
        # Try finding any nav-like structure
        content, nav_count = re.subn(r'<nav[^>]*>.*?</nav>', NAV_HTML, content, flags=re.DOTALL, count=1)

    # 3. Replace footer
    content = re.sub(r'<footer[^>]*>.*?</footer>', FOOTER_HTML, content, flags=re.DOTALL, count=1)
    if '<footer' not in content or '</footer>' not in content:
        content = re.sub(r'<div class="[^"]*footer[^"]*">.*?</div>', FOOTER_HTML, content, flags=re.DOTALL, count=1)

    # 4. Add skip link after <body>
    content = content.replace('<body', '<a href="#main-content" class="skip-link">Skip to main content</a>\n<body', 1)

    # 5. Add main-content id to main content area
    if 'id="main-content"' not in content:
        if '<main' in content:
            content = content.replace('<main', '<main id="main-content"', 1)
        else:
            content = re.sub(r'(<div class="[^"]*container[^"]*">)', r'<main id="main-content" class="flex-1 pt-[var(--header-height)]">\1', content, count=1)

    # 6. Add shared-mobile.js before </body>
    if 'shared-mobile.js' not in content:
        content = content.replace('</body>', SCRIPT_TAG + '\n</body>')

    # 7. Replace old mobile button handler (alert) with proper class
    content = content.replace("mobileMenuButton.addEventListener('click', () => {\n            alert('Mobile menu would open here');\n        });", '')
    content = re.sub(r'const mobileMenuButton = document\.querySelector\([\'"]button[\'"]\);.*?alert\([\'"]Mobile menu would open here[\'"]\);', '', content, flags=re.DOTALL)

    # 8. Update newsletter form to use shared class names
    content = re.sub(r'class="flex flex-col sm:flex-row gap-3 max-w-md"', 'class="newsletter-form"', content)
    content = re.sub(r'class="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"', 'class="form-input"', content)
    content = re.sub(r'class="px-6 py-2 bg-accent-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 whitespace-nowrap"', 'class="btn btn-primary whitespace-nowrap"', content)
    content = re.sub(r'class="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"', 'class="form-input"', content)
    content = re.sub(r'class="px-6 py-2 bg-accent-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 whitespace-nowrap"', 'class="btn btn-primary whitespace-nowrap"', content)

    # 9. Replace accent-orange with var(--accent) in inline styles
    content = content.replace('accent-orange', 'text-[var(--accent)]')
    content = content.replace('bg-accent-orange', 'bg-[var(--accent)]')
    content = content.replace('bg-orange-500', 'bg-[var(--accent)]')
    content = content.replace('hover:bg-orange-600', 'hover:bg-[var(--accent-hover)]')
    content = content.replace('hover:text-orange-500', 'hover:text-[var(--accent)]')
    content = content.replace('border-orange-500', 'border-[var(--accent)]')
    content = content.replace('text-orange-500', 'text-[var(--accent)]')
    content = content.replace('border-orange-500/30', 'border-[var(--accent)]/30')

    # 10. Replace gray-800/900 with var(--card-bg)/var(--bg-elevated)
    content = re.sub(r'bg-gray-800', 'bg-[var(--card-bg)]', content)
    content = re.sub(r'bg-gray-900', 'bg-[var(--bg-elevated)]', content)
    content = re.sub(r'border-gray-700', 'border-[var(--border)]', content)
    content = re.sub(r'border-gray-600', 'border-[var(--border)]', content)
    content = re.sub(r'text-gray-300', 'text-[var(--fg-muted)]', content)
    content = re.sub(r'text-gray-400', 'text-[var(--fg-muted)]', content)
    content = re.sub(r'border-gray-800', 'border-[var(--border)]', content)

    # 11. Remove emoji icons from structural elements (keep in content)
    content = re.sub(r'(<h[1-6][^>]*>)\s*[⚡➕💡🔗]\s*', r'\1', content)

    with open(filepath, 'w') as f:
        f.write(content)
    
    return True

def main():
    html_files = list(PUBLIC_DIR.glob("*.html")) + list(PUBLIC_DIR.glob("blog/*.html"))
    updated = 0
    for filepath in html_files:
        if filepath.name in ['analytics.html', 'sitemap.xml', 'robots.txt']:
            continue
        print(f"Processing {filepath.name}...")
        if process_file(filepath):
            updated += 1
    print(f"\nUpdated {updated} files")