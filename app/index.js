// =============================================
//  AI WEBSITE GENERATOR - APPLICATION SCRIPT
// =============================================

// --- CONFIGURATION ---
const workerUrl = 'https://my-gemini-proxy.robert-demotto.workers.dev/api/generate-template'; // <-- PASTE YOUR WORKER URL HERE

// --- DOM ELEMENT REFERENCES ---
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const colorPaletteInput = document.getElementById('color-palette-input');
const fontStyleInput = document.getElementById('font-style-input');
const statusSection = document.getElementById('status-section');
const statusMessage = document.getElementById('status-message');
const resultsGrid = document.getElementById('results-grid');
const resultsTitle = document.getElementById('results-title');
const cardTemplate = document.getElementById('template-card-template');

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
            const errorText = await response.text();
            throw new Error(`The AI server returned an error: ${errorText}`);
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
        if (resultsGrid.children.length === 0) {
            statusSection.style.display = 'none';
        }
    }
}

function renderTemplateResults(templates) {
    if (!templates || templates.length === 0) {
        statusMessage.textContent = 'The AI did not return any templates. Please try refining your prompt.';
        return;
    }
    statusSection.style.display = 'none';
    resultsTitle.style.display = 'block';

    templates.forEach((templateData, index) => {
        const card = createTemplateCard(templateData, index + 1);
        resultsGrid.appendChild(card);
    });
}

function createTemplateCard(templateData, index) {
    const card = cardTemplate.content.cloneNode(true);
    const cardTitle = card.querySelector('.card-title');
    const previewFrame = card.querySelector('.preview-iframe');
    const imageContainer = card.querySelector('.image-downloads');
    const cardElement = card.querySelector('.template-card');

    cardTitle.textContent = templateData.title || `Template Variation ${index}`;
    cardElement.dataset.html = templateData.html || '';
    cardElement.dataset.css = templateData.css || '';
    cardElement.dataset.js = templateData.js || '';
    
    const previewDoc = previewFrame.contentWindow.document;
    const fullHtml = `<!DOCTYPE html><html lang="en"><head><style>${templateData.css || ''}</style></head><body>${templateData.html || ''}<script>${templateData.js || ''}<\/script></body></html>`;
    previewDoc.open();
    previewDoc.write(fullHtml);
    previewDoc.close();

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
    } else {
        imageContainer.style.display = 'none';
    }
    return card;
}

function handleDownloadClick(e) {
    const button = e.target.closest('.download-btn');
    if (!button) return;
    const card = button.closest('.template-card');
    const type = button.dataset.type;
    const content = card.dataset[type];
    const fileName = type === 'html' ? 'index.html' : type === 'css' ? 'style.css' : 'script.js';
    const contentType = type === 'html' ? 'text/html' : type === 'css' ? 'text/css' : 'application/javascript';
    if (!content) {
        alert(`No ${type.toUpperCase()} content was generated.`);
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
