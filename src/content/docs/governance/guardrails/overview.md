---
title: "Guardrails overview"
description: "The Guardrails dialog in Neural Config holds ten tabs behind one Save — four that act on the user's question, four that act on the generated answer, and one that hooks mAIstro agents onto both sides."
---

## What is it

Guardrails are the rules NeuralSeek applies around an answer: what it accepts as a question, and
what it allows back out as an answer. They live in one dialog, opened from a **Guardrails** node
on the Neural Config routing tree, and they are grouped into ten tabs:

**Semantic Scoring**, **Prompt Injection**, **PII**, **Profanity (HAP)**,
**Attribution Protection**, **Warning Confidence**, **Min Confidence**, **Min Text**,
**Max Length** and **Custom Governance**.

This page is the map: how the tabs relate, which side of the call each one acts on, and where the
detail for each lives. It also documents the two tabs that have no page of their own —
**Min Text** and **Max Length**.

## Why it matters

Two different things can go wrong with a generative answer, and the tabs split along that line.

On the way in, a question can be an attempt to talk the model into behaving badly, it can carry
personal data you do not want sent to a model provider, or it can be too thin ("refund") or too
long to answer sensibly. On the way out, an answer can read fluently while resting on nothing in
the KnowledgeBase — the failure mode that costs trust rather than throughput.

Guardrails are also per configuration, not per instance. The dialog's header names the
configuration you are editing (`Guardrails: Default Config` on the root node), so a category with
its own Custom Configuration can be stricter or looser than the rest of the instance without
changing anyone else's rules.

## When to use it

- Open **Guardrails** when you want to change what NeuralSeek refuses, warns about, or strips —
  for the whole instance from the **Default Config** node, or for one category from that
  category's node.
- Go somewhere else when the problem is answer *quality* rather than answer *safety*: retrieval
  and prompt settings are in the **Edit Configuration** dialog, and the scoring model behind
  **Semantic Scoring** is tuned on
  [Semantic model tuning](/configuration/semantic-model/).
- Guardrails are not a substitute for KnowledgeBase work. Blocking low-confidence answers hides a
  gap in the content; it does not fill it.

## How it works

![The Guardrails dialog open over the Neural Config routing tree, showing the Semantic Scoring tab](/img/neural-config/guardrails.png)

### Opening the dialog

A **Guardrails** node sits on the routing tree in Neural Config, under **Default Config** and
under each category that has a Custom Configuration — the tree itself is described on
[Configuration overview](/configuration/overview/). Clicking one opens the dialog.

- The header reads `Guardrails: <configuration>` — `Guardrails: Default Config` when you opened it
  from the root node. A **Close** (×) sits beside it.
- The tab strip runs across the top in this order: **Semantic Scoring** (selected when the dialog
  opens), **Prompt Injection**, **PII**, **Profanity (HAP)**, **Attribution Protection**,
  **Warning Confidence**, **Min Confidence**, **Min Text**, **Max Length**,
  **Custom Governance**. It is wider than the dialog, so it has left and right scroll arrows.
