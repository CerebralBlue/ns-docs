---
title: "Directives test"
description: "Regression page for the ns-* remark directives in plain .md, including failure modes."
# `draft: true` = visible in `bun run dev`, excluded from production builds.
# This is the only .md coverage for the directive pipeline (styleguide.mdx
# covers .mdx), so it is worth keeping — it is never published. Safe to delete
# if you would rather not carry it.
draft: true
---

## Valid directives in plain markdown

::::ns-grid{cols=2}

:::ns-card[State]{icon=star}
Cyan accents for state.
:::

:::ns-card[Governance]{icon=approve-check}
Trust-blue governs.
:::

:::ns-card[Creation]{icon=pencil}
Indigo/magenta creates.
:::

:::ns-card[Surfaces]{icon=setting}
Cards on Surface, calm and institutional.
:::

::::

::::ns-grid{cols=2}

:::ns-card[Quickstart: Seek]{icon=rocket href="/ns-docs/getting-started/quickstart-seek/"}
Deploy an instance and get your first grounded answer.
:::

:::ns-card[NTL reference]{icon=open-book href="/ns-docs/maistro/ntl-overview/"}
Every node, with syntax and worked examples.
:::

::::

::ns-button[Get started]{href="/ns-docs/getting-started/quickstart-seek/" icon=right-arrow}

Release status: :ns-label[beta] — inline mono label.

## Nested markdown and asides still work inside a card

Nesting requires each level to use MORE colons than the one inside it, so a
3-colon `:::note` inside a card means the card needs 4 and the grid 5.

:::::ns-grid{cols=1}

::::ns-card[Rich body]{icon=document}
Body copy with **bold**, `inline code`, and a [link](/ns-docs/seek/overview/).

:::note
A Starlight aside nested inside a card.
:::

::::

:::::

## Failure modes — the build must SUCCEED with warnings

:::ns-crad[Typo'd container]
Renders as a bare div, content intact.
:::

::ns-buton[Typo'd leaf]{href="/x"}

::::ns-grid{cols=2}

:::ns-card[Unknown icon]{icon=definitely-not-an-icon}
Should render with no icon and a warning.
:::

:::ns-card{icon=star}
No title at all — body-only, plus a warning.
:::

::::

NTL syntax in prose must survive untouched: `{{ postgres | query }}` and
<< name: x, prompt: false >> and a bare {{ brace }}.
