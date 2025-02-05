let activeContainer = "firefox-default";

browser.tabs.onActivated.addListener(async (event) => {
    let tab = await browser.tabs.get(event.tabId);
    activeContainer = tab.cookieStoreId ?? "firefox-default";
});

browser.tabs.onCreated.addListener(async (tab) => {
    if (activeContainer != "firefox-default" && tab.cookieStoreId == "firefox-default") {
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
