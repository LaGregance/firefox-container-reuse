const NO_CONTAINER = "firefox-default";
const DEFAULT_CONTAINER_NAME = "firefox-container-2";
const ACTIVE_CONTAINER_KEY = "CONTAINER_REUSE_ACTIVE";

async function getActiveContainer() {
    const result = await browser.storage.local.get({ [ACTIVE_CONTAINER_KEY]: DEFAULT_CONTAINER_NAME })
    return result[ACTIVE_CONTAINER_KEY];
}

async function setActiveContainer(value) {
    await browser.storage.local.set({ [ACTIVE_CONTAINER_KEY]: value ?? DEFAULT_CONTAINER_NAME })
}

browser.tabs.onActivated.addListener(async (event) => {
    try {
        let tab = await browser.tabs.get(event.tabId);
        if (tab.cookieStoreId !== NO_CONTAINER) {
            await setActiveContainer(tab.cookieStoreId);
        }
    } catch (e) {
        // Tab already deleted because it was on wrong container
    }
});

browser.tabs.onCreated.addListener((tab) => {
    const updater = async (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.url) {
            browser.tabs.onUpdated.removeListener(updater);

            if (changeInfo.url === 'about:newtab') {
                // about:newtab cause "Illegal URL: about:newtab"
                changeInfo.url = undefined;
            } else if (!changeInfo.url.startsWith('http://') && !changeInfo.url.startsWith('https://') && changeInfo.url !== 'about:blank') {
                // Only apply container if link is http(s)
                return;
            }

            const activeContainer = await getActiveContainer();
            if (activeContainer !== NO_CONTAINER && tab.cookieStoreId === NO_CONTAINER) {
                // Re-create the tab in the good container
                const newTab = await browser.tabs.create({
                    index: tab.index,
                    openerTabId: tab.openerTabId,
                    cookieStoreId: activeContainer,
                    url: changeInfo.url,
                });

                // Close the original tab
                await browser.tabs.remove(tab.id);
            }
        }
    };

    if (tab.url === "about:newtab") {
        // Newtab will never receive URL update, so trigger directly
        updater(tab.id, { url: tab.url }).catch(console.error);
    } else {
        browser.tabs.onUpdated.addListener(updater);
    }
});
