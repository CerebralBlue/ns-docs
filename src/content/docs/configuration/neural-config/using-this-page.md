---
title: "Using the Neural Config page"
description: "How a change on the Neural Config screen is committed — nothing in a dialog applies until you press Save, or Propose Changes on the configuration accordion — plus the Add Intent and Default Action node dialogs and the Delete Configuration, Upgrade to Multi-Agent and Revert to Single Agent confirmations."
---

## What is it

The **Neural Config** screen is a routing tree of nodes, and almost every node opens a dialog. This page covers the parts of that screen that belong to no single settings section: the footer buttons that commit a dialog (**Save** and **Propose Changes**), the **Change Logs** button where a saved change is listed afterwards, the two node dialogs that create or route rather than configure (**Add Intent** and **Default Action**), and the confirmation dialogs the screen keeps for its destructive actions (**Delete Configuration**, **Delete Category**, **Upgrade to Multi-Agent**, **Revert to Single Agent**).

It does not describe the tree itself — the root, the categories and the Edit Category dialog are on [Configuration overview](/configuration/overview/) — and it does not describe any section of the configuration accordion, which has one page per section under [Neural Config options](/configuration/neural-config/).

## Why it matters

Every dialog on this screen is staged: you can move a slider, pick a KnowledgeBase type or type an intent answer and nothing changes on the instance until a footer button is pressed. Readers who miss that lose changes by closing a dialog with the × control. The configuration accordion also has two footer buttons where every other dialog has one, and the screen offers no help text on either, so the choice between **Save** and **Propose Changes** is the first question anyone editing a shared instance asks.

The confirmations are the other half. Deleting a category or a category's custom configuration and switching an instance between single-agent and multi-agent routing are one-way actions; knowing which ones stop to ask, and what the confirming button is called, is what lets you click without guessing.

If you only want to change a setting — a threshold, a model, a prompt — go to the page for that section under [Neural Config options](/configuration/neural-config/). If you want to back up an instance, restore it or roll back to an earlier version, that is [Backup, restore & change logs](/configuration/backup-restore/).

## When to use it

- You changed a value in the configuration accordion and want to know whether to press **Save** or **Propose Changes**.
- You want a question answered with a fixed text, or handed to a mAIstro agent, without touching the KnowledgeBase — that is an intent, added with **Add Intent**.
- A category is **mAIstro-led** and you need to choose the agent that receives its questions — the **Default Action** node.
- You are about to delete a category or its custom configuration, or to switch routing modes, and want to know what the confirmation looks like before you commit.
- You want to find the change you just saved — the **Change Logs** button.

## How it works

![The Neural Config routing tree on a multi-agent instance: the Default Config root at the top-left with its Answers, Add Intent, Category Routing and Guardrails nodes, one branch per category, a Default Action node under the mAIstro-led category, and the Backup & Restore and Change Logs toolbar floating bottom-right](/img/neural-config/default.png)

Every node on the tree with a pointer cursor opens a dialog; every dialog closes with the **Close** (×) control at its top right, and the ones that change something carry a footer button. The configuration accordion is reached in two steps: the **Default Config** node opens the **Default Configuration** dialog, and its **Edit Configuration** button opens the accordion titled **Configuration: Default Config**. That path is described on [Configuration overview](/configuration/overview/); the footer of the accordion is described here.

The capture this page was written from opened every section of the accordion and every dialog the tree's nodes lead to. No control named **Toggle Advanced** exists on the screen — no section of the accordion is hidden behind an advanced switch on this build.

### Save and Propose Changes

![The Default Configuration dialog: the Action to take on match selector, and the Edit Configuration and Save footer buttons](/img/neural-config/default-config-answer-generation-panel.png)

**Save** is the blue button at the bottom right of every dialog on this screen that changes something: the **Default Configuration** dialog, the **Configuration: Default Config** accordion, **Add Intent**, **Default Action** and **Guardrails**. Until it is pressed, the dialog's values are only on the screen. Closing the dialog with × discards them. The screen gives no help text for the button; it was not pressed while this page was written, because the instance is shared.

![The whole Configuration: Default Config accordion dialog — the section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, with the rest below the scroll, and a footer with Propose Changes on the left and Save on the right](/img/neural-config/edit-configuration-edit.png)

**Propose Changes** exists on one dialog only: the configuration accordion, where it sits on the left of the footer, dark, next to the blue **Save** (the image above is the whole dialog; the footer is its last row). The **Default Configuration**, **Add Intent**, **Default Action** and **Guardrails** dialogs have **Save** alone. The screen gives no help text on either button.

<!-- UNCONFIRMED: Propose Changes records a proposal that appears in the Change Log and is activated later (the Proposal Activated dialog), rather than applying the change at once — old Configuration overview ("you can save a proposal to be utilized"); Propose Changes was never clicked in this capture -->

