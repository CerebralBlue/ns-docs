---
title: "Using the Neural Config page"
description: "On the Neural Config screen a change applies only when you select Save in the dialog footer; this page shows how to save or propose configuration changes, add an intent, choose the agent of a mAIstro-led category, and delete a category's own configuration."
---

The **Neural Config** screen is a routing tree: the **Default Config** root, one branch per category, and nodes under each that open a dialog. This page covers the working rules that every one of those dialogs shares — above all, that nothing you change in a dialog applies until you select **Save** in its footer — and the four jobs admins do most often on the tree: saving a configuration change, adding an intent, choosing the agent a mAIstro-led category runs, and removing a category's own configuration. What each node of the tree is, and how categories are created and routed, is on [Configuration overview](/configuration/overview/); what each configuration section does is under [Neural Config options](/configuration/neural-config/).

## Change a setting and save it

The root configuration holds the settings every question uses unless its category has its own. Edit it when you change the KnowledgeBase, the LLM, a prompt or any other setting for the whole instance.

1. Go to **Neural Config** and select the **Default Config** node at the root of the tree. The **Default Configuration** dialog opens.
2. Select **Edit Configuration**. The **Configuration: Default Config** dialog opens, with one section per group of settings.
3. Expand a section and change the settings you need. Each section is documented on its own page under [Neural Config options](/configuration/neural-config/).
4. Select **Save** in the dialog footer.
   <!-- UNCONFIRMED: Save opens a "Save a new version" dialog with "Name this version of the configuration" (pre-filled "Updated N settings") and "Version Description" (pre-filled with the changed fields), then Cancel / Save — seen in an earlier capture of this screen (2026-09-27), not in the 2026-10-01 capture -->
5. In **Save a new version**, replace the pre-filled name in **Name this version of the configuration** with one you will recognise later, and review **Version Description**, which lists the fields that differ from the saved configuration.
6. Select **Save**. To back out instead, select **Cancel**; nothing is saved.

![The Configuration: Default Config dialog: the section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with Propose Changes on the left and Save on the right](/img/neural-config/edit-configuration-edit-panel.png)

Until you select **Save**, your changes exist only in the open dialog. If you close it with **Close** (×) or reload the page, the configuration stays as it was and no new version is recorded. Take the time to name each version: that name is what you look for in **Change Logs** when you need to find or undo a change.

### Save or Propose Changes

The footer of **Configuration: Default Config** has two buttons: **Propose Changes** (dark, left) and **Save** (blue, right). Use **Save** when the change should go live now.

<!-- UNCONFIRMED: Propose Changes records the change as a proposal instead of applying it — background from the old Configuration overview ("you can save a proposal to be utilized"); Propose Changes was not observed in use -->

**Propose Changes** records your edits as a proposal and leaves the live configuration as it is, so use it when someone else should review the change before it applies. How proposals are listed and activated is on [Backup, restore & change logs](/configuration/backup-restore/).

## Add an intent

An intent pairs an example question with what should happen when a user's question matches it. Add one when a recurring question needs a fixed, approved answer, or should be handled in a set way, rather than generated from the KnowledgeBase each time. How closely a question must match an intent is set on [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).

1. On the tree, select an **Add Intent** node. There is one under the root and one under each category; pick the one at the level where the intent should apply. The **Add Intent** dialog opens.

   ![The Add Intent dialog: the "Run a mAIstro agent or seek for this intent." switch set to Seek, the empty Intent Name, Example question and Answer fields, and the Save button](/img/neural-config/add-intent-panel.png)

2. Set **Run a mAIstro agent or seek for this intent.** The switch chooses how the intent is handled: a mAIstro agent, or **Seek**. The dialog opens with the switch on **Seek**, which shows the **Answer** field used in step 5.

   ![The switch row of the Add Intent dialog: "Run a mAIstro agent or seek for this intent." with the switch off and Seek beside it](/img/neural-config/add-intent--run-a-maistro-agent-or-seek-for-this-int.png)

3. In **Intent Name**, type the name the intent is listed under.

   ![The Intent Name field of the Add Intent dialog](/img/neural-config/add-intent--intent-name.png)

4. In **Example question**, type a question phrased the way your users ask it.

   ![The Example question field of the Add Intent dialog](/img/neural-config/add-intent--example-question.png)

5. In **Answer**, type the answer to return for this intent.

   ![The multi-line Answer field of the Add Intent dialog](/img/neural-config/add-intent--answer.png)

6. Select **Save**.

## Choose the agent a mAIstro-led category runs

A category's **Action to take on match** is either **Answer Generation** or **mAIstro-led**. A mAIstro-led category hands the questions routed to it to one [mAIstro](/maistro/overview/) agent, and that category gets a **Default Action** node on the tree. Use it to pick the agent, or to switch the category to a different one.

