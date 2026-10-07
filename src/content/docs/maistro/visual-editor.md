---
title: "Visual editor"
description: "The mAIstro Agent Editor is a canvas where you build an agent from nodes in a function library, run it from the run bar, and save it as an agent; the same flow is available as NTL text on the NTL tab."
---

The visual editor is the **Agent Editor** tab of mAIstro. You build an agent by adding nodes from a function library to a canvas. Each node is one step, such as fetching a webpage, sending content to an LLM, cleaning JSON or sending an email, and the arrows between the cards show the order in which data flows. Behind the canvas, the flow is written in [NTL](/maistro/ntl-overview/), so you can switch between the cards and the text whenever one is easier to work with. If you are building your first agent, start with the [mAIstro quickstart](/getting-started/quickstart-maistro/). This page explains the editor parts and controls that the quickstart uses.

## How the visual editor works

### The editor at a glance

![The Agent Editor tab: the function library on the left, three nodes on the canvas, the Agent Output area and the run bar at the bottom](/img/maistro/seek.png)

The tab has three working areas:

- **The function library** on the left lists every node you can add, grouped by category.
- The canvas at the top holds your flow. Each node appears as a card.
- The run bar along the bottom runs, saves, imports and clears the flow.

Between the canvas and the run bar, **Agent Output:** shows the result of the last run in several formats. The output tabs and the **Inspector** are covered on [Inspector](/maistro/inspector/).

Three controls sit at the top of the library:

- **Toggle function library** shows or hides the library, so that you can give the canvas more room while you work on a large flow.
- **Search functions** filters the node list by name. With more than twenty categories, searching is usually faster than browsing when you already know which node you want.
- **LLM:** selects which of the LLMs configured on your instance the editor uses. You add LLMs to the list in [LLM Details](/configuration/neural-config/llm-details/).

The **NTL** tab, next to **Agent Editor**, shows the same agent as NTL text.

### The function library

Nodes are grouped into collapsible categories. Select a category to expand it, then select a node to add it to the canvas. Most categories have a node reference page, linked in the table.

![The Multi-Agent category expanded in the function library, listing its nodes from LLM Plan to End Loop](/img/maistro/multi-agent-panel.png)

