---
title: "Red Team Testing"
description: "Automated adversarial testing of a single mAIstro agent — planned and graded by agents, scored across five attack categories, with recommended mitigations for anything it finds."
---

## What is it

Automated adversarial testing for one agent at a time. NeuralSeek plans a set of adversarial
test inputs for the agent, runs every one against the real agent, and grades the results — all
using built-in mAIstro agents, not a human red team.

## Why it matters

This is one of the few places in the product that actively tries to break an agent rather than
just monitoring it. It gives you a scored, repeatable security assessment per agent, with
concrete risks and recommended mitigations, instead of relying on guessing what an adversarial
user might try.

## When to use it

- Before promoting an agent that's exposed to end users or external input.
- Periodically, on agents that handle sensitive data or actions (database writes, external
  calls), to catch drift as the agent's prompt or tools change.
- After a Red Team finding — re-run the test to confirm a fix actually closed the gap.

## How it works

1. **Select an agent** from the search box, then click **Run Test**.
2. NeuralSeek runs the assessment in stages, visible as progress states while it works:
   **Starting → Gathering Agent Information → Collected Agent → (Describing Agent) → Planning Red
   Team Tests → Running Tests → Grading Tests.**
   - If the agent's description is shorter than 30 characters, NeuralSeek first auto-describes it
     using a built-in agent, so the test planner has something to work with.
   - A built-in planning agent designs a set of adversarial test inputs for *this specific agent*,
     based on its name, description, and parameters.
   - Every planned test runs against the real agent, in parallel.
   - A built-in grading agent reviews the plan and every output, and produces the final report.
3. **Test Results** shows:
   - **Overall score** — a single security-assessment score for the run.
   - **Summary** — a written overview of the assessment.
   - **Test categories** — the five fixed categories this run checked, each pass/fail:
     **Prompt Injection · Data Exfiltration · SQL Injection · Unauthorized Access · Service
     Disruption**.
   - **Risks** — the vulnerabilities the run identified.
   - **Recommended strategies** — suggested mitigations for each finding.
   - **Test logs** — the raw exchanges from the run, so you can verify a finding yourself.
4. Reports are retained per agent — the **most recent 30** runs are kept; older ones are dropped.
5. Use the **Test run** selector to switch between past assessments for the same agent.

### What it costs

Every stage of a run — planning, each individual test, and grading — is a real, billable
LLM/agent execution (it calls `logFeatureUsage` at each step). A test suite against a heavy agent
is not free: budget for roughly *plan + one call per test + review*.

### Test Logs need Corporate Logging

The **Test logs** panel only has content if **Corporate Logging** is enabled on the instance.
With it off, the logs field reads *"Corporate logging is not enabled"* instead of the actual
exchanges. With it on, each stage (plan, every individual test, and the review) gets a **Replay**
link so you can re-open the exact exchange. See
[Real-time logging](/ns-docs/governance/logging/) for enabling Corporate Logging.

## Acting on findings

Each category points at a different mitigation:

| Category | Where to act |
|---|---|
| Prompt Injection | The Prompt Injection guardrail |
| Data Exfiltration / Unauthorized Access | [Custom Governance](/ns-docs/governance/custom-governance/) access design + HTTP-request guardrails on outbound calls |
| SQL Injection | Parameterize the agent's database nodes — never build SQL from raw input |
| Service Disruption | Timeout limits, max-length limits, and sandboxing the agent's execution |

## FAQ

### Does the test run against production data?

It runs the *real* agent, not a simulated copy — so yes, tests execute against whatever
knowledge base and connections the agent is actually wired to in production. Plan accordingly if
the agent can take real actions (writes, external calls).

### How many reports does NeuralSeek keep per agent?

The most recent 30. Older reports are dropped as new ones are generated.

### Can I schedule Red Team Testing to run automatically?

Not from this page directly — runs are started manually per agent. If you need recurring
assessments, trigger them the same way you'd schedule any other agent run. *(Verify against your
version if you rely on a specific automation path.)*

### What counts as a "failure" in a category?

The grading agent reviews the plan and every test output and marks each of the five categories
pass or fail based on whether any test in that category succeeded in exploiting the agent. The
per-category detail in **Risks** explains what specifically triggered a fail.
