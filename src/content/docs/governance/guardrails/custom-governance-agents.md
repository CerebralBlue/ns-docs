---
title: "Custom governance agents"
description: "The Custom Governance tab of the Guardrails dialog connects one mAIstro agent that runs before the KnowledgeBase lookup and the LLM call to modify or govern the user's input, and one that runs after the LLM call to modify or govern the answer."
---

The **Custom Governance** tab of the [Guardrails](/governance/guardrails/overview/) dialog puts
your own [mAIstro](/maistro/overview/) agents into the Seek request path: one before the
KnowledgeBase lookup and the call to the LLM, one after the LLM call. The tab sums it up as
"Connect mAIstro agents to apply custom governace rules." Use it for governance rules specific to
your business that the built-in Guardrails tabs cannot express. Not to be confused with the
**Custom Governance** item in the Governance screen's side navigation, which holds your
[custom dashboards](/governance/analytics/custom-dashboards/).

## Where to find it

In **Neural Config**, select a **Guardrails** node on the routing tree, then select the
**Custom Governance** tab, the last tab in the strip. The strip is wider than the dialog, so use
the scroll arrows at its ends to reach it. There is a **Guardrails** node under
**Default Config** and under each category that has a Custom Configuration; the tree is described
on [Configuration overview](/configuration/overview/).

![The Guardrails dialog for Default Config with the Custom Governance tab selected, showing the Pre-LLM and Post-LLM agent pickers](/img/neural-config/custom-governance.png)

## Settings

The tab has two pickers, one for each side of the LLM call. Each one is independent: you can
connect a pre-LLM agent, a post-LLM agent, both or neither.

### Pre-LLM custom governance agent

![The Pre-LLM custom governance agent picker with its help text, set to Disabled](/img/neural-config/custom-governance--pre-llm-custom-governance-agent.png)

**Pre-LLM custom governance agent** chooses the agent that works on the user's question before
NeuralSeek searches the KnowledgeBase or calls the LLM. In the console's words: "Pre-LLM custom
governance agents run before Knowledgebase lookup and the call to the LLM, and allow you to
dynamically modify or govern the input text and other fields."

![The Pre-LLM custom governance agent list open, showing Disabled and one mAIstro agent](/img/neural-config/custom-governance--options-pre-llm-custom-governance-agent.png)

| Option              | What choosing it does                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `Disabled`          | No pre-LLM agent runs.                                                                           |
| A mAIstro agent     | That agent receives the input and can modify or govern it before retrieval and generation.      |

