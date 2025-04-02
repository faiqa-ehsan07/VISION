// Unsplash API Configuration
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos';
const UNSPLASH_ACCESS_KEY = 'z0BTcl6hLgjUI32ha6Y0-nfJq_BgRv0sc_MGbGGXwAw'; // Replace with your Unsplash API key
const IMAGE_COUNT = 9; // Number of images to fetch per page
const carouselContainer = document.querySelector('.carousel');
const galleryContainer = document.getElementById('gallery-container');
const loadMoreButton = document.getElementById('load-more');
let page = 1; // Current page for pagination

// Function to fetch images from Unsplash API
async function fetchImages() {
    try {
        const response = await fetch(`${UNSPLASH_API_URL}?page=${page}&per_page=${IMAGE_COUNT}&client_id=${UNSPLASH_ACCESS_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

// Function to load carousel images
async function loadCarouselImages() {
    try {
        const images = await fetchImages();
        images.slice(0, 5).forEach((image, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) carouselItem.classList.add('active'); // Set the first image as active
            carouselItem.innerHTML = `
                <img src="${image.urls.regular}" alt="${image.alt_description || 'Carousel Image'}">
            `;
            carouselContainer.insertBefore(carouselItem, carouselContainer.querySelector('.carousel-control.next'));
        });
    } catch (error) {
        console.error('Error loading carousel images:', error);
    }
}

// Function to load gallery images
async function loadGalleryImages() {
    try {
        const images = await fetchImages();
        images.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('gallery-card');
            card.innerHTML = `
                <div class="card-icons">
                    <button class="download-icon" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="heart-icon" title="Like">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <img src="${image.urls.small}" alt="${image.alt_description || 'Art Image'}">
            `;
            galleryContainer.appendChild(card);

            // Add event listener to the download button
            const downloadButton = card.querySelector('.download-icon');
            downloadButton.addEventListener('click', () => {
                downloadImage(image.urls.full, `art-image-${image.id}.jpg`);
            });

            // Add event listener to the heart icon
            const heartButton = card.querySelector('.heart-icon i');
            heartButton.addEventListener('click', toggleHeartIcon);
        });

        // Increment the page for the next fetch
        page++;
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

// Function to toggle the heart icon state
function toggleHeartIcon(event) {
    const heartIcon = event.target;
    heartIcon.classList.toggle('fas'); // Solid heart
    heartIcon.classList.toggle('far'); // Outline heart
}

// Function to programmatically download an image
function downloadImage(url, filename) {
    fetch(url, { mode: 'cors' }) // Fetch the image with CORS enabled
        .then(response => response.blob()) // Convert the response to a Blob
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a temporary URL for the Blob
            link.download = filename; // Set the filename for the download
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link); // Clean up the temporary link
        })
        .catch(error => console.error('Error downloading the image:', error));
}

// Load more images when the "Load More" button is clicked
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadGalleryImages);
}

// Initial Load
loadCarouselImages();
loadGalleryImages();