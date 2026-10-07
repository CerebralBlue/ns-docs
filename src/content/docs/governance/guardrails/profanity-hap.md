---
title: "Profanity (HAP)"
description: "The Profanity (HAP) guardrail chooses which filter screens questions for hate, abuse and profanity, sets the reply a blocked user reads, and adjusts NeuralSeek's built-in word list with an allow-list and a block-list."
---

The **Profanity (HAP)** tab of the [Guardrails](/governance/guardrails/overview/) dialog controls
how NeuralSeek handles questions that contain hate, abuse or profanity (HAP). As the tab puts it:
"NeuralSeek contains both a local profanity filter, plus for certain LLM's we can connect to the
LLM's moderation endpoint." You choose which of those filters runs, write the reply a user gets
when their question is blocked, and tune NeuralSeek's built-in word list for your domain — let
through the terms it wrongly flags, and add the ones it misses.

## Where to find it

In [Neural Config](/configuration/neural-config/), select the **Guardrails** node on the routing
tree, then the **Profanity (HAP)** tab. The dialog's title names the configuration you are
editing — `Guardrails: Default Config` on the root node — so a category with its own
configuration can filter differently from the rest of the instance.

![The Guardrails dialog open on the Profanity (HAP) tab, over the Neural Config routing tree](/img/neural-config/profanity-hap.png)

Changes on this tab are kept with the dialog's single **Save**, which saves all ten Guardrails
tabs at once.

## Settings

### Enable the profanity Filter

**Enable the profanity Filter** decides which filter screens each question. Pick the option that
matches how consistent you need the behaviour to be across the LLMs you connect in
[LLM Details](/configuration/neural-config/llm-details/).

![The Enable the profanity Filter dropdown open, showing its three options](/img/neural-config/profanity-hap--options-enable-the-profanity-filter.png)

<!-- UNCONFIRMED: what each option does is read from the option names and the tab description; which LLMs expose a moderation endpoint is not shown on screen — brief, neural-config capture 202610010144 -->

| Option                                                       | What it does                                                                                                                                     | When to pick it                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Use the LLM Filter if available or the NeuralSeek filter** | Uses the connected LLM's own moderation endpoint when that LLM offers one, and NeuralSeek's local filter when it does not.                       | You want the model provider's moderation wherever it exists, with NeuralSeek's filter as a fallback. |
| **Use the NeuralSeek Filter**                                | Always uses NeuralSeek's local filter, whichever LLM is connected.                                                                               | You want the same screening on every LLM.                    |
| **Disable the filter**                                       | Turns HAP screening off: questions are no longer blocked for hate, abuse or profanity.| Rarely — for example, when an upstream system already moderates every question before it arrives.   |

### Text to reply with for sensitive questions that are blocked

**Text to reply with for sensitive questions that are blocked** is what the user reads in place of
an answer when the filter blocks their question. Write it in your brand's voice, and consider
telling the user where else to go — a support channel or a human contact — rather than only asking
them to rephrase.

![The reply text box with its example text](/img/neural-config/profanity-hap--text-to-reply-with-for-sensitive-questio.png)

An example of a reply:

```text
That seems like a sensitive question. Maybe I'm not understanding you, so try rephrasing.
```

When the filter blocks a question, Seek returns this text exactly as you wrote it, in place of a
generated answer: the response carries no sources and a confidence of 0. A hostile tone on its own is not
enough: a hostile question that contains no profane words can go through unblocked and get a
normal generated reply. If your users' abuse runs to words the built-in list does not catch, add
them to the block-list below.

<!-- UNCONFIRMED: the NTL Profanity Filter node returns this tab's reply text — old NTL Profanity Filter node page -->

mAIstro agents can apply the same filter with the [Profanity Filter](/maistro/ntl/guardrails/)
node, which returns this reply text when it blocks the input.

### HAP allow-list and block-list

