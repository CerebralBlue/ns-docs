---
title: "NTL overview"
description: "NTL (NeuralSeek Template Language) is the text form of a mAIstro agent — how nodes, chaining, variables and secrets are written, and when to edit an agent in the NTL tab instead of the visual Agent Editor."
---

NTL, the NeuralSeek Template Language, is the text form of a [mAIstro](/maistro/overview/) agent. Every step you drop onto the canvas is a node, and NTL writes those nodes, their parameters and the order they run in as plain text you can read, paste, search and edit in bulk. You do not need NTL to build an agent, but you will meet it whenever you copy an agent, review one someone else wrote, or follow an example in these docs.

## How NTL works

An agent is a chain of nodes. Each node is a function from the **Functions** library; it takes parameters, does one job, and passes its output to the next node. NTL is that chain spelled out.

### One agent, two views

The mAIstro screen has a tab row — **Agent Editor**, **NTL**, **Marketplace**, [**User Agents**](/maistro/overview/#user-agents--your-saved-agents), [**Visualizer**](/maistro/agent-visualizer/), [**Registry**](/maistro/agent-registry/), [**Scheduler**](/maistro/agent-scheduler/). The first two are two views of the same agent:

- **Agent Editor** shows the agent as a visual flow of nodes that you drag, connect and configure. It is documented on [Visual editor](/maistro/visual-editor/).
- **NTL** shows the same agent as source text in a line-numbered editor.

![The Functions library on the left, an empty line-numbered editor, the Agent Output format tabs from Inline to PPT, and the bar with Run Agent at the bottom](/img/maistro/ntl.png)

<!-- UNCONFIRMED: NTL pasted into the NTL tab appears as a flow when you switch back to the Agent Editor — from the ported mAIstro overview page ("can be copy-pasted into the Agent NTL tab, and then switch back to the Agent Editor") -->

To bring in an agent written as text — an example from these docs, or NTL a colleague sent you — paste it into the **NTL** tab, then switch to **Agent Editor** to see it as a flow.

Everything below the editor is shared by both views: the **Agent Output:** area with its **Inline**, **Raw**, **Text**, **HTML**, **Microsoft Word**, **PDF**, **CSV** and **PPT** formats, and the bottom bar with **Run Agent**, **Save**, **User Id**, **Stream** and **Auto-Enhance**. Running an agent and reading its output works the same from either tab; see [Running and inspecting an agent](/maistro/inspector/).

### Nodes and how they chain

A node is written as a function call in double braces, with its parameters separated by pipes:

| Form         | NTL                                                                         | Note                        |
| ------------ | --------------------------------------------------------------------------- | --------------------------- |
| Function call | `{{ functionName \| param1: "value1" \| param2: "value2" }}`               | Pipe-delimited params       |
| Chaining     | `{{ nodeA \| ... }}=>{{ nodeB \| ... }}=>{{ variable \| name: "out" }}`     | Chain multiple nodes        |
| Chain output | `{{ function }}=>{{ variable \| name: "result" }}`                          | Capture output              |
| Annotation   | `nsdescription: "tooltip text"`                                             | Add to any node             |

The `=>` arrow passes one node's output to the next. Ending a chain with a `variable` node keeps the result under a name so a later step can use it.

You rarely type a node from memory: the **Functions** library on the left of the screen lists every node grouped by job, with **Recent** and **Most Used** shortcuts above the groups and **Search functions** to find one by name, and [The function library](/maistro/visual-editor/#the-function-library) on the Visual editor page links each group to the reference page for its nodes and parameters.

### Variables

Variables carry values between steps. The `variable` node collects the text flowing into it and stores it under a name:

```text
{{ variable | name: "..." | mode: "..." | value: "..." }}
```

- `name` — the name of the variable.
- `mode` — Overwrite (the default) or Append to the variable.
- `value` — optional; sets the value directly. Leave it blank to collect the input to this node.

Variables are read back with double angle brackets. An input parameter is declared at the top of the agent with `prompt: true`:

| Use           | NTL                                                         | Note                                   |
| ------------- | ----------------------------------------------------------- | -------------------------------------- |
| Input param   | `<< name: varName, prompt: true, desc: "description" >>`    | Declare at top of agent                |
| Set variable  | `{{ variable \| name: "x" \| value: "y" }}`                 | Create or overwrite                    |
| Use variable  | `<< name: x >>`                                             | Use `prompt: false` for internal refs  |
| Append mode   | `{{ variable \| name: "x" \| mode: "append" }}`             | Append instead of overwrite            |

<!-- UNCONFIRMED: << >> variables expand in place; a blank value ("") counts as not present; double quotes inside a parameter value are escaped by doubling them ("") — from the "Some general rules" list on the ported mAIstro overview page -->

Three rules help when you edit NTL by hand: a `<< >>` variable expands in place, wherever it appears in the text; a blank value (`""`) counts as not present; and a double quote inside a parameter value — common in SQL queries — is escaped by doubling it (`""`).

In the library, the **Control Flow** group holds **Set Variable**, **Delete Variable** and **Use Variable** (see [Control Flow](/maistro/ntl/control-flow/)). The **System Variables** group holds ready-made values — **Date**, **Time**, **DateTime**, **Generate UUID**, **Random Number**, **Categories** and **Intents** (see [System Variables](/maistro/ntl/system-variables/)).

### Secrets

An API token or password does not belong in the agent's text: anything in NTL is visible to whoever opens the agent and travels with every copy of it. Store the value as a [secret](/configuration/neural-config/secrets/) in Neural Config instead. The Secrets section describes the result: "Secrets you set here will be available as variables in mAIstro." The agent then carries only the secret's name, and the value changes in one place when it rotates.

:::note[Under review]
This page and [Secrets](/configuration/neural-config/secrets/) each point to the other for how an agent refers to a secret, and neither gives the syntax. The Secrets page treats the mechanism as unverified; until it is confirmed, check how a secret resolves in an agent on your instance before you rely on it.
:::

### Generating NTL instead of typing it

You do not have to write NTL from scratch. To build a whole agent from a sentence, describe it in the mAIstro start dialog or select **Generate Agent** in the editor, then open the **NTL** tab to read what was generated (see [Start from a description](/maistro/overview/#start-from-a-description-the-start-dialog)). The [Agent Marketplace](/maistro/agent-marketplace/) has a **Developer & NTL** category that includes:

- **NTL Generator** — "An example of how to generate NTL automatically."
- **Save Agent NTL** — "Saves (creates or overwrites) an agent by providing the NTL source directly."

The **Multi-Agent** group of the library also has nodes that work on NTL from inside an agent — **Make NTL**, **Make & Test NTL**, **Get Agent NTL** and **Save Agent** (see [Multi-Agent](/maistro/ntl/multi-agent/)).

## When to use the NTL tab

Use the **NTL** tab when the text is the fastest way in:

- Bringing in an agent: pasting an example from these docs, or NTL a generator or a colleague produced.
- Reviewing a whole agent at once: every node and parameter on one screen, in the order they run.
- Making the same change in many places: renaming a variable or replacing a value across every node that uses it.
- Keeping a copy: NTL is plain text, so you can store it, compare versions and share it like any other source file.

Use the [Agent Editor](/maistro/visual-editor/) instead when you are arranging steps, wiring a new node in, or changing one node's settings without working in the syntax. To run the agent and read what each step produced, see [Running and inspecting an agent](/maistro/inspector/).

## FAQ

### Do I have to write NTL to build an agent?

No. The **Agent Editor** builds the same agent visually; the **NTL** tab holds the same agent as text, which is useful for pasting or copying an agent even if you never type NTL yourself.

### Where do I find every node and its parameters?

On the reference pages linked from [The function library](/maistro/visual-editor/#the-function-library) — one page per group of the **Functions** library. **Search functions** at the top of the library finds a node by name.

### How do I keep an API key out of the agent text?

Store it as a [secret](/configuration/neural-config/secrets/) in Neural Config. Secrets are available as variables in mAIstro, so the agent carries the secret's name, never the key itself.

## Related

- [mAIstro overview](/maistro/overview/)
- [Visual editor](/maistro/visual-editor/)
- [Running and inspecting an agent](/maistro/inspector/)
- [Secrets](/configuration/neural-config/secrets/)
- [System Variables](/maistro/ntl/system-variables/)
- [Agent Marketplace](/maistro/agent-marketplace/)
