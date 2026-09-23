---
title: "Configuration overview"
description: "The Neural Config screen is a routing tree: a Default Config root that holds the instance-wide settings, categories that route matched questions to Seek or to a mAIstro agent, and Guardrails nodes — this page maps the screen and links each part to its own page."
---

## What is it

**Neural Config** is the console screen where an instance is configured. It opens on a routing tree drawn left to right. A **Default Config** node at the top-left holds the settings every answer starts from — KnowledgeBase, LLM, embedding models, platform preferences and the rest — and the branches under it, **Answers (N)**, **Add Intent**, **Category Routing** and **Guardrails**, are where you shape how a question is routed and what it is checked against before and after the LLM.

**Category Routing** grows one node per **category**. A category names a kind of question, says what to do when a question matches it (answer with Seek, or hand it to a mAIstro agent), and either reuses the Default Configuration or carries a Custom Configuration of its own.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase lives behind this one screen: which LLM answers, how strict the confidence thresholds are, what gets masked, which agent a category of question is routed to. Knowing the shape of the tree tells you where a setting is before you go looking for it.

This page is a map. It does not repeat the settings inside the **Edit Configuration** dialog or the Guardrails tabs — each of those has its own page, linked from the sections below — and it does not explain how a change is committed (**Save**, **Propose Changes**) or the **Add Intent**, **Default Action** and **Delete Configuration** dialogs, which are on [Using the Neural Config page](/configuration/neural-config/using-this-page/). If you already know which settings section you need, go straight to [Neural Config options](/configuration/neural-config/).

Neural Config is the wrong place when the answer is wrong because the content is: a missing, stale or mis-indexed document is a KnowledgeBase task ([Connect a KnowledgeBase](/knowledge/connect-a-kb/)), and no setting on this screen adds knowledge the KnowledgeBase does not hold. It is also more than you need for one setting: if you already know the control, its own page (linked from the sections below) is shorter than the tree.

## When to use it

- You are setting up a new instance and need to know where the KnowledgeBase, LLM and platform settings are.
- Questions about one topic (billing, account access, an API) should be answered under different settings, or by a mAIstro agent instead of Seek, and you want to split them into categories.
- A category needs guardrails of its own rather than the instance-wide ones.
- You want to see what changed in the configuration, and by whom, or take a backup before a change.

## How it works

### The Neural Config screen is a routing tree

Open **Neural Config** from the top navigation. The screen is a diagram: each box is a node with a coloured bar down its left edge and an icon, and clicking most nodes opens a dialog. The tree is wider than the window — a horizontal scrollbar runs along the bottom, and the right-hand branches are cut off until you scroll.

![The Neural Config routing tree: the Default Config root at the top-left with its Answers (22), Add Intent, Category Routing and Guardrails children; Account Access, Technical Support and Billing branch off Category Routing, API & Integrations hangs off Technical Support, and the Backup & Restore / Change Logs toolbar floats bottom-right](/img/neural-config/default.png)

- **Default Config** — the root node, top-left, green bar. Two lines: `Default Config` and, under a small icon, the current action, `Answer Generation`. Clicking it opens the **Default Configuration** dialog (next section). It is the only node whose dialog leads to **Edit Configuration**, the door to the instance-wide settings.
- **Answers (22)** — purple bar, bulb icon; the first child under the root. The number is per branch: the instance captured here shows `Answers (22)` on the root, `Answers (3)` under Account Access, `Answers (4)` under Technical Support and `Answers (2)` under Refunds. Billing and the mAIstro-led API & Integrations have no Answers node. Clicking `Answers (2)` produced no change on the screen during this capture, so what this node opens is not documented here.
- **Add Intent** — purple bar, chat icon; under the root and under every category. Opens the **Add Intent** dialog, documented on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Category Routing** — black bar, org-chart icon. It is not clickable; it is the branch point whose children are the existing categories plus **Add a Category**.
- **Add a Category** — black bar, folder icon; one per Category Routing node. Opens the **Add a Category** dialog, below.
- **Guardrails** — red bar, shield icon; under the root and under Technical Support, Refunds and Billing — the three categories whose node reads `Custom Configuration`. Account Access, on the Default Configuration, has none. Opens **Guardrails: Default Config**, documented under Governance (see the last section).
- **Default Action** — green bar, house icon; on this screen it exists only under **API & Integrations**, the mAIstro-led category. Opens **Default Action: API & Integrations**, documented on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- Category nodes — three lines: the name, the action, and either `Default Configuration` or `Custom Configuration` (the latter on a grey band). Blue bar for an `Answer Generation` category, orange for a `mAIstro-led` one. On the instance captured here: **Account Access** (Answer Generation, Default Configuration), **Technical Support** (Answer Generation, Custom Configuration), **Billing** (Answer Generation, Custom Configuration — its node is cut off at the bottom of the window), **Refunds** (Answer Generation, Custom Configuration) and **API & Integrations** (mAIstro-led, Default Configuration). API & Integrations hangs off Technical Support's Category Routing, not the root's — categories nest. Clicking a category node opens **Edit Category: \<name\>**.
- Bottom-right, a floating toolbar holds **Backup & Restore** and **Change Logs**. Both are documented on [Backup, restore & change logs](/configuration/backup-restore/).

