---
title: "Conversational context"
description: "NeuralSeek resolves a follow-up question against the earlier turns of a conversation when the seek request carries a constant session_id or user_id; the Platform Preferences settings — Context Turns, Context Timeout - Session, Context Timeout - User Only, Context detection and Force carry context — decide how much is carried and for how long."
---

## What is it

Conversational context is what lets NeuralSeek answer a question that does not stand on its own.
"How does it work?" names nothing; only the turns before it say what "it" is. Rather than treating
every question as unrelated, NeuralSeek tracks the subject of the conversation and brings it
forward, so the follow-up is answered from the right material in the KnowledgeBase.

For that to happen, NeuralSeek has to know which conversation a request belongs to. The console
distinguishes two kinds of session, in the help text of the two context timeouts: a "session_id
based user session" and a "user based session with no session_id". In practice that means the
seek request carries a `session_id`, a `user_id`, or both, and the value stays the same for the
span of the conversation.

Everything that shapes the behaviour lives in one accordion of the Edit Configuration dialog,
**Platform Preferences**, plus one switch in **Intent Matching & Cache Configuration** that decides
whether a cached answer has to respect the conversation too. This page explains those settings
from the conversation's point of view; the settings themselves are documented on
[Platform Preferences](/configuration/neural-config/platform-preferences/) and
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

## Why it matters

Without carried context, a user has to restate the full subject in every message, which nobody
does. Follow-ups working is what makes a customer-facing conversation run naturally instead of
stalling on the second question.

Carrying more history is not free, though. NeuralSeek's own warning on the **Context Turns**
setting is that increasing it "will reduce the available LLM context available to your
documentation, and opens additional risk of attack from users trying to elicit inappropriate
responses". More turns means less room for your own content in the prompt, so the defaults lean
towards carrying little.

Context also decides what may be served from cache. A cached answer that was right in one
conversation is not necessarily right as the answer to a follow-up in another; the
**Require Cache to Follow Context?** switch is where that is settled — see [Caching](/seek/caching/).

## When to use it

