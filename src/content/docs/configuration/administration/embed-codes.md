---
title: "Embed codes"
description: "An embed code is the per-instance number you send in the embedcode header to call your NeuralSeek Seek endpoint from browser code, where an API key must never go."
---

## What is it

An embed code is a credential that lets a web page or other browser client call your instance's Seek endpoint without an API key. You find it under **Admin Tools** > **API's & Integration** > **Embed Key**, on a page headed **Embed Seek**, together with the Seek endpoint URL it works with.

The page describes it in one sentence: "You can call the Seek endpoint directly by passing an embedCode to the api call. The embedCode will only allow access to this endpoint." You send the code as a request header named `embedcode`.

## Why it matters

Anything you put in a web page can be read by the people who visit it. An API key in frontend code can be copied out of the page source and reused. An embed code can be copied too, but the screen states that it only allows access to the Seek endpoint. Someone who takes it can ask your instance questions. If the code opens only Seek, as the screen says, it gives no way into your configuration or the other APIs.

That limit is what makes an embed code the credential for public code.

<!-- UNCONFIRMED: the Chat SDK widget config takes an `embedCode` (type Number) next to `instanceId` — old Chat SDK page (integrations/chat-sdk) -->

The embeddable chat widget's configuration also takes an `embedCode` value; see [Chat SDK](/integrations/chat-sdk/).

## When to use it

Use an embed code when the code that calls NeuralSeek runs in a user's browser:

- a search box or answer panel on your website that sends questions to Seek;
- the embeddable chat widget from the [Chat SDK](/integrations/chat-sdk/).

Use an [API key](/configuration/administration/api-keys/) instead when the call comes from a server you control, or when you need anything beyond asking Seek a question, such as managing the instance, loading content or calling other endpoints. An embed code cannot do those things, and an API key must never reach a browser.

## How it works

### Find your embed code

![API's & Integration, Embed Key selected in the side navigation: the Embed Seek card with the embedcode step, the embed code box and the Seek endpoint box, each with a Copy to clipboard button; the code and instance id are replaced with placeholders here](/img/admin-tools/embed-key.png)

1. Open **API's & Integration**. It is a link in the top navigation and also an item in the **Admin Tools** menu.
2. In the side navigation, select **Embed Key**. It is the second item, directly under **API Keys**.
3. The **Embed Seek** page opens. Under the help text is one numbered step: "When calling the api endpoints pass a header parameter for "embedcode" with a value of:"
4. Below that step are two read-only boxes, each with a **Copy to clipboard** button at its right edge:
   - the first box holds your instance's embed code, a number;
   - the second box holds your instance's Seek endpoint URL, in the form `https://<console host>/v1/<your instance ID>/seek`.

The page only displays the code. It has no control to generate, regenerate, revoke or delete it, and it shows no expiry date.

### Call Seek with the embed code

Send your request to the URL from the second box. Add a header named `embedcode` whose value is the number from the first box:

```text
Endpoint:  https://<console host>/v1/<your instance ID>/seek
Header:    embedcode: <your embed code>
```

Send the header name exactly as the page spells it, `embedcode`, in lower case. The page's help text calls the credential `embedCode`, but the header it asks for is `embedcode`.

The embed code does not change what you send in the request body. That is the ordinary Seek request described in [REST and Console APIs](/integrations/rest-and-console-api/). The only difference is the header: you send the embed code in place of an API key.

Use **Copy to clipboard** rather than selecting the text by hand: it copies the whole contents of its box, the embed code or the endpoint URL. Every code box on the **API's & Integration** screens has the same button. Where a box shows the placeholder `[ Generate an API Key ]` instead of a key, as on several of these screens (WebHook, Watson Logs, MCP Server and others), the button copies only that placeholder text, so replace it with a real key from **API Keys**.

### Embed code or API key?

The two credentials are for different places:

|                       | Embed code                                                                        | API key                                                               |
| --------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Where you find it     | **API's & Integration** > **Embed Key**                                           | **API's & Integration** > **API Keys**                                |
| What it opens         | The Seek endpoint only ("The embedCode will only allow access to this endpoint.") | More than Seek; see [API keys](/configuration/administration/api-keys/) |
| Safe in browser code  | Yes                                                                               | No, keep it on a server                                               |

**API Keys**, the link directly above **Embed Key** in the side navigation, is where you create API keys. The [API keys](/configuration/administration/api-keys/) page explains them.

The **Embed Seek** page names only the Seek endpoint.

<!-- UNCONFIRMED: the embed code is also accepted by the mAIstro endpoint — route description in the migration map, old Chat SDK page (embedCode configured with maistroLed / maistroFlow) -->

Earlier documentation says the embed code also opens the mAIstro endpoint, so that the chat widget can run a mAIstro agent. The Embed Seek page does not say this. Test it on your own instance before you rely on it.

Assume that anyone can copy an embed code out of your web page. If the code only allows Seek calls, as the page says, a leaked code lets other people ask your instance questions. The **Embed Key** page has no control to rotate or revoke the code, so plan for it to stay the same.

## FAQ

### Can I put the embed code in my website's JavaScript?

Yes. That is what it is for. The Embed Seek page says the embed code only allows access to the Seek endpoint, so someone who reads it from your page source can ask Seek questions; going by that sentence, it opens nothing else.

### Where do I find my embed code?

Go to **API's & Integration** > **Embed Key** (also reachable from the **Admin Tools** menu). The first box on the **Embed Seek** page holds the code and the second holds your Seek endpoint URL. Each box has a **Copy to clipboard** button.

### How do I send the embed code with a request?

Add a request header named `embedcode` whose value is the code, and send the request to the Seek endpoint URL shown on the same page (`https://<console host>/v1/<your instance ID>/seek`). The request body is the ordinary Seek request.

### Should I use an API key instead?

Only from a server, or for anything beyond Seek. API keys are managed on the [API keys](/configuration/administration/api-keys/) page and open more than Seek. Never put one in browser code. In a browser, use the embed code.

### Does the embed code work for mAIstro agents too?

The Embed Seek page names only the Seek endpoint. Earlier documentation says the embed code also opens the mAIstro endpoint, but the page does not confirm it. Test it on your instance before you depend on it.

### Can I regenerate or revoke an embed code?

Not from the Embed Key page. It shows the code and the endpoint and has no generate, regenerate, revoke or expiry control. If the code only opens Seek, as the page says, what someone can do with a copied code is ask Seek questions against your instance.
