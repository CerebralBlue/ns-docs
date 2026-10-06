---
title: "Attribution protection"
description: "The Attribution Protection guardrail sets how much generated text about your company, or about people and things, NeuralSeek tolerates when the KnowledgeBase has no specific reference for it — on a slider from Rigid to Standard."
---

Attribution protection decides how strictly NeuralSeek holds an answer to what your
KnowledgeBase actually says when the answer talks about your company, or links people or things
together. A generated answer can read fluently while naming a partner, a product owner or a
company policy that no source document mentions; this setting is how much of that you are
willing to let through. It is one tab of the [Guardrails](/governance/guardrails/overview/)
dialog and holds a single slider.

## Where to find it

Open **Neural Config** and select a **Guardrails** node on the routing tree — the one under
**Default Config** for the whole instance, or the one under a category that has its own Custom
Configuration (the tree is described on [Configuration overview](/configuration/overview/)).
In the dialog that opens, select the **Attribution Protection** tab. The dialog title names the
configuration you are editing, for example `Guardrails: Default Config`.

![The Guardrails dialog for Default Config with the Attribution Protection tab selected, showing its help text and the Rigid to Standard slider](/img/neural-config/attribution-protection.png)

## Settings

### Attribution tolerance

![The Attribution Protection tab: the help text above a slider that runs from Rigid on the left to Standard on the right](/img/neural-config/attribution-protection--tolerance-for-generating-text-about-the-.png)

**Tolerance for generating text about the company, or associating people or things that lack
specific references in the Knowledgebase material.** (slider) — the label is also the setting's
help text, which continues: "The more rigid your setting, the higher the chances of occasionally
blocking legitimate questions that use alternate wording or are poorly documented in your
KnowledgeBase".

The slider runs between two ends:

| Position          | What it does                                                                                                                 | When to choose it                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toward **Rigid**  | Tolerates less generated text about your company, people or things that the KnowledgeBase does not specifically reference. More answers are blocked. | Invented statements about your company or named people are the bigger risk — a public-facing assistant, or regulated content where an unsupported claim is a liability. |
| Toward **Standard** | Tolerates more of that text, so fewer questions are blocked.                                                               | Users phrase the same question in many ways, or parts of your KnowledgeBase are thin, and blocking legitimate questions costs you more than the occasional loose claim. |

<!-- UNCONFIRMED: the slider stops at three fixed positions (Rigid, a middle position, Standard) — migration-map gap for this route; the screen shows only the two end labels and a mark midway along the track -->

The track has a mark at its midpoint; the slider stops at three positions — **Rigid**, the
midpoint and **Standard**.

The setting acts on the generated answer, not on the question. The help text names the trade-off
directly: the stricter the setting, the more often a legitimate question is blocked because it
uses different words from your documents, or because the topic is poorly documented. Treat a
blocked legitimate question as a signal about your content as well as about the slider — if the
same topic keeps being blocked, adding or improving the documents that cover it fixes the cause,
where loosening the slider only hides it.

Attribution protection works alongside two other answer checks, and they are tuned separately:

- [Semantic scoring](/governance/guardrails/semantic-scoring/) rates the whole answer against the
  KnowledgeBase sources it was built from.
- [Semantic model tuning](/configuration/semantic-model/) sets the penalties inside that score —
  among them a penalty for answers "missing KnowledgeBase attribution of proper nouns that were
  included in the search".

### Saving and scope

Your change applies once you select **Save** in the dialog footer. That one **Save** covers every
tab in the Guardrails dialog, so you can adjust attribution protection and other guardrails
together and save once; saving from Neural Config is described on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

Each **Guardrails** node opens its own dialog with its own **Save**, and the dialog title names
the configuration it belongs to — check that title before you save to be sure which
configuration you are editing.

## FAQ

### Legitimate questions are being blocked — what should I change?

Move the slider toward **Standard**. The help text says a rigid setting raises "the chances of
occasionally blocking legitimate questions that use alternate wording or are poorly documented in
your KnowledgeBase". Then look at the topics that were blocked and improve the documents that
cover them, so you do not need to loosen the setting further.

### How is this different from semantic scoring?

[Semantic scoring](/governance/guardrails/semantic-scoring/) checks the generated answer against
its KnowledgeBase sources and rates it as a whole. Attribution protection is narrower: it sets how
much text about your company, or associating people or things, you tolerate when the KnowledgeBase
has no specific reference for it. Both act on the generated answer, and you set them on separate
tabs of the same dialog.

### Can I use a stricter setting for one category?

Yes. Every category with a Custom Configuration has its own **Guardrails** node, and its own
**Attribution Protection** tab. Set that category toward **Rigid** and leave **Default Config**
toward **Standard**, or the other way round.

## Related

- [Guardrails overview](/governance/guardrails/overview/) — all ten tabs and which side of the
  model call each acts on
- [Semantic scoring](/governance/guardrails/semantic-scoring/) — the overall score of an answer
  against its sources
- [Minimum confidence](/governance/guardrails/min-confidence/) — the confidence thresholds below
  which an answer is replaced or shown with a warning
- [Semantic model tuning](/configuration/semantic-model/) — the penalties behind the semantic score
- [Tuning answers](/seek/tuning/) — Company / Organization Preferences, where you describe your
  company to NeuralSeek
- [Configuration overview](/configuration/overview/) — the routing tree, Default Config and Custom
  Configurations
