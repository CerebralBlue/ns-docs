---
title: "Plans & platforms"
description: "Which areas the NeuralSeek console navbar shows, and which plan, deployment or user-permission condition can hide a page that the documentation describes."
---

## What is it

This page is the gating reference for the NeuralSeek console. It lists the top-level areas the navbar shows, where each one leads, and the conditions that can make a documented page missing from your console: your plan, your deployment (cloud or on-prem), or the permissions your user has.

It is not a buying guide. Plans, prices, the plan catalogue and support subscriptions are covered in [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/). Installing and running NeuralSeek on your own infrastructure is covered in [Deployment](/reference/deployment/).

## Why it matters

The documentation describes every feature NeuralSeek has, across all plans and deployments. A single console shows only the part that applies to it. When a page in these docs names a screen you cannot find, the cause is usually one of three things, and each one has a different fix: a permission an admin can grant, a plan feature, or a deployment difference. Knowing which one you are looking at saves a support ticket.

## When to use it

- A page in the docs describes a screen, menu item or dashboard that your console does not show.
- You want to check which areas a console has, and where each label in the navbar leads.
- You are comparing plans and want the feature differences without the sales copy. To buy or change a plan, go to [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/) instead.

This page is the wrong place for prices, licence sizing or installation steps; see [Where plans and deployment are covered instead](#where-plans-and-deployment-are-covered-instead).

## How it works

### The navbar

![The NeuralSeek console navbar with Home, Neural Config, Seek, KnowledgeBase, mAIstro, NeuralEdit, Governance, Run Agents and Admin Tools, and the profile icon at the far right](/img/home/default.png)

Every console page carries the same bar across the top. On the Home page it shows these items, left to right:

| Navbar item       | What it opens                                                                                      | Documented in                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Home**          | `/home`: the video browser ("Watch. Learn. Build faster.") and the "Get more value from NeuralSeek" panel | [What is NeuralSeek](/getting-started/what-is-neuralseek/)                                      |
| **Neural Config** | `/configure`: the configuration tree and its settings                                              | [Neural Config options](/configuration/neural-config/)                                          |
| **Seek**          | `/seek`: ask questions and trace answers back to their sources                                     | [Seek overview](/seek/overview/)                                                                |
| **KnowledgeBase** | `/knowledge`: the documents NeuralSeek answers from                                                | [Connect a knowledge base](/knowledge/connect-a-kb/)                                             |
| **mAIstro**       | `/maistro`: build LLM-backed agents with no code                                                   | [mAIstro overview](/maistro/overview/)                                                          |
| **NeuralEdit**    | `/neuralEdit`: agent-assisted document creation and editing                                        | [NeuralEdit overview](/maistro/neuraledit/overview/)                                            |
| **Governance**    | `/go-overview`: the governance dashboards and charts                                               | [Governance overview](/governance/overview/)                                                    |
| **Run Agents**    | `/runagent`: run your mAIstro agents                                                               | [Run Agents](/maistro/run-agents/)                                                              |
| **Admin Tools**   | A menu, not a page (see below)                                                                     | This page                                                                                       |

**Admin Tools** is a button that opens a menu instead of a page. The menu lists, in this order:

- **API's & Integration**: see [API keys](/configuration/administration/api-keys/) and [What can we connect to?](/integrations/overview/).
- **Data Loader**: see [Loading documents](/knowledge/load/).
- **Entity Extraction**: see [Entity extraction](/governance/entity-extraction/).
- **Chat SDK**: see [Chat SDK](/integrations/chat-sdk/).
- **QA Tools**
- **Curate**: see [Answer curation](/seek/curation/).

The round profile icon at the far right of the bar opens your user profile.

Two things about the navbar are easy to miss:

- **Curate is not a top-level item.** It is the last entry in the Admin Tools menu. The Home page also links to it from its next-steps panel ("Edit, organize, and train Answers on style and content on your Q&A content on the Curate tab").
- **The navbar is not identical on every page.** While you are inside API's & Integration, an extra **API's & Integration** item appears between **Run Agents** and **Admin Tools**. It is not there on Home.

The list above is what a signed-in administrator sees. A user with fewer permissions, or a console on a different plan or deployment, can see fewer items; the next section lists the known conditions.

### Why can't I see this page?

If a page in these docs is missing from your console, look up the condition here.

:::caution[Not checked against every plan]
The conditions below come from product notes and the earlier plan descriptions. They have not been verified on every plan and deployment, and it is not documented whether a gated feature is hidden outright or shown disabled.
:::

<!-- UNCONFIRMED: all nine conditions in this table — product gap audit (document-manager, deployment, secrets, self-hosting-an-llm, reading-the-dashboards, flex-licensing) and the old plans page; no captured screen shows a hidden item -->

| Condition                                              | What is reported to disappear or change (not verified on every plan)                                                                                                                                                        | Where it is documented                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| On-prem deployment                                     | Reported: the Document Manager is not available on on-prem installs. On cloud consoles it is reached from **KnowledgeBase**.                                                                                               | [Document Manager](/knowledge/document-manager/)                               |
| On-prem deployment                                     | Reported: Secrets behave differently from the cloud console.                                                                                                                                                               | [Secrets](/configuration/neural-config/secrets/)                               |
| Bring-your-own-LLM (BYOLLM) plans only                 | Reported: Self-Hosted LLM, the last entry in the side list of **Admin Tools** → API's & Integration, is limited to BYOLLM plans.                                                                                            | [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/)      |
| BYOLLM plans only                                      | Reported: the token and cost dashboards under **Governance** (Seek tokens and cost, and the mAIstro agent token and cost pages) are limited to BYOLLM plans.                                                                | [Reading the dashboards](/governance/analytics/reading-the-dashboards/)        |
| Flex plan only                                         | Reported: **Admin Tools** → Customize, where you self-report installs and users and download a licence file, is a Flex feature. The Admin Tools menu shown above (API's & Integration through Curate) has no Customize entry. | [Flex licensing](/configuration/administration/flex-licensing/)                |
| Curated-LLM plans (Pay-per-answer, Search, Small Business) | Reported: you cannot connect other LLMs; choosing an LLM in **Neural Config** is described as a BYOLLM and Flex capability.                                                                                             | [Supported LLMs](/configuration/supported-llms/)                               |
| Search plan                                            | Per the plan description: no export to a virtual agent, no round-trip monitoring to a virtual agent, no sentiment scoring, no automatic language detection. Which console screens change as a result is not documented.     | [What each plan includes](#what-each-plan-includes)                            |
| Small Business plan                                    | Per the plan description: the LLM and the knowledge base are pre-connected and cannot be swapped. Whether the LLM and KnowledgeBase connection settings are hidden or only locked is not documented.                        | [What each plan includes](#what-each-plan-includes)                            |
| Your user permissions (any plan)                       | A page can be missing because your role does not grant it, even when the plan includes it. For example, the Load permission is reported to grant the Document Manager.                                                     | [Users and permissions](/configuration/administration/users-and-permissions/), [Default permissions](/configuration/administration/default-permissions/) |

**What to do.** Start with permissions: if a colleague on the same console can see the page, the cause is your role, not the plan, and an admin can change it in [Users and permissions](/configuration/administration/users-and-permissions/). If nobody on the console sees it, it is likely a plan or deployment feature; see [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/) for the plans.

### What each plan includes

NeuralSeek is sold under five plans. The matrix compares the features each plan's description lists. It answers "does my plan include X?"; for prices and how to buy, see [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).

<!-- UNCONFIRMED: every cell of this matrix and the curated-LLM sentence below it — from the old plans page (the five plan feature lists); no console screen shows plans -->

| Feature                                                         | Pay-per-answer | Flex | Bring-your-own-LLM | Search | Small Business       |
| --------------------------------------------------------------- | -------------- | ---- | ------------------ | ------ | -------------------- |
| Automatic catalog, curation and grouping of questions and answers | Yes          | Yes  | Yes                | Yes    | Yes                  |
| Export to a virtual agent                                       | Yes            | Yes  | Yes                | No     | Yes                  |
| Round-trip monitoring to a virtual agent                        | Yes            | Yes  | Yes                | No     | Yes                  |
| Sentiment scoring                                               | Yes            | Yes  | Yes                | No     | Yes                  |
| Automatic language detection                                    | Yes            | Yes  | Yes                | No     | Yes                  |
| Translate text into other languages                             | Yes            | Yes  | Yes                | Yes    | Yes                  |
| Extract entities from text                                      | Yes            | Yes  | Yes                | Yes    | Yes                  |
| Categorize text and match or create intents                     | Yes            | Yes  | Yes                | Yes    | Yes                  |
| Connect to any supported LLM                                    | No (curated LLM) | Yes | Yes               | No (curated LLM) | No (curated LLM) |
| Connect to any supported knowledge base                         | Yes            | Yes  | Yes                | Yes    | No (pre-connected)   |
| Unlimited instances within a deployment                         | No             | Yes  | No                 | No     | No                   |
| Install on your own hardware, behind your firewall              | No             | Yes  | No                 | No     | No                   |

On the curated-LLM plans, NeuralSeek updates the underlying LLM's minor versions automatically, and major version changes are controllable by you.

### Where plans and deployment are covered instead

- **Buying a plan, the plan catalogue, and the Support & Development Subscription button on Home**: [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/) and [Support plans](/configuration/administration/support-plans/).
- **On-prem installation on OpenShift or Kubernetes, sizing, and installation steps**: [Deployment](/reference/deployment/).

## FAQ

### A page in the docs is not in my navbar. Is it my plan?

It may be your plan, your deployment (on-prem) or your permissions. Check the table in [Why can't I see this page?](#why-cant-i-see-this-page). If a colleague on the same console can see the page, the cause is your permissions, and an admin can change them.

### Where is Curate? It is not in the top bar.

Open **Admin Tools**. **Curate** is the last item in its menu. The Home page also links to it from the "Get more value from NeuralSeek" panel.

<!-- UNCONFIRMED: the two answers below (Customize is Flex-only; LLM choice limited to BYOLLM and Flex) — product gap audit and the old plans page -->

### Why can't I find Admin Tools → Customize?

Customize is a Flex-plan feature. On other plans it does not appear in the **Admin Tools** menu. See [Flex licensing](/configuration/administration/flex-licensing/).

### Can I connect my own LLM on any plan?

No. LLM choice is part of the Bring-your-own-LLM and Flex plans. Pay-per-answer, Search and Small Business use NeuralSeek's curated LLM. See [Supported LLMs](/configuration/supported-llms/).

### Where do I buy or change a plan?

Not on this page. See [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/); support and development subscriptions are covered in [Support plans](/configuration/administration/support-plans/).
