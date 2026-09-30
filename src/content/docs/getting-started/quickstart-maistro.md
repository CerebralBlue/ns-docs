---
title: "Quickstart: mAIstro"
description: "Open mAIstro from the NeuralSeek Home page, learn that a first agent is a flow of NTL nodes built around the LLM node, and find the two places agents run: Run Agents and Seek."
---

## What is it

This quickstart takes you from the NeuralSeek Home page to **mAIstro**, the part of the console where you build agents, and then to the places where those agents run. Home describes mAIstro in one line: "Explore **mAIstro** and generate content, automate tasks, and build LLM-backed routines with no code".

An agent in mAIstro is a flow of nodes written in the NeuralSeek Template Language (NTL). The smallest useful agent sends a prompt to a large language model (LLM) and returns what it writes.

## Why it matters

Seek answers questions from your knowledge base. mAIstro is where you go when a question-and-answer exchange is not enough: drafting a document, calling a REST service, looping over records, or posting to another system. The same agents then run in more than one place — from the **Run Agents** page, and from inside a Seek answer — so building one in mAIstro extends what the rest of NeuralSeek can do.

mAIstro is the wrong tool when all you need is an answer drawn from your own content: Seek already does that, and an agent adds a flow you then have to build and maintain.

## When to use it

- Use this page the first time you open mAIstro and want to know where it is, what an agent is made of and where it runs.
- Use [Quickstart: Seek](/getting-started/quickstart-seek/) instead if you only need answers to questions from your own content. Seek does that without building an agent.
- Use the reference pages instead once you are building in earnest: the [NTL overview](/maistro/ntl-overview/) for the language and the [Visual editor](/maistro/visual-editor/) for the editor itself. This quickstart does not document the editor's controls.

If terms like knowledge base, Seek or agent are new to you, read [Concepts](/getting-started/concepts/) first.

## How it works

![The NeuralSeek Home page: the top navigation bar lists Home, Neural Config, Seek, KnowledgeBase, mAIstro, NeuralEdit, Governance, Run Agents and Admin Tools](/img/home/default.png)

Two items in the top navigation bar matter here: **mAIstro**, where agents are built, and **Run Agents**, where they are run.

### Open mAIstro from Home

There are two ways into mAIstro from the Home page:

1. **The navigation bar.** Select **mAIstro**, the fifth item, after **KnowledgeBase**.
2. **The Home tiles.** Scroll to **Get more value from NeuralSeek**. The tile that reads "Explore **mAIstro** and generate content, automate tasks, and build LLM-backed routines with no code" has **mAIstro** as a link to the same page.

![The Get more value from NeuralSeek panel on Home: the Newest features list on the left and, among the tiles on the right, the one that links to mAIstro](/img/home/default--get-more-value-from-neuralseek.png)

The same panel's **Newest features** list shows recent mAIstro additions, including "mAIstro auto-enhance" and "mAIstro breakpoint / step debugger - single-step thru a flow to debug." The list changes as new features ship.

Home also has a video browser. Type "mAIstro" in **Search NeuralSeek videos** to find walkthroughs such as "NeuralSeek: mAIstro - Conditional Logic", "NeuralSeek: mAIstro - Loops" and "NeuralSeek: mAIstro - Rest Integrations". The selection of videos can change over time.

### What an agent is made of

An agent is a flow of NTL nodes. Each node does one job, such as calling an LLM, fetching a web page or querying a database. The NTL reference groups 234 nodes into 31 categories, from Core Flow & Variables and LLM & AI to Agent Orchestration, Control Flow & Loops, Web, REST & Search, Database Connectors, and Seek, Knowledge Base & Governance.

The node that most first agents are built around is `LLM`. The NTL reference describes it as: "Call the configured LLM with a prompt. The primary node for all AI-powered text generation, classification, summarization, and reasoning tasks." The reference gives its syntax as follows; its parameter table also lists a `messages` parameter that this syntax line does not show:

```text
{{ LLM | prompt: "Your prompt here" | cache: "true" | images: "" | modelCard: "" | stream: "false" | maxTokens: "" | minTokens: "" | temperatureMod: "" | toppMod: "" | freqpenaltyMod: "" | timeout: "" }}
```

