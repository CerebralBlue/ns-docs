---
title: "Configuration overview"
description: "The Neural Config screen is a routing tree: a Default Config root that holds the instance-wide settings, categories that route matched questions to Seek or to a mAIstro agent, and Guardrails nodes — this page maps the screen and links each part to its own page."
---

## What is it

**Neural Config** is the console screen where an instance is configured. It opens on a routing tree drawn left to right. A **Default Config** node at the top-left holds the settings every answer starts from — KnowledgeBase, LLM, embedding models, platform preferences and the rest — and the branches under it, **Answers (N)**, **Add Intent**, **Category Routing** and **Guardrails**, are where you shape how a question is routed and what it is checked against before and after the LLM.

**Category Routing** grows one node per **category**. A category names a kind of question, says what to do when a question matches it (answer with Seek, or hand it to a mAIstro agent), and either reuses the Default Configuration or carries a Custom Configuration of its own.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase lives behind this one screen: which LLM answers, how strict the confidence thresholds are, what gets masked, which agent a category of question is routed to. Knowing the shape of the tree tells you where a setting is before you go looking for it.

This page is a map. It does not repeat the settings inside the **Edit Configuration** dialog or the ten Guardrails tabs — each of those has its own page, linked from the sections below. If you already know which section you need, go straight to [Neural Config options](/configuration/neural-config/).

## When to use it

- You are setting up a new instance and need to know where the KnowledgeBase, LLM and platform settings are.
- Questions about one topic (billing, account access, an API) should be answered under different settings, or by a mAIstro agent instead of Seek, and you want to split them into categories.
- A category needs guardrails of its own rather than the instance-wide ones.
- You want to see what changed in the configuration, and by whom, or take a backup before a change.

## How it works

### The Neural Config screen

Open **Neural Config** from the top navigation. The screen is a tree drawn as a diagram: each box is a node, and clicking a node opens its dialog. The tree is wider and taller than the window, so a horizontal scrollbar runs along the bottom.

![The Neural Config routing tree on a multi-agent instance: the Default Config root at the top-left, its four child nodes, and one branch per category; the Backup & Restore and Change Logs toolbar floats bottom-right](/img/neural-config/default.png)

- **Default Config** — the root node, top-left, with a green bar. Its two lines read `Default Config` and, underneath, the current action (`Answer Generation` on this instance). Clicking it opens the **Default Configuration** dialog described next.
- **Answers (N)** — purple bar, bulb icon; the first child under the root and under each Answer Generation category. The number varies per branch — 20 on the root of the instance captured here, 1 to 5 on its categories. The mAIstro-led category has no Answers node. What this node opens was not captured.
- **Add Intent** — purple bar, chat icon; under the root and under every category. Opens the **Add Intent** dialog, documented on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Category Routing** — black bar, org-chart icon. It is not clickable; it is the branch point whose children are the existing categories plus **Add a Category**.
- **Add a Category** — black bar, folder icon; one per Category Routing node. Opens the **Add a Category** dialog, below.
- **Guardrails** — red bar, shield icon; under the root and under each category that has a Custom Configuration. Opens the Guardrails dialog, documented under Governance (see the last section).
- **Default Action** — green bar, house icon; present only under a mAIstro-led category. Opens **Default Action: \<category\>**, where the agent for that branch is chosen — documented on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- Category nodes — blue bar for an `Answer Generation` category, orange for a `mAIstro-led` one. Three lines: the name, the action, and either `Default Configuration` or `Custom Configuration` (the latter on a grey band). On the instance captured here: **Account Access**, **Technical Support** and **Billing** hang off the root's Category Routing; **API & Integrations** (mAIstro-led) hangs off Technical Support's — so categories can nest under other categories — and **Refunds** sits further down the tree. Clicking a category node opens **Edit Category: \<name\>**.
- Bottom-right, a floating toolbar holds **Backup & Restore** and **Change Logs**. Both are documented on [Backup, restore & change logs](/configuration/backup-restore/).

### The Default Configuration dialog (root node)

Click the **Default Config** node to open the **Default Configuration** dialog. It is the door into the instance-wide settings.

![The Default Configuration dialog: the Action to take on match selector, and the Edit Configuration and Save footer buttons](/img/neural-config/default-config-answer-generation-panel.png)

