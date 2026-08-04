---
title: "LLM Details"
description: "Per-model configuration: which of the 20 LLM functions a model may perform, its model code, context window, cost multiplier and modalities."
---

:::note[Draft]
This page is part of the new documentation structure and its content is being prepared.
:::

This page is brand new for the restructured docs.

## To document on this page

- The 20 assignable LLM functions
- Additional LLMs default to opted out of everything except mAIstro
- Load-balancing and the no-fallback rule — two models share a function; zero models silently disables it
- Model Code — the ID used to force a specific model from the API or from mAIstro
- Context Window — per-model ceiling on documents plus context turns
- Seek Multiplier — what a Seek on this model costs relative to baseline
- Input / Output modalities (text, image, audio)
- 'This LLM does not support…' — why some function checkboxes are greyed out
- Copy LLM — duplicate a model card to reuse it with different settings

