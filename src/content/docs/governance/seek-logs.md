---
title: "Seek Logs"
description: "The row-level record of every Seek and Chat exchange — filter by confidence, PII, prompt injection, or cache status, re-categorize inline, and replay a past answer."
---

## What is it

A searchable, filterable table of individual Seek/Chat exchanges — the raw record behind every
aggregate on the other Seek Governance dashboards.

## Why it matters

Aggregates tell you *that* something happened (a confidence drop, a PII flag); this page is where
you find the actual exchange and read it. It's also where you fix categorization mistakes as you
find them, which retrains future classification.

## When to use it

- Investigating a specific answer a user reported as wrong or low quality.
- Auditing for PII, prompt injection, or guardrail activity in real exchanges rather than
  aggregate counts.
- Correcting a miscategorized question the moment you spot it in the logs.
- Replaying a past Seek to see its semantic scoring in detail.

## How it works

**Table columns:** Date, Session, Question, Answer. The **Question** column shows an eye icon
you can click to reveal content that was masked (for example, HAP-flagged text) — the icon
un-hides the raw text for review. Both Question and Answer show the runtime **filter chips**
that were applied to that specific Seek, so you can see at a glance which filters shaped the
result.

**Filter modal** — narrows the table with five independent switches, each with **All / \<X\> /
Not \<X\>**:
- **Min Confidence** — whether the answer hit the minimum confidence threshold.
- **Sensitive** — whether the exchange was flagged sensitive.
- **Prompt Injection** — whether prompt injection was detected.
- **Cached** — whether the answer came from cache.
- **PII** — whether PII was detected in the exchange.

**Edit Category inline** — click a row's category to open **Edit Category**, pick a new category
from the dropdown, and save. This is the same self-learning mechanism as re-categorizing in
Curate: the correction trains future categorization, so fixing drift here is the fastest way to
improve it going forward. New categories are added from the Configure tab, not from this modal.

**Replay** — available when **Corporate Logging** is enabled. Opens the logged exchange in Replay
mode so you can re-examine its semantic scoring step by step. See
[Real-time logging](/ns-docs/governance/logging/) to turn Corporate Logging on if Replay isn't
available.

**Export** — the table supports a CSV download of the current view.

## FAQ

### Why can't I replay a row?

Replay depends on **Corporate Logging** being enabled at the time the Seek happened, not just
when you try to replay it. Exchanges logged while it was off have nothing to replay.

### Does editing a category here affect past answers?

No — it retrains classification for future questions. The row you edited keeps its own history,
but new questions similar to it should classify correctly going forward.

### What do the filter chips on a row actually mean?

They show which runtime filters (the same filters you can pass into a Seek call) were active for
that specific exchange — useful for reproducing or understanding why an answer came out the way
it did.

### Is this the same table as mAIstro Logs?

No — Seek Logs covers grounded-answer (Seek/Chat) traffic. Agent runs have their own equivalent;
see **mAIstro Logs** under mAIstro Governance.
