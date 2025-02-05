const NO_CONTAINER = "firefox-default";
const DEFAULT_CONTAINER_NAME = "firefox-container-2";
const ACTIVE_CONTAINER_KEY = "CONTAINER_REUSE_ACTIVE";

async function getActiveContainer() {
    const result = await browser.storage.local.get({ [ACTIVE_CONTAINER_KEY]: NO_CONTAINER })
    return result[ACTIVE_CONTAINER_KEY];
}

async function setActiveContainer(value) {
    const result = await browser.storage.local.set({ [ACTIVE_CONTAINER_KEY]: value ?? NO_CONTAINER })
}

browser.tabs.onActivated.addListener(async (event) => {
    let tab = await browser.tabs.get(event.tabId);
    setActiveContainer(tab.cookieStoreId);
});

browser.tabs.onCreated.addListener(async (tab) => {
    const activeContainer = await getActiveContainer();

    console.log('cookieStoreId = ', tab.cookieStoreId);
    console.log('activeContainer = ', activeContainer);
    if (activeContainer != NO_CONTAINER && tab.cookieStoreId == NO_CONTAINER) {
        // Re-create the tab in the good container
        browser.tabs.create({
            index: tab.index,
            openerTabId: tab.openerTabId,
            cookieStoreId: activeContainer
        });
        
        // Close the original tab
        browser.tabs.remove(tab.id);
    }
});
