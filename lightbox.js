document.querySelectorAll('.gallery-image').forEach(image => {
    image.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `<img src="${image.src}" alt="${image.alt}"><span class="close">&times;</span>`;
        document.body.appendChild(lightbox);

        lightbox.querySelector('.close').addEventListener('click', () => {
            lightbox.remove();
        });
    });
});
