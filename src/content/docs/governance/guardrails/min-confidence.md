---
title: "Minimum confidence"
description: "The Min Confidence and Warning Confidence guardrails decide what happens to a low-confidence answer: below one threshold NeuralSeek replaces it with your own reply or a mAIstro agent's, below the other it shows the answer with a warning in front."
---

An answer that reads well but rests on thin KnowledgeBase evidence is the hardest kind of wrong
answer to spot. Two tabs of the [Guardrails dialog](/governance/guardrails/overview/) handle it.
**Min Confidence** holds back answers below a confidence threshold and sends your own reply
instead, either a fixed text or one composed by a [mAIstro](/maistro/overview/) agent, with an
optional link. **Warning Confidence** keeps the answer and puts a
caution in front of it. Use the minimum when a wrong answer costs more than no answer. Use the
warning when a partial answer still helps, as long as the user knows to check it.

## Where to find the confidence guardrails

In [Neural Config](/configuration/neural-config/using-this-page/), select a **Guardrails** node on the routing tree to open the Guardrails
dialog, then select the **Min Confidence** or **Warning Confidence** tab. There is a **Guardrails**
node under **Default Config** and one under each category that has a Custom Configuration. The
dialog header names the configuration you are editing, for example `Guardrails: Default Config`.
Each configuration keeps its own thresholds, reply and warning text, so one category can be
stricter than the rest of the instance.

![The Guardrails dialog over the Neural Config routing tree, with the Min Confidence tab selected](/img/neural-config/min-confidence.png)

One **Save** in the dialog footer applies the changes on every tab.

## Settings

### Minimum Confidence %

![The Min Confidence tab: the Minimum Confidence % slider, the agent and pre-run dropdowns, the reply text, the URL slider, URL Fallback on minimum and Fallback URL](/img/neural-config/min-confidence--minimum-confidence.png)

The tab's help line states its purpose: "Block low confidence results for uncategorized
[intents](/governance/intent-categorization/)."

**Minimum Confidence %** is a slider, with a number box beside it for typing an exact value. The
track runs from `Disable` to `100`. At `Disable` (value `0`), no answer is held back. Above it, an
answer whose confidence is below the value is replaced with the reply described in the next
section.

Raise the threshold when users are getting confident-sounding answers to questions your content
does not cover. Lower it, or set it to `Disable`, when users get your fallback reply for questions
the KnowledgeBase actually answers. Change it in small steps, save, and ask a few known questions
in [Seek](/seek/overview/) to see which side of the threshold they land on. A high threshold hides
content gaps; it does not fill them.

### The reply to a low-confidence question

These three settings decide what the user sees in place of the answer that was held back.

**mAIstro agent for custom Minimum confidence message** chooses who writes the reply:

![The agent dropdown open, listing None, Disabled and a mAIstro agent](/img/neural-config/min-confidence--options-maistro-agent-for-custom-minimum-confide.png)

| Option                 | What choosing it does                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `None` / `Disabled`    | No agent writes the reply.                                                                                               |
| _One of your mAIstro agents_ | The agent writes the reply, so it can address the question that was asked instead of returning the same sentence every time. |

The list shows the mAIstro agents on your instance. An agent built for this
dropdown starts with the `minConfMsg` node, documented with the other
[NTL RAG tools](/maistro/ntl/rag-tools/). That node gives the agent the context of the held-back
answer: `minConfMsg.originalQuery` (the user's input), `minConfMsg.context` (the previous
message's context in a multi-turn conversation), `minConfMsg.kbContext` (the KnowledgeBase
documentation), `minConfMsg.language`, `minConfMsg.langCode`, `minConfMsg.intent`,
`minConfMsg.categoryName` and `minConfMsg.categoryURL`. With these the agent can, for example,
tell the user which topic it could not answer about and point them to that category's page.

**Pre-run min confidence agent for faster speed** decides when the agent runs:

![The pre-run dropdown open, listing true and false](/img/neural-config/min-confidence--options-pre-run-min-confidence-agent-for-faster-.png)

<!-- UNCONFIRMED: true starts the agent alongside the answer so its reply is ready without a wait, and it then also runs for questions whose answers pass the threshold — inferred from the label; the map gap adds "costs a run every time" -->
With `true`, the agent starts before NeuralSeek knows whether the answer will pass the threshold,
so a low-confidence question gets its reply without waiting for the agent. The trade-off is that
the agent also runs for questions whose answers end up above the threshold. With `false`, the
agent runs only after an answer has been held back. Choose `true` when response time matters most
and `false` when you want to keep agent runs down.

**Text to reply with for questions not meeting the minimum confidence** is the fixed reply. Write
it as something a user can act on: what to try next, or where to get help. The box is greyed out
while an agent is selected in the dropdown above.

### Showing a URL

