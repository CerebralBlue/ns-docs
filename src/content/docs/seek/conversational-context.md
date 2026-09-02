---
title: 'Conversational context'
description: 'How NeuralSeek carries a conversation forward — session IDs on the request, or an explicit lastTurn payload — and how to wire either one up.'
---

## What is it

NeuralSeek keeps track of a conversation rather than treating every question as unrelated. When
a conversation starts, a session token is generated; NLP models extract the meaning, intent and
main subject of each question and answer, and feed those into later turns so the right material
is pulled from the KnowledgeBase.

That is what makes a question like "how does it work?" answerable — on its own it names nothing,
and only the previous turns say what "it" is. The same models also let NeuralSeek filter
corporate knowledge topically by date, so answers stay inside the time period the question is
about.

## Why it matters

Without context, users have to restate the full subject in every message, which nobody does.
Carrying context is what lets a conversation run naturally, and it is directly visible in
containment rates on customer-facing surfaces — conversations that resolve instead of escalating.

It also interacts with caching. Whether an answer can be cached, and whether a cached answer is
the right one to serve, depends on what came before it in the conversation. See
[Caching](/seek/caching/).

## When to use it

- Any customer-facing chat where a user asks follow-up questions.
- Testing in the [Seek tab](/seek/overview/) under a fixed User ID and Session ID.
- Integrations where you already have conversation history and want NeuralSeek to use it.

## How it works

There are two ways to give NeuralSeek the context, and they are not exclusive.

### Session IDs on the request

Pass an ID that uniquely identifies the user's session — either or both of the `user_id` and
`session_id` properties on the `/seek` request. NeuralSeek keeps the conversation state against
that ID.

The IDs do not have to be stable for a real person over time. They only have to stay constant
for the span of the conversation you want to keep context for.

### An explicit `lastTurn` payload

`options.lastTurn` carries the previous exchange with the request, so the model can see the
progression directly. On the first request there is nothing to reference, so the structure is
empty:

```json
{
	"question": "How can NeuralSeek help businesses in different industries with Gen AI?",
	"options": {
		"lastTurn": [
			{
				"input": "",
				"response": ""
			}
		]
	}
}
```

Keep the `answer` you get back. On the next request, put the previous question in `input` and
that answer in `response`:

```json
{
	"question": "What about a pharmaceutical business?",
	"options": {
		"lastTurn": [
			{
				"input": "How can NeuralSeek help businesses in different industries with Gen AI?",
				"response": "NeuralSeek can help your business harness the power of generative AI…"
			}
		]
	}
}
```

The follow-up now resolves against the earlier exchange rather than being read as a standalone
question. The request and response shapes are in the **Integrate** tab, under the **API** menu
item.

### Passing context from watsonx Assistant

watsonx Assistant has its own `Session History` variable, which maps onto `options.lastTurn`.

1. Make sure a NeuralSeek Extension is set up in watsonx Assistant.
2. Select the extension, choose the **Seek an answer from NeuralSeek** operation, and set the
   `question` parameter to the `query_text` session variable.
3. Open the **Optional parameters** list.
4. Find `options.lastTurn` and set it to `Session History` from the **Assistant Variables**
   dropdown.
5. Select **Apply**, then save the action.

![Screenshot needed — the Optional parameters list with options.lastTurn set to Session History](/img/_placeholder.svg)

<!-- SCREENSHOT: watsonx Assistant, the NeuralSeek Extension's Optional parameters list expanded,
     with options.lastTurn set to Session History from the Assistant Variables dropdown.
     Why: the parameter is hidden behind an "Optional parameters" disclosure and there are many
     entries in the list — the one step in this flow prose cannot make findable. -->

Test it in the chatbot preview: ask a question, then ask a follow-up that depends on it. The
second answer should resolve against the first.

## FAQ

### Do I need both `user_id` and `session_id`?

No. Either one is enough — they just have to identify the session consistently. Send both if you
have both.

### What is the difference between session IDs and `lastTurn`?

Session IDs let NeuralSeek hold the conversation state for you. `lastTurn` means you hold it and
hand the previous exchange over on each request. Use `lastTurn` when the calling system already
owns the conversation history, as watsonx Assistant does.

### Do the IDs have to match a real user account?

No. They only need to be constant for the duration of the conversation you are keeping context
for. They do not have to be stable for that person across sessions.
