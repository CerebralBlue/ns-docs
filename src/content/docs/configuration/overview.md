---
title: "Configuration overview"
description: "The Neural Config screen is a routing tree: a Default Config root that holds the instance-wide settings, categories that send matching questions to Answer Generation or to a mAIstro agent and can carry a configuration of their own, and Guardrails nodes — this page explains the tree and links each part to its own page."
---

**Neural Config** is the console screen where you configure a NeuralSeek instance. It is drawn as a routing tree: a **Default Config** root holds the instance-wide settings — KnowledgeBase, LLM, embedding models, prompts and the rest — and the categories under it catch a kind of question and send it either to answer generation, as [Seek](/seek/overview/) does, or to a [mAIstro](/maistro/overview/) agent. Each level that has settings of its own also has its own [Guardrails](/governance/guardrails/overview/). Read this page to know where a setting lives before you go looking for it; each part of the tree links to the page that documents it.

## How the Neural Config tree works

### The routing tree

Open **Neural Config** from the top navigation. The screen is a diagram read left to right: each box is a node, and clicking a node opens its dialog. The tree is usually wider than the window, so scroll horizontally to reach the right-hand branches.

![The Neural Config routing tree: Default Config at the top-left with Answers, Add Intent, Category Routing and Guardrails under it; example categories Account Access, Technical Support and Billing branch off Category Routing, API & Integrations (mAIstro-led) hangs off Technical Support, and Backup & Restore and Change Logs sit at the bottom-right](/img/neural-config/default.png)

The category names in the pictures on this page (Account Access, Technical Support, Billing, API & Integrations, Refunds) are examples.