**Minimum Confidence% to display a URL** is a second slider, from `Disable` to `100`, with its own
number box.
<!-- UNCONFIRMED: the threshold applies to the source URL shown with an answer, independently of Minimum Confidence % — from the previous documentation (documentation.neuralseek.com/ui/configure/: "Any answers lower than this number will not return a linked URL"), not yet seen in a capture -->
It sets how confident an answer must be before its source URL is shown with it. It is separate
from **Minimum Confidence %**, so an answer can be shown without its link.

**URL Fallback on minimum** decides which link, if any, goes with the low-confidence reply:

![The URL Fallback on minimum dropdown open, listing None and Category / Fallback URL](/img/neural-config/min-confidence--options-url-fallback-on-minimum.png)

<!-- UNCONFIRMED: Category / Fallback URL uses the matched category's URL first and the Fallback URL otherwise — from the option name and the map gap "resolve the fallback URL from the matched intent category" -->

| Option                    | What choosing it does                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `None`                    | The reply carries no link, and the **Fallback URL** box is greyed out.                                      |
| `Category / Fallback URL` | The reply carries a link: the URL of the matched category, or the **Fallback URL** when there is none. |

The category comes from intent categorization.

**Fallback URL** is the address to offer, for example a contact page or a help-centre search. The
box shows `http://myco.com` as a placeholder until you type your own.

### Confidence % for warning

![The Warning Confidence tab: the Confidence % for warning slider and the warning text](/img/neural-config/warning-confidence--confidence-for-warning.png)

The **Warning Confidence** tab's help line: "Prepend a warning message to an answer, based on
answer confidence." It does not hold the answer back; it changes how the answer is presented.

- **Confidence % for warning** — a slider from `Disable` to `100`, with a number box beside it.
  Answers whose confidence is below the value are shown with the warning text in front of them.
  At `Disable`, no answer gets a warning.
- **Prepend a warning on low confidence results** — the words placed before the answer. Write them
  so the answer still reads as one sentence once they are prepended. For example,
  `Based on limited information,` reads naturally ahead of most answers.

### Which score the thresholds compare

![The Semantic Scoring tab, with Use Semantic Score as the basis for Warning & Minimum confidence. among its switches](/img/neural-config/guardrails-panel.png)

Both thresholds are compared with the answer's confidence. Which score that is depends on
**Use Semantic Score as the basis for Warning & Minimum confidence.** on the **Semantic Scoring**
tab of the same dialog. When it is on, **Minimum Confidence %** and **Confidence % for warning**
are compared with the answer's semantic score. The penalties in
[Semantic model tuning](/configuration/semantic-model/) then move answers across these thresholds
too: a higher **LLM Decline Penalty**, for example, sends more declining answers to the minimum
reply. The switch itself is documented on
[Semantic scoring](/governance/guardrails/semantic-scoring/).

## Using the two thresholds together

<!-- UNCONFIRMED: the three-band behaviour when the warning threshold is above the minimum — inferred from the two tabs' help text, not stated on screen -->
Set **Confidence % for warning** higher than **Minimum Confidence %**, and answers fall into three
bands. Below the minimum, the user gets your reply and, if configured, a link. Between the two
thresholds, the user gets the answer with the warning in front. Above the warning threshold, the
answer is shown as it is. If the warning threshold is at or below the minimum, the warning band
is empty and only the minimum takes effect.

To see how often the minimum applies, open the Governance dashboards. The **Question Resolution**
panel ("Responded vs below min confidence") is on the Governance landing dashboard
([Seek overview](/governance/analytics/seek-overview/)), and the Seek logs can be filtered
to **Min Confidence** or **Not Min Confidence**
([Seek logs and configuration insights](/governance/analytics/seek-logs-and-config-insights/)).
A sudden rise after you change a threshold, or after a KnowledgeBase update, is the signal to
revisit these settings.

## FAQ

### Why do users get answers with very low confidence?

Most often **Minimum Confidence %** is at `Disable` or set low, so few answers are held back.
Raise it and set the reply text or an agent, and answers below the value are replaced with your
reply. Also check which score the threshold is compared with: see
[Which score the thresholds compare](#which-score-the-thresholds-compare).

### Can the low-confidence reply be different for each question?

Yes. Select an agent in **mAIstro agent for custom Minimum confidence message**. Through the
`minConfMsg` node, the agent receives the question, the KnowledgeBase context, the language and
the matched category, so it can write a reply for that question.

### What is the difference between the warning and the minimum?

The warning keeps the answer and puts your text in front of it. The minimum replaces the answer
with your reply. When **Confidence % for warning** is set above **Minimum Confidence %**, the
warning covers the answers between the two.

### Which score is compared with these percentages?

The semantic score, when **Use Semantic Score as the basis for Warning & Minimum confidence.** is
on in the **Semantic Scoring** tab. See [Semantic scoring](/governance/guardrails/semantic-scoring/).

## Related

- [Guardrails overview](/governance/guardrails/overview/) — every tab of the dialog, including
  **Min Text** and **Max Length**, the other two guardrails with a canned reply
- [Semantic scoring](/governance/guardrails/semantic-scoring/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Intent categorization](/governance/intent-categorization/)
- [NTL RAG tools](/maistro/ntl/rag-tools/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
