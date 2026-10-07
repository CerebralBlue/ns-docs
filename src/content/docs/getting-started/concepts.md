---
title: "Core concepts"
description: "NeuralSeek's core concepts: Seek answers a question from your KnowledgeBase through an LLM and scores the answer, the KnowledgeBase holds the documents, mAIstro builds agents, Curate is where answers are reviewed and trained, and Governance reports on and guards every answer and agent run."
---

This page explains how the main parts of NeuralSeek fit together, for anyone setting up an instance or deciding which part of the console to open. There are five ideas to hold on to:

- **Seek** answers a question. It searches your KnowledgeBase, has an LLM write an answer from what it found, and scores that answer.
- **KnowledgeBase** is the set of documents Seek answers from.
- **mAIstro** is where you build agents: LLM-backed routines that generate content or automate tasks, with no code.
- **Curate** is where answers are reviewed, organized and trained after Seek has produced them.
- **Governance** is where you see how confident and safe answers are, what agents are doing and what it all consumes — and, through the guardrails, what NeuralSeek is allowed to accept and answer.

Everything else in the console configures, monitors or extends one of these five.

## Why it matters

Most questions about NeuralSeek come down to "which part does that?". Each part owns a different piece of the work: the KnowledgeBase holds the documents, Neural Config chooses the LLM and the KnowledgeBase connection, Curate is where answers are edited and organized, and Governance is where you check the result. Knowing which part owns which piece tells you where to go.

## When to use it

Read this page before your first setup, or when you want to know what each part of the console is for. If you already know the parts and want to try them:

- To ask a first question, follow [Quickstart: Seek](/getting-started/quickstart-seek/).
- To build a first agent, follow [Quickstart: mAIstro](/getting-started/quickstart-maistro/).
- For the product overview, see [What is NeuralSeek](/getting-started/what-is-neuralseek/).

## How it works

### The Seek pipeline

![The Seek page after a question: the answer, the Session Options panel, and the first rows of the details table under the answer](/img/home/seek.png)

Seek takes a question, searches the KnowledgeBase, and has an LLM write the answer from what it found. Under the answer, a details table describes how that answer was produced. Its rows fall into three groups:

- **The KnowledgeBase search.** **KnowledgeBase Results** (how many results came back, and how many were filtered out by Date Penalty or Score Range), **KnowledgeBase Response Time**, **KnowledgeBase Confidence** and **KnowledgeBase Coverage**.
- **Intent, category and agents.** **Intent** names the matched intent and links to it in Curate; **Category ID / Answer ID** and **Category Selection Time** describe the category; **Agents Run** names any mAIstro agents that ran for this answer.
- **Scoring and timings.** **Semantic Match** is the answer's score; **Semantic Analysis** is a sentence explaining why the score came out as it did, with a **Statistical Details** link to the numbers behind it. **Prompt Injection Time**, **Scoring Time** and **Total Response Time** are timings.

Which LLM writes the answer is chosen in **Neural Config**, in the [LLM Details](/configuration/neural-config/llm-details/) section; the KnowledgeBase it searches is chosen in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). The values in the table belong to the answer in front of you and change from one question to the next.

For a step-by-step walkthrough of the Seek page, see [Quickstart: Seek](/getting-started/quickstart-seek/).

### Knowledge bases

![The KnowledgeBase Context list under a Seek answer: each source URL with its percentage](/img/home/seek--knowledgebase-context--crop.png)

The KnowledgeBase is the set of documents Seek answers from. It is involved in three places:

- **Neural Config** decides which KnowledgeBase is connected, in the [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) section. See [Connect a KnowledgeBase](/knowledge/connect-a-kb/) for the supported types.
- **KnowledgeBase** in the navbar opens the documents themselves. See [Document manager](/knowledge/document-manager/).
- **Data Loader** loads documents into it. See [Loading documents](/knowledge/load/).

Under every Seek answer, the **KnowledgeBase Context** list is where you see the KnowledgeBase at work: each source URL that contributed to the answer, with a percentage.

### mAIstro agents

![A mAIstro agent in the Agent Editor: input Text nodes, a Protect, Profanity Filter and Remove PII chain, a Condition that stops blocked messages, a mAIstro Sandbox node, and a Send To LLM node whose output is stored in a variable](/img/maistro/agent-editor--nodes.png)

An agent is a routine you build in mAIstro, as a flow of nodes: each node does one job, such as sending a prompt to the LLM, running Seek or calling a REST service. You assemble the flow in the **Agent Editor** from the **Functions** list, or write it in NTL, the NeuralSeek Template Language.

Agents meet Seek in two places:

