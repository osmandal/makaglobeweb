// MAKA GLOBE - Language Switcher System
// Supports: EN (English), DE (German), TR (Turkish)

(function() {
    'use strict';

    // Default language
    const DEFAULT_LANG = 'en';
    const SUPPORTED_LANGS = ['en', 'de', 'tr'];
    const STORAGE_KEY = 'makaglobe_language';

    // Get current language from localStorage or default
    function getCurrentLang() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) {
            return stored;
        }
        // Check browser language
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) {
            return browserLang;
        }
        return DEFAULT_LANG;
    }

    // Set language
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn(`Language '${lang}' is not supported.`);
            return;
        }
        
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.setAttribute('lang', lang);
        applyTranslations(lang);
        updateLanguageSwitcher(lang);
    }

    // Apply translations to the page
    function applyTranslations(lang) {
        // Check if translations object exists
        if (typeof translations === 'undefined') {
            console.error('Translations object not found. Make sure translations.js is loaded first.');
            return;
        }

        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[key];
            
            if (translation && translation[lang]) {
                // Check if it's an input placeholder
                if (el.hasAttribute('placeholder') || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.setAttribute('placeholder', translation[lang]);
                } else {
                    el.textContent = translation[lang];
                }
            } else {
                console.warn(`Translation not found for key: ${key}`);
            }
        });

        // Handle data-i18n-html for elements that need innerHTML
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = translations[key];
            
            if (translation && translation[lang]) {
                el.innerHTML = translation[lang];
            }
        });

        // Handle title attribute translations
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = translations[key];
            
            if (translation && translation[lang]) {
                el.setAttribute('title', translation[lang]);
            }
        });

        // Handle aria-label translations
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translation = translations[key];
            
            if (translation && translation[lang]) {
                el.setAttribute('aria-label', translation[lang]);
            }
        });

        // Handle placeholder translations
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = translations[key];
            
            if (translation && translation[lang]) {
                el.setAttribute('placeholder', translation[lang]);
            }
        });

        // Update page title if defined
        const pageTitle = document.querySelector('title[data-i18n]');
        if (pageTitle) {
            const key = pageTitle.getAttribute('data-i18n');
            const translation = translations[key];
            if (translation && translation[lang]) {
                document.title = translation[lang];
            }
        }
    }

    // Update language switcher UI
    function updateLanguageSwitcher(lang) {
        // All language buttons (including simple lang-btn class)
        const allBtns = document.querySelectorAll('.lang-btn, .lang-btn-desktop, .lang-btn-mobile, [data-lang]');
        allBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('text-primary', 'font-medium');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('text-primary', 'font-medium');
                btn.classList.add('text-gray-500');
            }
        });

        // Desktop switcher
        const desktopBtns = document.querySelectorAll('.lang-btn-desktop');
        desktopBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('active', 'text-primary', 'font-bold');
                btn.classList.remove('text-gray-500');
                // Add underline
                const underline = btn.querySelector('.lang-underline');
                if (underline) {
                    underline.classList.remove('hidden');
                }
            } else {
                btn.classList.remove('active', 'text-primary', 'font-bold');
                btn.classList.add('text-gray-500');
                const underline = btn.querySelector('.lang-underline');
                if (underline) {
                    underline.classList.add('hidden');
                }
            }
        });

        // Mobile switcher
        const mobileBtns = document.querySelectorAll('.lang-btn-mobile');
        mobileBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('active', 'bg-primary', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-secondary');
            } else {
                btn.classList.remove('active', 'bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'text-secondary');
            }
        });

        // Update mobile language label to show selected language name
        const mobileLangLabel = document.getElementById('mobile-lang-label');
        if (mobileLangLabel) {
            const langNames = {
                'en': 'English',
                'de': 'Deutsch',
                'tr': 'Türkçe'
            };
            mobileLangLabel.textContent = langNames[lang] || 'Language';
        }

        // Update current language display
        const currentLangDisplay = document.querySelectorAll('.current-lang');
        currentLangDisplay.forEach(el => {
            el.textContent = lang.toUpperCase();
        });
    }

    // Initialize language system
    function initLanguageSystem() {
        const currentLang = getCurrentLang();
        
        // Set initial language
        document.documentElement.setAttribute('lang', currentLang);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                applyTranslations(currentLang);
                updateLanguageSwitcher(currentLang);
                setupLanguageSwitcherListeners();
            });
        } else {
            applyTranslations(currentLang);
            updateLanguageSwitcher(currentLang);
            setupLanguageSwitcherListeners();
        }
    }

    // Setup click listeners for language buttons
    function setupLanguageSwitcherListeners() {
        // All language buttons
        const langBtns = document.querySelectorAll('[data-lang]');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                setLanguage(newLang);
            });
        });
    }

    // Expose functions globally
    window.MakaGlobeLang = {
        getCurrentLang: getCurrentLang,
        setLanguage: setLanguage,
        applyTranslations: applyTranslations,
        SUPPORTED_LANGS: SUPPORTED_LANGS
    };
    
    // Expose setLanguage globally for onclick handlers
    window.setLanguage = setLanguage;
    window.getCurrentLang = getCurrentLang;

    // Auto-initialize
    initLanguageSystem();

})();
