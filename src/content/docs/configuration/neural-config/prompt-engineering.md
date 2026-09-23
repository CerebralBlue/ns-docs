---
title: "Prompt Engineering"
description: "Prompt Engineering is the section of the Edit Configuration dialog where an expert user injects extra instructions into the LLM prompt and shifts NeuralSeek's baseline temperature, top probability, frequency penalty and maximum tokens by -100% to 100% — at the cost of support for the instance."
---

## What is it

**Prompt Engineering** is a section of the **Edit Configuration** dialog on the **Neural Config** screen. It is where you can add your own text to the prompt NeuralSeek sends to the LLM, and shift the sampling settings sent alongside it.

The section describes itself in one paragraph:

> Prompt Engineering allows expert users to inject specific instructions into the LLM prompt. Most usecases will not need this and should not use this. EG: do not enter "provide factual information" or "act as a helpful customer support agent". NeuralSeek's extensive prompting already does this.

It holds three things: a selector that enables the section, a free-text instruction box, and four sliders grouped under **Seek Weight Tuning.** On the playground captured for this page the selector reads `Disabled`, and the box and all four sliders are disabled with it — every image below shows that greyed state.

## Why it matters

This section is unusual for a settings page: the product asks you not to use it, and says so in a red box before you reach a control.

NeuralSeek builds its own prompt around your KnowledgeBase results, your language settings and your answer preferences. Instructions you add here are added to that prompt, not used instead of it — so a generic instruction ("be helpful", "be factual") duplicates work already done and can pull the answer away from the tuning NeuralSeek applied. The sliders behave the same way: each one shifts a baseline NeuralSeek chooses rather than setting a raw model parameter, and the **Maximum Tokens** slider says so in its own label — "Adjust our baseline".

The consequence is written into the selector's label, **Enable Prompt Engineering (Void all support and guarantees)**, and into the warning above it.

## When to use it

- Rarely. The product's position is that most instances should leave this section alone.
- You are an expert user with a specific instruction the rest of the configuration cannot express — the box's own label suggests a fallback behaviour — and you accept owning every answer problem that follows.
- You have already tried the supported controls: answer length lives on the **How verbose should an average answer be?** slider in **Answer Engineering & Preferences** (see [Tuning answers](/seek/tuning/)), and per-agent sampling lives on the NTL LLM node (see [Generate Data](/maistro/ntl/generate-data/)).

Do **not** use it to give the model a persona — the section's own paragraph gives "act as a helpful customer support agent" as an example of what not to enter — and do not use it to make a single agent behave differently: these settings belong to the configuration you opened, not to one agent.

## How it works

Open **Neural Config**, click the **Default Config / Answer Generation** node, then **Edit Configuration**. In the accordion that opens, expand **Prompt Engineering** — it is the ninth header, between **Corporate Logging** and **Dynamic Personalization**. (The dialog and the route to it are described on [Configuration overview](/configuration/overview/); the section headers are listed on [Neural Config](/configuration/neural-config/).)

![The Configuration: Default Config dialog with the Prompt Engineering accordion expanded, below Corporate Document Filter and Corporate Logging: the red warning box, the explanatory paragraph and the selector reading Disabled, with Propose Changes and Save in the footer](/img/neural-config/prompt-engineering.png)

The viewport shows only the top of the section; the rest sits below the fold. The section crops that follow are the pictures of each control.

### The warning and the switch

- **Prompt Engineering** — the accordion header. Expanding it shows a red-bordered box before anything else, then the explanatory paragraph quoted above, then the controls.
- **Enable Prompt Engineering (Void all support and guarantees)** — the selector for the whole section, shown as a dropdown with its label underneath. On the captured playground it reads `Disabled`; its menu was not opened, so the other option is not shown here. It is the control that turns the section on.

![The Prompt Engineering panel: header, the red WARNING box, the explanatory paragraph, the selector reading Disabled with its label Enable Prompt Engineering (Void all support and guarantees), the greyed instruction box and the start of Seek Weight Tuning](/img/neural-config/prompt-engineering-panel.png)

