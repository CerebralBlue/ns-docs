---
title: "Core concepts"
description: "NeuralSeek's core concepts: Seek answers a question from your KnowledgeBase through an LLM and scores the answer, mAIstro builds agents, KnowledgeBase holds the documents, and Curate is where answers are reviewed and trained — each reached from a label in the console."
---

## What is it

This page explains how the main parts of NeuralSeek fit together, and ties each one to the label you click in the console. There are four ideas to hold on to:

- **Seek** answers a question. It searches your KnowledgeBase, has an LLM write an answer from what it found, and scores that answer.
- **KnowledgeBase** is the set of documents Seek answers from.
- **mAIstro** is where you build agents: LLM-backed routines that generate content or automate tasks, with no code.
- **Curate** is where answers are reviewed, organized and trained after Seek has produced them.

Everything else in the console configures, monitors or extends one of these four.

## Why it matters

Most questions about NeuralSeek come down to "which screen does that?". Each part owns a different piece of the work: the KnowledgeBase holds the documents, Neural Config chooses the LLM and the KnowledgeBase connection, and Curate is where answers are edited and organized. Knowing which part owns which piece tells you which screen to open.

It is the wrong page when you already know which screen you need. It names the settings involved but does not explain their options or effects, so go straight to that screen's own page instead.

## When to use it

Read this page before your first setup, or when you open the console and want to know what each top-level item is for. If you already know the parts and want to try them:

- To ask a first question, follow [Quickstart: Seek](/getting-started/quickstart-seek/).
- To build a first agent, follow [Quickstart: mAIstro](/getting-started/quickstart-maistro/).
- For the product overview, see [What is NeuralSeek](/getting-started/what-is-neuralseek/).

This page is orientation, not configuration. It names the settings involved but leaves them to their own pages.

## How it works

### The navbar: one line per surface

![The NeuralSeek Home screen with the navbar across the top: Home, Neural Config, Seek, KnowledgeBase, mAIstro, NeuralEdit, Governance, Run Agents, Admin Tools and the profile icon](/img/home/default.png)

The navbar runs across the top of every console screen. From left to right:

| Navbar item       | What it is for                                                                                                                              | Read more                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Home**          | The landing page: a video browser and a "Get more value from NeuralSeek" panel of next steps. The NeuralSeek logo also brings you here.     | [What is NeuralSeek](/getting-started/what-is-neuralseek/)                                            |
| **Neural Config** | The configuration screen: which LLM answers, which KnowledgeBase is searched, and how questions are routed.                                 | [Configuration overview](/configuration/overview/)                                                    |
| **Seek**          | Ask a question and get an answer grounded in the KnowledgeBase, with its scores and sources.                                                | [Seek overview](/seek/overview/)                                                                      |
| **KnowledgeBase** | The documents NeuralSeek answers from.                                                                                                      | [Document manager](/knowledge/document-manager/), [Connect a KnowledgeBase](/knowledge/connect-a-kb/) |
| **mAIstro**       | Build agents that generate content, automate tasks and run LLM-backed routines with no code.                                                | [mAIstro overview](/maistro/overview/)                                                                |
| **NeuralEdit**    | An interactive, agent-assisted document creation and editing tool.                                                                          | [NeuralEdit](/maistro/neuraledit/overview/)                                                           |
| **Governance**    | Opens the Governance screen. What it shows is covered on its own page.                                                                     | [Governance overview](/governance/overview/)                                                          |
| **Run Agents**    | A separate page for running mAIstro agents.                                                                                                 | [Run Agents](/maistro/run-agents/)                                                                    |
| **Admin Tools**   | A menu rather than a page. It holds **API's & Integration**, **Data Loader**, **Entity Extraction**, **Chat SDK**, **QA Tools** and **Curate**. | [Integrations overview](/integrations/overview/), [Curation](/seek/curation/)                         |

At the far right, the profile icon (it has no text label) opens your user profile. Users and their permissions are covered in [Users and permissions](/configuration/administration/users-and-permissions/).

Two surfaces this page talks about are **not** navbar items. **Curate** is reached from the **Admin Tools** menu or from the Home tile "Edit, organize, and train Answers on style and content on your Q&A content on the Curate tab". **Analytics** is reached from the Home tile "View Analytics on your content and explore how source coverage and confidence has changed over time".

### The Seek pipeline

![The Seek page after a question: the answer, the Session Options panel, and the first rows of the details table under the answer](/img/home/seek.png)

Click **Seek** in the navbar to ask a question. Under the answer, a details table describes how that answer was produced. Its rows fall into three groups:

- **The KnowledgeBase search.** **KnowledgeBase Results** (how many results came back, and how many were filtered out by Date Penalty or Score Range), **KnowledgeBase Response Time**, **KnowledgeBase Confidence** and **KnowledgeBase Coverage**. The **KnowledgeBase Context** list below the table shows the source URLs that were used, each with a percentage.
- **Intent, category and agents.** **Intent** names the matched intent and links to it in Curate; **Category ID / Answer ID** and **Category Selection Time** describe the category; **Agents Run** names any mAIstro agents that ran for this answer.
- **Scoring and timings.** **Semantic Match** is the answer's score; **Semantic Analysis** is a sentence explaining why the score came out as it did, with a **Statistical Details** link to the numbers behind it. **Prompt Injection Time**, **Scoring Time** and **Total Response Time** are timings.

