---
title: "mAIstro overview"
description: "mAIstro is the NeuralSeek screen where you build, save, browse, schedule and inspect agents — flows of nodes that are also written as NTL — and the starting point for every mAIstro page."
---

mAIstro is where you build agents in NeuralSeek, and where you save, browse, schedule and inspect them. An agent is a flow of nodes — get data, send it to an LLM, transform it, write a file, call another system — that you assemble on a visual canvas, and that is also written as [NTL (NeuralSeek Template Language)](/maistro/ntl-overview/) text. This page is for admins and developers opening mAIstro for the first time: it explains how the screen is organised, how to start an agent from a one-sentence description, and how to manage the agents saved on your instance, and it points to the page that covers each part in depth.

## How mAIstro works

### Agents, nodes and NTL

You build an agent from functions. The left rail of the screen, headed **Agent builder / Functions**, is the function library: more than 20 categories of nodes, from **Get Data** and **Generate Data** to **GuardRails**, **Multi-Agent** and **Integrations**. Adding a node places it in the flow on the canvas; the category list and how to connect nodes are on [Visual editor](/maistro/visual-editor/).

Every agent exists in two forms at once. The canvas shows it as connected nodes; the **NTL** tab shows the same agent as text. You can build in either and switch between them, so you never have to write NTL to build an agent — but reading it is the quickest way to see exactly what an agent does.

### The mAIstro screen

![The mAIstro screen with the Registry tab open: the function library on the left with Search functions and the LLM selector, and the tab bar along the top — Agent Editor, NTL, Marketplace, User Agents, Visualizer, Registry and Scheduler](/img/maistro/registry.png)

Open **mAIstro** from the top navigation. The tab bar across the top switches between the parts of the screen; each tab has its own page:

