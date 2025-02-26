# Container Reuse

This extension add an additional feature to Firefox Multi-Account Containers: when you open a new empty tab,
it will reuse the container of the previous active tab.

It help to keep environment separated will maintaining navigation easy, mainly for separate work & personal stuff.

## Development

Go to `about:debugging` -> This Firefox -> Load Temporary Add-on (select `manifest.json`).  
To see log: Tools -> Browser Tools -> Browser Console (CMD+MAJ+J) -> Select Multiprocess

## Release (Beta - GitHub)

1. Update version in `manifest.json`
2. Execute `web-ext build`
3. Go to firefox addon developer Hub (https://addons.mozilla.org/en-US/developers/addon/002debba3c3946a98008/edit)
4. Click "Upload New Version" -> Select the zip you just created with `web-ext build`
5. Wait the signature to be done and download the xpi file (see tips bellow)
6. Update `update_manifest.json` with your new build

Then you can install the extension using raw github content (like https://raw.githubusercontent.com/LaGregance/firefox-container-reuse/refs/heads/main/web-ext-artifacts/container_reuse_prerelease-1.2.xpi)

Tips: to download the xpi instead of trying to install it:
- Go to `about:config`, set `browser.altClickSave` to true
- Go back to the page and use alt+click on the xpi link
