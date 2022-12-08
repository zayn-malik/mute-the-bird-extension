// When you specify "type": "module" in the manifest background,
// you can include the service worker as an ES Module,

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mute_select",
    title: "mute",
    type: "normal",
    contexts: ["selection"],
    documentUrlPatterns: ["*://twitter.com/*"],
  });
});

// Mute the selected keyword when the user clicks the contextual menu
chrome.contextMenus.onClicked.addListener((item) => {
  chrome.cookies.get(
    { url: "https://twitter.com", name: "ct0" },
    (response) => {
      let csrfToken = response.value;
      chrome.storage.local.get("optionsToken", function (result) {
        muteKeyword(result.optionsToken, item.selectionText, csrfToken);
      });
    }
  );
});

// Adds listener for option page, also opens the option page when installing the extension
// maybe add a message in the popup if the token was not provided
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // chrome.tabs.create({ url: "options.html" });
    chrome.runtime.openOptionsPage();
  }
});

function muteKeyword(bearerToken, word, csrfToken) {
  const form = new URLSearchParams();
  form.append("keyword", word);
  form.append("mute_surfaces", "notifications,home_timeline,tweet_replies");
  form.append("mute_options", "");
  form.append("duration", "");

  fetch("https://twitter.com/i/api/1.1/mutes/keywords/create.json", {
    headers: {
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": csrfToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
    },
    body: form.toString(),
    method: "POST",
  });
}
