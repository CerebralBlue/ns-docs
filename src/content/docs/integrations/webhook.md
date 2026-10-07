---
title: "Webhook"
description: "The WebHook screen gives you the Seek endpoint URL and the instance ID that a chatbot or any other HTTP client needs, together with an API key you create, to ask NeuralSeek a question."
---

## What is it

The webhook is the plain HTTPS entry point into NeuralSeek. Anything that can send an HTTP request, such as a chatbot platform, a help-desk tool or your own backend, can call it and get an answer back.

You find it under **Admin Tools** > **API's & Integration** > **WebHook**. The screen is headed **Webhook / REST endpoint**, and its lead line reads "Use a webhook to call NeuralSeek." Below that are three numbered cards: advice about response times, a note on who may call the endpoint, and the **Webhook setup:** values you copy into your caller.

The webhook is not a separate feature with its own settings. Its URL ends in `/seek`, so a webhook call is a Seek call. It returns an answer from your KnowledgeBase, shaped by the instance's Neural Config settings.

## Why it matters

Most platforms that sit in front of your users, such as virtual agents, contact-centre tools and custom support portals, can call an external URL but have no NeuralSeek integration of their own. The webhook gives them a single address, an instance ID and an API key. With those values, any of them can send a question to NeuralSeek and show the answer, with nothing to install.

It also keeps the answer logic in one place. The caller only sends the question. How NeuralSeek searches, generates and caches the answer is set once in Neural Config, and every caller gets the same behaviour.

## When to use it

Use the webhook when a server-side system needs a Seek answer: a chatbot's backend, an automation, or a service that forwards user questions.

It is the wrong tool in these cases:

