const COPY_BUTTON_DATA_TEST_ID = 'copy-turn-action-button';

const obsidianIconHtml = `
<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.78181 16.1943C8.03066 13.6634 7.99741 11.8473 7.46343 10.5577C6.97696 9.36462 6.06733 8.61294 5.35246 8.14506C5.33817 8.21376 5.31598 8.28057 5.28635 8.34417L3.60604 12.0832C3.43187 12.4691 3.51223 12.9224 3.80871 13.2252L6.49404 15.9881C6.57875 16.0724 6.67889 16.1429 6.78181 16.1943ZM10.1785 11.0592C10.5137 11.092 10.8415 11.1661 11.1657 11.2836C12.1897 11.6668 13.1219 12.5289 13.8918 14.1902C13.9472 14.0944 14.0022 14.0026 14.0612 13.9139C14.5316 13.2158 14.9823 12.5046 15.413 11.7812C15.4656 11.6922 15.4903 11.5895 15.4837 11.4864C15.4771 11.3832 15.4396 11.2844 15.3761 11.2029C14.8577 10.5365 14.4166 9.81342 14.0612 9.04756C13.7073 8.20048 13.6559 6.878 13.6523 6.23715C13.6523 5.99371 13.5747 5.75423 13.4239 5.56265L10.7532 2.17392L10.7089 2.1185C10.904 2.76331 10.8929 3.27869 10.7714 3.74656C10.6606 4.18158 10.4547 4.57544 10.237 4.99185C10.1638 5.13198 10.0898 5.27567 10.0201 5.42292C9.67339 6.08448 9.47483 6.8136 9.43825 7.55962C9.40104 8.45104 9.58154 9.56729 10.1745 11.0588L10.1785 11.0592Z" stroke="#5D5D5D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.1745 11.0592C9.58154 9.5669 9.40104 8.45065 9.43825 7.55963C9.47466 6.67534 9.73275 6.01192 10.0201 5.42292L10.241 4.99146C10.4547 4.57584 10.6574 4.18119 10.7714 3.74657C10.9072 3.20912 10.8854 2.64396 10.7089 2.11851C10.5256 1.91717 10.2702 1.79644 9.99828 1.78265C9.72638 1.76886 9.46004 1.86312 9.25735 2.04488L6.08198 4.89963C5.90385 5.05915 5.78668 5.27528 5.75027 5.51119L5.36354 8.075C5.36354 8.10073 5.35602 8.1229 5.35246 8.14863C6.06733 8.61294 6.97339 9.36463 7.46343 10.5545C7.55923 10.79 7.64037 11.037 7.69896 11.3058C8.50394 11.0824 9.34108 10.9977 10.1745 11.0552V11.0592Z" stroke="#5D5D5D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.8394 17.1815C12.525 17.3696 13.2137 16.8205 13.3095 16.1132C13.3879 15.4423 13.5866 14.7911 13.8953 14.1902C13.1219 12.5289 12.1897 11.6668 11.1692 11.2836C10.0827 10.8787 8.89992 11.0145 7.69896 11.3058C7.96813 12.525 7.80979 14.1202 6.78538 16.1943C6.89977 16.2533 7.02882 16.2862 7.15746 16.2973L8.77484 16.4188C9.65161 16.4817 10.959 16.9345 11.8394 17.1815Z" stroke="#5D5D5D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

async function createObsidianNote(obsidianButton) {
    let content = '';

    console.log('Creating Obsidian note', obsidianButton);

    // Find the copy button and click it to copy the content to the clipboard
    const copyButton =
        obsidianButton.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            `[data-testid="${COPY_BUTTON_DATA_TEST_ID}"]`
        );
    if (copyButton) {
        console.log('Copying content to clipboard:', copyButton);
        copyButton.click();

        // Wait for the clipboard content to be available
        const clipboardContent = await navigator.clipboard.readText();
        content = clipboardContent;
    } else {
        throw new Error('Copy button not found');
    }

    if (!content) {
        throw new Error('No content copied to clipboard');
    }

    console.log('Creating Obsidian note with content:', content);

    try {
        let noteName = prompt('Enter the note name:', 'obs-test.md');

        if (!noteName.endsWith('.md')) {
            noteName += '.md';
        }

        const response = await fetch('http://localhost:5050/create_note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: noteName,
                content: content,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Note created successfully:', data);

        // Change the color of the SVG inside the obsidian button
        const svgElement = obsidianButton.querySelector('svg');
        if (svgElement) {
            svgElement.style.fill = '#9065ea';
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

// Function to add obsidian button to assistant messages
function addButtonToMessages() {
    // Select all copy buttons to insert the new button after them
    const copyButtons = document.querySelectorAll(`[data-testid="${COPY_BUTTON_DATA_TEST_ID}"]`);

    console.log('Adding Obsidian buttons to messages:', copyButtons);

    copyButtons.forEach((copyButton) => {
        // Check if the new button has already been added
        if (copyButton.parentElement.parentElement.querySelector('[data-testid="create-obsidian-note"]')) {
            return;
        }

        // Create the new button
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
        childSpan.innerHTML = obsidianIconHtml;

        obsidianButton.appendChild(childSpan);
        parentSpan.appendChild(obsidianButton);

        console.log('Parent span:', parentSpan);

        const insertTo = copyButton.parentElement.parentElement;
        const atPosition = 2;
        insertTo.insertBefore(parentSpan, insertTo.childNodes[atPosition]);

        obsidianButton.addEventListener('click', (event) => {
            console.log('Obsidian button clicked!');

            createObsidianNote(event.target);
        });

        console.log('Obsidian button added to message:', obsidianButton);
    });
}

window.onload = () => {
    console.log('Obsidian content script loaded');

    addButtonToMessages();

    // Optionally, observe the page for new messages and dynamically add the button
    const observer = new MutationObserver(addButtonToMessages);
    observer.observe(document.body, { childList: true, subtree: true });
};
