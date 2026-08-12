---
title: "Configuration Insights"
description: "The audit view over your Neural Config change history — who changed what and when, presented as a governance timeline rather than an operational tool."
---

## What is it

A timeline view of your instance's Neural Config change history: every save, proposal, and
version event laid out chronologically, labelled with your company/instance name.

## Why it matters

Neural Config already has a **Change Logs** modal (in Neural Config → Toggle Advanced) that lets
you roll back, activate, or delete a proposed change — that's the *operational* tool. This page
is different: it's the *audit/reporting* view over the same underlying history, meant for
answering "what changed, and when" without giving you the controls to undo anything.

Say this explicitly wherever both are mentioned — readers who know Change Logs will otherwise
assume this page is a duplicate.

## When to use it

- Reviewing configuration history for a compliance or change-management review.
- Correlating a change in behavior (answer quality, latency, guardrail activity) with a
  configuration change around the same time.
- Getting a chronological overview of how the instance's configuration has evolved, without
  needing rollback controls.

## How it works

The page renders a single interactive timeline of configuration change events pulled from the
instance's history. Each event marks a point in time; scrolling/paging through the timeline
moves you through the instance's configuration history in order.

- **Data source:** the same underlying change history that backs the **Change Logs** modal in
  Neural Config — this page just presents it as a read-only timeline instead of a rollback tool.
- **No edit controls:** you can't activate, delete, or restore a proposal from here. To act on a
  change, go to Neural Config → Toggle Advanced → **Change Logs**.

## FAQ

### How is this different from Neural Config's Change Logs?

Change Logs is where you *act* on history — activate a proposal, restore a version, delete an
old one. Configuration Insights is where you *read* history — a governance-facing timeline with
no destructive actions available.

### Does this show who made each change?

The timeline is scoped to the instance's configuration events; if you need to attribute a
specific change to a user, cross-check the timestamp against your admin/user activity records.

### Can I filter this timeline by date?

The timeline is a scrollable/zoomable chronological view rather than a date-range picker — use it
to browse history rather than to jump to an exact date.
