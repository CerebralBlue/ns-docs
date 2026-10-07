---
title: "Backup, restore & change logs"
description: "Use the Neural Config toolbar to download or upload your configuration settings, back up or restore the whole instance, and review every saved configuration version in the Change Log with a Rollback on each row."
---

Two buttons float at the bottom right of the **Neural Config** routing tree, and they cover the
two ways a configuration change can go wrong. **Backup & Restore** gives you a copy you keep
outside the instance: the configuration settings as a file, or a backup of the whole instance.
**Change Logs** is the record inside the instance: every saved version of a configuration, who
saved it and when, what it changed, and a **Rollback** to return to it. Use the first before a
risky change, and the second when answers changed and you need to find out why — or undo it. The
routing tree itself, and the configurations it holds, are explained in
[Configuration overview](/configuration/overview/).

## Download or upload the configuration settings

A settings file is a restore point you keep yourself. Take one before a change you might want to
reverse — a new LLM, a different knowledge base, stricter thresholds — and upload it again to
return to that point.

![The Backup and Restore dialog over the Neural Config routing tree: Download Settings and Upload Settings under Configuration Settings, Backup and Restore in red under Full Instance Backup & Restore, and the toolbar with Backup & Restore and Change Logs at the bottom right](/img/configuration/backup-restore/backup-restore-dialog.png)

To download the settings:

1. Go to **Neural Config** and select **Backup & Restore** on the toolbar at the bottom right of
   the routing tree. The **Backup and Restore** dialog opens.
2. Under **Configuration Settings**, select **Download Settings**.
3. Keep the downloaded file somewhere safe, and name it so you can tell later which state of the
   configuration it holds.

To upload a settings file:

1. Go to **Neural Config** and select **Backup & Restore**.
2. Under **Configuration Settings**, select **Upload Settings**.
3. Choose the settings file in your browser's file picker.

