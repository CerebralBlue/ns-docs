---
title: "Virtual KB"
description: "Virtual KB is a KnowledgeBase Type that makes a mAIstro agent the knowledge source for Seek: set KnowledgeBase Type to Virtual KB in KnowledgeBase Connection and choose the agent in mAIstro Virtual KB agent, with no connection or field-mapping settings to fill in."
---

A **Virtual KB** turns a [mAIstro](/maistro/overview/) agent into the knowledge base behind [Seek](/seek/overview/). Instead of searching an indexed document store, Seek hands each question to the agent and answers from what the agent returns. Use it when the knowledge you need lives behind an API, on a live site or in a database, or when you want your own logic to decide which passages Seek sees.

## How a Virtual KB works

A Virtual KB has two halves. The agent, built and saved in mAIstro, does the retrieval: it receives the question and returns the passages. The setting in [Neural Config](/configuration/neural-config/) tells Seek to use that agent instead of a connected store. Build the agent first, then point the knowledge base at it.

### Choose Virtual KB as the KnowledgeBase Type

![KnowledgeBase Type set to Virtual KB next to KnowledgeBase Language, with the Notes box below](/img/neural-config/knowledgebase-connection@kb-virtual--knowledgebase-type.png)

**Virtual KB** is one of the values of **KnowledgeBase Type**, in the **KnowledgeBase Connection** section of the Edit Configuration dialog. The full list of types, and what each needs, is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) and [Supported knowledge bases](/knowledge/supported-knowledgebases/).

With **Virtual KB** selected, the section holds four fields: **KnowledgeBase Type**, **KnowledgeBase Language**, **Notes**, and **mAIstro Virtual KB agent**. The agent is the only Virtual KB-specific setting, because the agent decides what comes back and in what shape. **KnowledgeBase Language** and **Notes** work as they do for every type; see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Pick the agent in mAIstro Virtual KB agent

![The mAIstro Virtual KB agent dropdown, empty until an agent is chosen](/img/neural-config/knowledgebase-connection@kb-virtual--maistro-virtual-kb-agent.png)

**mAIstro Virtual KB agent** selects the agent Seek calls for retrieval. It appears below **Notes** as soon as the type is **Virtual KB**, and it is empty until you choose an agent, so save the agent in mAIstro before you come here. Changing the agent changes the knowledge source for every answer this configuration generates; treat it like switching the knowledge base itself.

To point Seek at your agent:

1. Open **Neural Config** and select the **Default Config / Answer Generation** node, then **Edit Configuration**.
2. Expand **KnowledgeBase Connection**.
3. Set **KnowledgeBase Type** to **Virtual KB**.
4. In **mAIstro Virtual KB agent**, choose your agent.
5. Select **Save**, or **Propose Changes** to submit the change for review. The difference between the two is explained in [Using the Neural Config page](/configuration/neural-config/using-this-page/).
6. Ask a question on the [Seek](/seek/overview/) tab and check that the answer draws on what your agent returned.

### Build the agent it calls

