---
title: "Virtual KB"
description: "Virtual KB is a KnowledgeBase Type that answers from a mAIstro agent instead of an indexed store: you set KnowledgeBase Type to Virtual KB in KnowledgeBase Connection and choose the agent in mAIstro Virtual KB agent, with no connection or field-mapping settings to fill in."
---

## What is it

**Virtual KB** is one of the values of **KnowledgeBase Type**, in the **KnowledgeBase Connection** section of Neural Config. Instead of connecting NeuralSeek to an indexed document store, you point the KnowledgeBase at a mAIstro agent. The agent supplies the documents when a question comes in, and Seek answers from what the agent returns.

On the configuration screen the whole connection is one field. Choosing `Virtual KB` keeps **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes** and adds a single dropdown, **mAIstro Virtual KB agent**. There is no endpoint, index, API key or field mapping to fill in.

<!-- UNCONFIRMED: a Virtual KB agent can fetch from a web search, a REST API, a database or several sources at once — old page (seek/virtual-kb, previous docs); the screen shows only the agent dropdown -->

Because the agent is an ordinary mAIstro agent, it can fetch from more than one place — a web search, a REST API, a database — and hand the results to Seek as one KnowledgeBase.

## Why it matters

Some knowledge cannot be loaded into an index ahead of time. It sits behind an API, changes during the day, or lives in a system nobody is going to export. A Virtual KB lets Seek reach that content anyway, and lets you filter, reshape or enrich the results in the agent before Seek sees them.

There is a cost to weigh: an indexed KnowledgeBase has done its retrieval work before the question is asked, while a Virtual KB agent does it when the question arrives. If the agent calls an external service, that call becomes part of the work behind every answer.

## When to use it

- The source is an API, a live website or a database rather than a document set you can load.
- The content changes faster than you could re-index it.
- You want your own logic to decide what Seek receives — which results, in what shape, with which titles and links.

