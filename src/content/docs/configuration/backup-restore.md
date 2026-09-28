---
title: "Backup, restore & change logs"
description: "The Neural Config screen's floating toolbar holds Backup & Restore, which downloads or uploads a configuration settings file and backs up or restores the whole instance, and Change Logs, which lists every saved configuration version by date, user and label with a Rollback action per row."
---

## What is it

Two buttons share a small floating toolbar at the bottom right of the **Neural Config** routing
tree:

- **Backup & Restore** opens the **Backup and Restore** dialog. It covers two different things: a
  configuration settings file you can download and upload again, and a backup and restore of the
  whole instance.
- **Change Logs** opens the **Change Log** dialog: one tab per configuration, each listing the
  saved versions with their date, the user who saved them, a version label and a **Rollback**
  action.

Both act on _configuration_ — the settings behind the routing tree and its Edit Configuration
dialogs.

:::note
Older documentation told you to select **Show advanced options** on the Configure tab first.
There is no such step on the current screen: the toolbar is always visible at the bottom right of
the tree.
:::

## Why it matters

The configuration decides how every answer is produced — which knowledge base and LLM are used,
how strict the thresholds are, what is masked, which category is routed where. A saved change
applies to every request that follows.

The two dialogs cover the two ways that goes wrong. A downloaded settings file is a point you can
return to by uploading it again. The Change Log is the record of what changed, who saved it and
when, with a rollback per saved version — so you do not have to remember which accordion section
someone edited last week.

The Change Log answers "what changed, and can I go back?" inside one instance. It is the wrong
tool for keeping a copy outside the instance; that is what the settings file is for.

## When to use it

- **Before a change you are unsure about** — take a settings file with **Download Settings**
  first.
- **When answers changed and nobody knows why** — open **Change Logs**, pick the configuration's
  tab and expand the newest rows to see which keys moved.
- **When a change has to be undone** — use **Rollback** on the row of the version you want to
  return to.
- **When the whole instance has to be preserved**, not just its settings — **Backup**, and later
  **Restore**, keeping in mind that the dialog calls restoring permanent and irreversible.

Curated questions and answers are a separate backup: neither toolbar button mentions them.

<!-- UNCONFIRMED: curated Q&A is exported with Download to CSV (after selecting intents) and re-imported with Load Q&A on the Curate screen — from the old page; the Curate screen is not on the Neural Config screen these facts come from -->

Older documentation exports them with **Download to CSV** and re-imports them with **Load Q&A**
on the Curate screen; see [Answer curation](/seek/curation/) for the current controls.

## How it works

### The Neural Config toolbar

![The Neural Config routing tree with the floating toolbar at the bottom right: Backup & Restore on the left, Change Logs on the right](/img/neural-config/default.png)

The toolbar floats over the routing tree at the bottom right of the **Neural Config** screen and
holds two buttons:

- **Backup & Restore** — the dark left half, with a tray icon. Opens the **Backup and Restore**
  dialog.
- **Change Logs** — the blue right half, with a list icon. Opens the dialog titled **Change Log**
  (singular: the button says "Change Logs", the dialog says "Change Log").

The tree itself — the category nodes and what each one opens — is described on
[Configuration overview](/configuration/overview/).

### The Backup and Restore dialog

![The Backup and Restore dialog: a Configuration Settings section with Download Settings and Upload Settings, and a Full Instance Backup & Restore section with Backup and Restore in red under the line "(Restoring is permanent and irreversible)"](/img/configuration/backup-restore/backup-restore-dialog.png)

The dialog is titled **Backup and Restore** and holds four buttons in two sections. It shows
labels only — no help text. The section headings below are the ones the dialog displays, as in
the image.

**Configuration Settings** — the instance's configuration as a file.

- **Download Settings** — downloads the configuration settings as a file. Use it before a change
  you may want to reverse.
- **Upload Settings** — uploads a settings file back. Use it to return to a file you downloaded
  earlier.

**Full Instance Backup & Restore** — the whole instance, not just its settings. The dialog prints
one line under this heading: `(Restoring is permanent and irreversible)`.

- **Backup** — takes a full-instance backup.
- **Restore** — restores the instance from one. **Backup** and **Restore** are drawn in red,
  unlike the pair above them; the restore cannot be undone, so take a fresh **Backup** or
  **Download Settings** first if you might want to come back.

The two upload paths pick the file with a **Choose File** button — the browser's own file picker.
The page carries two of them, one per upload path; the markup does not tie either to a specific
button, so check the dialog you opened before choosing a file.

The dialog does not say what a settings file contains, or what a full backup includes beyond the
configuration. Treat a downloaded file as a restore point — something to upload back through the
same dialog — rather than something to read or edit.

Nothing in this dialog is staged: the image shows no **Save** and no **Propose Changes** step,
unlike the Edit Configuration dialogs described on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Hide API Keys setting on Platform Preferences, with its help text about re-entering API keys when importing a configuration file](/img/neural-config/platform-preferences--hide-api-keys.png)

:::caution[Hide API Keys changes what an import gives back]
**Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) says in its help text
that setting it to true "will require you re-enter all API keys when importing a configuration
file", and that "once set to true this option cannot be disabled". Uploading a file with
**Upload Settings** is most likely that import, so on an instance where the option has ever been
turned on, plan to re-enter every LLM, embedding and integration key afterwards.
:::

### The Change Log dialog

<!-- SCREENSHOT: /img/neural-config/change-logs--change-logs.png — redact the User column and the internal version labels, or recapture with a service account -->

![The Change Log dialog: the Default Config, Billing and Technical Support tabs above a table with the columns Proposal ID / Configuration Date, User, Version and Action](/img/_placeholder.svg)
<!-- SCREENSHOT: /img/neural-config/change-logs--change-logs.png — recapture with the User column's account emails blurred -->

