---
title: "Seek logs & configuration insights"
description: "Seek Logs lists every Seek exchange with its intent, category, score, response time and cache status, and Configuration Insights shows each saved configuration version with the settings it changed."
---

Two pages in the Seek Governance group answer the questions the aggregate dashboards cannot. **Seek Logs** is the row-level record of each [Seek](/seek/overview/) exchange: the question, the generated answer, and how it was answered. Use it when you need the one answer a user complained about, or the real exchanges behind a guardrail count on a [dashboard](/governance/analytics/reading-the-dashboards/). **Configuration Insights** is a read-only timeline of your saved configuration versions and what changed in each. Use it to find when a setting changed and who saved the change, for example when answer quality shifts and you want to know whether the configuration changed at the same time.

## Where to find it

Both pages are in the left Governance navigation, under the **Seek Governance** group:

- **Governance** > **Seek Governance** > **Seek Logs**
- **Governance** > **Seek Governance** > **Configuration Insights**

If the navigation is collapsed, open it with the arrow at its top.

## Settings

### The Seek Logs table

![The Seek Logs page: the search icon, Filter and Download Logs to CSV buttons above a table with the Date, Session, Question and Answer columns](/img/governance/seek-logs.png)

Each row is one exchange, newest first in the default view. The table has four columns:

| Column       | What it shows                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Date**     | When the exchange happened, as date and time (for example `2026-10-01 16:46:40`).                                                     |
| **Session**  | The session the exchange belongs to.                                                                                                  |
| **Question** | The question as the user asked it.                                                                                                    |
| **Answer**   | The answer NeuralSeek generated, followed by a detail line that explains how the answer was produced (see the next table).            |

<!-- UNCONFIRMED: Session holds the session identifier only when the caller sends one; every captured row had an empty Session cell — brief (understand), not shown on screen -->

The **Session** cell is filled when the caller passes a session identifier with the Seek, so you can group the exchanges of one conversation.

Under each answer, the detail line carries the information you need to judge it:

