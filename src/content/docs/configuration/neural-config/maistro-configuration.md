---
title: "mAIstro Configuration"
description: "The Edit Configuration section where external agent marketplaces are registered — one endpoint and one API key per marketplace, so their agents can be loaded in mAIstro."
---

## What is it

**mAIstro Configuration** is one section of the configuration accordion on the Neural Config screen. It holds a single list: the external marketplaces this instance may load agents from. Each entry is one row with two values, an **Endpoint** and an **API Key**.

The section's own description reads:

> Configure optional external marketplaces for mAIstro. Each marketplace requires an endpoint and API key. You may configure multiple marketplaces or leave the list empty.

"Optional" is exact — the list can be empty. An instance with no marketplace registered has no external source of agents; nothing else about it is incomplete.

## Why it matters

A registered marketplace widens what a builder can pick up in mAIstro without writing it: the agents the marketplace publishes become available on the [Agent Marketplace](/maistro/agent-marketplace/) screen. Nothing else on the instance changes — this section does not affect Seek, the KnowledgeBase, or how existing agents run.

It is also the one place where the credential for that marketplace lives, which makes it a section worth knowing about when a key is rotated or a source is retired.

## When to use it

- Your organisation keeps a shared library of agents or templates on another instance, and builders on this instance should be able to load from it.
- A partner or vendor publishes a marketplace you have been given an endpoint and key for.
- A marketplace key has been rotated, or a marketplace should no longer be available here.
- **Not** for NeuralSeek's own built-in agents and templates — those need no configuration.

## How it works

Open **Neural Config** and click the **Default Config** node. Its **Default Configuration** dialog has an **Edit Configuration** button, which opens the accordion titled **Configuration: Default Config**. **mAIstro Configuration** is the second-to-last header — below **Intent Matching & Cache Configuration**, directly above **Secrets** — and clicking it expands the section inline. The path is described in full on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Configuration: Default Config accordion scrolled to the end, with the mAIstro Configuration section expanded below Intent Matching & Cache Configuration; the Propose Changes and Save footer sits at the bottom](/img/neural-config/maistro-configuration.png)

The section is short: the paragraph quoted above, and a table beneath it.

### One endpoint and one API key per marketplace

![The mAIstro Configuration section: its description paragraph, then the Endpoint / API Key table with one filled row — the endpoint box, the masked key box with its eye icon, and the trash icon — and an empty last row holding the add icon](/img/neural-config/maistro-configuration--marketplace-endpoint.png)

The table has three columns — **Endpoint**, **API Key**, and a third, unlabelled column holding each row's action button. One row is one marketplace.

- **Marketplace endpoint** — the text box in the **Endpoint** column, labelled underneath, with placeholder `https://marketplace.example.com/api`. It takes the marketplace's API address. On the instance captured here the value is a NeuralSeek console URL of the form `https://console-partners.neuralseek.com/c1/<instance-id>/exploreTemplates` — another NeuralSeek instance's template library acting as the marketplace. That is the observed value only: the screen does not say what an endpoint must return, so it publishes no contract for a non-NeuralSeek marketplace.
- **Marketplace API key** — the text box in the **API Key** column, with placeholder `API key`. A saved key is masked and shows as `***`.
- **Show password** — the eye button beside the key box; it reveals the masked value. It was not pressed while this page was written, because the key is a live credential.
- **Add marketplace** — the icon in the empty last row of the table. Its tooltip reads **Add an external marketplace.** and it appends an empty **Endpoint** / **API Key** pair, which is how a second, third or further marketplace is registered.
- **Remove marketplace** — the trash icon in the action column of a filled row. Its tooltip reads **Remove this marketplace.** and it deletes that row. **Add marketplace** and **Remove marketplace** are the names a screen reader announces; the tooltips are what a sighted reader sees on hover.

Both values are required per the section's description: "Each marketplace requires an endpoint and API key." Neither the add nor the remove control was exercised during the capture behind this page — adding or removing a marketplace changes a shared instance — so this describes the controls the screen offers, not an observed before-and-after.

### Where the agents appear

Nothing on this screen shows the marketplace's contents. The agents a registered marketplace publishes appear in mAIstro, on the [Agent Marketplace](/maistro/agent-marketplace/) screen, where builders browse and load them. Whether they show up immediately after the configuration is saved, or only after the marketplace screen is reloaded, was not observed.

### Saving, and who sees the key

The section has no save control of its own. Changes are committed through the accordion's footer — **Propose Changes** or **Save** — and the dialog is closed with **Close** (×); all three are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

The key typed here is a credential for the marketplace, not a NeuralSeek one; NeuralSeek's own keys are covered on [API keys](/configuration/administration/api-keys/). One related setting lives a few sections higher in the same accordion: **Hide API Keys** on [Platform Preferences](/configuration/neural-config/platform-preferences/) hides the API keys of connected platforms from Configuration Admins, and its help text warns that it "will require you re-enter all API keys when importing a configuration file" and that "once set to true this option cannot be disabled."

## FAQ

### Do I have to configure a marketplace?

No. The section's own text says you "may configure multiple marketplaces or leave the list empty." An empty list is a valid configuration.

### What does one marketplace entry need?

Two values: an **Endpoint** (the marketplace's API address) and an **API Key**. The section states that each marketplace requires both.

### Can I register more than one marketplace?

Yes. Use the button in the table's last row, tooltip **Add an external marketplace.**, to append another **Endpoint** / **API Key** row. Remove one with the row's own button, tooltip **Remove this marketplace.**

### Can another NeuralSeek instance be a marketplace?

In practice yes. The entry on the instance captured here points at a NeuralSeek console URL ending in `exploreTemplates` — an instance's template library. The screen does not publish an endpoint contract, so for anything other than a NeuralSeek instance, ask whoever operates the marketplace for the endpoint to use.

### Where do the agents from a registered marketplace appear?

In mAIstro, on the [Agent Marketplace](/maistro/agent-marketplace/) screen. Whether they appear immediately after **Save** or only after a reload was not observed.

### Why is the API key shown as `***`?

A saved key is masked in the **API Key** box. The **Show password** button beside it reveals the value; visibility of connected-platform keys to Configuration Admins is also governed by **Hide API Keys** on [Platform Preferences](/configuration/neural-config/platform-preferences/).