- In **Neural Config**, a category of questions can be sent to Answer Generation (a normal Seek answer) or to a mAIstro agent (mAIstro-led). See [Configuration overview](/configuration/overview/).
- Under a Seek answer, the **Agents Run** row names the agents that ran for that answer and links to them in mAIstro.

People who do not build agents run them from [Run Agents](/maistro/run-agents/). To build your first agent, follow [Quickstart: mAIstro](/getting-started/quickstart-maistro/), then read the [mAIstro overview](/maistro/overview/).

### The curation lifecycle

![The Curate page: a table of intents with Category, Intent, Q&A, Coverage % and Confidence % columns and a Governance icon on each row, with Add Intent, Filter and Load Q&A in the toolbar](/img/home/curate.png)

Seek produces answers; curation is what you do with them afterwards. The Curate page lists the questions NeuralSeek has answered, grouped by intent, with the coverage and confidence of each. From here you edit answers, organize questions into intents and categories, and add your own Q&A. What each control does is covered in [Curation](/seek/curation/).

The loop closes back at Seek. The **Intent** row under a Seek answer links straight to that intent in Curate, so you can go from an answer you do not like to the place where you fix it.

### Governance

![The Seek Governance Overview dashboard: Semantic Confidence, Question Resolution, Hate, Abuse, Profanity Block, Prompt Injection, Prompt Injection Action and Questions containing PII](/img/governance/overview.png)

Governance is where you check how your instance is behaving, across every answer and agent run rather than one at a time. It gathers its figures from the traffic your instance already handles — questions answered through Seek, Chat and the API, and agent runs — and organizes them into dashboards:

- **Seek Governance** reports on answers. Its **Overview** shows how confident answers are, how many questions were answered rather than falling below your minimum confidence, and what the safety checks caught: hate, abuse and profanity, prompt injection, and personal data (PII). Further dashboards cover semantic scores, intents, documentation, logs and model comparison.
- **mAIstro Governance** reports on agent runs, in dashboards such as **Agent Insights**, **Agent Timeline**, **mAIstro Logs** and **Agent Task Manager**.
- **Custom Governance** holds dashboards you build yourself, from panels driven by your own mAIstro agents.
- **Usage**, **System Performance** and **System Log** report on the instance as a whole.

![The Seek Governance Token Insights dashboard: Total Tokens, Total Token Cost, Input Tokens per Seek, Generated Tokens per Seek, Cost per 1k Seeks and Token Generation per Second](/img/governance/token-insights.png)

Both Seek and mAIstro Governance have their own **Token Insights** and **Cost Insights**, so you can follow what answers and agents consume separately.

Governance reports; the **guardrails** act. They are set in Neural Config: some screen the user's question before the KnowledgeBase lookup and the LLM call (prompt injection, PII, profanity, too-short or too-long questions), others check the generated answer (semantic scoring, attribution protection, warning and minimum confidence), and custom governance connects your own mAIstro agents to both sides. Change a guardrail, then come back to Governance to see its effect.

To start, read the [Governance overview](/governance/overview/), then [Reading the dashboards](/governance/analytics/reading-the-dashboards/) for filters and date ranges, and the [Guardrails overview](/governance/guardrails/overview/) for what each protection does.

## FAQ

**Where do I find Curate?**
Open it from the **Admin Tools** menu, from the **Curate** link in its Home tile, or from the **Intent** link under a Seek answer.

**What is the difference between Seek and mAIstro?**
Seek answers one question from your KnowledgeBase and scores the answer. mAIstro builds agents that generate content, automate tasks and run LLM-backed routines. The two meet when a category is routed to a mAIstro agent, and the **Agents Run** row under a Seek answer shows which agents ran.

**Where does NeuralSeek get its answers from?**
From the KnowledgeBase connected in **Neural Config**. The **KnowledgeBase Context** list under each Seek answer shows the source URLs used, each with a percentage.

**How do I see why an answer scored the way it did?**
Look at **Semantic Match** and **Semantic Analysis** in the details table under the answer. **Semantic Analysis** gives a one-sentence explanation, and its **Statistical Details** link shows the numbers behind it.

**Where do I stop NeuralSeek from answering certain questions?**
In the guardrails, in Neural Config — not in Governance, which only reports what happened. See the [Guardrails overview](/governance/guardrails/overview/).

## Related

- [What is NeuralSeek](/getting-started/what-is-neuralseek/)
- [Seek overview](/seek/overview/)
- [mAIstro overview](/maistro/overview/)
- [Curation](/seek/curation/)
- [Governance overview](/governance/overview/)
- [Guardrails overview](/governance/guardrails/overview/)
