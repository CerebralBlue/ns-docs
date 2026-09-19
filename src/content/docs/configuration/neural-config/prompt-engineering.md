---
title: "Prompt Engineering"
description: "Prompt Engineering is the section of the Edit Configuration dialog where an expert user injects extra instructions into the LLM prompt and shifts NeuralSeek's baseline temperature, top probability, frequency penalty and token cap — at the cost of support for the instance."
---

## What is it

**Prompt Engineering** is a section of the **Edit Configuration** dialog on the **Neural Config** screen. It is the only place in NeuralSeek where you can change the text of the prompt NeuralSeek sends to the LLM, and the sampling settings it sends alongside it.

The section describes itself in one paragraph:

> Prompt Engineering allows expert users to inject specific instructions into the LLM prompt. Most usecases will not need this and should not use this. EG: do not enter "provide factual information" or "act as a helpful customer support agent". NeuralSeek's extensive prompting already does this.

It holds three things: a switch, a free-text instruction box, and four sliders grouped under **Seek Weight Tuning.** Everything except the switch stays disabled until the switch is on.

## Why it matters

This section is unusual for a settings page: the product asks you not to use it, and says so in a red box before you can reach a control.

NeuralSeek builds its own prompt around your knowledgebase results, your language settings and your answer preferences. Instructions you add here are added to that prompt, not instead of it — so a generic instruction ("be helpful", "be factual") duplicates work already done and can pull the answer away from the tuning NeuralSeek applied. The sliders behave the same way: they shift a baseline that NeuralSeek varies per answer rather than setting a raw model parameter.

The consequence is written into the switch's own label, **Enable Prompt Engineering (Void all support and guarantees)**, and into the warning above it.

## When to use it

- Rarely. The product's position is that most instances should leave this section alone.
- You are an expert user with a specific instruction the rest of the configuration cannot express — a fallback phrasing, a domain constraint — and you accept owning every answer problem that follows.
- You have already tried the supported controls: answer length and verbosity live on the **How verbose should an average answer be?** slider in **Answer Engineering & Preferences** (see [Tuning answers](/seek/tuning/)), and per-agent sampling lives on the NTL LLM node (see [Generate Data](/maistro/ntl/generate-data/)).

Do **not** use it to set the tone or the persona of answers, and do not use it to make a single agent behave differently — these settings apply to the whole configuration, not to one agent.

## How it works

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration** in the dialog. In the accordion that opens, expand **Prompt Engineering** — it sits between **Corporate Logging** and **Dynamic Personalization**. (The dialog itself and the route to it are described on [Configuration overview](/configuration/overview/).)

![The Prompt Engineering section of the Edit Configuration dialog, expanded: the red warning box, the explanatory paragraph, and the enable switch set to Disabled](/img/neural-config/prompt-engineering.png)

### The warning the section opens with

- **Prompt Engineering** — the accordion header. Expanding it shows a red-bordered box before anything else, then the explanatory paragraph quoted above, then the controls.

The box reads, verbatim:

:::caution[Warning printed by the product]
WARNING: Your instance will not be supported while prompt engineering is enabled. When you encounter ANY issue after this moment - such as bad answers, wrong languages, or ANYTHING else - the issue is your prompt engineering, and you will need to disable it. Most likely you do not need Prompt Engineering, and should not use it..
:::

Read that as a support boundary rather than a warranty disclaimer: while the switch is on, a bad answer is investigated as your prompt first, and the first step asked of you is to turn the section off.

### Turning it on

- **Enable Prompt Engineering (Void all support and guarantees)** — the switch for the whole section, shown as a dropdown. On the captured instance it reads `Disabled`, which is also what leaves the rest of the section inert.
- **Add specific instructions to the LLM prompt. This can help tune the system to fall back in specific ways.** — the free-text box your instructions go into. It is `disabled` and empty while the switch reads `Disabled`; the switch is what unlocks it.

The label on the box is the intended use: a fallback instruction — what the model should do when it cannot answer from the knowledgebase — rather than a general description of how to behave.

### Seek Weight Tuning — the four sliders