| Category                     | What its nodes do                                                                                                                                                                                                                           | Node reference                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Recent**                   | The nodes you added most recently, so you can add them again.                                                                                                                                                                              | —                                                                                                                                                                                                                                                                                                |
| **Most Used**                | The nodes you use most often.                                                                                                                                                                                                               | —                                                                                                                                                                                                                                                                                                |
| **Upload Data**              | Files that your agents work with. The category header shows how many files are stored and their total size. Its nodes are Use Document, Upload Document, Upload & OCR and Delete Document.                                                  | [Upload Data](/maistro/ntl/upload-data/)                                                                                                                                                                                                                                                         |
| **Patterns**                 | Ready-made groups of connected nodes: **Plan & Act** and **Create JSON** (see [Add nodes and patterns](#add-nodes-and-patterns)).                                                                                                           | —                                                                                                                                                                                                                                                                                                |
| **Generate Data**            | Send content to an LLM, and generate images, video, speech and documents (text, CSV, HTML, PowerPoint, Excel, Word, PDF). Also includes Table Understanding and Mathematical Equation.                                                     | [Generate Data](/maistro/ntl/generate-data/)                                                                                                                                                                                                                                                     |
| **Get Data**                 | Bring content into the flow: fixed text, KB documentation, a Seek answer, a REST call, a webpage, or the links on a page.                                                                                                                   | [Get Data](/maistro/ntl/get-data/)                                                                                                                                                                                                                                                               |
| **Custom Connectors**        | The custom connectors saved on your instance.                                                                                                                                                                                               | —                                                                                                                                                                                                                                                                                                |
| **Local Cache**              | Read, write, list, search (including phonetic search) and delete entries in a local cache.                                                                                                                                                  | [Local Cache](/maistro/ntl/local-cache/)                                                                                                                                                                                                                                                         |
| **Extract Data**             | Gather data, extract entities, keywords or grammar, and run OCR.                                                                                                                                                                            | [Extract Data](/maistro/ntl/extract-data/)                                                                                                                                                                                                                                                       |
| **Instance Data**            | Read data about your own instance: its agents, users, Seek users and mAIstro users, and its packed configuration.                                                                                                                           | [Charts and telemetry](/maistro/ntl/charts-and-telemetry/)                                                                                                                                                                                                                                       |
| **NeuralSeek KnowledgeBase** | Search, add and delete documents in the NeuralSeek [managed knowledge base](/knowledge/managed-knowledgebase/overview/).                                                                                                                     | —                                                                                                                                                                                                                                                                                                |
| **Charting & Graphs**        | Area, line, bar, pie, doughnut and bubble charts.                                                                                                                                                                                           | [Charts and telemetry](/maistro/ntl/charts-and-telemetry/)                                                                                                                                                                                                                                       |
| **Multimedia**               | Take frames from video, transform media with FFmpeg, join media, and merge audio and video.                                                                                                                                                 | [Multimodal](/maistro/ntl/multimodal/)                                                                                                                                                                                                                                                           |
| **Multi-Agent**              | Plan and act with an LLM, call other agents, pick an agent from a [registry](/maistro/agent-registry/), connect over [a2a](/maistro/ntl/integrations/a2a/) or [MCP](/maistro/ntl/integrations/mcp/), write and test NTL, save agents, and loop over agents.                                                    | [Multi-Agent](/maistro/ntl/multi-agent/)                                                                                                                                                                                                                                                         |
| **Control Flow**             | Variables, loops, conditions, delays, rate limits, stopping a flow, comments, and streaming a string to the client.                                                                                                                         | [Control Flow](/maistro/ntl/control-flow/)                                                                                                                                                                                                                                                       |
| **RAG Tools**                | The building blocks of the Seek pipeline, such as Curate, Categorize, Query Cache and Semantic Score, plus the In/Out hook nodes such as Seek - In, Seek - Out and NeuralEdit - In.                                                        | [RAG Tools](/maistro/ntl/rag-tools/) · [Pipeline hooks](/maistro/ntl/pipeline-hooks/)                                                                                                                                                                                                            |
| **GuardRails**               | Protect, identify and remove PII, filter profanity, detect AI-written text, score sentiment and action risk, and apply HTTP guardrails.                                                                                | [GuardRails](/maistro/ntl/guardrails/)                                                                                                                                                                                                                                                           |
| **System Variables**         | Date, time, a UUID, a random number, and your instance's categories and intents.                                                                                                                                                            | [System Variables](/maistro/ntl/system-variables/)                                                                                                                                                                                                                                               |
| **Sandboxes**                | Run JavaScript or Python code, or use the Agentic Harness.                                                                                                                                                                                  | [Sandboxes](/maistro/ntl/sandboxes/)                                                                                                                                                                                                                                                             |
| **Convert Files**            | Convert to HTML, HTML to Markdown, Markdown to HTML, and RSS to Markdown.                                                                                                                                                                   | —                                                                                                                                                                                                                                                                                                |
| **Modify Data**              | Reshape content: JSON and XML tools, code and text cleaners, string operations, compression, and transforms such as summarize and translate.                                                                                                | [JSON](/maistro/ntl/modify-data/json-toolbox/) · [XML](/maistro/ntl/modify-data/xml-toolbox/) · [Code](/maistro/ntl/modify-data/code-toolbox/) · [String](/maistro/ntl/modify-data/string-toolbox/) · [Transform](/maistro/ntl/modify-data/transform/)                                         |
| **Send Data**                | Send the result out: REST, Send Email (SMTP), Parse Email and Create Email.                                                                                                                                                                  | [Send Data](/maistro/ntl/send-data/)                                                                                                                                                                                                                                                             |
| **Integrations**             | Databases, ElasticSearch, watsonx Discovery and Watson Discovery, Sharepoint, Box, SFTP, JWT, Jira, Trello, Github, calendars, email, file stores, Slack and more.                                                                           | [Databases](/maistro/ntl/integrations/databases/) · [Knowledge bases](/maistro/ntl/integrations/knowledgebases/) and the other pages under Integrations                                                                                                                                         |

Some nodes, such as Agent Loop and End Loop, appear in more than one category.

### Add nodes and patterns

To add a node, select it in the function library. It appears on the canvas as a card that shows the node's name and a one-line description. For example, a Text node reads "Insert Text". The controls on each card are described under [Node cards](#node-cards).

A pattern adds several connected nodes in one step, as a starting point for a common job:

- **Plan & Act** adds LLM Plan ("Create an LLM plan") chained to LLM Act ("Execute an LLM plan"). One LLM writes a plan and the next step carries it out.
- **Create JSON** adds Send To LLM ("Send all previous content to a LLM"), Extract Code ("Remove everything except code from a string of markdown") and JSON Tools ("Cleanse and Filter JSON"). Use it when an LLM should return JSON that the rest of the flow can parse.

![The canvas after Plan & Act: an LLM Plan card chained to an LLM Act card](/img/maistro/plan-act-panel.png)

### Type-ahead suggestions

As you build, the editor can suggest the nodes that usually come next. While it works one out, a small round wand badge appears in the top-right corner of the node card; its label is "Type-ahead is running". The suggestion appears on the canvas as ghost nodes, which are dashed cards tagged **Suggested**. A **Type-ahead suggestion** bar tells you how many nodes it suggests.

![The Type-ahead suggestion bar: 2 suggested nodes, with Accept suggestion and Dismiss](/img/maistro/seek-panel.png)

Review the ghost nodes before you apply them, because they are the editor's guess about your flow:

- To add the suggested nodes to your flow, select **Accept suggestion** or press Ctrl/⌘ + Enter.
- To discard them, select **Dismiss** or press Esc.

The first image on this page shows an example. With a Text node on the canvas, selecting **Seek** in **Get Data** brought back two suggested nodes: Seek, holding `<< name: question >>`, and Seek Output, holding `<< name: answer >>`. Not every node you add produces a suggestion.

### Stack and chain nodes

<!-- UNCONFIRMED: the terms "chain" and "stack"; stacked nodes run top to bottom with each output available to the nodes below; chained nodes feed one node's output straight into the next — old visual-editor page -->

Arrows between the cards show how data moves through the flow. An arrow across joins a node to the next one in a chain. An arrow down starts a stack below it.

![Five node cards: LLM Plan chained to LLM Act, and below it Send To LLM chained to Extract Code and JSON Tools](/img/maistro/create-json-panel.png)

Stacked nodes run in order from top to bottom, and each one's output is available to the nodes that follow. Chained nodes pass one node's output directly into the next. In the example, LLM Plan and LLM Act form one chain, and Send To LLM, Extract Code and JSON Tools form a second chain stacked below it.

### Node cards

Each card on the canvas carries the controls for that node.

![A Text node card on the canvas, with its name, its description and the gear icon on the right](/img/maistro/text-panel.png)

<!-- UNCONFIRMED: the gear icon opens the node's settings, where its parameters are edited — old visual-editor page ("click to edit") -->

- **The gear icon** on the right of the card opens the node's settings, where you set its parameters.
- **Toggle breakpoint** marks the node as a breakpoint, so that a run stops there. Stepping through a run is covered on [Inspector](/maistro/inspector/).
- **Pin at this node** pins the run at this node.

<!-- UNCONFIRMED: Pin at this node relates to Import Pin (pin → export .pin.dat → import) — inferred from the labels and the Import Pin tooltip -->

A pinned run appears to be what **Import Pin** in the run bar restores.

### The run bar

The run bar along the bottom of the tab holds the controls that act on the whole flow. Most of them are icon buttons, and each one names itself when you hover over it.

![The Agent Editor with an empty canvas; the run bar runs along the bottom, from Run Agent to the Stream and Auto-Enhance switches](/img/maistro/agent-editor.png)

| Control                   | What it does                                                                                                                                                                                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Run Agent**             | Runs the flow on the canvas. The result appears under **Agent Output:**. To read a run node by node, see [Inspector](/maistro/inspector/).                                                                                                                                                                |
| **Undo** / **Redo**       | Undoes or redoes your last change on the canvas.                                                                                                                                                                                                                                                          |
| **Generate Agent**        | The wand button. It shares its name with the generator that builds an agent from a short description of the use case, described on [mAIstro overview](/maistro/overview/).                                                                                                                                               |
| **Semantic Details**      | Opens the semantic score details of the last output. Semantic scoring is explained on [Semantic model](/configuration/semantic-model/).                                                                                                                                                                   |
| **Save**                  | Saves the flow as an agent. Saved agents are listed on the **User Agents** tab (see [mAIstro overview](/maistro/overview/)).                                                                                                                                                                              |
| **Import Pin**            | Its tooltip reads "Import Pin (.pin.dat) — restores a paused agent run. For regular agents use User Templates → Import." It loads a paused run from a `.pin.dat` file. To import an ordinary exported agent, use **Import** on the **User Agents** tab instead.                                       |
| **Generate OpenApi Spec** | Generates an OpenAPI specification for the agent. The button stays greyed out while you build a new, unsaved flow.                                                                                                                                                                                                  |
| **Clear**                 | Clears the canvas so that you can start a new flow.                                                                                                                                                                                                                                                       |
| **User Id**               | An optional user id to pass with the run.                                                                                                                                                                                                                                                                 |
| **Stream**                | Turns streaming of the run's output on or off. Inside a flow, the Stream a string node in **Control Flow** sends text to the client while streaming is on. To stream the agent plan across your instance, see [Platform Preferences](/configuration/neural-config/platform-preferences/).                |
| **Auto-Enhance**          | Turns automatic enhancement on or off. When it is off, the switch reads "Enhance Disabled".                                                                                                                                                                                                               |

## When to use the visual editor

- **You are building a flow and want to see its steps.** The canvas shows each step, what it does and in which order it runs. The function library also lets you discover which nodes exist before you know their NTL names.
- **You are adjusting an agent someone else built.** A flow is easier to follow as cards and arrows than as text.
- **You would rather write the flow as text.** Use the **NTL** tab. It holds the same agent, and the [NTL overview](/maistro/ntl-overview/) explains the language.
- **You do not want to start from an empty canvas.** Describe the use case to **Generate Agent**, or start from a template in the [Agent Marketplace](/maistro/agent-marketplace/), then refine the result here.

## FAQ

### Do I have to connect nodes by hand?

No. Selecting a node in the library adds it to the flow on the canvas. Patterns add several connected nodes at once, and type-ahead may suggest the next nodes, which you can keep with **Accept suggestion** or discard with **Dismiss**.

### Where is my agent after I save it?

On the **User Agents** tab of mAIstro, with the other agents saved on your instance. See [mAIstro overview](/maistro/overview/).

### Can I see the NTL behind my flow?

Yes. Open the **NTL** tab, which shows the same agent as text. The language is described in the [NTL overview](/maistro/ntl-overview/).

### Can I use Import Pin to import an agent someone sent me?

No. **Import Pin** restores a paused agent run from a `.pin.dat` file. To import an agent, use **Import** on the **User Agents** tab.

## Related

- [mAIstro quickstart](/getting-started/quickstart-maistro/): build and run a first agent, step by step.
- [NTL overview](/maistro/ntl-overview/): the language behind every flow.
- [Inspector](/maistro/inspector/): read a run's output and step through it node by node.
- [mAIstro overview](/maistro/overview/): the mAIstro tabs, saved agents and Generate Agent.
- [Agent Marketplace](/maistro/agent-marketplace/): templates to start from.
- [LLM Details](/configuration/neural-config/llm-details/): add the LLMs the editor can use.