The box reads, verbatim (the double full stop is the screen's):

:::caution[Warning printed by the product]
WARNING: Your instance will not be supported while prompt engineering is enabled. When you encounter ANY issue after this moment - such as bad answers, wrong languages, or ANYTHING else - the issue is your prompt engineering, and you will need to disable it. Most likely you do not need Prompt Engineering, and should not use it..
:::

Read that as a support boundary rather than a warranty disclaimer: while the section is enabled, a bad answer is treated as your prompt first, and the first step asked of you is to turn the section off.

### The instruction box

- **Add specific instructions to the LLM prompt. This can help tune the system to fall back in specific ways.** — the free-text box your instructions go into; its label sits under the box. On the captured playground, with the selector at `Disabled`, the box is disabled and empty — it is the greyed area under the selector in the panel image above (this section shares that image).

The label is the intended use: an instruction about how the system should fall back — what to do when the KnowledgeBase does not carry the answer — rather than a general description of how the model should behave.

### Seek Weight Tuning — Temperature

**Seek Weight Tuning.** is the group label under the instruction box; it introduces four sliders. Each has a scale from `-100%` to `100%` and a **Slider value** readout on the right; each reads `0` on the captured playground, and each is disabled while the selector reads `Disabled`.

- **Temperature. How much variablity is provided in generated responses.** — shifts how much the wording of an answer is allowed to vary. Range `-100%` to `100%`; reads `0`. (`variablity` is the screen's spelling.)

![The Temperature slider, greyed: its label, the -100% and 100% scale ends, and a Slider value of 0](/img/neural-config/prompt-engineering--temperature-how-much-variablity-is-provi.png)

### Seek Weight Tuning — Top Probability

- **Top Probability. For each portion of the generation, what percentage of the top options are considered.** — shifts how wide a pool of candidate continuations the model draws from at each step. Range `-100%` to `100%`; reads `0`.

![The Top Probability slider, greyed: its label, the -100% and 100% scale ends, and a Slider value of 0](/img/neural-config/prompt-engineering--top-probability-for-each-portion-of-the-.png)

### Seek Weight Tuning — Frequency penalty

- **Frequency penalty. How much penalty to apply to generated portions of text that are repeated.** — shifts how strongly repeated phrasing is discouraged. Range `-100%` to `100%`; reads `0`.

![The Frequency penalty slider, greyed: its label, the -100% and 100% scale ends, and a Slider value of 0](/img/neural-config/prompt-engineering--frequency-penalty-how-much-penalty-to-ap.png)

### Seek Weight Tuning — Maximum Tokens

- **Maximum Tokens. Adjust our baseline (varies per answer verbosity) requested maximum tokens.** — shifts the cap on answer length NeuralSeek requests from the model. Range `-100%` to `100%`; reads `0`.

![The Maximum Tokens slider, greyed: its label, the -100% and 100% scale ends, and a Slider value of 0](/img/neural-config/prompt-engineering--maximum-tokens-adjust-our-baseline-varie.png)

This label is the on-screen evidence for how all four sliders work: `0` is not "off", it is NeuralSeek's baseline, and the scale is a relative adjustment to the value NeuralSeek would have chosen. For tokens that baseline is not fixed — it "varies per answer verbosity", which is the **How verbose should an average answer be?** slider in **Answer Engineering & Preferences**, documented on [Tuning answers](/seek/tuning/). If answer length is the only thing you want to change, that slider is the supported place.

### Seek-wide versus per-agent

The dialog's footer carries **Propose Changes** and **Save**; nothing in this section applies until one of them is pressed, and what each does is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

These settings belong to the configuration you opened — they change how NeuralSeek answers for that configuration, not how one agent behaves. A single mAIstro agent has its own knobs on the NTL LLM node ([Generate Data](/maistro/ntl/generate-data/)). The `ntl://reference` resource, read for this page, lists the node as:

```text
{{ LLM | prompt: "Your prompt here" | cache: "true" | images: "" | modelCard: "" | stream: "false" | maxTokens: "" | minTokens: "" | temperatureMod: "" | toppMod: "" | freqpenaltyMod: "" | timeout: "" }}
```

So the four sliders here have named counterparts on the node: `temperatureMod` ("Temperature modifier"), `toppMod` ("Top-p modifier"), `freqpenaltyMod` ("Frequency penalty modifier") and `maxTokens` ("Maximum tokens in the response"), plus `minTokens`. The reference documents no numeric range or default for them; its only concrete number is an example, `temperatureMod: "-0.5"` "for deterministic structured output".

<!-- UNCONFIRMED: the node's temperatureMod, toppMod and freqpenaltyMod run from -1 to 1 in steps of 0.01 with default 0 — old prose on /maistro/ntl/generate-data/ (status auto); the ntl://reference resource read in probe p32 shows the names but no range -->

The Generate Data page lists `-1` to `1` with a default of `0` for the three `*Mod` parameters, which would be the same relative scale the sliders show as a percentage. If only one agent needs different sampling, set it on that agent's node and leave this section disabled.

## FAQ

### Should I turn Prompt Engineering on?

The product's own answer is no: "Most likely you do not need Prompt Engineering, and should not use it." Its explanatory paragraph says NeuralSeek's prompting already covers instructions like "provide factual information" or "act as a helpful customer support agent", and the selector's label reads **Enable Prompt Engineering (Void all support and guarantees)**. Use it only when you have a specific instruction nothing else in the configuration can express.

### What happens to support if I enable it?

The warning states that "Your instance will not be supported while prompt engineering is enabled", and that any issue after that point — "bad answers, wrong languages, or ANYTHING else" — is treated as caused by your prompt engineering, with disabling it as the step you will be asked to take.

### The sliders run from -100% to 100% — what does 0 mean?

`0` is the baseline NeuralSeek would use on its own, not zero temperature or zero tokens. Each slider is a relative adjustment to that baseline, which is why **Maximum Tokens** describes itself as "Adjust our baseline (varies per answer verbosity)". A negative value pulls below the baseline, a positive value pushes above it.

### Why are the instruction box and the sliders greyed out?

Because the section is off. On the captured playground the selector **Enable Prompt Engineering (Void all support and guarantees)** reads `Disabled`, and the instruction box and all four **Seek Weight Tuning.** sliders are disabled with it. The selector is the control that turns the rest of the section on.

### I want different sampling for one agent only — is this the place?

No. Prompt Engineering belongs to the configuration as a whole. The NTL LLM node carries `temperatureMod`, `toppMod`, `freqpenaltyMod`, `maxTokens` and `minTokens` for one agent — see [Generate Data](/maistro/ntl/generate-data/). Setting them on the node leaves the rest of the instance supported.

### Where do I change answer length without enabling this?

Use **How verbose should an average answer be?** in the **Answer Engineering & Preferences** section of the same dialog, described on [Tuning answers](/seek/tuning/). It is the supported control for answer length, and it is the baseline the **Maximum Tokens** slider here would shift.
