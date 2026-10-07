---
title: "What is NeuralSeek"
description: "NeuralSeek answers questions from your own KnowledgeBase with a large language model, shows the sources and scores behind each answer, lets you curate and govern those answers, and builds no-code LLM agents in mAIstro."
---

NeuralSeek answers questions from your organization's own content. You connect a **KnowledgeBase**,
ask a question, and NeuralSeek has a large language model (LLM) write the answer from the passages
it retrieved — then shows you which sources those passages came from and how far to trust the
result. Around that core sit the tools to improve answers over time (**Curate**), to watch how
answers and agents behave (**Governance**), to configure the whole pipeline (**Neural Config**), and
to build LLM-backed routines without code (**mAIstro**). This page is for anyone deciding whether
NeuralSeek fits a use case, or starting out with it.

## Why it matters

An LLM on its own answers from what it learned in training, and you cannot see where an answer came
from. NeuralSeek answers from your documents instead, and puts the evidence next to every answer:

- **Answers you can trace.** Each answer on **Seek** lists the KnowledgeBase documents it was built
  from, with a percentage for how much each one matched, and a set of scores for the answer itself.
- **Answers you can correct.** On **Curate** you edit, organize and train answers on style and
  content, so a wrong or weak answer is fixed once rather than every time it is asked.
- **Answers you can audit.** **Governance** reports how confident and safe answers are, what the
  guardrails caught, what agents did and what tokens and usage you consume.

## When to use it

- **Answers for a virtual agent.** Your chatbot handles the scripted intents; NeuralSeek answers the
  long tail from your documentation. See [What can we connect to?](/integrations/overview/).
- **Internal knowledge search.** Employees ask questions on **Seek** and get an answer with its
  sources, instead of searching a document library.
- **Content and automation.** **mAIstro** generates content, automates tasks and runs LLM-backed
  routines; **NeuralEdit** is an agent-assisted editor for documents.

NeuralSeek is the wrong tool when the answer is not written down anywhere: it answers from your
KnowledgeBase, so load or fix the content first.

## How it works

![The Seek page after a question: the answer with provenance highlights, the Session Options panel, and the first rows of the scores table](/img/home/seek.png)

1. **Your content.** The [KnowledgeBase](/knowledge/ingestion-overview/) holds the documents
   NeuralSeek answers from. [Neural Config](/configuration/overview/) chooses which KnowledgeBase is
   connected and which LLM writes the answers.
2. **A question.** A person on the **Seek** page, a virtual agent, or a call to the API asks it.
   NeuralSeek searches the KnowledgeBase and has the LLM write an answer from what it found.
3. **The answer and its evidence.** The answer comes back with the source documents behind it and
   scores such as **Semantic Match**, **KnowledgeBase Confidence** and **KnowledgeBase Coverage**.
   [Guardrails](/governance/guardrails/overview/) screen the question and the answer on the way.
4. **Improve and monitor.** [Curation](/seek/curation/) is where answers are edited and trained;
   [Governance](/governance/overview/) reports on answers and agent runs over time.
5. **Go beyond question and answer.** [mAIstro](/maistro/overview/) builds agents — flows of nodes
   that call the LLM, fetch data, call REST services or run Seek — and those agents can run on their
   own or as part of an answer.

How these pieces fit together is explained in [Core concepts](/getting-started/concepts/). To see it
working, ask a first question with [Quickstart: Seek](/getting-started/quickstart-seek/) or build a
first agent with [Quickstart: mAIstro](/getting-started/quickstart-maistro/).

### Where to start in the console

The first screen after sign-in is **Home**. Its **Get more value from NeuralSeek** panel collects
the next steps — integrating with a virtual agent, asking on Seek, curating, exploring mAIstro and
NeuralEdit, and the community — and its **Newest features** list names recent additions; the full
history is in the [changelog](/reference/changelog/).

![The Get more value from NeuralSeek panel: Newest features on the left, the next-step tiles on the right](/img/home/default--get-more-value-from-neuralseek.png)

### Deployment and plans

For where NeuralSeek can run, see [Deployment](/reference/deployment/). For plans and how to sign
up, see [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).

## FAQ

**Where do I ask a question?**
On **Seek** in the navbar. The answer comes with its scores and the list of source documents it was
built from. [Quickstart: Seek](/getting-started/quickstart-seek/) walks through a first question.

**Where do I build agents?**
In **mAIstro**, where you generate content, automate tasks and build LLM-backed routines with no
code. Start with [Quickstart: mAIstro](/getting-started/quickstart-maistro/).
[Run Agents](/maistro/run-agents/) is where people use finished agents without opening mAIstro.

**How do I connect NeuralSeek to my virtual agent?**
The supported platforms and how each connects are in
[What can we connect to?](/integrations/overview/).

**How do I check that answers are safe and accurate?**
Each answer shows its sources and scores on **Seek**. For the view across all answers and agent
runs, use [Governance](/governance/overview/); to change what NeuralSeek blocks or warns about, use
the [Guardrails](/governance/guardrails/overview/).

**Where can I get help?**
The **community** link on Home opens the NeuralSeek community. For a support and development
subscription, see [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).

## Related

- [Core concepts](/getting-started/concepts/)
- [Quickstart: Seek](/getting-started/quickstart-seek/)
- [Quickstart: mAIstro](/getting-started/quickstart-maistro/)
- [Governance overview](/governance/overview/)
- [What can we connect to?](/integrations/overview/)
