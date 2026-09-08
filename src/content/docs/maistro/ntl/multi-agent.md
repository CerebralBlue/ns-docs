---
title: "Multi-Agent"
description: "Nodes for calling other mAIstro agents and LLMs, and for generating, saving, describing, and titling NTL."
---

## mAIstro

Import and run another mAIstro agent in the same variable space as the current mAIstro.

:::note[Parameters]

- **template**: The mAIstro agent name. This agent will share the same variable space as your current agent.

- **ntl**: The NTL - Do not include both a agent and NTL. Set one or the other only.
:::

---

## mAIstro Sandbox

Call another mAIstro agent, keeping a separate variable space from the current mAIstro and only returning the final output.

:::note[Parameters]

- **template**: The mAIstro agent name.

- **params**: The parameters to pass to the agent, in JSON format

- **ntl**: The NTL - Do not include both a template and NTL. Set one or the other only.
:::

---

## mAIstro NTL

Get the NTL of a mAIstro agent as a string.

:::note[Parameters]

- **agent**: The mAIstro agent name.
:::

---

## Get Packed Config

Get the current configuration as an encrypted string.

---

## Send To LLM

This node takes all text flowing into it and sends it to an LLM. If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes. Be sure that any text being sent to this node has new prompting to send to the LLM. When chaining multiple LLM nodes be sure that each llm node has adding additional prompting specifiying the new or next action to be taken. There must be text flowing in to this node, or the "prompt" parameter must be provided, or both. For models that support image processing you may add a single base64 encoded image to the images option to pass to the LLM.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **cache**: Cache and reuse LLM response for identical requests

- **images**: Base64 encoded image strings, for use with LLM's that support image processing.

- **modelCard**: Override the default mAIstro LLM

- **stream**: Override the streaming setting for this LLM node

- **messages**: Override and directly set the messages object

- **maxTokens**: Override the template's max Tokens

- **minTokens**: Override the template's min Tokens
:::

---

## LLM Plan

This node creates a plan in JSON format for use with the llmAct node

:::note[Parameters]

- **task**: A task to plan

- **cache**: Cache and reuse LLM response for identical requests

- **context**: Context for use in sub-processing

- **modelCard**: Override the default mAIstro LLM
:::

---

## LLM Act

This node acts on a LLM plan by spawning sub-llm calls

:::note[Parameters]

- **task**: A task to plan

- **plan**: The plan in JSON format

- **cache**: Cache and reuse LLM response for identical requests

- **context**: Context for use in sub-processing

- **modelCard**: Override the default mAIstro LLM
:::

---

## Make NTL

Use the default LLM to generate NTL

:::note[Parameters]

- **query**: The text that describes the usecase to generate NTL for.

- **modelCard**: The LLM to use
:::

---

## Make & Test NTL

Use the default LLM to generate NTL, test it, and iterate

:::note[Parameters]

- **query**: The text that describes the usecase to generate NTL for.
:::

---

## Save Agent

Save an agent

:::note[Parameters]

- **name**: The agent name (no spaces or special chars).

- **description**: The agent description

- **ntl**: The agent ntl
:::

---

## Describe NTL

Use the default LLM to describe an NTL script

:::note[Parameters]

- **ntl**: The NTL.
:::

---

## Title NTL

Use the default LLM to title NTL and ntl script

:::note[Parameters]

- **ntl**: The NTL.
:::
