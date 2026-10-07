---
title: "Dynamic filters"
description: "A dynamic filter is query-time narrowing in NeuralSeek: each question carries a filter value, and only KnowledgeBase documents whose filter field (metadata) matches it are searched."
---

A dynamic filter is **query-time narrowing** of the KnowledgeBase search. Each question — typed on the Seek tab, sent by an application or run by an agent — can carry a filter value, and NeuralSeek searches only the documents whose KnowledgeBase field (a metadata field such as a document name, product or region) matches it. You choose the field once, in the configuration; the value changes with every question. Use it when one KnowledgeBase holds content for several audiences and a question should be answered from one slice of it. A dynamic filter narrows what is searched; the [Corporate document filter](/governance/corporate-document-filter/) is a different feature that removes, per user, documents from what was found.

## How dynamic filters work

A filtered search has three parts: the field the filter is matched against, the value each question carries, and what happens when that value matches nothing.

### Choose the field to filter on

![The end of the KnowledgeBase Connection form for an external KnowledgeBase: Filter Field in the right-hand column above the Re-Sort values list, Static Default Filter Value (when no runtime filter is passed) in the left-hand column, and Enable Advanced Schema below](/img/neural-config/knowledgebase-connection@kb-wxd-panel.png)

The field is set in Neural Config, in the **KnowledgeBase Connection** section of the configuration. Two settings there decide how filtering works:

- **Filter Field** — the KnowledgeBase field that every filter value is matched against, for example the field that holds each document's name or type. The Filter dialog on the Seek tab matches what you type "by the filter field set on the Configure tab", so set this before you test a filter.
- **Static Default Filter Value (when no runtime filter is passed)** — a value applied to every question that arrives without a filter of its own. Use it to give callers that send no filter a default slice of a shared index; it is a default, not a restriction.

**Filter Field** is part of the connection settings of the external KnowledgeBase types: ElasticSearch, watsonx Discovery, Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, OpenSearch, Kendra, Bedrock, IBM CAS, Milvus, Postgres, ChromaDB and Pinecone. Which field to pick depends on how your documents are indexed. Both settings, and the rest of the connection form, are described on [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/); the KnowledgeBase types themselves are on [Supported KnowledgeBases](/knowledge/supported-knowledgebases/).

### Try a filter on the Seek tab

![The Filter dialog: the help text, the Filter Text box with the placeholder mydoc.pdf, and the Clear and Save buttons](/img/seek/filter-panel.png)

The Seek tab lets you check a filter by hand before you build it into an application. The **Filter** button (the funnel icon at the end of the toolbar, after **Personalize**) opens a dialog with one box, **Filter Text**. The dialog's own help text gives the rule: "Filter KnowledgeBase documents by the filter field set on the Configure tab. Enter multiple terms separated by a "|" or a comma for an "or" filter."

To narrow a question on the Seek tab:

1. Select **Filter**.
2. In **Filter Text**, enter the value the filter field must match — for example a document name such as `mydoc.pdf`. To accept several values, separate them with `|` or a comma; a document that matches any one of them is searched.
3. Select **Save**.
4. Ask your question and select **Seek**. The sources listed under **KnowledgeBase Context** show which documents the answer was built from, so you can check that they match the filter.

To remove the filter, select **Filter** again and select **Clear**. The rest of the toolbar is described on [Seek overview](/seek/overview/); **Personalize**, the other optional dialog, is on [Personalization](/seek/personalization/).

### Pass a filter from an application or an agent

In production the filter travels with each request instead of being typed in a dialog.

In a [mAIstro](/maistro/overview/) agent, the `seek` node takes a `filter` parameter, which the NTL reference describes as "A filter to pass to the KB":

```text
{{ seek | query: "..."
           | stump: "..."
           | filter: "..."
           | language: "..."
           | seekLLM: "..." }}
```

The `dynamicPersonalizationOut` node, which ends a [personalization](/seek/personalization/) agent, also takes a `filter` — "The filter string used to filter document queries." — so the agent can choose the filter for each user before the search runs.

<!-- UNCONFIRMED: the Seek API accepts the filter string as a `filter` parameter of the Seek call — old page (seek/dynamic-filters, "Applying filters via the API"); not on a captured screen or probe -->

From an application, pass the filter string as the `filter` parameter of the Seek API call. The API itself is described on [REST and Console APIs](/integrations/rest-and-console-api/).

### When a filter matches nothing

When a filter matches no document, **Relax Filters** and **Must Keep Keys (filters to never remove) separated by comma** decide whether NeuralSeek widens the search and which filters stay applied; both are described on [Platform preferences](/configuration/neural-config/platform-preferences/).

### Filter expressions (DQL)

<!-- UNCONFIRMED: everything in this section — the DQL_Pushdown Filter Field option, the operators, typed values, the per-KnowledgeBase support and the Elasticsearch keyword caution — comes from the old page (seek/dynamic-filters); the Filter Field option list was never captured, and the screen documents only the "|" / comma "or" rule. In DQL expressions the old page describes the comma as AND, while the Filter dialog's help text says a comma means "or". -->

