---
title: "Chat SDK"
description: "The Chat SDK screen generates a script that embeds the NeuralSeek chat widget on your own web page, configured by a chatConfig object and authenticated with your instance's embed code."
---

## What is it

The Chat SDK puts a NeuralSeek chat widget on your own web page. You open **Chat SDK** in the console's top navigation, copy the script from the **Embed Instructions** box, and paste it into your page. The script imports the `NsChat` class from your console host and starts it with a `chatConfig` object: one set of keys that says where the widget renders, which instance it asks, how answers arrive, what it looks like and what a visitor sees first.

The same screen has a chat window on the right, where you can hold test conversations and keep their history. That side of the screen is documented in [Chat client](/seek/chat-client/). This page covers the embed script and every key of `chatConfig`.

## Why it matters

A chat front end for your knowledge base usually means building a UI, handling streaming, keeping a conversation, and keeping credentials out of the browser. The Chat SDK gives you all of that as one host element and one module script. The script the screen generates already carries your console host, your instance ID and your embed code, so a copied snippet works without editing.

The credential in the snippet is the embed code, not an API key. The Embed Key screen describes it as a code that "will only allow access to this endpoint" (Seek), which is why it can sit in public HTML. See [Embed codes](/configuration/administration/embed-codes/).

## When to use it

- You want visitors to your website or intranet to ask questions and get answers from your KnowledgeBase through Seek, in a chat window.
- You want that chat window to run a [mAIstro](/maistro/overview/) agent instead of Seek (the `maistroLed` and `maistroFlow` keys).
- You want visitors to drag images or other files into the chat (the `enableDrop` and `allowedFiles` keys).

It is the wrong tool when:

- the call comes from your own server, or you need anything beyond chatting. Call the API with an [API key](/configuration/administration/api-keys/) instead, as described in [REST and Console APIs](/integrations/rest-and-console-api/);
- you only want to try questions yourself. Use the chat window on the same screen, described in [Chat client](/seek/chat-client/), or the [Seek](/seek/overview/) tab.

## How it works

### Get the embed script from the Embed Instructions box

![Chat SDK screen: the Embed Instructions box with the collapsed code snippet, the Copy to clipboard icon, Show more and Edit chatConfig; on the right the chat window with the NeuralSeek header, the welcome message, the Tell me about Neuralseek button and the How can we help? bubble](/img/chat/default.png)

The **Embed Instructions** box is on the left of the Chat SDK screen, under the line "You can easily embed this chat widget onto your own webpage:". It holds the script and three controls:

- **Copy to clipboard** — the icon at the top right of the code box. It copies the whole snippet.
- **Show more** — expands the code box to show the full `chatConfig` object. Collapsed, the box stops after `includeUrlInResponse`.
- **Show less** — collapses the box again.

The snippet has this shape. The screen fills in the three values shown here in angle brackets with your own console host, instance ID and embed code:

```html
<div id="chat"></div>
<script type="module">
import { NsChat } from 'https://<your console host>/src/chatSDK.js';

const chatConfig = {
  "userId": "",
  "chatElement": "chat",
  "chatHistoryElement": "chathistory",
  "chatOverlayToggleButtonElement": "chat-toggle-btn",
  "enableChatHistory": false,
  "enableChatOverlayToggleButton": false,
  "chatOverlayHeaderTitle": "NeuralSeek",
  "includeUrlInResponse": true,
  "urlDisplayText": "See more here",
  "apiServer": "https://<your console host>",
  "loadingAnimationURL": "https://<your console host>/images/ns-loader-chat.svg",
  "chatTheme": {
    "headerColor": "#4F1FF4",
    "headerTextColor": "#FFFFFF",
    "userMsgColor": "#F8D8FF",
    "userMsgTextColor": "#161616",
    "botMsgColor": "#B7EDFF",
    "botMsgTextColor": "#161616"
  },
  "chatTimeout": 25000,
  "chatPersist": true,
  "instanceId": "<your instance ID>",
  "embedCode": <your embed code>,
  "streaming": true,
  "maistroLed": false,
  "maistroFlow": "",
  "enableDrop": true,
  "allowedFiles": [".png", ".jpg", ".jpeg"],
  "welcomeMessage": "Welcome to Neuralseek!",
  "welcomeBotMessages": ["How can we help?"],
  "welcomeButtons": ["Tell me about Neuralseek"],
  "turnHistoryLimit": 1,
  "includeRequired": true,
  "enableCustomHandlerFunctions": false
}
const chat = new NsChat(chatConfig);
</script>
```

To embed the widget:

