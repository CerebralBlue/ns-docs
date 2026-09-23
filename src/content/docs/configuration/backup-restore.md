---
title: "Backup, restore & change logs"
description: "The two buttons on the floating toolbar of the Neural Config screen: Backup & Restore, which downloads or uploads a settings file and backs up or restores the whole instance, and Change Logs, which lists every saved configuration version by date, user and label with a Rollback action per row."
---

## What is it

Two buttons share a small floating toolbar at the bottom right of the **Neural Config** routing
tree:

- **Backup & Restore** opens the **Backup and Restore** dialog, which covers two different things:
  a configuration settings file you can download and upload again, and a full-instance backup and
  restore.
- **Change Logs** opens the **Change Log** dialog: one tab per configuration, listing every saved
  version with its date, the user who saved it, a version label and a **Rollback** action.

Both act on _configuration_ — the settings behind the routing tree. Curated answers are backed
up elsewhere; see [Curated answers are a different backup](#curated-answers-are-a-different-backup).

:::note
Older documentation told you to select **Show advanced options** on the Configure tab first.
There is no such toggle on the current screen: the toolbar is always visible at the bottom right
of the tree.
:::

## Why it matters

The configuration decides how every answer is produced — which knowledge base and LLM are used,
how strict the thresholds are, what is masked, which category is routed where. A change applies
to every request that follows, and most settings have no undo of their own.

The two dialogs cover the two ways that goes wrong. A downloaded settings file is a point you can
return to by uploading it again. The Change Log is the record of what actually changed, by whom
and when, with a rollback per saved version — so you do not have to remember which of the
accordion sections someone edited last week.

The Change Log is the right tool for "what changed?"; it is the wrong tool for moving a
configuration between instances — that is what the settings file is for.

## When to use it

- Before a configuration change you are not sure about: take a settings file first.
- When an answer changed and nobody knows which setting moved: open **Change Logs** for that
  configuration and expand the newest rows.
- When a change has to be undone: use **Rollback** on the row that introduced it.
- When a whole instance has to be preserved, not just its settings: **Backup**, and later
  **Restore** — knowing that the dialog calls restoring permanent and irreversible.

## How it works

![The Neural Config routing tree; the floating toolbar with Backup & Restore and Change Logs sits at the bottom right](/img/neural-config/default.png)

### The Neural Config toolbar

The toolbar floats over the routing tree at the bottom right of the screen and holds two buttons:

- **Backup & Restore** — the dark left half, with a download-tray icon. Opens the **Backup and
  Restore** dialog.
- **Change Logs** — the blue right half, with a list icon. Opens the dialog titled **Change Log**
  (singular — the button says "Change Logs", the dialog says "Change Log").

Neither button carries an accessible name of its own in the page markup: the name comes from the
visible text beside the icon. If you drive the console with a screen reader or an automation
tool, look for that text rather than a button label.

The tree itself — the category nodes and what each one opens — is described on
[Configuration overview](/configuration/overview/).

### The Backup and Restore dialog

![The Backup and Restore dialog from an earlier playground capture: a Configuration Settings section with Download Settings and Upload Settings, and a Full Instance Backup & Restore section with Backup and Restore in red under the line "Restoring is permanent and irreversible"](/img/configuration/backup-restore/backup-restore-dialog.png)

The dialog is titled **Backup and Restore** and holds four actions. The screen shows only their
labels — there is no help text — and the dialog was not opened for the capture this page was
written from; the image above is an earlier capture of the same instance, and the two section
headings come from it.

**Configuration Settings** — the settings of this instance as a file.

- **Download Settings** — downloads the current configuration.
- **Upload Settings** — uploads a configuration file back into the instance.

**Full Instance Backup & Restore** — the whole instance, not just its settings. The dialog prints
one line under this heading: `(Restoring is permanent and irreversible)`.

- **Backup** — takes the full-instance backup.
- **Restore** — restores one. **Backup** and **Restore** are drawn in red, unlike the pair above
  them.

Both upload paths pick the file with a **Choose File** button — the browser's own file picker.
The page carries two of them; which one belongs to **Upload Settings** and which to **Restore**
is not visible in the markup, so follow the button you clicked rather than the one you expect.

What a settings file contains, and what a full backup includes beyond the configuration, is not
stated anywhere on the screen. Treat a downloaded file as a restore point — something to upload
back through the same dialog — rather than something to read or edit.

Nothing in this dialog is staged: there is no **Save** step and no **Propose Changes** step, unlike
the configuration dialogs described on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

:::caution[Hide API Keys changes what an import gives back]
**Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) shows `False` on the
captured instance. Its help text says that setting it to true "will require you re-enter all API
keys when importing a configuration file", and that "once set to true this option cannot be
disabled". On an instance where it has ever been on, plan to re-enter every LLM, embedding and
integration key after **Upload Settings**.
:::

