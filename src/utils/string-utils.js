export function sanitizeFileName(fileName) {
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    const isWindows = /win/i.test(platform);
    const isMac = /mac/i.test(platform);

    let sanitized = fileName;

    if (isWindows) {
        sanitized = sanitized
            .replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')
            .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, '_$1$2')
            .replace(/[\s.]+$/, '');
    } else if (isMac) {
        sanitized = sanitized.replace(/[\/:\x00-\x1F]/g, '').replace(/^\./, '_');
    } else {
        // Linux and other systems
        sanitized = sanitized.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').replace(/^\./, '_');
    }

    // Common operations for all platforms
    sanitized = sanitized
        .replace(/^\.+/, '') // Remove leading periods
        .trim()
        .slice(0, 250); // Trim to 250 characters, leaving room to append ' 1.md'

    // Ensure the file name is not empty
    if (sanitized.length === 0) {
        sanitized = 'Untitled';
    }

    return sanitized;
}

export const extractMarkdownSubset = (markdown, subset) => {
    // Remove extra spaces from the subset
  subset = subset.trim();

  // Get the first and last words from the subset
  const subsetWords = subset.split(/\s+/);
  const firstWord = subsetWords[0];
  const lastWord = subsetWords[subsetWords.length - 1];

  // Find the starting and ending indices of the subset in markdown
  const startIdx = markdown.indexOf(firstWord);
  const endIdx = markdown.indexOf(lastWord, startIdx) + lastWord.length;

  // If both words are found, return the Markdown substring
  if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
    return markdown.slice(startIdx, endIdx).trim();
  }

  // If not found, return the subset as is
  return subset;
};
