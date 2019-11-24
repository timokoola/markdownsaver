function copyMd() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // since only one tab should be active and in the current window at once
    // the return variable should only have one entry
    var activeTab = tabs[0];

    chrome.tabs.get(activeTab.id, function(tab) {
      var mdUrl = `[${tab.title}](${tab.url})`;
      var mdUrlText = `Copied [${tab.title}](${tab.url})`;
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.value = mdUrl;
      input.focus();
      input.select();
      const result = document.execCommand("copy");
      if (result === "unsuccessful") {
        console.error("Failed to copy text.");
      } else {
        var notification = new Notification(mdUrlText);
        setTimeout(() => {
          notification.close();
        }, 2000);
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "mdContextMenu",
    title: "Copy markdown link",
    contexts: ["all"]
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  copyMd();
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "copy_link") {
    copyMd();
  }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "mdContextMenu") {
    copyMd();
  }
});
