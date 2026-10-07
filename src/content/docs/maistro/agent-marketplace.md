---
title: "Agent Marketplace"
description: "The Agent Marketplace is the Marketplace tab in mAIstro, where you search and filter a catalogue of ready-to-use agents and starter templates by type and category, then open one to load it instead of building an agent from scratch."
---

The Agent Marketplace is a catalogue of pre-built agents inside [mAIstro](/maistro/overview/). Its header sums up the job: **Browse agents** — "Find the right agent for your workflow" — "Search, filter, and load pre-built agents or starter templates for common business, data, integration, and automation scenarios." Use it before you open a blank canvas: many common jobs, from summarising a meeting to loading documents into a knowledge base, already exist as an agent you can run as it is or adapt.

## How the Agent Marketplace works

Every agent in the catalogue is one card. Each card carries one of two badges, **Ready to use** or **Starter template**, and belongs to one category. You narrow the catalogue with a search box and two rows of filter chips, read the cards, and open the one that fits.

### Open the Marketplace tab

To open the catalogue, select **mAIstro** in the top navigation, then select the **Marketplace** tab. It sits among the other mAIstro tabs: **Agent Editor** (the [visual editor](/maistro/visual-editor/)), **NTL** (the [agent language](/maistro/ntl-overview/)), **Marketplace**, **User Agents** (your [saved agents](/maistro/overview/#user-agents--your-saved-agents)), **Visualizer** (the [Agent Visualizer](/maistro/agent-visualizer/)), **Registry** (the [Agent Registry](/maistro/agent-registry/)) and **Scheduler** (the [Agent Scheduler](/maistro/agent-scheduler/)). When mAIstro opens with its start dialog, the **NeuralSeek AI Agent Marketplace** tile brings you to this tab as well; the mAIstro overview describes the rest of that dialog.

![The mAIstro page with the Marketplace tab selected between NTL and User Agents; the function library is on the left and the Browse agents header, search box, filter chips and first row of agent cards fill the main area](/img/maistro/marketplace.png)

### Search the catalogue

Type in the **Search agents by name, description, audience, or capability** box to narrow the cards to agents that match. As the placeholder says, the search looks beyond the agent's name: it matches the description, the audience it is written for, and what it can do. Many descriptions end with the roles the agent serves — for example, Ad Copy Creator: "Writes high-converting ad headlines, descriptions, and CTAs based on platform best practices. CMO, Growth marketers, paid media managers, eCommerce teams" — so searching a role such as "Sales representatives" is a quick way to find agents meant for a team.

To empty the search box, select **Clear** next to it.

![The Marketplace tab: the Browse agents header; the Search agents by name, description, audience, or capability box with the Clear button; the Agent type chips All agents, NeuralSeek, Ready to use, Starter templates and Community; the Categories chips starting with All categories, Knowledge & RAG and NeuralEdit; the summary line; and the first row of agent cards, each with a Ready to use badge, a category and View details](/img/maistro/marketplace-panel.png)

### Filter by agent type

The **Agent type** row filters the catalogue by what kind of agent it is. Each chip shows how many agents it matches, so you can see the size of a group before you select it.

- **All agents** — no type filter; every agent in the catalogue is listed.
- **NeuralSeek** — agents whose source is NeuralSeek.
- **Ready to use** — only agents with the **Ready to use** badge: agents built to do a finished job.
- **Starter templates** — only agents with the **Starter template** badge: working examples of a pattern, meant to be adapted.
- **Community** — agents whose source is the community rather than NeuralSeek.

Every agent carries exactly one of the two badges, so **Ready to use** and **Starter templates** together cover the whole catalogue. Use them when you already know whether you want something to run or something to change; [When to use the Agent Marketplace](#when-to-use-the-agent-marketplace) explains the difference.

### Filter by category

The **Categories** row filters by business area. **All categories** removes the category filter; each other chip shows only the agents of that category, and its count tells you how many there are. Every card shows its category, so you can also tell a card's category without filtering.

The chips, in the order the row lists them, with examples of agents in each:

| Category              | What you find there                                             | Example agents                                                               |
| --------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Knowledge & RAG       | Building, loading and querying knowledge bases                  | Load to NeuralSeek KB, Wikipedia Virtual Knowledgebase, ElasticSearch Uploader |
| NeuralEdit            | Agents that drive or extend the [NeuralEdit](/maistro/neuraledit/overview/) editor | NeuralEdit Excel Chat, NeuralEdit File Editor, Save as a Word Doc            |
| Meetings & Calls      | Transcripts, summaries and follow-ups                           | Call Transcriber, Email a Meeting Summary, Meeting Action Items              |
| Legal & Compliance    | Contracts, legal research and regulatory checks                 | Contract Analyst, Legal Researcher, Regulatory Compliance Monitor            |
| Marketing & Sales     | Copy, campaigns and prospecting                                 | Ad Copy Creator, Cold Email Writer, SEO Blog Generator                       |
| Data & Analytics      | Charts, data extraction and reporting                           | Excel Basic Example, Analyze Meeting Emotion, Pie Chart                      |
| Governance & Testing  | Logging, test plans and red-team checks                         | Corporate Logging Agent, Create Red Team Plan, System Log Alert Agent        |
| Guardrails            | Checks on what goes into and comes out of the LLM, next to the [guardrails](/governance/guardrails/overview/) NeuralSeek applies around Seek answers | Confidence Enforcer, Prompt Injection Guard, Word Count Enforcer             |
| Developer & NTL       | Calling, generating and inspecting agents and NTL               | Call Agent, NTL Generator, a2a Agent execution                               |
| Multimedia            | Images, video and speech                                        | AI Script Creator, Image Editor, Text-to-Speech Generator                    |
| Documents & Files     | Checking and refining document output                           | Output Feedback Validator                                                    |
| Workflow Automation   | Loops, conditional flows and multi-step builders                | Slide deck with images, Loop Handler, PDF Analyzer & Loader                  |
| Business Productivity | Everyday helpers                                                | Improve LLM prompts, Weather-Based Style Recommender                         |

Agents are written in NTL, mAIstro's agent language; the Developer & NTL agents are the ones that generate, describe or call NTL and other agents. The examples above are a sample, not the full list.

### Read an agent card

Above the cards, a summary line gives the number of agents shown and, when nothing is filtered, reads "Showing all marketplace agents". Each card shows:

- the badge — **Ready to use** or **Starter template**
- the agent's name and a short description of what it does, often followed by who it is for
- its category
- **View details**

Read the description before you open an agent. Some agents expect to be wired into another part of NeuralSeek, and the description says so — for example, System Log Alert Agent: "Email an alert when NeuralSeek records an operational failure - an expired LLM key, an unreachable knowledgebase, a scheduled agent that stopped running. Set this agent under Governance > System Log > settings." Its description names the place it is set up, in [Governance](/governance/overview/).

To see an agent's details, select its card or **View details**. From there you load the agent into mAIstro.

<!-- UNCONFIRMED: a loaded marketplace agent opens in the Agent Editor, where it can be tested and adapted — old mAIstro overview, "AI Agent Marketplace" section -->
A loaded agent opens in the Agent Editor, where you can test it and adapt it to your needs.

### Agents from external marketplaces

An administrator can register one or more optional external marketplaces for mAIstro in Neural Config, in the [mAIstro Configuration](/configuration/neural-config/maistro-configuration/) section — each with its own endpoint and API key.

<!-- UNCONFIRMED: agents from a marketplace registered in mAIstro Configuration can be browsed on the Marketplace tab — inferred from the mAIstro Configuration help text ("Configure optional external marketplaces for mAIstro"); no capture shows an external agent on this tab -->
The agents a registered marketplace publishes are meant to be browsed here, alongside the built-in ones. Registering, rotating the key of, or removing a marketplace is done on that page, not on this tab.

## When to use the Agent Marketplace

Open the marketplace whenever the job you need sounds common — summarising, extracting, loading, translating, charting, checking an answer — before you build anything. Then choose between the two badges:

- **Load a Ready to use agent when its description is the job you need.** These cards describe a finished result: "A ready-to-run example that generates a summary of a meeting transcript and emails it." (Email a Meeting Summary), or "A ready-to-run example that generates a two-sheet Excel workbook with styled tables and filters." (Excel Basic Example). Load it, test it, and change only what differs for you.
- **Load a Starter template when you want a working starting point to change.** These cards describe a pattern rather than a product: "This flow shows how to use a2a agent calling." (a2a Agent execution), or "This flow takes a meeting transcript and rates the emotion it finds, displaying the result as a pie chart." (Analyze Meeting Emotion). Load one to see how the pattern is wired, then replace its inputs and steps with your own in the Agent Editor.

Once an agent does what you need, the rest of mAIstro takes it from there: run it on a timetable with the Agent Scheduler, make it one of the agents chosen at run time with the Agent Registry, or give users a place to start it from [Run Agents](/maistro/run-agents/).

The marketplace is the wrong place to start when your agent is specific to your own systems and no card comes close — searching for a near match and then rewriting most of it is slower than building in the Agent Editor directly. It is also not where marketplaces are added: that is an administrator task in [mAIstro Configuration](/configuration/neural-config/maistro-configuration/).

## FAQ

### What is the difference between a Ready to use agent and a Starter template?

Every card carries one of the two badges. A **Ready to use** agent describes a finished job you can run as it is; a **Starter template** shows a pattern — a2a calling, a chart, a loop — that you load to learn from and adapt. Use the **Ready to use** and **Starter templates** chips to see only one kind.

### Can I search by job role?

Yes. The search matches an agent's name, description, audience and capability, and many descriptions end with the roles the agent is for, such as "Corporate lawyers, contract managers" or "Sales representatives, founders, business development teams".

### Where do I add another marketplace?

In Neural Config, not on this tab: an administrator registers the marketplace — its endpoint and API key — under mAIstro Configuration.

## Related

- [mAIstro overview](/maistro/overview/)
- [Visual editor](/maistro/visual-editor/)
- [NTL overview](/maistro/ntl-overview/)
- [mAIstro Configuration](/configuration/neural-config/maistro-configuration/)
- [NeuralEdit overview](/maistro/neuraledit/overview/)
- [Agent Scheduler](/maistro/agent-scheduler/)
- [Agent Registry](/maistro/agent-registry/)
- [Agent Visualizer](/maistro/agent-visualizer/)
