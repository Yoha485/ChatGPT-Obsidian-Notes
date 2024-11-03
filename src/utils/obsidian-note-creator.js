import { sanitizeFileName } from './string-utils.js';

let generalSettings = {
    legacyMode: false,
};

async function getSettings() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['vaultName', 'silentMode'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve({
                    vaultName: result.vaultName || '',
                    silentMode: result.silentMode || false,
                });
            }
        });
    });
}

/**
 * Saves the provided content to an Obsidian note.
 *
 * @param {string} fileContent - The content to be saved in the note.
 * @param {string} noteName - The name of the note.
 * @param {string} path - The path where the note should be saved.
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
export async function saveToObsidian(fileContent, noteName, path) {
    let obsidianUrl;
    let vaultName = '';
    let silentMode = false;

    try {
        const settings = await getSettings();
        vaultName = settings.vaultName;
        silentMode = settings.silentMode;
    } catch (err) {
        console.error('Failed to get settings from storage:', err);
    }

    // Ensure path ends with a slash
    if (path && !path.endsWith('/')) {
        path += '/';
    }

    const formattedNoteName = sanitizeFileName(noteName);
    obsidianUrl = `obsidian://new?file=${encodeURIComponent(path + formattedNoteName)}`;

    const vaultParam = vaultName ? `&vault=${encodeURIComponent(vaultName)}` : '';
    obsidianUrl += vaultParam;

    // Add silent parameter if silentMode is enabled. This will prevent Obsidian from opening the note
    if (silentMode) {
        obsidianUrl += '&silent=true';
    }

    if (generalSettings.legacyMode) {
        // Use the URI method
        obsidianUrl += `&content=${encodeURIComponent(fileContent)}`;
        openObsidianUrl(obsidianUrl);
    } else {
        // Use clipboard
        navigator.clipboard
            .writeText(fileContent)
            .then(() => {
                obsidianUrl += `&clipboard`;
                obsidianUrl += `&content=${encodeURIComponent(
                    'This extension requires Obsidian 1.7.2 or above. You may need to install the [early access](https://help.obsidian.md/Obsidian/Early+access+versions). Or just open Settings > General and update to the latest version there.'
                )}`;
                openObsidianUrl(obsidianUrl);
            })
            .catch((err) => {
                console.error('Failed to copy content to clipboard:', err);
                obsidianUrl += `&clipboard`;
                obsidianUrl += `&content=${encodeURIComponent(
                    'There was an error creating the content. Make sure you are using Obsidian 1.7.2 or above.'
                )}`;
                openObsidianUrl(obsidianUrl);
            });
    }

    function openObsidianUrl(url) {
        window.open(url, '_blank');
    }
}
