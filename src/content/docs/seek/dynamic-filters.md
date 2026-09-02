---
title: 'Dynamic filters'
description: 'Dynamic Query Language (DQL) — the filter syntax that narrows which KnowledgeBase documents a Seek query can draw on, where to enable it, and the full operator reference.'
---

## What is it

Dynamic Query Language (DQL) is a rule- and operator-based filter syntax for narrowing which
documents a query is allowed to draw on. You write a filter expression, NeuralSeek interprets it
at query time, and the search runs against the reduced set — without changing the underlying
data.

NeuralSeek translates DQL into whatever query format the connected KnowledgeBase understands, so
a KnowledgeBase with no filter syntax of its own can still be filtered. Dynamic filtering is
supported on **Watson Discovery**, **watsonx Discovery**, **Elasticsearch** and — for some
operators — **Kendra**. It is not available on every KnowledgeBase type.

## Why it matters

Filtering by a single metadata property with an exact match is rigid: one field, one value, no
combinations. DQL lets you filter on as many or as few facets as you need, combine them with AND
and OR, compare dates and numbers, and test whether a field exists at all.

It restricts *which documents* are searched. To change *how the answer is written* for a given
user, see [Personalization](/seek/personalization/) instead.

## When to use it

- Restricting answers to a department, region, product line or document type.
- Excluding drafts, superseded revisions or anything past a cut-off date.
- Filtering on nested metadata, where the field lives inside a JSON structure.
- Any query where the right documents exist but the wrong ones keep winning.

## How it works

### Enable DQL on the KnowledgeBase connection

1. Go to the **Configure** tab, **KnowledgeBase Connection** section.
2. In the **Filter Field** drop-down, select `DQL_Pushdown`.

Filters passed from the Seek tab, from a mAIstro `KB Search` node, or on the API's `filter`
parameter are now interpreted as DQL.

![Screenshot needed — the Filter Field drop-down in KnowledgeBase Connection, set to DQL_Pushdown](/img/_placeholder.svg)

<!-- SCREENSHOT: Configure > KnowledgeBase Connection with the Filter Field drop-down open and
     DQL_Pushdown selected.
     Why: it sits low in a dense two-column form with no nearby heading, and it is the setting
     that gates the whole feature — a filter silently does nothing until it is set. -->

:::caution[Elasticsearch and watsonx Discovery]
Because of the way Elasticsearch tokenizes, dynamic filters do not always behave as expected on
properties that are not of type `keyword`. Either set the important fields to `keyword` in your
index, or add a duplicate nested property of type `keyword` for filtering to use.
:::

### Applying a filter

**In Seek** — open the [Seek tab](/seek/overview/), select the filter icon in the toolbar beside
**Seek** and **Personalize**, enter your DQL string in **Filter Text**, and select **Save**. The
filter is not applied until you save it.

![Screenshot needed — the filter icon in the Seek toolbar and the Filter modal it opens](/img/_placeholder.svg)

<!-- SCREENSHOT: The Seek tab's toolbar with the funnel icon called out, and the Filter modal it
     opens — the Filter Text field with its Clear and Save buttons visible.
     Why: it is an unlabelled funnel icon on a busy toolbar, so prose cannot make it findable,
     and the Save step is easy to miss. -->

**In mAIstro** — add the filter to the `KB Search` node, in its **The KnowledgeBase filter**
field. The NTL reference calls the same node **KB Documentation**.

**Through the API** — pass the filter string, plain or DQL, as the `filter` parameter of the Seek
API call.

### Value types

The parser distinguishes numbers, booleans and strings, and accepts a deliberately blank value:

| Expression | Type |
| --- | --- |
| `age::25` | number |
| `age::"25"` | string |
| `available::true` | boolean |
| `available::"true"` | string |
| `value::""` | intentionally blank |

### Worked examples

Given this document:

```json
{
	"document_id": "doc_001",
	"section_name": "Overview",
	"content": {
		"title": "NeuralSeek Use Cases Overview",
		"text": "An introductory guide to NeuralSeek use cases, focusing on application and benefits.",
		"date_created": "2023-02-15"
	},
	"author": "NeuralSeek Bot"
}
```

