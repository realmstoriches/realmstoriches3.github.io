// =============================================
//  AI WEBSITE GENERATOR - APPLICATION SCRIPT (CORRECTED)
// =============================================

// --- CONFIGURATION ---
const workerUrl = 'https://my-gemini-proxy.robert-demotto.workers.dev/api/generate-template';

// --- DOM ELEMENT REFERENCES ---
// It's safer to wrap script logic in a DOMContentLoaded listener.
// This ensures all elements are available before we try to use them.
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt-input');
    const colorPaletteInput = document.getElementById('color-palette-input');
    const fontStyleInput = document.getElementById('font-style-input');
    const statusSection = document.getElementById('status-section');
    const statusMessage = document.getElementById('status-message');
    const resultsGrid = document.getElementById('results-grid');
    const resultsTitle = document.getElementById('results-title');
    const cardTemplate = document.getElementById('template-card-template');

    // Make sure the template was actually found
    if (!cardTemplate) {
        console.error("FATAL ERROR: The <template> with id 'template-card-template' was not found. The script cannot continue.");
        return;
    }

    // --- EVENT LISTENERS ---
    generateBtn.addEventListener('click', handleGenerateClick);
    resultsGrid.addEventListener('click', handleDownloadClick);

    // --- CORE FUNCTIONS ---
    async function handleGenerateClick() {
        console.log('Button clicked! The function is running.');
        const userPrompt = promptInput.value;
        if (!userPrompt) {
            alert('Please enter a description for your website.');
            return;
        }

        resultsGrid.innerHTML = '';
        resultsTitle.style.display = 'none';
        statusMessage.textContent = 'Crafting your templates... This may take a minute or two.';
        statusSection.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

        const advancedPrompt = `User Request: "${userPrompt}"\nPrimary Colors: "${colorPaletteInput.value || 'AI decides'}"\nFont Style: "${fontStyleInput.value || 'AI decides'}"`;

        try {
            const response = await fetch(workerUrl,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: advancedPrompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'The AI server returned an unknown error.');
            }

            const results = await response.json();
            renderTemplateResults(results);

        } catch (error) {
            statusMessage.textContent = `An error occurred: ${error.message}`;
            console.error(error);
            statusSection.style.display = 'flex';
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Templates';
            // Hide status only if there are results
            if (resultsGrid.children.length > 0) {
                statusSection.style.display = 'none';
            }
        }
    }

    function renderTemplateResults(templates) {
        if (!templates || !Array.isArray(templates) || templates.length === 0) {
            statusMessage.textContent = 'The AI did not return any valid templates. Please try refining your prompt.';
            statusSection.style.display = 'flex';
            resultsTitle.style.display = 'none';
            return;
        }
        statusSection.style.display = 'none';
        resultsTitle.style.display = 'block';

        templates.forEach((templateData, index) => {
            // 1. Create the card's basic structure
            const cardElement = createTemplateCard(templateData, index + 1);
            
            // 2. IMPORTANT: Add the card to the live page FIRST
            resultsGrid.appendChild(cardElement);

            // 3. NOW that the card is on the page, populate its iframe
            populateIframe(cardElement, templateData);
        });
    }

    /**
     * Creates a card element from the template but does NOT populate the iframe.
     * It returns the live DOM element ready to be appended.
     */
    function createTemplateCard(templateData, index) {
        const cardFragment = cardTemplate.content.cloneNode(true);
        const cardElement = cardFragment.querySelector('.template-card');
        const cardTitle = cardFragment.querySelector('.card-title');
        const imageContainer = cardFragment.querySelector('.image-downloads');
        
        cardTitle.textContent = templateData.title || `Template Variation ${index}`;
        cardElement.dataset.html = templateData.html || '';
        cardElement.dataset.css = templateData.css || '';
        cardElement.dataset.js = templateData.js || '';

        if (templateData.images && templateData.images.length > 0) {
            const list = document.createElement('ul');
            templateData.images.forEach(img => {
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = img.url;
                link.textContent = img.filename || 'download_image.jpg';
                link.target = '_blank';
                link.download = true;
                item.appendChild(link);
                list.appendChild(item);
            });
            imageContainer.appendChild(list);
        } else if (imageContainer) {
            imageContainer.style.display = 'none';
        }
        
        // Return the actual element to be appended, not the fragment
        return cardFragment.firstElementChild;
    }

    /**
     * Finds the iframe within a card that is ALREADY on the page and fills it.
     */
    function populateIframe(cardElement, templateData) {
        const previewFrame = cardElement.querySelector('.preview-iframe');

        if (!previewFrame) {
            console.error("Could not find '.preview-iframe' inside the appended card.", cardElement);
            return;
        }

        // Now this will work because the iframe is in the live DOM
        const previewDoc = previewFrame.contentWindow.document;
        const fullHtml = `<!DOCTYPE html><html lang="en"><head><style>${templateData.css || ''}</style></head><body>${templateData.html || ''}<script>${templateData.js || ''}<\/script></body></html>`;
        
        previewDoc.open();
        previewDoc.write(fullHtml);
        previewDoc.close();
    }

    function handleDownloadClick(e) {
        const button = e.target.closest('.download-btn');
        if (!button) return;
        
        const card = button.closest('.template-card');
        const type = button.dataset.type;
        const content = card.dataset[type];
        const fileName = type === 'html' ? 'index.html' : type === 'css' ? 'style.css' : 'script.js';
        const contentType = type === 'html' ? 'text/html' : type === 'css' ? 'text/css' : 'application/javascript';

        if (content === undefined || content === null) {
            alert(`No ${type.toUpperCase()} content was generated for this template.`);
            return;
        }
        
        downloadFile(content, fileName, contentType);
    }

    function downloadFile(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }
});
