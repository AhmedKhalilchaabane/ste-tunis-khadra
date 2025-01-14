document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add newsletter subscription logic here
            alert('Thank you for subscribing to our newsletter!');
            e.target.reset();
        });
    }

    // Project Filtering and Sorting
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const sortSelect = document.getElementById('sortProjects');

    if (filterBtns && projectItems) {
        // Filtering
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 0);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    if (sortSelect && projectItems) {
        // Sorting
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const projectsArray = Array.from(projectItems);
            const projectsGrid = document.querySelector('.projects-grid');

            if (projectsGrid) {
                projectsArray.sort((a, b) => {
                    if (sortValue === 'newest') {
                        return b.getAttribute('data-date') - a.getAttribute('data-date');
                    } else if (sortValue === 'oldest') {
                        return a.getAttribute('data-date') - b.getAttribute('data-date');
                    } else if (sortValue === 'popular') {
                        return b.getAttribute('data-popularity') - a.getAttribute('data-popularity');
                    }
                });

                projectsGrid.innerHTML = '';
                projectsArray.forEach(item => projectsGrid.appendChild(item));
            }
        });
    }

    // Quote Form Handling
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmission);
    }

    // Initialize live chat
    initLiveChat();

    // Initialize callback modal
    initCallbackModal();
});

async function handleQuoteSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/quote', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.', 'success');
            form.reset();
        } else {
            throw new Error('Erreur lors de l\'envoi du formulaire');
        }
    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
        console.error('Quote submission error:', error);
    }
}

// Live Chat Implementation
function initLiveChat() {
    const chatWidget = document.getElementById('liveChatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (!chatWidget) return;

    let ws = null;

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        if (!ws && !chatContainer.classList.contains('hidden')) {
            initWebSocket();
        }
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
    });

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function initWebSocket() {
        ws = new WebSocket('wss://your-websocket-server.com');

        ws.onopen = () => {
            addMessage('Système', 'Connecté au chat en direct. Comment pouvons-nous vous aider?', 'system');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            addMessage(message.sender, message.text, 'received');
        };

        ws.onclose = () => {
            addMessage('Système', 'Déconnecté du chat. Veuillez rafraîchir la page pour vous reconnecter.', 'system');
            ws = null;
        };
    }

    function sendMessage() {
        if (!chatInput.value.trim() || !ws) return;

        const message = {
            text: chatInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        ws.send(JSON.stringify(message));
        addMessage('Vous', message.text, 'sent');
        chatInput.value = '';
    }

    function addMessage(sender, text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `
            <span class="sender">${sender}</span>
            <p>${text}</p>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Callback Modal Implementation
function initCallbackModal() {
    const modal = document.getElementById('callbackModal');
    const callbackForm = document.getElementById('callbackForm');
    const closeBtn = modal.querySelector('.close');

    if (!modal || !callbackForm) return;

    // Show modal when callback button is clicked
    document.querySelectorAll('[data-callback-trigger]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    // Close modal when clicking the close button or outside the modal
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle callback form submission
    callbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(callbackForm);

        try {
            const response = await fetch('/api/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                showNotification('Demande de rappel enregistrée. Nous vous contacterons bientôt.', 'success');
                modal.style.display = 'none';
                callbackForm.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi de la demande de rappel');
            }
        } catch (error) {
            showNotification('Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
            console.error('Callback request error:', error);
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Add shadow to header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Slider functionality
class Slider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.slider');
        this.slides = container.querySelectorAll('.slide');
        this.prevBtn = container.querySelector('.slider-arrow.prev');
        this.nextBtn = container.querySelector('.slider-arrow.next');
        this.dots = container.querySelectorAll('.slider-dot');
        
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Add dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Add touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
        
        // Start auto-sliding
        this.startAutoSlide();
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount;
        this.updateSlider();
    }
    
    updateSlider() {
        // Update slider position
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing gallery functionality
    initializeGallery();
    
    // Initialize sliders
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => new Slider(container));
});

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h3')?.textContent || '';
            const description = this.querySelector('p')?.textContent || '';
            openLightbox(imgSrc, title, description);
        });
    });
}

// Lightbox functionality
function openLightbox(imgSrc, title, description) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imgSrc}" alt="${title}">
            <div class="lightbox-text">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Close lightbox when clicking outside or on close button
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }
    });
}
