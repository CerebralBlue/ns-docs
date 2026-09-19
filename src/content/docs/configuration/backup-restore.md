---
title: "Backup, restore & change logs"
description: "Neural Config carries two buttons on a floating toolbar at the bottom right of the routing tree: Backup & Restore, which downloads or uploads a settings file and backs up or restores the whole instance, and Change Logs, which lists every saved configuration version with its user and a Rollback action."
---

## What is it

Two buttons sit on a small floating toolbar at the bottom right of the **Neural Config** screen:

- **Backup & Restore** opens a **Backup and Restore** dialog that covers two different things — a
  configuration settings file you can download and upload again, and a full instance backup and
  restore.
- **Change Logs** opens a **Change Log** dialog: one tab per configuration, listing every saved
  version with the date, the user who saved it, a version label, and a **Rollback** action.

Both act on _configuration_. Curated question-and-answer content is backed up separately, from
the Curate screen — see [Curated data is a different backup](#curated-data-is-a-different-backup)
below.

:::note
Older documentation told you to select **Show advanced options** on the Configure tab first.
There is no such toggle on this screen. Both buttons are always visible on the floating toolbar.
:::

## Why it matters

The configuration is what turns a KnowledgeBase into answers: which LLM runs, how strict the
confidence thresholds are, what is masked, which category is routed to which agent. Changing it
changes every answer that follows, and most of those settings have no undo of their own.

The two features cover the two ways that goes wrong. A settings file is a point you can return
to, uploaded back through the same dialog. The Change Log is the record of what actually changed,
by whom and when, with a rollback per entry.

## When to use it

- Before a configuration change you are not sure about — take a settings file first.
- When an answer changed and nobody knows which setting moved: read the Change Log for that
  configuration.
- When a change has to be undone: **Rollback** the entry that introduced it.
- To back up curated Q&A content, which these buttons do **not** cover.

## How it works

The toolbar floats over the routing tree, at the bottom right of the screen.

![The Neural Config routing tree, with the floating toolbar holding Backup & Restore and Change Logs at the bottom right](/img/neural-config/default.png)

### The Neural Config toolbar

- **Backup & Restore** — the left half of the toolbar, label plus icon. Opens the **Backup and
  Restore** dialog.
- **Change Logs** — the right half, same construction. Opens the **Change Log** dialog.

Neither button has an accessible name of its own in the page markup: the name comes from the
visible text beside the icon. If you are driving the console with a screen reader or an
automation tool, look for the text rather than a button label.

The rest of the screen — the routing tree, the category nodes and the configuration dialogs — is
mapped on [Configuration overview](/configuration/overview/).

### The Backup and Restore dialog

![The Backup and Restore dialog: a Configuration Settings section with Download Settings and Upload Settings, and a Full Instance Backup & Restore section with Backup and Restore below the warning that restoring is permanent and irreversible](/img/configuration/backup-restore/backup-restore-dialog.png)

The dialog is titled **Backup and Restore** and has two sections.

**Configuration Settings** — the settings of this instance as a file.

- **Download Settings** — downloads the current configuration.
- **Upload Settings** — uploads a configuration file back into the instance.

**Full Instance Backup & Restore** — the whole instance, not just its settings. The dialog prints
one line of warning under the heading: `(Restoring is permanent and irreversible)`.

- **Backup** — takes the full instance backup.
- **Restore** — restores one. Both are drawn in red, unlike the pair above them.

Whichever of the two upload paths you take, the file itself is chosen with a **Choose File**
button, the browser's own file picker. The screen carries two of them; which one belongs to
**Upload Settings** and which to **Restore** is not visible in the markup, so follow the button
you clicked rather than the one you expect.

Close the dialog with the **Close** (×) control at the top right. Nothing in this dialog is
staged: there is no **Save** step and no **Propose Changes** step, unlike the configuration
dialogs described on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

#### What a settings file actually is

A downloaded configuration is a packed `.nsconfig` blob, not readable JSON. The export this
documentation pipeline pulled from the same instance is 38 977 bytes with no key index in it, so
treat a settings file as a restore point: something to upload back, not something to diff, grep
or hand-edit.

:::caution
**Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) changes what a
restore gives you back. Its help text says that setting the option to true "will require you
re-enter all API keys when importing a configuration file", and that "once set to true this
option cannot be disabled". Plan for re-entering every LLM, embedding and integration key after
an import on an instance where it has ever been on.
:::

### The Change Log dialog

**Change Logs** opens a dialog titled **Change Log**.