**Change Logs** opens a dialog titled **Change Log**, with a **Close** (×) control at the top
right and a blue **Close** bar at the bottom.

**Tabs** — one per configuration that has a log:

- **Default Config** — selected when the dialog opens; the log of the instance-wide default
  configuration.
- **Billing** and **Technical Support** — in the example, two categories that carry a
  configuration of their own (their tree nodes read `Custom Configuration`). Categories whose node
  reads `Default Configuration` — **Account Access** and **API & Integrations** in the example —
  have no tab: they use the default configuration and so have no log of their own.

**The table** — each tab is a table with an unlabelled first column (the row expander) and four
named columns, newest row first:

- **Proposal ID / Configuration Date** — when the version was saved, as an ISO 8601 date-time in
  UTC (ending in `Z`). See [Proposals](#proposals--what-the-screen-shows-and-what-it-does-not)
  for the other half of the column name.
- **User** — the account that saved the version, shown as its sign-in e-mail address.
- **Version** — the label typed in the **Version Information** prompt when the version was saved
  (the prompt is covered on
  [Using the Neural Config page](/configuration/neural-config/using-this-page/)). It is free text:
  in the example some rows read `Version 10`, `Version 13`, `Version 14` and others read
  `PII rules for support intake`, and the higher numbers sit on _older_ rows. Treat the label as a
  name, not as a position in the list. A descriptive label is what makes this column useful later.
- **Action** — the **Rollback** icon for that row.

**Expanding a row** — the chevron at the left of a row opens it. The expanded content is a
nested list of the configuration keys that changed in that version — for example `categories`,
`details`, `embeddingModels`, `piiTraining`, `prePiiFilter`, `postKBAgent` or `score` — each key
followed by two values. The two values read as the old value and the new value, although the
screen does not label which is which. Under the list sit the save date-time and a line of text:
either a note typed with the change (for example, "Added three pre-LLM regex filters (SSN, card
number, employee ID) and two LLM-based PII training examples.") or a line of the form
`Updated settings for the following fields: …` followed by key names. Whether that second form is
written by the product or typed by the person saving is not shown on screen.

**Rollback** is offered per row, so a rollback returns the configuration to the specific version
you pick rather than stepping back once. Read the expanded row first, so you know which keys the
rollback will change. What the confirmation looks like, and what happens to a proposal in flight,
is not described on this page yet.

### Proposals — what the screen shows and what it does not

![The footer of the Edit Configuration dialog: Propose Changes on the left, Save on the right](/img/neural-config/corporate-document-filter-panel.png)

A proposal is a configuration change submitted with **Propose Changes** instead of **Save** —
both buttons sit in the footer of every Edit Configuration dialog. What separates the two, and the
**Version Information** prompt that follows, are covered on
[Using the Neural Config page](/configuration/neural-config/using-this-page/). The Change Log
shows only traces of proposals:

- The first column is named **Proposal ID / Configuration Date**, and an expanded row that touches
  categories carries a `proposal:` entry inside `categories` with a six-digit value. That is the
  on-screen evidence that proposals have ids.

  <!-- UNCONFIRMED: a proposal row shows its id in the first column instead of a save date — inferred from the column name only; no proposal row appears in the Change Log image -->

  A proposal row is presumably listed by that id where a saved version shows its date.

- The console carries a **Proposal Activated** acknowledgement — a message with a single **Ok**
  button. Which action raises it is not described on this page yet.

  <!-- UNCONFIRMED: the proposal lifecycle beyond Propose Changes — an Activate step and a Delete Proposal action ("legacy but supported") — from the migration-map gap list; on no Neural Config screen or markup -->

  Older material describes an **Activate** step and a **Delete Proposal** action for a pending
  proposal. Neither appears on the current Neural Config screens.

![The Log Alternate Configs setting on Platform Preferences, with its help text about logging answers from a Proposal or Override to the Curate Tab](/img/neural-config/platform-preferences--log-alternate-configs.png)

A proposal can be exercised by Seek before it becomes active. **Log Alternate Configs** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) decides what happens to
those answers; its help text reads "When calling seek with a Proposal or Override of the
configuration, should the answers be logged to the Curate Tab." Turn it off if you do not want
answers from a configuration under test to mix with production answers on Curate.

## FAQ

### Where are Backup & Restore and Change Logs?

On the floating toolbar at the bottom right of the **Neural Config** routing tree — **Backup &
Restore** on the left, **Change Logs** on the right. There is no "Show advanced options" step;
that instruction is out of date.

### What is the difference between Download Settings and Backup?

**Download Settings** and **Upload Settings** sit under **Configuration Settings**: they move the
configuration as a file. **Backup** and **Restore** sit under **Full Instance Backup & Restore**,
for the whole instance, with the warning "(Restoring is permanent and irreversible)". The dialog
does not list what each file contains.

### How do I see who changed a configuration and when?

Open **Change Logs**, pick the tab — **Default Config**, or a category with a configuration of
its own such as **Billing** or **Technical Support** — and read **Proposal ID / Configuration
Date**, **User** and **Version**. Expand a row to see the keys that changed, their two values and
the note saved with the change.

### Why does the Version column show text instead of a number?

Because it is the label typed in the **Version Information** prompt when the change was saved,
not a counter. A label like `Version 13` is just text: in the Change Log, higher numbers can sit
on older rows.

### How do I undo a change?

Every row of the Change Log carries **Rollback** in its **Action** column, so you return to the
specific version you pick rather than one step back. Expand the row first to check which keys it
changes.

### Will my API keys survive an import?

Not if **Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) has ever been set to
true. Its help text says that setting requires re-entering every API key when importing a
configuration file, and that it cannot be turned off again once set.
