---
title: 'Caching'
description: 'The two caches behind a Seek answer — the KnowledgeBase cache and the answer cache — what each one stores, where to configure it, and how NeuralSeek detects a cached answer has gone stale.'
---

## What is it

NeuralSeek caches in two places, and they are independent of each other:

- The **Corporate KnowledgeBase cache** stores the processed search result — the window of source
  content that gets handed to the LLM.
- The **answer cache** stores finished answers, both generated ones and ones you edited in
  Curate, and serves them again when a later question matches the same intent.

A question can hit either, both, or neither.

## Why it matters

Every uncached question costs a KnowledgeBase search, a cleansing and compression pass, and an
LLM call. Frequently asked questions pay that repeatedly for an answer that does not change.
Caching removes both the latency and the token spend, and it makes repeated answers consistent
rather than subtly reworded each time.

The cost is staleness. A cached answer can outlive the document it came from, which is why the
change detection below exists — and why caching is a poor fit for content that changes daily
unless you keep the cache duration short.

## When to use it

- High-volume questions whose answers rarely change — policies, definitions, plan limits.
- Any deployment where response time is user-facing.
- Answers you have curated by hand and want served verbatim rather than regenerated.

Keep durations short, or lean on the answer cache instead, when the underlying documents change
often.

## How it works

### Corporate KnowledgeBase cache

When NeuralSeek reads the Corporate KnowledgeBase it processes the raw content — removing
unnecessary material, filtering, deduplicating, compressing, and prioritizing what is left. The
result is a window of roughly **8,000–9,000 characters**, which is what goes to the LLM to form
the answer. That processed window is what gets cached, so a later question that needs the same
material skips the search, the processing and the generation.

NeuralSeek also derives a hash of that window, which is what later tells it whether the original
source has changed.

Set how long these results are held under **Neural Config > KnowledgeBase Tuning >
KnowledgeBase Query Cache (minutes)** — a slider running from `Disabled` to `6000`.

### Answer cache

When a question arrives, NeuralSeek matches it to an **intent** — usually by fuzzy matching. If
an answer already exists for that intent, normal or edited, it can be served from cache.

Configure this under **Neural Config > Intent Matching & Cache Configuration** (visible after
**Show Advanced Options**), where the edited answer cache and the normal answer cache are enabled
or disabled separately.

![Screenshot needed — Configure ▸ Intent Matching & Cache Configuration, showing the threshold, tolerance and matching-method controls](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Intent Matching & Cache Configuration, with the answer threshold,
     the edited answer match tolerance and the matching-method selector all visible.
     Why: three controls that interact, on one panel, and the threshold's meaning is not
     guessable from its label. -->

Each cache type has an **answer threshold** and, for edited answers, a **match tolerance**. The
threshold is the number of distinct answers that must exist for a question before caching starts:

| Threshold | Effect |
| --- | --- |
| `0` | Caching is disabled |
| `1` | Cache as soon as a single answer exists |
| `5` | Do not cache until five different answers exist for that question |

The **matching method** — Exact Match, Fuzzy Match and others — controls how a question is
matched to an intent.

Normal answers also support **Exact Match, exact conversational context**, which requires
consecutive turns to match rather than the single question, so the match respects where the
conversation had got to. Edited answers do not offer it: an edited answer is meant to be concise
and grounded on its own, so it should not depend on conversational context.

### Detecting a stale cached answer

Every cached answer is hashed, and that hash is compared against the current source. If they
differ, NeuralSeek flags the answer as out of date with what is now in the KnowledgeBase. The
check runs when the answer is used at Seek time.

You then either delete and reload the answer, or edit it and mark it as current, which clears it
from the outdated list.

:::note
Answers are also checked during round-trip logging. NeuralSeek looks at which answers are being
returned frequently and runs asynchronous checks against the KnowledgeBase to confirm they are
still current.
:::

## FAQ

### How do I tell whether an answer came from the cache?

Run the question in the **Seek** tab and look next to **Total Response Time**. A `Cached` label
there means the answer was served straight from the cache rather than generated.

### What is the difference between the two caches?

The KnowledgeBase cache stores source material — the processed content window before the LLM
sees it. The answer cache stores finished answers. Clearing or expiring one does not affect the
other.

### Why is my answer not being cached?

Check the answer threshold for that cache type. At `0` caching is off entirely, and at a higher
value nothing is cached until that many distinct answers exist for the question.
