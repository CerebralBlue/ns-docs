---
title: "Red team testing"
description: "Run an automated red team test against one mAIstro agent and read its security assessment: an overall score, five attack categories, the risks found, recommended mitigations and the test logs."
---

Red team testing attacks one of your [mAIstro agents](/maistro/overview/) on purpose and reports how well it held up. Where the [NTL guardrail nodes](/maistro/ntl/guardrails/) defend an agent at run time and the Governance dashboards watch it in production, this page actively tries to break it, then gives you an overall score, a result for five attack categories, the risks it found, recommended mitigations and the evidence behind them. Run it before you expose an agent to end users or untrusted input, and again after you change the agent's prompt, tools or connections, so a fix is confirmed rather than assumed.

## Before you begin

- You need at least one mAIstro agent. The page tests one agent at a time.
- Red team tests are billed. The **Usage** page in Governance lists **Red Team Tests** as a billing source of its own, next to mAIstro and Seek, so you can see what your test runs consumed.
<!-- UNCONFIRMED: planning the tests, running each test and grading them are each billable runs — stub gap and the earlier draft page, not shown on any screen -->
- A test is several billable runs, not one: the tests are planned, each test is run against the agent, and the results are graded.
<!-- UNCONFIRMED: the tests run against the real agent and whatever knowledge base and connections it uses — earlier draft page, not observed (no test was run) -->
- The tests run against the real agent, with the knowledge base and connections it is wired to. If the agent can write to a database or call external services, plan the test for a time and a target where that is acceptable.

## Run a red team test on an agent

1. Go to **Governance** and, in the left navigation under **mAIstro Governance**, select **Red Team Testing**.

   ![The Red Team Testing page: the Agent picker and Run Test at the top, the status line "Select an agent to begin testing.", and the Test Results report with Overall score, Summary and Test categories, empty until an agent is selected](/img/governance/red-team-testing.png)

2. In the **Agent** box, start typing the agent's name to search for it (the box reads "Search agents..."), or select **Show agents**, the arrow at the end of the box, to open the full list.

3. Select the agent in the list. The list, headed "Select an agent" with a count of your agents, shows every agent on the instance as its name with "Agent" under it.

   ![The open agent list under the Agent picker: one row per agent, each with an initials badge, the agent name and the word Agent](/img/governance/show-agents-panel.png)

4. Select **Run Test**. The button stays disabled, and the line under the picker reads "Select an agent to begin testing.", until you have chosen an agent.

## Open a previous test run

To choose which assessment the **Test Results** report shows, pick the agent and then one of its test runs.

1. Select the agent in **Agent**, as in the steps above. The **Test run** picker, at the right of the **Test Results** heading, is disabled and reads "Select a test" until you do.
<!-- UNCONFIRMED: the Test run list holds the selected agent's earlier runs, and the report panels fill with the selected run — inferred from the "Assessment details for the selected agent and test run" subtitle and the earlier draft page; no run was loaded in the capture -->
2. Open **Test run** and select the run you want. The list holds the assessments already run for that agent, so you can compare a run before a fix with the run after it. The report panels below the heading fill with the selected run.

## Read the test results

The report has six parts. Before an agent and a run are loaded, each shows its empty state.

- **Overall score** — "Security assessment". A single score for the selected run; it shows `--` until a run is loaded.
- **Summary** — "Overview of the latest red team assessment". A written overview of the assessment. Empty, it reads "No results loaded yet. Select an agent to view the assessment summary."
- **Test categories** — "Security checks performed during the selected assessment". One card per attack category, each with a status badge and a result line. With nothing loaded, every card shows `UNKNOWN` and "No result reported."
- **Risks** — "Potential vulnerabilities identified by the assessment". Empty, it reads "No risks to display."
- **Recommended strategies** — "Suggested mitigations and security improvements". Empty, it reads "No strategies to display."
- **Test logs** — "Detailed output and evidence from the selected test". The output and evidence behind the results, so you can check a finding yourself. Empty, it reads "No logs to display."

The five categories are named after well-known attack types. In general security terms they mean:

| Category                | What the attack type tries to do                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prompt Injection**    | Smuggle instructions into the input that override the agent's own instructions. Inside an agent, the **Protect** node in [NTL guardrails](/maistro/ntl/guardrails/) defends against it. |
| **Data Exfiltration**   | Get the agent to reveal data it should keep to itself, such as documents, configuration or other users' information.                                                                |
| **SQL Injection**       | Get crafted input into a database query the agent builds, to read or change data the query was not meant to touch.                                                                    |
| **Unauthorized Access** | Get the agent to perform an action or reach a resource the user is not entitled to.                                                                                                   |
| **Service Disruption**  | Make the agent hang, loop, fail or consume excessive resources, so it stops serving other requests.                                                                                    |

Read **Risks** and **Recommended strategies** together: the first says what the assessment found, the second what to change. To harden the agent itself, the [NTL guardrail nodes](/maistro/ntl/guardrails/) add checks inside its flow. After you change the agent, run the test again to confirm the risk is gone.

## Troubleshooting

- **Run Test is greyed out.** No agent is selected. Choose one in **Agent**; the button enables once the status line no longer reads "Select an agent to begin testing."
- **Test run is greyed out and shows only "Select a test".** The picker lists runs for the selected agent, so it stays disabled until you choose an agent.
<!-- UNCONFIRMED: Test logs need Corporate Logging; without it the logs read "Corporate logging is not enabled" — stub gap and the earlier draft page, message not captured -->
- **Test logs is empty.** Test logs need Corporate Logging on the instance. With it off, the panel reads "Corporate logging is not enabled" instead of the output. To turn it on, see [Corporate Logging](/governance/logging/).

## FAQ

### Can I test several agents at once?

No. The page assesses the one agent selected in **Agent**. To test another agent, select it and select **Run Test** again.

### Which agents can I test?

Any mAIstro agent on your instance. The list behind **Show agents** shows all of them, with a count in its header.

### Do red team tests cost anything?

Yes. They are billed, and the **Usage** page in Governance shows them as their own billing source, **Red Team Tests**, so you can track them separately from your agents' everyday mAIstro and Seek usage.

## Related

- [mAIstro overview](/maistro/overview/) — build and change the agents you test here.
- [NTL guardrails](/maistro/ntl/guardrails/) — the nodes that defend an agent against prompt injection at run time.
- [Prompt injection](/governance/guardrails/prompt-injection/) — the same protection for Seek answers.
- [Corporate Logging](/governance/logging/) — send NeuralSeek traffic to your own audit log store.
- [Agent insights and details](/governance/analytics/agent-insights-and-details/) — how the agent behaves in everyday use.
- [mAIstro logs, tokens and cost](/governance/analytics/agent-logs-tokens-cost/) — the agent's runs and what they cost.
- [Reading the Governance dashboards](/governance/analytics/reading-the-dashboards/) — the other Governance screens.
