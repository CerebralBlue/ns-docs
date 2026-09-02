---
title: 'Chat client'
description: 'Hold a multi-turn conversation against your KnowledgeBase inside the NeuralSeek console, configure the embeddable chat widget, and copy the script that puts it on your own site.'
---

## What is it

Chat is a tab in the NeuralSeek console that answers from the same KnowledgeBase Seek uses, but
as a running conversation instead of one question at a time. It can also instruct a user on how
to accomplish a task from your documentation, rather than only stating facts.

The same tab is where you configure the embeddable chat widget and copy the script that puts it
on your own page.

## Why it matters

Seek and Chat differ in surface, not in memory. Both keep conversational context — NeuralSeek
tracks a session as long as a `user_id` or `session_id` is passed on the request, and the Seek
tab exposes **User ID**, **Session ID** and **Session Turns** for exactly that. See
[Conversational context](/seek/conversational-context/) for how the context itself works.

What Chat gives you is the shape of the thing your users will actually meet: a continuous
conversation, with the widget's own configuration beside it and a live preview of every change.
Seek is the better tool when you are tuning retrieval, because it scores one query at a time and
shows you the sources behind it. Chat is the better tool when you want to know how the same
content behaves as a conversation, or when the question is about the widget rather than the
answer.

## When to use it

- Testing whether answers hold up across several turns, not just on the first question.
- Configuring the embedded chat widget and previewing the change before it ships.
- Getting the script that puts a NeuralSeek chat on your own page.
- Showing someone the deployed experience without deploying anything.

## How it works

Open the **Chat** tab and it starts you with an introductory question — "Tell me about
NeuralSeek", or your company name. You are not limited to it; ask anything your documentation
covers. Each answer is generated from your connected KnowledgeBase, with the session's earlier
turns carried forward as context.

The widget's configuration is edited in this same tab, and most changes preview live in the chat
window to the right of the embed box. When the configuration is right, copy the script from the
**Embed Instructions** box and paste it into your page. Your page needs an element whose ID
matches the `chatElement` property, or the widget has nothing to render into.

By default the widget answers through Seek. To point it at a mAIstro agent instead, set
`maistroLed` to `true` and name the agent in `maistroFlow` — the two are used together. That is
the mechanism behind evaluating an agent flow from a chat surface.

The full property list, the script and the integration steps are in
[Chat SDK](/integrations/chat-sdk/).

## FAQ

### How is Chat different from Seek?

Both answer from the same KnowledgeBase and both keep session context. Seek scores one question
at a time and shows the sources behind each answer, which is what you want while tuning
retrieval. Chat is a continuous conversation with the widget configuration and its live preview
beside it, which is what you want when you are testing the experience rather than the retrieval.

### How do I get this chat onto my own website?

Configure it in the Chat tab, copy the script from the **Embed Instructions** box, and paste it
into a page that has an element matching your `chatElement` ID. See
[Chat SDK](/integrations/chat-sdk/) for the full walkthrough.

### Can the chat widget run a mAIstro agent instead of Seek?

Yes. Set `maistroLed` to `true` and put the agent's name in `maistroFlow`. Both properties are
required together; `maistroLed` alone does nothing.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Edit Configuration — chat against a specific NeuralSeek configuration or category; this is how routing is tested
  - Rename Chat and running several test conversations side by side
-->
