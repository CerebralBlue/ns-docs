---
title: 'Chat client'
description: 'The Chat screen in the NeuralSeek console lets you hold test conversations in the same chat widget your visitors get when you embed it, and keeps every conversation in Chat History to reopen, rename, delete or download.'
---

## What is it

Chat is the console screen where you talk to NeuralSeek as a running conversation, in the same
chat widget that visitors see when you embed it on your own site. You reach it from the **Chat
SDK** link in the top navigation; the page itself is titled Chat.

The screen has three parts: a left rail with your saved conversations (**Chat History**) and the
**Settings** to download or clear them, the **Embed Instructions** box with the widget's script
in the middle, and the chat window on the right. Every conversation you start is saved, so you
can come back to it later.

## Why it matters

The chat window on the right is the widget you embed, so testing there tells you how your
content holds up as a conversation, in the widget's own look, before you put it on a page. The
rest of the screen is console-only: **Chat History** and its **Settings** are yours, for keeping
and tidying test conversations. The widget configuration the screen generates has
`enableChatHistory` set to `false`; see [Chat SDK](/integrations/chat-sdk/) for what that key
controls in an embedded widget.

It is not a replacement for the [Seek](/seek/overview/) screen. Seek asks one question at a time
and shows an answer panel with its scores, **Filter**, **Personalize** and **Statistical
Details**. The Chat screen shows none of that: no scores and no source details for an answer,
only the conversation. When you need to know _why_ an answer came out the way it did, go back
to Seek.

## When to use it

- You want to see how answers read across several turns in the widget, not one question at a
  time.
- You want to show someone the chat experience without deploying anything.
- You want to keep a set of test conversations and come back to them, each under a meaningful
  name.
- You are changing the widget's configuration and want to try it before copying the script.

Use [Seek](/seek/overview/) instead when you are tuning retrieval or answer quality: it scores
each answer and lets you filter and personalize a single question.

## How it works

### The Chat screen at a glance

![The Chat screen: on the left Search chat history, Settings with Download Chat History and Clear Chat History, and Chat History; in the middle Embed Instructions with Edit chatConfig; on the right the NeuralSeek chat window with the Tell me about Neuralseek button](/img/chat/default.png)

- **Left rail.** A **Search chat history** box, then two groups you can collapse: **Settings**
  and **Chat History**.
- **Middle.** The **Embed Instructions** box with the script that puts this widget on your own
  page, and the **Edit chatConfig** button under it. Both belong to the widget itself and are
  covered in [Chat SDK](/integrations/chat-sdk/).
- **Right.** The chat window, headed **NeuralSeek**.

### Talk to the chat window

The chat window opens with the widget's welcome content:

- The header, **NeuralSeek**. Its text comes from `chatOverlayHeaderTitle` in the widget
  configuration. At its right edge is a circular-arrow button.
- The welcome line, **Welcome to Neuralseek!**, from `welcomeMessage`.
- A welcome prompt button, **Tell me about Neuralseek**, from `welcomeButtons`.
- A bot message, **How can we help?**, from `welcomeBotMessages`.
- The message box along the bottom of the window, marked with a magnifier icon. There is no
  separate send button.

<!-- UNCONFIRMED: clicking a welcome prompt button sends its text as your message — old Chat page ("pre-defined prompts the user can click on to send the associated message") -->

Clicking **Tell me about Neuralseek** sends that text as your first message, so it is a quick
way to start a test.

<!-- UNCONFIRMED: a message is sent by pressing Enter in the message box — inferred from the widget having no send button -->

To ask your own question, type it in the message box and press Enter.