- **Close** (×), top-right of the header — every dialog on this screen closes the same way.
- **Action to take on match** — a selector showing the node's current action; **Answer Generation** on the root of this instance. The two values seen across this screen are `Answer Generation` and `mAIstro-led`; the selector's full option list was not captured.
- **Edit Configuration** (edit icon), footer left — opens the configuration dialog itself, an accordion of sections. The headers present in the screen's markup, in order, each with its own page:
  - [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
  - [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) — on this instance the section shows `KnowledgeBase Query Cache (minutes)` at `6000`
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
- **Save**, footer right — saves the dialog. The accordion's own footer offers **Propose Changes** as well as **Save**; the difference is explained on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

The accordion was not opened during this capture — the list above is what its markup names — so [Neural Config options](/configuration/neural-config/) is the authority on what each section holds. [Prompt Engineering](/configuration/neural-config/prompt-engineering/) has a page of its own under Neural Config options; it was not one of the accordion headers on this instance.

### Categories and the Edit Category dialog

A category is a named kind of question, described in two or three sentences; its action decides what happens when a question matches it. Click any category node to open **Edit Category: \<name\>**.

![The Edit Category dialog for a category on the Default Configuration: action selector, Delete Category, Category Name, Category Description, Category ID with its copy button, and the Add Custom Configuration and Save Category footer](/img/neural-config/refunds-answer-generation-default-config-panel.png)

- **Action to take on match** — the same selector as on the root, showing **Answer Generation** or **mAIstro-led**. On this screen an Answer Generation category carries an Answers node (and, once it has a Custom Configuration, a Guardrails node); the mAIstro-led category carries a **Default Action** node and no Answers node.
- **Delete Category** (red, trash icon) — removes the category. Its **Cancel** / **Confirm Delete** confirmation is present in the screen's markup; it was not triggered.
- **Category Name** — the name shown on the node. The placeholder is `Payroll`.
- **Category Description** — helper text `Category Description (2-3 sentences)`; placeholder `Payroll inquiries, Tax withholding questions, benefits contributions`. The wand icon beside the label is named **Auto-generate description**. The instance captured here describes each category as the kinds of question it covers — Refunds, for example, reads `Refund requests, disputed charges and credit notes. Needs the invoice number and the reason before it can be actioned.`
- **Category ID** — a read-only six-digit value, shown as a code snippet with a **Copy to clipboard** button beside it (the button reads `Copied!` after use). On a category that has its own Custom Configuration the label reads **Category Proposal ID** instead. What accepts this value is not shown on this screen.
- **Add Custom Configuration** (edit icon), footer left — shown while the category uses the Default Configuration. Once a category has settings of its own, the button reads **Edit Custom Configuration** (edit icon), the node's third line reads `Custom Configuration`, the category has a **Guardrails** node of its own and a tab of its own in the **Change Log** dialog.
  <!-- UNCONFIRMED: Add Custom Configuration opens the same configuration dialog as the root's Edit Configuration, saved against the category — old page ("The familiar NeuralSeek Configuration panel will pop up"); neither button was clicked in this capture, whose markup only shows a Delete Configuration / Save footer for the category form -->
  The old documentation describes **Add Custom Configuration** as opening the same configuration dialog as the root's **Edit Configuration**, saved against the category; neither button was clicked in this capture. Removing a category's custom configuration (**Delete Configuration**) is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Save Category**, footer right — saves the dialog.
- **Close** (×) — as on every dialog.

![The Edit Category dialog for a category with a Custom Configuration: the ID is labelled Category Proposal ID and the footer button reads Edit Custom Configuration](/img/neural-config/billing-answer-generation-custom-configu-panel.png)

A mAIstro-led category has the same fields; only the action differs, and the agent itself is chosen on the branch's **Default Action** node rather than in this dialog.

![The Edit Category dialog for the mAIstro-led category: Action to take on match reads mAIstro-led, and the description says questions are routed to a mAIstro agent](/img/neural-config/api-integrations-maistro-led-default-con-panel.png)

<!-- UNCONFIRMED: a flow must begin with a Seek Input node to be offered in the Default Action list — old page ("edit the mAIstro agent to begin with a Seek - In node"); probe p11 only shows that the one selected flow does start with seekIn, not that the list filters on it -->

The flow shown selected on that node's **Default Action** dialog on this instance is `ex_Chat_with_a_document`. Fetched with `get_agent` via the MCP, its NTL begins with a Seek Input node and ends with a Seek Output node — the shape the old documentation says a flow needs before it is offered to a mAIstro-led category:

```text
{{ seekIn }}
{{ condition | value: "'<< name: searchFile, prompt: false >>' != ''" }}=>{{ saveB64Doc | name: "<< name: contextUser, prompt: false >>" | base64String: "<< name: searchFile, prompt: false >>" }}=>{{ writeCacheKey | index: "doc" | key: "<< name: contextUser, prompt: false >>" | timeExpire: "" | value: "" }}
{{ readCacheKey | index: "doc" | key: "<< name: contextUser, prompt: false >>" }}
{{ LLM | prompt: "Answer this question: << name: seekIn.originalQuery, prompt: false >>

Using the following information only:
" }}
{{ seekOut | answer: "" | kbCoverage: "100" | kbScore: "100" | url: "" | passages: "" | document: "Chat Document" }}
```

Which other agents the **Select a mAIstro flow** list offers could not be confirmed: `list_agents` via the MCP does not enumerate the `ex_*` example agents on this instance, even though `get_agent` fetched this one by name.

### The Add a Category dialog

**Add a Category** hangs off every **Category Routing** node, beside the existing categories, so a new category can be added at the root or under an existing category.

![The Add a Category dialog: the Action to take on match selector, empty Category Name and Category Description fields, a greyed-out Add Custom Configuration button and Save Category](/img/neural-config/add-a-category-panel.png)

- **Action to take on match** — opens showing **Answer Generation** on this instance.
- **Category Name** and **Category Description** — the same two fields as Edit Category, empty, with the same placeholders and the same **Auto-generate description** wand.
- **Add Custom Configuration** (edit icon) — present but disabled. A category is saved first and gets its custom configuration afterwards, from its own Edit Category dialog.
- **Save Category**, footer right — saves the new category. There is no **Delete Category** button and no ID row until the category exists.
- **Close** (×) — as on every dialog.

<!-- UNCONFIRMED: categories require Multi-Agent Routing, whose switch is "in the bottom right corner of the Configure tab" — old page; this capture shows only the hidden Upgrade to Multi-Agent / Revert to Single Agent confirmations, and the bottom-right toolbar holds Backup & Restore and Change Logs only -->

Categories are part of Multi-Agent Routing. The screen's markup carries an **Upgrade to Multi-Agent** confirmation (**Cancel** / **Confirm Upgrade**) and a **Revert to Single Agent** one (**Cancel** / **Confirm Revert**), so the mode can be switched in both directions; the instance captured here was already multi-agent, so the control that opens them was not seen.

### Nodes and buttons documented elsewhere

These live on this screen but have their own pages:

- **Guardrails** node → the **Guardrails: Default Config** dialog: a scrolling tab strip with ten tabs in this order — Semantic Scoring, Prompt Injection, PII, Profanity (HAP), Attribution Protection, Warning Confidence, Min Confidence, Min Text, Max Length, Custom Governance — and a **Save** footer. Start at [Guardrails overview](/governance/guardrails/overview/); per tab: [Semantic Scoring](/governance/guardrails/semantic-scoring/), [Prompt Injection](/governance/guardrails/prompt-injection/), [PII](/governance/pii-detection/), [Profanity (HAP)](/governance/guardrails/profanity-hap/), [Attribution Protection](/governance/guardrails/attribution-protection/), [Warning Confidence and Min Confidence](/governance/guardrails/min-confidence/), [Custom Governance](/governance/guardrails/custom-governance-agents/); Min Text and Max Length are on the overview. The **Semantic Model Tuning** button inside Semantic Scoring opens [Semantic model tuning](/configuration/semantic-model/).
- **Default Action** node (on a mAIstro-led branch) → **Default Action: \<category\>**: a **Select a mAIstro flow** combobox with a clear (×) button, a read-only preview of the chosen agent's nodes, and a **Save** button — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Add Intent** node → the **Add Intent** dialog: `Run a mAIstro agent or seek for this intent.` with a **Seek** toggle, then **Intent Name**, **Example question**, **Answer** and **Save** — same page.
- **Change Logs** → the **Change Log** dialog: one tab per configuration (Default Config plus each category with a Custom Configuration — Technical Support and Billing on this instance), a table of `Proposal ID / Configuration Date`, `User`, `Version` and an `Action` column holding **Rollback**; rows expand to the changed keys and a note — see [Backup, restore & change logs](/configuration/backup-restore/).
- **Backup & Restore** → the **Backup and Restore** dialog (**Download Settings**, **Upload Settings**, **Backup**, **Restore**) — same page.

The screen's markup also carries confirmations that were not triggered in this capture: **Rebuild Vector Intents** (**Cancel** / **Confirm Rebuild**), **Delete Configuration**, **Version Information** (**Cancel** / **Save**) and **Proposal Activated** (**Ok**), besides the two multi-agent ones above.

## FAQ

### Where do I change the KnowledgeBase, LLM or platform settings?

Click the **Default Config** node at the top-left of the Neural Config tree, then **Edit Configuration** in the dialog's footer. The configuration dialog is an accordion; each section has its own page under [Neural Config options](/configuration/neural-config/).

### What do "Answer Generation" and "mAIstro-led" mean on a node?

They are the two values of **Action to take on match** seen on this screen, on the root and on every category. An Answer Generation category carries an **Answers (N)** node; a mAIstro-led category carries a **Default Action** node, where the agent that handles matched questions is chosen, and no Answers node.

### Why does one category node say "Custom Configuration" and another "Default Configuration"?

It is the node's third line. A category on the Default Configuration shows **Category ID** in its Edit Category dialog and an **Add Custom Configuration** footer button. A category with a Custom Configuration shows **Category Proposal ID**, its footer button reads **Edit Custom Configuration**, it has a **Guardrails** node of its own, and it gets a tab of its own in the **Change Log** dialog.

### Can a category sit under another category?

Yes. Every category has its own **Category Routing** node with an **Add a Category** child; on the instance captured here, **API & Integrations** hangs off Technical Support's Category Routing.

### Where are the guardrails (PII, profanity, prompt injection)?

On the **Guardrails** node under Default Config — and under any category with a Custom Configuration — as a ten-tab dialog. Each tab has its own page under Governance; start at [Guardrails overview](/governance/guardrails/overview/).

### How do I see who changed a setting, or undo a change?

**Change Logs** in the toolbar at the bottom-right lists every saved version per configuration with the user, a version label and a **Rollback** action. See [Backup, restore & change logs](/configuration/backup-restore/).
