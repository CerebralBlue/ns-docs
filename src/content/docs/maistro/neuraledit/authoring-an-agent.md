---
title: "Authoring a NeuralEdit agent"
description: "NeuralEdit runs a mAIstro agent: load a NeuralEdit agent from the mAIstro Marketplace, or build one that begins with the NeuralEdit - In node, then save it and check which agent NeuralEdit uses."
---

What the [NeuralEdit](/maistro/neuraledit/overview/) assistant does with your request is defined by a [mAIstro](/maistro/overview/) agent. The NeuralEdit screen shows which agent it is running. To change what the assistant does, you can load a ready-made NeuralEdit agent from the [mAIstro Marketplace](/maistro/agent-marketplace/), or build your own flow in the Agent Editor ([visual editor](/maistro/visual-editor/)) that starts from the NeuralEdit input node. Start from the Marketplace when one of its agents already does the job, or when you want a working example to adapt. Build from scratch when your editing workflow needs steps that none of the ready-made agents has.

## Start from a NeuralEdit agent in the Marketplace

1. In the top navigation, select **mAIstro**, then select the **Marketplace** tab.
2. Under **Categories**, select **NeuralEdit**. The list then shows only the agents in the NeuralEdit category.
3. Select an agent's card (**View details →**) to open its details. To load the agent from there, see [Agent Marketplace](/maistro/agent-marketplace/).

![The mAIstro Marketplace tab, with the NeuralEdit chip in the Categories row](/img/maistro/marketplace-panel.png)

Each card carries a **Ready to use** or **Starter template** badge; [Agent Marketplace](/maistro/agent-marketplace/) explains what each means.

The catalogue changes over time; the NeuralEdit category includes agents such as these:

| Agent                    | Badge            | What the card says                 |
| ------------------------ | ---------------- | ---------------------------------- |
| NeuralEdit Excel Chat    | Ready to use     | "Edit files with the excel plugin" |
| NeuralEdit File Editor   | Ready to use     | "Edit files in neuralEdit"         |
| Save as a Powerpoint Doc | Ready to use     | "Save as a Powerpoint Doc"         |
| Save as a Word Doc       | Ready to use     | "Save as a Word Doc"               |
| Save as an HTML Doc      | Ready to use     | "Save as an HTML Doc"              |
| NeuralEdit Excel Assist  | Starter template | "Edit files with the excel plugin" |

## Begin the flow with the NeuralEdit input node

To build your own agent, start the flow with the node that brings the NeuralEdit request into the agent.

1. In **mAIstro**, select the **Agent Editor** tab.
2. In the **Functions** library on the left, expand **RAG Tools**. You can also type the node name in **Search functions**.
3. Select **NeuralEdit - In**. It is listed between **post KBA agent - Out** and **Seek - In**. Selecting a node in the library adds it to the canvas.

![Screenshot pending: the RAG Tools group of the Functions library, showing NeuralEdit - In](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/rag-tools--neuraledit-in.png — mAIstro > Agent Editor > Functions > RAG Tools expanded, cropped so the list reaches NeuralEdit - In (the current crop stops at Personalization - Out). Why: the node sits far down a long list. -->

The NeuralEdit input node brings the NeuralEdit request into the flow. It belongs to a family of In and Out nodes in **RAG Tools** that connect an agent to a NeuralSeek feature, for example **Personalization - In** and **Personalization - Out**, **Virtual KB - In** and **Virtual KB - Out**, **post KBA agent - In** and **post KBA agent - Out**, **Seek - In** and **Seek - Out**, and **Custom Governance In** and **Custom Governance Out**. See also [Pipeline hooks](/maistro/ntl/pipeline-hooks/) and [RAG Tools](/maistro/ntl/rag-tools/).

## Build, test and save the agent

After the input node, add the steps that do the work. Then run the agent and save it so NeuralEdit can use it.

1. Add the nodes that follow the input node. For example, add **Seek** (in **Get Data**) to answer from your KnowledgeBase, or **Send to LLM** (in **Generate Data**) to pass the content to an LLM. [Visual editor](/maistro/visual-editor/) explains how to add, stack and chain nodes.
2. Select **Run Agent** to run the flow, and check the result under **Agent Output:** below the canvas. [Running and inspecting an agent](/maistro/inspector/) explains how to read the output and look inside the run.
3. Select **Save** to save the flow as an agent. Saved agents are listed on the **User Agents** tab, described in the [mAIstro overview](/maistro/overview/).

To read or edit the same agent as text, open the **NTL** tab. The syntax is described in the [NTL overview](/maistro/ntl-overview/).

## Verify which agent NeuralEdit runs

1. In the top navigation, select **NeuralEdit**.
2. Read the status row under the editor toolbar. **Agent:** is followed by the name of the agent NeuralEdit is running. The status row and the editor toolbar are described in [Editing and reviewing](/maistro/neuraledit/editing-and-reviewing/).

![The NeuralEdit status row, showing the current file, the download buttons and Agent: default](/img/home/item--current-file.png)

<!-- UNCONFIRMED: the agent NeuralEdit runs is chosen in the NeuralEdit Settings dialog — the NeuralEdit Settings button exists on the NeuralEdit screen, but no capture has opened it -->

If **Agent:** shows a different agent from the one you saved, select **NeuralEdit Settings** and choose your agent.

The Console API has operations named **Select NeuralEdit Category/Agent**, **Get NeuralEdit Config** and **Save NeuralEdit Config**. They are listed in [REST and Console API](/integrations/rest-and-console-api/).

## FAQ

### Where is the NeuralEdit input node?

In mAIstro, on the **Agent Editor** tab. Expand the **RAG Tools** group of the **Functions** library and select **NeuralEdit - In**.

### Do I have to build a NeuralEdit agent from scratch?

No. The **NeuralEdit** category on the mAIstro **Marketplace** tab has ready-to-use agents, such as **NeuralEdit File Editor**. It also has starter templates, such as **NeuralEdit Excel Assist**, that you can adapt.

### Does the Console API have NeuralEdit operations?

It lists operations named **Select NeuralEdit Category/Agent**, **Get NeuralEdit Config** and **Save NeuralEdit Config**. See [REST and Console API](/integrations/rest-and-console-api/) for each one.

## Related

- [NeuralEdit overview](/maistro/neuraledit/overview/)
- [Editing and reviewing](/maistro/neuraledit/editing-and-reviewing/)
- [Context files](/maistro/neuraledit/context-files/)
- [Visual editor](/maistro/visual-editor/)
- [Agent Marketplace](/maistro/agent-marketplace/)
- [Pipeline hooks](/maistro/ntl/pipeline-hooks/)
