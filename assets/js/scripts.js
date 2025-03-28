// Carousel Functionality
const carouselItemsContainer = document.querySelector('.carousel');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
let carouselImages = [];
let currentIndex = 0;

function showCarouselItem(index) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    showCarouselItem(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    showCarouselItem(currentIndex);
});

// Gallery Infinite Scroll
const galleryContainer = document.getElementById('gallery-container');
const loadMoreButton = document.getElementById('load-more');
let page = 1;

// Unsplash API Configuration
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos';
const UNSPLASH_ACCESS_KEY = 'z0BTcl6hLgjUI32ha6Y0-nfJq_BgRv0sc_MGbGGXwAw'; // Replace with your Unsplash API Access Key

// Load Carousel Images
async function loadCarouselImages() {
    try {
        const response = await axios.get(`${UNSPLASH_API_URL}?page=1&per_page=5`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        carouselImages = response.data;

        carouselImages.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) carouselItem.classList.add('active'); // Set the first image as active
            carouselItem.innerHTML = `
                <img src="${image.urls.regular}" alt="${image.alt_description || 'Carousel Image'}">
            `;
            carouselItemsContainer.insertBefore(carouselItem, prevButton); // Add before the control buttons
        });
    } catch (error) {
        console.error('Error loading carousel images:', error);
    }
}

// Function to toggle the heart icon state
function toggleHeartIcon(event) {
    const heartIcon = event.target;
    if (heartIcon.classList.contains('fas')) {
        // If already liked, change to unliked state
        heartIcon.classList.remove('fas'); // Solid heart
        heartIcon.classList.add('far'); // Outline heart
    } else {
        // If unliked, change to liked state
        heartIcon.classList.remove('far'); // Outline heart
        heartIcon.classList.add('fas'); // Solid heart
    }
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

// Add event listeners to all download icons
document.querySelectorAll('.download-icon').forEach(icon => {
    icon.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior
        const url = icon.getAttribute('href'); // Get the image URL
        const filename = url.split('/').pop(); // Extract the filename from the URL
        downloadImage(url, filename); // Call the download function
    });
});

// Load Gallery Images
async function loadGalleryImages() {
    try {
        const response = await axios.get(`${UNSPLASH_API_URL}?page=${page}&per_page=9`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        const images = response.data;

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

        page++;
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

loadMoreButton.addEventListener('click', loadGalleryImages);

// Initial Load
loadCarouselImages();
loadGalleryImages();