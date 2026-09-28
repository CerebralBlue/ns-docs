---
title: "Configuration overview"
description: "The Neural Config screen is a routing tree: a Default Config root that holds the instance-wide settings, categories that send matching questions to Answer Generation or to a mAIstro agent (mAIstro-led) and can carry a configuration of their own, and Guardrails nodes — this page maps the screen and links each part to its own page."
---

## What is it

**Neural Config** is the console screen where a NeuralSeek instance is configured. It opens on a routing tree drawn left to right. The **Default Config** node at the top-left is the root: it holds the settings every answer starts from — KnowledgeBase, LLM, embedding models, platform preferences and the rest. The nodes under it — **Answers**, **Add Intent**, **Category Routing** and **Guardrails** — are where you decide how a question is routed and what it is checked against.

**Category Routing** grows one node per **category**. A category names a kind of question, says what happens when a question matches it (**Answer Generation** or **mAIstro-led**, handed to a mAIstro agent), and either uses the root's settings (**Default Configuration**) or carries a **Custom Configuration** of its own.

## Why it matters

Everything that changes an answer without changing the KnowledgeBase lives behind this one screen: which LLM answers, how strict the confidence thresholds are, what gets masked, which agent a kind of question goes to. Knowing the shape of the tree tells you where a setting is before you go looking for it.

This page is a map. It does not repeat the settings inside the configuration dialog or the Guardrails tabs — each has its own page, linked below. How a change is committed (**Save** versus **Propose Changes**), and the **Add Intent** and **Default Action** dialogs, are on [Using the Neural Config page](/configuration/neural-config/using-this-page/). If you already know which settings section you need, go straight to [Neural Config options](/configuration/neural-config/).

Neural Config is the wrong place when an answer is wrong because the content is: a missing, stale or badly indexed document is a KnowledgeBase task ([Connect a knowledge base](/knowledge/connect-a-kb/)), and no setting on this screen adds knowledge the KnowledgeBase does not hold.

## When to use it

- You are setting up an instance and need to find the KnowledgeBase, LLM and platform settings.
- Questions about one topic (billing, account access, an API) should be answered under different settings, or by a mAIstro agent, so you want to split them into categories.
- A category needs its own LLM, KnowledgeBase or guardrails rather than the instance-wide ones.
- You want to take a backup before a change, or see what changed in the configuration.

## How it works

### The routing tree

Open **Neural Config** from the top navigation. The screen is a diagram: each box is a node, and clicking most nodes opens a dialog. The tree is usually wider than the window — scroll horizontally to reach the right-hand branches. The category names in the pictures on this page (Account Access, Technical Support, Billing, API & Integrations, Refunds) are examples.

![The Neural Config routing tree: Default Config at the top-left with its Answers, Add Intent, Category Routing and Guardrails children; example categories Account Access, Technical Support and Billing branch off Category Routing, API & Integrations hangs off Technical Support, and the Backup & Restore / Change Logs buttons sit at the bottom-right](/img/neural-config/default.png)

