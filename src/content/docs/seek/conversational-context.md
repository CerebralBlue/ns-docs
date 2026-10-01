---
title: "Conversational context"
description: "NeuralSeek answers a follow-up question in the light of earlier turns of the same conversation, and the Platform Preferences settings Context Turns, the two context timeouts, Context detection and Force carry context decide how much history the LLM sees, how long it is kept and how a follow-up is recognised."
---

Conversational context lets NeuralSeek answer a question that does not stand on its own. "How much
is it?" names nothing; only the turns before it say what "it" is. NeuralSeek keeps track of the
conversation a request belongs to, works out the subject of a follow-up, and sends earlier turns to
the LLM with it, so the answer comes from the right material in your KnowledgeBase. This page is for
admins tuning a chat or virtual-agent deployment and for developers whose application sends
consecutive Seek requests.

Every setting on this page belongs to the
[Platform Preferences](/configuration/neural-config/platform-preferences/) section of Neural Config,
where each one is documented as a reference. A change applies once you save the configuration; how
to save, and how **Save** differs from **Propose Changes**, is on
[Using this page](/configuration/neural-config/using-this-page/).

## How conversational context works

To reach the settings, open **Neural Config**, select the **Default Config** (Answer Generation)
node, and expand **Platform Preferences** in the **Edit Configuration** dialog. The context settings
follow the **Timeout** slider.

![Platform Preferences expanded in the Configuration: Default Config dialog: the Timeout slider, then Context Turns and Context Timeout - Session with their help text and sliders, and the Context Timeout - User Only heading with its help text](/img/neural-config/platform-preferences.png)

### How a conversation is identified

NeuralSeek keeps context per conversation, and it recognises a conversation in one of two ways. The
help texts of the two context timeouts name them: **Context Timeout - Session** is the "Timeout of a
session_id based user session.", and **Context Timeout - User Only** is the "Timeout of a user based
session with no session_id." A request that carries the same `session_id` as the one before it
continues that conversation. A request without a `session_id` continues the conversation of the
user who sent it.

<!-- UNCONFIRMED: the Seek request identifies the user with a `user_id` field, either id is enough to keep a conversation together, and the ids only need to stay constant for the conversation (they need not match an account) — from the previous documentation page; no Seek request body was captured. -->

On the Seek request, send the conversation as `session_id` and the user as `user_id`. Either one
keeps a conversation together, and you can send both. The values only have to stay the same for the
length of the conversation; they do not have to match an account in NeuralSeek. To try a multi-turn
exchange before you integrate, keep the same user and session between questions in the
[Seek tab](/seek/overview/).

### How much history the LLM sees

**Context Turns** sets the maximum number of earlier turns sent to the LLM along with a follow-up.
The slider runs from `0` to `50`, and you can type the number in the box beside it. At `0`, no
earlier turn is sent to the LLM.

Raise it only when your users' follow-ups regularly reach back further than the last exchange. The
help text of the setting names both costs: "Increasing this is not recommended as it will reduce the
available LLM context available to your documentation, and opens additional risk of attack from
users trying to elicit inappropriate responses." Each extra turn takes room in the prompt that your
documentation would otherwise use, and gives a user more earlier messages through which to steer the
model; see [Prompt injection](/governance/guardrails/prompt-injection/) for that risk. Change it one
step at a time and compare the answer to the same follow-up before going further.

### How long a conversation is remembered

Two sliders, each running from `0` to `999999`, set how long a conversation is kept before the next
question starts without its earlier turns:

- **Context Timeout - Session** applies to conversations identified by a `session_id`.
- **Context Timeout - User Only** applies to conversations identified by the user alone, when the
  request carries no `session_id`.

Lengthen a timeout when users come back to a conversation after a pause and expect it to pick up
where it left off. Shorten it when a user's next question, some time later, is usually about
something new, so an old subject does not leak into the answer. Because the two are set separately,
a conversation your application tracks with a `session_id` can be kept for a different length of
time than one tracked by user alone. The **Timeout** slider above them is the language-generation
timeout, a different setting.

### How a follow-up is recognised

**Context detection** decides what works out the subject a follow-up refers to. Its help text reads:
"Use our (fast) model for carrying language context or use an LLM-based mAIstro flow for custom PoS
tagging." PoS tagging is part-of-speech tagging: finding the nouns and subjects in a question. The
group has two dropdowns, **Detection Method** and **mAIstro flow**.

![Context detection, with Detection Method set to Model Only and the mAIstro flow dropdown greyed out beside it](/img/neural-config/platform-preferences--context-detection.png)

**Detection Method** chooses the mechanism:

<!-- UNCONFIRMED: that Model + mAIstro fallback runs the built-in model first and hands over to the mAIstro agent when the model finds no subject — inferred from the option name and the Context detection help text; the setting was not changed and no test exercised it. -->

