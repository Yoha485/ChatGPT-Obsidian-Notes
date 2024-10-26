import { sanitizeFileName } from './string-utils.js';

let generalSettings = {
	vaults: [],
	betaFeatures: false,
	legacyMode: false,
	silentOpen: false,
	highlighterEnabled: true,
	alwaysShowHighlights: false,
	highlightBehavior: 'replace-content',
	showMoreActionsButton: false,
	openaiApiKey: '',
	anthropicApiKey: '',
	interpreterModel: 'gpt-4o-mini',
	models: [
		{ id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', enabled: true },
		{ id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', enabled: true },
		{ id: 'gpt-o1-mini', name: 'GPT-o1 Mini', provider: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', enabled: true },
		{ id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1/messages', enabled: true },
		{ id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1/messages', enabled: true },
		{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1/messages', enabled: true }
	],
	interpreterEnabled: false,
	interpreterAutoRun: false,
	defaultPromptContext: '{{fullHtml|strip_tags:("script,h1,h2,h3,h4,h5,h6,meta,a,ol,ul,li,p,em,strong,i,b,img,video,audio,math,tablecite,strong,td,th,tr,caption,u")|strip_attr:("alt,src,href,id,content,property,name,datetime,title")}}',
	propertyTypes: []
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
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const currentTab = tabs[0];
            if (currentTab && currentTab.id) {
                browser.tabs.update(currentTab.id, { url: url });
            }
        });
    }
}