- **Default Config** — the root node. Its second line shows its action, `Answer Generation`. Clicking it opens the **Default Configuration** dialog, the way into the instance-wide settings (next section).
- **Answers** — shown with a count in brackets, for example `Answers (25)` under the root; the number differs from branch to branch. Clicking it changes nothing on screen: the node only displays the count.
- **Add Intent** — under the root and under every category. Opens the **Add Intent** dialog, where you add an intent for that level; see [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Category Routing** — a branch point, not a button. Its children are the existing categories plus **Add a Category**.
- **Add a Category** — one per **Category Routing** node. Opens the **Add a Category** dialog ([Adding a category](#adding-a-category)).
- A category node has three lines: the name, the action (**Answer Generation** or **mAIstro-led**), and a badge reading **Default Configuration** or **Custom Configuration**. Every category has its own **Category Routing** node, so categories nest: in the example, API & Integrations sits under Technical Support and Refunds under Billing.
- **Guardrails** — under the root and under each category badged **Custom Configuration**; a category on the **Default Configuration** has none. It opens a dialog headed **Guardrails: Default Config** on the root, with the tabs **Semantic Scoring**, **Prompt Injection**, **PII**, **Profanity (HAP)**, **Attribution Protection**, **Warning Confidence**, **Min Confidence**, **Min Text**, **Max Length** and **Custom Governance**. Each tab is documented from [Guardrails overview](/governance/guardrails/overview/).

  ![The Guardrails: Default Config dialog on its Semantic Scoring tab: the tab strip along the top, six Enable/Disable toggles, the Semantic Model Tuning button and a Save footer](/img/neural-config/guardrails-panel.png)

- **Default Action** — only on a **mAIstro-led** branch. Opens a dialog headed `Default Action: <category>` where **Select a mAIstro flow** picks the agent that handles the category's questions, with a read-only preview of the chosen agent's flow. The dialog is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

  ![The Select a mAIstro flow dropdown in the Default Action dialog of a mAIstro-led category](/img/neural-config/default-action--select-a-maistro-flow.png)

- **Backup & Restore** and **Change Logs** — two buttons at the bottom-right of the screen ([below](#backing-up-and-auditing-the-configuration)).

<!-- UNCONFIRMED: categories are NeuralSeek's Multi-Agent Routing, they drive the path a question takes through the tree, and a question is matched to a category by its description — previous documentation ("Categories are used to drive the path of the multi-agent flow") -->

A tree with categories is what NeuralSeek calls Multi-Agent Routing: a question that matches a category's description takes that category's branch — its settings, guardrails or agent — and a question no category catches stays on the root.

### The Default Configuration dialog (root node)

Click the **Default Config** node to open the **Default Configuration** dialog. The node reads `Default Config`; the dialog header reads `Default Configuration`.

![The Default Configuration dialog: the Action to take on match selector reading Answer Generation, a Close button top-right, and a footer with Edit Configuration (gear icon) on the left and Save on the right](/img/neural-config/default-config-answer-generation-panel.png)

- **Action to take on match** — what the root does with a question. It has two options, the same on the root and on every category:

  | Option                | What it does                                                                                                                                                                 |
  | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Answer Generation** | NeuralSeek generates the answer from the KnowledgeBase, as Seek does.                                                                                                        |
  | **mAIstro-led**       | The question goes to a mAIstro agent. On the tree, a mAIstro-led branch carries a **Default Action** node, where the agent is picked with **Select a mAIstro flow**. |

  The chosen option is shown on the node's second line.

  ![The Action to take on match option list, open: Answer Generation (ticked) and mAIstro-led](/img/neural-config/default-config-answer-generation--options-action-to-take-on-match.png)

- **Edit Configuration** (gear icon), footer left — opens the configuration dialog itself, headed **Configuration: Default Config**: an accordion of fourteen sections, from KnowledgeBase Connection to Secrets, with **Propose Changes** and **Save** in its footer. [Neural Config options](/configuration/neural-config/) lists every section and links to its page.
- **Save**, footer right — saves the dialog. What saving means, and how it differs from **Propose Changes**, is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Adding a category

**Add a Category** hangs off every **Category Routing** node, so a new category can go under the root or under an existing category. Clicking it opens the **Add a Category** dialog.

![The Add a Category dialog: the Action to take on match selector, empty Category Name and Category Description fields showing their placeholders, a greyed-out Add Custom Configuration button and Save Category](/img/neural-config/add-a-category-panel.png)

- **Action to take on match** — the same two options as on the root, **Answer Generation** and **mAIstro-led**. Pick **mAIstro-led** to hand the category's questions to an agent, **Answer Generation** to have them answered from the KnowledgeBase.

  ![The Action to take on match list opened on Add a Category, with Answer Generation at the top and ticked](/img/neural-config/add-a-category--options-action-to-take-on-match.png)

- **Category Name** — the name shown on the node. The empty field shows the placeholder `Payroll`.

  ![The empty Category Name field on Add a Category with its Payroll placeholder](/img/neural-config/add-a-category--category-name.png)

- **Category Description (2-3 sentences)** — the screen asks for two to three sentences saying which questions belong to the category; the placeholder reads `Payroll inquiries, Tax withholding questions, benefits contributions`. The wand icon beside the label is **Auto-generate description**, which offers to write the description for you.

  ![The empty Category Description field on Add a Category, with the Auto-generate description wand beside the label and the helper text Category Description (2-3 sentences) under it](/img/neural-config/add-a-category--category-description-2-3-sentences.png)

- **Add Custom Configuration** — greyed out while you add a category. It is available on an existing category's **Edit Category** dialog, so a category gets its own configuration after it is saved.
- **Save Category** — creates the category. There is no **Delete Category** button and no ID row until the category exists.

<!-- UNCONFIRMED: a new category appears under Category Routing and uses the Default Configuration settings and Guardrails until it gets its own — previous documentation ("Newly defined categories will automatically utilize the Default Configuration settings and Guardrails") -->

The new category appears under the **Category Routing** node you started from, badged **Default Configuration**: it uses the root's settings and guardrails until you give it its own.

### Editing a category: IDs, custom configuration, delete

Click any category node to open its Edit Category dialog, titled with the category's name — `Edit Category: Billing` for a category named Billing. It holds the same fields as **Add a Category**, filled in — **Action to take on match**, **Category Name**, **Category Description (2-3 sentences)** with **Auto-generate description** — plus the controls that only make sense once the category exists. Which of them you see depends on the category's badge.

![The Edit Category dialog of a Custom Configuration category (Billing in the example): Action to take on match, a red Delete Category button, Category Name, Category Description with the Auto-generate description wand, a Category Proposal ID row with a copy button, and a footer with Edit Custom Configuration and Save Category](/img/neural-config/billing-answer-generation-custom-configu-panel.png)

- **Delete Category** (red, trash icon) — removes the category. A confirmation step, **Delete Category** with **Cancel** and **Confirm Delete**, comes before anything is deleted.
- **Category Proposal ID** or **Category ID** — a read-only value with a **Copy to clipboard** button beside it. Copy it wherever you need to reference the category. The label depends on the badge:
  - a category badged **Custom Configuration** shows **Category Proposal ID**;

    ![The Category Proposal ID row on a Custom Configuration category's Edit Category dialog, with its copy button](/img/neural-config/billing-answer-generation-custom-configu--category-proposal-id.png)

  - a category badged **Default Configuration** shows **Category ID**.

    ![The Category ID row on a Default Configuration category's Edit Category dialog (Account Access in the example), with its copy button](/img/neural-config/account-access-answer-generation-default--category-id.png)

- **Edit Custom Configuration** or **Add Custom Configuration** (gear icon), footer left — **Edit Custom Configuration** on a category badged **Custom Configuration**, **Add Custom Configuration** on one badged **Default Configuration**. Both give the category a configuration of its own; what they open is described below.
- **Save Category**, footer right — saves the name, description and action.

A **mAIstro-led** category has the same dialog; only the action differs. The agent itself is not chosen here but on the branch's **Default Action** node.

![The Edit Category dialog of a mAIstro-led category on the Default Configuration (API & Integrations in the example): Action to take on match reads mAIstro-led, the ID row is labelled Category ID and the footer button reads Add Custom Configuration](/img/neural-config/api-integrations-maistro-led-default-con-panel.png)

**A category's own configuration.** On a category badged **Custom Configuration**, **Edit Custom Configuration** opens a configuration dialog headed with the category's name — `Configuration: Refunds` for a category named Refunds. It holds thirteen sections: the same ones as the root's **Configuration: Default Config** dialog except **mAIstro Configuration**, which only the root has. Each section works as described on its own page ([Neural Config options](/configuration/neural-config/)); the difference is the scope — a change here applies to the category, not to the whole instance.

![The Configuration: Refunds dialog: an accordion from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with a red Delete Configuration button on the left and Save on the right](/img/neural-config/refunds-custom-configuration-dialog-panel.png)

The footer differs from the root's: **Delete Configuration** (red, trash icon) on the left and **Save** on the right, and no **Propose Changes**. **Delete Configuration** removes the category's own configuration after a confirmation (**Cancel** / **Confirm Delete**); see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

<!-- UNCONFIRMED: Add Custom Configuration opens the same configuration dialog against the category, and saving it switches the badge to Custom Configuration and adds a Guardrails node under the category — previous documentation ("The familiar NeuralSeek Configuration panel will pop up… Upon adding a custom configuration, a new node will appear labeled Guardrails"); consistent with Edit Custom Configuration, which opens that dialog -->

On a category badged **Default Configuration**, **Add Custom Configuration** opens the same `Configuration: <category>` dialog. Once saved, the node's badge reads **Custom Configuration** and a **Guardrails** node appears under the category.

<!-- UNCONFIRMED: a category's configuration also applies to the categories nested beneath it — previous documentation ("a custom configuration that will be used by it and nested levels beneath it") -->

A category's configuration is also used by the categories nested beneath it, unless they carry one of their own.

### Backing up and auditing the configuration

Two buttons sit at the bottom-right corner of the tree (visible in the first picture on this page):

- **Backup & Restore** — download or upload the whole configuration, or back it up and restore it.
- **Change Logs** — the history of saved configuration versions, with a way back to an earlier one.

Both are documented on [Backup, restore & change logs](/configuration/backup-restore/).

## FAQ

### What is the Default Config node?

The root of the Neural Config tree, at the top-left. Its **Default Configuration** dialog sets the **Action to take on match** for the root and, through **Edit Configuration**, opens the instance-wide settings — the fourteen sections listed on [Neural Config options](/configuration/neural-config/).

### How do I send one kind of question to an agent instead of a generated answer?

Add a category (**Add a Category** under a **Category Routing** node) with **Action to take on match** set to **mAIstro-led**, describe the questions it should catch, and save it. Then click the branch's **Default Action** node and pick the agent with **Select a mAIstro flow**.

### How do I give a category its own settings?

Click the category node. On a category badged **Default Configuration**, use **Add Custom Configuration**; on one already badged **Custom Configuration**, use **Edit Custom Configuration**. It opens a `Configuration: <category>` dialog with the same sections as the root except **mAIstro Configuration**.

### What is the difference between Category ID and Category Proposal ID?

The **Edit Category** dialog shows **Category ID** on a category that uses the root's settings (badged **Default Configuration**) and **Category Proposal ID** on a category with its own configuration (badged **Custom Configuration**). Both are read-only and have a **Copy to clipboard** button.

### What does the Answers node open?

Clicking an **Answers** node changes nothing on screen. The node only displays a count, which differs from branch to branch.

### Can a category's configuration be proposed instead of saved?

Not from its own dialog. A category's `Configuration: <category>` dialog has **Delete Configuration** and **Save** in its footer; **Propose Changes** is only on the root's **Configuration: Default Config** dialog. See [Using the Neural Config page](/configuration/neural-config/using-this-page/).