| Option                     | What it does                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `Model Only`               | NeuralSeek's own fast model finds the subject of the question and carries it forward.            |
| `Model + mAIstro fallback` | The fast model runs first; the agent chosen in **mAIstro flow** takes over when the model fails. |
| `mAIstro Only`             | The agent chosen in **mAIstro flow** does the part-of-speech tagging instead of the model.       |

**mAIstro flow** names the agent that does the tagging for the two mAIstro options. Its list offers
`Disabled` and your [mAIstro](/maistro/overview/) agents, such as one built for context grammar. While **Detection Method** is
`Model Only`, **mAIstro flow** is greyed out.

Stay on `Model Only` while follow-ups resolve correctly; it is the fast option. Move to a mAIstro
option when the built-in model keeps missing the subject in your users' phrasing. An agent you build
then does the tagging, at the cost of the extra time an LLM-based flow takes.

**Force carry context** covers questions that name no subject at all. Its help text reads: "If no
subject / nouns are found in a question assume the question is a follow on to the previous
question". It offers `True` and `False`.

![The Force carry context dropdown, set to False, with its help text](/img/neural-config/platform-preferences--force-carry-context.png)

Set it to `True` when your users ask short follow-ups such as "and the price?" or "how long does it
take?" that only make sense against the previous question. Leave it at `False` when users often
change topic with short, subject-less questions, because each of those would then be read against
the question before it.

### Context and cached answers

An answer that was right in one conversation is not necessarily the right answer to a follow-up in
another. The **Require Cache to Follow Context?** setting, in the
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/) section of the same
dialog, governs how cached answers relate to the conversation context. How the caches work is on
[Caching](/seek/caching/).

### Passing the previous turn yourself

<!-- UNCONFIRMED: an `options.lastTurn` field on the Seek request, an array of `{input, response}` objects holding the previous question and answer (empty strings on the first turn), and watsonx Assistant passing its `Session History` variable to it through the NeuralSeek extension — from the previous documentation page; the NTL reference documents `lastTurn` only on `seekIn`, and no Seek request body was captured. -->

When the calling system already holds the conversation history, it can hand the previous exchange to
NeuralSeek instead of relying on the session alone. On the Seek request, the previous exchange goes
in `options.lastTurn`: an array of objects, each with the previous question as `input` and the
answer that came back as `response`. On the first request of a conversation both are empty strings.
watsonx Assistant keeps its own `Session History` variable, which its NeuralSeek extension can pass
in this field; the setup is on [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

On the agent side, a mAIstro agent that serves as a [Virtual KB](/seek/virtual-kb/) receives the
conversation through its `seekIn` node: the NTL reference lists `seekIn.lastTurn` as "The chat
history as an array of objects."

## When to use it

- A customer-facing chat or virtual agent where users ask follow-up questions. Keep one
  `session_id` per conversation and set **Context Turns** to the smallest number that resolves
  your users' follow-ups.
- An integration that already holds the conversation history, such as
  [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/), which can hand over the
  previous turn itself.
- Testing a multi-turn exchange in the [Seek tab](/seek/overview/) before you integrate.

It is the wrong tool for one-shot, self-contained questions: a search box, a batch of independent
queries, or an API call that always states its full subject. There a shared session adds nothing,
and earlier turns sent to the LLM only take room away from your documentation. Send a fresh
`session_id` with each unrelated request so no earlier subject carries over.

## FAQ

### Why does a follow-up ignore what I asked before?

Usually one of three things. The requests do not share the same `session_id` (or user), so
NeuralSeek treats them as separate conversations. **Context Turns** is `0`, so no earlier turn
reaches the LLM. Or the matching context timeout has passed, and the follow-up started a new
conversation.

### Should I raise Context Turns to get better follow-ups?

Only as far as your users' follow-ups need. The help text of **Context Turns** advises against
raising it: more turns leave less of the LLM context for your documentation and open more risk of
users trying to elicit inappropriate responses.

### What happens if I send no session_id?

Context is kept per user instead, and **Context Timeout - User Only** decides how long it lasts.
Requests that carry a `session_id` use **Context Timeout - Session**.

### A user types "how much is it?" and gets a generic answer. What helps?

Set **Force carry context** to `True`, so a question with no subject or nouns is treated as a
follow-on to the previous question. If the subject is in the question but the built-in model misses
it, try a mAIstro option in **Detection Method**.

## Related

- [Platform Preferences](/configuration/neural-config/platform-preferences/)
- [Caching](/seek/caching/)
- [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/)
- [Seek overview](/seek/overview/)
- [mAIstro overview](/maistro/overview/)
- [Virtual KB](/seek/virtual-kb/)
- [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/)