![Screenshot needed — the Change Log dialog: the Default Config tab strip and the Proposal ID / Configuration Date, User, Version and Action columns](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/change-logs-panel.png — re-capture the Change Log dialog on
     the playground with the User column redacted. Why: the dialog's structure (tabs + four
     columns + the Rollback icon) is hard to describe in prose, but the existing capture at that
     path shows a real person's email address in every row and must not be published as is. -->

- **Tabs** — one per configuration. **Default Config** is always there; a category that has a
  Custom Configuration gets a tab of its own (`Technical Support` and `Billing` on the instance
  captured here). Categories that use the Default Configuration have no tab, because they have no
  configuration of their own to change.
- **Proposal ID / Configuration Date** — the column holds one or the other. Every row on the
  instance captured here carried a configuration date, as an ISO timestamp
  (`2026-09-17T20:28:14.816Z`).
- **User** — the account that saved it.
- **Version** — usually an incrementing label such as `Version 9`, but it holds free text: an
  entry saved with a description shows that description instead (`PII rules for support intake`
  on the captured instance).
- **Action** — holds the **Rollback** control for that row.
- **Row expander** — the chevron at the left of a row opens it to show the configuration keys
  that changed in that version, each with its new value, followed by the note saved with the
  change.

**Rollback** is offered per row, so a rollback is to a specific saved version rather than a
single step back. It was not exercised while this page was written — rolling a shared instance
back is not something to try for a screenshot — so what it does to any proposal in flight is not
described here.

The screen also carries a **Proposal Activated** confirmation (a dialog with a single **Ok**
button), shown at the end of the proposal lifecycle when a proposed configuration is activated.
Proposals themselves — **Propose Changes** versus **Save** — are explained on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

Close the dialog with **Close**.

### Curated data is a different backup

Neither toolbar button touches curated answers. Curated Q&A lives on the **Curate** screen — on
the instance checked for this page it had no link in the top navigation and was reached directly
at `/curate` — and its backup is a CSV:

- Selecting curated intents there reveals a **Download to CSV** action in the toolbar. The
  exported CSV is also how a subject-matter expert can edit answers without console access.
- With no intents selected, a **Load Q&A** button near the top right opens the **Q&A Upload**
  page, where the CSV goes back in.

![The Q&A Upload page: Submit and Cancel, the upload instructions with their template link, the drag-and-drop area, and the Improve my answers toggle set to No](/img/configuration/backup-restore/qanda-upload-page.png)

The Q&A Upload page links a `template` for the column titles, states that input files must keep
those column titles at a minimum, and carries an **Improve my answers (send each answer out to
Seek)** toggle that is off (`No`) by default. Leave it off when you are restoring: you want the
rows you saved, not regenerated answers.

Curation itself — what a curated answer is and how intents are edited — is documented on
[Answer curation](/seek/curation/).

All user data and generated answers are owned by and for the sole use of the customer. Backing up
curated content regularly is your responsibility.

## FAQ

### Where is Backup & Restore?

On the floating toolbar at the bottom right of the **Neural Config** tree, beside **Change
Logs**. The old instruction to select "Show advanced options" first is out of date — there is no
such toggle on the screen.

### Can I open or edit a downloaded settings file?

No. **Download Settings** produces a packed `.nsconfig` blob rather than readable JSON. It is a
restore point you upload back through **Upload Settings**; to inspect or change a setting, open
the configuration dialog in the console.

### What is the difference between Download Settings and Backup?

They are in two separate sections of the same dialog. **Download Settings** / **Upload Settings**
move the instance's **Configuration Settings** as a file. **Backup** / **Restore** cover the
**Full Instance**, and the dialog warns that restoring is permanent and irreversible. What a full
instance backup includes beyond the configuration is not stated on the screen.

### Will restoring bring my API keys back?

Not if **Hide API Keys** has ever been set on
[Platform Preferences](/configuration/neural-config/platform-preferences/). Its help text says
that setting it will require you to re-enter all API keys when importing a configuration file,
and that the option cannot be disabled once set.

### How do I see who changed a setting, and undo it?

Open **Change Logs**, pick the tab for that configuration, and read the **User** and **Proposal
ID / Configuration Date** columns; expand a row to see exactly which configuration keys the
version changed and the note saved with it. The **Action** column of that row holds **Rollback**.

### How do I back up curated answers?

Not from this toolbar. Select the intents on the Curate screen and use **Download to CSV**; put
them back with **Load Q&A** on the same screen, which opens the **Q&A Upload** page. Keep
**Improve my answers (send each answer out to Seek)** off while restoring. See
[Answer curation](/seek/curation/).