What separates the two is not visible on this screen. The Change Log's first column is headed **Proposal ID / Configuration Date**, and the screen's markup carries a **Proposal Activated** acknowledgement (a dialog with a single **Ok** button), so a proposal is something that is recorded and activated as a separate step. Which action raises **Proposal Activated** was not observed. The proposal entries, the **Rollback** action and what the table shows for a proposal are on [Backup, restore & change logs](/configuration/backup-restore/); this page does not restate the lifecycle, because no proposal was created while it was written.

Two more dialogs sit in the screen's markup, present in every state and never seen open:

<!-- UNCONFIRMED: Save opens the Version Information dialog to label the saved version — inferred from the Version column of the Change Log, which holds both "Version N" labels and a free-text one; the link between Save and the dialog was not observed -->

- **Version Information** — a dialog with **Cancel** and **Save**. The Change Log's **Version** column holds both numbered labels (`Version 7` to `Version 21` on this instance) and one free-text label (`PII rules for support intake`), which is consistent with a prompt that accepts a version label at save time; whether **Save** opens it, and on which dialogs, was not observed.
  <!-- UNCONFIRMED: Complete is the acknowledgement shown after a Save — assigned by IA 2026-09-19; the dialog exists in the markup of every state with a single Ok button and was never seen opening, so which action raises it is unknown -->
- **Complete** — a dialog with a single **Ok** button. Which action raises it is unknown; it is the only acknowledgement on the screen besides **Proposal Activated**.

### Change Logs

