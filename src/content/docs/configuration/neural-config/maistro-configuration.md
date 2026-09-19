---
title: "mAIstro Configuration"
description: "The Edit Configuration section where external agent marketplaces are registered — one endpoint and one API key per marketplace, so their agents can be loaded in mAIstro."
---

## What is it

**mAIstro Configuration** is one section of the **Edit Configuration** dialog on the Neural Config screen. It holds a single list: the external marketplaces this instance may load agents from. Each entry is one row with two values, an **Endpoint** and an **API Key**.

The section's own description reads:

> Configure optional external marketplaces for mAIstro. Each marketplace requires an endpoint and API key. You may configure multiple marketplaces or leave the list empty.

"Optional" is exact — the list can be empty. An instance with no marketplace registered simply has no external source of agents; nothing else about it is incomplete.

## Why it matters

A registered marketplace widens what a builder can pick up in mAIstro without writing it: the agents the marketplace publishes become available in the [Agent Marketplace](/maistro/agent-marketplace/). Nothing else on the instance changes — this section does not affect Seek, the KnowledgeBase, or how existing agents run.

It is also the one place where the credential for that marketplace lives, which makes it a section worth knowing about when a key is rotated or a source is retired.

## When to use it

- Your organisation keeps a shared library of agents or templates on another instance, and builders on this instance should be able to load from it.
- A partner or vendor publishes a marketplace you have been given an endpoint and key for.
- A marketplace key has been rotated, or a marketplace should no longer be available here.
- **Not** for NeuralSeek's own built-in agents and templates — those need no configuration.

## How it works

### Finding the section

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration** in that dialog's footer. The configuration dialog is an accordion; **mAIstro Configuration** is the second-to-last header, directly above **Secrets**. Clicking the header expands the section.

![The Edit Configuration dialog scrolled to the end, with the mAIstro Configuration section expanded below Intent Matching & Cache Configuration; the Propose Changes and Save footer sits at the bottom](/img/neural-config/maistro-configuration.png)

The section is short: the paragraph quoted above, and a table beneath it.

### One row per marketplace

The table has three columns — **Endpoint**, **API Key**, and a third, unlabelled column holding each row's action button.

- **Marketplace endpoint** — the text box in the **Endpoint** column, with placeholder `https://marketplace.example.com/api`. It takes the marketplace's API address. On the instance captured here the value is a NeuralSeek console URL of the form `https://console-partners.neuralseek.com/c1/<instance-id>/exploreTemplates` — in other words, another NeuralSeek instance's template library can act as the marketplace. The screen does not state what a non-NeuralSeek endpoint must return.
- **Marketplace API key** — the text box in the **API Key** column, with placeholder `API key`. A saved key is masked and shows as `***`.
- **Show password** — the button beside the key box; it reveals the masked value.

Both values are required per the section's description: "Each marketplace requires an endpoint and API key."

### Adding and removing marketplaces

The last row of the table is the add row. Its button carries the tooltip **Add an external marketplace.** and appends an empty **Endpoint** / **API Key** pair, so more than one marketplace can be registered.

Each filled row carries its own button in the action column, with the tooltip **Remove this marketplace.**, which deletes that row.

Neither control was exercised during the capture behind this page — adding or removing a marketplace changes a live instance — so what is described here is the controls the screen offers, not an observed before-and-after.

### Saving, and who sees the key

The section has no save control of its own. Changes are committed through the dialog's footer — **Propose Changes** or **Save** — and the dialog is closed with **Close** (×); all three are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

The key you type here is a credential for the marketplace, not a NeuralSeek one; NeuralSeek's own keys are covered on [API keys](/configuration/administration/api-keys/). One related setting lives a few sections higher: **Hide API Keys** on [Platform Preferences](/configuration/neural-config/platform-preferences/) hides the API keys of connected platforms from Configuration Admins, and its help text warns that it "will require you re-enter all API keys when importing a configuration file" and that "once set to true this option cannot be disabled."

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