The tree is a console view, not something the API reports back. A `seek` call through the MCP for `How do I get a refund?` — a question the Refunds category is described to cover — returned no field naming a category, intent or branch; the response held only the answer and its scores:

```json
{
  "answer": "I do not have any information about \"How do I get a refund?\".",
  "confidence": 0,
  "KBscore": 0,
  "semanticScore": 0,
  "sources": []
}
```

(That is the MCP's response shape, not the REST `/seek` response.)

### The Default Configuration dialog (root node)

Click the **Default Config** node to open the **Default Configuration** dialog. Note the two spellings: the node reads `Default Config`, the dialog header `Default Configuration`.

![The Default Configuration dialog: a Close button top-right, the Action to take on match selector showing Answer Generation, and a footer with Edit Configuration (brown, gear icon) on the left and Save (blue) on the right](/img/neural-config/default-config-answer-generation--default-config-answer-generation.png)

- **Close** (×), top-right of the header — every dialog on this screen closes the same way.
- **Action to take on match** — a selector showing the root's current action, **Answer Generation**. The screen gives no help text; the two option names are the only explanation.

  ![The Action to take on match selector on the Default Configuration dialog, reading Answer Generation](/img/neural-config/default-config-answer-generation--action-to-take-on-match.png)

  Its options are `Answer Generation` and `mAIstro-led`. What the tree shows for each: an **Answer Generation** branch carries an **Answers (N)** node; the **mAIstro-led** branch carries a **Default Action** node instead, where a mAIstro flow is selected, and its category description on this instance reads `Routed to a mAIstro agent`. The root and four categories are Answer Generation here; API & Integrations is mAIstro-led.

  ![The Action to take on match option list, open: Answer Generation (ticked) and mAIstro-led](/img/neural-config/default-config-answer-generation--options-action-to-take-on-match.png)

- **Edit Configuration** (gear icon), footer left, brown — opens the configuration dialog itself, headed **Configuration: Default Config**. It is an accordion with fourteen sections, in this order on the captured screen:
  1. [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
  1. [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
  1. [LLM Details](/configuration/neural-config/llm-details/)
  1. [Embedding Models](/configuration/neural-config/embedding-models/)
  1. [Company / Organization Preferences](/seek/tuning/)
  1. [Platform Preferences](/configuration/neural-config/platform-preferences/)
  1. [Corporate Document Filter](/governance/corporate-document-filter/)
  1. [Corporate Logging](/governance/logging/)
  1. [Prompt Engineering](/configuration/neural-config/prompt-engineering/)
  1. [Dynamic Personalization](/seek/personalization/)
  1. [Answer Engineering & Preferences](/seek/tuning/)
  1. [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/)
  1. [mAIstro Configuration](/configuration/neural-config/maistro-configuration/)
  1. [Secrets](/configuration/neural-config/secrets/)

  What each section holds is on its own page; [Neural Config options](/configuration/neural-config/) lists them all. The accordion's footer offers **Propose Changes** as well as **Save**.

- **Save**, footer right, blue — saves this dialog. What saving means on this screen, and how it differs from proposing a change, is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Categories and the Edit Category dialog

A category is a named kind of question, described in two or three sentences; its action decides what happens when a question matches it. Click any category node to open **Edit Category: \<name\>** — the name is in the title.

![The Edit Category: Refunds dialog: Action to take on match reading Answer Generation, a red Delete Category button, Category Name, Category Description with the Auto-generate description wand, a Category Proposal ID row with a copy button, and a footer with Edit Custom Configuration and Save Category](/img/neural-config/refunds-answer-generation-custom-configu-panel.png)

- **Action to take on match** — the same selector as on the root, with the same two options, `Answer Generation` and `mAIstro-led`. It reads **Answer Generation** on Refunds, Billing and Account Access, and **mAIstro-led** on API & Integrations.
- **Delete Category** (red, trash icon) — present only on Edit Category, not on Add a Category. Its **Cancel** / **Confirm Delete** confirmation is in the screen's markup; it was not triggered during this capture.
- **Category Name** — the name shown on the node; placeholder `Payroll`.
- **Category Description** — helper text `Category Description (2-3 sentences)`; placeholder `Payroll inquiries, Tax withholding questions, benefits contributions`. The wand icon beside the label is named **Auto-generate description**; what it generates from was not exercised. The instance captured here describes each category as the kinds of question it covers — Refunds reads `Refund requests, disputed charges and credit notes. Needs the invoice number and the reason before it can be actioned.`, and API & Integrations reads `Questions about the REST API, webhooks, SDKs and third-party connectors. Routed to a mAIstro agent that can look up the endpoint reference.`
- **Category Proposal ID** — on a category with a Custom Configuration (Refunds, Billing): a read-only six-digit value shown as a code snippet, with a **Copy to clipboard** button beside it (the button's text reads `Copied!` after use). On a category on the Default Configuration (Account Access, API & Integrations) the same row is labelled **Category ID**. What accepts either value is not shown on this screen.

  ![The Category Proposal ID row on Edit Category: Refunds, a six-digit value with a copy button](/img/neural-config/refunds-answer-generation-custom-configu--category-proposal-id.png)

  ![The Category ID row on Edit Category: Account Access, a six-digit value with a copy button](/img/neural-config/account-access-answer-generation-default--category-id.png)

- **Edit Custom Configuration** (gear icon), footer left, brown — on a category with a Custom Configuration (Refunds, Billing). On a category on the Default Configuration (Account Access, API & Integrations) the same button reads **Add Custom Configuration**. Neither was clicked during this capture.
  <!-- UNCONFIRMED: Add Custom Configuration opens the same fourteen-section configuration dialog as the root's Edit Configuration, saved against the category — old page ("The familiar NeuralSeek Configuration panel will pop up"); the button was never clicked -->
  The previous documentation describes **Add Custom Configuration** as opening the same configuration dialog as the root's **Edit Configuration**, saved against the category.
  <!-- UNCONFIRMED: adding a custom configuration is what adds the Guardrails node under a category — old page ("Upon adding a custom configuration, a new node will appear labeled Guardrails"); consistent with the tree (the three Custom Configuration categories have one, Account Access does not) but the transition was not observed -->
  It also says that adding one is what puts a **Guardrails** node under the category — consistent with the tree above, where exactly the three Custom Configuration categories have one. Removing a custom configuration (**Delete Configuration**) is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Save Category**, footer right, blue — saves the dialog.
- **Close** (×) — as on every dialog.

A mAIstro-led category has the same fields; only the action differs, and the agent itself is chosen on the branch's **Default Action** node rather than in this dialog.

![The Edit Category: API & Integrations dialog: Action to take on match reads mAIstro-led, the description says questions are routed to a mAIstro agent, the ID row is labelled Category ID and the footer button reads Add Custom Configuration](/img/neural-config/api-integrations-maistro-led-default-con-panel.png)

### The Add a Category dialog

**Add a Category** hangs off every **Category Routing** node, beside the existing categories, so a new category can be added at the root or under an existing category.

![The Add a Category dialog: the Action to take on match selector, empty Category Name and Category Description fields showing their placeholders, a greyed-out Add Custom Configuration button and Save Category](/img/neural-config/add-a-category-panel.png)

- **Action to take on match** — opens showing **Answer Generation**; the options are `Answer Generation` and `mAIstro-led`, as on every other node.

  ![The Action to take on match selector on Add a Category, reading Answer Generation](/img/neural-config/add-a-category--action-to-take-on-match.png)

  ![The Action to take on match option list on Add a Category, open: Answer Generation (ticked) and mAIstro-led](/img/neural-config/add-a-category--options-action-to-take-on-match.png)

- **Category Name** — empty; placeholder `Payroll`.

  ![The empty Category Name field on Add a Category with its Payroll placeholder](/img/neural-config/add-a-category--category-name.png)

- **Category Description** — empty; placeholder `Payroll inquiries, Tax withholding questions, benefits contributions`; helper text `Category Description (2-3 sentences)`; the **Auto-generate description** wand is present.

  ![The empty Category Description field on Add a Category, with the Auto-generate description wand beside the label and the helper text Category Description (2-3 sentences) under it](/img/neural-config/add-a-category--category-description-2-3-sentences.png)

- **Add Custom Configuration** (gear icon) — present but disabled and greyed out. A category is saved first and gets its custom configuration afterwards, from its own Edit Category dialog.
- **Save Category**, footer right, blue — saves the new category. There is no **Delete Category** button and no ID row until the category exists.
- **Close** (×) — as on every dialog.

<!-- UNCONFIRMED: a new category starts on the Default Configuration settings and Guardrails — old page ("Newly defined categories will automatically utilize the Default Configuration settings and Guardrails"); plausible from the Default Configuration third line on Account Access and API & Integrations, but no category was created in this capture -->

The previous documentation says a new category starts on the Default Configuration settings and Guardrails until a custom configuration is added; on the captured tree the two categories without one do read `Default Configuration`.

<!-- UNCONFIRMED: categories require Multi-Agent Routing, switched on "in the bottom right corner of the Configure tab" — old page; this capture's bottom-right toolbar holds Backup & Restore and Change Logs only, and the switch's Upgrade to Multi-Agent / Revert to Single Agent confirmations exist in the markup but were never seen opening -->

Categories are part of Multi-Agent Routing. The instance captured here was already multi-agent; the control that switches the mode was not seen, though its **Upgrade to Multi-Agent** (**Cancel** / **Confirm Upgrade**) and **Revert to Single Agent** (**Cancel** / **Confirm Revert**) confirmations are in the screen's markup. The switch is documented on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Nodes and buttons documented elsewhere

These live on this screen but have their own pages:

- **Guardrails** node → the **Guardrails: Default Config** dialog: a scrolling tab strip with ten tabs in this order — **Semantic Scoring**, **Prompt Injection**, **PII**, **Profanity (HAP)**, **Attribution Protection**, **Warning Confidence**, **Min Confidence**, **Min Text**, **Max Length**, **Custom Governance** — and a **Save** footer. The first tab opens with `The Semantic Scoring model checks the generated answer against the KnowledgeBase sources and rates the answer based on the quantity and focus. Semantic scoring is not available in cross-laguage usecases.` (sic). Start at [Guardrails overview](/governance/guardrails/overview/); per tab: [Semantic Scoring](/governance/guardrails/semantic-scoring/), [Prompt Injection](/governance/guardrails/prompt-injection/), [PII](/governance/pii-detection/), [Profanity (HAP)](/governance/guardrails/profanity-hap/), [Attribution Protection](/governance/guardrails/attribution-protection/), [Warning Confidence and Min Confidence](/governance/guardrails/min-confidence/), [Custom Governance](/governance/guardrails/custom-governance-agents/). The **Semantic Model Tuning** button inside Semantic Scoring opens [Semantic model tuning](/configuration/semantic-model/).

  ![The Guardrails: Default Config dialog on its Semantic Scoring tab: the tab strip along the top, the tab's intro paragraph, six Enable/Disable toggles, the Semantic Model Tuning button and a Save footer](/img/neural-config/guardrails-panel.png)

- **Add Intent** node → the **Add Intent** dialog; **Default Action** node (on a mAIstro-led branch) → **Default Action: \<category\>** — both on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Change Logs** (bottom-right toolbar) → the **Change Log** dialog: tabs **Default Config**, **Billing** and **Technical Support** on this instance — one for the root and one per category with a Custom Configuration, although Refunds, which also has one, showed no tab — and a table with the columns `Proposal ID / Configuration Date`, `User`, `Version` and `Action`, the last holding **Rollback**. See [Backup, restore & change logs](/configuration/backup-restore/).
- **Backup & Restore** (bottom-right toolbar) → the **Backup and Restore** dialog — same page.
- The fourteen accordion sections behind **Edit Configuration** → [Neural Config options](/configuration/neural-config/).

## FAQ

### Where do I change the KnowledgeBase, LLM or platform settings?

Click the **Default Config** node at the top-left of the Neural Config tree, then **Edit Configuration** in the **Default Configuration** dialog's footer. The configuration dialog is an accordion of fourteen sections; each has its own page under [Neural Config options](/configuration/neural-config/).

### What is the difference between "Answer Generation" and "mAIstro-led"?

They are the two values of **Action to take on match**, on the root and on every category. An Answer Generation category is answered by Seek and carries an **Answers (N)** node; a mAIstro-led category is handed to a mAIstro agent chosen on its **Default Action** node, and has no Answers node.

### Why does one category say "Custom Configuration" and another "Default Configuration"?

It is the node's third line. A category with a Custom Configuration shows **Category Proposal ID** and **Edit Custom Configuration** in its Edit Category dialog and has a **Guardrails** node of its own; a category on the Default Configuration shows **Category ID** and **Add Custom Configuration**, and no Guardrails node.

### Can I nest a category under another category?

Yes. Every category has its own **Category Routing** node with an **Add a Category** child; on the instance captured here, **API & Integrations** hangs off Technical Support's Category Routing.

### Where are PII, profanity and confidence thresholds?

On the **Guardrails** node — under Default Config, and under any category with a Custom Configuration — as tabs of the **Guardrails: Default Config** dialog, not in the Edit Configuration accordion. Start at [Guardrails overview](/governance/guardrails/overview/).

### Where do I see who changed what?

**Change Logs**, in the toolbar at the bottom-right of the tree, lists every saved version per configuration with its user, a version label and a **Rollback** action. See [Backup, restore & change logs](/configuration/backup-restore/).