![Screenshot pending: a Virtual KB agent on the mAIstro canvas, from the virtualKbIn node through one data-fetch step to the virtualKbOut node](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/virtual-kb-agent.png — mAIstro > an agent with virtualKbIn as the first step, one fetch step (web or REST), virtualKbOut as the last step. Why: the reader needs to see where the question enters and where the passages leave. -->

A Virtual KB agent is an ordinary mAIstro agent with a fixed start and end. Its first step must be the `virtualKbIn` node and its last step the `virtualKbOut` node; both are documented with the other retrieval nodes on [RAG Tools](/maistro/ntl/rag-tools/). Everything in between is yours: web fetches, REST calls, database connectors, filters and rewrites.

`virtualKbIn` hands the agent the question and its context as variables:

| Variable                     | What it holds                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `virtualKbIn.originalQuery`  | The user's original input.                                                                   |
| `virtualKbIn.contextQuery`   | The query enhanced with earlier turns of the conversation ([context keeping](/seek/conversational-context/)). |
| `virtualKbIn.language`       | The selected or determined language.                                                         |
| `virtualKbIn.langCode`       | The selected or determined language code.                                                    |
| `virtualKbIn.intent`         | The selected or determined intent.                                                           |
| `virtualKbIn.categoryName`   | The selected or determined category name.                                                    |
| `virtualKbIn.filter`         | The filter string used.                                                                      |
| `virtualKbIn.prefs`          | The instance preferences, secrets redacted — only when `passPrefs` is `true` (opt-in).        |

`virtualKbOut` returns the result to Seek. Its `url` and `document` parameters name the primary source URL and document, and both are optional. In NTL the two ends of the agent look like this:

```text
{{ virtualKbIn | passPrefs: "false" }}
{{ virtualKbOut | url: "..." | document: "..." }}
```

<!-- UNCONFIRMED: virtualKbOut also takes context (plain text or an array of passages), kbCoverage and kbScore (0-100, optional) — old RAG Tools page (maistro/ntl/rag-tools); the current NTL reference excerpt shows only url and document -->

The passages themselves go in the `context` parameter, as plain text or as an array, and the optional `kbCoverage` and `kbScore` (0–100) report how well the returned context covers the question and how confident it is.

<!-- UNCONFIRMED: an example template named "Virtual KB" exists under mAIstro Example Templates (old name ex_Virtual_KB) — old seek/virtual-kb page -->

To start from a working agent, open the **Virtual KB** example in mAIstro's example templates and replace its fetch step with your own source.

### KnowledgeBase Tuning with a Virtual KB

The **KnowledgeBase Tuning** section stays in the dialog when **Virtual KB** is selected. With this type it carries **Snippet size**, which windows the relevant details in a document that do not mention the question directly but apply to it, and it keeps **KnowledgeBase Query Cache (minutes)**. What each setting does is on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## When to use a Virtual KB

- **The source cannot be indexed ahead of time.** It sits behind an API, a live website or a database that nobody is going to export.
- **The content changes faster than you could re-index it**, so Seek should read it at question time.
- **You want your own logic between the source and Seek** — which results, in what shape, with which titles and links — or you want to combine several sources into one answer.

Weigh the cost: an indexed knowledge base has done its retrieval work before the question arrives, while a Virtual KB agent runs when it does. Any external call the agent makes becomes part of the work behind every answer, so a slow source means slower answers.

It is the wrong tool when your content is a stable document set. Load it into a regular knowledge base (see [Supported knowledge bases](/knowledge/supported-knowledgebases/)) and let the index do the retrieval. **No KnowledgeBase**, another **KnowledgeBase Type** value, connects no knowledge base; see [Supported knowledge bases](/knowledge/supported-knowledgebases/) for what each type does.

## FAQ

### Do I need an index, endpoint or API key for a Virtual KB?

No. With **Virtual KB** selected, **KnowledgeBase Connection** shows only **KnowledgeBase Type**, **KnowledgeBase Language**, **Notes** and **mAIstro Virtual KB agent**. Any credentials the agent needs to reach its own sources belong in the agent.

### Where do I build the agent, and what must it contain?

In [mAIstro](/maistro/overview/). The first step must be `virtualKbIn` and the last step `virtualKbOut`; see [RAG Tools](/maistro/ntl/rag-tools/). Save the agent, then choose it in **mAIstro Virtual KB agent**.

### What is the difference between Virtual KB and No KnowledgeBase?

**Virtual KB** retrieves through the agent you choose in **mAIstro Virtual KB agent**, and Seek answers from what it returns. **No KnowledgeBase** connects no knowledge source. See [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Do KnowledgeBase Tuning settings still apply?

The **KnowledgeBase Tuning** section stays in the dialog with a Virtual KB, including **Snippet size** and **KnowledgeBase Query Cache (minutes)**. See [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) for what each one does.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Supported knowledge bases](/knowledge/supported-knowledgebases/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [RAG Tools](/maistro/ntl/rag-tools/)
- [mAIstro overview](/maistro/overview/)
- [Seek overview](/seek/overview/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