- Any customer-facing chat where users ask follow-up questions.
- Integrations that already own the conversation history — watsonx Assistant is the usual case,
  see [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
- Testing a multi-turn flow in the [Seek tab](/seek/overview/) under a fixed user and session id.

It is not needed for one-shot, self-contained questions — a search box, a batch of independent
queries, an API call that supplies its whole subject. There, a session id buys nothing and any
extra turns fed to the LLM only take room away from your documentation.

## How it works

### Where the context settings live

Open **Default Config / Answer Generation** on the Neural Config screen, then expand
**Platform Preferences** in the **Edit Configuration** dialog. The context settings follow the
**Timeout** slider, in this order:

- **Context Turns**
- **Context Timeout - Session**
- **Context Timeout - User Only**
- **Context detection** (two dropdowns, **Detection Method** and **mAIstro flow**)
- **Force carry context**

The one related switch that is not here, **Require Cache to Follow Context?**, sits in the
**Intent Matching & Cache Configuration** accordion of the same dialog.

Every control below is owned by
[Platform Preferences](/configuration/neural-config/platform-preferences/); saving a change, and
the difference between **Save** and **Propose Changes**, is covered on
[Using this page](/configuration/neural-config/using-this-page/). The values quoted are the ones
captured on the playground instance, not product defaults.

![The Edit Configuration dialog with Platform Preferences expanded, showing Timeout, Context Turns and Context Timeout - Session](/img/neural-config/platform-preferences.png)

### Context Turns

**Context Turns** is how many earlier turns the LLM actually sees. The help text reads: "Maximum
number of previous context turns to feed to the LLM. Increasing this is not recommended as it
will reduce the available LLM context available to your documentation, and opens additional risk
of attack from users trying to elicit inappropriate responses." The slider runs from `0` to `50`;
the playground has it at `1`, so the LLM sees the single previous exchange.

![The Context Turns slider, 0 to 50, set to 1](/img/neural-config/platform-preferences--context-turns.png)

The value is the one worth thinking about before you change it. Raising it makes the model see
more of the conversation, at the cost the product itself spells out; move it one step at a time
and check answer quality rather than jumping to the maximum.

### Context Timeout - Session

**Context Timeout - Session** is how long a conversation identified by a `session_id` keeps its
context. The help text is one line: "Timeout of a session_id based user session." The slider runs
from `0` to `999999`; the playground has it at `360000`.

![The Context Timeout - Session slider, 0 to 999999, set to 360000](/img/neural-config/platform-preferences--context-timeout-session.png)

:::note
Neither context timeout shows a unit on screen, so do not read the numbers as seconds or
milliseconds. The neighbouring **Timeout** slider does say "milliseconds", but that is the
language-generation timeout, a different setting.
:::

### Context Timeout - User Only

**Context Timeout - User Only** is the window for a request that carries a user id but no
`session_id`. The help text reads: "Timeout of a user based session with no session_id." The
slider has the same `0` to `999999` range; the playground has it at `1800` — a much smaller number
on the same scale as the session timeout's `360000`, so a user-only session expires far sooner
than a session identified by a `session_id`.

![The Context Timeout - User Only slider, 0 to 999999, set to 1800](/img/neural-config/platform-preferences--context-timeout-user-only.png)

That difference is the reason to send a `session_id` when you have one: a conversation keyed only
on a user id falls under the smaller of the two timeouts.

### Context detection

**Context detection** decides what works out what a follow-up refers to. The help text reads: "Use
our (fast) model for carrying language context or use an LLM-based mAIstro flow for custom PoS
tagging." It is one heading over two dropdowns.

![Context detection, with the Detection Method dropdown set to Model Only and the mAIstro flow dropdown showing ex_Context_Grammar](/img/neural-config/platform-preferences--context-detection.png)

**Detection Method** chooses the mechanism. Its options are:

- `Model Only` — NeuralSeek's own model carries the context (the playground value).
- `Model + mAIstro fallback` — the model first, with the mAIstro agent as the fallback.
- `mAIstro Only` — the mAIstro agent alone.

![The Detection Method option list: Model Only, Model + mAIstro fallback, mAIstro Only](/img/neural-config/platform-preferences--options-detection-method.png)

**mAIstro flow** names the agent used whenever the method involves mAIstro — the "LLM-based
mAIstro flow for custom PoS tagging" of the help text, that is, an agent that does the
part-of-speech work in place of the built-in model. Its list is `Disabled` plus the agents on the
instance that qualify, so the second entry is instance-specific: on the playground it is
`ex_Context_Grammar`.

<!-- UNCONFIRMED: mAIstro flow appears disabled while Detection Method is `Model Only` — inferred from the greyed rendering in the capture and the missing pointer cursor on its listbox; switching the method to confirm would change the configuration. -->

In the capture the **mAIstro flow** dropdown is rendered greyed out while **Detection Method** is
`Model Only`, which suggests it only becomes editable once a mAIstro option is selected.

### Force carry context

**Force carry context** is the switch for subject-less follow-ups. The help text reads: "If no
subject / nouns are found in a question assume the question is a follow on to the previous
question". It is a True or False dropdown; the playground has it at `False`, so a question with no
subject is not treated as a follow-up unless you turn this on.

![The Force carry context dropdown, set to False](/img/neural-config/platform-preferences--force-carry-context.png)

With it on, "how does it work?" is read as a continuation of the previous question. With it off,
NeuralSeek relies on what **Context detection** can find in the question itself.

### Require Cache to Follow Context?

**Require Cache to Follow Context?** is a `Yes` / `No` dropdown under **Normal answer cache** in
the **Intent Matching & Cache Configuration** accordion; the playground has it at `Yes`.

![The Normal answer cache section, with Require Cache to Follow Context? set to Yes](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

<!-- UNCONFIRMED: that `Yes` means a cached answer is only served when the conversation context matches as well — inferred from the label; the control has no help text and no probe exercised it. -->

Set to `Yes`, a cached answer is only reused when the conversation context matches as well, not on
the question text alone. How the caches themselves work is on [Caching](/seek/caching/), and the
setting is documented on
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

### Carrying the previous turn yourself

When the calling system already holds the conversation history, it can hand the previous exchange
over on each request instead of relying on a session id.

<!-- UNCONFIRMED: `options.lastTurn` and its `[{input, response}]` shape, and the two request examples below, are from the previous documentation page; nothing in this capture shows a seek request body, and they were not re-verified against the current /seek API. -->

`options.lastTurn` carries the previous exchange with the request. On the first request there is
nothing to reference, so the structure is empty:

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

Keep the answer that comes back. On the next request, put the previous question in `input` and
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

<!-- UNCONFIRMED: watsonx Assistant's `Session History` variable mapping onto `options.lastTurn` — from the previous documentation page (_private/archive/verbatim-migration/previous/seek/conversational-context.md); the watsonx Assistant console was never captured in this run. -->

watsonx Assistant keeps its own `Session History` variable, which is what its NeuralSeek
extension passes here; the setup is on
[watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).

## FAQ

### What do I have to send for follow-up questions to work?

A session identifier that stays constant for the conversation. The console distinguishes a
"session_id based user session" from a "user based session with no session_id", each with its own
**Context Timeout**, so send a `session_id` when you have one — a user id alone falls under the
smaller of the two timeouts.

### How many earlier turns does the LLM see?

As many as **Context Turns** allows, in **Platform Preferences**. It ranges from `0` to `50` and is
`1` on the playground. The help text warns against raising it: more turns means less LLM context
left for your documentation and more exposure to prompt attacks.

### How long does context last?

Two separate timeouts: **Context Timeout - Session** (`360000` on the playground) for a
`session_id` session, and **Context Timeout - User Only** (`1800`) for a request with a user id and
no session id. Both run from `0` to `999999` and neither shows its unit on screen, so read the
values in your own console rather than assuming seconds or milliseconds.

### The user asked "how does it work?" with no subject — is it a follow-up?

Only if **Force carry context** is `True`: "If no subject / nouns are found in a question assume
the question is a follow on to the previous question". The playground has it at `False`.

### Can a mAIstro agent decide what the follow-up refers to?

Yes. Set **Detection Method** to `mAIstro Only`, or to `Model + mAIstro fallback` to keep
NeuralSeek's own model first, and pick the agent in **mAIstro flow**. The list offers `Disabled`
and the qualifying agents on your instance; on the playground that is `ex_Context_Grammar`.

### Does a cached answer ignore the conversation?

Not while **Require Cache to Follow Context?** is `Yes`, which is the playground value. Set it to
`No` and the cache is keyed on the question alone. The caches are explained on
[Caching](/seek/caching/).