### The Change Log dialog

![Screenshot needed — the Change Log dialog: the Default Config, Billing and Technical Support tabs, and a table with the columns Proposal ID / Configuration Date, User, Version and Action](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/change-logs-panel.png — the Change Log dialog opened from the
     Neural Config toolbar, Default Config tab. The capture at that path exists but shows a real
     person's e-mail address in every row of the User column; redact it or recapture on an
     instance whose saves belong to a service account before placing it here. -->

**Change Logs** opens a dialog titled **Change Log**, with a **Close** (×) control at the top
right and a blue **Close** bar at the bottom.

**Tabs** — one per configuration:

- **Default Config** — selected when the dialog opens; the instance-wide configuration's log.
- **Billing** and **Technical Support** — on the captured instance, these are the two categories
  whose node on the tree reads `Custom Configuration`. Categories marked `Default Configuration`
  (**Account Access**, **API & Integrations**) have no tab: they use the default configuration
  and so have no log of their own. Only the **Default Config** panel was opened for this page;
  the other two tabs were not clicked.

**The table** — the **Default Config** panel is a table with an unlabelled first column (the row
expander) and four named columns:

- **Proposal ID / Configuration Date** — every row on the captured instance holds an ISO
  timestamp of the save (`2026-09-17T20:35:05.260Z` on the newest row). No captured row shows a
  proposal id here, so what a proposal row looks like is not documented.
- **User** — the account that saved the version, shown as its sign-in e-mail address.
- **Version** — a label. Ten captured rows read `Version 7`, `Version 10`, `Version 11`,
  `Version 15` … `Version 21` from newest to oldest — the numbers are not consecutive and the
  higher ones sit on the older rows — so treat them as labels, not as a position in the list.
  The newest row reads `PII rules for support intake` — free
  text, so the label is whatever was typed when the change was saved. The prompt that takes it
  is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
- **Action** — holds the **Rollback** icon for that row.

**Expanding a row** — the chevron at the left of a row opens it. The expanded content is a nested
list of the configuration keys that changed in that version, each key followed by two values;
the pairs look like `id: "516263" "883203"` and `re: "Billing" "Refunds"`, that is old value and
new value, although the screen does not label which is which. Keys seen on the captured
instance include `categories` (with the category `id`, `proposal`, `re` and `rp` entries),
`details`, `embeddingModels`, `piiTraining`, `prePiiFilter` and `score`. Under the list sits the
save timestamp and, when one was entered, the note saved with the change — on the newest
captured row: `Added three pre-LLM regex filters (SSN, card number, employee ID) and two LLM-based
PII training examples. Requested by the support team before the customer portal launch.`

**Rollback** is offered per row, so a rollback returns to one specific saved version rather than
stepping back once. It was not exercised while this page was written — rolling a shared
instance back is not something to try for a screenshot — so what the confirmation looks like,
and what happens to a proposal in flight, is not described here.

### Proposals — what the screen shows and what it does not

The Change Log is where a proposal — a configuration saved with **Propose Changes** instead of
**Save** — would surface. The on-screen evidence for that is thin, and this section says exactly
how thin.

- The first column is named **Proposal ID / Configuration Date**, and expanded rows carry a
  `proposal:` key with a six-digit value (`"516263"`, `"861640"`) inside `categories`. That is the
  entire on-screen evidence that proposals have ids.
  <!-- UNCONFIRMED: a proposal is listed in the first column by its id instead of a date — inferred from the column name only; no proposal row was captured -->
  A proposal row is presumably listed by that id where a saved version shows its date.
- **Propose Changes** sits beside **Save** in the footer of the Edit Configuration dialog. What
  distinguishes the two, and the version prompt, are on
  [Using the Neural Config page](/configuration/neural-config/using-this-page/); neither button
  was pressed for this page.
- **Log Alternate Configs** on
  [Platform Preferences](/configuration/neural-config/platform-preferences/) is the one setting
  on the screen that names a proposal in use: its help text reads "When calling seek with a
  Proposal or Override of the configuration, should the answers be logged to the Curate Tab."
  (it shows `True` on the captured instance). So a proposal can be exercised by Seek before it is
  active, and that switch decides whether those answers reach Curate.
- The page markup carries a **Proposal Activated** acknowledgement (a dialog with a single **Ok**
  button) and a **Complete** one (also **Ok**). Neither was seen opening, so which action raises
  which is not documented here.
  <!-- UNCONFIRMED: the proposal lifecycle beyond Propose Changes — an Activate step and a Delete Proposal action ("legacy but supported") — from the migration-map gap list; on no captured screen or snapshot -->
  Older material describes an **Activate** step and a **Delete Proposal** action for a pending
  proposal; neither appears on any captured screen, so they are listed here only so you know to
  look for them.

### Curated answers are a different backup

Neither toolbar button touches curated question-and-answer content. Curated answers live on the
**Curate** screen and are exported and re-imported there, not from Neural Config.
<!-- UNCONFIRMED: Curate's Download to CSV (after selecting intents) and Load Q&A → Q&A Upload page are the curated backup path — from the old page; the Curate screen is not in this capture -->
The old documentation describes a **Download to CSV** action and a **Load Q&A** upload on that
screen; see [Answer curation](/seek/curation/) for the current controls.

## FAQ

### Where are Backup & Restore and Change Logs?

On the floating toolbar at the bottom right of the **Neural Config** routing tree — **Backup &
Restore** on the left, **Change Logs** on the right. There is no "Show advanced options" step;
that instruction is out of date.

### What is in the Backup and Restore dialog?

Four actions: **Download Settings** and **Upload Settings** under **Configuration Settings**, and
**Backup** and **Restore** under **Full Instance Backup & Restore**, with the warning that
restoring is permanent and irreversible. The two upload paths use a browser **Choose File**
picker. The dialog shows labels only, so what a settings file or a full backup contains is not
documented.

### How do I see who changed a configuration and when?

Open **Change Logs**, pick the tab — **Default Config**, or a category with a configuration of
its own such as **Billing** or **Technical Support** — and read **Proposal ID / Configuration
Date**, **User** and **Version**. Expand a row to see the keys that changed, their old and new
values, and the note saved with the change.

### Why does the Version column say something other than "Version N"?

Because it is a label typed at save time, not a counter. The newest captured row reads
`PII rules for support intake`; the rows around it read `Version 7` to `Version 21`, out of
order.

### How do I undo a change?

Every row of the Change Log carries **Rollback** in its **Action** column, so you return to the
specific version you pick rather than one step back. It was not exercised on the shared instance
this page was written from, so the confirmation it shows and its effect on a pending proposal are
not documented.

### Will my API keys come back after an import?

Only if **Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) has never been set
to true. Its help text says that setting it requires re-entering every API key when importing a
configuration file, and that the option cannot be turned off again once set.
