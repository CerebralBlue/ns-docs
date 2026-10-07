---
title: "Table understanding"
description: "Table Understanding is the NeuralSeek LLM function for table data in your documents; you turn it on by ticking it on an LLM card in LLM Details, and only a model that supports it can take it."
---

Table Understanding is the NeuralSeek function that handles table data in your documents, so answers can draw on information that sits in rows and columns rather than in running text. It is one of the **LLM Functions** you assign to a model, in the same way as Seek or Translate: it works only when a model that can perform it has it ticked. This page explains what the function is for, where you switch it on in [LLM Details](/configuration/neural-config/llm-details/), and why its checkbox can be greyed out.

## How Table Understanding works

### What the function does

Documents reach your knowledge base through the paths described in [Getting documents in](/knowledge/ingestion-overview/). Tables in those documents are hard to answer from as plain text, because the meaning of a cell depends on its row and column headers. Table Understanding is the function that deals with that structure.

<!-- UNCONFIRMED: pre-processes documents to extract and parse table data into a format suitable for conversational queries — old page (verbatim port) -->

It pre-processes your documents to extract and parse table data into a format suitable for conversational queries.

### Turn on Table Understanding for a model

Table Understanding is a checkbox in the **LLM Functions** grid on each LLM card. Ticking it assigns the function to that card's model.

1. Open **Neural Config**, select the **Default Config / Answer Generation** node, and select **Edit Configuration**.
2. Expand **LLM Details**.
3. On the card of the model that should read your tables, tick **Table Understanding** under **LLM Functions**.
4. Select **Save**.

![The LLM Details section with two LLM cards; in each card's LLM Functions grid the Table Understanding checkbox is greyed out because the card's model does not support it](/img/neural-config/llm-details-panel.png)

Two rules from the **LLM Details** help text decide whether the feature runs:

- "Features that an LLM are not capable of will be unselectable." A greyed-out **Table Understanding** box means the card's model cannot perform the function. Tick it on another card, or add a model that supports it.
- "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." If no card has **Table Understanding** ticked, the feature is off. NeuralSeek does not hand the work to another model.

**Enable All** and **Disable All**, beside the **LLM Functions** title, tick or untick every selectable function on that card. They never tick a greyed-out box, so selecting **Enable All** on a model that cannot do Table Understanding leaves it off. If you tick **Table Understanding** on several cards, NeuralSeek load-balances the work across those models; [LLM Details](/configuration/neural-config/llm-details/) explains the weights.

### Check whether a model supports it

Before you add a model for table work, check its notes. In **LLM Details**, select **Add an LLM**, then pick a **Platform** and an **LLM Selection**. The dialog shows **LLM Notes:** for that model, including a line that starts "This LLM does not support:".

![The Add an LLM dialog with Platform set to NeuralSeek and LLM Selection set to Managed GPT; its LLM Notes say "This LLM does not support: Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text"](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

If that line names Table Understanding, the function will be greyed out on the model's card once you add it, and you need a different model for tables. If the line does not name it, you can tick **Table Understanding** on the new card. Support varies by model, so read the notes of the exact model you plan to use; [Supported LLMs](/configuration/supported-llms/#llm-notes) lists the platforms and what each note means.

## When to use Table Understanding

Turn it on when the answers your users need sit inside tables: price lists, specification sheets, rate tables, comparison grids, where a value only makes sense together with its row and column headers.

Leave it off when your content is mostly prose, because the processing has a cost:

<!-- UNCONFIRMED: consumes 1 Seek query for every table pre-processed — old page (verbatim port) and route description -->

- Each table processed consumes one Seek query.

<!-- UNCONFIRMED: table preparation takes several minutes per page — old page (verbatim port) -->

- Preparing tables takes several minutes per page.

<!-- UNCONFIRMED: re-crawling or re-loading a document processes its tables again, and that is charged again — route gap in the migration map -->

- Re-crawling or re-loading a document processes its tables again, and that processing is charged again. Keep this in mind for content you reload often.

If the problem is untidy web pages rather than tables, look at [Auto data cleanse](/knowledge/auto-data-cleanse/) instead. To load the documents that hold your tables, see [Loading documents](/knowledge/load/).

## FAQ

### Why is the Table Understanding box greyed out?

The model on that card cannot perform the function: "Features that an LLM are not capable of will be unselectable." In **Add an LLM**, that model's **LLM Notes:** list Table Understanding under "This LLM does not support:". Tick the box on a card whose model supports it, or add such a model.

### What happens if no model has Table Understanding ticked?

The function is off. The **LLM Details** help text says: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

### Which models support Table Understanding?

It depends on the model, so check before you add one: select **Add an LLM**, pick the **Platform** and **LLM Selection**, and read the "This LLM does not support:" line in **LLM Notes:**. If Table Understanding is not on that line, the model can take the function. [Supported LLMs](/configuration/supported-llms/) covers the platforms and models.

## Related

- [LLM Details](/configuration/neural-config/llm-details/)
- [Supported LLMs](/configuration/supported-llms/)
- [Getting documents in](/knowledge/ingestion-overview/)
- [Loading documents](/knowledge/load/)
- [Auto data cleanse](/knowledge/auto-data-cleanse/)
