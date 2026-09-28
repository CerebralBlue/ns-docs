---
title: "Conversational context"
description: "NeuralSeek answers a follow-up question in the light of earlier turns of the same conversation, held together by a constant session_id (or by the user when no session_id is sent), and the Platform Preferences settings Context Turns, Context Timeout - Session, Context Timeout - User Only, Context detection and Force carry context decide how much history is carried, for how long, and how a follow-up is recognised."
---

## What is it

Conversational context is what lets NeuralSeek answer a question that does not stand on its own.
"How much is it?" names nothing; only the turns before it say what "it" is. Instead of treating
every question as unrelated, NeuralSeek works out the subject of the conversation and carries it
forward, so the follow-up is answered from the right material in your KnowledgeBase.

To do that, NeuralSeek has to know which conversation a request belongs to. The console names two
kinds of session in the help text of its two context timeouts: a "session_id based user session"
and a "user based session with no session_id". A conversation is held together by a `session_id`
that stays the same from one request to the next or, when there is none, by the user.

The settings that shape this sit in the **Platform Preferences** section of the configuration
dialog on the Neural Config screen, plus one switch in **Intent Matching & Cache Configuration**
that concerns cached answers. This page explains them from the conversation's point of view. The
full reference for each section is on
[Platform Preferences](/configuration/neural-config/platform-preferences/) and
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

## Why it matters

Without carried context, users have to restate the full subject in every message, and nobody
does. Follow-ups that work are what make a customer-facing conversation feel natural instead of
stalling on the second question.

Carrying more history has a cost. The help text of **Context Turns** warns that increasing it
"will reduce the available LLM context available to your documentation, and opens additional risk
of attack from users trying to elicit inappropriate responses". Every earlier turn sent to the LLM
takes room that your own content would otherwise use.

Context also touches what may be served from cache: an answer that was right in one conversation
is not necessarily right as the answer to a follow-up in another. See [Caching](/seek/caching/).

## When to use it

