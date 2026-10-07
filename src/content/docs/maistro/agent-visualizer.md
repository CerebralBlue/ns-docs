---
title: "Agent Visualizer"
description: "The mAIstro Visualizer draws the calls between your saved agents as a graph of boxes and arrows, so you can see what calls an agent and what it calls before you change it."
---

The Visualizer is a call graph of your mAIstro agents. Each agent that calls or is called by another agent is a box, and each call from one agent to another is an arrow. It answers the question that matters before you change, rename or delete an agent: **what calls this agent, and what does it call?** To see what happens inside a single agent, use the [Agent Editor](/maistro/visual-editor/) instead.

## How the Visualizer works

To open it, go to **mAIstro** and select the **Visualizer** tab. Agent search and the list of your agents are in the left rail; the graph fills the canvas.

The graph is built from the [agents you have saved](/maistro/overview/). An arrow appears where one agent calls another, which is how you split work across agents in a [multi-agent flow](/maistro/ntl/multi-agent/).

### Find an agent

![The Visualizer tab: the search boxes, View All, Fit and the Agents list on the left, the call graph on the right](/img/maistro/visualizer.png)

On a large set of agents, narrow the view before you read it. The left rail has three search boxes, each identified by its placeholder:

<!-- UNCONFIRMED: what each search box matches — read from its placeholder; no search was typed in the capture -->

| Search box              | What it searches                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Search agents...**    | Agent names.                                                                                                         |
| **NTL contains...**     | The text of each agent's [NTL](/maistro/ntl-overview/) — use it to find every agent that uses a node, secret or URL. |
| **Name starts with...** | The beginning of the agent name — useful when your agents share a naming prefix.                                     |

Below them:

<!-- UNCONFIRMED: View All restores every agent after a search or focus, and Fit fits the whole graph into the view — inferred from the button labels, not exercised in the capture -->

- **View All** shows every agent again after you have searched or focused on one.
- **Fit** zooms the graph so all of it fits in the canvas.
- **Agents** is a collapsible list of your agents. Each entry shows the agent's name and a number, and the list is sorted by that number, highest first.

<!-- UNCONFIRMED: the number next to each agent counts the other agents it is linked to (callers plus callees) — counted from the captured graph, not stated on screen -->

The number counts the other agents an agent is linked to, in either direction, so the agents at the top of the list are the ones the most other agents depend on or that depend on the most others. Those are the ones to check first before a change.

### Read the graph

![The call graph with its legend: solid arrows for direct calls, dashed arrows for conditional calls, and ×N labels on repeated edges](/img/maistro/visualizer-panel.png)

The graph reads left to right in call order: an agent's callers sit to its left and the agents it calls sit to its right. Agents that nothing calls start the chains on the left; agents that call nothing end them on the right.

The legend in the corner of the canvas explains the marks:

| Legend entry                       | What it tells you                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Calls (direct flow)**            | A solid arrow: a call in the calling agent's direct flow, not inside a condition.                                   |
| **Conditional call (if condition)** | A purple dashed arrow: the call sits inside an if condition, so it happens only when that condition is met.               |
| **Cycle — recursive call back**    | An orange dashed arrow that leads back to an agent earlier in the chain, so the agents call each other in a loop.                |
| **↺ Self-recursive agent**         | The agent calls itself.                                                                                             |
| **×N Called ×N times on same edge** | The calling agent calls the same agent N times, for example **×2** or **×4** on the arrow.                          |
| **Currently focused agent**        | Marks the agent currently in focus.                                                                                 |

The legend also has states for a running, completed and failed agent: **Agent running**, **Agent completed** and **Agent error**. A cycle or a self-recursive agent is worth a closer look before you run it; to follow a single run step by step, use the [Inspector](/maistro/inspector/).

## When to use the Visualizer

Use the Visualizer for questions about how agents relate to each other, and the [Agent Editor](/maistro/visual-editor/) for questions about what one agent does. The Agent Editor shows the nodes inside one agent; the Visualizer shows which agents call which across all of them.

Typical uses:

- **Before you change or delete an agent**, find it on the graph and look at the arrows pointing into it. Each one is an agent that calls it and will be affected by the change.
- **Find agents no other agent calls.** An agent with no arrows pointing into it runs only when someone or something starts it directly. If you no longer start it either, it is a candidate for clean-up.
- **Find every agent that uses a node, secret or URL** by typing it into **NTL contains...**, for example before you rotate a secret or retire an endpoint.
- **Understand a multi-agent flow you did not build.** Start from the agent on the left of a chain and follow the arrows to see the order the work is handed on.

To change a call, open the calling agent in the Agent Editor. When an agent chooses which agent to run from a list at run time, that list is managed in the [Agent Registry](/maistro/agent-registry/).

## Related

- [Agent Editor](/maistro/visual-editor/) — build and edit what happens inside one agent.
- [Multi-Agent](/maistro/ntl/multi-agent/) — the nodes that call one agent from another.
- [NTL overview](/maistro/ntl-overview/) — the language the **NTL contains...** search reads.
- [Agent Registry](/maistro/agent-registry/) — groups of agents an agent can choose from at run time.
- [mAIstro overview](/maistro/overview/) — where your saved agents live.
- [Running and inspecting an agent](/maistro/inspector/) — follow one run step by step.
