// Gallery and Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentIndex = 0;

    // Function to open lightbox
    function openLightbox(index) {
        const img = galleryItems[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        currentIndex = index;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Function to navigate to previous image
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        const img = galleryItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    // Function to navigate to next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        const img = galleryItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    // Add click event listeners to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Add click event listener to close button
    closeBtn.addEventListener('click', closeLightbox);

    // Add click event listeners to navigation buttons
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    });
});

class Gallery {
    constructor() {
        this.initializeGallery();
        this.currentImageIndex = 0;
        this.images = Array.from(document.querySelectorAll('.gallery-image'));
        this.page = 1;
        this.loading = false;
    }

    initializeGallery() {
        // Create lightbox elements
        this.createLightbox();
        
        // Add click listeners to gallery images
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Initialize infinite scroll
        this.initInfiniteScroll();
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-nav">
                    <button class="prev">&lt;</button>
                    <button class="next">&gt;</button>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        this.lightbox = lightbox;

        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.prev').addEventListener('click', () => this.prevImage());
        lightbox.querySelector('.next').addEventListener('click', () => this.nextImage());
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.lightbox.classList.add('active');
        this.updateLightboxImage();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    updateLightboxImage() {
        const image = this.images[this.currentImageIndex];
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const caption = this.lightbox.querySelector('.lightbox-caption');
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        caption.textContent = image.alt;
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    handleKeyPress(e) {
        if (!this.lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    initInfiniteScroll() {
        // Create loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = 'Loading more images...';
        document.querySelector('.project-gallery').appendChild(spinner);

        // Intersection Observer for infinite scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loading) {
                    this.loadMoreImages();
                }
            });
        }, { rootMargin: '100px' });

        observer.observe(spinner);
    }

    async loadMoreImages() {
        this.loading = true;
        const spinner = document.querySelector('.loading-spinner');
        spinner.classList.add('active');

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add more images here
        // This is where you would typically fetch more images from a server
        // For now, we'll just hide the spinner when we're done
        spinner.classList.remove('active');
        this.loading = false;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
