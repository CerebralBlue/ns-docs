---
title: "Quickstart: mAIstro"
description: "Open mAIstro, learn that a first agent is a flow of NTL nodes built around the LLM node, build and run it in the Agent Editor, and find the two other places agents run: Run Agents and Seek."
---

mAIstro is the part of NeuralSeek where you build agents: you generate content, automate tasks and build LLM-backed routines with no code. This quickstart takes you into mAIstro, explains what a first agent is made of, and shows where agents run once they are built.

An agent in mAIstro is a flow of nodes written in the NeuralSeek Template Language (NTL). The smallest useful agent sends a prompt to a large language model (LLM) and returns what it writes. mAIstro is where you go when a question-and-answer exchange is not enough: drafting a document, calling a REST service, looping over records, or posting to another system. When all you need is an answer drawn from your own content, use [Quickstart: Seek](/getting-started/quickstart-seek/) instead — Seek does that without an agent you then have to build and maintain.

## Before you begin

You need access to the console of a NeuralSeek instance. If terms like KnowledgeBase, Seek or agent are new to you, read [Core concepts](/getting-started/concepts/) first. This quickstart does not document the editor's controls; once you are building in earnest, use the [NTL overview](/maistro/ntl-overview/) for the language and the [Visual editor](/maistro/visual-editor/) for the editor.

## Step 1: Open mAIstro

Select **mAIstro** in the navbar, then the **Agent Editor** tab. The **Functions** list on the left holds the nodes you can add; the flow you build appears on the canvas to its right, with the agent's result below it.

![The mAIstro Agent Editor: the Functions list on the left, the tabs Agent Editor, NTL, Marketplace, User Agents, Visualizer, Registry and Scheduler, and a flow of a Text node followed by two suggested nodes, Seek and Seek Output](/img/maistro/seek--agent-editor-flow--crop.png)

## Step 2: Understand what an agent is made of

An agent is a flow of NTL nodes. Each node does one job, such as calling an LLM, fetching a web page or querying a database. The NTL reference groups 234 nodes into 31 categories, from Core Flow & Variables and LLM & AI to Agent Orchestration, Control Flow & Loops, Web, REST & Search, Database Connectors, and Seek, Knowledge Base & Governance.

The node that most first agents are built around is `LLM`. The NTL reference describes it as: "Call the configured LLM with a prompt. The primary node for all AI-powered text generation, classification, summarization, and reasoning tasks." The reference gives its syntax as follows; its parameter table also lists a `messages` parameter that this syntax line does not show:

```text
{{ LLM | prompt: "Your prompt here" | cache: "true" | images: "" | modelCard: "" | stream: "false" | maxTokens: "" | minTokens: "" | temperatureMod: "" | toppMod: "" | freqpenaltyMod: "" | timeout: "" }}
```

Two parameters matter for a first agent:

- `prompt` — the instruction for the model. The reference describes it as "A prompt to prepend to the LLM input".
- `modelCard` — "Override the default LLM model".

The rest (token limits, temperature and top-p adjustments, a timeout, caching and streaming) tune how the call behaves. The [NTL overview](/maistro/ntl-overview/) explains the syntax, variables and how nodes chain together.

## Step 3: Build and run a first agent

<!-- UNCONFIRMED: the build steps below (add a node in the editor, write the prompt, run the flow, read its output, save the agent) — no captured screen shows a first agent being built; from the old mAIstro overview ("point-and-click visual agent editor"). The Run Agent button and the Agent Output area are on the captured editor screen. -->

The Agent Editor lets you assemble a flow visually instead of typing NTL by hand:

1. Add an `LLM` node to the flow and write your instruction in its prompt.
2. Select **Run Agent** at the bottom of the editor. The result appears under **Agent Output**.
3. Save the agent under a name, so it can be run later from **Run Agents** or from Seek.

![Screenshot needed — mAIstro Agent Editor with an LLM node in the flow and its output after a run](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/editor-first-agent.png — mAIstro (navbar) > Agent Editor tab: a flow holding one LLM node with its prompt filled in, after selecting Run Agent, with the model's reply visible under Agent Output (Inline tab). Capture the canvas and the Agent Output area together, not the full page. Why: the build steps are a multi-step flow whose intermediate state (node added, prompt set, output visible) cannot be described in a sentence. -->

The editor's own controls are documented on [Visual editor](/maistro/visual-editor/). To see what each node produced while a flow ran, use the [Inspector](/maistro/inspector/).

## Step 4: Run the agent outside the editor

Once saved, an agent runs in two more places:

- **Run Agents** in the navbar opens the page where people run finished agents without opening mAIstro. See [Run Agents](/maistro/run-agents/).
- **Seek** can run agents as part of answering a question. When it does, the **Agents Run** row in the table under the answer names each agent that ran, as a link that opens it in mAIstro. [Quickstart: Seek](/getting-started/quickstart-seek/) covers the rest of that table.

## Next steps

- [mAIstro overview](/maistro/overview/) — what mAIstro can do beyond a single LLM call.
- [Visual editor](/maistro/visual-editor/) — building flows in the editor.
- [Inspector](/maistro/inspector/) — looking inside a flow as it runs.
- [Agent registry](/maistro/agent-registry/) — the agents saved on your instance.
- [Run Agents](/maistro/run-agents/) — running agents outside the editor.

## FAQ

**Do I need to write code to build an agent?**
No programming language is required. Flows are written in NTL, a template language of nodes such as `{{ LLM | prompt: "…" }}`, and the editor lets you assemble them visually. See the [NTL overview](/maistro/ntl-overview/).

**Where do I run an agent after building it?**
In the editor with **Run Agent**, from **Run Agents** in the navbar, or through Seek: when Seek runs an agent while answering, the answer's **Agents Run** row names it. See [Run Agents](/maistro/run-agents/).

**Which LLM does an agent use?**
The NTL reference describes the `LLM` node as calling "the configured LLM". Its `modelCard` parameter lets you "Override the default LLM model".

**Can I step through an agent to debug it?**
A breakpoint / step debugger that single-steps through a flow is among the newest mAIstro features. The [Inspector](/maistro/inspector/) page covers looking inside a running flow.

<!-- UNCONFIRMED: mAIstro was formerly called Explore (renamed March 2024) — old changelog; Home's video list still includes a video titled "NeuralSeek: Explore" -->

**Why do some older videos say "Explore" instead of mAIstro?**
mAIstro was previously called Explore, so older walkthroughs, such as the "NeuralSeek: Explore" video, use the earlier name.

## Related

- [Core concepts](/getting-started/concepts/)
- [Quickstart: Seek](/getting-started/quickstart-seek/)
- [mAIstro overview](/maistro/overview/)
- [NTL overview](/maistro/ntl-overview/)
