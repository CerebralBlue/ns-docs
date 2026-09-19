---
title: "Conversational context"
description: "How NeuralSeek carries a conversation forward — a constant user_id or session_id on the seek request, or an explicit options.lastTurn payload — and the Platform Preferences settings that shape it."
---

## What is it

Conversational context is what lets NeuralSeek answer a question that does not stand on its own.
"How does it work?" names nothing; only the turns before it say what "it" is. Rather than treating
every question as unrelated, NeuralSeek tracks the subject of the conversation and brings it
forward, so the right material is pulled from the KnowledgeBase for the follow-up.

<!-- UNCONFIRMED: the models that carry context also let NeuralSeek filter corporate knowledge topically by date — from the previous documentation page; the console shows a Context detection model and a Document Date Penalty slider, which is consistent, but neither confirms this wording. -->

The models that do this are also described as filtering corporate knowledge topically by date, so
an answer stays inside the time period the question is about.

There are two ways the context reaches NeuralSeek, and they are not exclusive:

- **You identify the session** — send a `user_id` and/or a `session_id` on the seek request, and
  NeuralSeek holds the conversation state against that id.
- **You carry the history yourself** — send the previous exchange in `options.lastTurn` on the
  request.

## Why it matters

Without carried context, a user has to restate the full subject in every message, which nobody
does. Follow-ups working is what makes a customer-facing conversation run naturally, and it shows
up directly in containment — conversations that resolve instead of escalating.

It also decides what may be served from cache. Whether a cached answer is still the right answer
depends on what came before it in the conversation; see [Caching](/seek/caching/) and the
**Require Cache to Follow Context?** setting on
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

Carrying more history is not free, though. NeuralSeek's own warning on the **Context Turns**
setting is that raising it "will reduce the available LLM context available to your documentation,
and opens additional risk of attack from users trying to elicit inappropriate responses". More
turns means less room for your own content in the prompt.

## When to use it

- Any customer-facing chat where users ask follow-up questions.
- Integrations that already own the conversation history — watsonx Assistant is the worked example
  below.
- Testing a multi-turn flow in the [Seek tab](/seek/overview/) under a fixed user and session id.

It is not needed for one-shot, self-contained questions — a search box, a batch of independent
queries, an API call that supplies its whole subject. There, a session id buys nothing and the
extra turns fed to the LLM only take room away from your documentation.

## How it works

### What carries the context

NeuralSeek needs an id that uniquely identifies the user's session. That can be either or both of
the `user_id` and `session_id` properties on the seek request.

The id does **not** have to be stable for a real person over time. It only has to stay constant
for the span of the conversation you want to keep context for — a per-conversation id is enough,
and is usually the safer choice.

The two are treated differently, and the console says so: **Context Timeout - Session** is the
"Timeout of a `session_id` based user session", while **Context Timeout - User Only** is the
"Timeout of a user based session with no `session_id`". A request that carries only a user id gets
the second, much shorter window.

### The settings that shape it

All of these live in the console at **Default Config** → **Edit Configuration** →
**Platform Preferences**, and are documented on
[Platform Preferences](/configuration/neural-config/platform-preferences/). The values below are
the ones on the instance captured for this page, not product-wide defaults.

![Platform Preferences in the Edit Configuration dialog, showing Context Turns, Context Timeout - Session and Context Timeout - User Only](/img/neural-config/platform-preferences.png)

| Setting                         | What it controls                                                                                                     | Range          | Captured value                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------- |
| **Context Turns**               | Maximum number of previous context turns fed to the LLM                                                              | `0` – `50`     | `1`                                 |
| **Context Timeout - Session**   | Timeout of a `session_id` based user session                                                                         | `0` – `999999` | `360000`                            |
| **Context Timeout - User Only** | Timeout of a user based session with no `session_id`                                                                 | `0` – `999999` | `1800`                              |
| **Context detection**           | Whether language context is carried by NeuralSeek's fast model or by an LLM-based mAIstro flow for custom PoS tagging | two dropdowns  | `Model Only` / `ex_Context_Grammar` |
| **Force carry context**         | If no subject or nouns are found in a question, assume it is a follow-on to the previous question                    | dropdown       | `False`                             |

