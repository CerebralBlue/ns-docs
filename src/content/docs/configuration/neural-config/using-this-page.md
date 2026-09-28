---
title: "Using the Neural Config page"
description: "On the Neural Config screen nothing in a dialog applies until you press Save — which on the configuration accordion asks you to name the new version — and this page also covers Propose Changes, the Add Intent and Default Action dialogs, and the Delete Configuration, Delete Category and routing-mode confirmations."
---

## What is it

The **Neural Config** screen is a routing tree of nodes, and almost every node opens a dialog. This page covers the parts of that screen that belong to no single settings section:

- the footer buttons that commit a dialog — **Save** everywhere, plus **Propose Changes** on the root configuration — and the version prompt that **Save** opens;
- the two node dialogs that create or route rather than configure: **Add Intent** and **Default Action**;
- the confirmation dialogs the screen keeps for its destructive actions: **Delete Configuration**, **Delete Category**, **Upgrade to Multi-Agent** and **Revert to Single Agent**.

It does not describe the tree itself — the root, the categories and the Edit Category dialog are on [Configuration overview](/configuration/overview/) — and it does not describe any section of the configuration accordion, which has one page per section under [Neural Config options](/configuration/neural-config/).

## Why it matters

Every dialog on this screen is staged. You can move a slider, pick a KnowledgeBase type or type an intent answer, and nothing changes until a footer button is pressed. If you reload the page instead, your picks are gone and the configuration is exactly as it was. If you press Escape inside the configuration dialog, the whole dialog closes. Knowing where the commit point is saves you from losing an afternoon of tuning — or from saving something you only meant to try.

A save on the configuration accordion also creates a named version. That name is what you see later in the Change Log and what you pick when you roll back, so a clear name is worth the few seconds it takes.

The confirmations are the other half. Deleting a category or a category's custom configuration, and switching between single-agent and multi-agent routing, change how every question is routed. Knowing which actions stop to ask, and what the confirming button is called, lets you click without guessing.

If you only want to change a setting — a threshold, a model, a prompt — go to the page for that section under [Neural Config options](/configuration/neural-config/). To back up an instance, restore it or roll back to an earlier version, see [Backup, restore & change logs](/configuration/backup-restore/).

## When to use it

- You changed a value in the configuration accordion and want to know whether to press **Save** or **Propose Changes**, and what to type in the version prompt.
- You want a question answered with a fixed text, or handed to a mAIstro agent, without touching the KnowledgeBase. That is an intent, added with **Add Intent**.
- A category is **mAIstro-led** and you need to choose the agent that receives its questions. That is the **Default Action** node.
- You want to remove a category's own settings so it falls back on the root configuration, delete a category, or switch routing modes, and want to know what the confirmation looks like first.

## How it works

![The Neural Config routing tree: the Default Config root at the top left with its Answers, Add Intent, Category Routing and Guardrails nodes, one branch per category, a Default Action node under the mAIstro-led API & Integrations category, and the Backup & Restore and Change Logs toolbar at the bottom right](/img/neural-config/default.png)

Every node with a pointer cursor opens a dialog. Every dialog closes with the **Close** (×) control at its top right, and the ones that change something carry a footer button. The configuration accordion is reached in two steps: the **Default Config** node opens the **Default Configuration** dialog, and its **Edit Configuration** button opens the accordion titled **Configuration: Default Config**. That path is described on [Configuration overview](/configuration/overview/); this page describes what happens at the footer.

