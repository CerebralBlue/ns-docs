---
title: "Neural Config options"
description: "A directory of the Edit Configuration dialog on the Neural Config screen: its fourteen sections in screen order, one line each, with a link to the page that documents every setting inside them."
---

## What is it

**Neural Config** (`/configure`) holds the settings an instance answers with. Almost all of them
live in one dialog: click the **Default Config** node on the routing tree, then **Edit
Configuration**, and a dialog headed `Configuration: Default Config` opens with fourteen
collapsible sections in it.

This page is the directory to those fourteen sections. It lists them in the order the dialog
shows them, says in one line what each one is for, and links to the page that documents its
settings. It documents no setting itself — the owning page is the source.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase is behind this dialog:
which store is queried, which models answer and embed, how long answers are cached, what is
logged, how verbose an answer is. The sections are named for what they configure, not for the
symptom you arrived with, so "answers are too long" and "answers are stale" both take a moment
to place. Reading the list here is faster than opening fourteen accordions.

Skip this page when you already know the section: open its page directly from the sidebar,
which describes every control in it. Come here when you have a symptom and no section name yet,
or when a setting you expected to find in the dialog is not there — the last part of this page
says where it went instead.

## When to use it

- You know what you want to change but not which section owns it.
- You are reviewing a new instance section by section and want a checklist.
- You went looking in this dialog for guardrails, backups or categories and did not find them —
  the last section below says where they are instead.

## How it works

### Opening the dialog

Open **Neural Config** from the top navigation, click the **Default Config** node at the
top-left of the routing tree, then **Edit Configuration** in the dialog that opens. The tree,
its nodes and that first dialog are described on
[Configuration overview](/configuration/overview/).

![The Edit Configuration dialog open over the Neural Config routing tree, headed Configuration: Default Config, showing the collapsed accordion sections from KnowledgeBase Connection down to Intent Matching and Cache Configuration, with Propose Changes and Save in the footer](/img/neural-config/edit-configuration-edit.png)

The dialog is a scrolling list of accordion headers — click one to expand it, and the settings
it holds appear underneath. **Close** (×) is top-right; the footer holds **Propose Changes** and
**Save**, which are documented on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

<!-- UNCONFIRMED: a category's Custom Configuration opens this same fourteen-section dialog against that category — old page prose; Add/Edit Custom Configuration was never opened in the capture -->

Categories whose node reads `Custom Configuration` have settings of their own; the old
documentation described them as the same dialog opened against that category. Categories and
the tree are on [Configuration overview](/configuration/overview/).

### The fourteen sections, in screen order

![The accordion list of the Configuration: Default Config dialog, twelve headers visible from KnowledgeBase Connection to Intent Matching and Cache Configuration, with Propose Changes and Save in the footer](/img/neural-config/edit-configuration-edit--edit-configuration-edit.png)

Twelve headers fit in the dialog when it opens; the last two — mAIstro Configuration and
Secrets — are below the fold, so scroll the list to reach them.

1. **KnowledgeBase Connection** — which store NeuralSeek queries: **KnowledgeBase Type**,
   **KnowledgeBase Language** and a free-text **Notes** box. See
   [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/).
2. **KnowledgeBase Tuning** — how much documentation, and which documentation, reaches the LLM:
   **Document Score Range**, **Max Documents per Seek**, **Document Date Penalty**, the
   **Expansion Window**, **KnowledgeBase Query Cache (minutes)**, **Max Raw Score** and the
   **mAIstro Post-KB Agent** that can run between retrieval and answering. There is no
   snippet-size control in this section, even though its introductory paragraph mentions one.
   See [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/).
3. **LLM Details** — **Add an LLM**, one card per model, and which of the twenty **LLM
   Functions** (Seek, PII Detection, Translate, maistro and the rest) each model performs. Its
   sub-topic is the NeuralSeek-managed model,
   [Managed LLM details](/configuration/neural-config/managed-llm/): the playground shows two
   managed cards but no model or version picker for them on the captured screen. See
   [LLM details](/configuration/neural-config/llm-details/).
4. **Embedding Models** — **Add an Embedding**, and the three roles an embedding card can be
   assigned to: **KB Search**, **mAIstro** and **Vector Intent**. See
   [Embedding models](/configuration/neural-config/embedding-models/).
5. **Company / Organization Preferences** — the company or organization display name,
   **Company Response Affinity**, and the **Stump Speech** block of text passed to the LLM on
   every Seek. This section has no page of its own yet; until it does, the nearest coverage is
   [Tuning answers](/seek/tuning/).
6. **Platform Preferences** — instance-wide behaviour: context turns and timeouts, the
   **Detection Method** and its **mAIstro flow**, **Virtual Agent Type**, **Default Output
   Language**, the HTML cleanser, and the **Configuration Save Agent** and **Post-Seek mAIstro
   Agent** hooks. See
   [Platform preferences](/configuration/neural-config/platform-preferences/).