The table has no row for the LLM itself. Which LLM writes the answer is chosen in **Neural Config**, in the [LLM Details](/configuration/neural-config/llm-details/) section; the KnowledgeBase it searches is chosen in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

Every answer carries these rows along with the sources it drew from. The values belong to the answer in front of you and change from one question to the next.

For a step-by-step walkthrough of the Seek page, see [Quickstart: Seek](/getting-started/quickstart-seek/).

### mAIstro agents

![The Home "Get more value from NeuralSeek" panel, with the tiles for NeuralEdit, Integrate, Seek, Curate, mAIstro and Analytics](/img/home/default--get-more-value-from-neuralseek.png)

An agent is a routine you build in mAIstro. The Home tile describes mAIstro as a place to "Explore mAIstro and generate content, automate tasks, and build LLM-backed routines with no code". Both the **mAIstro** navbar item and the mAIstro link in that tile lead to mAIstro.

Agents meet Seek in two places:

- In **Neural Config**, a category of questions can be sent to Answer Generation (a normal Seek answer) or to a mAIstro agent (mAIstro-led). See [Configuration overview](/configuration/overview/).
- Under a Seek answer, the **Agents Run** row names the agents that ran for that answer and links to them in mAIstro.

**Run Agents** is a separate navbar item for running agents; see [Run Agents](/maistro/run-agents/). To build your first agent, follow [Quickstart: mAIstro](/getting-started/quickstart-maistro/), then read the [mAIstro overview](/maistro/overview/).

### Knowledge bases

![The Seek details table and the KnowledgeBase Context list under an answer, each source URL with its percentage](/img/home/seek--knowledgebase-context.png)

The KnowledgeBase is the set of documents Seek answers from. It is involved in three places in the console:

- **Neural Config** decides which KnowledgeBase is connected, in the [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) section. See [Connect a KnowledgeBase](/knowledge/connect-a-kb/) for the supported types.
- The **KnowledgeBase** navbar item opens the documents themselves. See [Document manager](/knowledge/document-manager/).
- **Data Loader**, in the **Admin Tools** menu, loads documents into it. The whole menu is described in the [Integrations overview](/integrations/overview/); the Data Loader itself in [Loading documents](/knowledge/load/).

Under every Seek answer, the **KnowledgeBase Context** list is where you see the KnowledgeBase at work: each source URL that contributed to the answer, with a percentage.

### The curation lifecycle

![The Curate page: a table of intents with Category, Intent, Q&A, Coverage % and Confidence % columns and a Governance icon on each row, with Add Intent, Filter and Load Q&A in the toolbar](/img/home/curate.png)

Seek produces answers; curation is what you do with them afterwards. Open **Curate** from the **Admin Tools** menu or from its Home tile ("Edit, organize, and train Answers on style and content on your Q&A content on the Curate tab").

The Curate page lists the questions NeuralSeek has answered, grouped by intent. The columns are **Category**, **Intent**, **Q&A**, **Coverage %**, **Confidence %** and **Governance**, and the toolbar has **Add Intent**, **Filter** and **Load Q&A**. From here you edit answers, organize questions into intents and categories, and add your own Q&A. What each control does is covered in [Curation](/seek/curation/).

The loop closes back at Seek. The **Intent** row under a Seek answer links straight to that intent in Curate, so you can go from an answer you do not like to the place where you fix it.

**Analytics**, reached from its Home tile, is the longer view of the same content: the tile describes it as a place to "explore how source coverage and confidence has changed over time".

## FAQ

**Where do I find Curate?**
It is not in the navbar. Open it from the **Admin Tools** menu, from the **Curate** link in the Home tile, or from the **Intent** link under a Seek answer.

**What is the difference between Seek and mAIstro?**
Seek answers one question from your KnowledgeBase and scores the answer. mAIstro builds agents: in the Home tile's words, it lets you "generate content, automate tasks, and build LLM-backed routines with no code". The two meet when a category is routed to a mAIstro agent, and the **Agents Run** row under a Seek answer shows which agents ran.

**Where does NeuralSeek get its answers from?**
From the KnowledgeBase connected in **Neural Config**. The **KnowledgeBase Context** list under each Seek answer shows the source URLs used, each with a percentage.

**How do I see why an answer scored the way it did?**
Look at **Semantic Match** and **Semantic Analysis** in the details table under the answer. **Semantic Analysis** gives a one-sentence explanation, and its **Statistical Details** link shows the numbers behind it.

**What is Run Agents for?**
It is a separate navbar item for running mAIstro agents. See [Run Agents](/maistro/run-agents/).

**Is Admin Tools a page?**
No. **Admin Tools** opens a menu with **API's & Integration**, **Data Loader**, **Entity Extraction**, **Chat SDK**, **QA Tools** and **Curate**.
