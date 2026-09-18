---
title: "Configuration overview"
description: "The Neural Config screen is a routing tree: a Default Config root that holds the instance-wide settings, categories that route matched questions to Seek or to a mAIstro agent, and Guardrails nodes — this page maps the screen and links each part to its own page."
---

## What is it

**Neural Config** is the console screen where an instance is configured. It opens on a routing tree drawn left to right: a **Default Config** node at the top-left holds the settings every answer starts from (KnowledgeBase, LLM, embedding models, platform preferences and so on), and the branches under it — **Answers (N)**, **Add Intent**, **Category Routing**, **Guardrails** — are where you shape how a question is routed and what it is checked against before and after the LLM.

When Multi-Agent Routing is on, **Category Routing** grows one node per **category**. Each category names a kind of question, says what to do when a question matches it (answer with Seek, or hand it to a mAIstro agent), and either reuses the Default Configuration or carries a Custom Configuration of its own.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase lives behind this one screen: which LLM answers, how strict the confidence thresholds are, what gets masked, what a category of question is routed to. Knowing the shape of the tree tells you where a setting is before you go looking for it.

This page is a map. It does not repeat the settings inside the **Edit Configuration** dialog or the ten Guardrails tabs — each of those has its own page, linked from the sections below. If you already know which accordion you need, go straight to [Neural Config options](/configuration/neural-config/).

## When to use it

- You are setting up a new instance and need to know where the KnowledgeBase, LLM and platform settings are.
- Questions about one topic (billing, account access, an API) should be answered under different settings, or by a mAIstro agent instead of Seek, and you want to split them into categories.
- A category needs guardrails of its own rather than the instance-wide ones.
- You want to see what changed in the configuration, and by whom, or take a backup before a change.

## How it works

### The Neural Config screen

Open **Neural Config** from the top navigation. The screen is a tree drawn as a diagram; each box is a node you click to open its dialog, and the tree is wider than the window, so a horizontal scrollbar sits along the bottom.

![The Neural Config routing tree on a multi-agent instance: the Default Config root at the top-left, its four child nodes, and one branch per category](/img/neural-config/default.png)

- **Default Config** — the root node, top-left, with a green bar. Its two lines read `Default Config` and, underneath, the current action (`Answer Generation` on this instance). Clicking it opens the **Default Configuration** dialog described next.
- Under the root, in screen order: **Answers (N)**, **Add Intent**, **Category Routing** and **Guardrails**. The number in **Answers (N)** varies per branch — 20 on the root of the instance captured here, 1 to 5 on the categories.
- **Category Routing** → **Add a Category** plus the existing categories. Each category node has three lines: the category name, its action (`Answer Generation` or `mAIstro-led`), and either `Default Configuration` or `Custom Configuration`.
- A category with a **Custom Configuration** gets its own **Guardrails** node; a category on the Default Configuration does not. A **mAIstro-led** category gets a **Default Action** node instead, where the agent is chosen.
- Bottom-right, a floating toolbar holds **Backup & Restore** and **Change Logs**. Both are documented on [Backup, restore & change logs](/configuration/backup-restore/).

The framing controls of the tree — **Add Intent**, **Default Action**, **Delete Configuration**, and the difference between **Save** and **Propose Changes** — are covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### The Default Configuration dialog (root node)

Click the **Default Config** node to open the **Default Configuration** dialog. It is the door into the instance-wide settings.

![The Default Configuration dialog: the Action to take on match selector, and the Edit Configuration and Save footer buttons](/img/neural-config/default-config-answer-generation-panel.png)

