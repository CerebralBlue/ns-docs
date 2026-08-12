---
title: "API keys"
description: "Create, scope and expire API keys — including per-endpoint scoping and the rule that an unscoped key is an admin key."
---

:::note[Draft]
This page is part of the new documentation structure and its content is being prepared.
:::

This page is brand new for the restructured docs.

## To document on this page

- Bulk create — 1 to 100 keys at once, auto-numbered from the name you give
- Key expiration — optional expiry date, with Expires and Expired badges
- Last used column — when each key last authenticated, or Never
- Per-key scoping across 5 areas: Functions, Configs, Agents, API, Console API
- Unscoped = full access — leaving everything unchecked makes it an admin key
- Function vs API scopes are mutually exclusive — pick one model per key
- Endpoint-level permissions — method plus path pattern, for the API and Console API scopes

