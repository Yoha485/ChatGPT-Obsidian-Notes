import { getNthParent } from './utils/dom-utils.js';
import { saveToObsidian } from './utils/obsidian-note-creator.js';
import { copyButtonTestId, obsidianIconHtml, obsidianIconHtmlDark } from './constants/index.js';
import { extractMarkdownSubset } from './utils/string-utils.js';

async function onClickObsidianButton(obsidianButton) {
    let messageContent = '';
    let noteName = '';
    let selectionText = window.getSelection().toString();

    const relativeCopyButton = getNthParent(obsidianButton, 5)?.querySelector(`[data-testid="${copyButtonTestId}"]`);

    if (relativeCopyButton) {
        noteName = prompt('Enter the note name:');

        if (noteName === null || noteName === '') {
            throw new Error('Note name not provided');
        }

        relativeCopyButton.click();

        const clipboardContent = await navigator.clipboard.readText();
        messageContent = clipboardContent;
    } else {
        throw new Error('Copy button for message not found');
    }

    if (!messageContent) {
        throw new Error('No content copied to clipboard');
    }

    if (!noteName.endsWith('.md')) {
        noteName += '.md';
    }

    if (selectionText) {
        messageContent = extractMarkdownSubset(messageContent, selectionText);
    }

    try {
        saveToObsidian(messageContent, noteName, '');

        // Change the color of the SVG inside the obsidian button
        const svgElement = obsidianButton.parentElement.parentElement.querySelector('svg');
        if (svgElement) {
            // For every path element in the SVG, change the stroke color
            svgElement.querySelectorAll('path').forEach((pathElement) => {
                pathElement.setAttribute('stroke', '#9065ea');
            });
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

function addObsidianButtonToMessages(options) {
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Select all copy buttons to insert the new button right after them
    const copyButtons = document.querySelectorAll(`[data-testid="${copyButtonTestId}"]`);

    copyButtons.forEach((copyButton) => {
        // Check if the new button has already been added
        if (getNthParent(copyButton, 2).querySelector('[data-testid="create-obsidian-note"]')) {
            if (options?.force) {
                getNthParent(copyButton, 2).querySelector('[data-testid="create-obsidian-note"]').remove();
            } else {
                return;
            }
        }

        // Create the new button following the same structure as other buttons
        const obsidianButton = document.createElement('button');
        const obsidianButtonClass = 'rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary';
        const obsidianButtonDataTestId = 'create-obsidian-note';
        obsidianButton.className = obsidianButtonClass;
        obsidianButton.setAttribute('data-testid', obsidianButtonDataTestId);

        const parentSpan = document.createElement('span');
        const parentSpanDataState = 'closed';
        parentSpan.setAttribute('data-state', parentSpanDataState);

        const childSpan = document.createElement('span');
        const childSpanClass = 'flex h-[30px] w-[30px] items-center justify-center';
        childSpan.className = childSpanClass;
        childSpan.innerHTML = isDarkMode ? obsidianIconHtmlDark : obsidianIconHtml;

        obsidianButton.appendChild(childSpan);
        parentSpan.appendChild(obsidianButton);

        const insertTo = copyButton.parentElement.parentElement;
        const atPosition = 2;
        insertTo.insertBefore(parentSpan, insertTo.childNodes[atPosition]);

        obsidianButton.addEventListener('click', (event) => {
            onClickObsidianButton(event.target);
        });
    });
}

window.onload = () => {
    addObsidianButtonToMessages();

    const observer = new MutationObserver(addObsidianButtonToMessages);
    observer.observe(document.body, { childList: true, subtree: true });

    const themeChangeObserver = new MutationObserver(() => {
        addObsidianButtonToMessages({ force: true });
    });
    themeChangeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });
};
