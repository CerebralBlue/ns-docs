---
title: "Personalization"
description: "Personalization tailors a Seek answer to one customer using preferred name, products and other CRM details — tested in the Personalize modal and enabled in Neural Config."
---

Personalization tailors a Seek answer to one specific customer. Instead of returning the same
generic KnowledgeBase answer to everyone, NeuralSeek folds in details about the person asking —
their preferred name, the products they use, and any other customer context — so the answer
speaks to their situation.

There are two surfaces, and this page owns both:

- The **Personalize** modal on the Seek tab, where you test a personalized answer without
  changing any configuration.
- The **Dynamic Personalization** accordion in Neural Config, where you turn personalization on
  for production and pick the agent that applies it.

## What is it

Personalization is the mechanism that adjusts a Seek answer to match one user. In the test
modal it takes three inputs: a **Preferred Name**, a comma-separated list of products the
customer uses, and a free-text box for any other customer details. In production those same
three fields are passed to the `/seek` REST call, and a mAIstro agent uses them to rewrite the
answer for that customer.

The generic path and the personalized path start from the same KnowledgeBase. The difference is
that personalization gives the model per-customer context it would not otherwise have — which is
also why a personalized answer can contain personal information, and is handled with more care
than a normal answer.

## Why it matters

An answer written for a named customer, about the products they actually hold, reads
differently from a one-size-fits-all documentation answer. Without personalization, a customer
question about their own account has no customer context to draw on: asking "What products do I
have with this bank?" against a generic KnowledgeBase returns a low-confidence answer along the
lines of "the documentation does not contain any information about bank products" — the model
has nothing customer-specific to work with.

```text
"answer":"I’m sorry, but the documentation does not contain any information about bank products.","confidence":20,"KBscore":10,"semanticScore":20
```

_(via the MCP `seek` tool, input "What products do I have with this bank?", no personalization —
`probes/p102.run.json`)_

That baseline is exactly what personalization is meant to replace: with the customer's products
and details supplied, the same question can be answered in terms of what that customer holds.

Personalization also has a privacy consequence worth planning for. Because a personalized answer
may contain PII, it is deliberately kept out of the curation workflow — see the notice below.

## When to use it

- **Use the Personalize modal** when you want to preview a tailored answer for a test customer
  and see how the answer changes, without touching your saved configuration.
- **Turn on Dynamic Personalization** when you want personalization to run in production. In
  that case the per-customer details are supplied by the calling application through the `/seek`
  REST call, not typed into the modal.
- **Do not rely on it** for questions your KnowledgeBase already answers well for everyone —
  personalization adds customer context, it does not improve a generic documentation answer.

## How it works

![The Seek tab with the Personalize button in the toolbar](/img/seek/personalize.png)

Personalization has a test surface on the Seek tab, a production switch in Neural Config, and an
NTL surface for building it into an agent. The sections below cover each.

### The Personalize modal on Seek (test surface)

![The Personalize modal — Preferred Name, products and additional details fields with the PII notice](/img/seek/personalize--preferred-name.png)

On the Seek tab, the **Personalize** button in the toolbar opens the **Personalize** dialog.
(This is the same button documented as an entry point on [the Seek overview](/seek/overview/).)
The dialog lets you set customer details for the next seek without changing any saved
configuration, so it is the place to try a personalized answer.

The dialog opens with this notice, which explains why personalized answers are treated
differently from ordinary ones:

> Personalized answers will not be displayed in the curate tab and are ineligible for curation
> and intent generation, as they may contain PII.

It has three fields — the same three fields the Seek API accepts for personalization:

- **Preferred Name** — the customer's preferred name (placeholder `Dan`).
- **Products this customer purchased, subscribes to, or consumes (Separate by commas)** — a
  comma-separated list of the products the customer uses (placeholder `Savings Account,
  Brokerage Account`).
- **Additional Customer details** — a free-text box for any other CRM detail you want the answer
  to take into account.

Three buttons finish the dialog:

- **Clear** — empties the three fields.
- **Save** — applies the personalization to the next seek you run.
- **Close** — closes the dialog.