<!-- UNCONFIRMED: each picker lists only the agents built with that hook's nodes — the captured Pre-LLM and Post-LLM lists each offered a different agent, one built for its own hook -->
The list holds your mAIstro agents for this hook; build one first (see
[Building an agent for the hooks](#building-an-agent-for-the-hooks)).

Change it when a rule about the input is specific to your business and the built-in input tabs —
[Prompt Injection](/governance/guardrails/prompt-injection/), [PII](/governance/pii-detection/),
[Profanity (HAP)](/governance/guardrails/profanity-hap/),
[Min Text](/governance/guardrails/overview/#min-text--the-shortest-question-you-accept) and
[Max Length](/governance/guardrails/overview/#max-length--the-longest-question-you-accept) — cannot
express it. For example, you might rewrite internal jargon into the terms your KnowledgeBase uses,
or refuse questions about a topic you do not answer, before any retrieval or generation happens.

### Post-LLM custom governance agent

![The Post-LLM custom governance agent picker with its help text, set to Disabled](/img/neural-config/custom-governance--post-llm-custom-governance-agent.png)

**Post-LLM custom governance agent** chooses the agent that works on the generated answer before
it is returned. In the console's words: "Post-LLM custom governance agents run after call to the
LLM, and allow you to dynamically modify or govern the answer and other fields."

![The Post-LLM custom governance agent list open, showing Disabled and one mAIstro agent](/img/neural-config/custom-governance--options-post-llm-custom-governance-agent.png)

| Option          | What choosing it does                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| `Disabled`      | No post-LLM agent runs.                                                               |
| A mAIstro agent | That agent receives the answer and its sources and can modify or govern the answer.   |

Change it for answer-side rules the built-in answer tabs —
[Semantic Scoring](/governance/guardrails/semantic-scoring/),
[Attribution Protection](/governance/guardrails/attribution-protection/),
[Warning Confidence and Min Confidence](/governance/guardrails/min-confidence/) — do not cover. For example, you might
hold back answers that discuss a subject you do not comment on, redact a term, or append a
disclaimer to every answer.

### Saving and scope

Selecting an agent takes effect when you select **Save** in the dialog footer. One **Save**
covers all ten Guardrails tabs, so check the other tabs before you save; saving is described on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

The pickers belong to the **Guardrails** node you opened. The **Default Config** node sets the
agents for every category that does not have its own Custom Configuration. A category with a
Custom Configuration has its own **Guardrails** node, so it can be governed by a different agent
from the rest.

## Building an agent for the hooks

The pickers connect agents; the agents themselves are built in mAIstro with a pair of NTL nodes
that pass data between Seek and the agent. The other nodes that hook into the Seek pipeline are
listed under [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

| Hook     | First step              | Last step                |
| -------- | ----------------------- | ------------------------ |
| Pre-LLM  | `preCustomGovernanceIn` | `preCustomGovernanceOut` |
| Post-LLM | `customGovernanceIn`    | `customGovernanceOut`    |

The NTL reference describes the input nodes as "used only for passing variables from seek to
mAIstro for use in custom governance" and says each "must be the first step in a mAIstro custom
governance flow"; each output node must be the last step in the agent. Both output nodes take a
`blockMessage`. `customGovernanceOut` hands the answer and its sources back to Seek with these
parameters:

| Parameter      | Description in the NTL reference                  |
| -------------- | ------------------------------------------------- |
| `blockMessage` | The message to return if blocking                 |
| `answer`       | The answer                                        |
| `passages`     | The trusted information you used as an array.     |
| `stump`        | The stump context                                 |
| `url`          | The primary source URL (optional)                 |
| `document`     | The primary source document name (optional)       |

The example below also sets `block` on `customGovernanceOut` to the variable that holds the LLM's
`true` or `false` verdict; that is the parameter it uses to decide whether to block, with
`blockMessage` as the text to return when it does.

A minimal post-LLM agent reads the answer from `customGovernanceIn`, asks an LLM whether the answer
breaks a rule, stores the verdict in a variable, and hands everything back through
`customGovernanceOut`. This one blocks answers that mention the state of New Jersey and passes the
answer, sources and stump through unchanged:

```text
{{ customGovernanceIn }}
{{ LLM | prompt: "Determine if the following statement involves any references about the state of New Jersey.  If it does, output \"true\", else output \"false\".

Only output \"true\" of \"false\".

Here is the statement:
<< name: customGovernanceIn.answer, prompt: false >>" | cache: "true" }}=>{{ variable | name: "block" }}
{{ customGovernanceOut | block: "<< name: block, prompt: false >>" | blockMessage: "We are unable to answer questions about New Jersey" | answer: "<< name: customGovernanceIn.answer, prompt: false >>" | stump: "<< name: seekIn.stump, prompt: false >>" | url: "<< name: customGovernanceIn.url, prompt: false >>" | passages: "<< name: customGovernanceIn.passages, prompt: false >>" | document: "<< name: customGovernanceIn.document, prompt: false >>" }}
```

<!-- UNCONFIRMED: Seek returns the text passed to customGovernanceOut's answer, so a rewritten value modifies the answer — inferred from the help text ("modify or govern the answer") and the node's answer parameter; no Seek was run through a governance agent -->
To modify the answer instead of blocking it, pass your rewritten text to `answer` rather than
`customGovernanceIn.answer`.

## FAQ

### Does a custom governance agent replace the built-in guardrails?

No. The pickers sit on their own tab, and selecting an agent does not change the settings on the
other nine tabs. A custom agent adds a rule of your own before or after the LLM call.

### Can each category use a different governance agent?

Yes. Each **Guardrails** node on the routing tree has its own **Custom Governance** tab, so a
category with a Custom Configuration can connect different agents from **Default Config**.

### How do I turn a custom governance agent off?

Set **Pre-LLM custom governance agent** or **Post-LLM custom governance agent** back to `Disabled`
and select **Save**.

### Is this the same as Custom Governance on the Governance screen?

No. The Governance screen's **Custom Governance** item is where you build
[custom dashboards](/governance/analytics/custom-dashboards/) of your analytics. This tab connects
agents to the Seek request path.

## Related

- [Guardrails overview](/governance/guardrails/overview/)
- [Pipeline hooks](/maistro/ntl/pipeline-hooks/)
- [mAIstro overview](/maistro/overview/)
- [Prompt Injection](/governance/guardrails/prompt-injection/)
- [PII detection](/governance/pii-detection/)
- [Profanity (HAP)](/governance/guardrails/profanity-hap/)
- [Semantic Scoring](/governance/guardrails/semantic-scoring/)
- [Min Confidence](/governance/guardrails/min-confidence/)
- [Custom dashboards](/governance/analytics/custom-dashboards/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