**Seek Weight Tuning.** labels a group of four sliders. Each one is a slider with a **Slider value** spinbutton beside it, each runs from `-100%` to `100%`, and each reads `0` on the captured instance. Like the instruction box, all four are disabled while the switch is off.

**`0` is not "off" — it is NeuralSeek's baseline.** The scale is a relative adjustment: moving a slider shifts the value NeuralSeek would have chosen up or down, it does not set the parameter the model receives. The **Maximum Tokens** label says so outright — "Adjust our baseline".

| Slider (label as shown) | What it adjusts |
| --- | --- |
| **Temperature. How much variablity is provided in generated responses.** | How much the generated wording is allowed to vary between otherwise identical answers. |
| **Top Probability. For each portion of the generation, what percentage of the top options are considered.** | How wide a pool of candidate continuations the model samples from at each step. |
| **Frequency penalty. How much penalty to apply to generated portions of text that are repeated.** | How strongly repeated phrasing is discouraged. |
| **Maximum Tokens. Adjust our baseline (varies per answer verbosity) requested maximum tokens.** | The requested cap on answer length. The baseline is not fixed — it varies with the answer verbosity setting. |

(`variablity` is the screen's spelling.)

![Screenshot needed — the four Seek Weight Tuning sliders with their -100% … 100% scales and Slider value spinbuttons](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > Prompt Engineering, scrolled down to Seek Weight Tuning — the four sliders (Temperature, Top Probability, Frequency penalty, Maximum Tokens) with their scale endpoints and spinbutton readouts.
     Why: the existing capture stops above the group, and the four controls are the part of the section a reader is most likely to be looking for. -->

### Saving, and how far the settings reach

The dialog's footer carries **Save** and **Propose Changes**; which one you get and what each does is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

These settings belong to the configuration you opened — they change how NeuralSeek answers, instance-wide for that configuration, not one agent's behaviour. The same three sampling parameters exist per agent as overrides on the NTL LLM node: [Generate Data](/maistro/ntl/generate-data/) documents `temperatureMod`, `toppMod` and `freqpenaltyMod` (each `-1` to `1`, default `0` — the same relative scale the sliders show as a percentage), plus `maxTokens` and `minTokens` to override the template's token limits. If only one agent needs different sampling, use the node parameters and leave this section disabled.

## FAQ

### Should I use Prompt Engineering?

The product's own answer is no: "Most likely you do not need Prompt Engineering, and should not use it." NeuralSeek already prompts the model for factual, on-topic, correctly-languaged answers, so generic instructions duplicate or contradict that work. Use it only when you have a specific instruction nothing else in the configuration can express.

### What does enabling it cost me?

Support. The warning states that "Your instance will not be supported while prompt engineering is enabled", and that any issue after that point — bad answers, wrong languages, anything else — is treated as caused by your prompt, with disabling the section as the first step. The switch's own label repeats it: **Enable Prompt Engineering (Void all support and guarantees)**.

### The sliders run from -100% to 100% — what does 0 mean?

`0` means NeuralSeek's baseline, not zero temperature or zero tokens. Each slider is a relative adjustment to the value NeuralSeek would otherwise have used, which is why **Maximum Tokens** describes itself as "Adjust our baseline (varies per answer verbosity)". A negative value pulls below that baseline, a positive value above it.

### Why can't I type in the instructions box?

Because the section is off. **Add specific instructions to the LLM prompt.** and all four **Seek Weight Tuning.** sliders are disabled until **Enable Prompt Engineering (Void all support and guarantees)** is switched on.

### I only want different sampling for one agent — do I need this?

No. Prompt Engineering applies to the configuration as a whole. A single agent can override temperature, top probability, frequency penalty and its token limits on its LLM node instead — see [Generate Data](/maistro/ntl/generate-data/). That route leaves the rest of the instance supported.

### Where can I change answer length without enabling this?

Use **How verbose should an average answer be?** in the **Answer Engineering & Preferences** section of the same dialog, described on [Tuning answers](/seek/tuning/). It is the supported control for answer length; the **Maximum Tokens** slider here is not a substitute for it.