1. Adjust the configuration, either in the console with **Edit chatConfig** (next section) or later in your copy of the snippet.
2. Select **Copy to clipboard**.
3. Paste the snippet into your page. It already contains `<div id="chat"></div>`, the element the widget renders into.
4. If you turn on the chat history view or the overlay toggle button, add the elements those keys name (see [host elements](#where-the-widget-renders-host-elements)).

The values in the tables below are the values the generated snippet shows. They are a starting point you can change, not settings the product enforces. The welcome texts in particular ("Welcome to Neuralseek!", "Tell me about Neuralseek") are ordinary text you replace with your own.

### Edit chatConfig and preview it in the chat window

![Edit Configuration dialog open over the Chat SDK screen: the Configuration text area with the chatConfig JSON, the Edit configuration helper text, the Close icon, and the Cancel and Save buttons](/img/chat/edit-chatconfig.png)

Under the code box, **Edit chatConfig** opens the **Edit Configuration** dialog. It holds one text area, **Configuration** (helper text "Edit configuration"), with the `chatConfig` object as JSON: the same keys as the snippet, without the `<script>` wrapper around them. The text area scrolls; the keys appear in the same order as in the snippet.

- **Save** — stores the edited JSON.
- **Cancel** — closes the dialog without saving.
- **Close** — the × at the top right of the dialog; closes it.

Keep the text valid JSON: keys and string values in double quotes, a comma between entries, no comma after the last one.

<!-- UNCONFIRMED: after Save, most configuration changes show in the chat window to the right of the Embed Instructions box — old Chat SDK page -->

The chat window to the right of the box is a preview of the widget: most configuration changes show there, so you can check colours and welcome texts before you copy the script.

### Where the widget renders: host elements

![Edit Configuration dialog, first lines of the Configuration text area: userId, chatElement, chatHistoryElement, chatOverlayToggleButtonElement, enableChatHistory, enableChatOverlayToggleButton, chatOverlayHeaderTitle, includeUrlInResponse, urlDisplayText and apiServer](/img/chat/edit-chatconfig-panel.png)

The widget injects itself into elements of your page, found by their `id`. At a minimum your page needs an element whose `id` matches `chatElement`; the generated snippet includes it as `<div id="chat"></div>`.

| Property                         | Type    | Value in the generated snippet | What it does                                                                                                                     |
| -------------------------------- | ------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `chatElement`                    | String  | `"chat"`                       | ID of the element the chat window is injected into. Required.                                                                    |
| `chatHistoryElement`             | String  | `"chathistory"`                | ID of the element the chat history view is injected into. Needed only when `enableChatHistory` is `true`.                        |
| `chatOverlayToggleButtonElement` | String  | `"chat-toggle-btn"`            | ID of the element the show/hide button for the chat is injected into. Needed only when `enableChatOverlayToggleButton` is `true`. |
| `enableChatHistory`              | Boolean | `false`                        | Switch for the chat history view; see below the table.                                                                           |
| `enableChatOverlayToggleButton`  | Boolean | `false`                        | Switch for the show/hide button; see below the table.                                                                            |
| `chatOverlayHeaderTitle`         | String  | `"NeuralSeek"`                 | Text in the header bar of the chat window. The console's chat window shows **NeuralSeek** there.                                 |

<!-- UNCONFIRMED: enableChatHistory renders a chat history view in chatHistoryElement, and enableChatOverlayToggleButton renders the show/hide button in chatOverlayToggleButtonElement — old Chat SDK page (setup steps); neither flag has help text on the screen -->

When you set `enableChatHistory` to `true`, the widget renders its history view in the `chatHistoryElement` element; when you set `enableChatOverlayToggleButton` to `true`, it renders the show/hide button in the `chatOverlayToggleButtonElement` element. The generated snippet contains neither element, so add them yourself. A page with all three host elements, using the IDs from the generated snippet:

```html
<!-- Your own page, around the pasted snippet -->
<div id="chat"></div>
<div id="chathistory"></div>
<div id="chat-toggle-btn"></div>
```

If the IDs in your page and in `chatConfig` differ, the widget has nowhere to render and your page shows no chat.

### Who is asking and where answers come from: connection keys

![Screenshot needed — Edit Configuration dialog, Configuration text area scrolled to instanceId, embedCode, maistroLed and maistroFlow](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/chat/edit-chatconfig--connection.png — Chat SDK > Edit chatConfig, the Configuration text area scrolled so instanceId, embedCode, streaming, maistroLed and maistroFlow are visible; redact the instance ID and the embed code -->

These keys tie the widget to your instance and decide whether it talks to Seek or to a mAIstro agent.

| Property                       | Type    | Value in the generated snippet | What it does                                                                                                                  |
| ------------------------------ | ------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `apiServer`                    | String  | your console host              | Filled in for you. The API server of the NeuralSeek instance the widget uses; the same host the snippet imports `chatSDK.js` from. |
| `instanceId`                   | String  | your instance ID               | Identifies the NeuralSeek instance the widget uses. It is the instance ID in your console URL.                                |
| `embedCode`                    | Number  | your embed code                | The browser-safe credential the widget sends. The same number the **Embed Key** page shows.                                   |
| `userId`                       | String  | `""`                           | No description on the Chat SDK screen.                                                                                        |
| `maistroLed`                   | Boolean | `false`                        | `false`: the chat uses Seek. `true`: the chat uses the mAIstro agent named in `maistroFlow`.                                  |
| `maistroFlow`                  | String  | `""`                           | When `maistroLed` is `true`, the name of the mAIstro agent the chat runs.                                                     |
| `enableCustomHandlerFunctions` | Boolean | `false`                        | No description on the Chat SDK screen.                                                                                        |

**The embed code.** `embedCode` is your instance's embed code, the same number shown under **Admin Tools** > **API's & Integration** > **Embed Key**. That screen says the embed code "will only allow access to this endpoint", the Seek endpoint, so it can sit in public HTML where an API key must never go. Never replace it with an API key. See [Embed codes](/configuration/administration/embed-codes/).

**Pointing the widget at a mAIstro agent.** To have the chat run a [mAIstro](/maistro/overview/) agent instead of Seek, set `maistroLed` to `true` and put the agent's name in `maistroFlow`. `maistroLed` must be used together with `maistroFlow`. The Embed Key screen names only the Seek endpoint for the embed code, so test a mAIstro-led widget on your own instance before you publish it.

### How answers are delivered: response keys

![Screenshot needed — Edit Configuration dialog, Configuration text area scrolled to chatTimeout, chatPersist, streaming, turnHistoryLimit and includeRequired](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/chat/edit-chatconfig--response.png — Chat SDK > Edit chatConfig, the Configuration text area scrolled to show chatTimeout, chatPersist and streaming, and a second crop scrolled to the end (turnHistoryLimit, includeRequired, enableCustomHandlerFunctions) -->

| Property               | Type    | Value in the generated snippet                     | What it does                                                                                                                                              |
| ---------------------- | ------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `streaming`            | Boolean | `true`                                             | `true`: the widget uses the streaming API. `false`: it uses the non-streaming API. |
| `chatTimeout`          | Integer | `25000`                                            | Milliseconds to wait for a response from the server before the chat input box and the refresh button accept input again.                                  |
| `chatPersist`          | Boolean | `true`                                             | `true`: the latest chat is shown again when the visitor leaves the page or refreshes it. `false`: every visit starts a fresh chat.                         |
| `includeUrlInResponse` | Boolean | `true`                                             | `true`: an answer includes the top-ranked URL from your knowledge base. `false`: answers never include URLs.                                              |
| `urlDisplayText`       | String  | `"See more here"`                                  | No description on the Chat SDK screen. It sits next to `includeUrlInResponse` in the snippet.                                                             |
| `loadingAnimationURL`  | String  | `https://<your console host>/images/ns-loader-chat.svg` | URL of a loading animation (GIF, SVG or similar) shown while the chat waits for an answer. The generated snippet points at the NeuralSeek loading animation. |
| `turnHistoryLimit`     | Integer | `1`                                                | No description on the Chat SDK screen.                                                                                                                    |
| `includeRequired`      | Boolean | `true`                                             | No description on the Chat SDK screen.                                                                                                                    |

<!-- UNCONFIRMED: chatTimeout defaults to the timeout set in Neural Config when it is not set in chatConfig — old Chat SDK page ("Defaults to the timeout specified in the Configure tab") -->

If you leave `chatTimeout` out, the widget uses the timeout configured for your instance in Neural Config. Raise the value if your answers regularly take longer than it allows.

<!-- UNCONFIRMED: with chatPersist true, the latest chat is shown for up to 1 hour after the last interaction — old Chat SDK page -->

With `chatPersist` on, the latest chat stays available for up to one hour after the visitor's last message.

`turnHistoryLimit`, `includeRequired`, `userId`, `urlDisplayText` and `enableCustomHandlerFunctions` carry no help text on the screen. Keep the values from the generated snippet unless you know what a change does.

### Uploading files into the chat: enableDrop and allowedFiles

![Screenshot needed — the Chat SDK chat window while a file is dragged onto it, with the Upload Progress readout](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/chat/chat-drop.png — Chat SDK, the chat window on the right with an image file dragged onto it and the Upload Progress readout visible -->

With these keys a visitor can drag a file onto the chat and ask about it.

| Property       | Type    | Value in the generated snippet | What it does                                                            |
| -------------- | ------- | ------------------------------ | ----------------------------------------------------------------------- |
| `enableDrop`   | Boolean | `true`                         | `true`: files can be dragged and dropped into the chat area. `false`: no drop. |
| `allowedFiles` | Array   | `[".png", ".jpg", ".jpeg"]`    | Allowlist of the file types that can be dropped into the chat.         |

The generated snippet allows PNG and JPEG images. To accept other types, add their extensions to `allowedFiles`, and test each one before you publish. To switch uploads off, set `enableDrop` to `false`. The chat window has an **Upload Progress** readout, which shows the progress of a dropped file.

### Look and first impression: chatTheme and welcome keys

![Chat SDK screen with the code box expanded to the chatTheme keys and Show less, and the chat window showing the welcome message, the Tell me about Neuralseek button, the How can we help? bot bubble, and user and bot messages in the theme colours](/img/chat/show-more.png)

`chatTheme` holds six hex colour codes:

| Property                     | Value in the generated snippet | What it colours                     |
| ---------------------------- | ------------------------------ | ----------------------------------- |
| `chatTheme.headerColor`      | `#4F1FF4`                      | The header bar of the chat window   |
| `chatTheme.headerTextColor`  | `#FFFFFF`                      | The header text                     |
| `chatTheme.userMsgColor`     | `#F8D8FF`                      | The background of a visitor message |
| `chatTheme.userMsgTextColor` | `#161616`                      | The text of a visitor message       |
| `chatTheme.botMsgColor`      | `#B7EDFF`                      | The background of an answer         |
| `chatTheme.botMsgTextColor`  | `#161616`                      | The text of an answer               |

In the console's chat window you can see them: the violet header bar, the pink visitor messages on the right and the light-blue answers on the left.

The welcome keys decide what a visitor sees before typing:

| Property             | Type   | Value in the generated snippet | What it does                                                                                                  |
| -------------------- | ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `welcomeMessage`     | String | `"Welcome to Neuralseek!"`     | Shown at the top of the chat when it loads.                                                                   |
| `welcomeBotMessages` | Array  | `["How can we help?"]`         | Each string is shown as a bot message when the chat loads.                                                    |
| `welcomeButtons`     | Array  | `["Tell me about Neuralseek"]` | Each string is shown as a button when the chat loads. Clicking it sends that text as the visitor's message. |

In the console, the **Tell me about Neuralseek** button in the chat window is the preview of `welcomeButtons`: one button per string in the array. Clicking it there starts a test conversation; what happens in that window is described in [Chat client](/seek/chat-client/). Use the buttons for the questions your visitors ask most, so they get an answer without typing.

## FAQ

### Where do I get the script for my website?

Open **Chat SDK** in the console's top navigation and select **Copy to clipboard** in the **Embed Instructions** box. The script already contains your console host, your instance ID and your embed code; paste it into your page as it is.

### Is it safe to put the embed code in public HTML?

Yes. `embedCode` is your instance's embed code, not an API key. The Embed Key screen says the embed code only allows access to the Seek endpoint. Never put an API key in a web page. See [Embed codes](/configuration/administration/embed-codes/).

### Can the widget run a mAIstro agent instead of Seek?

Set `maistroLed` to `true` and put the agent's name in `maistroFlow`. The Embed Key screen names only the Seek endpoint for the embed code, so test the widget with your agent before you publish it. See [mAIstro](/maistro/overview/).

### How do I change the colours and the welcome text?

Select **Edit chatConfig**, change the `chatTheme` colours and the `welcomeMessage`, `welcomeBotMessages` and `welcomeButtons` values in the **Configuration** text area, and select **Save**. You can also edit the same keys in your copy of the snippet.

### My page shows no chat. What did I miss?

Your page needs an element whose `id` matches `chatElement` (`chat` in the generated snippet). If you turned on `enableChatHistory` or `enableChatOverlayToggleButton`, it also needs the elements named by `chatHistoryElement` and `chatOverlayToggleButtonElement`.

### What do turnHistoryLimit and includeRequired do?

The Chat SDK screen gives no description for either key. The generated snippet sets `turnHistoryLimit` to `1` and `includeRequired` to `true`; keep those values unless you know what a change does.
