---
title: "Agent Registry"
description: "An agent registry is a named pool of saved mAIstro agents that the Select Agent and Select Agent Plan nodes choose from at run time; you list and create registries on the mAIstro Registry tab."
---

An agent registry is a named, described pool of saved agents. Instead of hard-coding which agent a flow calls, you point the flow at a registry and let it pick the agent, or an ordered plan of agents, that fits the request at run time. This page covers the **Registry** tab in [mAIstro](/maistro/overview/), where you list and create registries. For the nodes that select from a registry, see [Agent Registry node](/maistro/ntl/agent-registry/).

## How it works

A registry does nothing on its own. It becomes useful when a flow contains one of the selection nodes and names the registry to choose from.

### How a flow picks an agent from a registry

![The Multi-Agent category of the function library, listing Select Agent, Select Agent Plan and Agent Loop among its nodes](/img/maistro/multi-agent-panel.png)

The selection nodes sit in the **Multi-Agent** category of the function library, next to the other [Multi-Agent nodes](/maistro/ntl/multi-agent/) such as **Use Agent** and **Use Agent (sandbox)**:

- **Select Agent** selects a single agent from a registry to accomplish a task.
- **Select Agent Plan** selects an ordered list of agents to accomplish a task.
- **Agent Loop** loops through an agent plan. It must be used with **Select Agent Plan**.

Both selection nodes take the same three inputs: the registry to select from, the query used to choose the right agent or agents, and the LLM that makes the choice. In NTL, Select Agent looks like this:

```text
{{ selectAgent | registry: "..." | query: "..." | modelCard: "..." }}
```

<!-- UNCONFIRMED: Select Agent returns the name of the best-fitting agent, which the flow then runs (for example with Use Agent) — old node page maistro/ntl/agent-registry -->

The flow then runs the agent it was given. Because the choice happens at run time, you can add a new specialist agent to the registry and the flows that select from it start considering that agent, without editing them. You build those flows in the [Visual editor](/maistro/visual-editor/).

### The registry list

![The Registry tab: the search icon and Create Registry button, the Registry Name, Created and Agents columns, the pagination bar, and the Select a Registry panel](/img/maistro/registry-panel.png)

To open the list, select **mAIstro** in the top navigation, then the **Registry** tab. The table has three columns:

- **Registry Name** — the name you gave the registry when you created it.
- **Created** — when the registry was created.
- **Agents** — the agents in the registry.

Select a column header to sort the table by that column. To find a registry in a long list, use the search icon on the toolbar above the table.

Below the table, **Items per page:** sets how many registries each page shows (`1`, `10`, `25` or `50`). Use **Previous page** and **Next page**, or the page-number selector, to move through the list. Select a registry in the table to see it in the **Select a Registry** panel under the list.

### Create a registry

![The Create Registry dialog with the Registry Name and Description fields and the Cancel and Create buttons](/img/maistro/create-registry-panel.png)

A new registry starts empty; you add agents to it afterwards.

1. On the **Registry** tab, select **Create Registry**.
2. In **Registry Name**, enter the name the selection nodes will use to refer to this registry. Choose a short, stable name that says what the pool is for, because every flow that selects from the registry refers to it.
3. In **Description**, say what the registry is for and which kinds of agents belong in it, so that other builders know where to add a new agent.
4. Select **Create**. To close the dialog without creating anything, select **Cancel**.

### Add agents to a registry

<!-- UNCONFIRMED: agents are attached to a registry after it is created ("Attach Agents to the Registry") — old node page maistro/ntl/agent-registry -->

After you create a registry, attach the saved agents that should be candidates for selection. Only agents in the registry are considered by **Select Agent** and **Select Agent Plan**, so make sure every agent a flow might need is attached. The agents themselves are the ones you build and save in mAIstro and find on its **User Agents** tab.

## When to use it

Use a registry when a flow has to choose between several agents and the right one depends on the request:

- **A front-door agent that routes to specialists.** One flow receives every request, and **Select Agent** hands it to the billing, technical or account agent that fits.
- **Multi-step work.** A request needs several agents in sequence, for example one that gathers data and one that writes the report. **Select Agent Plan** builds the ordered list and **Agent Loop** runs through it.
- **A growing set of agents.** New agents join the pool by being added to the registry, not by editing every flow that might call them.

A registry is the wrong tool when the flow always calls the same agent. Call that agent directly with **Use Agent**: it is predictable, and no LLM call is spent on choosing. To see which agents call which across your instance, use the [Agent Visualizer](/maistro/agent-visualizer/).

## FAQ

### Is the Agent Registry the list of all my saved agents?

No. Your saved agents are on the **User Agents** tab of mAIstro. A registry is a named subset of them that you create so that **Select Agent** and **Select Agent Plan** have a defined pool to choose from.

### How does a flow use a registry?

Through the **Select Agent** or **Select Agent Plan** node. You give the node the registry, the query to choose by and the LLM that makes the choice. The parameters are documented on the [Agent Registry node](/maistro/ntl/agent-registry/) page.

## Related

- [Agent Registry node](/maistro/ntl/agent-registry/)
- [Multi-Agent nodes](/maistro/ntl/multi-agent/)
- [mAIstro overview](/maistro/overview/)
- [Visual editor](/maistro/visual-editor/)
- [Agent Visualizer](/maistro/agent-visualizer/)
