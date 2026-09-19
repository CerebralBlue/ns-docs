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
settings. It does not repeat a setting — the owning page is the source.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase is behind this dialog:
which store is queried, which models answer and embed, how long answers are cached, what is
logged, how verbose an answer is. The sections are named for what they configure internally,
not for the symptom you arrived with, so "answers are too long" and "answers are stale" both
take a moment to place. Reading the list here is faster than opening fourteen accordions.

## When to use it

- You know what you want to change but not which section owns it.
- You are reviewing a new instance section by section and want a checklist.
- A category has a Custom Configuration of its own, and you need the same list of sections
  against that category instead of the default.
- You went looking in this dialog for guardrails, backups or categories and did not find them —
  the last section below says where they are instead.

## How it works

### Opening the dialog

Open **Neural Config** from the top navigation, click the **Default Config** node at the
top-left of the routing tree, then **Edit Configuration** in the dialog that opens.

![The Edit Configuration dialog open over the Neural Config routing tree, headed Configuration: Default Config, showing the collapsed accordion sections from KnowledgeBase Connection down to Intent Matching and Cache Configuration, with Propose Changes and Save in the footer](/img/neural-config/edit-configuration.png)

The dialog is a scrolling list of accordion headers — click one to expand it, and the settings
it holds appear underneath. **Close** (×) is top-right; the footer holds **Propose Changes** and
**Save**, which are documented on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

A category with a Custom Configuration opens this same dialog against that category, so the
fourteen sections below are also the sections of a category's own configuration. Categories and
the tree are on [Configuration overview](/configuration/overview/).

### The fourteen sections, in screen order

1. **KnowledgeBase Connection** — which store NeuralSeek queries: **KnowledgeBase Type**,
   **KnowledgeBase Language** and a free-text **Notes** box. See
   [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/).
2. **KnowledgeBase Tuning** — how much documentation, and which documentation, reaches the LLM:
   snippet size, the **Expansion Window**, document limits and the **KnowledgeBase Query Cache
   (minutes)**. See
   [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/).
3. **LLM Details** — one card per model, and which of the twenty **LLM Functions** (Seek, PII
   Detection, Translate, maistro and the rest) each model performs. Multiple models are
   load-balanced across the functions they share. See
   [LLM details](/configuration/neural-config/llm-details/).
4. **Embedding Models** — embedding cards and the three roles they can be assigned to: **KB
   Search**, **mAIstro** and **Vector Intent**. See
   [Embedding models](/configuration/neural-config/embedding-models/).
5. **Company / Organization Preferences** — the company or organization display name,
   **Company Response Affinity**, and the **Stump Speech** block of text passed to the LLM on
   every Seek. This section has no page of its own yet; the nearest coverage of how it changes
   an answer is [Tuning answers](/seek/tuning/).
6. **Platform Preferences** — instance-wide behaviour: **Timeout**, **Context Turns** and the
   context timeouts, **Virtual Agent Type**, **Stopwords**, **HTML Cleansing**, **Save Agents**
   and the **Post-Seek Agent**. See
   [Platform preferences](/configuration/neural-config/platform-preferences/).
7. **Corporate Document Filter** — filter the documentation each user is allowed to see by
   calling your own rules endpoint; document IDs the endpoint does not return are blocked. See
   [Corporate document filter](/governance/corporate-document-filter/).
8. **Corporate Logging** — mirror every Seek API request and response, and the Curate tab, to
   your Elastic or OpenSearch instance. See [Corporate logging](/governance/logging/).
9. **Prompt Engineering** — expert-only injection of instructions into the LLM prompt, plus the
   sampling controls (Temperature, Top Probability, Frequency penalty, Maximum Tokens). The
   screen warns that enabling it voids support. See
   [Prompt engineering](/configuration/neural-config/prompt-engineering/).
10. **Dynamic Personalization** — **Enable Dynamic Personalization** and pick the **mAIstro
    Personalization Agent** that tailors answers per user. See
    [Personalization](/seek/personalization/).
11. **Answer Engineering & Preferences** — how verbose an average answer should be, **Force
    Answers from the Knowledgebase**, and a table of regular-expression replacements applied to
    both training data and generated answers. This section has no page of its own yet; the
    verbosity slider and the force switch are covered on [Tuning answers](/seek/tuning/).
12. **Intent Matching & Cache Configuration** — **Intent Match Tolerance**, and the two answer
    caches (**Edited answer cache** and **Normal answer cache**). See
    [Intent matching and caching](/configuration/neural-config/intent-matching-caching/).
13. **mAIstro Configuration** — optional external agent marketplaces, each an endpoint and an
    API key. See
    [mAIstro configuration](/configuration/neural-config/maistro-configuration/).
14. **Secrets** — the instance secret store, a table of **Name** and **Value** rows. See
    [Secrets](/configuration/neural-config/secrets/).

### Settings that are not in this dialog

Four groups of settings live on the Neural Config screen but outside the accordion, so looking
for them here is a dead end:

- **Guardrails** — the tabs that check a question and an answer (PII, profanity, prompt
  injection, confidence thresholds and the rest) hang off a **Guardrails** node on the tree,
  not off this dialog. See [Guardrails overview](/governance/guardrails/overview/).
- **Backup & Restore** and **Change Logs** — on the floating toolbar at the bottom-right of the
  screen. See [Backup, restore and change logs](/configuration/backup-restore/).
- Categories, the routing tree itself, **Add a Category**, **Add Intent** and **Default
  Action** — see [Configuration overview](/configuration/overview/).
- Saving a change, proposing one instead of saving it, and the controls that frame every panel
  on this screen — see
  [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

**How do I open these settings?**

Open **Neural Config**, click the **Default Config** node at the top-left of the routing tree,
then **Edit Configuration**. The dialog header reads `Configuration: Default Config`.

**How many sections are there?**

Fourteen, in the order listed above: KnowledgeBase Connection, KnowledgeBase Tuning, LLM
Details, Embedding Models, Company / Organization Preferences, Platform Preferences, Corporate
Document Filter, Corporate Logging, Prompt Engineering, Dynamic Personalization, Answer
Engineering & Preferences, Intent Matching & Cache Configuration, mAIstro Configuration,
Secrets. The list scrolls, so the last sections are below the fold when the dialog opens.

**Can one category use different settings from the rest of the instance?**

Yes. A category whose node reads `Custom Configuration` opens this same dialog against that
category, so it can differ section by section from the default. A category reading `Default
Configuration` inherits the settings above. See
[Configuration overview](/configuration/overview/).

**Where are PII, profanity and confidence thresholds?**

Not in this dialog. They are tabs on a **Guardrails** node, which exists under the root and
under each category that has a Custom Configuration — see
[Guardrails overview](/governance/guardrails/overview/).

**Why do two sections have no page of their own?**

Company / Organization Preferences and Answer Engineering & Preferences do not yet have a page
in this documentation set. Their entries above link to the page that covers the effect those
settings have on an answer, and the settings themselves are described in one line each until
dedicated pages exist.
