---
title: "Minimum confidence"
description: "What happens when NeuralSeek is not confident enough to answer — the fallback agent, fallback URL, and the cost of pre-running them."
---

:::note[Draft]
This page is part of the new documentation structure and its content is being prepared.
:::

This page is brand new for the restructured docs.

## To document on this page

- Pre-run min confidence agent — runs the fallback agent speculatively for speed, and costs a run every time
- URL Fallback > Category — resolve the fallback URL from the matched intent category
- The Min Confidence tab's controls by label: the fallback agent picker (ex_Minimum_Confidence_Message on the playground), Minimum Confidence % and 'Minimum Confidence% to display a URL' sliders, the reply text and the Fallback URL
- Warning Confidence tab (assigned here by IA 2026-09-18 — the console pairs 'Warning & Minimum confidence'): 'Confidence % for warning' slider (Disable … 100) and the prepend text ("I'm not an expert in this, but")
- Values seen on the playground (IA 2026-09-18, run 1715): 'Pre-run min confidence agent for faster speed' selector = true; 'URL Fallback on minimum' selector = None, with the Fallback URL box disabled (placeholder http://myco.com) while it is None