| Detail            | What it tells you                                                                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Intent:`         | The intent the question was matched to. The intent name is a link: select it to open that intent in [Curate](/seek/curation/), where its questions and answers are curated. |
| `Category:`       | The [intent category](/governance/intent-categorization/) the question was assigned to, such as `Technical Support` or `Other`.                                                                                        |
| Score             | The score NeuralSeek gave the answer, as a percentage (for example `Score: 45%`).                                                                                                                                      |
| Response time     | How long the answer took, in milliseconds, next to the score.                                                                                                                                                         |
| **Cached** badge  | The answer was served from the [answer cache](/seek/caching/) instead of being generated again. |

<!-- UNCONFIRMED: selecting a row's category opens an Edit Category dialog to choose another category and save; the correction trains future categorization, and new categories are added from the configuration — old Seek Logs page; the capture shows the category is clickable but did not open it -->

To correct a question that landed in the wrong category, select its category value. In the **Edit Category** dialog, choose the right category and save. The correction also improves how similar questions are categorized from then on.

Above the table:

- The search box (the magnifier icon) lets you look for a specific exchange instead of paging through the log.
- **Filter** narrows the table to exchanges that meet a condition, such as a guardrail that fired. See [Filter](#filter).
- **Download Logs to CSV** (the icon at the right end of the toolbar) downloads the log rows as a CSV file, for analysis in a spreadsheet or for an audit record.

Below the table, **Items per page:** sets how many rows a page shows (`10`, `50` or `100`), and the text next to it shows which rows you are looking at out of the total. Move through the log with **Previous page** and **Next page**, or jump to a page with the page number selector.

### Filter

![The Filter dialog with five rows of choices: All, Min Confidence, Not Min Confidence; All, Sensitive, Not Sensitive; All, Prompt Injection, Not Prompt Injection; All, Cached, Not Cached; All, PII, Not PII](/img/governance/filter-panel.png)

Select **Filter** above the table to open the **Filter** dialog. It has five conditions. Each one has three choices: **All** (do not filter on this condition), the condition itself (show only the exchanges that meet it), or its opposite (show only the exchanges that do not). Close the dialog with **Close** (×).

| Condition                                                     | Selecting it shows                                                                                                    | The setting behind it                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **All** · **Min Confidence** · **Not Min Confidence**         | **Min Confidence**: answers that fell under the minimum-confidence threshold. **Not Min Confidence**: answers above it. | [Minimum confidence](/governance/guardrails/min-confidence/)        |
| **All** · **Sensitive** · **Not Sensitive**                   | **Sensitive**: exchanges flagged as sensitive. **Not Sensitive**: the rest.                                           | —                                                                   |
| **All** · **Prompt Injection** · **Not Prompt Injection**     | **Prompt Injection**: exchanges in which prompt injection was detected. **Not Prompt Injection**: the rest.           | [Prompt injection](/governance/guardrails/prompt-injection/)        |
| **All** · **Cached** · **Not Cached**                         | **Cached**: answers served from the answer cache. **Not Cached**: answers generated for the request.                  | [Caching](/seek/caching/)                                           |
| **All** · **PII** · **Not PII**                               | **PII**: exchanges in which personal information was detected. **Not PII**: the rest.                                 | [PII detection](/governance/pii-detection/)                         |

<!-- UNCONFIRMED: meaning of the Sensitive condition (exchanges flagged as sensitive) — old Seek Logs page; the dialog shows only the tab names -->

Use **Min Confidence** to review the questions your knowledge base could not answer well: they are the best candidates for new content or curated answers. Use **Prompt Injection** and **PII** to audit what your guardrails caught in real exchanges rather than in aggregate counts.

### The Configuration Insights timeline

![The Configuration Insights page: the title card with the instance name, the arrow to the first version, the timeline strip with a 2 events cluster marker, and the Return to start, Zoom out, Zoom in and Go to end buttons at the top right](/img/governance/configuration-insights.png)

Configuration Insights opens on a title card with the heading **Configuration Insights** and your instance name. Select the arrow on the right (**Next: Version 1**) to step to the first saved version, or use the timeline strip along the bottom of the page.

The timeline strip places each saved version at the time it was saved. When several versions are close together, they are grouped into one marker that shows how many events it holds, such as **2 events**: select it to zoom in until each version has its own marker, labelled **Version 1**, **Version 2** and so on with its date. Select a marker to open that version.

Each version card shows:

- the period during which the version was the active configuration, from the time it was saved to the time the next version replaced it, or to now for the current version
- its heading, such as **Version 2**
- the user who saved it
- **Changes in this version:**, every setting that changed, grouped by configuration section, with its **Previous** and **New** value side by side

The arrows on either side of the card, such as **Previous: Version 1**, step to the previous and next versions.

![A Configuration Insights version card: the active period, the Version heading, the user who saved it, and the Changes in this version panel with Previous and New values](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/configuration-insights--version-card.png — Governance > Seek Governance > Configuration Insights > Go to end: the latest version card with its Changes in this version panel. Mask the user's email before publishing. Why: shows how a changed setting is reported with Previous and New values -->

The buttons at the top right move the timeline:

| Button              | What it does                                                                     |
| ------------------- | -------------------------------------------------------------------------------- |
| **Return to start** | Jumps to the start of the timeline.                                              |
| **Zoom out**        | Widens the time window of the strip, to see a longer history at once.            |
| **Zoom in**         | Narrows the time window, to separate versions saved close together.             |
| **Go to end**       | Jumps to the latest version.             |

Configuration Insights is an audit view: it shows what changed, when and by whom. To roll back to an earlier version, use **Change Logs** in Neural Config, described on [Backup, restore & change logs](/configuration/backup-restore/). Every version on this timeline is created when someone saves the configuration; see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

### How do I find the answer a user complained about?

Open **Seek Logs** and use the search box, or page through the table by **Date** around the time the user asked. The detail line under the answer shows the intent, category, score and response time, and whether the answer came from the cache. Select the intent name to open it in [Curate](/seek/curation/) and correct the answer there.

### How do I list only the answers a guardrail flagged?

Select **Filter** and choose the flagged value of the condition you care about, for example **Prompt Injection**, **PII** or **Min Confidence**.

### Can I undo a configuration change from Configuration Insights?

No. Configuration Insights only shows each saved version and the settings it changed. Use the timeline to find the version you want, then roll back from **Change Logs** in Neural Config; see [Backup, restore & change logs](/configuration/backup-restore/).

### Where are agent runs logged?

<!-- UNCONFIRMED: Seek Logs also records Chat exchanges — old Governance docs ("the logged Seek/Chat occurred"); the capture cannot tell Chat rows apart -->

Seek Logs records Seek and Chat exchanges. Runs of mAIstro agents are in **mAIstro Logs**, under **mAIstro Governance**; see [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/).

## Related

- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — the aggregate views these logs sit behind
- [Seek overview](/governance/analytics/seek-overview/) — the Seek Governance overview dashboard
- [Answer curation](/seek/curation/) — where the intent link in a log row opens
- [Intent categorization](/governance/intent-categorization/) — how questions are assigned to categories
- [Caching](/seek/caching/) — when an answer is served from the cache
- [Backup, restore & change logs](/configuration/backup-restore/) — restore an earlier configuration version
- [Replay](/governance/replay/) and [Logging](/governance/logging/) — replay a logged exchange and set up corporate logging
