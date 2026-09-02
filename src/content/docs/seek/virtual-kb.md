---
title: 'Virtual KB'
description: 'Use a mAIstro flow as a KnowledgeBase, so Seek can answer from web search, REST APIs, databases or several sources at once instead of one indexed corpus.'
---

## What is it

A Virtual KB is a mAIstro flow used as a KnowledgeBase. Instead of pointing NeuralSeek at one
indexed corpus, you build a flow that fetches content — from a web search, a REST API, a
database, or several of these together — and hand what it returns back to Seek for answer
generation.

The flow sits between the two RAG Tools nodes: **Virtual KB - In** receives the query, and
**Virtual KB - Out** returns the passages Seek will use.

## Why it matters

Some knowledge cannot be indexed ahead of time. It lives behind an API, changes hourly, or sits
in a system nobody is going to export into a search index. A Virtual KB reaches it at query time.

It also lets one KnowledgeBase span several sources at once, so an answer can be synthesized
across a web search and your own documentation in a single Seek.

The trade-off follows from the mechanism: the flow runs at query time, so answers depend on
external calls completing. Weigh that against an indexed KnowledgeBase, which has already done
its retrieval work before the question arrives.

## When to use it

- The source is an API or a live website rather than a document set.
- Content changes faster than an index can be rebuilt.
- You want several sources combined into one KnowledgeBase.
- You need to filter, reshape or enrich results before Seek sees them — which the flow can do,
  because it is a full mAIstro flow.

## How it works

### Start from the example template

1. Go to the **mAIstro** tab in your NeuralSeek instance.
2. Open **Example Templates** and search for **Virtual KB**.

The template uses the **Virtual In** and **Virtual Out** nodes, found under **RAG Tools** in the
sidebar. It passes a DuckDuckGo Search connector and a REST API connector pointed at Wikipedia
to the LLM for answer generation, which makes the open web the knowledge source.

```text
{{ virtualKbIn  }}
{{ duckSearch  | query: "<< name: virtualKbIn.contextQuery>>" }}=>{{ variable  | name: "parallelDuckRaw" }}
{{ post  | url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=<< name: virtualKbIn.contextQuery, prompt: true >>" | body: "" | headers: "" | username: "" | password: "" | apikey: "" | operation: "POST" | jsonToVars: "true" }}=>{{ varsToJSON  | path: "query.search" | variable: "s1" | includePath: "false" | output: "true" }}=>{{ arrayFilter  | filter: "0-3" | filterType: "IndexRange" }}=>{{ reMapJSON  | match: "title" | replace: "document" }}=>{{ reMapJSON  | match: "snippet" | replace: "passage" }}=>{{ regex  | match: "/(\"document\":\")([^\"]+)/g" | replace: "$1$2\",\"url\":\"https://en.wikipedia.org/wiki/$2" | group: "" }}=>{{ regex  | match: "/^\[/" | replace: "" | group: "" }}=>{{ regex  | match: "/<\/?span.*?>/g" | replace: "" | group: "" }}=>{{ variable  | name: "wikipedia" }}
<< name: parallelDuckRaw, prompt: false >>=>{{ jsonEscape  }}=>{{ variable  | name: "duck" }}=>
<< name: duck, prompt: false >>=>{{ regex  | match: "/https?:\/\/[^\s)]+/g" | replace: "" | group: "0" }}=>{{ variable  | name: "url" }}
{{ virtualKbOut  | context: "[{
\"document\": \"DuckDuckGo Search\",
\"url\": \"<< name: url >>\",
\"passage\": \"<< name: duck, prompt: false >>\"
},<< name: wikipedia, prompt: false >>" | kbCoverage: 0 | kbScore: 0 | url: "<< name: url >>" | document: "" }}
```

### Point the KnowledgeBase at it

1. Go to the **Configure** tab.
2. Expand the **KnowledgeBase Connection** accordion.
3. Set **KnowledgeBase Type** to **Virtual KB**.
4. Set **mAIstro Virtual KB template** to your flow — `ex_Virtual_KB` for the example template.
5. Select the red **Save** icon at the bottom of the screen.

### Seek against it

Go to the [Seek tab](/seek/overview/), ask a question and select **Seek**. Ask "Who is Taylor Swift?" against
the example template and the answer is synthesized from both the DuckDuckGo and Wikipedia
results; the semantic analysis reports the jumps between source articles, and coverage comes back
high — 99% in the documented run — because Wikipedia carries so much on the subject.

