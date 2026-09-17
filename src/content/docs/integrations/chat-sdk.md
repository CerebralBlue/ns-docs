---
title: "Chat SDK"
description: "Integrate NeuralSeek's Chat SDK effortlessly into your website! Enable dynamic Q&A with KnowledgeBase content, document uploads, and customizable chat widgets."
---

## Overview

**What is it?**

- NeuralSeek's Chat feature enables users to test questions and generate answers using content from their connected KnowledgeBase, similar to Seek. The Chat SDK is easy to integrate, allowing seamless embedding in any website by adding a JavaScript snippet.

**Why is it important?**

- This feature empowers users to integrate NeuralSeek's capabilities with a chat-like interface rapidly. It also allows users to drag and drop documents directly into the chat to inquire about them, enhancing interaction and accessibility.

**How does it work?**

- NeuralSeek’s Chat SDK connects to the KnowledgeBase content. Users can ask questions directly through a customizable chat widget, which is embedded on their website. When a user submits a question, the Chat SDK queries the NeuralSeek, processes the information, and delivers a relevant response. The integration supports document uploads, making it possible for users to drop files and ask specific questions based on file content. Additionally, options for welcome messages and styling help personalize the chat experience.

## Embedding Chat

This is a step-by-step guide to integrating NeuralSeek's Chat SDK into a custom HTML or website.

- Edit the NeuralSeek embedded chat configuration within the NeuralSeek tab. You can preview most of your configuration changes in the chat window to the right of the embed box.

![chat](/img/integrations/chat-sdk/ns-chat.png)

- Copy the embedded chat script from the 'Embed Instructions' box within the NeuralSeek Chat tab.

![chat_config](/img/integrations/chat-sdk/chat_config.png)

- Paste the embedded chat script into your page. Make sure you have HTML elements in your page with IDs that match those defined in your chat config.

![chat_integrated](/img/integrations/chat-sdk/chat_integrated.png)

   - At a minimum, you must have an element with an ID matching the `chatElement` configuration property. The embedded chat will be contained within this element.
   - If `enableChatHistory` is set to true, you must include an element with an ID matching the `chatHistoryElement` configuration property. The chat history view will be contained within this element.
   - If `enableChatOverlayToggleButton` is set to true, you must include an element with an ID matching the `chatOverlayToggleButtonElement` property. The button to toggle show/hide of the chat element will be contained within this element.

- Below is a minimal HTML File which includes the embedded chat, chat history, and chat toggle button:

:::note[HTML Example]
```html
<!DOCTYPE html>
<div id="chat"></div>
<script type="module">
import { NsChat } from 'http://api.localhost:3004/src/chatSDK.js';

const chatConfig = {
  "userId": "myid",
  "chatElement": "chat",
  "chatHistoryElement": "chathistory",
  "chatOverlayToggleButtonElement": "chat-toggle-btn",
  "enableChatHistory": false,
  "enableChatOverlayToggleButton": false,
  "chatOverlayHeaderTitle": "NeuralSeek",
  "includeUrlInResponse": true,
  "urlDisplayText": "See more here",
  "apiServer": "http://api.localhost:3004",
  "loadingAnimationURL": "http://api.localhost:3004/images/ns-loader-chat.svg",
  "chatTheme": {
    "headerColor": "#4F1FF4",
    "headerTextColor": "#FFFFFF",
    "userMsgColor": "#F8D8FF",
    "userMsgTextColor": "#161616",
    "botMsgColor": "#B7EDFF",
    "botMsgTextColor": "#161616"
  },
  "chatTimeout": 23000,
  "chatPersist": true,
  "instanceId": "my-ns-instance",
  "embedCode": 000000000,
  "streaming": true,
  "maistroLed": false,
  "maistroFlow": "",
  "enableDrop": true,
  "allowedFiles": [
    ".png",
    ".jpg",
    ".jpeg"
  ],
  "welcomeMessage": "Welcome to NeuralSeek!",
  "welcomeBotMessages": [
    "How can we help?"
  ],
  "welcomeButtons": [
    "Tell me about NeuralSeek"
  ],
  "turnHistoryLimit": 1,
  "includeRequired": true
}

const chat = new NsChat(chatConfig);
</script>

<body style="background-color: #989898">
  <div id="chat" style="position:fixed; right:20px; bottom:20px; width: 450px; display: none; max-height: 50vh; min-height: max(160px,calc(min(250px, 100vh) - 10px)); height:calc(100vh - 140px);"></div>
  <div id="chat-toggle-btn" style="position: fixed; right: 20px; bottom: 20px;"></div>
  <div id="chathistory"></div>
</body>
```
:::

