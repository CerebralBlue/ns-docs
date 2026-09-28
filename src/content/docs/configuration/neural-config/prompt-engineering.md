---
title: "Prompt Engineering"
description: "Prompt Engineering is the Neural Config section where an expert user adds instructions to NeuralSeek's LLM prompt and offsets temperature, top probability, frequency penalty and maximum tokens for Seek answers, at the cost of support for the instance."
---

## What is it

**Prompt Engineering** is a section of the configuration dialog you open from the **Neural Config** screen. It lets you add your own text to the prompt NeuralSeek sends to the LLM, and shift four generation settings that NeuralSeek otherwise chooses for you.

The section describes itself in one paragraph:

> Prompt Engineering allows expert users to inject specific instructions into the LLM prompt. Most usecases will not need this and should not use this. EG: do not enter "provide factual information" or "act as a helpful customer support agent". NeuralSeek's extensive prompting already does this.

It holds three things:

- a selector, **Enable Prompt Engineering (Void all support and guarantees)**, that switches the section on;
- a free-text instruction box;
- four sliders grouped under the heading **Seek Weight Tuning.**: Temperature, Top Probability, Frequency penalty and Maximum Tokens.

## Why it matters

This is one of the few settings sections where the product asks you not to use it. Expanding the section shows a red warning before any control:

:::caution[Warning printed by the product]
WARNING: Your instance will not be supported while prompt engineering is enabled. When you encounter ANY issue after this moment - such as bad answers, wrong languages, or ANYTHING else - the issue is your prompt engineering, and you will need to disable it. Most likely you do not need Prompt Engineering, and should not use it..
:::

The double full stop is the screen's. Read the warning as a support boundary. While the section is enabled, a bad answer is treated as caused by your prompt engineering, and the first thing you will be asked to do is turn the section off. The selector's own label says the same: **Enable Prompt Engineering (Void all support and guarantees)**.

What you type here is added on top of NeuralSeek's own prompting. It does not replace that prompting. According to the section's paragraph, that prompting already covers generic instructions such as "provide factual information", so repeating them adds nothing.

## When to use it

- **Rarely.** The paragraph says "Most usecases will not need this and should not use this."
- Use it when you are an expert user with a specific instruction that no other section of the configuration can express, and you accept owning every answer problem that follows. The instruction box's label says what it is for: tuning how the system falls back.
- Try the supported controls first. For answer length, use the **How verbose should an average answer be?** slider in **Answer Engineering & Preferences**, described on [Tuning answers](/seek/tuning/).

Do **not** use it to give the model a persona or to ask for factual answers. The section's paragraph names "provide factual information" and "act as a helpful customer support agent" as examples of what not to enter, because NeuralSeek's prompting already does both.

## How it works

Open **Neural Config** and click the **Default Config / Answer Generation** node, then **Edit Configuration**. In the dialog, expand **Prompt Engineering**, which sits between **Corporate Logging** and **Dynamic Personalization**. [Configuration overview](/configuration/overview/) describes the dialog and how to reach it, and [Neural Config](/configuration/neural-config/) lists every section header.

### Turning Prompt Engineering on, and the instruction box

