---
title: "Running and inspecting an agent"
description: "Run a mAIstro agent from the editor, read its result in the Agent Output views, preview the documents it writes, and open the Inspector to look inside the run."
---

Building an agent is a loop: change a node, run the flow, check what came back. This page covers the checking half — running the agent from the mAIstro editor, reading its result in each **Agent Output:** view, previewing the Word, PDF, CSV or PowerPoint files it writes, and opening the **Inspector** when the final output is not enough and you need to see what happened inside the run. Building the flow itself — the canvas, the node cards and the run bar — is covered in [Visual editor](/maistro/visual-editor/).

## Run an agent and read its output

1. In **mAIstro**, open the agent on the **Agent Editor** tab. To open an agent you saved earlier, load it from [User Agents](/maistro/overview/).
2. Select **Run Agent** at the left of the run bar (its tooltip reads "Evaluate"). The run bar's other settings — **User Id**, **Stream** and **Auto-Enhance** — change how the run is made; they are explained in [The run bar](/maistro/visual-editor/#the-run-bar).
3. Read the result under **Agent Output:**, between the canvas and the run bar. **Inline** is selected by default and shows the output rendered.
4. To see the same result another way, select another tab in the **Agent Output:** row.

![The Agent Editor with the Agent Output tabs Inline, Raw, Text, HTML, Microsoft Word, PDF, CSV and PPT above the output box, and the run bar with Run Agent, User Id, Stream and Auto-Enhance along the bottom](/img/maistro/agent-editor.png)

<!-- UNCONFIRMED: Raw shows the output unrendered, Text as plain text, HTML as HTML — inferred from the tab labels next to Inline; the tabs were never opened in a capture -->

The first four tabs are views of the same result: rendered (**Inline**), unrendered as the agent returned it (**Raw**), as plain **Text**, or as **HTML**. Switch to **Raw** when the rendered view hides what you need to check — markup, line breaks or the exact characters a downstream system will receive.

The **NTL** tab has the same **Agent Output:** row and the same **Run Agent** button, so an agent written as code is run and read exactly the same way. See [NTL overview](/maistro/ntl-overview/).

## Preview a document an agent creates

When an agent's job is to produce a file — a report as a Word document, a PDF, a CSV extract or a slide deck — you check the file itself, not only the text output.

1. Build the flow with a document-writing node from the **Generate Data** category, such as **Write Word Doc**, **Write PDF**, **Write PowerPoint** or **Write Doc (txt, csv, html)**. Each node is described in [Generate Data](/maistro/ntl/generate-data/).
2. Select **Run Agent**.
3. Under **Agent Output:**, select the tab for the format:

<!-- UNCONFIRMED: each format tab previews the file the matching document-writing node produced — pairing inferred from the tab and node names; the tabs were never opened in a capture -->

| Tab                | Previews the file written by                         |
| ------------------ | ---------------------------------------------------- |
| **Microsoft Word** | **Write Word Doc**                                   |
| **PDF**            | **Write PDF**                                        |
| **CSV**            | **Write Doc (txt, csv, html)**, writing a CSV file   |
| **PPT**            | **Write PowerPoint**                                 |

Checking the preview before you schedule or share the agent saves a round trip: a broken table or an empty slide shows up here, not in the inbox of whoever receives the file.

## Open the Inspector

**Agent Output:** shows only where the run ended. To see how it got there — which node produced what — open the Inspector.

1. Run the agent with **Run Agent**.
2. Select **Inspector**, the bug icon at the top right of the editor, at the end of the tab row that starts with **Agent Editor**.

![The mAIstro editor with a Text node and two suggested nodes on the canvas; the Inspector bug icon sits at the top right, after the Scheduler tab](/img/maistro/seek.png)

<!-- UNCONFIRMED: what the three Inspector tabs show (Step Inspector: the run node by node; Timeline: where the run's time went, per node; Variable Inspector: the variables the run set), and that a run stopped at a breakpoint is stepped here — inferred from the tab names in the page markup; the panel was never opened in a capture -->

The mAIstro Inspector panel has three tabs: **Step Inspector** walks through the run node by node, **Timeline** shows where the run's time went for each node, and **Variable Inspector** lists the variables the run set. Use **Timeline** when an agent is slow and you need to know which call to optimise, and **Variable Inspector** when a node received a value you did not expect.

To stop a run at a particular node and pick it up later, use **Toggle breakpoint** and **Pin at this node** on the node card and **Import Pin** in the run bar, all described in [Node cards](/maistro/visual-editor/#node-cards).

## Run with a different input

While testing, you often want to try the agent on an input other than the one the flow normally receives — an edge case, a long document, an empty question.

<!-- UNCONFIRMED: the editor can run the agent with an override input typed into a "Set agent Override Input" dialog, and asks for declared parameters in a "Set agent Parameters" dialog, both started with Evaluate — dialog titles and their Cancel/Evaluate buttons are in the editor's page markup; how each dialog opens was never captured -->

The editor can run the agent with an input you type: the Set agent Override Input dialog takes the input, and **Evaluate** runs the agent with it. An agent that declares [input parameters](/maistro/ntl-overview/#variables) at the top of its NTL — `<< name: varName, prompt: true, desc: "description" >>` — has their values asked for in a Set agent Parameters dialog, which also runs the agent with **Evaluate**.

## Runs outside the editor

Agents also run outside the editor: from a dashboard panel on [Run Agents](/maistro/run-agents/), which shows the run's progress there, and at set times through the [Agent Scheduler](/maistro/agent-scheduler/).

## Verify

- After **Run Agent**, the box under **Agent Output:** holds the result. It stays empty until the agent has run.
- For an agent that writes a file, check the format tab that matches the file — see [Preview a document an agent creates](#preview-a-document-an-agent-creates).
- When the output is wrong but you cannot tell which node caused it, open the **Inspector** — see [Open the Inspector](#open-the-inspector).

## FAQ

### Where do I see what my agent returned?

Under **Agent Output:**, between the canvas and the run bar, once you have selected **Run Agent**. **Inline** is selected by default and shows the result rendered; for the other views, see [Run an agent and read its output](#run-an-agent-and-read-its-output).

### Does an agent written in NTL show its output the same way?

Yes. The **NTL** tab has the same **Agent Output:** tabs and the same **Run Agent** button as the **Agent Editor** tab.

## Related

- [Visual editor](/maistro/visual-editor/): build the flow, and the run bar settings **User Id**, **Stream** and **Auto-Enhance**.
- [NTL overview](/maistro/ntl-overview/): write an agent as code and run it from the **NTL** tab.
- [Generate Data](/maistro/ntl/generate-data/): the nodes that write Word, PDF, PowerPoint and text files.
- [Run Agents](/maistro/run-agents/): dashboards whose panels run agents.
- [Agent Scheduler](/maistro/agent-scheduler/): run an agent at set times.
- [mAIstro overview](/maistro/overview/): where agents are built, saved and reused.