- **Close** (×), top-right of the header — every dialog on this screen closes the same way.
- **Action to take on match** — a selector showing the current value, **Answer Generation** on this instance. The two options are `Answer Generation` and `mAIstro-led`.
- **Edit Configuration** (edit icon), footer left — opens the configuration dialog itself, an accordion of sections. Each section has its own page:
  - [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
  - [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
  - [LLM Details](/configuration/neural-config/llm-details/)
  - [Embedding Models](/configuration/neural-config/embedding-models/)
  - Company / Organization Preferences — no page yet
  - [Platform Preferences](/configuration/neural-config/platform-preferences/)
  - [Corporate Document Filter](/governance/corporate-document-filter/)
  - [Corporate Logging](/governance/logging/)
  - Answer Engineering & Preferences — no page yet
  - [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/)
  - [mAIstro Configuration](/configuration/neural-config/maistro-configuration/)
  - [Secrets](/configuration/neural-config/secrets/)
- **Save**, footer right — saves the dialog.

The list above is the set of section headers present in the screen's markup on the instance captured here; the dialog was not opened during this capture, so the index page [Neural Config options](/configuration/neural-config/) is the authority on what each section holds.

### Categories and the Edit Category dialog

A category is a named kind of question, described in two or three sentences; its action decides what happens when a question matches it. Click any category node to open **Edit Category: \<name\>**.

![The Edit Category dialog for a category on the Default Configuration: action selector, Delete Category, Category Name, Category Description, Category ID, and the Add Custom Configuration and Save Category footer](/img/neural-config/refunds-answer-generation-default-config-panel.png)

- **Action to take on match** — the same selector as on the root. **Answer Generation** answers with Seek under the category's configuration; **mAIstro-led** hands the matched question to the agent set on that branch's **Default Action** node.
- **Delete Category** (red, trash icon) — removes the category; it has a **Cancel** / **Confirm Delete** confirmation.
- **Category Name** — the name shown on the node. The placeholder is `Payroll`.
- **Category Description** — helper text `Category Description (2-3 sentences)`; placeholder `Payroll inquiries, Tax withholding questions, benefits contributions`. A wand icon beside the label is named **Auto-generate description**. The instance captured here describes each category as the kinds of question it covers — for example, `Refund requests, disputed charges and credit notes. Needs the invoice number and the reason before it can be actioned.`
- **Category ID** — a read-only six-digit value with a **Copy to clipboard** button (it reads `Copied!` after use). On a category that has its own Custom Configuration the label reads **Category Proposal ID** instead. What accepts this value is not shown on this screen.
- **Add Custom Configuration** (edit icon), footer left — shown while the category uses the Default Configuration. Once a category has its own settings, the button reads **Edit Custom Configuration** (edit icon), the node's third line reads `Custom Configuration`, and the category has a **Guardrails** node of its own.
  <!-- UNCONFIRMED: Add Custom Configuration opens the same configuration dialog as the root's Edit Configuration — old page ("The familiar NeuralSeek Configuration panel will pop up"); this capture only shows a Delete Configuration / Save footer in the screen's markup for the category form of that dialog -->
  The old documentation describes it as opening the same configuration dialog as the root's **Edit Configuration**, saved against the category; in this capture the category form of that dialog was not opened, though its footer (**Delete Configuration** / **Save**) is present in the screen's markup.
- **Save Category**, footer right — saves the dialog.

![The Edit Category dialog for a category with a Custom Configuration: the ID is labelled Category Proposal ID and the footer button reads Edit Custom Configuration](/img/neural-config/billing-answer-generation-custom-configu-panel.png)

On the instance captured here, the two categories with a Custom Configuration are exactly the two that have a tab of their own in the **Change Log** dialog, and their change-log entries carry a `proposal` id next to the category `id`. How proposals are activated and deleted is described on [Backup, restore & change logs](/configuration/backup-restore/).

Routing is not visible in the answer. Asked `How do I get a refund for a disputed charge on my invoice?` via the MCP, the response carried the usual answer and scores and no field naming a category or configuration:

```text
KBscore: 100 | Semantic: 5
```

A question aimed at the mAIstro-led category came back shaped differently (no sources, a semantic score of `-1`), but the response likewise has no field identifying which agent produced it — so the tree is the only place that shows which path a question takes.

### The Add a Category node

**Add a Category** hangs off every **Category Routing** node, beside the existing categories. Its dialog has the same fields as Edit Category: set the **Action to take on match**, a **Category Name** and a **Category Description**, then **Save Category**. The new branch appears in the tree on the Default Configuration; give it its own settings later with **Add Custom Configuration**.

<!-- UNCONFIRMED: categories require Multi-Agent Routing, and its switch is "in the bottom right corner of the Configure tab" — old page; this capture only shows the hidden Upgrade to Multi-Agent / Revert to Single Agent confirmations, not their trigger -->

Categories are part of Multi-Agent Routing. The screen carries an **Upgrade to Multi-Agent** confirmation (**Cancel** / **Confirm Upgrade**) and a **Revert to Single Agent** one (**Cancel** / **Confirm Revert**), so the mode can be switched in both directions; the instance captured here was already multi-agent, so the control that opens them was not seen.

### Guardrails, Default Action, Backup & Restore and Change Logs

These nodes and buttons live on this screen but are documented elsewhere:

- **Guardrails** node → the **Guardrails: Default Config** dialog, ten tabs in this order: Semantic Scoring, Prompt Injection, PII, Profanity (HAP), Attribution Protection, Warning Confidence, Min Confidence, Min Text, Max Length, Custom Governance, with a **Save** footer. The tab strip scrolls horizontally. Start at [Guardrails overview](/governance/guardrails/overview/); per tab: [Semantic Scoring](/governance/guardrails/semantic-scoring/), [Prompt Injection](/governance/guardrails/prompt-injection/), [PII](/governance/pii-detection/), [Profanity (HAP)](/governance/guardrails/profanity-hap/), [Attribution Protection](/governance/guardrails/attribution-protection/), [Warning Confidence and Min Confidence](/governance/guardrails/min-confidence/), [Custom Governance](/governance/guardrails/custom-governance-agents/). Min Text and Max Length are on the overview. The **Semantic Model Tuning** button inside Semantic Scoring is [Semantic model tuning](/configuration/semantic-model/).
- **Default Action** node (on a mAIstro-led branch) → **Default Action: \<category\>**, a **Select a mAIstro flow** combobox with a read-only preview of the chosen agent's nodes and a **Save** footer — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Change Logs** → the **Change Log** dialog, one tab per configuration (Default Config plus each category with a Custom Configuration), rows with **Rollback** — see [Backup, restore & change logs](/configuration/backup-restore/).
- **Backup & Restore** → the **Backup and Restore** dialog (**Download Settings**, **Upload Settings**, **Backup**, **Restore**) — same page.

## FAQ

### Where do I change the KnowledgeBase, LLM or platform settings?

Click the **Default Config** node at the top-left of the Neural Config tree, then **Edit Configuration** in the dialog's footer. The configuration dialog is an accordion; each section has its own page under [Neural Config options](/configuration/neural-config/).

### What is the difference between "Answer Generation" and "mAIstro-led"?

They are the two values of **Action to take on match**, on the root and on every category. **Answer Generation** answers the question with Seek under that node's configuration. **mAIstro-led** hands the matched question to the agent chosen on the branch's **Default Action** node.

### Why does one category node say "Custom Configuration" and another "Default Configuration"?

A new category starts on the Default Configuration — its node says so, and it has no **Guardrails** node of its own. **Add Custom Configuration** in its Edit Category dialog gives it settings of its own; after that the node reads `Custom Configuration`, the category grows its own **Guardrails** node, the footer button reads **Edit Custom Configuration**, and the ID is labelled **Category Proposal ID**.

### Where are the guardrails (PII, profanity, prompt injection)?

On the **Guardrails** node under Default Config — and under any category with a Custom Configuration — as a ten-tab dialog. Each tab has its own page under Governance; start at [Guardrails overview](/governance/guardrails/overview/).

### How do I see who changed a setting, or undo a change?

**Change Logs** in the toolbar at the bottom-right lists every saved version per configuration with the user, a version label and a **Rollback** action. See [Backup, restore & change logs](/configuration/backup-restore/).

### Can I tell from a Seek answer which category handled it?

Not from the response. Probed via the MCP on this instance, the answer carried only the standard answer and score fields — no category, configuration or proposal key. The routing tree is the only place that shows which path a question takes.