:::note
The two timeout sliders carry no unit on screen, so do not assume seconds or milliseconds from the
numbers above — check the value in your own console before tuning it.
:::

**Context detection** is two dropdowns rather than one: **Detection Method** chooses how context is
carried (`Model Only` on the captured instance), and **mAIstro flow** names the flow used when the
method is an LLM-based one (`ex_Context_Grammar` there).

**Context Turns** is the one worth thinking about before you change it: `1` means the LLM sees the
single previous turn. Raising it is explicitly discouraged for the reason quoted under
[Why it matters](#why-it-matters).

### Passing context through the API

`options.lastTurn` carries the previous exchange with the request, so the model sees the
progression directly. Use it when the calling system already holds the conversation history.

On the first request there is nothing to reference, so the structure is empty:

<!-- UNCONFIRMED: the two lastTurn request shapes below are from the previous documentation page; they were not re-verified against the current /seek API for this page. -->

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

Keep the `answer` that comes back. On the next request, put the previous question in `input` and
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

The follow-up now resolves against the earlier exchange instead of being read as a standalone
question. The full request and response shapes are in the console's **Integrate** tab, under the
**API** menu item.

### Passing context from watsonx Assistant

watsonx Assistant keeps its own `Session History` variable, which maps straight onto
`options.lastTurn`.

1. Make sure a NeuralSeek Extension is already set up — see
   [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
2. Select the extension, choose the **Seek an answer from NeuralSeek** operation, and set the
   `question` parameter to the `query_text` session variable.
3. Open the **Optional parameters** list.
4. Find `options.lastTurn` and set it to `Session History` from the **Assistant Variables**
   dropdown.
5. Select **Apply**, then save the action.

![Screenshot needed — the Optional parameters list with options.lastTurn set to Session History](/img/_placeholder.svg)

<!-- SCREENSHOT: watsonx Assistant, the NeuralSeek Extension's Optional parameters list expanded,
     with options.lastTurn set to Session History from the Assistant Variables dropdown.
     Why: the parameter is hidden behind an "Optional parameters" disclosure among many entries —
     the one step in this flow that prose cannot make findable. Third-party console, so it has to
     be captured by hand. -->

Test it in the chatbot preview: ask a question, then ask a follow-up that depends on it. The second
answer should resolve against the first.

## FAQ

### What do I have to send for follow-up questions to work?

A `user_id` and/or a `session_id` that stays constant for the conversation. If you would rather
carry the history yourself, send the previous exchange in `options.lastTurn` instead.

### How many previous turns does the LLM see?

As many as **Context Turns** allows, in **Platform Preferences**. It ranges from `0` to `50`, and
was set to `1` on the instance captured for this page.

### Should I raise Context Turns to make the bot smarter?

Usually not. The product's own warning is that increasing it reduces the LLM context left for your
documentation and opens additional risk of attack from users trying to elicit inappropriate
responses. Raise it one step at a time and check answer quality rather than jumping to the maximum.

### How long does context last?

There are two separate timeouts: **Context Timeout - Session** for a `session_id` based session,
and **Context Timeout - User Only** for a request with a user id and no session id. The second is
much shorter — `360000` against `1800` on the captured instance. Neither slider shows its unit, so
read the values in your own console.

### The user asked "how does it work?" with no subject — will NeuralSeek follow on?

That is what **Force carry context** decides: "If no subject / nouns are found in a question assume
the question is a follow on to the previous question." It was `False` on the captured instance, so
this behaviour is not on unless you turn it on.

### Do I need both `user_id` and `session_id`?

No. Either is enough to identify the session, but they are not equivalent — a request with only a
user id falls under the shorter **Context Timeout - User Only** window. Send both if you have both.