1. Make sure the category is mAIstro-led: in its **Edit Category** dialog, **Action to take on match** reads **mAIstro-led** (see [Configuration overview](/configuration/overview/)).
2. Select the **Default Action** node under the category. The **Default Action: \<category\>** dialog opens.

   ![The Default Action dialog of a mAIstro-led category: the Select a mAIstro flow selector, a read-only preview of the chosen agent's nodes from Seek Input to Seek Output, and the Save button](/img/neural-config/default-action-panel.png)

3. In **Select a mAIstro flow**, choose the agent. The list shows each agent as its name followed by its description; type in the field to narrow it, or select × to clear the choice.

   ![The Select a mAIstro flow selector on the Default Action dialog, with its clear and open buttons](/img/neural-config/default-action--select-a-maistro-flow.png)

4. Check the preview under the selector. It draws the chosen agent's nodes from top to bottom, so you can confirm it is the flow you meant — for example, that it starts at a **Seek Input** node and ends at a **Seek Output** node.
5. Select **Save**.

## Remove a category's configuration or the category

A category either uses the root's settings — its node reads **Default Configuration** — or has its own, and then its node reads **Custom Configuration**. Remove a category's own configuration when it no longer needs settings that differ from the root; delete the category when its questions should no longer be routed separately.

To remove a category's own configuration:

1. Select the category's node on the tree. The **Edit Category: \<category\>** dialog opens.
2. Select **Edit Custom Configuration**. The **Configuration: \<category\>** dialog opens: the same sections as the root, with **Delete Configuration** and **Save** in the footer.

   ![A category's Configuration dialog: the section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with Delete Configuration on the left and Save on the right](/img/neural-config/edit-custom-configuration-edit-panel.png)

3. Select **Delete Configuration**, then confirm with **Confirm Delete**. Select **Cancel** to keep the configuration.

<!-- UNCONFIRMED: after Delete Configuration the category falls back to the root's settings and its node reads Default Configuration — inferred from the two node badges (Default Configuration / Custom Configuration); the action was not observed -->

The category then answers with the root configuration again.

To delete the category itself, open its **Edit Category: \<category\>** dialog, select **Delete Category**, and confirm with **Confirm Delete**. Categories and how questions are routed to them are described on [Configuration overview](/configuration/overview/).

![The Edit Category dialog: Action to take on match set to Answer Generation, the Delete Category button, the category name, description and proposal ID, and Edit Custom Configuration and Save Category in the footer](/img/neural-config/refunds-answer-generation-custom-configu-panel.png)

## Verify

Every saved configuration change is listed in **Change Logs**, the button in the toolbar at the bottom right of the tree.

![The Neural Config tree, with the Backup & Restore and Change Logs buttons in the toolbar at the bottom right](/img/neural-config/default.png)

It opens the **Change Log** dialog, with a **Default Config** tab for the root and tabs for categories. After a save, check that the newest row's **Version** column shows the name you typed. Reading the log and rolling back to an earlier version are covered on [Backup, restore & change logs](/configuration/backup-restore/).

## FAQ

### I changed a setting but nothing happened. Why?

A change applies only after you select **Save** in the dialog footer and complete the save. Closing the dialog or reloading the page leaves the configuration as it was. Check **Change Logs**: if no new row carries your version name, the change was not saved.

### What is the difference between Save and Propose Changes?

**Save** applies the change to the live configuration.

<!-- UNCONFIRMED: Propose Changes records a proposal rather than applying the change — old Configuration overview; not observed in use -->

**Propose Changes** records it as a proposal for review instead. See [Backup, restore & change logs](/configuration/backup-restore/) for how proposals are handled.

### Can I propose a change to a category's own configuration?

A category's **Configuration: \<category\>** dialog commits with **Save**; its footer pairs **Save** with **Delete Configuration**. **Propose Changes** is on the root's **Configuration: Default Config** dialog.

### How do I make a category use a mAIstro agent?

Set the category's **Action to take on match** to **mAIstro-led** in its **Edit Category** dialog, then select the **Default Action** node under it, choose the agent in **Select a mAIstro flow** and select **Save**.

## Related

- [Configuration overview](/configuration/overview/) — the routing tree, categories and the Edit Category dialog
- [Neural Config options](/configuration/neural-config/) — what each configuration section does
- [Backup, restore & change logs](/configuration/backup-restore/) — versions, proposals and rollback
- [Intent matching & caching](/configuration/neural-config/intent-matching-caching/) — how questions match intents
- [mAIstro overview](/maistro/overview/) — building the agents a category can run