**Change Logs** is the right-hand button of the toolbar that floats at the bottom right of the tree, next to **Backup & Restore** (both are visible at the bottom right of the screen image at the top of How it works; the capture's own crop of the toolbar came out blank, so there is no closer picture). It opens a dialog titled **Change Log**, with a tab strip — **Default Config**, **Billing** and **Technical Support** on the instance captured here, the root plus the two categories whose node reads **Custom Configuration** — and a table with the columns **Proposal ID / Configuration Date**, **User**, **Version** and **Action**. Each row has an expand chevron on the left and an action icon under **Action**; the **Version** column is where a saved version's label shows. This is where a change committed with **Save** or **Propose Changes** lands. The table, what a row expands to and the **Rollback** action are documented on [Backup, restore & change logs](/configuration/backup-restore/), which owns the dialog.

### Add Intent

![The Add Intent dialog: the "Run a mAIstro agent or seek for this intent." toggle set to Seek, the empty Intent Name, Example question and Answer fields, and the Save footer button](/img/neural-config/add-intent-panel.png)

An intent pairs an example question with what should happen when a user's question matches it — on this dialog, either a fixed answer text or a mAIstro agent. The **Add Intent** node sits under the root and under every category; clicking it opens a dialog headed **Add Intent**. The node's place on the tree is on [Configuration overview](/configuration/overview/); the dialog is:

![The toggle row at the top of the Add Intent dialog: "Run a mAIstro agent or seek for this intent." with the switch off and the word Seek beside it](/img/neural-config/add-intent--run-a-maistro-agent-or-seek-for-this-int.png)

- **Run a mAIstro agent or seek for this intent.** — a toggle drawn as a switch, with the word **Seek** beside it. In the capture the switch is off, the label reads Seek, and the three fields below are the Seek-side ones. What the dialog shows with the switch on — the agent side — was not captured, so the fields for a mAIstro-answered intent are not described here. The word Seek on this row is the intent's answer mode, not the **Seek** function checkbox of [LLM Details](/configuration/neural-config/llm-details/).
- **Intent Name** — a single-line text box, empty on a new intent.
- **Example question** — a single-line text box, empty on a new intent: the question the intent should match.
- **Answer** — a multi-line text box, empty on a new intent: the answer text for the intent.
- **Save** (save icon), bottom right — creates the intent. **Close** (×) at the top right abandons it.

Creating an intent is a configuration change, so none was created for this page; how an intent is matched — the tolerance, and the vector rebuild — is on [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).

### Default Action

![The Default Action: API & Integrations dialog: the Select a mAIstro flow selector showing ex_Chat_with_a_document, a read-only preview of the agent's nodes from Seek Input to Seek Output, and the Save footer button](/img/neural-config/default-action-panel.png)

**Action to take on match** has two values on this screen, **Answer Generation** and **mAIstro-led**. A mAIstro-led category hands the questions routed to it to one mAIstro agent instead of generating an answer. That agent is chosen on the **Default Action** node, which on this instance exists only under the mAIstro-led category (**API & Integrations**) — the root has no such node. Clicking it opens a dialog headed **Default Action: API & Integrations**, the category's name after the colon.

![The Select a mAIstro flow selector on the Default Action dialog, showing ex_Chat_with_a_document with its clear and open buttons](/img/neural-config/default-action--select-a-maistro-flow.png)

- **Select a mAIstro flow** — a selector with a clear (×) button and an open (⌄) button. The selected value on this instance is `ex_Chat_with_a_document`, followed by the agent's description (`An example of how to implement chat with a document for use with the NeuralSeek Chat SDK.`) and its tag (`General Business Users`), run together into one value that the field truncates. The list was not opened, so which agents are offered is not stated here.
- The preview under the selector is read-only and shows the chosen agent's nodes. For `ex_Chat_with_a_document` it shows **Seek Input**, **Condition** (`'<< name: searchFile, prompt: false >>' != ''`), **Save Base64 Document** (`<< name: contextUser, prompt: false >>`), **Write Cache** (`doc`), **Read Cache** (`doc`), **Send To LLM** (a prompt beginning `Answer this question: << name: seekIn.originalQuery, prompt: false >>`) and **Seek Output** — a flow that takes the question in through Seek and returns its answer through Seek. Whether that shape is required of every agent offered here is discussed on [Configuration overview](/configuration/overview/).
- **Save** (save icon), bottom right — commits the choice. **Close** (×) abandons it.

### Delete Configuration and the other confirmations

The screen keeps its confirmation dialogs in the page markup of every state, hidden until an action raises them. None was seen open while this page was written — each is a destructive action on a shared instance — so there is no image of them; what follows is their titles and buttons as the markup holds them.

![Screenshot needed — the Delete Configuration confirmation open over the Neural Config tree](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/delete-configuration.png — on a throw-away category with a Custom Configuration, the dialog that offers Delete Configuration, then the Cancel / Confirm Delete confirmation. Why: the opener was not found on any captured dialog (Edit Category shows Delete Category, not Delete Configuration), so the page cannot say where the action lives. -->

<!-- UNCONFIRMED: Delete Configuration removes a category's custom configuration and all child settings, returning the category to the Default Configuration — the route's gap list; the capture shows only the dialog title and its two buttons, and the button that raises it was not found on any captured dialog -->

- **Delete Configuration** — **Cancel** / **Confirm Delete**. By its name it removes a category's custom configuration, the one shown as **Custom Configuration** on the category's node; the button that raises it was not found on any dialog captured for this page (the Edit Category dialog carries **Delete Category**, and the accordion was opened only for the root).
- **Delete Category** — **Cancel** / **Confirm Delete**. Raised by the red **Delete Category** button on the Edit Category dialog, which is documented on [Configuration overview](/configuration/overview/).
- **Upgrade to Multi-Agent** — **Cancel** / **Confirm Upgrade**, and **Revert to Single Agent** — **Cancel** / **Confirm Revert**. Categories are part of multi-agent routing; these two confirmations show that the mode can be switched in both directions. The instance captured here was already multi-agent, and the control that raises either dialog was not seen — the bottom-right toolbar holds only **Backup & Restore** and **Change Logs**.
- **Rebuild Vector Intents** — **Cancel** / **Confirm Rebuild**. Belongs to [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).

## FAQ

### I changed a slider and closed the dialog — why did nothing happen?

Nothing in a dialog on this screen is applied until you press **Save** — or, on the configuration accordion, **Save** or **Propose Changes**. Closing the dialog with the × control leaves the instance as it was.

### What is the difference between Save and Propose Changes?

Both sit in the footer of the **Configuration: Default Config** accordion, and the screen gives no help text on either. **Save** is the button every dialog has; **Propose Changes** is tied to the proposal entries of the Change Log — its first column is **Proposal ID / Configuration Date**, and the screen carries a **Proposal Activated** acknowledgement. The proposal lifecycle is not shown on this screen; see [Backup, restore & change logs](/configuration/backup-restore/).

### How do I add an intent with a fixed answer?

Click an **Add Intent** node on the tree (under the root or under a category), leave the **Run a mAIstro agent or seek for this intent.** switch on Seek, fill **Intent Name**, **Example question** and **Answer**, and press **Save**.

### Where do I pick the agent for a mAIstro-led category?

On the **Default Action** node under that category. It opens **Default Action: \<category\>**; choose the agent in **Select a mAIstro flow**, check the read-only preview of its nodes, and press **Save**.

### Is there an "are you sure" step before deleting something?

Yes. **Delete Category** and **Delete Configuration** each open a confirmation with **Cancel** and **Confirm Delete**; switching routing mode opens **Upgrade to Multi-Agent** (**Confirm Upgrade**) or **Revert to Single Agent** (**Confirm Revert**).

### Where is the Toggle Advanced switch?

There is none on this build. Every section of the configuration accordion and every dialog was captured in full for this page, and no control named **Toggle Advanced** (or any advanced switch) exists on the screen.