- A customer-facing chat or virtual agent where users ask follow-up questions.
- An integration that already holds the conversation history, such as
  [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
- Testing a multi-turn exchange in the [Seek tab](/seek/overview/), keeping the same user and
  session between questions.

It is the wrong tool for one-shot, self-contained questions: a search box, a batch of independent
queries, or an API call that always states its full subject. There a shared session adds nothing,
and extra turns sent to the LLM only take room away from your documentation. Keep **Context
Turns** low and send a fresh `session_id` for each unrelated request.

## How it works

On the Neural Config screen, open the **Default Config** (Answer Generation) node and expand
**Platform Preferences** in the configuration dialog. The context settings follow the **Timeout**
slider. How to save a change, and the difference between **Save** and **Propose Changes**, is on
[Using this page](/configuration/neural-config/using-this-page/).

![The configuration dialog with Platform Preferences expanded, showing Timeout, Context Turns and Context Timeout - Session](/img/neural-config/platform-preferences-panel.png)

### Keep the same session_id or user_id across turns

Consecutive Seek requests count as one conversation when they identify the same session. The two
timeout help texts show how a session is recognised: **Context Timeout - Session** reads "Timeout
of a session_id based user session.", and **Context Timeout - User Only** reads "Timeout of a user
based session with no session_id." So a request that carries the same `session_id` as the previous
one continues that conversation, and a request with no `session_id` continues the user's
conversation instead. Once the matching timeout has passed, the next question starts fresh.

![The Context Timeout - Session slider, whose help text names session_id](/img/neural-config/platform-preferences--context-timeout-session.png)

<!-- UNCONFIRMED: the Seek request identifies the user with a `user_id` field, either id alone is enough, and the ids need only stay constant for the conversation — from the previous documentation page; the screen names session_id in help text but shows no Seek request body. -->

On the Seek request, send the conversation as `session_id` and the user as `user_id`; either one is
enough to keep a conversation together, and you can send both. The values only need to stay the
same for the length of the conversation; they do not have to match an account in NeuralSeek. The
rest of the request is described on [Seek](/seek/overview/).

### Context Turns

**Context Turns** sets how many earlier turns are sent to the LLM along with the new question. Its
help text reads: "Maximum number of previous context turns to feed to the LLM. Increasing this is
not recommended as it will reduce the available LLM context available to your documentation, and
opens additional risk of attack from users trying to elicit inappropriate responses." The slider
runs from `0` to `50`, with a box beside it where you can type the number; the box shows your
current setting.

![The Context Turns slider, running from 0 to 50, with its value box](/img/neural-config/platform-preferences--context-turns.png)

Because the value is a maximum, `0` sends no earlier turns and every question is answered on its
own text. Raise it only when your users' follow-ups regularly reach back further than the last
exchange, and weigh the two costs the help text names: less room in the prompt for your
documentation, and more surface for users trying to steer the model through earlier messages.
Change it one step at a time and compare the answers to a follow-up before going further.

### Context Timeout - Session and Context Timeout - User Only

These two sliders decide how long a conversation is remembered.

- **Context Timeout - Session** — "Timeout of a session_id based user session." It applies to
  requests that carry a `session_id`. The slider runs from `0` to `999999`.
- **Context Timeout - User Only** — "Timeout of a user based session with no session_id." It
  applies to requests without a `session_id`, where context is kept per user. Same `0` to `999999`
  range.

![The Context Timeout - User Only slider, running from 0 to 999999, with its value box](/img/neural-config/platform-preferences--context-timeout-user-only.png)

:::note[No unit on screen]
Neither context timeout shows a unit in its label or help text, so do not assume seconds, minutes
or milliseconds. The **Timeout** slider just above them does say "milliseconds", but that is the
language-generation timeout, a different setting. What `0` means for a context timeout is not
stated on screen either.
:::

Lengthen a timeout when users come back to a conversation after a pause and expect it to pick up
where it left off. Shorten it when a user's next question, some time later, is usually about
something new, so an old subject does not leak into it. The two are set separately, so a
conversation your application tracks with a `session_id` can be kept for a different length of
time than one tracked by user alone.

### Context detection

**Context detection** decides what works out the subject a follow-up refers to. Its help text reads:
"Use our (fast) model for carrying language context or use an LLM-based mAIstro flow for custom PoS
tagging." (PoS tagging is part-of-speech tagging: finding the nouns and subjects in a question.) It
has two dropdowns, **Detection Method** and **mAIstro flow**.

![Context detection, with Detection Method set to Model Only beside a greyed-out mAIstro flow dropdown](/img/neural-config/platform-preferences--context-detection.png)

**Detection Method** chooses the mechanism. The options have no help text of their own; what each
does below follows from its name and the help text of **Context detection**.

<!-- UNCONFIRMED: that `Model + mAIstro fallback` runs the model first and hands over to the agent, and when it hands over — inferred from the option names; the setting was not changed and the options have no help text of their own. That mAIstro flow becomes selectable with the other two methods is also inference from the greyed-out dropdown. -->

| Option                     | What it does                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `Model Only`               | NeuralSeek's own fast model finds the subject and carries it forward.                        |
| `Model + mAIstro fallback` | The fast model runs first; the agent chosen in **mAIstro flow** is the fallback.             |
| `mAIstro Only`             | The agent chosen in **mAIstro flow** does the part-of-speech tagging instead of the model.   |

![The Detection Method dropdown opened while set to Model Only, with mAIstro flow greyed out beside it](/img/neural-config/platform-preferences--options-detection-method.png)

**mAIstro flow** names that agent. Its list starts with `Disabled`, followed by the agents saved in
your mAIstro, for example an agent named `ex_Context_Grammar`. With **Detection Method** on
`Model Only`, the screen shows **mAIstro flow** greyed out. Whether it becomes selectable once you
pick one of the other two methods is not shown on screen.

Stay on `Model Only` while follow-ups resolve correctly; it is the fast option. Move to a mAIstro
option when the built-in model keeps missing the subject in your users' phrasing: an agent you
build then does the tagging, at the cost of the extra time an LLM-based flow takes.

### Force carry context

**Force carry context** covers questions that name no subject at all. Its help text reads: "If no
subject / nouns are found in a question assume the question is a follow on to the previous
question".

![The Force carry context dropdown with its help text](/img/neural-config/platform-preferences--force-carry-context.png)

The dropdown has two options, `True` and `False`:

- `True` — a question with no subject or nouns, such as "How much is it?", is treated as a
  follow-on to the previous question.
- `False` — a question is not treated as a follow-on just because it names no subject or nouns.

![The Force carry context option list open: True, False](/img/neural-config/platform-preferences--options-force-carry-context.png)

Choose `True` for a chat where short follow-ups are the norm. Leave it at `False` when users often
open a new topic with a vague question, so that question is not answered about the previous
subject.

### Require Cache to Follow Context?

**Require Cache to Follow Context?** sits under the **Normal answer cache** slider in the **Intent
Matching & Cache Configuration** section of the same dialog. It has no help text of its own; the
screen shows it set to `Yes`. The screen does not say whether it applies only to the Normal answer
cache it sits under or to other caches as well.

![The Normal answer cache section, with Require Cache to Follow Context? set to Yes beneath the slider](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

<!-- UNCONFIRMED: that with `Yes` a cached answer is reused only when the conversation context matches — inferred from the label; the control has no help text, its option list was not captured, and no test exercised it. -->

With `Yes`, a cached answer is served only when it fits the conversation so far, so a follow-up is
not answered with a cached reply given in a different conversation. How the caches work is on
[Caching](/seek/caching/), and the whole section is documented on
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

### Passing the previous turn yourself

When the calling system already holds the conversation history, it can hand the previous exchange
to NeuralSeek instead of relying on the session alone. Inside mAIstro the history is available to
agents: the NTL reference gives the `seekIn` node a `lastTurn` parameter, "The last turn array",
and lists `seekIn.lastTurn` as "The chat history as an array of objects." It gives no JSON shape
for the objects.

:::caution[Not yet verified]
The NTL reference documents `lastTurn` only as `seekIn.lastTurn`. The Seek request field below comes
from earlier NeuralSeek documentation and has not been re-checked against the current product.
:::

<!-- UNCONFIRMED: an `options.lastTurn` field on the Seek request with the `[{input, response}]` shape and the example below, and watsonx Assistant passing its `Session History` variable to it through the NeuralSeek extension — from the previous documentation page; the NTL reference documents `lastTurn` only as `seekIn.lastTurn`, and no Seek request body or watsonx Assistant screen was checked. -->

On the Seek request, the previous exchange goes in `options.lastTurn`, with the previous question
as `input` and the answer that came back as `response`. On the first request of a conversation
both are empty strings. On the next one:

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

<!-- UNCONFIRMED (same fact as the marker above this section's example): watsonx Assistant's `Session History` variable passed to `options.lastTurn` — previous documentation page. -->

watsonx Assistant keeps its own `Session History` variable, which its NeuralSeek extension can
pass in this field; the setup is on
[watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

## FAQ

### Why does a follow-up like "how much is it?" lose track of the subject?

Usually one of three things. The requests do not share the same `session_id` (or user), so
NeuralSeek sees two separate conversations. **Context Turns** is `0`, so no earlier turn reaches
the LLM. Or the matching context timeout has passed. If the question has no subject at all,
setting **Force carry context** to `True` makes NeuralSeek treat it as a follow-on to the previous
question.

### How many earlier turns does NeuralSeek use?

As many as **Context Turns** allows: it is the maximum number of previous turns fed to the LLM, set
between `0` and `50`. Its help text advises against raising it, because more turns leave less LLM
context for your documentation and open more risk of users trying to elicit inappropriate
responses.

### What unit are the context timeouts in?

The screen does not say. **Context Timeout - Session** and **Context Timeout - User Only** both run
from `0` to `999999` with no unit shown. The **Timeout** slider above them is in milliseconds, but
it is a different setting.

### Can an LLM decide what a follow-up refers to instead of the built-in model?

Yes. Set **Detection Method** to `mAIstro Only`, or to `Model + mAIstro fallback` to keep the
fast model first, and pick the agent in **mAIstro flow**. The list offers `Disabled` and the agents
saved in your mAIstro.

### Can I send the previous turn with the request instead of relying on the session?

<!-- UNCONFIRMED (same fact as the marker under "Passing the previous turn yourself"): `options.lastTurn` on the Seek request — previous documentation page. -->

Not confirmed for the Seek request. Earlier documentation described an `options.lastTurn` field,
shown under [Passing the previous turn yourself](#passing-the-previous-turn-yourself) with that
caveat. The NTL reference documents `lastTurn` as `seekIn.lastTurn`, the chat history a mAIstro
agent can read.
