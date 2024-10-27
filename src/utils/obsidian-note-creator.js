import { sanitizeFileName } from './string-utils.js';

let generalSettings = {
    vaults: [],
    legacyMode: false,
    silentOpen: false,
};

/**
 * Saves the provided content to an Obsidian note.
 *
 * @param {string} fileContent - The content to be saved in the note.
 * @param {string} noteName - The name of the note.
 * @param {string} path - The path where the note should be saved.
 * @param {string} [vault] - The name of the Obsidian vault (optional).
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
export async function saveToObsidian(fileContent, noteName, path, vault) {
    let obsidianUrl;

    // Ensure path ends with a slash
    if (path && !path.endsWith('/')) {
        path += '/';
    }

    const formattedNoteName = sanitizeFileName(noteName);
    obsidianUrl = `obsidian://new?file=${encodeURIComponent(path + formattedNoteName)}`;

    const vaultParam = vault ? `&vault=${encodeURIComponent(vault)}` : '';
    obsidianUrl += vaultParam;

    // Add silent parameter if silentOpen is enabled
    if (generalSettings.silentOpen) {
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
                    'Web Clipper requires Obsidian 1.7.2 or above. You may need to install the [early access](https://help.obsidian.md/Obsidian/Early+access+versions) version, or enable legacy mode in Web Clipper settings.'
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
