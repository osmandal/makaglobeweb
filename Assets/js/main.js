// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            // Remove hidden initially to allow height calculation if needed, 
            // but we are using max-height animation now.
            
            if (mobileMenu.classList.contains('open')) {
                // Closing animation
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                mobileMenu.classList.remove('open');
                
                // Icon back to hamburger
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            } else {
                // Opening animation
                mobileMenu.classList.add('open');
                // Set max-height to a large value or calculated scrollHeight
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px'; 
                mobileMenu.style.opacity = '1';

                // Toggle hamburger icon to X
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
            }
        });
    }

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a navigation to another page (not anchor link)
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                
                // Close menu with animation
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                mobileMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
                
                // Wait for menu close animation, then navigate
                setTimeout(function() {
                    window.location.href = href;
                }, 300);
            } else {
                // For anchor links, just close the menu
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                mobileMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
        });
    });

    // Sticky Header with Shadow on Scroll
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', updateHeader);

    // Counter Animation for Stats Section
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
    }

    // Intersection Observer for Stats Animation
    const statsSection = document.querySelector('.bg-primary');
    let statsAnimated = false;
    
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Mobile: Auto-show "See Details" button when cards scroll into view
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    
    if (isMobile) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mobile-card-visible');
                } else {
                    entry.target.classList.remove('mobile-card-visible');
                }
            });
        }, { threshold: 0.5 });

        // Observe beef cut cards and similar product cards
        const observeCards = () => {
            const cards = document.querySelectorAll('#beef-cuts-grid > div, .product-card');
            cards.forEach(card => {
                cardObserver.observe(card);
            });
        };

        // Initial observation
        observeCards();

        // Re-observe when DOM changes (for dynamically loaded content)
        const gridContainer = document.getElementById('beef-cuts-grid');
        if (gridContainer) {
            const mutationObserver = new MutationObserver(() => {
                observeCards();
            });
            mutationObserver.observe(gridContainer, { childList: true });
        }
    }

    // Fade in animation for sections
    const fadeElements = document.querySelectorAll('section');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
        
        // Immediately show elements that are already in viewport on page load
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
            el.classList.add('visible');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Show success message (in a real app, this would send to a server)
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Notification helper
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('translate-y-0', 'opacity-100');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.group');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section (subtle)
    const heroSection = document.querySelector('section.relative');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroImg = heroSection.querySelector('img');
            
            if (heroImg && scrolled < 800) {
                heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Initialize - make header visible if at top
    updateHeader();

    // FAQ Accordion Logic
    window.toggleFaq = function(button) {
        const parent = button.parentElement;
        const content = parent.querySelector('.faq-content');
        const icon = button.querySelector('svg');
        const iconContainer = button.querySelector('div');
        const title = button.querySelector('span'); // Get title text span

        const isExpanded = content.style.height && content.style.height !== '0px';

        // Helper function to set state to Inactive
        const setInactive = (elementContent, elementParent, elementIcon, elementContainer, elementTitle) => {
             elementContent.style.height = '0px';
             elementContent.style.marginTop = '0px';
             elementContent.style.paddingTop = '0px';
             elementContent.classList.remove('border-t', 'border-white/20'); // Remove separator line
             
             elementParent.classList.remove('bg-[#102a43]', 'text-white');
             elementParent.classList.add('bg-white', 'text-[#102a43]', 'border', 'border-gray-100');
             
             if(elementIcon) elementIcon.style.transform = 'rotate(0deg)';
             
             // Fix Icon Container Background (White bg -> Blue icon bg)
             if(elementContainer) {
                elementContainer.classList.remove('bg-white/10');
                elementContainer.classList.add('bg-[#102a43]');
             }

             // Fix Title Color
             if(elementTitle) {
                elementTitle.classList.add('text-[#102a43]');
             }
        };

        // Helper function to set state to Active
        const setActive = (elementContent, elementParent, elementIcon, elementContainer, elementTitle) => {
            elementContent.style.height = elementContent.scrollHeight + 20 + 'px'; // Add buffer for padding
            elementContent.style.marginTop = '1rem'; // mt-4
            elementContent.style.paddingTop = '1rem'; // pt-4
            elementContent.classList.add('border-t', 'border-white/20'); // Add separator line
            
            elementParent.classList.remove('bg-white', 'border', 'border-gray-100');
            elementParent.classList.add('bg-[#102a43]', 'text-white');
            
            if(elementIcon) elementIcon.style.transform = 'rotate(180deg)';

            // Fix Icon Container Background (Blue bg -> Transparent/White-ish icon bg)
            if(elementContainer) {
                elementContainer.classList.remove('bg-[#102a43]');
                elementContainer.classList.add('bg-white/10');
            }

            // Fix Title Color
            if(elementTitle) {
                elementTitle.classList.remove('text-[#102a43]');
            }
        };

        // Close ALL other FAQs first
        document.querySelectorAll('.faq-content').forEach(c => {
            if (c !== content) {
                const p = c.parentElement;
                const btn = p.querySelector('button');
                const i = btn.querySelector('svg');
                const con = btn.querySelector('div');
                const ti = btn.querySelector('span');
                setInactive(c, p, i, con, ti);
            }
        });

        // Toggle clicked FAQ
        if (!isExpanded) {
            setActive(content, parent, icon, iconContainer, title);
        } else {
            setInactive(content, parent, icon, iconContainer, title);
        }
    };

    // Dynamic Navigation Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Check if we are on a "Food" related sub-page
    const isFoodPage = currentPage.includes('food') || currentPage.includes('beef-cuts');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('#')[0]; // simple check
        
        // Remove active classes initially
        link.classList.remove('text-primary', 'font-bold');
        link.classList.add('text-secondary');

        // Logic to highlight 'Food' menu item if we are on any food sub-page
        if (isFoodPage && linkPage === 'food.html') {
             link.classList.add('text-primary', 'font-bold');
             link.classList.remove('text-secondary');
        } else if (!isFoodPage && linkPage === currentPage) {
             link.classList.add('text-primary', 'font-bold');
             link.classList.remove('text-secondary');
             
             // For mobile specifically
             if(link.classList.contains('mobile-nav-link')) {
                 link.classList.add('border-primary', 'bg-blue-50', 'text-primary');
                 link.classList.remove('border-transparent');
             }
        }
    });

    // Mobile specific highlighting for food pages
    if (isFoodPage) {
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            if (link.getAttribute('href') === 'food.html') {
                link.classList.add('border-primary', 'bg-blue-50', 'text-primary');
                link.classList.remove('border-transparent', 'text-secondary');
            }
        });
    }

    // Sector Tab Switcher
    window.switchSectorTab = function(sectorId) {
        // Hide all content
        document.querySelectorAll('.sector-content').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('grid'); // Remove grid class when hidden to prevent layout issues
        });

        // Deactivate all buttons
        document.querySelectorAll('.sector-tab-btn').forEach(btn => {
            btn.classList.remove('bg-[#204b78]', 'text-white', 'border-[#204b78]');
            btn.classList.add('bg-white', 'text-gray-500', 'border-gray-200');
        });

        // Show selected content
        const activeContent = document.getElementById('content-' + sectorId);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('grid');
            // Add slight fade-in animation
            activeContent.style.opacity = '0';
            setTimeout(() => {
                activeContent.style.opacity = '1';
                activeContent.style.transition = 'opacity 0.4s ease-in-out';
            }, 10);
        }

        // Activate selected button
        const activeBtn = document.getElementById('tab-' + sectorId);
        if (activeBtn) {
            activeBtn.classList.remove('bg-white', 'text-gray-500', 'border-gray-200');
            activeBtn.classList.add('bg-[#204b78]', 'text-white', 'border-[#204b78]');
        }
    };
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
