---
title: "watsonx Assistant streaming"
description: "Stream a mAIstro agent's answer into an IBM watsonx Assistant chat by calling it through the NeuralSeek custom extension, with streaming allowed on the agent's LLM node and switched on in watsonx Assistant."
---

## What is it

watsonx Assistant streaming shows a mAIstro agent's answer in an IBM watsonx Assistant chat while the agent is still writing it, instead of waiting for the whole reply. The call goes through the NeuralSeek custom extension that you add to watsonx Assistant from the **Watson Custom OpenAPI File**, and the extension step calls your mAIstro agent in streaming mode.

Nothing on the NeuralSeek **Watson Custom Extension** screen is specific to streaming: the screen gives you the extension itself. The streaming switches are set in two other places — on the mAIstro agent (its LLM node) and in watsonx Assistant (the extension step and the Preview settings). This page walks through all three.

## Why it matters

A streamed reply appears word by word as the agent produces it. Long answers and multi-step agents feel faster, because the user reads the first sentence while the rest is still being generated rather than looking at a waiting indicator. NTL has a dedicated node for this: its reference describes `stream` as "Send a string to the client when response streaming is enabled".

## When to use it

- Your watsonx Assistant calls a mAIstro agent whose answers are long enough that the wait is noticeable.
- The agent chains several steps and you want the user to see the final answer forming while it runs.

It is the wrong tool when the assistant only needs a short answer or a single field back — a structured value that an action step parses must arrive whole, so call the agent without streaming. For the basic, non-streaming connection, see [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

## How it works

Three things must all be in place: the NeuralSeek custom extension in watsonx Assistant, an agent in mAIstro that streams its answer, and an action step in watsonx Assistant that calls the extension's streaming operation with streaming turned on.

### Build the custom extension first

Streaming runs through the same NeuralSeek custom extension as the standard integration, so that extension must exist before anything else. In NeuralSeek, open **API's & Integration** → **Watson Custom Extension**. The **Custom Extension** screen lists the eight steps to build the extension in watsonx Assistant; step 3 reads "Upload your NeuralSeek Watson Custom OpenAPI file. Click "Next" then "Finish"." Download that file with the **Watson Custom OpenAPI File** button at the bottom of the screen. The **Full OpenAPI Spec File** button next to it downloads the full OpenAPI specification instead; the steps on screen name the Watson Custom file, so use that one for the extension.

![The Custom Extension screen under API's & Integration, with the eight setup steps and the Full OpenAPI Spec File and Watson Custom OpenAPI File buttons at the bottom](/img/admin-tools/watson-custom-extension.png)

The rest of the setup — authenticating with **API key auth** and starting from the NeuralSeek Starter Kit action — is explained step by step on [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

<!-- UNCONFIRMED: the Watson Custom OpenAPI File contains an operation named "Stream mAIstro NTL or an agent", backed by a streaming mAIstro endpoint (/maistro_stream, "in our Integrate tab") — old page; the downloaded file was not opened and no captured Integrate screen shows the endpoint -->

The extension's operations come from this file. The streaming operation is **Stream mAIstro NTL or an agent**; it calls a mAIstro agent and returns its output as it is generated.

### Turn streaming on in the mAIstro agent

The agent decides which of its LLM calls stream. The NTL reference documents a `stream` parameter on the `LLM` node, with one named value: `disable_streaming` turns streaming output off for that call. The reference recommends `stream: "disable_streaming"` "for non-streaming intermediate steps". In practice: an agent that makes several LLM calls should stream only the one that writes the answer the user reads, and set `disable_streaming` on the others, so the chat does not show intermediate text such as a rewritten query or a classification.

The `stream` node sends a string to the client while response streaming is enabled, for text that does not come from an LLM call:

```text
{{ stream }}
```

<!-- UNCONFIRMED: a streaming option at the bottom right of the mAIstro editor must be switched on, and each LLM node that should stream is set to "enable_streaming" — old page; the mAIstro editor is not in this capture, and the NTL reference names only "disable_streaming" -->

In the mAIstro editor, switch on the streaming option at the bottom right of the editor, then check each LLM node: leave streaming on for the final LLM call and turn it off on intermediate ones.

![Screenshot needed — mAIstro editor with the streaming option and an LLM node's stream setting](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/editor-streaming.png — mAIstro editor with an agent open: the streaming option at the bottom right of the editor, and an LLM node's settings panel showing its stream parameter. Why: the old guide's screenshot is stale and the option's location is the step readers miss. -->

For the full `LLM` node parameters, see [Generate Data](/maistro/ntl/generate-data/).

### Configure the extension step in watsonx Assistant

In watsonx Assistant, point an action step at the streaming operation and tell it which agent to run.

<!-- UNCONFIRMED: every step and label in this section (Edit Extension, Operation, agent, timeout and the watsonx Assistant bug it works around, Stream response = chunk, Apply, Save, the Preview tab streaming toggle) — old page; watsonx Assistant is an external product and was not captured -->

1. On the **Actions** tab, open the action, select the step that should call the agent and click **Edit Extension**.
2. Choose the NeuralSeek extension you built, and set **Operation** to **Stream mAIstro NTL or an agent**. <!-- UNCONFIRMED -->
3. Set the `agent` parameter to the name of the mAIstro agent to call.
4. Set an optional parameter as well, for example `timeout` with a suitable value. A known watsonx Assistant issue stops streaming from behaving correctly when no optional parameter is set.
5. Pass the inputs your agent expects as parameters, as variables or expressions — for example, a `question` parameter set to the session variable that holds the user's message.
6. Scroll to the bottom and set **Stream response** to `chunk`. <!-- UNCONFIRMED -->
7. Click **Apply**, then **Save** at the top left of the window.
8. On the **Preview** tab, turn the streaming toggle on, and ask a question to see the answer appear as it is written. <!-- UNCONFIRMED -->

![Screenshot needed — watsonx Assistant Edit Extension panel set to the streaming operation](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/integrations/watsonx-assistant-streaming/edit-extension.png — watsonx Assistant, Actions tab, Edit Extension panel: Operation = Stream mAIstro NTL or an agent, the agent and timeout parameters, and Stream response = chunk. Why: the stream setting is at the bottom of a long external panel. -->

## FAQ

<!-- UNCONFIRMED: the Preview-tab toggle, the timeout workaround and the Stream response = chunk setting repeated below — old page, watsonx Assistant not captured -->

**Do I need the custom extension to stream?**
Yes. Streaming runs through the NeuralSeek custom extension in watsonx Assistant, built from the **Watson Custom OpenAPI File** on the **Watson Custom Extension** screen. Build it first by following [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

**Where do I turn streaming on?**
In three places: in the mAIstro agent (the editor's streaming option and the LLM node that writes the answer), in the watsonx Assistant action step that calls the streaming operation with **Stream response** set to `chunk`, and in watsonx Assistant's streaming toggle on the **Preview** tab. If any one is off, the answer arrives all at once. <!-- UNCONFIRMED -->

**Which LLM node should stream?**
The one that writes the answer the user reads — usually the final LLM call. The NTL reference recommends `stream: "disable_streaming"` on intermediate steps, so text the user should not see never reaches the chat.

**Why does my assistant still answer all at once?**
Check the three switches above. Then check that the extension step has an optional parameter such as `timeout` set: watsonx Assistant does not stream correctly without one.

**Can I stream text that does not come from an LLM call?**
Yes. The NTL `stream` node (`{{ stream }}`) sends a string to the client when response streaming is enabled, for example a status line before a long step.