:::note[Notice]
Please note that for this example we use a test API server and embed code using NeuralSeek's own data. When embedding the NeuralSeek chat feature onto your own servers, make sure to swap the NeuralSeek URL with your own company's name.
:::

## Chat Config Properties

| Property Name | Type | Description |
| ------------- | ---- | ----------- |
| chatElement | String | Provide the ID of the element to inject the chat window into |
| chatHistoryElement | String | Provide the ID of the element to inject the chat history into |
| chatOverlayToggleButtonElement | String | Provide the ID of the element to inject the chat toggle button into |
| chatOverlayHeaderTitle | String | Text to display in the header of the chat window |
| includeUrlInResponse | Boolean | True to include the top ranked URL in your knowledge base when providing a response. False to never include URLs in the response |
| apiServer | String | Autopopulated. API server URL corresponding to the instance of NeuralSeek you wish to use for the embedded chat |
| loadingAnimationURL | String | Provide a URL of a loading animation resource (gif, svg, etc.) to display when the chat is waiting on a response back from NeuralSeek. Defaults to the NeuralSeek loading animation |
| chatTheme.headerColor | String | Custom hexedecimal color code to set the header bar color |
| chatTheme.headerTextColor | String | Custom hexedecimal color code to set the header text color  |
| chatTheme.userMsgColor | String | Custom hexedecimal color code to set the user message box background color  |
| chatTheme.userMsgTextColor | String | Custom hexedecimal color code to set the user message box text color  |
| chatTheme.botMsgColor | String | Custom hexedecimal color code to set the bot message box background color |
| chatTheme.botMsgTextColor | String | Custom hexedecimal color code to set the bot message box text color  |
| chatTimeout | Integer | Milliseconds to wait for a response from the server before re-enabling interaction for the refresh button and chat input box. Defaults to the timeout specified in the Configure tab within NeuralSeek |
| chatPersist | Boolean | True to enable chat persistence. If you leave the chat page or refresh, the latest chat will be displayed for up to 1 hour after the last interaction. False to disable chat persistence and display a fresh chat every time. |
| instanceId | String | ID identifying the instance of NeuralSeek the embedded chat will use |
| embedCode | Number | |
| streaming | Boolean | true to use streaming API, false to use non-streaming API |
| maistroLed | Boolean | Controls whether the chat will use regular seek or a specific mAIstro agent. Set to true if you wish to point the chat at a mAIstro agent. Must be used in conjunction with maistroFlow |
| maistroFlow | String | If maistroLed is set to true, provide the name of the mAIstro agent you wish to use here |
| enableDrop | Boolean | True to enable the ability to drag and drop files into the NeuralSeek chat area |
| allowedFiles | Array | Allowlist of file types that can be uploaded to the chat |
| welcomeMessage | String | Message to automatically display at the top when the chat is loaded. |
| welcomeBotMessages | Array | Each string element in the array will display as a bot message on chat load |
| welcomeButtons | Array | Each string element in the array will be displayed as a button on chat load. These act as a set of pre-defined prompts the user can click on to send the associated message in the chat |
| turnHistoryLimit | Integer | |
| includeRequired | Boolean |
