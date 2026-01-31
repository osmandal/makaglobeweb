// Footer Language Selector Functions
// This script handles the footer language selector functionality

// Toggle footer language dropdown
function toggleFooterLangDropdown() {
    const dropdown = document.getElementById('footer-lang-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Change language from footer and sync with header - reload page to apply
function changeFooterLanguage(lang) {
    localStorage.setItem('makaglobe_language', lang);
    // Reload page to apply language changes
    window.location.reload();
}

// Initialize footer language selector on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = localStorage.getItem('makaglobe_language') || 'en';
    
    // Update footer language display text
    const langDisplay = document.getElementById('footer-current-lang');
    if (langDisplay) {
        const langNames = { 'en': 'EN', 'de': 'DE', 'tr': 'TR' };
        langDisplay.textContent = langNames[currentLang] || 'EN';
    }
    
    // Highlight active language in dropdown
    document.querySelectorAll('.footer-lang-option').forEach(btn => {
        btn.classList.remove('bg-gray-600');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('bg-gray-600');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const selector = document.getElementById('footer-lang-selector');
    const dropdown = document.getElementById('footer-lang-dropdown');
    if (selector && dropdown && !selector.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});