Two parameters matter for a first agent:

- `prompt` — the instruction for the model. The reference describes it as "A prompt to prepend to the LLM input".
- `modelCard` — "Override the default LLM model".

The rest (token limits, temperature and top-p adjustments, a timeout, caching and streaming) tune how the call behaves. The [NTL overview](/maistro/ntl-overview/) explains the syntax, variables and how nodes chain together.

### Build a first agent

<!-- UNCONFIRMED: the build steps below (add a node in the editor, write the prompt, run the flow, read its output, save the agent) — no captured screen shows the mAIstro editor; from the old mAIstro overview ("point-and-click visual agent editor") -->

The mAIstro editor lets you assemble a flow visually instead of typing NTL by hand. A minimal first agent follows this path:

1. Open **mAIstro** from the navigation bar.
2. Add an `LLM` node to the flow and write your instruction in its prompt.
3. Run the flow and read the model's output.
4. Save the agent under a name, so it can be run later from **Run Agents** or from Seek.

![Screenshot needed — mAIstro editor with an LLM node in the flow and its output after a run](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/editor-first-agent.png — mAIstro (top navigation bar) > the editor with a flow holding one LLM node, its prompt filled in, and the output shown after running the flow. Why: the build steps are a multi-step flow whose intermediate state (node added, prompt set, output visible) cannot be described in a sentence. -->

The editor's own controls are documented on [Visual editor](/maistro/visual-editor/). To see what each node produced while a flow ran, use the [Inspector](/maistro/inspector/).

### Run the agent

This quickstart covers two places where agents run:

- **Run Agents** in the navigation bar opens the page where agents are run. See [Run Agents](/maistro/run-agents/).
- **Seek** can run agents as part of answering a question. When it does, the answer's details table has an **Agents Run** row that names each agent that ran, and the name is a link that opens mAIstro. See [Quickstart: Seek](/getting-started/quickstart-seek/) for the rest of that table.

![A Seek answer with its details table: the Agents Run row names the agent that ran for this answer, and the navigation bar shows Run Agents](/img/home/seek--knowledgebase-context.png)

### Next steps

- [Concepts](/getting-started/concepts/) — how Seek, the knowledge base, mAIstro and the rest of the console fit together.
- [mAIstro overview](/maistro/overview/) — what mAIstro can do beyond a single LLM call.
- [Visual editor](/maistro/visual-editor/) — building flows in the editor.
- [Inspector](/maistro/inspector/) — looking inside a flow as it runs.
- [Agent registry](/maistro/agent-registry/) — the agents saved on your instance.
- [Run Agents](/maistro/run-agents/) — running agents outside the editor.

## FAQ

**Where do I start building an agent?**
Select **mAIstro** in the top navigation bar, or the **mAIstro** link in the "Explore mAIstro…" tile under **Get more value from NeuralSeek** on the Home page. Both open the same page.

**Do I need to write code to build an agent?**
No programming language is required. The Home page describes mAIstro as a way to "build LLM-backed routines with no code". Flows are written in NTL, a template language of nodes such as `{{ LLM | prompt: "…" }}`, and the editor lets you assemble them visually. See the [NTL overview](/maistro/ntl-overview/).

**Where do I run an agent after building it?**
From **Run Agents** in the navigation bar, or through Seek: when Seek runs an agent while answering, the answer's **Agents Run** row names it. See [Run Agents](/maistro/run-agents/).

**Which LLM does an agent use?**
The NTL reference describes the `LLM` node as calling "the configured LLM". Its `modelCard` parameter lets you "Override the default LLM model".

**Can I step through an agent to debug it?**
Home's **Newest features** list includes "mAIstro breakpoint / step debugger - single-step thru a flow to debug." The [Inspector](/maistro/inspector/) page covers looking inside a running flow.

<!-- UNCONFIRMED: mAIstro was formerly called Explore (renamed March 2024) — old changelog; Home's video list still includes a video titled "NeuralSeek: Explore" -->

**Why do some older videos say "Explore" instead of mAIstro?**
mAIstro was previously called Explore, so older walkthroughs, such as the "NeuralSeek: Explore" video on Home, use the earlier name.
