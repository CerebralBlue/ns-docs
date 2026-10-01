---
title: "Prompt Engineering"
description: "Prompt Engineering is the Neural Config section where an expert user adds instructions to NeuralSeek's LLM prompt and offsets temperature, top probability, frequency penalty and maximum tokens for Seek answers, at the cost of support for the instance."
---

**Prompt Engineering** lets an expert user add their own instructions to the prompt NeuralSeek sends to the LLM, and shift four generation settings that NeuralSeek otherwise chooses for every Seek answer. It is the last resort among the answer settings: most answer problems are better solved in [Tuning answers](/seek/tuning/) or by choosing a different model in [LLM Details](/configuration/neural-config/llm-details/), and turning this section on ends support for the instance.

The section opens with this warning:

:::caution[Your instance is not supported while prompt engineering is enabled]
"WARNING: Your instance will not be supported while prompt engineering is enabled. When you encounter ANY issue after this moment - such as bad answers, wrong languages, or ANYTHING else - the issue is your prompt engineering, and you will need to disable it. Most likely you do not need Prompt Engineering, and should not use it."
:::

Treat the warning as a support boundary. While the section is enabled, any bad answer is attributed to your prompt engineering, and the first step in any support case is to turn it off.

## Where to find it

1. Open **Neural Config** and select the **Default Config / Answer Generation** node.
2. Select **Edit Configuration**. The **Configuration: Default Config** dialog opens.
3. Expand **Prompt Engineering**, between **Corporate Logging** and **Dynamic Personalization**.

A category that has its own **Custom Configuration** has the same section in its configuration dialog, so a category can carry its own prompt engineering. How categories, **Save** and **Propose Changes** work is described in [Using the Neural Config page](/configuration/neural-config/using-this-page/); the other sections of the dialog are listed in [Neural Config](/configuration/neural-config/).

## Settings

### Enable Prompt Engineering

![The Prompt Engineering section expanded: the red warning box, the description, the Enable Prompt Engineering dropdown set to Disabled, the greyed-out instruction box, and the start of Seek Weight Tuning, with Propose Changes and Save in the dialog footer](/img/neural-config/prompt-engineering-panel.png)

The section describes its purpose in one paragraph:

> Prompt Engineering allows expert users to inject specific instructions into the LLM prompt. Most usecases will not need this and should not use this. EG: do not enter "provide factual information" or "act as a helpful customer support agent". NeuralSeek's extensive prompting already does this.

| Setting                                                         | What it does                                                                                                                                         | When to change it                                                                                                                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Enable Prompt Engineering (Void all support and guarantees)** | Turns the whole section on. While it reads **Disabled**, the instruction box and every **Seek Weight Tuning.** slider are greyed out and have no effect. | Only when you need an instruction or a generation offset that no supported setting can express, and you accept that the instance is unsupported while it is enabled. |
| Instruction box                                                 | Holds the text you add to the LLM prompt. Its help text reads "Add specific instructions to the LLM prompt. This can help tune the system to fall back in specific ways." | When the LLM needs one specific instruction, such as how to fall back in a particular situation.                                                                      |

What you enter is injected into NeuralSeek's own prompt; it does not replace it. That is why generic instructions add nothing: the description names "provide factual information" and "act as a helpful customer support agent" as examples of what not to enter, because NeuralSeek's prompting already covers them. Keep an instruction narrow and specific to your use case.

To turn the section off again, set **Enable Prompt Engineering (Void all support and guarantees)** back to **Disabled** and select **Save**.

### Seek Weight Tuning

The four sliders under **Seek Weight Tuning.** adjust how the LLM generates Seek answers. Each one is an offset from the value NeuralSeek would use on its own, not a raw model parameter: the track runs from `-100%` to `100%`, and the number beside the track shows the current value. A slider stays greyed out while **Enable Prompt Engineering (Void all support and guarantees)** reads **Disabled**.

<!-- UNCONFIRMED: 0 leaves NeuralSeek's baseline unchanged — inferred from the -100%…100% scale, the midpoint position and the "Adjust our baseline" help text of Maximum Tokens; not observed in an answer -->