- **The call comes from a web browser.** An API key in page code can be read by anyone who visits the page. Use an [embed code](/configuration/administration/embed-codes/) instead, which only opens the Seek endpoint.
- **You want to run a mAIstro agent, not ask Seek.** The webhook URL always runs Seek. Agents have their own operations on the runtime API (see [What a webhook call runs](#what-a-webhook-call-runs)).
- **You want a ready-made chat window.** The [Chat SDK](/integrations/chat-sdk/) gives you an embeddable widget, so you do not build the calling code yourself.
- **Your platform has a dedicated integration.** The side navigation of **API's & Integration** has its own entries for **Slack Extension**, **Teams Extension**, **Watson Custom Extension**, **LexV2 Lambda** and **SharePoint**, among others. See the [integrations overview](/integrations/overview/).

## How it works

### Open the WebHook screen

Open the **Admin Tools** menu and select **API's & Integration** (the same page is also a link in the top navigation), then select **WebHook** in the side navigation. The page is headed **Webhook / REST endpoint** and opens with "Use a webhook to call NeuralSeek."

<!-- SCREENSHOT: /img/admin-tools/webhook.png — redact the host and instance id in the URL: box and the Instance box before publishing -->

![The WebHook screen: the Webhook / REST endpoint heading, cards 1 and 2, and card 3 (Webhook setup with the API Specification link) holding the URL, API Key and Instance boxes, each with a Copy to clipboard button](/img/admin-tools/webhook.png)

The first two cards are guidance, not settings:

1. "NeuralSeek responses times are highly dependent on the knowledge base used, and subsecond response times are recommended. You can check the response time from your knowledge base on the "configure" tab. Ensure your consuming platform is configured to handle a longer timeout if your knowledge base response time is over 1 second." See [Plan for response time](#plan-for-response-time).
2. "You may call the webhook endpoint from any chatbot or customer-facing UI." Nothing on the screen ties the endpoint to one platform: any caller that can send an HTTPS request with the values below can use it.

### Webhook setup: the three values

The third card, **Webhook setup:**, holds the values a caller needs. Each sits in its own read-only box with a **Copy to clipboard** button beside it. The card's label is followed by an **API Specification** link.

| Box          | What it contains                                   | What you do with it                                                                                                                                                  |
| ------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL:**     | `https://<console host>/v1/<instance id>/seek`     | The address your caller sends its request to. Copy it as shown; the host and instance ID are already filled in for your instance.                                    |
| **API Key**  | The placeholder text `[ Generate an API Key ]`     | Not a key. The screen never displays a key. Create one on the [API keys](/configuration/administration/api-keys/) screen and put it in your caller's configuration. |
| **Instance** | Your instance ID, on its own                       | The same ID that appears in the URL between `/v1/` and `/seek`. Copy it when a platform asks for the instance separately.                                            |

**Copy to clipboard** copies the text of its box. For the **URL:** and **Instance** boxes that is the value you need; for the **API Key** box it is only the placeholder text.

The **API Specification** link sits next to the card's label. For the request your caller sends and the response it gets back, see [REST and Console APIs](/integrations/rest-and-console-api/), which documents the runtime API that the webhook URL belongs to.

Create the key with **Create ApiKey** on the [API keys](/configuration/administration/api-keys/) screen.

The **Add API Key** dialog has a **Scope this API key** section with **Functions**, **Configs**, **Agents**, **API** and **Console API** groups. Scoping is optional: the dialog says to leave everything unchecked to grant full access, and that Function scopes and API/Console API scopes are mutually exclusive.

<!-- UNCONFIRMED: the API group lists POST /seek, so a webhook-only key can be limited to it — old documentation; the dialog's API group was not seen expanded -->

For a key used only by the webhook, select **POST /seek** in the **API** group.

About the API key:

- The WebHook screen does not say which HTTP header carries the key. The **API** screen, next to **WebHook** in the side navigation, shows only an **API Key:** field and an **Authorize** button. See [REST and Console APIs](/integrations/rest-and-console-api/) for how requests are authorized.
- Keep the key on the server. Never put it in browser code; use an [embed code](/configuration/administration/embed-codes/) there.

### Plan for response time

The first card is the one to act on before you go live. A webhook call waits while NeuralSeek searches the KnowledgeBase and writes the answer, and the screen notes that response times depend heavily on the KnowledgeBase used. It recommends a KnowledgeBase that responds in under a second.

Calling platforms stop waiting for an external call after their own timeout. If your KnowledgeBase takes more than a second, raise the calling platform's timeout, as the card advises, so that it does not abandon the request before the answer arrives.

The card sends you to the "configure" tab to check the KnowledgeBase's response time. That is **Neural Config** in today's navigation, where the KnowledgeBase is set up. See [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/).

### What a webhook call runs

The WebHook screen has no agent picker and no endpoint selector. The URL is the Seek endpoint: it ends in `/seek`, which matches the runtime API's **POST /seek** operation, "Seek an answer from NeuralSeek". Every webhook call therefore runs Seek. What Seek does with the question (which KnowledgeBase it searches, how it generates the answer, whether it serves a cached answer) is decided by your Neural Config settings, not by the caller. See the [Seek overview](/seek/overview/).

![The Seek group on the API screen: POST /seek and POST /seek_stream](/img/admin-tools/api--seek-collapse-operation.png)

The **API** screen, next to **WebHook** in the side navigation, lists the other operations you can call over HTTP when a single Seek answer is not what you need:

| You want to…                     | Operation on the API screen                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| Stream a Seek answer as it forms | **POST /seek_stream**, "Stream a Seek an answer from NeuralSeek"  |
| Run a mAIstro agent or NTL       | **POST /maistro**, "Run mAistro NTL or agent"                     |
| Run a named agent with a GET     | **GET /maistro/{agent}**, "Run a mAIstro agent via GET"           |
| Stream an agent's output         | **POST /maistro_stream**, "Stream mAIstro NTL or an agent"        |

The agent is never chosen on the WebHook screen. **GET /maistro/{agent}** names it in the path; the POST operations take it in the request. Their request formats are described in [REST and Console APIs](/integrations/rest-and-console-api/).

To call Seek from code that runs in a browser, use the same Seek endpoint with an embed code instead of an API key. See [Embed codes](/configuration/administration/embed-codes/).

## FAQ

### What URL do I call?

The one in the **URL:** box of the **Webhook setup:** card: `https://<console host>/v1/<instance id>/seek`. Copy it from the WebHook screen with its **Copy to clipboard** button. It already carries your console host and instance ID.

### Does a webhook call run an agent or return a Seek answer?

A Seek answer. The webhook URL is the Seek endpoint, so the answer comes from your KnowledgeBase using your Neural Config settings. To run a mAIstro agent over HTTP, call **POST /maistro** on the runtime API instead. See [REST and Console APIs](/integrations/rest-and-console-api/).

### Where do I get the API key?

Not from the WebHook screen. Its **API Key** box only says `[ Generate an API Key ]`. Create a key with **Create ApiKey** on the [API keys](/configuration/administration/api-keys/) screen.

### Which HTTP header carries the API key?

The WebHook screen does not name it, and the **API** screen shows only an **API Key:** field and an **Authorize** button. See [REST and Console APIs](/integrations/rest-and-console-api/) for how runtime requests are authorized.

### My chatbot times out waiting for NeuralSeek. What should I change?

The WebHook screen recommends a KnowledgeBase that responds in under a second. If yours takes longer, raise the timeout on the calling platform. Check the KnowledgeBase's response time in Neural Config ([KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/)).

### Can I call the webhook from a web page?

Not with an API key, because anyone can read a key placed in page code. From a browser, call the Seek endpoint with an [embed code](/configuration/administration/embed-codes/), which only allows Seek calls.
