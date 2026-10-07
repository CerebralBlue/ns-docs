---
title: "Dynamic filters"
description: "Narrow a single seek to a subset of KnowledgeBase documents at query time by typing a DQL filter string into the Seek tab's Filter dialog."
---

## What is it

A dynamic filter narrows the documents a seek can draw from, applied at query time from the
Seek tab. You open the **Filter** dialog, type a filter string into the **Filter Text** box,
and the next seek only considers documents that match. Nothing about the KnowledgeBase or the
configuration changes — the filter scopes that one request.

The string you type is written in DQL (Dynamic Query Language): a small operator-based syntax
that NeuralSeek translates into the query format the connected KnowledgeBase understands. This
is query-time narrowing — a per-request restriction, as opposed to the always-on scoping set on
the [Corporate Document Filter](/governance/corporate-document-filter/).

## Why it matters

Dynamic filters let you restrict a seek to a specific group of documents without editing the
dataset or changing the instance configuration. Because DQL supports several operators, you can
combine as many or as few facets as a question needs, rather than matching a single metadata
property exactly. It is the query-time counterpart to the static document filtering set in
Neural Config.

## When to use it

Use a dynamic filter when a single seek should look only at part of the KnowledgeBase — one
product's documents, one date range, one section — and you do not want that restriction to
persist across other requests. For a filter that applies to every seek, set it in the
[Corporate Document Filter](/governance/corporate-document-filter/) instead.

Dynamic filtering is only available for KnowledgeBase types that expose a **Filter Field**
control in Neural Config. With the built-in NeuralSeek KB there is no Filter Field, so there is
nothing to type a DQL string against.

## How it works

### The Filter dialog on Seek

On the [Seek](/seek/overview/) tab, the funnel button labelled **Filter** sits to the right of
the toolbar, next to **Personalize**. Clicking it opens the **Filter** dialog.

![The Filter dialog's Filter Text box with its on-screen help text](/img/seek/filter--filter-text.png)

The dialog holds a single **Filter Text** box (placeholder `mydoc.pdf`) with this help text
above it:

> Filter KnowledgeBase documents by the filter field set on the Configure tab. Enter multiple
> terms separated by a "|" or a comma for an "or" filter.

Type your filter string into **Filter Text**, then:

- **Save** applies the filter to the next seek.
- **Clear** empties the Filter Text box.
- **Close** dismisses the dialog.

The **Filter** button is the shared entry point for this dialog; it is also named on the
[Seek overview](/seek/overview/) page.

### Filter Text (DQL) syntax

The **Filter Text** box takes a DQL string. The on-screen help text confirms the OR behaviour:
separate multiple terms with a `|` or a comma to match documents that satisfy **any** of them.

The operators below describe the DQL that NeuralSeek's parser accepts:

| Operator          | Meaning                       | Example                                |
| ----------------- | ----------------------------- | -------------------------------------- |
| `.`               | JSON hierarchy delimiter      | `content.title:neu*`                   |
| `""`              | Phrase query (exact phrase)   | `url:"neuralseek"`                     |
| `::`              | Exact match                   | `section_name::"Overview"`             |
| `::!`             | Not an exact match            | `content::!"large models"`             |
| `()`              | Nested grouping               | `(title:"AI" \| title:"ML")`           |
| `\|`              | OR                            | `title:"AI" \| title:"ML"`             |
| `,`               | AND                           | `title:"AI", content:"neural nets"`    |
| `>` `<` `>=` `<=` | Numerical / date comparison   | `content.date_created >= "2023-01-01"` |
| `:`               | Includes (broad match)        | `title:"LLMs"`                         |
| `:!`              | Does not include              | `content:!"profanity"`                 |
| `:*`              | Field exists / wildcard value | `author:*`                             |
| `:*!`             | Field does not exist          | `author:*!`                            |

The parser distinguishes data types and allows an intentionally blank value:

- `age::25` is a **number**, while `age::"25"` is a **string**.
- `available::true` is a **boolean**, while `available::"true"` is a **string**.
- `value::""` is an intentionally blank value.

Given a document such as:

```json title="example document"
{
  "document_id": "doc_001",
  "section_name": "Overview",
  "content": {
    "title": "NeuralSeek Use Cases Overview",
    "date_created": "2023-02-15"
  }
}
```

these strings illustrate the syntax you type into **Filter Text**:

- `section_name::"Overview"` — only documents whose `section_name` is exactly `Overview`.
- `content.date_created >= "2023-01-01"` — only documents created on or after that date.
- `content.title:neu*` — documents whose `content.title` starts with `neu` (e.g. "NeuralSeek").

:::caution[Elasticsearch and watsonx Discovery]
Because of the way Elasticsearch tokenizes text, dynamic filters do not always work as expected
on properties that are not of type `keyword`. For reliable filtering, index the important
properties as `keyword`, or add a duplicate nested property of type `keyword` for use with
dynamic filters. (From the previous documentation.)
:::

### Filter Field (DQL_Pushdown) — set up in Neural Config

Before a filter string does anything, the KnowledgeBase connection must be told to pass filters
through. That is the **Filter Field** control, a dropdown in the **KnowledgeBase Connection**
section of Neural Config (Neural Config ▸ Default Config ▸ Edit Configuration). For dynamic
filters, select **DQL_Pushdown** so queries carry the filter string through to the
KnowledgeBase. This control is owned and fully documented on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

The **Filter Field** dropdown appears for these KnowledgeBase types: **Discovery**, **watsonx
Discovery**, **Elastic (ElasticSearch)**, **Kendra**, **OpenSearch**, **Bedrock**, **IBM CAS**,
**Pinecone**, **Milvus**, **Postgres** and **ChromaDB**. With the built-in NeuralSeek KB there is
no Filter Field, and dynamic filters do not apply.

The same DQL string can be applied outside the Seek tab:

<!-- UNCONFIRMED: the mAIstro KB Search node and the API filter parameter are from the previous documentation; neither surface was captured this run. -->

- In mAIstro, pass the filter on the `KB Search` node.
- Through the API, pass the DQL string as the `filter` parameter of the Seek call.

## FAQ

**Where do I type a dynamic filter on the Seek tab?**
Click the funnel **Filter** button to open the Filter dialog, type the filter string into the
**Filter Text** box, and click **Save**. The filter applies to the next seek.

**How do I combine terms with OR or AND?**
Separate terms with a `|` or a comma for an OR filter — this is stated in the dialog's own help
text. Use `,` between whole clauses for an AND filter (for example `title:"AI", content:"ML"`).

**Why is there no Filter Field option for my KnowledgeBase?**
The **Filter Field** dropdown (with its **DQL_Pushdown** option) only appears for the Discovery,
watsonx Discovery, ElasticSearch, Kendra, OpenSearch, Bedrock, IBM CAS, Pinecone, Milvus,
Postgres and ChromaDB KnowledgeBase types in
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). The built-in
NeuralSeek KB does not expose it.

**Can I pass a filter through the API instead of the UI?**
Yes. Pass the same DQL string as the `filter` parameter of the Seek API call; you do not have to
open the Filter dialog.

**Does a dynamic filter change my configuration or dataset?**
No. It narrows only the seek you apply it to — query-time narrowing. For a filter that applies
to every request, use the [Corporate Document Filter](/governance/corporate-document-filter/).