![The Prompt Engineering section expanded in the Configuration: Default Config dialog, below Corporate Logging: the red WARNING box, the explanatory paragraph and the selector reading Disabled, with Propose Changes and Save in the footer. The selector's label and the instruction box sit just below the bottom of this image.](/img/neural-config/prompt-engineering-panel.png)

- **Prompt Engineering**: the accordion header. Expanding it shows the warning first, then the explanatory paragraph, then the controls.
- **Enable Prompt Engineering (Void all support and guarantees)**: the dropdown that governs the whole section. The screen shows it reading `Disabled`. While it reads Disabled, the instruction box and all four sliders below it are greyed out. To use the section, switch it from Disabled.
- **Add specific instructions to the LLM prompt. This can help tune the system to fall back in specific ways.**: the free-text box your instructions go into. Its label, printed under the box, is also its help text. The screen does not say where in NeuralSeek's prompt the text is placed, or how long it may be.

Write an instruction about a specific fallback behaviour. Do not write a general description of how the model should act. Leave out the paragraph's two examples, "provide factual information" and "act as a helpful customer support agent", because NeuralSeek's prompting already does both.

### Seek Weight Tuning — Temperature

![The Temperature slider, greyed out: its label, the -100% and 100% scale ends, and a value box reading 0](/img/neural-config/prompt-engineering--temperature.png)

**Seek Weight Tuning.** is the heading under the instruction box. It introduces four sliders. Each one is an offset rather than a raw model setting:

- its track runs from `-100%` to `100%`;
- it rests at the centre;
- a **Slider value** box to its right shows the number.

A value of 0 appears to leave NeuralSeek's own baseline unchanged. The heading says these sliders tune Seek. The screen does not say whether they also apply to other LLM calls.

- **Temperature. How much variablity is provided in generated responses.** ("variablity" is the screen's spelling.) Temperature controls how much the LLM's wording varies. Moving the slider towards `100%` allows more varied phrasing from one answer to the next. Moving it towards `-100%` makes answers more repeatable. Change it only when answers read too uniform or too loose, and only after the supported answer settings have not helped.

### Top Probability

![The Top Probability slider, greyed out: its label, the -100% and 100% scale ends, and a value box reading 0](/img/neural-config/prompt-engineering--top-probability.png)

- **Top Probability. For each portion of the generation, what percentage of the top options are considered.** This slider widens or narrows the pool of candidate words the LLM picks from at each step. Moving it towards `100%` appears to let the LLM consider a larger share of candidates, which gives more varied wording. Moving it towards `-100%` keeps the LLM to the most likely candidates.

### Frequency penalty

![The Frequency penalty slider, greyed out: its label, the -100% and 100% scale ends, and a value box reading 0](/img/neural-config/prompt-engineering--frequency-penalty.png)

- **Frequency penalty. How much penalty to apply to generated portions of text that are repeated.** (The screen writes "penalty" in lower case.) Use this slider when answers repeat the same phrases. Moving it towards `100%` penalises repeated text more strongly. Moving it towards `-100%` penalises it less.

### Maximum Tokens

![The Maximum Tokens slider, greyed out: its label, the -100% and 100% scale ends, and a value box reading 0](/img/neural-config/prompt-engineering--maximum-tokens.png)

- **Maximum Tokens. Adjust our baseline (varies per answer verbosity) requested maximum tokens.** This slider raises or lowers the answer-length cap that NeuralSeek requests from the LLM. Moving it towards `100%` requests a higher cap than NeuralSeek would choose on its own. Moving it towards `-100%` requests a lower cap.

This label shows most clearly that the sliders adjust a baseline: "Adjust our baseline". The label also says the baseline for tokens is not fixed: it "varies per answer verbosity". That is the **How verbose should an average answer be?** slider in **Answer Engineering & Preferences**, documented on [Tuning answers](/seek/tuning/). If answer length is all you want to change, use that slider instead. It does not require enabling this section.

### The same knobs for a single mAIstro agent

A mAIstro agent that calls an LLM through the NTL LLM node has its own per-call settings on that node. See [Generate Data](/maistro/ntl/generate-data/). Changing an agent there leaves this section, and the instance's support, untouched.

**Propose Changes** and **Save** in the dialog's footer apply to this section like any other. [Using the Neural Config page](/configuration/neural-config/using-this-page/) covers what each one does.

## FAQ

### Will NeuralSeek support still help if I enable Prompt Engineering?

No. The warning states that "Your instance will not be supported while prompt engineering is enabled". It adds that any issue after that point, "bad answers, wrong languages, or ANYTHING else", is treated as caused by your prompt engineering. Disable the section before you report a problem.

### Should I tell the LLM to "act as a helpful customer support agent"?

No. The section's own paragraph gives that exact phrase, and "provide factual information", as examples of what not to enter: "NeuralSeek's extensive prompting already does this."

### Why are the instruction box and the sliders greyed out?

The section is off. While **Enable Prompt Engineering (Void all support and guarantees)** reads Disabled, the instruction box and all four **Seek Weight Tuning.** sliders are greyed out. To use them, switch that selector from Disabled.

### What does 0 on the sliders mean?

Each slider runs from -100% to 100% around NeuralSeek's own baseline, and 0 appears to leave that baseline unchanged. It does not mean zero temperature or zero tokens. The **Maximum Tokens** label describes itself as "Adjust our baseline", and a negative value pulls below that baseline.

### Can one agent use a different temperature?

Yes. Use the NTL LLM node in that agent's flow, described on [Generate Data](/maistro/ntl/generate-data/). This section belongs to the configuration you opened, not to one agent.