Two boxes tune NeuralSeek's built-in word list, which the screen calls "NeuralSeek's default HAP
filter". Both take a comma-separated list of words.

![The Profanity (HAP) tab: the filter selector and reply text, with the allow-list and block-list boxes below them](/img/neural-config/profanity-hap--enable-the-profanity-filter.png)

- **Words to specifically allow-list past the HAP filter. Separate words by a comma.** — words the
  filter must let through. Use it when a general-purpose list flags ordinary vocabulary in your
  field: a clinical term in a healthcare deployment, or an attack name in a security product, would
  otherwise turn a legitimate question into a blocked one.
- **Words to add to NeuralSeek's default HAP filter. Separate words by a comma.** — words to block
  on top of the built-in list: slurs, insults or slang the built-in list does not catch in your
  users' language or region.

The block-list extends NeuralSeek's built-in list. To be sure both lists apply to every question,
whichever LLM is connected, select **Use the NeuralSeek Filter**.

## Limits and interactions

**The HAP lists are not the place for competitor or product names.** The
[Prompt injection](/governance/guardrails/prompt-injection/) tab has its own box — "Words that are
not allowed on the user input. Very useful for blocking specific competitve customer or product
names …" — and its own **Blocked Word Action**, which decides what happens to a matching word.
Use that list for names and sensitive terms you never want in a question; use the HAP lists for
offensive language, where a match blocks the question and returns the reply text above. Personal
data such as e-mail addresses is handled separately, on the [PII](/governance/pii-detection/) tab.

**Watching the filter's effect.** The Governance overview's **Hate, Abuse, Profanity Block** panel
reports the "Detected HAP filter rate" — see [Seek overview](/governance/analytics/seek-overview/).
Watch it after you change a list: a sudden rise after adding words points to an entry that is too
broad, and a high rate in a specialised domain points to terms you should allow-list.

<!-- UNCONFIRMED: the Seek Logs Filter choices "Sensitive" / "Not Sensitive" separate questions flagged by the HAP filter — brief inference from the changelog ("The Logs tab now flags responses that had PII, HAP activation, and Prompt injection actions") -->

To read the individual questions that were flagged, open **Filter** in
[Seek logs](/governance/analytics/seek-logs-and-config-insights/) and choose **Sensitive**.

## FAQ

**What does a user see when their question is blocked?**
The text in **Text to reply with for sensitive questions that are blocked**, word for word,
instead of an answer. Seek generates nothing for that question: the reply has no sources and a
confidence of 0. A rude question without profane words can go through unblocked and be answered
normally; add the words you need caught to the block-list.

**A harmless industry term keeps getting blocked. What do I do?**
Add it to **Words to specifically allow-list past the HAP filter. Separate words by a comma.** and
select **Save**. If the word is still blocked while the first option of **Enable the profanity
Filter** is selected, switch to **Use the NeuralSeek Filter**, the option that is sure to apply
your word lists.

**Should I block competitor names in the HAP block-list?**
No. The HAP lists are for offensive language. Put competitor and product names in the blocked
words on the [Prompt injection](/governance/guardrails/prompt-injection/) tab, where
**Blocked Word Action** decides what happens to them.

**How can I see how often questions are blocked?**
The **Hate, Abuse, Profanity Block** panel on the Governance overview shows the detected HAP
filter rate — see [Seek overview](/governance/analytics/seek-overview/).

## Related

- [Guardrails overview](/governance/guardrails/overview/) — the ten tabs and the shared Save
- [Prompt injection](/governance/guardrails/prompt-injection/) — blocked words for names and sensitive terms
- [PII detection](/governance/pii-detection/) — the other guardrail that acts on the question
- [LLM Details](/configuration/neural-config/llm-details/) — the LLM whose moderation endpoint the filter may use
- [Seek overview](/governance/analytics/seek-overview/) — the Hate, Abuse, Profanity Block panel
- [NTL guardrail nodes](/maistro/ntl/guardrails/) — the Profanity Filter node for mAIstro agents
