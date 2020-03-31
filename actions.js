/**
 * @param string url
 */
function clearBrowserData(url) {
    let urlObj = new URL(url);

    chrome.browsingData.remove({
        "origins": [urlObj.origin.toString()]
    }, {
        "appcache": true,
        "cache": true,
        "cacheStorage": true,
        "indexedDB": true,
        "localStorage": true,
        "serviceWorkers": true,
        "webSQL": true
    });
}

/**
 * @param string url
 *
 * @returns {string}
 */
function getNoCachedUrl(url) {
    timestamp = Date.now().toString();

    let urlObj = new URL(url);
    urlObj.searchParams.set('nocache', timestamp);

    return urlObj.toString();
}

function redirectCurrentTab(currentTab) {
    let url = currentTab.url

    clearBrowserData(url);
    chrome.tabs.update(currentTab.id, { url: getNoCachedUrl(url) });
}

/**
 * @param info
 * @param tab
 */
function redirectToNonCachedUrl(info, tab) {
    let url = info.pageUrl;

    clearBrowserData(url);
    chrome.tabs.update(tab.id, { url: getNoCachedUrl(url) });
}

chrome.browserAction.onClicked.addListener(redirectCurrentTab);
chrome.contextMenus.onClicked.addListener(redirectToNonCachedUrl);