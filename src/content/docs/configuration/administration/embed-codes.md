---
title: "Embed codes"
description: "An embed code is the per-instance number you send in the embedcode header to call your NeuralSeek Seek endpoint from browser code, where an API key must never go."
---

## What is it

An embed code is a credential that lets a web page or other browser client call your instance's Seek endpoint without an API key. Every instance has one. You find it under **API's & Integration** > **Embed Key**, on a page headed **Embed Seek**, together with the Seek endpoint URL it works with.

The page describes it in one sentence: "You can call the Seek endpoint directly by passing an embedCode to the api call. The embedCode will only allow access to this endpoint." You send the code as a request header named `embedcode`.

## Why it matters

Anything you put in a web page can be read by the people who visit it. An API key in frontend code can be copied out of the page source and reused. An embed code can be copied too, but it only opens the Seek endpoint. Someone who takes it can ask your instance questions. They cannot use it to read or change your configuration, or to call the other APIs.

That limit is what makes it safe to put an embed code in public code. It is also the credential the embeddable chat widget uses.

<!-- UNCONFIRMED: the Chat SDK widget config takes an `embedCode` (type Number) next to `instanceId` — old Chat SDK page (integrations/chat-sdk) -->

The widget's configuration takes an `embedCode` value; see [Chat SDK](/integrations/chat-sdk/).

## When to use it

Use an embed code when the code that calls NeuralSeek runs in a user's browser:

- a search box or answer panel on your website that sends questions to Seek;
- the embeddable chat widget from the [Chat SDK](/integrations/chat-sdk/).

Use an [API key](/configuration/administration/api-keys/) instead when the call comes from a server you control, or when you need anything beyond asking Seek a question. That includes managing the instance, loading content and calling other endpoints. An embed code cannot do those things, and an API key must never reach a browser.

## How it works

### Find your embed code

![Screenshot needed — API's & Integration ▸ Embed Key: the Embed Seek page with the embed code and Seek endpoint boxes](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/embed-key.png — API's & Integration > Embed Key, the Embed Seek card with side navigation. The existing capture shows a live embed code and instance ID in clear: re-capture or redact both code boxes before publishing. -->

1. Open **API's & Integration** in the top navigation. It is also an item in the **Admin Tools** menu.
2. In the side navigation, select **Embed Key**. It is the second item, directly under **API Keys**.
3. The **Embed Seek** page opens. Under the help text is one numbered step: "When calling the api endpoints pass a header parameter for "embedcode" with a value of:"
4. Below that step are two read-only boxes, each with a **Copy to clipboard** button:
   - the first box holds your instance's **embed code**, a number;
   - the second box holds your instance's **Seek endpoint URL**, in the form `https://<console host>/v1/<your instance ID>/seek`.

The page only displays the code. It has no control to generate, regenerate, revoke or expire it, and it shows no expiry date.

### Call Seek with the embed code

Send your request to the URL from the second box. Add a header named `embedcode` whose value is the number from the first box:

```text
Endpoint:  https://<console host>/v1/<your instance ID>/seek
Header:    embedcode: <your embed code>
```

Type the header name in lower case, as `embedcode`. The page's help text calls the credential `embedCode`, but the header it asks for is spelled `embedcode`.

The embed code does not change what you send in the request body. That is the ordinary Seek request described in [REST and Console APIs](/integrations/rest-and-console-api/). The only difference is the header: you send the embed code in place of an API key.

### Embed code or API key?

The two credentials are for different places:

| | Embed code | API key |
| --- | --- | --- |
| Where you find it | **API's & Integration** > **Embed Key** | **API's & Integration** > **API Keys** |
| What it opens | The Seek endpoint only ("The embedCode will only allow access to this endpoint.") | Depends on how the key is scoped; see [API keys](/configuration/administration/api-keys/) |
| Safe in browser code | Yes | No, keep it on a server |

**API Keys**, the link directly above **Embed Key** in the side navigation, is where you create and scope API keys. The [API keys](/configuration/administration/api-keys/) page explains them.

The **Embed Seek** page names only the Seek endpoint.

<!-- UNCONFIRMED: the embed code is also accepted by the mAIstro endpoint — route description in the migration map, old Chat SDK page (embedCode configured with maistroLed / maistroFlow) -->

Earlier documentation says the embed code also opens the mAIstro endpoint, so that the chat widget can run a mAIstro agent. The Embed Seek page does not say this. Test it on your own instance before you rely on it.

Assume that anyone can copy an embed code out of your web page. Because the code only allows Seek calls, the risk is that other people ask your instance questions, and those questions count against your instance's usage. It does not expose your configuration. The Embed Key page has no control to rotate or revoke the code.

## FAQ

### Can I put the embed code in my website's JavaScript?

Yes. That is what it is for. The Embed Seek page says the embed code only allows access to the Seek endpoint, so someone who reads it from your page source can ask Seek questions but cannot reach your configuration or the other APIs.

### Where do I find my embed code?

Go to **API's & Integration** > **Embed Key**. The first box on the **Embed Seek** page holds the code and the second holds your Seek endpoint URL. Each box has a **Copy to clipboard** button.

### How do I send the embed code with a request?

Add a request header named `embedcode` whose value is the code, and send the request to the Seek endpoint URL shown on the same page (`https://<console host>/v1/<your instance ID>/seek`). The request body is the ordinary Seek request.

### Should I use an API key instead?

Only from a server. API keys are managed on the [API keys](/configuration/administration/api-keys/) page and can open much more than Seek. Never put one in browser code. In a browser, use the embed code.

### Does the embed code work for mAIstro agents too?

The Embed Seek page names only the Seek endpoint. Earlier documentation says the embed code also opens the mAIstro endpoint, but this page does not confirm it. Test it on your instance before you depend on it.

### Can I regenerate or revoke an embed code?

Not from the Embed Key page. It shows the code and the endpoint and has no generate, regenerate, revoke or expiry control. Because the code only opens Seek, the worst misuse is unwanted Seek traffic on your instance.