After you **Save** and run a seek, the answer reflects the customer details you supplied, rather
than the generic KnowledgeBase answer shown for an un-personalized question.

### Enable Dynamic Personalization (Neural Config)

![The Dynamic Personalization accordion — Enable Dynamic Personalization and the mAIstro Personalization Agent dropdown](/img/neural-config/dynamic-personalization.png)

The modal is for testing; Dynamic Personalization is the production switch. Reach it from
**Neural Config** &rsaquo; the **Default Config** node &rsaquo; **Edit Configuration** &rsaquo;
the **Dynamic Personalization** accordion. It has two controls:

- **Enable Dynamic Personalization** — the on/off switch. It ships set to `Disabled`; switch it
  to `Enabled` to turn personalization on in production.
- **mAIstro Personalization Agent** — the mAIstro agent that adjusts answers using the
  personalization details. The dropdown offers `Disabled`, the example agent
  `ex_Dynamic_Personalization_In`, and any personalization agents you build yourself. Pick the agent that should do the tailoring.

With Dynamic Personalization enabled and an agent selected, the personalization details supplied
on the `/seek` REST call are handed to that agent, which rewrites the answer for the customer.

### The Personalization - In / Out nodes (NTL surface)

A mAIstro Personalization Agent is built from a **Personalization - In** / **Personalization - Out**
node pair (see also [pipeline hooks](/maistro/ntl/pipeline-hooks/)). Both nodes exist only for
building a dynamic personalization agent for Seek.

**Personalization - In** must be the **first** step of the agent. It provides these variables:

| Variable                                | Value                                     |
| --------------------------------------- | ----------------------------------------- |
| `dynamicPersonalizationIn.user`          | The user ID                               |
| `dynamicPersonalizationIn.originalQuery` | The original user query                   |
| `dynamicPersonalizationIn.sessionId`     | The session ID                            |
| `dynamicPersonalizationIn.options`       | The full `options` object from the API call |

**Personalization - Out** must be the **last** step of the agent. Its options are the values it
hands back to Seek:

| Option              | What it sets                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `preferredName`     | The preferred name of the user.                                                                 |
| `additionalDetails` | Additional text about the user, passed to language generation.                                  |
| `filter`            | The filter string used to filter document queries (see [Dynamic filters](/seek/dynamic-filters/)). |
| `noWelcome`         | The user has already been welcomed; do not welcome them again. Defaults to `false`.             |
| `forceFirstPerson`  | Use a first-person speaking style, even if no preferred name is set. Defaults to `false`.       |
| `products`          | The products this customer currently consumes from your company, separated by commas.           |
| `personalize`       | A personalization JSON object (Seek's `options.personalize`) that overrides personalization.   |
| `override`          | Override data for the whole payload, for example for prompt engineering or other parameter overrides. |

:::caution
`override` replaces the Seek payload completely. Use it with care.
:::

## FAQ

**How do I test a personalized answer?**

On the Seek tab, click **Personalize**, fill in **Preferred Name**, the products field and
**Additional Customer details**, click **Save**, then run your seek. The answer will reflect the
details you supplied.

**Why don't my personalized answers show up in Curate?**

By design. Personalized answers may contain PII, so — as the modal's notice states — they are
not displayed in the Curate tab and are ineligible for curation and intent generation.

**Where do I turn personalization on for production?**

In **Neural Config** &rsaquo; **Default Config** &rsaquo; **Edit Configuration** &rsaquo;
**Dynamic Personalization**: switch **Enable Dynamic Personalization** from `Disabled` to
`Enabled` and choose a **mAIstro Personalization Agent**. In production the per-customer details
arrive via the `/seek` REST call rather than the modal.

**What are the three personalization fields the API accepts?**

The customer's **Preferred Name**, the **products** the customer uses (comma-separated), and
**Additional Customer details** — the same three fields shown in the Personalize modal.

**How is a personalized answer different from a normal one?**

A normal seek answers from the KnowledgeBase with no customer context. A question like "What
products do I have with this bank?" with no personalization returns a low-confidence
"documentation does not contain any information about bank products" answer. Personalization
supplies the customer's products and details so the same question can be answered for that
specific customer.
