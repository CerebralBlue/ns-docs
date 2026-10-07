---
title: "Agent Scheduler"
description: "Run a saved mAIstro agent on a cron schedule, see when each schedule last ran and runs next, and find out when a scheduled run fails."
---

The Agent Scheduler runs a saved [mAIstro](/maistro/overview/) agent by itself at the times you set: a summary report every Monday morning, a knowledge base sweep every night, a status check every fifteen minutes. Each schedule pairs one agent with a cron expression and a description, and the schedule list shows when each one last ran and when it runs next. Schedules live on the **Scheduler** tab of mAIstro. When you want to start an agent on demand rather than on a timetable, use [Run Agents](/maistro/run-agents/) instead.

## Before you begin

- **Save the agent first.** A schedule runs an agent that already exists under a saved name; build and save it in the [visual editor](/maistro/visual-editor/), and test it once by hand before you schedule it.
- **Make the agent self-contained.** Nobody is watching a scheduled run, so the agent has to finish without anyone typing into it and deliver its own result — send it by email or chat, write it to a document, or post it to the system that needs it.
- **Have your run times in UTC to hand.** The schedule list reports run times in UTC, so convert the times you intend from your local time before you compare them with the list.

## Create a schedule

1. In the top navigation, select **mAIstro**, then select the **Scheduler** tab.
2. Select **Create Schedule**. The **Create a Schedule** form opens below the schedule list.
3. In **Select a mAIstro agent**, open the list and choose the agent to run. You can type in the box to narrow the list.
4. Next to **Schedule:**, replace the expression in the **Cron expression** box with the times the agent should run (see [Write the cron expression](#write-the-cron-expression)). If you prefer not to write cron by hand, select **Edit schedule** to build the expression instead.
5. In **Schedule Description**, say what the run is for and who relies on it, for example "Weekly support summary for the team lead". This text is what the list shows in its **Description** column, so it is how colleagues tell schedules apart.
6. Select **Save**. To discard the form, select **Cancel**.

![The Scheduler tab with the Create a Schedule form open below the schedule list: the agent dropdown, the Schedule cron box with Edit schedule, and Schedule Description](/img/maistro/create-schedule.png)

:::caution[Change the schedule before you save]
A new form starts with `* * * * *` in the **Cron expression** box, which means every minute of every day. Saved as it is, the agent runs 1,440 times a day.
:::

## Write the cron expression

The **Cron expression** box takes a standard five-field cron expression. The fields, from left to right, are minute, hour, day of month, month and day of week; `*` in a field means "every".

| Expression     | Runs                                |
| -------------- | ----------------------------------- |
| `0 9 * * 1`    | At 09:00 every Monday               |
| `0 2 * * *`    | At 02:00 every day                  |
| `*/15 * * * *` | Every 15 minutes                    |
| `0 6 1 * *`    | At 06:00 on the first of each month |

After you save, check **Next Run (UTC)** in the schedule list to confirm the expression runs at the time you intended.

<!-- UNCONFIRMED: Edit schedule opens an editor with separate settings for minutes, hours, days of the month, months and days of the week — old mAIstro page, "Agent Scheduler" section; the editor was not opened in the capture -->

**Edit schedule** builds the same expression from separate settings for each unit of time.

## Check when each schedule runs

The schedule list on the **Scheduler** tab shows every schedule on the instance. Each column header sorts the list.

![The schedule list: the search icon and Create Schedule above columns Agent, Last Run (UTC), Next Run (UTC), Description and Enabled, with the empty state "Select or Create a Schedule" below](/img/maistro/scheduler-panel.png)

- **Agent** — the agent the schedule runs.
- **Last Run (UTC)** — when the agent last ran on this schedule.
- **Next Run (UTC)** — when it will run next. Check this column after you save: it is the quickest way to confirm the cron expression means what you intended.
- **Description** — the text from **Schedule Description**.
- **Enabled** — whether the schedule is active.

To find a schedule in a long list, select the search icon above the table and type to filter the list. **Items per page:** at the foot of the list sets how many schedules each page shows.

## Change a schedule

<!-- UNCONFIRMED: an existing schedule is changed by selecting it in the list, which opens it in the schedule form — old mAIstro page ("selecting the agent from the list … then pressing the Edit Schedule button") and the list's empty-state text "Select or Create a Schedule" -->

1. On the **Scheduler** tab, select the schedule in the list. It opens in the schedule form below the list.
2. Change the **Cron expression**, or select **Edit schedule** to adjust it field by field. Update **Schedule Description** if the purpose changed.
3. Select **Save**, then check **Next Run (UTC)** in the list.

## Delete a schedule

Delete a schedule to stop the agent running on that timetable for good.

<!-- UNCONFIRMED: a row is selected with a checkbox and a selection bar ("… item selected", Delete Schedule, Cancel) then appears above the list — the bar is present but hidden in the Scheduler snapshot, and the old mAIstro page says "clicking the checkmark next to it"; no schedule row was captured -->

1. On the **Scheduler** tab, select the checkbox at the start of the schedule's row. A bar appears above the list and shows how many items are selected.
2. Select **Delete Schedule**. To leave the list unchanged, select **Cancel** in the same bar.

## Verify

- The new schedule is in the list with the right **Agent**, your text under **Description**, a time under **Next Run (UTC)** that matches what you intended, and **Enabled** showing that it is active.
- After the next run time has passed, **Last Run (UTC)** shows that run.
- Agent runs, with their run ID and runtime, are listed in [mAIstro Logs](/governance/analytics/agent-logs-tokens-cost/).

## Troubleshooting

**The agent runs every minute.** The schedule was saved with the starting expression `* * * * *`. Change it as described in [Change a schedule](#change-a-schedule), or delete the schedule if it is not needed.

**The agent runs at the wrong hour.** The list shows run times in UTC. Convert the time you expect to UTC and compare it with **Next Run (UTC)**; if they differ, update the hour field and check **Next Run (UTC)** again.

**The agent did not run, or stopped running.** NeuralSeek records a scheduled agent that stopped running as an operational failure in the **System Log**, which you open from [Governance](/governance/overview/#usage-system-performance-and-system-log). Check there for the error, then check that:

- the schedule shows as active in **Enabled**;
- the agent shown under **Agent** still exists in your saved agents;
- the agent succeeds when you run it by hand. To see what a run did step by step, use the [Inspector](/maistro/inspector/).

To hear about failures without checking the log, install the **System Log Alert Agent** from the [Agent Marketplace](/maistro/agent-marketplace/). It emails an alert when NeuralSeek records an operational failure, including a scheduled agent that stopped running; you set it up under **Governance** > **System Log** > settings.

## FAQ

### What time zone does a schedule use?

The schedule list shows run times in UTC (**Last Run (UTC)** and **Next Run (UTC)**). After you save, compare **Next Run (UTC)** with the time you meant, converted to UTC, and adjust the cron expression if they differ.

### Why does my scheduled agent run every minute?

A new schedule starts with `* * * * *`, which runs every minute. Replace it with your own expression, or build one with **Edit schedule**, before you select **Save**.

### How do I find out when a scheduled run fails?

Failures of scheduled agents are recorded in Governance's **System Log**. The **System Log Alert Agent** from the Agent Marketplace can email you when one is recorded.

## Related

- [mAIstro overview](/maistro/overview/)
- [Visual editor](/maistro/visual-editor/) — build and save the agent you schedule
- [Run Agents](/maistro/run-agents/) — run an agent on demand
- [Agent Marketplace](/maistro/agent-marketplace/) — ready-made agents, including the System Log Alert Agent
- [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/) — every agent run
- [Governance overview](/governance/overview/)
