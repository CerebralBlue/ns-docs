---
title: "Model Comparison (mAIstro)"
description: "Run one whole agent flow across every configured LLM and compare the outputs side by side — the agent equivalent of Seek's Model Comparison."
---

## What is it

The agent version of [Model Comparison](/ns-docs/governance/seek-model-comparison/): instead of
comparing a single grounded Seek answer across models, this page runs an entire selected agent
across every configured LLM and compares the outputs.

## Why it matters

An agent's behavior can shift with the underlying model — not just the wording of its answer, but
tool calls, multi-step reasoning, and how it uses parameters. Comparing at the agent level, not
just the answer level, is the only way to see that.

## When to use it

- Choosing which model an agent should run on before shipping it.
- Validating that an agent still behaves correctly after a provider updates a model.
- Comparing cost/latency/quality trade-offs for a specific agent flow, not just a single grounded
  answer.

## How it works

1. **Configured Models** — select which configured LLMs to include, the same model cards used on
   the Seek version of this page.
2. **Agent Selection** — choose the agent to run from a dropdown of your agents.
3. **New Comparison** — set the agent's parameters for this run (the same parameter form you'd see
   running the agent normally) and click **Run Comparison**. The agent runs once per selected
   model.
4. **Previous Runs** — reopen an earlier comparison instead of re-running it.
5. **Comparison Results** — a written summary, a radar chart across the comparison metrics, and a
   results table with **Model**, **Provider**, **Response Time (ms)**, **Response Score**, and
   **Agent Score** per model.

## FAQ

### When should I use this instead of the Seek version of Model Comparison?

Use this page when you care about a whole agent flow — its tool calls, multi-step logic, and
parameters — not just how a single grounded answer changes across models. Use the Seek version
when you only need to compare a single question's answer.

### Does this support agent parameters?

Yes — the run form lets you set the same parameters you would when running the agent normally, so
the comparison reflects a realistic invocation rather than a bare default run.

### Does running a comparison here cost the same as running the agent normally?

Each model in the comparison is a full run of the agent, so a comparison across N models costs
roughly N full agent runs — plan for that, especially with agents that call other agents or
external services.