It is the wrong tool when your content is a stable document set: load it into a regular KnowledgeBase (see [Supported knowledge bases](/knowledge/supported-knowledgebases/)) and let the index do the retrieval. If you want no knowledge source at all, the **KnowledgeBase Type** value is `No KnowledgeBase`, not `Virtual KB` — see [How Virtual KB differs from No KnowledgeBase](#how-virtual-kb-differs-from-no-knowledgebase).

## How it works

A Virtual KB has two halves: the agent, built and saved in [mAIstro](/maistro/overview/), and the setting in Neural Config that tells Seek to use it. Build the agent first, then point the KnowledgeBase at it. The configuration for every KnowledgeBase Type, including this one, is documented on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Choose Virtual KB as the KnowledgeBase Type

![KnowledgeBase Type set to Virtual KB next to KnowledgeBase Language, with the empty Notes box below](/img/neural-config/knowledgebase-connection@kb-virtual--knowledgebase-type.png)

In Neural Config, expand **KnowledgeBase Connection** and open **KnowledgeBase Type**. `Virtual KB` is one of its values, listed among the indexed stores (Watson Discovery, ElasticSearch, Pinecone and others), `NeuralSeek KB` and `No KnowledgeBase`. The other values are described on [Supported knowledge bases](/knowledge/supported-knowledgebases/) and [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

![The KnowledgeBase Type dropdown open with Virtual KB selected, showing the start of the option list: Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch](/img/neural-config/knowledgebase-connection@kb-virtual--options-knowledgebase-type.png)

With `Virtual KB` selected, the section holds exactly four fields:

- **KnowledgeBase Type** — `Virtual KB`.
- **KnowledgeBase Language** — present for every type; see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) and [Language handling](/configuration/language/).
- **Notes** — a free-text box, present for every type; see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
- **mAIstro Virtual KB agent** — the agent dropdown, described in the next section.

Nothing else appears. There are no field-mapping or connection settings for this type: no **Curation Data Field**, **Link Field**, **Document Name Field** or **Filter Field**, and no endpoint, index or API key. What the agent returns is what Seek works with.

### Pick the agent: mAIstro Virtual KB agent

![The mAIstro Virtual KB agent dropdown, empty because no agent is selected](/img/neural-config/knowledgebase-connection@kb-virtual--maistro-virtual-kb-agent.png)

**mAIstro Virtual KB agent** is the only field `Virtual KB` adds. It appears below **Notes** as soon as the type is `Virtual KB`. Until you choose an agent it is empty, as in the image above, and the KnowledgeBase has nothing to retrieve through.

<!-- UNCONFIRMED: the option list of mAIstro Virtual KB agent was not captured; that it lists saved mAIstro agents is inferred from its label -->

The dropdown offers the mAIstro agents saved in your instance, so build and save the agent in mAIstro before you come here. The same dialog has a similar dropdown, **mAIstro Post-KB Agent** in **KnowledgeBase Tuning**, which lists `Disabled` followed by agent names.

The agent you choose is the one Seek calls for retrieval. Changing it switches the knowledge source for every answer this configuration generates, so treat it like changing the KnowledgeBase itself.

### Save the change

![The Configuration: Default Config dialog with KnowledgeBase Type set to Virtual KB, the empty mAIstro Virtual KB agent dropdown, and Propose Changes and Save in the footer](/img/neural-config/knowledgebase-connection@kb-virtual.png)

Nothing applies until the dialog is saved or proposed. The full path is:

1. Open **Neural Config** and click the **Default Config / Answer Generation** node to open **Edit Configuration** (the dialog is titled **Configuration: Default Config**).
2. Expand **KnowledgeBase Connection**.
3. Set **KnowledgeBase Type** to `Virtual KB`.
4. In **mAIstro Virtual KB agent**, choose your agent.
5. Select **Save**, or **Propose Changes** to submit the change for review. The difference between the two is explained in [Using the Neural Config page](/configuration/neural-config/using-this-page/).
6. Ask a question on the [Seek](/seek/overview/) tab and check that the answer draws on what your agent returned.

The screen does not show whether **Save** checks that an agent is selected, so choose the agent before you save.

### What the agent receives and returns

![Screenshot needed — a Virtual KB agent on the mAIstro canvas, with the node that receives the question at the top, one data-fetch step, and the node that returns the documents at the bottom](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/maistro/virtual-kb-agent.png — mAIstro canvas with a Virtual KB agent: the Virtual KB input node at the top, one data-fetch step, the Virtual KB output node at the bottom. Why: the reader needs to see where the question enters and where the passages leave. -->

The contract between Seek and the agent is simple: the question goes in, documents come out. Everything in between is an ordinary mAIstro agent — web fetches, REST calls, database connectors, variables and filters.

<!-- UNCONFIRMED: node names Virtual KB - In / Virtual KB - Out under RAG Tools, NTL virtualKbIn / virtualKbOut, the variable virtualKbIn.contextQuery, the virtualKbOut parameters context, kbCoverage, kbScore, url and document, and the JSON array of document/url/score/passage objects — old page (seek/virtual-kb, previous docs); not yet checked against the NTL reference -->

The agent starts with a node that receives the question — **Virtual KB - In** (`virtualKbIn`) under **RAG Tools** — which exposes the query, with conversational context applied, as `virtualKbIn.contextQuery`. It ends with a node that returns the content — **Virtual KB - Out** (`virtualKbOut`). Its `context` parameter carries the passages, and it also accepts `kbCoverage`, `kbScore`, `url` and `document`. To return several documents rather than one, put a JSON array of objects in `context`, each with `document` (the title), `url`, `score` and `passage`.

### How Virtual KB differs from No KnowledgeBase

![KnowledgeBase Type set to No KnowledgeBase: only KnowledgeBase Language and Notes remain, with no further field](/img/neural-config/knowledgebase-connection@kb-type-no-knowledgebase--knowledgebase-type.png)

Both values remove the connection and field-mapping settings of the indexed stores, so the two sections look alike. The difference is one field:

- With **KnowledgeBase Type** = `No KnowledgeBase`, the section shows **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**, and nothing else.
- With `Virtual KB`, the same three fields plus **mAIstro Virtual KB agent**.

Pick `Virtual KB` when an agent should supply the documents Seek answers from. What Seek does when no KnowledgeBase is connected is covered on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### KnowledgeBase Tuning with a Virtual KB

![The KnowledgeBase Tuning section: Document Score Range, Max Documents per Seek, Document Date Penalty, Expansion Window, KnowledgeBase Query Cache (minutes) and mAIstro Post-KB Agent](/img/neural-config/knowledgebase-tuning--document-score-range.png)

The **KnowledgeBase Tuning** section stays in the dialog when `Virtual KB` is selected, with settings such as **Snippet size** and **KnowledgeBase Query Cache (minutes)**.

<!-- UNCONFIRMED: whether KnowledgeBase Tuning settings (Snippet size, KnowledgeBase Query Cache) act on what a Virtual KB agent returns — not shown on the screen -->

The screen does not say whether these settings act on what a Virtual KB agent returns. If you need to limit, rank or trim results, doing it inside the agent is the approach you control directly. What each tuning setting does is described on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/); for the answer caches, see [Caching](/seek/caching/).

## FAQ

### How do I point Seek at a mAIstro agent instead of a KnowledgeBase?

In Neural Config, open **KnowledgeBase Connection**, set **KnowledgeBase Type** to `Virtual KB`, choose the agent in **mAIstro Virtual KB agent**, then select **Save** (or **Propose Changes** to submit it for review).

### Why don't I see Curation Data Field, Link Field or an index name?

With `Virtual KB` the section has no field-mapping or connection settings. It shows only **KnowledgeBase Type**, **KnowledgeBase Language**, **Notes** and **mAIstro Virtual KB agent**. The agent decides what it returns, so filtering and shaping happen inside the agent.

### The mAIstro Virtual KB agent list is empty — what now?

Build and save the agent in [mAIstro](/maistro/overview/) first, then come back to **KnowledgeBase Connection** and choose it in **mAIstro Virtual KB agent**.

### What is the difference between Virtual KB and No KnowledgeBase?

`No KnowledgeBase` adds no field beyond **KnowledgeBase Language** and **Notes**. `Virtual KB` adds the **mAIstro Virtual KB agent** dropdown, and Seek answers from what that agent returns. See [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Do KnowledgeBase Tuning settings apply to a Virtual KB?

The **KnowledgeBase Tuning** section stays in the dialog when `Virtual KB` is selected, but the screen does not say whether settings such as **Snippet size** act on the agent's results. Do any trimming or ranking you depend on inside the agent.