- **Default Config** — the root node. Its second line shows the root's action, **Answer Generation**. It opens the Default Configuration dialog, your way into the instance-wide settings ([below](#the-root-node-default-config)).
- **Answers** — shown with a count in brackets, for example `Answers (3)`. The count differs from branch to branch.
- **Add Intent** — under the root and under every category. It adds an intent at that level ([below](#intents-and-the-default-action)).
- **Category Routing** — the branch point under which that level's categories hang, followed by **Add a Category**. Every category has its own **Category Routing**, so categories nest: in the example, API & Integrations sits under Technical Support.
- Each category node has three lines: its name, its action (**Answer Generation** or **mAIstro-led**), and a badge — **Default Configuration** when the category runs on the root's settings, **Custom Configuration** when it carries settings of its own.
- **Guardrails** — under the root and under each category badged **Custom Configuration** ([below](#guardrails-at-each-level)).
- **Default Action** — under a **mAIstro-led** category; it picks the agent that handles the category's questions.
- **Backup & Restore** and **Change Logs** — two buttons at the bottom-right of the screen ([below](#backups-and-the-change-history)).

<!-- UNCONFIRMED: a question is matched to a category by its description and then follows that category's branch; a question no category catches stays on the root — previous documentation ("Categories are used to drive the path of the multi-agent flow") -->

A question that matches a category's description takes that category's branch — its settings, its guardrails or its agent. A question no category catches is handled by the root.

### The root node: Default Config

Click **Default Config** to open the **Default Configuration** dialog.

![The Default Configuration dialog: the Action to take on match selector reading Answer Generation, and a footer with Edit Configuration (gear icon) on the left and Save on the right](/img/neural-config/default-config-answer-generation-panel.png)

- **Action to take on match** — what the root does with a question. The same two options appear on the root and on every category, and the chosen one is shown on the node's second line:

  | Option                | What it does                                                                                                                                      |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Answer Generation** | NeuralSeek generates the answer from the KnowledgeBase, as Seek does.                                                                             |
  | **mAIstro-led**       | The question is handed to a mAIstro agent. A mAIstro-led branch carries a **Default Action** node, where you choose the agent. |

  ![The Action to take on match list, open: Answer Generation (ticked) and mAIstro-led](/img/neural-config/default-config-answer-generation--options-action-to-take-on-match.png)

- **Edit Configuration** (gear icon) — opens **Configuration: Default Config**, the instance-wide settings: an accordion of fourteen sections, from KnowledgeBase Connection to Secrets, with **Propose Changes** and **Save** in its footer. [Neural Config options](/configuration/neural-config/) lists every section and links to its page.
- **Save** — saves the action. How saving differs from **Propose Changes** is explained on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Adding a category

A category is a kind of question you want handled differently from the rest — billing questions answered under stricter settings, or API questions sent to an agent. **Add a Category** sits at the end of every **Category Routing** branch, so a new category can go under the root or under an existing category. Click it to open the **Add a Category** dialog.

![The Add a Category dialog: the Action to take on match selector, empty Category Name and Category Description fields showing their placeholders, a greyed-out Add Custom Configuration button and Save Category](/img/neural-config/add-a-category-panel.png)

1. In **Action to take on match**, choose **Answer Generation** to have the category's questions answered from the KnowledgeBase, or **mAIstro-led** to hand them to an agent.
2. In **Category Name**, enter the name the node will show (the placeholder suggests `Payroll`).
3. In **Category Description (2-3 sentences)**, describe in two or three sentences which questions belong to the category — the placeholder reads `Payroll inquiries, Tax withholding questions, benefits contributions`. The wand icon beside the label, **Auto-generate description**, offers to write the description for you.
4. Select **Save Category**.

**Add Custom Configuration** stays greyed out while you add a category; it becomes available on the category's Edit Category dialog once the category is saved.

<!-- UNCONFIRMED: a new category uses the Default Configuration settings and Guardrails until it gets its own — previous documentation ("Newly defined categories will automatically utilize the Default Configuration settings and Guardrails") -->

The new category appears under the **Category Routing** node you started from, badged **Default Configuration**: it runs on the root's settings and guardrails until you give it its own.

### Editing a category

Click a category node to open its Edit Category dialog, titled with the category's name — for example `Edit Category: Refunds`. It holds the same fields as **Add a Category**, filled in, plus the controls that only exist once the category is saved.

![The Edit Category dialog of a Custom Configuration category (Refunds in the example): Action to take on match, a red Delete Category button, Category Name, Category Description with the Auto-generate description wand, a Category Proposal ID row with a copy button, and a footer with Edit Custom Configuration and Save Category](/img/neural-config/refunds-answer-generation-custom-configu-panel.png)

- **Delete Category** (red, trash icon) — removes the category, after a confirmation step.
- **Category Proposal ID** or **Category ID** — a read-only identifier with a **Copy to clipboard** button beside it (it confirms with "Copied!"). Copy it when you need to reference the category. A category badged **Custom Configuration** shows **Category Proposal ID**; a category badged **Default Configuration** shows **Category ID**.
- **Edit Custom Configuration** or **Add Custom Configuration** (gear icon) — **Edit Custom Configuration** on a category that already has its own settings, **Add Custom Configuration** on a category that runs on the root's ([next section](#a-categorys-own-configuration)).
- **Save Category** — saves the name, description and action.

A **mAIstro-led** category has the same dialog with **mAIstro-led** selected. You choose its agent on the branch's **Default Action** node, not here.

![The Edit Category dialog of a mAIstro-led category on the Default Configuration (API & Integrations in the example): Action to take on match reads mAIstro-led, the ID row is labelled Category ID and the footer button reads Add Custom Configuration](/img/neural-config/api-integrations-maistro-led-default-con-panel.png)

### A category's own configuration

Give a category its own configuration when its questions need a different LLM, KnowledgeBase, prompt or threshold from the rest of the instance. On a category badged **Custom Configuration**, **Edit Custom Configuration** opens a dialog headed with the category's name — for example `Configuration: Refunds`. It holds thirteen sections: the same as the root's **Configuration: Default Config** except **mAIstro Configuration**, which is set on the root only. Each section works as described on its own page ([Neural Config options](/configuration/neural-config/)); the difference is scope — a change here applies to the category, not to the whole instance.

![The Configuration: Refunds dialog: an accordion from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with a red Delete Configuration button on the left and Save on the right](/img/neural-config/edit-custom-configuration-edit-panel.png)

The footer has **Delete Configuration** (red, trash icon) and **Save**; **Propose Changes** is on the root's configuration dialog. **Delete Configuration** removes the category's own settings — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

<!-- UNCONFIRMED: Add Custom Configuration opens the same configuration dialog for the category, and saving it switches the badge to Custom Configuration and adds a Guardrails node — previous documentation ("The familiar NeuralSeek Configuration panel will pop up… Upon adding a custom configuration, a new node will appear labeled Guardrails"); consistent with Edit Custom Configuration -->

On a category badged **Default Configuration**, **Add Custom Configuration** opens the same `Configuration: <category>` dialog. Once you save it, the node's badge reads **Custom Configuration** and a **Guardrails** node appears under the category.

<!-- UNCONFIRMED: a category's configuration also applies to the categories nested beneath it — previous documentation ("a custom configuration that will be used by it and nested levels beneath it") -->

A category's configuration is also used by the categories nested beneath it, unless they carry one of their own.

### Guardrails at each level

A **Guardrails** node sits under the root and under every category with a custom configuration, so a category with its own settings can also have its own checks on the answer. Clicking it opens a dialog headed with the level's name — **Guardrails: Default Config** on the root — with the tabs **Semantic Scoring**, **Prompt Injection**, **PII**, **Profanity (HAP)**, **Attribution Protection**, **Warning Confidence**, **Min Confidence**, **Min Text**, **Max Length** and **Custom Governance**. Each tab is documented from the [Guardrails overview](/governance/guardrails/overview/).

![The Guardrails: Default Config dialog on its Semantic Scoring tab: the tab strip along the top, six Enable/Disable switches, the Semantic Model Tuning button and a Save footer](/img/neural-config/guardrails-panel.png)

### Intents and the Default Action

**Add Intent** sits at every level of the tree, so an intent belongs to the level where you add it. It opens the **Add Intent** dialog, where you name the intent, give an example question and either write the answer or run a mAIstro agent instead. What intents are and how they are matched is on [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/); the dialog itself is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Add Intent dialog: the Run a mAIstro agent or seek for this intent switch set to Seek, and the Intent Name, Example question and Answer fields above a Save button](/img/neural-config/add-intent-panel.png)

**Default Action** appears only under a **mAIstro-led** category. It opens a dialog headed `Default Action: <category>`, where **Select a mAIstro flow** picks the agent that handles the category's questions and shows a preview of the agent's flow. The dialog is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Default Action dialog of a mAIstro-led category (API & Integrations in the example): the Select a mAIstro flow selector with an example agent chosen, a preview of that agent's flow from Seek Input to Seek Output, and Save](/img/neural-config/default-action-panel.png)

### Backups and the change history

Two buttons at the bottom-right of the tree (visible in the first picture on this page) protect the whole configuration:

- **Backup & Restore** — back up the configuration before a change and restore it afterwards.
- **Change Logs** — the history of saved configuration versions.

Both are documented on [Backup, restore & change logs](/configuration/backup-restore/).

## When to use it

- **Setting up an instance.** Open **Default Config** → **Edit Configuration** to reach the KnowledgeBase, LLM and platform settings that every answer starts from.
- **One topic needs different handling.** Add a category when questions about billing, account access or an API should be answered under different settings, or by an agent, while everything else keeps the root's behaviour.
- **A topic needs its own model, KnowledgeBase or thresholds.** Give that category a custom configuration and, with it, its own **Guardrails**.
- **A topic is better served by a workflow than a generated answer.** Make the category **mAIstro-led** and choose the agent on its **Default Action** node.
- **Before a large change.** Take a backup with **Backup & Restore**, and use **Change Logs** to see what changed.

Neural Config is the wrong place when an answer is wrong because the content is: a missing, stale or badly indexed document is a KnowledgeBase task ([Connect a knowledge base](/knowledge/connect-a-kb/)), and no setting on this screen adds knowledge the KnowledgeBase does not hold.

## FAQ

### What is the Default Config node?

The root of the Neural Config tree, at the top-left. Its **Default Configuration** dialog sets the **Action to take on match** for questions no category catches and, through **Edit Configuration**, opens the instance-wide settings listed on [Neural Config options](/configuration/neural-config/).

### How do I send one kind of question to an agent instead of a generated answer?

Select **Add a Category** under a **Category Routing** node, set **Action to take on match** to **mAIstro-led**, describe the questions the category should catch, and select **Save Category**. Then click the branch's **Default Action** node and choose the agent in **Select a mAIstro flow**.

### How do I give a category its own settings?

Click the category node. On a category badged **Default Configuration**, select **Add Custom Configuration**; on one badged **Custom Configuration**, select **Edit Custom Configuration**. Either opens a `Configuration: <category>` dialog with the root's sections except **mAIstro Configuration**.

### Can categories be nested?

Yes. Every category has its own **Category Routing** node with an **Add a Category** at the end, so you can add a category under an existing one — in the example on this page, API & Integrations sits under Technical Support.

## Related

- [Neural Config options](/configuration/neural-config/) — every section of the configuration dialog
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — Save versus Propose Changes, Add Intent, Default Action, Delete Configuration
- [Guardrails overview](/governance/guardrails/overview/)
- [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/)
- [Backup, restore & change logs](/configuration/backup-restore/)
- [mAIstro overview](/maistro/overview/)
- [Seek overview](/seek/overview/)