Expand **KnowledgeBase Context** under the answer to see each source individually. The provenance
highlights show which keywords and phrases were taken from which source.

![Screenshot needed — a Seek answer with KnowledgeBase Context expanded, showing each Virtual KB source separately](/img/_placeholder.svg)

<!-- SCREENSHOT: A Seek result against a Virtual KB with the KnowledgeBase Context section
     expanded, so the per-source passages and the provenance highlights are both visible.
     Why: the value of a Virtual KB is seeing which source contributed which sentence — that is
     the shape of the output, and prose cannot show it. -->

## Building your own flow

Any source reachable from mAIstro can back a Virtual KB: the built-in database, KnowledgeBase and
web-search connectors, or anything else through the REST API connector node.

1. Go to **mAIstro** and select the **Virtual KB - In** node, under **RAG Tools**. It exposes
   several variables for use inside the flow, including `virtualKbIn.contextQuery`.
2. Select the **Website Data** node under **Get Data**. It links below the first node
   automatically.
3. Select the gear icon and enter a URL — here, a Google search:
   `https://www.google.com/search?gfns=1&q=<< name: virtualKbIn.contextQuery>>`
4. Select the **Set Variable** node under **Control Flow**, drag it to the right of the Website
   Data node to chain it, then set the variable name with the gear icon — `google` in this
   example.
5. Add a second **Website Data** node with another URL — `https://documentation.neuralseek.com/`
   in this example — and chain a second **Set Variable** to it, named `docs`. That adds the
   NeuralSeek documentation as a second reference source, pulled statically from the site.
6. Select the **Virtual KB - Out** node under **RAG Tools**. Use the gear icon to define the
   passage piped back into Seek — here, `<< name: google >>\n<< name: docs >>`. You can also
   preset `kbCoverage`, `kbScore`, `url` and the document name — `Virtual KB` in this example.
7. Save the flow with a unique name, `websiteKB` in this example, then point the KnowledgeBase
   Connection at it as above.

`virtualKbIn.contextQuery` is what carries the user's query into the fetch, so the search runs
against what was actually asked. Because the two fetches are separate steps rather than a chain,
this flow pulls both sites at once on each Seek.

![Screenshot needed — the finished websiteKB flow on the mAIstro canvas](/img/_placeholder.svg)

<!-- SCREENSHOT: The completed websiteKB flow on the mAIstro canvas — the two Website Data →
     Set Variable chains sitting between Virtual KB - In and Virtual KB - Out.
     Why: step 4 is a canvas gesture ("drag it to the right to chain it") and the layout of the
     nodes is what determines whether fetches run in parallel or in sequence. Prose cannot show
     either. -->

```text

{{ virtualKbIn  }}
{{ web  | url: "https://www.google.com/search?gfns=1&q=<< name: virtualKbIn.contextQuery>>" }}=>{{ variable  | name: "google" }}
{{ web  | url: "https://documentation.neuralseek.com/" }}=>{{ variable  | name: "docs" }}
{{ virtualKbOut  | context: "<< name: google >>\n<< name: docs >>" | kbCoverage: 0 | kbScore: 0 | url: "" | document: "Virtual KB" }}

```

:::note
This example concatenates everything into a single document for simplicity. To return several
documents instead, build a JSON object containing an array of document objects, each with
`document` (the title), `url`, `score` and `passage`.
:::

Point the KnowledgeBase Connection at `websiteKB` and seek again — "Does NeuralSeek provide a
Hands-On Lab?" is the documented example. Expanding **KnowledgeBase Context** now shows which part
of the answer came from the Google search and which came from the documentation URL.

## FAQ

### How do I see which source an answer came from?

Expand **KnowledgeBase Context** under the answer in the Seek tab. Each Virtual KB source appears
separately, with provenance highlights showing what was drawn from it.

### Can a Virtual KB return more than one document?

Yes. Return a JSON array of document objects from **Virtual KB - Out**, each with `document`,
`url`, `score` and `passage`. Returning one concatenated passage is only the simplest case.

### Does a Virtual KB fetch on every question?

The flow runs when a Seek needs it, which is what keeps the content current — and what makes an
unreliable source visible in answer latency. Whether the [caches](/seek/caching/) can serve an
answer without running the flow at all is not documented; treat "every Seek" as the worst case
when sizing.

Whether fetches inside a flow run at once or one after another depends on how you built it:
separate steps run together, a chain with `=>` runs in order.
