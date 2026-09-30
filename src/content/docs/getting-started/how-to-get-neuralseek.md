---
title: "How to get NeuralSeek"
description: "NeuralSeek is sold under plans that differ in which LLM you can use and where the product can run; this page compares the plans, says where to get an instance, and shows where to change your support and development subscription from Home."
---

## What is it

This page covers the commercial side of NeuralSeek: the plans it is sold under, what separates
them, where to get an instance, and the one purchasing control that lives inside the product —
the **Support & Development Subscription** button on the Home screen.

How and where NeuralSeek runs once you have it — SaaS, on-premise, Flex installs, hardware
sizing — is covered in [Deployment](/reference/deployment/). Which features each plan or platform
unlocks, and why a screen might be missing from your console, is covered in
[Plans & platforms](/reference/plans-and-platforms/).

## Why it matters

The plan decides three things: whether you use NeuralSeek's curated LLM or connect your own,
whether you may install NeuralSeek on your own hardware, and which answer-channel features
(virtual-agent export, round-trip monitoring, sentiment, language detection) are available.
Picking the plan that matches your security and LLM requirements up front saves switching plans
after go-live.

The support and development subscription is separate from the plan: it is what you change when
you need a different level of support for an instance you already have.

## When to use it

- **You are choosing how to buy NeuralSeek.** Compare the plans below, then get an instance from
  the channel that suits you.
- **You already have an instance and want a different support plan.** Use the
  **Support & Development Subscription** button on Home — see
  [Support and development subscription](#support-and-development-subscription).
- **You need installation steps or sizing.** This is the wrong page; go to
  [Deployment](/reference/deployment/) and, for Flex installs, [Flex licensing](/configuration/administration/flex-licensing/).
- **A screen is missing from your console.** Go to [Plans & platforms](/reference/plans-and-platforms/).

## How it works

![The NeuralSeek Home screen with the Support & Development Subscription button at the top right](/img/home/default.png)

Home is the first screen after you sign in. Its heading reads "Watch. Learn. Build faster.", with
the **Support & Development Subscription** button at the top right, next to it.

### Support and development subscription

![The Get more value from NeuralSeek panel on Home, with the Get a support and development subscription tile](/img/home/default--get-more-value-from-neuralseek.png)

Two things on Home point you to a support and development subscription:

- **Support & Development Subscription** — the button at the top right of Home (screen readers
  announce it as "Open support and development subscription options"). It opens the
  support-plan options for your instance.
- **Get a support and development subscription** — a tile in the **Get more value from
  NeuralSeek** panel lower on Home. It is a reminder, not a link: use the button at the top to
  act on it.

The support-plan options appear in a dialog titled **Update Support Plan**. It has two buttons:
**Update** confirms the change to your support plan, and **Close** leaves the dialog without
changing anything. Because **Update** changes what you are billed for, review the
dialog before you confirm.

![Screenshot needed — Home ▸ Support & Development Subscription ▸ Update Support Plan dialog](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/home/update-support-plan.png — Home, click Support & Development Subscription (top right), capture the Update Support Plan dialog with its plan list and prices, then click Close. Never click Update: it changes billing. -->

When a change is billed is answered in the
[FAQ](#when-am-i-billed-for-a-support-plan-change) below. How support plans are billed and what each one includes is covered on
[Support plans](/configuration/administration/support-plans/).

### Plans

<!-- UNCONFIRMED: the five plans, their shared features, LLM rules, feature exclusions and Flex licensing (10,000 users per base instance, blocks of 10,000, one free working session of up to 1 hour at purchase) — old page "Deployment options" (documentation.neuralseek.com), no plan list on any captured screen -->

The plans differ mainly in the LLM behind the answers and in where NeuralSeek may run. Every plan
includes the core answer features: cataloguing, curating and grouping questions and answers,
translation, entity extraction, and categorising text into categories and intents.

| Plan | LLM | What is different |
| --- | --- | --- |
| Pay-per-answer | NeuralSeek's curated LLM only | All features, with any supported KnowledgeBase. Minor LLM versions update automatically; you choose when a major version change applies. |
| Bring-your-own-LLM | Any supported LLM, connected without code | All features, with the LLM you choose — for example one that keeps processing in a given datacenter or country. |
| Flex | Any supported LLM | Bring-your-own-LLM plus unlimited usage, unlimited instances per deployment, and a licence to install on your own hardware while you are subscribed. |
| Search | NeuralSeek's curated LLM only | Search results with generated summaries, for use cases without a virtual agent. Each summary is charged per call; cached responses are not. No virtual-agent export, round-trip monitoring, sentiment scoring or automatic language detection. |
| Small Business | NeuralSeek's curated LLM with a pre-connected KnowledgeBase; neither can be changed | You point NeuralSeek at your website or upload documents, then connect a virtual agent. |

On Flex, each base instance covers 10,000 users, and more users are added in blocks of 10,000. A
Flex purchase includes one live working session of up to one hour for the first installation.

The installation itself — platforms, sizing, steps — is on [Deployment](/reference/deployment/), and
reporting installs and users on a Flex licence is on
[Flex licensing](/configuration/administration/flex-licensing/). The LLMs you can connect on
Bring-your-own-LLM and Flex are listed under [LLM Details](/configuration/neural-config/llm-details/).

### Getting an instance

NeuralSeek is available directly and through cloud marketplaces. Plans and prices on a
marketplace are set in that provider's listing, so check the listing for current cost.

<!-- UNCONFIRMED: NeuralSeek is listed in the IBM Cloud catalog, AWS Marketplace and Azure Marketplace — old what-is-neuralseek page -->

The listings are the IBM Cloud catalog, AWS Marketplace and Azure Marketplace.

Which platforms NeuralSeek runs on, and what changes about the product on each, is on
[Deployment](/reference/deployment/).

## FAQ

### How do I change my support plan?

Open Home and select **Support & Development Subscription** at the top right. The
**Update Support Plan** dialog opens; confirm a change with **Update**, or leave with **Close**. [Support plans](/configuration/administration/support-plans/) has the detail.

### Which plan lets me use my own LLM?

<!-- UNCONFIRMED: Bring-your-own-LLM and Flex are the plans that connect your own LLM — old page "Deployment options" -->

Bring-your-own-LLM and Flex. Pay-per-answer, Search and Small Business use NeuralSeek's curated
LLM only.

### Can I run NeuralSeek on my own hardware?

Installing on your own hardware is a matter of plan and deployment, not a console setting. See
[Deployment](/reference/deployment/) for where NeuralSeek can run and how an on-premise install
works.

### When am I billed for a support-plan change?

<!-- UNCONFIRMED: changing the support plan bills immediately, then rebills every 30 days — old gap note on this page (configuration/administration/support-plans gap list); Home does not state it -->

Immediately, when you confirm the change with **Update** in the **Update Support Plan** dialog,
and then again every 30 days. Selecting **Close** leaves your plan unchanged.

### Where do I see why a screen is missing from my console?

Features vary by plan and platform; [Plans & platforms](/reference/plans-and-platforms/) lists
what each one unlocks.