7. **Corporate Document Filter** — **Enable Corporate Filter** and the endpoint NeuralSeek
   calls to decide which documents a user may see. See
   [Corporate document filter](/governance/corporate-document-filter/).
8. **Corporate Logging** — **Enable Corporate Logging**, the **Logger Service**, its
   **Logger Endpoint** and **Logger API Key**, a **Test** button, and **Prompt Logging**. See
   [Corporate logging](/governance/logging/).
9. **Prompt Engineering** — expert-only injection of instructions into the LLM prompt, behind
   **Enable Prompt Engineering (Void all support and guarantees)**, plus the sampling controls
   (Temperature, Top Probability, Frequency penalty, Maximum Tokens). See
   [Prompt engineering](/configuration/neural-config/prompt-engineering/).
10. **Dynamic Personalization** — **Enable Dynamic Personalization** and the **mAIstro
    Personalization Agent** that tailors answers per user. See
    [Personalization](/seek/personalization/).
11. **Answer Engineering & Preferences** — **How verbose should an average answer be?**,
    **Force Answers from the Knowledgebase**, and a **Regular Expression** / **Replacement**
    table with **Add a new row.** This section has no page of its own yet; the verbosity slider
    and the force switch are covered on [Tuning answers](/seek/tuning/).
12. **Intent Matching & Cache Configuration** — **Intent Match Tolerance**, the two answer
    caches (**Edited answer cache** and **Normal answer cache**) and the two "Require Cache…"
    switches under them. See
    [Intent matching and caching](/configuration/neural-config/intent-matching-caching/).
13. **mAIstro Configuration** — optional external agent marketplaces, a table of **Endpoint**
    and **API Key** rows with **Add an external marketplace.** See
    [mAIstro configuration](/configuration/neural-config/maistro-configuration/).
14. **Secrets** — the instance secret store, a table of **Name** and **Value** rows with
    **Add a new row.** See [Secrets](/configuration/neural-config/secrets/).

### Settings that are not in this dialog

Four groups of settings live on the Neural Config screen but outside the accordion, so looking
for them here is a dead end:

- **Guardrails** — the tabs that check a question and an answer (Semantic Scoring, Prompt
  Injection, PII, Profanity (HAP), Attribution Protection, Warning Confidence, Min Confidence,
  Min Text, Max Length, Custom Governance) hang off a **Guardrails** node on the tree, not off
  this dialog. See [Guardrails overview](/governance/guardrails/overview/).
- **Change Logs** and backup and restore — on the toolbar at the bottom-right of the screen,
  outside the dialog. See [Backup, restore and change logs](/configuration/backup-restore/).
- Categories, the routing tree itself, **Add a Category**, **Add Intent** and **Default
  Action** — see [Configuration overview](/configuration/overview/).
- Saving a change, proposing one instead of saving it, and the controls that frame every panel
  on this screen — see
  [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

**How do I open these settings?**

Open **Neural Config**, click the **Default Config** node at the top-left of the routing tree,
then **Edit Configuration**. The dialog header reads `Configuration: Default Config`.

**How many sections are there, and in what order?**

Fourteen, in the order listed above: KnowledgeBase Connection, KnowledgeBase Tuning, LLM
Details, Embedding Models, Company / Organization Preferences, Platform Preferences, Corporate
Document Filter, Corporate Logging, Prompt Engineering, Dynamic Personalization, Answer
Engineering & Preferences, Intent Matching & Cache Configuration, mAIstro Configuration,
Secrets. The list scrolls, so the last two are below the fold when the dialog opens.

**Where is snippet size?**

It is not a control in this dialog on the captured build. The paragraph at the top of
**KnowledgeBase Tuning** mentions adjusting snippet size, but the controls under it are the
sliders and the **mAIstro Post-KB Agent** listed above. See
[KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/).

**Where are PII, profanity and confidence thresholds?**

Not in this dialog. They are tabs on the **Guardrails** node of the tree — see
[Guardrails overview](/governance/guardrails/overview/).

**Two sections have no page of their own — where do I read about them?**

Company / Organization Preferences and Answer Engineering & Preferences do not yet have a page
in this documentation set. Their entries above link to [Tuning answers](/seek/tuning/), which
covers the effect those settings have on an answer, until dedicated pages exist.

**Does a category's Custom Configuration use the same sections?**

<!-- UNCONFIRMED: Custom Configuration opens the same fourteen-section dialog — old page prose; never opened in the capture -->

The old documentation said so — a category whose node reads `Custom Configuration` opens the
same dialog against that category. That was not re-checked on the captured screen, so treat it
as unverified until the category pages on
[Configuration overview](/configuration/overview/) confirm it.
