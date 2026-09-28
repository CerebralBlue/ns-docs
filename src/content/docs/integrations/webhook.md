---
title: "Webhook"
description: "The WebHook screen gives you the Seek endpoint URL, the API key and the instance ID that a chatbot or any other HTTP client needs to ask NeuralSeek a question."
---

## What is it

The webhook is the plain HTTPS entry point into NeuralSeek. Anything that can send an HTTP request, such as a chatbot platform, a help-desk tool or your own backend, can call it and get an answer back.

You find it under **API's & Integration** > **WebHook** in the side navigation. The screen is headed **Webhook / REST endpoint**, and its lead line reads "Use a webhook to call NeuralSeek." Below that are three numbered cards: advice about response times, a note on who may call the endpoint, and the **Webhook setup:** values you copy into your caller.

The webhook is not a separate feature with its own settings. Its URL ends in `/seek`, so a webhook call is a Seek call. It returns an answer from your KnowledgeBase, shaped by the instance's Neural Config settings.

## Why it matters

Most platforms that sit in front of your users, such as virtual agents, contact-centre tools and custom support portals, can call an external URL but have no NeuralSeek integration of their own. The webhook gives them a single address, a key and an instance ID. With those three values, any of them can send a question to NeuralSeek and show the answer, with nothing to install.

It also keeps the answer logic in one place. The caller only sends the question. How NeuralSeek searches, generates and caches the answer is set once in Neural Config, and every caller gets the same behaviour.

## When to use it

Use the webhook when a server-side system needs a Seek answer: a chatbot's backend, an automation, or a service that forwards user questions.

It is the wrong tool in these cases:

