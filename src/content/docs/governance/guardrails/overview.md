---
title: "Guardrails overview"
description: "NeuralSeek's guardrails live in one Neural Config dialog with ten tabs behind a single Save: some screen the user's question before the KnowledgeBase lookup and the LLM call, others check the generated answer, and Custom Governance hooks mAIstro agents onto both sides."
---

Guardrails are the rules NeuralSeek applies around an answer: what it accepts as a question, and
what it lets through as an answer. You set them in one dialog in
[Neural Config](/configuration/neural-config/), opened from a **Guardrails** node on the routing
tree, with one tab per guardrail. This page explains how the tabs divide the work, points each one
to its own page, and documents the two tabs that have no page of their own: **Min Text** and
**Max Length**.

## How guardrails work

### The Guardrails dialog

![The Guardrails: Default Config dialog, with the tab strip Semantic Scoring, Prompt Injection, PII, Profanity (HAP), Attribution Protection, Warning Confidence, Min Confidence, Min Text, Max Length and Custom Governance, the Semantic Scoring tab open and Save in the footer](/img/neural-config/guardrails-panel.png)

Guardrails belong to a configuration, not to the whole instance. The Neural Config routing tree
has a **Guardrails** node under **Default Config**, and further **Guardrails** nodes on the
category branches of the tree. The tree itself is described on
[Configuration overview](/configuration/overview/), and the categories that create those branches
on [Intent categorization](/governance/intent-categorization/).

To change a guardrail:

1. In Neural Config, select the **Guardrails** node of the configuration you want to change. The
   dialog title names it: `Guardrails: Default Config` from the root node,
   `Guardrails: <configuration>` from any other.
2. Select a tab. The dialog opens on **Semantic Scoring**. The tab strip is wider than the dialog,
   so use the scroll arrows at its ends to reach **Min Text**, **Max Length** and
   **Custom Governance**.