There is no "Toggle Advanced" switch on this screen: every section of the accordion shows all of its controls without an advanced mode. The one control with "advanced" in its name, **Enable Advanced Schema**, is a field that external KnowledgeBase types (not NeuralSeek KB) add to [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Save and Propose Changes

![The Default Configuration dialog: the Action to take on match selector set to Answer Generation, and a footer with Edit Configuration on the left and Save on the right](/img/neural-config/default-config-answer-generation-panel.png)

**Save** is the blue button at the bottom right of every dialog on this screen that changes something: the **Default Configuration** dialog above, the configuration accordion, **Add Intent**, **Default Action** and **Guardrails**. Until you press it, the dialog's values exist only on your screen:

- **Reloading the page discards them.** A KnowledgeBase type picked and not saved is back to its previous value after a reload, and no row is added to the Change Log.
- **Escape closes the whole configuration dialog**, not only an open dropdown. To close a dropdown and stay in the dialog, click its current value a second time.
- **Close** (×) leaves the dialog without committing anything.

![The Configuration: Default Config accordion dialog: the section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, with the rest below the scroll, and a footer with Propose Changes on the left and Save on the right](/img/neural-config/edit-configuration-edit-panel.png)

On the configuration accordion, **Save** is a two-step commit. Pressing it opens a second dialog, **Save a new version** (internally named **Version Information**). It asks you to "Add a Version title and documentation to help other understand the changes you have made, and why they were required", with two fields:

- "Name this version of the configuration" — pre-filled with a count of the changed settings, such as "Updated 7 settings". Replace it with a name you will recognise in the Change Log.
- "Version Description" — pre-filled with "Updated settings for the following fields:" and the list of fields that differ from the saved configuration. The list uses internal field names and can include fields you did not edit yourself, because the form normalises a few values when it loads.

**Cancel** closes the prompt and nothing is saved. **Save** writes the version and applies it: the next Seek uses the new configuration.

![Screenshot needed — the Save a new version dialog open over the Configuration: Default Config accordion](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/save-a-new-version-panel.png — Neural Config > Default Config node > Edit Configuration > change one setting > Save: the "Save a new version" dialog with its name and description fields and Cancel / Save. Why: the second step of a save is invisible until you press Save, and readers need to recognise it. -->

**Propose Changes** sits on the left of the same footer, dark, next to the blue **Save**. It exists only on the root configuration: the **Default Configuration**, **Add Intent**, **Default Action** and **Guardrails** dialogs have **Save** alone, and a category's own configuration dialog has **Delete Configuration** where the root has **Propose Changes** (see the last section). The screen gives no help text for the button.

<!-- UNCONFIRMED: Propose Changes records a proposal that appears in the Change Log and is activated later, rather than applying the change at once — old Configuration overview ("you can save a proposal to be utilized"); the Proposal Activated acknowledgement is in the page markup, but Propose Changes itself has not been observed in use -->

Use **Propose Changes** when the change should be reviewed before it goes live; the Change Log's first column is headed **Proposal ID / Configuration Date**, and the screen carries a **Proposal Activated** acknowledgement with a single **Ok** button for the step that turns a proposal into the live configuration. The proposal entries and how a proposal is activated are on [Backup, restore & change logs](/configuration/backup-restore/).

After a save, the new version is listed under **Change Logs**, the right-hand button of the toolbar at the bottom right of the tree (visible in the screen image at the top of How it works). It opens the **Change Log** dialog: a tab for **Default Config** and tabs for categories, and a table whose **Version** column shows the name you typed. Its **Action** column is where you roll a configuration back. A rollback applies at once and ends with a **Complete** dialog — "Your transaction has been processed. Click Ok to refresh the page." — and its **Ok** button reloads the screen. The table and rollback are documented on [Backup, restore & change logs](/configuration/backup-restore/).

### Add Intent

![The Add Intent dialog: the "Run a mAIstro agent or seek for this intent." toggle set to Seek, the empty Intent Name, Example question and Answer fields, and the Save footer button](/img/neural-config/add-intent-panel.png)

An intent pairs an example question with what should happen when a user's question matches it: a fixed answer text, or a mAIstro agent. The **Add Intent** node sits under the root and under each category. Clicking the node opens a dialog headed **Add Intent**.

![The toggle row at the top of the Add Intent dialog: "Run a mAIstro agent or seek for this intent." with the switch off and the word Seek beside it](/img/neural-config/add-intent--run-a-maistro-agent-or-seek-for-this-int.png)

**Run a mAIstro agent or seek for this intent.** — a switch, with the word **Seek** beside it. Off (Seek) is how the dialog opens, and the three fields below are the Seek side: the intent answers with text. Switching it on selects the mAIstro-agent side; what that side asks for is not documented here yet. The word Seek on this row is the intent's answer mode, not the **Seek** function checkbox of [LLM Details](/configuration/neural-config/llm-details/).

![The Intent Name field of the Add Intent dialog, empty](/img/neural-config/add-intent--intent-name.png)

**Intent Name** — a single-line text box: the name the intent is listed under.

![The Example question field of the Add Intent dialog, empty](/img/neural-config/add-intent--example-question.png)

**Example question** — a single-line text box: a question phrased the way your users ask it, which incoming questions are matched against.

![The Answer field of the Add Intent dialog, a multi-line text box, empty](/img/neural-config/add-intent--answer.png)

**Answer** — a multi-line text box: the text returned when the intent matches.

**Save** (save icon), bottom right, creates the intent; **Close** (×) at the top right abandons it. How close a question has to be to match an intent — the tolerance — and the vector rebuild are on [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).

### Default Action

![The Default Action: API & Integrations dialog: the Select a mAIstro flow selector showing ex_Chat_with_a_document, a read-only preview of the agent's nodes from Seek Input to Seek Output, and the Save footer button](/img/neural-config/default-action-panel.png)

A category's **Action to take on match** has two values, **Answer Generation** and **mAIstro-led**. A mAIstro-led category hands the questions routed to it to one mAIstro agent instead of generating an answer from the KnowledgeBase. That agent is chosen on the **Default Action** node under the category. In the example tree at the top of How it works, the only **Default Action** node sits under **API & Integrations**, the one mAIstro-led category; the root and the Answer Generation categories have none. Clicking it opens a dialog headed with the category's name — **Default Action: API & Integrations**.

![The Select a mAIstro flow selector on the Default Action dialog, showing ex_Chat_with_a_document with its clear and open buttons](/img/neural-config/default-action--select-a-maistro-flow.png)

- **Select a mAIstro flow** — a selector with a clear (×) button and an open (⌄) button. It shows the agent's name followed by its description and tag, run together and truncated by the field: in the example, `ex_Chat_with_a_document`, "An example of how to implement chat with a document for use with the NeuralSeek Chat SDK.", tagged General Business Users.
- Under the selector, a read-only preview draws the chosen agent's nodes, so you can check it is the flow you meant before saving. For `ex_Chat_with_a_document` it shows **Seek Input**, **Condition**, **Save Base64 Document**, **Write Cache**, **Read Cache**, **Send To LLM** and **Seek Output** — the question comes in through **Seek Input** and the answer goes back through **Seek Output**. How agents are built is on [mAIstro overview](/maistro/overview/).
- **Save** (save icon), bottom right, commits the choice. **Close** (×) abandons it.

### Delete Configuration and the other confirmations

![The Configuration: Refunds dialog of a category with its own configuration: the section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with a red Delete Configuration button on the left and Save on the right](/img/neural-config/refunds-custom-configuration-dialog-panel.png)

A category either uses the root's settings — its node reads **Default Configuration** — or has its own, and its node reads **Custom Configuration**. The category's **Edit Category** dialog offers **Add Custom Configuration** in the first case and **Edit Custom Configuration** in the second. **Edit Custom Configuration** opens the same accordion as the root, titled with the category's name (**Configuration: Refunds** above), with two differences: there is no **mAIstro Configuration** section, and the footer's left button is a red **Delete Configuration** where the root has **Propose Changes**.

<!-- UNCONFIRMED: Delete Configuration removes the category's custom configuration and all its settings, so the category goes back to the root's Default Configuration — the route's gap list; the screen shows the button and its confirmation, and the action has not been observed in use -->

**Delete Configuration** removes the category's own settings, so the category goes back to answering with the root configuration. Every destructive action on this screen stops at a confirmation dialog with **Cancel** on the left:

| Confirmation dialog      | Confirming button   | Raised by                                                                                                                       |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Delete Configuration** | **Confirm Delete**  | The red **Delete Configuration** button in a category's configuration dialog (above).                                           |
| **Delete Category**      | **Confirm Delete**  | The red **Delete Category** button in the Edit Category dialog — see [Configuration overview](/configuration/overview/).        |
| **Upgrade to Multi-Agent** | **Confirm Upgrade** | Switching an instance from single-agent to multi-agent routing (categories).                                                  |
| **Revert to Single Agent** | **Confirm Revert**  | Switching back from multi-agent to single-agent routing.                                                                      |
| **Rebuild Vector Intents** | **Confirm Rebuild** | Rebuilding the intent vectors — see [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).       |

On an instance that already uses categories, the toolbar at the bottom right holds only **Backup & Restore** and **Change Logs**; the control that raises **Upgrade to Multi-Agent** or **Revert to Single Agent** is not on the tree there.

## FAQ

### I changed a setting and reloaded the page — where did my change go?

It was never applied. Nothing in a dialog on the Neural Config screen takes effect until you press **Save** (and, on the configuration accordion, confirm the "Save a new version" prompt). Reloading, pressing Escape in the configuration dialog or closing it with × leaves the configuration as it was.

### What is the difference between Save and Propose Changes?

**Save** applies the change as soon as you confirm the version prompt; the next Seek uses it. **Propose Changes**, on the root configuration only, records the change as a proposal that is activated as a separate step. The proposal entries and their activation are on [Backup, restore & change logs](/configuration/backup-restore/).

### Can I give a saved configuration a name?

Yes. On the configuration accordion, **Save** opens the "Save a new version" prompt, where you replace the pre-filled "Updated N settings" with your own name and can edit the description. That name is what the **Version** column of the Change Log shows, and what you look for when you roll back.

### How do I add an intent with a fixed answer?

Click an **Add Intent** node on the tree (under the root or under a category), leave the **Run a mAIstro agent or seek for this intent.** switch on Seek, fill **Intent Name**, **Example question** and **Answer**, and press **Save**.

### Where do I pick the agent for a mAIstro-led category?

On the **Default Action** node under that category. It opens **Default Action: \<category\>**; choose the agent in **Select a mAIstro flow**, check the read-only preview of its nodes, and press **Save**.

### Where is the Toggle Advanced switch?

There is none. Every section of the configuration accordion shows all of its controls without an advanced switch. **Enable Advanced Schema**, on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), is a KnowledgeBase field, not a display mode.