For more than a list of values, a filter can be written as a Dynamic Query Language (DQL) expression. DQL is turned on by setting **Filter Field** to `DQL_Pushdown`; NeuralSeek then converts each expression into the query format of the connected KnowledgeBase, including KnowledgeBases that have no filter language of their own.

| Operator               | Meaning                                       | Example                                         | Supported by                                                 |
| ---------------------- | --------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| `.`                    | A field nested inside another field           | `content.date_created >= "2023-01-01"`          | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `""`                   | Exact phrase, word order kept                 | `url:"neuralseek"`                              | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `::`                   | Exact match of the whole field                | `section_name::"Overview"`                      | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `::!`                  | Not an exact match                            | `content::!"large models"`                      | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `()`                   | Groups parts of an expression                 | `(title:"AI" \| title:"ML") , content:"deep learning"` | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra |
| `\|`                   | OR                                            | `title:"AI" \| title:"machine learning"`        | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `,`                    | AND                                           | `title:"AI", content:"neural networks"`         | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `>` `<` `>=` `<=`      | Number or date comparison                     | `revision>5, revision<10`                       | Watson Discovery, watsonx Discovery, ElasticSearch, Kendra   |
| `:`                    | Field includes the term                       | `title:"LLMs"`                                  | Watson Discovery, watsonx Discovery, ElasticSearch           |
| `:!`                   | Field does not include the term               | `content:!"profanity"`                          | Watson Discovery, watsonx Discovery, ElasticSearch           |
| `:*`                   | Field exists                                  | `author:*`                                      | Watson Discovery, watsonx Discovery, ElasticSearch           |
| `:*!`                  | Field does not exist                          | `author:*!`                                     | Watson Discovery, watsonx Discovery, ElasticSearch           |

Values are typed: `age::25` compares a number and `age::"25"` a string; `available::true` is a boolean and `available::"true"` a string; `value::""` matches an intentionally blank value. A trailing `*` after a value matches by prefix: `content.title:neu*` matches titles that start with "neu", which is not the same as `:*` (field exists). A phrase query (`""`) always compares as a string. On ElasticSearch and watsonx Discovery, filters work best on fields of type `keyword`: index the fields you filter on as `keyword`, or add a nested `keyword` copy of them.

## When to use dynamic filters

- **One KnowledgeBase, several audiences.** Product lines, regions, customers or document sets share an index, and each question should be answered from one of them — pass the product, region or set as the filter.
- **A user or a page already knows the context.** A support portal for one product, or a chatbot embedded on one section of a site, sends the matching filter with every question so answers never drift to unrelated documents.
- **Testing a single document.** On the Seek tab, filter on one document's name to see how NeuralSeek answers from that document alone.
- **A default slice for callers that send no filter.** When most questions should see the same part of the index, set **Static Default Filter Value (when no runtime filter is passed)** instead of passing the same filter each time.

A filter typed on the Seek tab or sent by the calling application is not a security boundary: whoever sends the question chooses it. For per-user document security, use the [Corporate document filter](/governance/corporate-document-filter/).

:::note[Under review]
[Platform preferences](/configuration/neural-config/platform-preferences/) recommends listing in **Must Keep Keys (filters to never remove) separated by comma** any filter that controls what a user may see, which treats such a filter as an access control. This page says a filter supplied by the caller is not a security boundary. Which guidance applies is being confirmed.
:::

## FAQ

### How do I filter on several values at once?

Separate them with `|` or a comma in **Filter Text**. A document that matches any one of the values is searched.

### Why does my filter change nothing?

The value is matched against the field chosen in **Filter Field**, in the KnowledgeBase Connection section of the configuration. Check that a field is set there and that the value you typed matches what that field holds in your documents.

### What happens when no document matches the filter?

**Relax Filters** in Platform Preferences decides. With it on, NeuralSeek relaxes the filter and searches again; the filter keys listed in **Must Keep Keys (filters to never remove) separated by comma** stay applied.

### Can I use a dynamic filter to control who sees which documents?

Not when the caller supplies the filter. A filter typed on the Seek tab or sent with an API request narrows what is searched for one question, and whoever sends the question chooses it, so it is not a security boundary. Per-user document security is the job of the [Corporate document filter](/governance/corporate-document-filter/).

## Related

- [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/) — Filter Field and Static Default Filter Value
- [Platform preferences](/configuration/neural-config/platform-preferences/) — Relax Filters and Must Keep Keys
- [Corporate document filter](/governance/corporate-document-filter/) — per-user removal of documents from what was found
- [Seek overview](/seek/overview/) — the rest of the Seek tab
- [Personalization](/seek/personalization/) — the other optional dialog on the Seek tab
- [Supported KnowledgeBases](/knowledge/supported-knowledgebases/)
- [REST and Console APIs](/integrations/rest-and-console-api/)
- [mAIstro overview](/maistro/overview/)
