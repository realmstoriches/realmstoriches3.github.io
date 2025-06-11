// =============================================
//  AI WEBSITE GENERATOR - APPLICATION SCRIPT
// =============================================

// --- CONFIGURATION ---
// IMPORTANT: Replace with your actual Cloudflare Worker URL
const workerUrl = 'https://my-gemini-proxy.robert-demotto.workers.dev';

// --- DOM ELEMENT REFERENCES ---
// Input Controls
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const colorPaletteInput = document.getElementById('color-palette-input');
const fontStyleInput = document.getElementById('font-style-input');

// Status & Results Containers
const statusSection = document.getElementById('status-section');
const statusMessage = document.getElementById('status-message');
const resultsContainer = document.getElementById('results-container');
const resultsGrid = document.getElementById('results-grid');
const resultsTitle = document.getElementById('results-title');

// The HTML <template> for a single result card
const cardTemplate = document.getElementById('template-card-template');


// --- EVENT LISTENERS ---
generateBtn.addEventListener('click', handleGenerateClick);

// Use Event Delegation for download buttons since they are created dynamically
resultsGrid.addEventListener('click', handleDownloadClick);


// --- CORE FUNCTIONS ---

/**
 * Main function triggered when the "Generate" button is clicked.
 */
async function handleGenerateClick() {
    const userPrompt = promptInput.value;
    if (!userPrompt) {
        alert('Please enter a description for your website.');
        return;
    }

    // 1. Prepare UI for loading state
    resultsGrid.innerHTML = ''; // Clear previous results
    resultsTitle.style.display = 'none';
    statusMessage.textContent = 'Crafting your templates... This may take a minute or two.';
    statusSection.style.display = 'flex';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    // 2. Construct a detailed prompt for the AI
    const advancedPrompt = `
        User Request: "${userPrompt}"
        Primary Colors: "${colorPaletteInput.value || 'AI decides'}"
        Font Style: "${fontStyleInput.value || 'AI decides'}"
    `;

    try {
        // 3. Call the Cloudflare Worker
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: advancedPrompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`The AI server returned an error: ${errorText}`);
        }

        const results = await response.json(); // Expecting an array of templates

        // 4. Render the results
        renderTemplateResults(results);

    } catch (error) {
        statusMessage.textContent = `An error occurred: ${error.message}`;
        console.error(error);
        // Keep the error message visible
        statusSection.style.display = 'flex';
    } finally {
        // 5. Reset UI from loading state
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Templates';
        if (resultsGrid.children.length === 0) {
            // Hide status only if there are no results to show
            statusSection.style.display = 'none';
        }
    }
}

/**
 * Renders the array of template results into the results grid.
 * @param {Array<Object>} templates - An array of {title, html, css, js, images} objects.
 */
function renderTemplateResults(templates) {
    if (!templates || templates.length === 0) {
        statusMessage.textContent = 'The AI did not return any templates. Please try refining your prompt.';
        return;
    }
    
    statusSection.style.display = 'none'; // Hide loading spinner
    resultsTitle.style.display = 'block'; // Show "Your Generated Templates" title

    templates.forEach((templateData, index) => {
        const card = createTemplateCard(templateData, index + 1);
        resultsGrid.appendChild(card);
    });
}

/**
 * Creates a single template card DOM element from the template data.
 * @param {Object} templateData - The object containing html, css, js, etc.
 * @param {number} index - The number of the template (e.g., 1, 2, 3).
 * @returns {Node} A DOM node representing the template card.
 */
function createTemplateCard(templateData, index) {
    // Clone the template from the HTML
    const card = cardTemplate.content.cloneNode(true);

    // Get references to elements inside the cloned card
    const cardTitle = card.querySelector('.card-title');
    const previewFrame = card.querySelector('.preview-iframe');
    const imageContainer = card.querySelector('.image-downloads');
    const cardElement = card.querySelector('.template-card');

    // Populate the card
    cardTitle.textContent = templateData.title || `Template Variation ${index}`;

    // IMPORTANT: Store the code data directly on the card's DOM element
    // This makes it easy to retrieve for downloads later.
    cardElement.dataset.html = templateData.html || '';
    cardElement.dataset.css = templateData.css || '';
    cardElement.dataset.js = templateData.js || '';
    
    // Populate the live preview iframe
    const previewDoc = previewFrame.contentWindow.document;
    const fullHtml = `
        <!DOCTYPE html><html lang="en">
        <head><style>${templateData.css || ''}</style></head>
        <body>${templateData.html || ''}<script>${templateData.js || ''}<\/script></body>
        </html>`;
    previewDoc.open();
    previewDoc.write(fullHtml);
    previewDoc.close();

    // Populate image download links if they exist
    if (templateData.images && templateData.images.length > 0) {
        const list = document.createElement('ul');
        templateData.images.forEach(img => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = img.url;
            link.textContent = img.filename || 'download_image.jpg';
            link.target = '_blank'; // Open in new tab
            link.download = true;
            item.appendChild(link);
            list.appendChild(item);
        });
        imageContainer.appendChild(list);
    } else {
        imageContainer.style.display = 'none'; // Hide image section if no images
    }

    return card;
}

/**
 * Handles clicks on the download buttons using event delegation.
 * @param {Event} e The click event.
 */
function handleDownloadClick(e) {
    // Check if a download button was clicked
    const button = e.target.closest('.download-btn');
    if (!button) return;

    const card = button.closest('.template-card');
    const type = button.dataset.type; // 'html', 'css', or 'js'

    const content = card.dataset[type];
    const fileName = type === 'html' ? 'index.html' : type === 'css' ? 'style.css' : 'script.js';
    const contentType = type === 'html' ? 'text/html' : type === 'css' ? 'text/css' : 'application/javascript';

    if (!content) {
        alert(`No ${type.toUpperCase()} content was generated for this template.`);
        return;
    }

    downloadFile(content, fileName, contentType);
}


/**
 * Helper function to trigger a file download in the browser.
 * @param {string} content The text content of the file.
 * @param {string} fileName The name of the file to be saved.
 * @param {string} contentType The MIME type of the file.
 */
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}