A value of 0 sits at the centre of the track and leaves NeuralSeek's baseline as it is. Move one slider at a time and compare answers to the same question before and after, so you can tell which change made the difference.

#### Temperature

![The Temperature slider with its help text, the -100% and 100% ends of the track, and the value box](/img/neural-config/prompt-engineering--temperature-how-much-variablity-is-provi.png)

**Temperature** sets "how much variablity is provided in generated responses" (the screen's spelling). Moving it towards `100%` lets the wording vary more from one answer to the next; moving it towards `-100%` makes answers more repeatable. Lower it when the same question gets noticeably different answers and you need them consistent.

#### Top Probability

![The Top Probability slider with its help text, the -100% and 100% ends of the track, and the value box](/img/neural-config/prompt-engineering--top-probability-for-each-portion-of-the-.png)

**Top Probability** sets, "for each portion of the generation, what percentage of the top options are considered". Moving it towards `100%` lets the LLM choose from a larger share of its candidate words, which gives more varied wording; moving it towards `-100%` keeps it to the most likely candidates. It works in the same direction as **Temperature**, so change one or the other, not both at once.

#### Frequency penalty

![The Frequency penalty slider with its help text, the -100% and 100% ends of the track, and the value box](/img/neural-config/prompt-engineering--frequency-penalty-how-much-penalty-to-ap.png)

**Frequency penalty** sets "how much penalty to apply to generated portions of text that are repeated". Raise it when answers repeat the same phrase or sentence; lower it when an answer has to repeat exact terms, such as product names or field labels, and the LLM avoids them.

#### Maximum Tokens

![The Maximum Tokens slider with its help text, the -100% and 100% ends of the track, and the value box](/img/neural-config/prompt-engineering--maximum-tokens-adjust-our-baseline-varie.png)

**Maximum Tokens** adjusts "our baseline (varies per answer verbosity) requested maximum tokens" — the cap on answer length that NeuralSeek requests from the LLM. Moving it towards `100%` requests a higher cap; moving it towards `-100%` a lower one, which can cut long answers short.

The baseline follows **How verbose should an average answer be?** in **Answer Engineering & Preferences**, documented in [Tuning answers](/seek/tuning/). If answer length is all you want to change, use that setting instead: it is supported and does not require enabling this section.

<!-- UNCONFIRMED: the NTL LLM node has per-call overrides for temperature, top probability, frequency penalty and max tokens — from the Generate Data page (ported old prose), not on this screen -->

These sliders apply to Seek answers. A mAIstro agent that calls an LLM through the NTL LLM node sets its own generation parameters on that node, described in [Generate Data](/maistro/ntl/generate-data/); tuning one agent there leaves this section untouched.

## FAQ

### Should I enable prompt engineering?

Usually not. The section itself says most use cases do not need it, and the instance is not supported while it is enabled. Try the settings in [Tuning answers](/seek/tuning/) (answer length, Company / Organization Preferences, Answer Engineering & Preferences) and a different model in [LLM Details](/configuration/neural-config/llm-details/) first.

### Why are the instruction box and the sliders greyed out?

The section is off. They stay disabled until **Enable Prompt Engineering (Void all support and guarantees)** is changed from **Disabled**.

### Does a Temperature of 50 mean a temperature of 0.5?

No. The sliders offset NeuralSeek's own baseline by a percentage between `-100%` and `100%`; they do not set the model's temperature, top probability, penalty or token count directly.

### What should I not write in the instructions?

Generic persona or accuracy instructions such as "provide factual information" or "act as a helpful customer support agent". NeuralSeek's prompting already does this, so repeating it adds nothing.

## Related

- [Neural Config](/configuration/neural-config/) — every section of the configuration dialog
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — saving, proposing changes and category configurations
- [Tuning answers](/seek/tuning/) — answer verbosity and the supported answer settings
- [LLM Details](/configuration/neural-config/llm-details/) — which model generates Seek answers
- [Generate Data](/maistro/ntl/generate-data/) — the NTL LLM node and its own generation settings