Exact match — only documents whose `section_name` is exactly `Overview`:

```plaintext
section_name::"Overview"
```

Date comparison on a nested field — documents created on or after 1 January 2023:

```plaintext
content.date_created >= "2023-01-01"
```

Wildcard — documents whose `content.title` starts with `neu`, so "NeuralSeek" and "neurobiology"
both match:

```plaintext
content.title:neu*
```

## Operator reference

These operators apply when **Filter Field** is set to `DQL_Pushdown`. In the plain filter field a
comma separates values as an OR instead — see [Tuning answers](/seek/tuning/).

Every operator below works on Watson Discovery, watsonx Discovery and Elasticsearch. The last
column says whether Kendra supports it too.

| Operator | Name | What it does | Example | Also on Kendra |
| --- | --- | --- | --- | --- |
| `.` | JSON hierarchy delimiter | Reaches a field inside a nested JSON structure. | `title.subsection:"AI"` | yes |
| `""` | Phrase query | Exact phrase match within a field, word order preserved. Converts all values to strings, even on KnowledgeBases with native number, boolean or date types. | `url:"neuralseek"` | yes |
| `::` | Exact match | Field content must match the term exactly. Stricter than `:` and `""` — no partial matches. | `content::"AI"` | yes |
| `::!` | Not an exact match | Excludes documents that exactly match the term. Negation of `::`. | `content::!"large models"` | yes |
| `()` | Nested grouping | Groups expressions to control the order of operations. | `(title:"AI" \| title:"ML") , content:"deep learning"` | yes |
| `\|` | OR | Matches documents containing at least one of the terms. | `title:"AI" \| title:"machine learning"` | yes |
| `,` | AND | Requires both terms to appear. | `title:"AI", content:"neural networks"` | yes |
| `>` `<` `>=` `<=` | Numerical and date comparison | Ranges and thresholds on numbers or dates. | `publish_date>=2023-01-01`<br />`revision>5, revision<10` | yes |
| `:` | Includes | Broad match — the term appears anywhere in the field. | `title:"LLMs"` | no |
| `:!` | Does not include | Excludes documents containing the term in that field. Negation of `:`. | `content:!"profanity"` | no |
| `:*` | Field exists | True when the field is present, whatever its content. | `author:*` | no |
| `:*!` | Field does not exist | True when the field is absent. | `author:*!` | no |

:::note
The prefix wildcard shown earlier — `content.title:neu*` — is a trailing `*` on a term, which is
not the same thing as `:*`. The old documentation described `:*` twice, once as "field exists"
and once as "wildcard", with the same example both times, so the two are documented here as one
operator meaning "the field is present".
:::

<!-- ASK: confirm whether `:*` and a trailing-star prefix wildcard are one operator or two. One
     live test settles it: run `author:*`, `author:neu*` and `author:*` against a document with no
     author field. Tracked in _private/seek-migration-questions.md. -->

## FAQ

### Why is my filter matching nothing on Elasticsearch?

Most likely the field is not of type `keyword`. Elasticsearch tokenizes other types, so filters
on them behave unpredictably. Reindex the field as `keyword`, or add a `keyword` duplicate for
filtering.

### Why is my DQL filter being ignored?

Almost always because **Filter Field** is not set to `DQL_Pushdown` in the KnowledgeBase
Connection settings. Without it the filter string is treated as a plain value, not parsed as DQL.
In the Seek tab, also check you selected **Save** in the Filter modal.

### Which KnowledgeBases support DQL?

Watson Discovery, watsonx Discovery and Elasticsearch support every operator in the table above.
Kendra supports the first eight but not `:`, `:!`, `:*` or `:*!`. Other KnowledgeBase types do
not support dynamic filtering.

### Can I filter on a field inside nested JSON?

Yes, with the `.` delimiter — `content.date_created`, `title.subsection`. It works to any depth
your documents have.

### Does filtering change the answer, or just the sources?

Just the sources. A filter restricts which documents can be retrieved; everything after that —
generation, scoring, caching — is unchanged.