3. Change the settings on as many tabs as you need.
4. Select **Save** in the dialog footer. One Save covers every tab, so there is no need to save
   tab by tab. How saved changes and versions work across Neural Config is described on
   [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Which tabs act on the question and which on the answer

Each tab's help text says which side of the LLM call it works on: the user's question, before the
KnowledgeBase lookup and the LLM call, or the answer the LLM generates. The tabs do not state an
order among guardrails on the same side, so do not design a rule that depends on one running
before another.

| Tab                        | Acts on              | What it does                                                                                                                                                                                                                                       | Details                                                                     |
| -------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Semantic Scoring**       | Answer               | Checks the generated answer against the KnowledgeBase sources and rates it on quantity and focus. Not available in cross-language use cases. Its **Semantic Model Tuning** button opens [Semantic model tuning](/configuration/semantic-model/). | [Semantic scoring](/governance/guardrails/semantic-scoring/)                |
| **Prompt Injection**       | Question             | Blocks "malicious attempts from users to get the LLM to respond in disruptive, embarrassing, or harmful ways."                                                                                                                                     | [Prompt injection](/governance/guardrails/prompt-injection/)                |
| **PII**                    | Question             | Rules that run "on user input before it is sent to LLM's or KB's", plus rules that use your chosen LLM to identify personal data.                                                                                                                  | [PII detection](/governance/pii-detection/)                                 |
| **Profanity (HAP)**        | Question             | A local profanity filter, plus the LLM's own moderation endpoint for certain LLMs. A blocked question gets the reply you set.                                                                                                                      | [Profanity (HAP)](/governance/guardrails/profanity-hap/)                    |
| **Attribution Protection** | Answer               | Sets how much generated text about your company, or about people and things, NeuralSeek tolerates when the KnowledgeBase has no specific reference for it.                                                                                          | [Attribution protection](/governance/guardrails/attribution-protection/)    |
| **Warning Confidence**     | Answer               | Puts a warning message in front of an answer, based on the answer's confidence.                                                                                                                                                                    | [Minimum confidence](/governance/guardrails/min-confidence/)                |
| **Min Confidence**         | Answer               | Blocks low-confidence results for uncategorized intents.                                                                                                                                                                                           | [Minimum confidence](/governance/guardrails/min-confidence/)                |
| **Min Text**               | Question             | Sets the fewest words a question must have.                                                                                                                                                                                                        | This page, below                                                            |
| **Max Length**             | Question             | Sets the most words a question may have.                                                                                                                                                                                                           | This page, below                                                            |
| **Custom Governance**      | Question and answer  | Connects [mAIstro](/maistro/overview/) agents: a Pre-LLM agent runs before the KnowledgeBase lookup and the LLM call and can modify or govern the input; a Post-LLM agent runs after the LLM call and can modify or govern the answer.            | [Custom governance agents](/governance/guardrails/custom-governance-agents/) |

### Min Text — the shortest question you accept

Users often type keywords into anything that looks like a search box, and a one- or two-word
question gives retrieval and the LLM very little to work with. **Min Text** answers those
questions with a request for more detail instead of a weak answer.

![The Min Text slider, labelled Minimum Words in a question, running from Unlimited to 10 with the number box beside it](/img/neural-config/min-text--unlimited.png)

- **Minimum Words in a question. Help train your users to not scream keywords at GenAI...** — the
  fewest words a question must contain. Drag the slider or type an exact number in the box beside
  it. The scale runs from **Unlimited** at the left end, where no minimum applies, to `10` words.
  A question shorter than the value gets the reply set below instead of an answer.

![The Min Text reply settings: the mAIstro agent for custom Minimum text message list and the reply text box](/img/neural-config/min-text--maistro-agent-for-custom-minimum-text-me.png)

- **mAIstro agent for custom Minimum text message** — lets one of your mAIstro agents compose the
  reply instead of the fixed text below. The list offers
  **None**, **Disabled** and the mAIstro agents on your instance.

  ![The open list of the mAIstro agent for custom Minimum text message: None, Disabled and an agent](/img/neural-config/min-text--options-maistro-agent-for-custom-minimum-text-me.png)

- **Text to reply with as a welcome node, or for input not meeting the minimum input text length**
  — the fixed reply, for example "Give me a bit more to go on...". The box is unavailable while
  an agent is selected in the list above.
  <!-- UNCONFIRMED: the reply text is used only when no agent is selected — inferred from the text box being disabled while an agent is chosen (capture 202610010144, states min-text and max-length) -->
  The agent's reply takes its place.

### Max Length — the longest question you accept

Very long questions are a common shape for adversarial prompts: a wall of text with an instruction
buried in it. **Max Length** caps how long a question may be and answers anything longer with your
reply instead of an answer.

![The Max Length slider, labelled Maximum Words in a question, running from 0 to Unlimited and set to 100](/img/neural-config/max-length--unlimited.png)

- **Maximum Words in a question. Use a low limit to help mitigate adversarial questions designed
  to generate inappropriate answers. Set to 100 to remove the limit.** — the most words a question
  may contain. The scale runs from `0` to **Unlimited**, and the **Unlimited** end is the value
  `100`. So `100` does not mean a hundred words: it means no limit. To cap question length, pick a
  lower number.

![The Max Length reply settings: the mAIstro agent for custom Maximum words message list and the reply text box](/img/neural-config/max-length--maistro-agent-for-custom-maximum-words-m.png)

- **mAIstro agent for custom Maximum words message** — lets one of your mAIstro agents compose the
  reply. The list offers **None**, **Disabled** and the mAIstro agents on your instance.

  ![The open list of the mAIstro agent for custom Maximum words message: None, Disabled and an agent](/img/neural-config/max-length--options-maistro-agent-for-custom-maximum-words-m.png)

- **Text to reply with for questions over the input word limit.** — the fixed reply. Like the
  **Min Text** reply, the box is unavailable while an agent is selected. The reply is stored text,
  not generated from the setting, so it does not follow the slider: a message such as "Questions
  should be limited to 20 words." stays as written when you change the limit. Update the two
  together.

## When to use guardrails

- **To change what NeuralSeek refuses, strips or warns about.** Use the **Default Config** node
  for the rules most questions follow, and the **Guardrails** node on a category branch when one
  kind of question needs stricter or looser rules than the rest.
- **When the risk is in what users send** — attempts to manipulate the model, personal data you do
  not want passed to an LLM provider, abusive language, or questions too short or too long to
  answer well — work on the question-side tabs: **Prompt Injection**, **PII**,
  **Profanity (HAP)**, **Min Text** and **Max Length**.
- **When the risk is an answer that reads well but is not backed by your content**, work on the
  answer-side tabs: **Semantic Scoring**, **Attribution Protection**, **Warning Confidence** and
  **Min Confidence**.
- **When no tab expresses your rule**, write it as a mAIstro agent and connect it on
  **Custom Governance**.

Guardrails are about answer safety, not answer quality. If answers are safe but unhelpful, the
fix is usually in retrieval, prompt or KnowledgeBase settings on
[Neural Config](/configuration/neural-config/), or in the content itself: blocking low-confidence
answers hides a gap in the KnowledgeBase rather than filling it.

To see how often guardrails fire, the [Seek overview dashboard](/governance/analytics/seek-overview/)
reports HAP, prompt injection, PII and question resolution; the wider reporting is introduced on
[Governance overview](/governance/overview/). To attack your setup on purpose before users do, see
[Red team testing](/governance/red-team-testing/). For the same kinds of checks inside an agent you
build, use the [NTL guardrail nodes](/maistro/ntl/guardrails/).

## FAQ

### Do I have to save each tab separately?

No. There is one **Save** in the dialog footer and it covers every tab, so you can change several
tabs and save once.

### Which guardrails act before the LLM and which after?

On the question side: **Prompt Injection**, **PII**, **Profanity (HAP)**, **Min Text** and
**Max Length**. On the answer side: **Semantic Scoring**, **Attribution Protection**,
**Warning Confidence** and **Min Confidence**. **Custom Governance** has a Pre-LLM agent and a
Post-LLM agent, one on each side. The tabs do not state an order among guardrails on the same
side.

### Why does Max Length show 100 — is that a hundred words?

No. The help text says "Set to 100 to remove the limit", and `100` sits at the slider's
**Unlimited** end. Pick a lower number to cap question length.

### How do I stop users sending one-word questions?

On the **Min Text** tab, move **Minimum Words in a question** off the **Unlimited** end to the
number of words you want to require. Then set the reply: either the text in
**Text to reply with as a welcome node, or for input not meeting the minimum input text length**,
or a mAIstro agent in **mAIstro agent for custom Minimum text message**. Select **Save**.

## Related

- [Neural Config options](/configuration/neural-config/)
- [Configuration overview](/configuration/overview/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Intent categorization](/governance/intent-categorization/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
- [Red team testing](/governance/red-team-testing/)
- [NTL guardrail nodes](/maistro/ntl/guardrails/)
