---
title: "Model Comparison (Seek)"
description: "Run the same question through Seek against every configured LLM and compare the answers side by side, so you pick a model on evidence rather than guesswork."
---

## What is it

A dashboard that runs one question through NeuralSeek's grounded-answer pipeline (Seek) once
per selected LLM, then lines up the results — response time, semantic score, and an overall
rank — so you can compare models on the same question and the same knowledge base.

## Why it matters

Model choice is usually made on vendor benchmarks or vibes. This page runs *your* question
against *your* knowledge base on *your* configured models, so the comparison reflects how a
model actually performs inside your instance — not a generic leaderboard.

It's also the right tool for re-validating a model after a provider ships a new version: run
the same question again and confirm the answer quality and latency haven't regressed.

## When to use it

- Deciding which configured model to make the default for a use case.
- Sanity-checking a provider's new model release before switching production traffic to it.
- Comparing cost/quality/latency trade-offs across platforms (for example, a smaller fast model
  against a larger high-accuracy one) on a real, representative question.

## How it works

1. **Configured Models** — the top of the page lists every LLM currently configured on the
   instance as a selectable card (platform, company, model name). Click a card to include or
   exclude it from the run.
2. **New Comparison** — type a question into **Comparison Question** and click **Run
   Comparison**. NeuralSeek runs a real Seek call against each selected model with that question.
3. **Previous Runs** — the second tab lets you re-open an earlier comparison from a dropdown
   instead of running a new one.
4. **Comparison Results** — once a run finishes you get:
   - A written **summary** of the run.
   - A **radar chart** plotting the models against each other across the comparison metrics.
   - A **results table** with one row per model: **Model**, **Provider**, **Response Time
     (ms)**, **Semantic Score**, and **LLM Rank**.

Semantic Score is the same semantic-match concept used across Governance — how well an answer is
backed by your documentation. See [Semantic analytics](/ns-docs/governance/semantic-analytics/)
for how that score is computed.

This is the **Seek** version of Model Comparison — it grounds a single question through the Seek
pipeline. If you need to compare models across a whole agent run instead of a single grounded
answer, see [Model Comparison (mAIstro)](/ns-docs/governance/maistro-model-comparison/).

## FAQ

### Does running a comparison cost anything?

Yes. Each model in the comparison is a real Seek call, so a comparison across N models consumes
roughly N Seeks worth of tokens/usage — the same as N production queries.

### Can I compare models that aren't configured on my instance yet?

No — only models already added as a **Configured Model** on the instance appear as selectable
cards. Add the model card first, then it becomes available here.

### Is a comparison run saved automatically?

Yes — every run appears under **Previous Runs** so you can revisit it without re-running the
question (and re-spending the tokens).