- **Agent Editor** — the visual canvas where you build a flow. See [Visual editor](/maistro/visual-editor/).
- **NTL** — the same agent as NTL text. See [NTL overview](/maistro/ntl-overview/).
- **Marketplace** — pre-built agents and starter templates you can load and adapt. See [Agent Marketplace](/maistro/agent-marketplace/).
- **User Agents** — the agents saved on your instance. Covered [below](#user-agents--your-saved-agents).
- **Visualizer** — a graph of your agents and the agents they call. See [Agent Visualizer](/maistro/agent-visualizer/).
- **Registry** — named pools of agents an agent can choose from at run time. See [Agent Registry](/maistro/agent-registry/).
- **Scheduler** — runs a saved agent on a schedule. See [Agent Scheduler](/maistro/agent-scheduler/).

Three parts of the screen stay with you while you build:

- The **function library** on the left, with **Search functions** to find a node by name and the **LLM:** selector for the model your LLM nodes use. Hide it with **Toggle function library** when you need room on the canvas.
- The run bar along the bottom of the editor: **Run Agent** runs the flow, **Save** stores it as a user agent, **Stream** turns streaming of the run's output on or off, and **Auto-Enhance** turns automatic enhancement on or off. Visual editor explains each of them.
- The **Agent Output:** tabs, which show the result as Inline, Raw, Text, HTML, Microsoft Word, PDF, CSV or PPT, and the **Inspector** button, which opens a step-by-step trace of the last run. See [Inspector](/maistro/inspector/).

### Start from a description: the start dialog

![The start dialog over the Marketplace tab: the heading "Describe a usecase to auto-generate a new single agent", a text box with an example request, the Generate Agent button, and four tiles — NeuralSeek AI Agent Marketplace, User Agents, Documentation & Learning Labs and Take the Tour!](/img/maistro/default.png)

When you open mAIstro, a dialog headed **Describe a usecase to auto-generate a new single agent** offers the fastest ways in. Use it when you know what the agent should do but not yet which nodes it needs:

1. In the text box, describe what you want to build in a sentence or two — for example, "Grab todays news headlines from yahoo and then determine what the top trending story is."
2. Select **Generate Agent**. NeuralSeek mocks up an agent from your description.

Treat the generated agent as a starting point, not a finished one: check each node's settings, run it, and adjust it before you save it. The editor has its own **Generate Agent** button for the same job once you are already on the canvas.

The tiles under the text box take you elsewhere instead:

- **NeuralSeek AI Agent Marketplace** — opens the **Marketplace** tab, when a ready-made agent is closer to what you need than a blank canvas.
- **User Agents** — opens the agents already saved on your instance (the **User Agents** tab, below).
- **Documentation & Learning Labs** — points to learning material about building agents.
- **Take the Tour!** — starts a guided tour of the mAIstro screen.

To go straight to the screen, close the dialog with ×.

### User Agents — your saved agents

![The User Agents tab: the Your agents header "Manage your saved agents", the search box with Clear and Import, the agent count and selection count, Select visible, Clear selection, and the Export and Delete buttons](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/user-agents--toolbar.png — mAIstro > User Agents tab: crop from the "YOUR AGENTS" header down to the Select visible / Clear selection / Export / Delete row, with no agent cards. Why: the readers need the search, Import and selection toolbar; the saved agent cards show instance-specific demo descriptions. -->


The **User Agents** tab, headed **Manage your saved agents**, lists every agent saved on this NeuralSeek instance. An agent you store with **Save** in the editor appears here, as a card with a **Saved agent** badge, its save date, its category and its description. These are the agents you can add to an agent registry on the **Registry** tab, which attaches user agents to a named pool.

**Find and open an agent.** Type in the search box (it searches agent names, descriptions and capabilities); select **Clear** to show every agent again. Select **View details →** on a card to see the agent's details, and load it from there into the editor to run or change it.

**Work on several agents at once.** The line above the cards shows how many agents are listed and how many are selected. Select agents with the checkbox on each card, or select **Select visible** to select every agent the current search shows — search first to narrow the list, then select them all in one step. **Clear selection** clears it.

- **Export** exports the selected agents, so you can keep a copy outside the instance. It is available once at least one agent is selected.
- **Import** brings agents into this instance.
- **Delete** removes the selected agents from the instance. It is available once at least one agent is selected; export anything you may need again first.

**Import** on this tab is for saved agents. A paused agent run saved as a `.pin.dat` file is restored from the editor's run bar instead.

### Where mAIstro settings live

The settings that apply to every agent on the instance are on the Neural Config screen, not in mAIstro:

- [mAIstro Configuration](/configuration/neural-config/maistro-configuration/) registers external marketplaces, so their agents can be loaded from the **Marketplace** tab.
- [Platform Preferences](/configuration/neural-config/platform-preferences/) holds **mAIstro Stream Plan** (whether the agent plan is streamed while an agent runs), **mAIstro Save Agent** (an agent that runs whenever a mAIstro agent is saved) and **mAIstro flow** (the agent used for context detection).

Credentials a flow needs, such as API keys for a connector, belong in [Secrets](/configuration/neural-config/secrets/) rather than in the agent itself, and the models an LLM node can choose from come from [LLM Details](/configuration/neural-config/llm-details/). Who may open mAIstro is set in [Users and permissions](/configuration/administration/users-and-permissions/).

## When to use mAIstro

Use mAIstro when an answer is not enough and the work has steps:

- Combining sources — the [KnowledgeBase](/knowledge/ingestion-overview/), a website, a database, an uploaded document — before an LLM writes the result.
- Producing a file rather than a chat answer: a Word document, a PDF, a spreadsheet, a slide deck.
- Connecting NeuralSeek to other systems through the integration nodes, or calling an external API.
- Automating a recurring job on the **Scheduler** tab, or splitting a large job across several agents that call each other.
- Running an agent after every Seek answer, or whenever an agent or the configuration is saved, through the hooks in Platform Preferences. How to build an agent for these hooks is on [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

It is the wrong tool when you only need questions answered from your documents: [Seek](/seek/overview/) does that without building anything. If the people who will use an agent should not see the editor at all, build it here and give them a [Run Agents](/maistro/run-agents/) dashboard. To write and revise long documents with AI help, use [NeuralEdit](/maistro/neuraledit/overview/), which is driven by a mAIstro agent.

## FAQ

### Do I have to write NTL to build an agent?

No. Build on the **Agent Editor** canvas, or describe the agent in the start dialog and select **Generate Agent**. The **NTL** tab shows the same agent as text whenever you want to read or edit it directly.

### Where do agents I save end up?

On the **User Agents** tab, where you can search, open, import, export and delete them.

### Can I start from a ready-made agent?

Yes. The **Marketplace** tab lists ready-to-use agents and starter templates; load one, then adapt it in the editor.

## Related

- [Visual editor](/maistro/visual-editor/) — the canvas, the function library and the run bar
- [NTL overview](/maistro/ntl-overview/) — the text form of every agent
- [Agent Marketplace](/maistro/agent-marketplace/) — ready-made agents and starter templates
- [Agent Registry](/maistro/agent-registry/) — pools of agents chosen at run time
- [Agent Visualizer](/maistro/agent-visualizer/) — how your agents call each other
- [Agent Scheduler](/maistro/agent-scheduler/) — run an agent on a schedule
- [Inspector](/maistro/inspector/) — trace a run step by step
- [Run Agents](/maistro/run-agents/) — dashboards that run agents for other users
- [NeuralEdit overview](/maistro/neuraledit/overview/) — the AI document editor driven by an agent
- [Quickstart: mAIstro](/getting-started/quickstart-maistro/) — build your first agent step by step