- **The call comes from a web browser.** An API key in page code can be read by anyone who visits the page. Use an [embed code](/configuration/administration/embed-codes/) instead, which only opens the Seek endpoint.
- **You want to run a mAIstro agent, not ask Seek.** The webhook URL always runs Seek. Agents have their own endpoints on the runtime API (see [Which endpoint the webhook runs](#which-endpoint-the-webhook-runs)).
- **You want a ready-made chat window.** The [Chat SDK](/integrations/chat-sdk/) gives you an embeddable widget, so you do not build the calling code yourself.
- **Your platform has a dedicated integration.** Slack, Teams and several virtual-agent platforms have their own screens under **API's & Integration**. See the [integrations overview](/integrations/overview/).

## How it works

### Open the WebHook screen

Select **API's & Integration** in the top navigation, then **WebHook** in the side navigation. The page is headed **Webhook / REST endpoint** and opens with "Use a webhook to call NeuralSeek."

![Screenshot needed — API's & Integration > WebHook, heading and cards 1 and 2](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/webhook--intro.png — API's & Integration > WebHook: crop the "Webhook / REST endpoint" heading, the lead line and cards 1 and 2 only. Why: the only capture of this screen is the full viewport, which also shows a live endpoint URL and instance ID and cannot be published. -->

The first two cards are guidance, not settings:

1. "NeuralSeek responses times are highly dependent on the knowledge base used, and subsecond response times are recommended. You can check the response time from your knowledge base on the "configure" tab. Ensure your consuming platform is configured to handle a longer timeout if your knowledge base response time is over 1 second." See [Plan for response time](#plan-for-response-time).
2. "You may call the webhook endpoint from any chatbot or customer-facing UI." Nothing on the screen ties the endpoint to one platform: any caller that can send an HTTPS request with the values below can use it.

### Webhook setup

The third card, **Webhook setup:**, holds the three values a caller needs. Each sits in its own box with a **Copy to clipboard** icon beside it. The card's label is followed by an **API Specification** link.

![Screenshot needed — API's & Integration > WebHook, card 3 (Webhook setup) with the URL, API Key and Instance boxes](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/webhook--setup.png — API's & Integration > WebHook: crop card 3 ("Webhook setup:" with the API Specification link and the URL, API Key and Instance boxes), with the console host and the instance ID blurred in the URL and Instance boxes. Why: the only capture is the full viewport, which shows a live instance URL and ID. -->

| Box          | What it shows                                    | What you do with it                                                                                                                                                                                  |
| ------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL:**     | `https://<console host>/v1/<instance id>/seek`   | The address your caller sends its request to. Copy it as shown; the host and instance ID are already filled in for your instance.                                                                   |
| **API Key**  | The placeholder text `[ Generate an API Key ]`   | Not a key. The screen never displays a key. Create one on the [API keys](/configuration/administration/api-keys/) screen and put it in your caller's configuration.                                |
| **Instance** | Your instance ID                                 | The same ID that appears in the URL between `/v1/` and `/seek`. Copy it when a platform asks for the instance on its own. |

The **API Specification** link sits next to the card's label and promises the specification of this API. For the full runtime API, including the request and response of the Seek operation, see [REST and Console APIs](/integrations/rest-and-console-api/).

About the API key:

- When you create the key with **Create ApiKey** on the API keys screen, you can limit what it may reach. A key used only for the webhook needs **POST /seek**, which sits in the **API** scope group of the **Add API Key** dialog.
- The WebHook screen does not say which HTTP header carries the key. The **API** screen documents how requests are authorized (its **Authorize** button). Take the header from there, or from [REST and Console APIs](/integrations/rest-and-console-api/).
- Keep the key on the server. Never put it in browser code; use an [embed code](/configuration/administration/embed-codes/) there.

### Plan for response time

The first card is the one to act on before you go live. A webhook call waits while NeuralSeek searches the KnowledgeBase and writes the answer, and the screen notes that response times depend heavily on the KnowledgeBase used. It recommends a KnowledgeBase that responds in under a second.

Calling platforms stop waiting for an external call after their own timeout. If your KnowledgeBase takes more than a second, raise the calling platform's timeout, as the card advises, so that it does not abandon the request before the answer arrives.

The card sends you to the "configure" tab to check the KnowledgeBase's response time. That is **Neural Config** in today's navigation, where the KnowledgeBase is set up. See [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/).

### Which endpoint the webhook runs

The WebHook screen has no agent picker and no endpoint selector. Its URL ends in `/seek`, which is the runtime API's **POST /seek** operation, "Seek an answer from NeuralSeek". Every webhook call therefore runs Seek. What Seek does with the question (which KnowledgeBase it searches, how it generates the answer, whether it serves a cached answer) is decided by your Neural Config settings, not by the caller. See the [Seek overview](/seek/overview/).

![The Seek group on the API screen: POST /seek and POST /seek_stream](/img/admin-tools/api--seek-collapse-operation.png)

The **API** screen, next to **WebHook** in the side navigation, lists the other operations you can call over HTTP when Seek is not what you need:

| You want to…                     | Operation on the API screen                                                    |
| -------------------------------- | ------------------------------------------------------------------------------ |
| Stream a Seek answer as it forms | **POST /seek_stream**, "Stream a Seek an answer from NeuralSeek"               |
| Run a mAIstro agent or NTL       | **POST /maistro**, "Run mAistro NTL or agent"                                  |
| Run an agent with a GET request  | **GET /maistro/{agent}**, "Run a mAIstro agent via GET"                        |
| Stream an agent's output         | **POST /maistro_stream**, "Stream mAIstro NTL or an agent"                     |

The agent is chosen in the request to those `/maistro` operations, not on the WebHook screen. Their request formats are described in [REST and Console APIs](/integrations/rest-and-console-api/).

To call Seek from code that runs in a browser, use the same Seek endpoint with an embed code instead of an API key. See [Embed codes](/configuration/administration/embed-codes/).

## FAQ

### What URL do I call?

The one in the **URL:** box of the **Webhook setup:** card: `https://<console host>/v1/<instance id>/seek`. Copy it from the WebHook screen with the **Copy to clipboard** icon. It already carries your console host and instance ID.

### Does a webhook call run an agent or return a Seek answer?

A Seek answer. The webhook URL is the Seek endpoint, so the answer comes from your KnowledgeBase using your Neural Config settings. To run a mAIstro agent over HTTP, call **POST /maistro** or **GET /maistro/{agent}** on the runtime API instead. See [REST and Console APIs](/integrations/rest-and-console-api/).

### Where do I get the API key?

Not from the WebHook screen. Its **API Key** box only says `[ Generate an API Key ]`. Create a key with **Create ApiKey** on the [API keys](/configuration/administration/api-keys/) screen. If you scope it, include **POST /seek**.

### Which HTTP header carries the API key?

The WebHook screen does not name it. The **API** screen under **API's & Integration** documents the authorization scheme behind its **Authorize** button. See [REST and Console APIs](/integrations/rest-and-console-api/).

### My chatbot times out waiting for NeuralSeek. What should I change?

The WebHook screen recommends a KnowledgeBase that responds in under a second. If yours takes longer, raise the timeout on the calling platform. Check the KnowledgeBase's response time in Neural Config ([KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/)).

### Can I call the webhook from a web page?

Not with an API key, because anyone can read a key placed in page code. From a browser, call the Seek endpoint with an [embed code](/configuration/administration/embed-codes/), which only allows Seek calls.
