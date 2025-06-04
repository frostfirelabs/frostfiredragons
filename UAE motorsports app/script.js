// Timeline Scroll Effect
document.getElementById('timeline').addEventListener('scroll', function() {
    console.log('Scrolling through the timeline...');
});

// Highlighting Event on Hover
const events = document.querySelectorAll('.timeline-event');
events.forEach(event => {
    event.addEventListener('mouseenter', () => {
        event.style.backgroundColor = '#555';
    });
    event.addEventListener('mouseleave', () => {
        event.style.backgroundColor = '#373737';
    });
});

// Ensure the DOM is fully loaded before running any scripts
// Using jQuery's ready function as Slick.js depends on jQuery
$(document).ready(function() {
    console.log("DOM fully loaded and jQuery is ready. Initializing app features.");

    // --- Slick.js Carousel Initialization ---
    // Select the div that will become the carousel.
    // In your HTML, this is the div with class "slick-carousel" inside the "image-gallery" section.
    const $slickCarousel = $('.slick-carousel');

    // Check if the carousel element exists on the page
    if ($slickCarousel.length > 0) {
        console.log("Slick Carousel element found. Initializing Slick.js.");

        // Initialize Slick.js with desired options
        // These options configure how your image gallery carousel will behave.
        $slickCarousel.slick({
            slidesToShow: 1,       // Display one image at a time
            slidesToScroll: 1,     // Move one image at a time when navigating
            autoplay: true,        // Automatically advance slides
            autoplaySpeed: 3000,   // Time in milliseconds before auto-advancing to the next slide (3 seconds)
            dots: true,            // Show navigation dots at the bottom of the carousel
            arrows: true,          // Show previous/next arrows on the sides of the carousel
            infinite: true,        // Loop the carousel infinitely (when it reaches the end, it goes back to the start)
            speed: 500,            // Speed of the slide transition in milliseconds
            fade: false,           // Set to 'true' for a fade effect instead of a slide effect between images
            cssEase: 'ease-in-out', // The CSS easing function for smooth transitions

            // Responsive settings for different screen sizes
            responsive: [
                {
                    breakpoint: 768, // Settings apply for screens smaller than 768px wide (e.g., tablets)
                    settings: {
                        arrows: false, // Hide arrows on smaller screens to save space
                        dots: true     // Keep dots for navigation on smaller screens
                    }
                },
                {
                    breakpoint: 480, // Settings apply for screens smaller than 480px wide (e.g., mobile phones)
                    settings: {
                        arrows: false, // Hide arrows
                        dots: true     // Keep dots
                    }
                }
            ]
        });
        console.log("Slick.js carousel initialized successfully.");
    } else {
        // Log a warning if the carousel element isn't found, which helps in debugging
        console.warn("Slick Carousel element (.slick-carousel) not found. Carousel will not be initialized.");
    }

    // --- Tab Navigation Functionality ---
    // Select all elements that act as tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    // Select all sections that are tab content
    const tabContents = document.querySelectorAll('.tab-content');

    // Check if both tab buttons and content sections exist on the page
    if (tabButtons.length > 0 && tabContents.length > 0) {
        console.log("Tab navigation elements found. Initializing tabs.");

        // Helper function to hide all tab content sections and deactivate all tab buttons
        const hideAllTabs = () => {
            tabContents.forEach(content => {
                // Remove the 'active' class if it's present
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    console.log(`Tabs: Removed 'active' class from #${content.id}`);
                }
                // Explicitly set display to 'none' to hide the content
                content.style.display = 'none';
                console.log(`Tabs: Hidden #${content.id}`);
            });
            tabButtons.forEach(button => {
                // Remove the 'active' class from all buttons
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    console.log(`Tabs: Removed 'active' class from button for ${button.dataset.target}`);
                }
            });
            console.log("Tabs: All tabs hidden and buttons deactivated.");
        };

        // Function to show a specific tab based on its ID
        const showTab = (targetId) => {
            console.log(`Tabs: Attempting to show tab with ID: '${targetId}'.`);
            hideAllTabs(); // First, hide all other tabs

            // Find the specific content section and button for the targetId
            const targetContent = document.getElementById(targetId);
            const targetButton = document.querySelector(`.tab-button[data-target="${targetId}"]`);

            // If both the content and button are found, activate them
            if (targetContent && targetButton) {
                targetContent.classList.add('active'); // Add 'active' class to content
                targetContent.style.display = 'block'; // Make content visible (adjust 'block' if your section uses flex/grid)
                targetButton.classList.add('active');   // Add 'active' class to button
                console.log(`Tabs: Successfully activated #${targetContent.id} and its corresponding button.`);

                // IMPORTANT: If the 'image-gallery' tab is being shown,
                // we need to tell Slick.js to recalculate its slide positions.
                // This is because Slick.js might miscalculate dimensions if it initializes while hidden.
                if (targetId === 'image-gallery' && $slickCarousel.length > 0) {
                    // Use a small delay to ensure the tab content is fully visible
                    // before Slick.js tries to measure its elements.
                    setTimeout(() => {
                        $slickCarousel.slick('setPosition');
                        console.log("Slick.js carousel position refreshed due to tab switch.");
                    }, 50); // 50 milliseconds delay
                }

            } else {
                // Log an error if a target content or button isn't found, which helps in debugging
                console.error(`Tabs: Target content (id: ${targetId}) or button (data-target: ${targetId}) not found.`);
            }
        };

        // Add event listeners to each tab button
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get the 'data-target' attribute from the clicked button
                const targetId = event.target.dataset.target;
                console.log(`Tabs: Button clicked. Data target: ${targetId}`);
                if (targetId) {
                    showTab(targetId); // Call showTab with the target ID
                } else {
                    console.warn("Tabs: Clicked button has no 'data-target' attribute. Check HTML.");
                }
            });
        });

        // Set the initial active tab when the page loads
        // It tries to find a button with the 'active' class in HTML first.
        const initialActiveTabButton = document.querySelector('.tab-button.active');
        if (initialActiveTabButton && initialActiveTabButton.dataset.target) {
            showTab(initialActiveTabButton.dataset.target);
            console.log(`Tabs: Initial active tab set from HTML 'active' class: '${initialActiveTabButton.dataset.target}'.`);
        } else if (tabButtons.length > 0) {
            // Fallback: if no 'active' class is explicitly set in HTML, activate the very first tab button
            showTab(tabButtons[0].dataset.target);
            console.log(`Tabs: Fallback: Initial active tab set to the first button: '${tabButtons[0].dataset.target}'.`);
        } else {
            console.warn("Tabs: No tab buttons found to set an initial active tab. Tab functionality might not work as expected.");
        }
        console.log("Tab navigation functionality initialized.");

    } else {
        // Log warnings if tab elements aren't found, indicating potential HTML issues
        console.warn("Tab navigation elements not found or incomplete. Tab functionality will not be active.");
        if (tabButtons.length === 0) console.warn("No '.tab-button' elements found.");
        if (tabContents.length === 0) console.warn("No '.tab-content' elements found.");
    }
});