If the instance hides API keys from configuration admins, plan to re-enter them after an upload —
see [Troubleshooting](#api-keys-are-missing-after-upload-settings).

## Back up or restore the whole instance

When the whole instance has to be preserved, not only its configuration, use the lower half of
the same dialog, headed **Full Instance Backup & Restore**. Under the heading the dialog warns:
`(Restoring is permanent and irreversible)`. Its two buttons, **Backup** and **Restore**, are
drawn in red to set them apart from the settings pair above.

1. Go to **Neural Config** and select **Backup & Restore**.
2. To take a backup, select **Backup** under **Full Instance Backup & Restore**.
3. To restore the instance from a backup, first take a fresh **Backup** (or at least
   **Download Settings**) so you have a way back, then select **Restore**.

<!-- UNCONFIRMED: curated Q&A has its own backup on the Curate screen (Download to CSV / Load Q&A) — from the old page; not on the Neural Config screen -->

Curated questions and answers are backed up separately, from the Curate screen — see
[Answer curation](/seek/curation/).

## Review what changed in the Change Log

The Change Log answers "what changed, who saved it, and when?" for each configuration. Open it
when answers change and nobody knows why, or before you roll anything back.

![The Change Log dialog: the Default Config, Billing and Technical Support tabs above a table with the columns Proposal ID / Configuration Date, User, Version and Action, one row per saved version with a Rollback icon at the end; user names are redacted](/img/neural-config/change-logs-panel--redacted.png)

1. Go to **Neural Config** and select **Change Logs**, to the right of **Backup & Restore** on the
   toolbar. A dialog titled **Change Log** opens with the **Default Config** tab selected.
2. Select the tab of the configuration you want to inspect. **Default Config** holds the log of
   the instance's default configuration. The other tabs are named after routing categories —
   **Billing** and **Technical Support**, for example — and hold the log of the configuration
   that category carries of its own.
3. Read the rows, newest first.
4. To see what a version changed, select the chevron at the start of its row.

Each tab is a table with these columns:

- **Proposal ID / Configuration Date** — when the version was saved, as an ISO 8601 date-time in
  UTC (it ends in `Z`).
- **User** — the account that saved the version, shown as its sign-in e-mail address.
- **Version** — the name given to the version when it was saved, or `Version N` when it was saved
  without one. In the log, higher numbers sit on older rows, and the numbering runs across all the
  tabs together, so `Version N` is a position in the history rather than a fixed id. Identify a
  version by its date-time or its name.
- **Action** — the **Rollback** icon for that row (see
  [Roll back to an earlier version](#roll-back-to-an-earlier-version)).

<!-- UNCONFIRMED: Version N labels renumber when a new version is saved — hands-on record of the product, 2026-09-26; not shown on a captured screen -->

Because `Version N` counts back from the newest save, the label on a given row can change when a
new version is saved. Naming versions when you save them, as described in
[Using the Neural Config page](/configuration/neural-config/using-this-page/), keeps the log
readable later.

An expanded row lists the configuration keys that changed in that version, each followed by two
values: the value before the save, then the value after. The keys are the configuration's
internal names — for example `categories`, `piiTraining` or `postKBAgent` — not the labels you
see in the **Configuration: Default Config** dialog. Below the list sit the save date-time and one line of text:
either the note typed when the version was saved, or a line starting
`Updated settings for the following fields:` followed by the key names. A note is what makes a
row useful months later, for example: "Added three pre-LLM regex filters (SSN, card number,
employee ID) and two LLM-based PII training examples. Requested by the support team before the
customer portal launch."

### About proposals

**Propose Changes** sits next to **Save** in the footer of the **Configuration: Default Config**
dialog. What it does, and how it differs from **Save**, is covered on
[Using the Neural Config page](/configuration/neural-config/using-this-page/). In the Change Log,
the first column is named **Proposal ID / Configuration Date**, and inside an expanded row that
touches categories, a `proposal:` key carries a six-digit id.

![The Log Alternate Configs setting on Platform Preferences, with its help text about logging answers from a Proposal or Override to the Curate Tab](/img/neural-config/platform-preferences--log-alternate-configs.png)

A proposal lets you test a configuration with Seek before it goes live. **Log Alternate Configs**
on [Platform Preferences](/configuration/neural-config/platform-preferences/) decides whether
those answers are kept: "When calling seek with a Proposal or Override of the configuration,
should the answers be logged to the Curate Tab." Turn it off if answers from a configuration under
test should not mix with production answers on Curate.

## Roll back to an earlier version

Every row of every tab carries its own **Rollback**, so you return the configuration to the
version you pick — not one step back. Read the expanded row first, so you know which keys the
rollback will change.

<!-- UNCONFIRMED: Rollback applies immediately with no confirmation; a Complete dialog ("Your transaction has been processed. Click Ok to refresh the page.") follows with Ok; a rollback that changes something adds a new row named after the version it undid (a captured Default Config row pair shows this), a rollback to the live version adds none — hands-on record of the product, 2026-09-26 -->

1. Go to **Neural Config** and select **Change Logs**.
2. Select the tab of the configuration you want to roll back.
3. Find the version you want to return to by its date-time or name, and expand its row to check
   what it changes.
4. Select **Rollback** in that row's **Action** column. The rollback applies at once; a
   **Complete** message follows: "Your transaction has been processed. Click Ok to refresh the
   page."
5. Select **Ok** to refresh the page.
6. Open **Change Logs** again. A rollback that changed the configuration appears as a new row at
   the top of the tab, carrying the name of the version it replaced. Expand it: its values run
   from the replaced version's settings back to the ones you returned to.

Because the rollback takes effect immediately, answers produced afterwards already use the
restored configuration. If you are not sure, **Download Settings** first so you can return to the
current state.

## Troubleshooting

### API keys are missing after Upload Settings

![The Hide API Keys setting on Platform Preferences, with its help text about re-entering API keys when importing a configuration file](/img/neural-config/platform-preferences--hide-api-keys.png)

**Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) keeps API keys away from
configuration admins. Its help text warns: "Setting this option to true will require you re-enter
all API keys when importing a configuration file. Once set to true this option cannot be
disabled." Uploading a file with **Upload Settings** is most likely that import, so on an instance
where the option was ever set to true, re-enter every LLM, embedding and integration key after the
upload.

### A Version number now points at a different row

`Version N` is a position in the history, not a fixed id, so the same label can land on another
row after new versions are saved. Note a version's date-time from **Proposal ID / Configuration
Date** instead, or name your versions when you save them.

### You can't tell which version is live

The newest row on a tab is the last change saved or rolled back for that configuration. To see
the settings themselves, open the configuration from the routing tree: **Edit Configuration** opens
**Configuration: Default Config**, and **Edit Custom Configuration** on a category opens a dialog
titled **Configuration:** followed by the category name.

## FAQ

### What is the difference between Download Settings and Backup?

**Download Settings** and **Upload Settings** sit under **Configuration Settings** and move the
configuration as a file. **Backup** and **Restore** sit under **Full Instance Backup & Restore**
and cover the whole instance; the dialog warns that restoring is permanent and irreversible.

### How do I see who changed a configuration and when?

Select **Change Logs**, open the configuration's tab, and read **User** and **Proposal ID /
Configuration Date** on the row. Expand the row to see the keys that changed, their values before
and after, and the note saved with the change.

### Why did "Version 7" move to a different row?

`Version N` counts back from the newest save across all configurations, so it shifts as new
versions are saved. Identify versions by their date-time, or give them a name when you save them.

### Does a rollback delete the newer versions?

<!-- UNCONFIRMED: a rollback adds a new row and removes none — hands-on record of the product, 2026-09-26 -->

No. A rollback that changes the configuration is added to the log as a new row; the versions
saved after the one you returned to stay in the list, so you can roll forward again.

## Related

- [Configuration overview](/configuration/overview/) — the routing tree, Default Config and
  categories with a configuration of their own
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — Save, Propose
  Changes and naming a version
- [Platform Preferences](/configuration/neural-config/platform-preferences/) — Hide API Keys and
  Log Alternate Configs
- [Answer curation](/seek/curation/) — curated questions and answers