- **Save**, in the footer, covers the whole dialog rather than the current tab. Switching tabs
  does not save, and nothing you change takes effect until you use it. Saving from the Neural
  Config screens is described once on
  [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Which tabs act on the question and which on the answer

The tabs do not say in what order they run, and nothing on screen shows one. What they do say,
in their own help text, is which side of the model call they sit on.

Acting on the user's input, before retrieval and generation:

- **Prompt Injection** — "Strip out portions of user input that scores higher than this percentage
  against the Prompt Injection model."
- **PII** — "These rules run dynamically on user input before it is sent to LLM's or KB's"
- **Min Text** — "Minimum Words in a question."
- **Max Length** — "Maximum Words in a question."

Acting on the generated answer:

- **Semantic Scoring** — "checks the generated answer against the KnowledgeBase sources"
- **Attribution Protection** — tolerance for text about the company that lacks specific
  KnowledgeBase references.
- **Warning Confidence** — "Prepend a warning message to an answer, based on answer confidence."
- **Min Confidence** — "Block low confidence results for uncategorized intents."

**Custom Governance** has one hook on each side: "Pre-LLM custom governance agents run before
Knowledgebase lookup and the call to the LLM", "Post-LLM custom governance agents run after call
to the LLM".

**Profanity (HAP)** is the one tab that is not a pure input or output rule — it combines a local
profanity filter with a model provider's moderation endpoint where one is available.

### Min Text — the shortest question you accept

![The Min Text tab: the minimum-words slider, the mAIstro agent picker and the reply text](/img/neural-config/min-text-panel.png)

Users type keywords at search boxes, and a one-word question gives the model almost nothing to
work with. **Min Text** lets you turn those into a request for more detail instead of a bad
answer.

- **Minimum Words in a question. Help train your users to not scream keywords at GenAI...**
  (slider with a **Slider value** box) — the scale runs from `Unlimited` up to `10` words. The
  label is the on-screen help text, ellipsis included. On the instance captured here the value is
  `0`, at the `Unlimited` end, so no minimum is enforced.
- **mAIstro agent for custom Minimum text message** (dropdown) — points the reply at a mAIstro
  agent, so the "say a bit more" message can be composed rather than fixed. The captured instance
  has `ex_Minimum_Text_Message` selected.
- **Text to reply with as a welcome node, or for input not meeting the minimum input text length**
  (text box) — the static reply. Note the double duty the label admits: the same text is used as a
  welcome message. The captured instance holds `Give me a bit more to go on...`, and the field was
  disabled while an agent was selected.

### Max Length — the longest question you accept

![The Max Length tab: the maximum-words slider at 100, the mAIstro agent picker and the reply text](/img/neural-config/max-length-panel.png)

Very long questions are a common shape for adversarial prompts — a wall of text with an
instruction buried in it. **Max Length** caps the input and answers over-long questions with a
request to summarise.

- **Maximum Words in a question. Use a low limit to help mitigate adversarial questions designed
  to generate inappropriate answers. Set to 100 to remove the limit.** (slider with a
  **Slider value** box) — the scale runs from `0` to `Unlimited`. Read the label carefully: `100`
  is not "a hundred words", it is the `Unlimited` end of the slider and means no limit. The
  captured instance sits at `100`.
- **mAIstro agent for custom Maximum words message** (dropdown) — the same arrangement as on
  **Min Text**; the captured instance has `ex_Maximum_Words_Message` selected.
- **Text to reply with for questions over the input word limit.** (text box) — the static reply,
  disabled here while an agent is selected. The captured instance stores `Can you please
  summarize your question for me? Questions should be limited to 20 words.`, which is worth
  noticing: the message is stored text, not generated from the setting, so it can disagree with
  the limit actually in force. If you change the limit, change the message.

### The other eight tabs

Each has its own page; this is only enough to tell them apart.

- **Semantic Scoring** — "The Semantic Scoring model checks the generated answer against the
  KnowledgeBase sources and rates the answer based on the quantity and focus. Semantic scoring is
  not available in cross-laguage usecases." (the spelling is the screen's). Its
  **Semantic Model Tuning** button opens the penalties and weights, documented on
  [Semantic model tuning](/configuration/semantic-model/). Tab detail:
  [Semantic scoring](/governance/guardrails/semantic-scoring/).
- **Prompt Injection** — "Block malicious attempts from users to get the LLM to respond in
  disruptive, embarrassing, or harmful ways." →
  [Prompt injection](/governance/guardrails/prompt-injection/).
- **PII** — regex rules that run on user input before it reaches a model or the KnowledgeBase,
  plus LLM-based detection ("These rules use your chosen LLM to identify PII.") →
  [PII detection](/governance/pii-detection/).
- **Profanity (HAP)** — "NeuralSeek contains both a local profanity filter, plus for certain LLM's
  we can connect to the LLM's moderation endpoint." →
  [Profanity (HAP)](/governance/guardrails/profanity-hap/).
- **Attribution Protection** — a single Rigid-to-Standard slider setting the "Tolerance for
  generating text about the company, or associating people or things that lack specific references
  in the Knowledgebase material." →
  [Attribution protection](/governance/guardrails/attribution-protection/).
- **Warning Confidence** — "Prepend a warning message to an answer, based on answer confidence." →
  [Minimum confidence](/governance/guardrails/min-confidence/).
- **Min Confidence** — "Block low confidence results for uncategorized intents.", set by a
  **Minimum Confidence %** slider that runs from `Disable` to `100` →
  [Minimum confidence](/governance/guardrails/min-confidence/).
- **Custom Governance** — "Connect mAIstro agents to apply custom governace rules." (screen
  spelling), with separate Pre-LLM and Post-LLM agent slots →
  [Custom governance agents](/governance/guardrails/custom-governance-agents/).

## FAQ

### Where do I find the guardrails?

On a **Guardrails** node in the Neural Config routing tree — one under **Default Config**, and one
under any category that has a Custom Configuration. The dialog header tells you which
configuration you opened, for example `Guardrails: Default Config`.

### Do I have to save each tab separately?

No. There is a single **Save** in the dialog footer and it covers every tab. Moving between tabs
does not save, and closing the dialog without saving discards what you changed.

### Which guardrails run before the LLM and which after?

On the input side: **Prompt Injection**, **PII**, **Min Text** and **Max Length**. On the answer
side: **Semantic Scoring**, **Attribution Protection**, **Warning Confidence** and
**Min Confidence**. **Custom Governance** has a Pre-LLM slot and a Post-LLM slot. No screen states
the order the tabs run in relative to each other, so do not assume one.

### Can guardrails be different per category?

Yes. A category with a Custom Configuration gets its own **Guardrails** node and its own copy of
the dialog, so you can be strict about, say, billing questions without tightening everything else.

### How do I stop users sending one-word questions?

Open **Min Text** and raise
**Minimum Words in a question. Help train your users to not scream keywords at GenAI...** above
`0`, then either set
**Text to reply with as a welcome node, or for input not meeting the minimum input text length**
or point **mAIstro agent for custom Minimum text message** at an agent that composes the reply.

### Why is Max Length set to 100 — is that a hundred words?

No. The tab's own help text says "Set to 100 to remove the limit", and `100` sits at the slider's
`Unlimited` end, so a value of `100` means no maximum is enforced. Pick a lower number to
actually cap question length.