![Screenshot needed — the Chat screen's chat window on its own: header, welcome line, welcome prompt button, bot message and the message box](/img/_placeholder.svg)

<!-- SCREENSHOT: Chat SDK (/chat) > the chat window on the right, cropped to the window: the NeuralSeek header with the circular-arrow button, Welcome to Neuralseek!, the Tell me about Neuralseek button, How can we help? and the message box at the bottom. Why: the section describes each part and no crop of the window exists. -->

Every word of that welcome content, and the colours of the header and the message bubbles
(`chatTheme`), come from the widget configuration, so an embedded widget with the same
configuration opens the same way. The window also has an **Upload Progress** indicator for files dropped into the chat;
whether dropping is allowed, and which file types, is set by `enableDrop` and `allowedFiles`.

**Sending a message saves the conversation.** As soon as you send one, the conversation appears
under **Chat History** in the left rail. There is no unsaved scratch mode, so expect every test
to leave an entry there; tidy them up with **Delete chat** or **Clear Chat History** (below).

**Conversation context.** The Chat screen does not show whether a follow-up question uses the
earlier turns of the same conversation. The widget configuration has a `turnHistoryLimit` key,
which looks like the control for how many turns are carried forward, but the screen does not
explain it. Test it yourself: state a fact in one message and ask about it in the next. See
[Chat SDK](/integrations/chat-sdk/) for the key and
[Conversational context](/seek/conversational-context/) for how NeuralSeek tracks a session.

### Saved conversations — Chat History

![A saved conversation in Chat History: its name and the ⋮ menu button](/img/chat/default--9-18-2026-03-21-21.png)

**Chat History** lists your saved conversations, grouped under a heading with the date and time.
Each conversation is named `chat_` followed by a long number.

<!-- UNCONFIRMED: selecting a saved conversation reloads its earlier messages in the chat window — the capture showed earlier messages after the row was selected, but the recorded click showed no change -->

Selecting a conversation should reload its earlier messages in the chat window.

A **Search chat history** box sits at the top of the rail. The screen does not show whether it
matches conversation names or message text.

Each conversation has a ⋮ button at the right of its row. It opens a small menu:

![The menu of a saved conversation: Rename chat and Delete chat](/img/chat/chat-1789719681000-2-panel.png)

- **Rename chat** opens the **Rename Chat** dialog, with **Cancel** and **Save**. Give a test
  conversation a name that says what it tests (for example the question set or the
  configuration you were trying), instead of `chat_` and a number.
- **Delete chat** is the menu's other entry. By its name it removes that one conversation from
  **Chat History**; the screen does not show whether it asks for confirmation first.

**Several test conversations.** The screen has one chat window, so you cannot run two
conversations side by side. Keep several apart by starting a new conversation for each test,
naming each with **Rename chat**, and switching between them in **Chat History**.

### Settings — download or clear your history

![Screenshot needed — the Settings group of the Chat screen's left rail with Download Chat History and Clear Chat History](/img/_placeholder.svg)

<!-- SCREENSHOT: Chat SDK (/chat) > left rail > Settings group expanded, cropped to the group: Download Chat History and Clear Chat History. Why: the section names both links and no crop of the group exists. -->

The **Settings** group at the top of the left rail holds two links:

- **Download Chat History** downloads your saved conversations. What the file contains, and
  its format, is not shown on the screen.
- **Clear Chat History** removes your saved conversations from **Chat History**. Download them
  first if you may need them again.

### Test a different widget configuration — Edit chatConfig

![The Edit Configuration dialog: the widget configuration as JSON in the Configuration box, with Cancel and Save](/img/chat/edit-chatconfig-panel.png)

**Edit chatConfig**, under the **Embed Instructions** box, opens the **Edit Configuration**
dialog: one **Configuration** box holding the widget configuration as JSON, with **Cancel** and
**Save**. It is the configuration of the chat **widget** (header title, colours, welcome text,
file drop and the like), not a NeuralSeek configuration from Neural Config. Every key is
described in [Chat SDK](/integrations/chat-sdk/).

The screen does not show whether a saved change also restyles the chat window on this screen, so
after saving, check the window before relying on it as a preview.

The Chat screen has no selector for a NeuralSeek configuration or category, so you cannot pick
one here to test routing.

The widget configuration does carry two keys that look like routing: `maistroLed` (shown as
`false`) and `maistroFlow` (shown empty).

<!-- UNCONFIRMED: with maistroLed false the chat answers through Seek; setting maistroLed to true and maistroFlow to an agent's name makes the chat answer through that mAIstro agent — old Chat and Chat SDK pages -->

According to the [Chat SDK](/integrations/chat-sdk/) reference, setting `maistroLed` to `true`
and putting the name of a mAIstro agent in `maistroFlow` has that agent answer instead of Seek,
which would let you try an agent flow in a chat surface. The Chat screen itself does not show
this switch in action.

### Put the chat on your own site — Embed Instructions

The **Embed Instructions** box holds the script that puts this widget on your own web page. Copy
it and follow [Chat SDK](/integrations/chat-sdk/), which covers the script, every configuration
key and the element your page needs.

## FAQ

### How is Chat different from Seek?

[Seek](/seek/overview/) answers one question at a time and shows an answer panel with scores,
**Filter**, **Personalize** and **Statistical Details**, which is what you need while tuning
answers. Chat is a running conversation in the same widget you embed on your site, with each
conversation saved to the console's **Chat History**. It shows no scores or source details.

### Are my test conversations saved?

Yes. Sending a message creates a saved conversation in **Chat History**. Rename it with **Rename
chat**, remove it with **Delete chat**, export your conversations with **Download Chat History**,
or remove them all with **Clear Chat History**.

### Can I run two test conversations at once?

Not side by side: the screen has one chat window. Start a new conversation for each test, give
each a name with **Rename chat**, and switch between them in **Chat History**.

### Can I chat against a different configuration or a mAIstro agent?

There is no NeuralSeek configuration or category picker on the Chat screen. **Edit chatConfig**
edits the widget configuration, which carries the `maistroLed` and `maistroFlow` keys; the
[Chat SDK](/integrations/chat-sdk/) reference describes them as the way to point the chat at a
mAIstro agent instead of Seek, which the Chat screen itself does not show.

### How do I put this chat on my website?

Copy the script from the **Embed Instructions** box and follow
[Chat SDK](/integrations/chat-sdk/) to add it to your page.
