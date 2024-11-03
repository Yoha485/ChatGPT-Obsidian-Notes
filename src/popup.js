document.addEventListener('DOMContentLoaded', function () {
    const vaultNameInput = document.getElementById('vaultName');
    const silentModeCheckbox = document.getElementById('silentMode');

    chrome.storage.sync.get(['vaultName', 'silentMode'], function (data) {
        if (data.vaultName) {
            vaultNameInput.value = data.vaultName;
        }
        silentModeCheckbox.checked = data.silentMode || false;
    });

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const saveVaultName = debounce(function () {
        chrome.storage.sync.set({ vaultName: vaultNameInput.value }, function () {
            console.log('Vault Name saved:', vaultNameInput.value);
        });
    }, 300);

    vaultNameInput.addEventListener('input', saveVaultName);

    silentModeCheckbox.addEventListener('change', function () {
        chrome.storage.sync.set({ silentMode: silentModeCheckbox.checked }, function () {
            console.log('Silent Mode saved:', silentModeCheckbox.checked);
        });
    });
});
