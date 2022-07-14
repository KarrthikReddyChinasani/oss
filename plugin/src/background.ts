// src/background.ts

import { MessageType } from "./types";

const sendSnowStatus = (isEnabled: boolean) => {
  const message = { type: "TOGGLE_STATUS", isEnabled };
  // send message to popup
  chrome.runtime.sendMessage(message);

  // send message to every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
};

let isEnabled = false;

// Get locally stored value
chrome.storage.local.get("isEnabled", (res) => {
  if (res["isEnabled"]) {
    isEnabled = true;
  } else {
    isEnabled = false;
  }
});

chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "REQ_TOGGLE_STATUS":
      sendSnowStatus(isEnabled);
      break;
    case "TOGGLE_ON_OFF":
      isEnabled = message.isEnabled;
      chrome.storage.local.set({ isEnabled: isEnabled });
      sendSnowStatus(isEnabled);
      break;
    // case "TOKEN":
    //   chrome.storage.local.set({ token: message.token });
    //   break;
    default:
      break;
  }
});