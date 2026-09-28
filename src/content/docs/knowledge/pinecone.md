---
title: "Pinecone setup"
description: "To use a Pinecone index as NeuralSeek's knowledge base, set KnowledgeBase Type to Pinecone in the KnowledgeBase Connection section of Neural Config, enter the index name, namespace and API key, and map your records' metadata to the Curation Data, Link and Document Name fields."
---

## What is it

Pinecone is a hosted vector database. NeuralSeek can use a Pinecone index as its knowledge base:
when a user asks a question, NeuralSeek searches your index for the closest records and builds
the answer from the passages it gets back.

You connect it in **Neural Config**, in the **KnowledgeBase Connection** section of the
configuration dialog, by choosing `Pinecone` as the **KnowledgeBase Type**. That choice replaces
the section's fields with a Pinecone field set: where the index is, how to read your records'
metadata, and how to filter and re-rank what comes back.

## Why it matters

The Pinecone field set has no upload control: you embed and upload the records with your own
tooling (an example is on this page), and NeuralSeek reads them. So it has to be told two things: how to reach the index, and which
metadata key in each record holds the passage text, the source link and the document name.
Those keys supply the passage text, the link a user can follow and the name of the source
document. A key that does not exist in your records leaves that part empty, even when the vector
search itself finds the right record.

## When to use it

- **You already keep your content in Pinecone**, embedded by your own pipeline, and want
  NeuralSeek to answer from it without moving the data.
- **You want to choose the embedding model yourself.** The index is built with a model you pick,
  and NeuralSeek queries it with the matching model from
  [Embedding Models](/configuration/neural-config/embedding-models/).
- **You need metadata filtering or pinned results** on a vector store: the Pinecone field set has
  a filter field and a re-sort list.

When it is the wrong tool: if you do not have an index yet and just want to upload documents,
NeuralSeek's own store (`NeuralSeek KB`) needs no external account. Other stores, including
Milvus, are on the same **KnowledgeBase Type** list; compare them on
[Supported knowledge bases](/knowledge/supported-knowledgebases/).

## How it works

Open **Neural Config**, click the **Default Config / Answer Generation** node in the routing tree
to open the **Configuration: Default Config** dialog, and expand **KnowledgeBase Connection**.
Every field described below appears only when **KnowledgeBase Type** is `Pinecone`.

![The Configuration: Default Config dialog with the KnowledgeBase Connection section expanded and KnowledgeBase Type set to Pinecone: KnowledgeBase Language, Notes, the three Pinecone.io boxes and the metadata field dropdowns, with Propose Changes and Save in the footer](/img/neural-config/knowledgebase-connection@kb-pinecone.png)

### Before you start: a Pinecone index

Create the index in your Pinecone account first. A vector index has a fixed dimension, and it
must match the embedding model that NeuralSeek will query it with. The model itself is not set in
this section: add it in [Embedding Models](/configuration/neural-config/embedding-models/),
where the model card's **KB Search** function marks the model used for knowledge-base retrieval.

<!-- UNCONFIRMED: vector sizes per embedding model (ada-002 1536, 3-small 1536, 3-large 3072, infloat-e5-small-v2 384) — from the earlier version of this page; not shown on any NeuralSeek screen -->

Typical vector sizes: `text-embedding-ada-002` 1536, `text-embedding-3-small` 1536, `text-embedding-3-large` 3072, `infloat-e5-small-v2` 384.

### Pick Pinecone as the KnowledgeBase Type

Open the **KnowledgeBase Type** dropdown and choose `Pinecone`. The list is long and scrolls;
`Pinecone` sits below the first few entries. **KnowledgeBase Language** and **Notes** stay at the
top of the section as they are for every store. What the other types are and what each needs is
covered in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) and
[Supported knowledge bases](/knowledge/supported-knowledgebases/).

![The KnowledgeBase Type dropdown open over the KnowledgeBase Connection section, Pinecone as the current value and the list showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch with a scrollbar](/img/neural-config/knowledgebase-connection@kb-pinecone--options-knowledgebase-type.png)

Picking a type only changes the form. Nothing is stored until you save the dialog (see
[Save and test with a Seek](#save-and-test-with-a-seek)).

### Connect to your Pinecone index

Three text boxes tell NeuralSeek where your records are:

- **Pinecone.io Index Name** — the name of the index you created in Pinecone.
- **Pinecone.io Index Namespace** — the namespace inside that index that holds your records.
  Namespaces are a Pinecone concept for partitioning one index; see
  [Pinecone's documentation](https://docs.pinecone.io/) for how they work.
- **Pinecone.io API Key** — an API key from the Pinecone project that holds the index. Treat it
  as a secret.

The screen marks none of the three as required and gives no help text for them, but NeuralSeek
cannot reach the index without all three.

![The KnowledgeBase Connection section with Pinecone selected: KnowledgeBase Type, KnowledgeBase Language and Notes at the top, then empty Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key boxes, the Curation Data Field, Link Field, Document Name Field and Attribute sources dropdowns, and the Propose Changes and Save footer](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

### Map your record metadata

Each Pinecone record carries a vector and a metadata object. Three dropdowns name the metadata
keys NeuralSeek reads from it:

- **Curation Data Field** — the key that holds the record's text content, the passage itself.
  The field shows `text` when Pinecone is first picked.
- **Link Field** — the key that holds the document's URL, used as the source link. The field
  shows `link`.
- **Document Name Field** — the key that holds the document's name or title, used as the source
  name. The field shows `title`.

These dropdowns do not carry a fixed list. When you open one, it shows the current value with a
**Loading data...** row beneath it, and the entries arrive while the list is open. With no index
details filled in, nothing arrives beyond the current value:

| Field                   | The field shows | The open list shows       |
| ----------------------- | --------------- | ------------------------- |
| **Curation Data Field** | `text`          | `text`, Loading data...   |
| **Link Field**          | `link`          | `link`, Loading data...   |
| **Document Name Field** | `title`         | `title`, Loading data...  |

With the three Pinecone.io boxes empty, opening **Curation Data Field**, **Link Field**,
**Document Name Field** or **Attribute sources inside LLM Context by Document Name** shows an
error banner: "The client configuration must have required property: apiKey. You can find the
configuration values for your project in the Pinecone developer console at https://app.pinecone.io."
So the dropdown asks Pinecone for its entries when it opens, and it needs the API key to do so.

The first two lists are in the images below; the **Document Name Field** list is in the image
under [Re-rank with the Re-Sort values list](#re-rank-with-the-re-sort-values-list).

![The Curation Data Field dropdown open: the value text with a tick and a Loading data... spinner row beneath it](/img/neural-config/knowledgebase-connection@kb-pinecone--options-curation-data-field.png)

![The Link Field dropdown open: the value link with a tick and a Loading data... spinner row beneath it](/img/neural-config/knowledgebase-connection@kb-pinecone--options-link-field.png)

<!-- UNCONFIRMED: with a working connection, the list fills with the metadata keys in the index — inferred from the Loading data... row and the apiKey banner; no capture shows a loaded list -->

Once the index details are in place, pick the keys your records actually use. If your records
use `text`, `link` and `title`, the values the form already shows are the right ones.

<!-- UNCONFIRMED: the upload example below (records {id, values, metadata: {text, title, link}} upserted into a namespace with @pinecone-database/pinecone and @langchain/openai) — adapted from the earlier version of this page; not NeuralSeek tooling and not re-run -->

**Example: records that match these fields.** This Node.js script, adapted from an earlier
version of this page, reads JSON files from a `./docs` folder (each with `title`, `text` and
`source_link`), embeds the text with an OpenAI model and upserts one record per file. It is an
illustration of the record shape, not a NeuralSeek tool. Install the two libraries first:

```bash
npm install @pinecone-database/pinecone @langchain/openai
```

```js
import fs from "fs";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

const folder = "./docs";
const pc = new Pinecone({ apiKey: "your-pinecone-api-key" });
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: "your-openai-api-key",
  modelName: "text-embedding-3-small",
});

async function importFiles(indexName, namespace) {
  const records = [];
  for (const file of fs.readdirSync(folder)) {
    const data = JSON.parse(fs.readFileSync(path.join(folder, file)));
    const values = await embeddings.embedQuery(data.text);
    records.push({
      id: data.title,
      values,
      metadata: { text: data.text, title: data.title, link: data.source_link },
    });
  }
  await pc.index(indexName).namespace(namespace).upsert(records);
}

await importFiles("docs", "ns1");
```

With this record shape, **Curation Data Field** = `text`, **Link Field** = `link` and
**Document Name Field** = `title`. The index name and namespace the script passes to
`importFiles` go into **Pinecone.io Index Name** and **Pinecone.io Index Namespace**, and the
index's vector size must match the model the script embeds with.

### Attribute sources inside LLM Context by Document Name

A dropdown with two options:

| Option     | What it does                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `Enabled`  | Passages handed to the LLM are attributed to their source by the **Document Name Field** value. |
| `Disabled` | Passages reach the LLM without that document-name attribution.                                  |

The field shows `Enabled` when Pinecone is first picked.

![The Attribute sources inside LLM Context by Document Name dropdown open with two options, Enabled (ticked) and Disabled](/img/neural-config/knowledgebase-connection@kb-pinecone--options-attribute-sources-inside-llm-context-by-.png)

<!-- UNCONFIRMED: what Enabled and Disabled change in the LLM context — read from the control's label; the screen gives no help text and no answer was compared with the setting changed -->

Keep it on when your document names are meaningful (titles, page names): the LLM can then tell
passages from different documents apart. Consider turning it off when the
**Document Name Field** holds opaque values such as IDs or file hashes, which add nothing for the
LLM to use.

### Filter results

Two controls restrict which records a search can return:

- **Filter Field** — the metadata key that a filter value is matched against. It is empty until
  you choose one.
- **Static Default Filter Value (when no runtime filter is passed)** — a value applied to
  **Filter Field** on every search whose request carries no filter of its own. A filter sent with
  the request takes its place; see [Dynamic filters](/seek/dynamic-filters/) for passing one at
  question time.

Use the static value when one NeuralSeek configuration should only ever see part of a shared
index, for example one product line's documents.

![The whole Pinecone field set from KnowledgeBase Type down: the three Pinecone.io boxes, the Curation Data Field, Link Field, Document Name Field and Attribute sources dropdowns, and on the last row an empty Filter Field dropdown and an empty Static Default Filter Value (when no runtime filter is passed) box, above the Propose Changes and Save footer](/img/neural-config/knowledgebase-connection@kb-pinecone--re-sort-values-list.png)

### Re-rank with the Re-Sort values list

Under the filter controls, the **Re-Sort values list.** block lets you push chosen documents to
the top. The screen explains it in one line: "Enter a prioritized list of values you want to
re-rank above other results, regardless of KB score."

- **Re-Sort Field** — the metadata key whose value is compared against the list. It is empty
  until you choose one.
- The table has two named columns, **Priority** and **Value or RegExp**, and a third column with
  an icon button whose tooltip reads **Add a new row.** Click it to add a row, then enter the
  priority and a value, either a literal or a regular expression.

A result whose **Re-Sort Field** value matches a row is moved above the other results, even when
its KB score is lower. Use it to make an authoritative document (a current policy, an official
guide) win over near-duplicates with similar wording.

![The Pinecone field set with the Document Name Field dropdown open (title and a Loading data... row), and below it Filter Field, Static Default Filter Value, the Re-Sort values list. heading and its description, the Re-Sort Field dropdown and the Priority / Value or RegExp table with the add-row icon](/img/neural-config/knowledgebase-connection@kb-pinecone--options-document-name-field.png)

Below the table, at the end of the Pinecone field set, is an **Enable Advanced Schema** button.
It is not shown in the images on this page, and what it opens is not documented here yet.

### What changes in KnowledgeBase Tuning

The store type also changes one control in the **KnowledgeBase Tuning** section:

- With `NeuralSeek KB`, the section offers a slider from `1` to `10`: **Expansion Window. How many chunks to grab before and after the target chunk.**
- With `Pinecone`, the same place holds a slider from `100` to `1000`: **Snippet size. Use this setting to window relevant details in a document that do not specifically mention the user question, but apply to it.**

The screen does not state the unit of Snippet size.

![The Expansion Window slider as it appears for NeuralSeek KB, from 1 to 10 — with Pinecone, Snippet size (100 to 1000) takes its place](/img/neural-config/knowledgebase-tuning--expansion-window-how-many-chunks-to-grab.png)

Both sliders are explained on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### Save and test with a Seek

The dialog footer has **Propose Changes** and **Save** (both visible at the bottom of the images
above). Nothing in the dialog applies until you press one of them, so NeuralSeek does not query
your index with the new settings until you save. When to use which button is covered on
[Using this page](/configuration/neural-config/using-this-page/).

There is no test-connection button in the KnowledgeBase Connection section for Pinecone. To
check the connection, save, then ask a question on the **Seek** tab
([Seek overview](/seek/overview/)) whose answer you know is in the index, and look at the source
documents under the answer: their names and links should come from your **Document Name Field**
and **Link Field** keys.

## FAQ

**Which fields do I fill in to connect Pinecone?**
With **KnowledgeBase Type** set to `Pinecone`: **Pinecone.io Index Name**,
**Pinecone.io Index Namespace** and **Pinecone.io API Key**. Then set **Curation Data Field**,
**Link Field** and **Document Name Field** to the metadata keys your records use, and save.

**Why does a field dropdown only show "Loading data..."?**
Those dropdowns ask Pinecone for their entries when you open them instead of carrying a fixed
list. With the Pinecone.io boxes empty, nothing arrives beyond the current value and an error
banner says the client configuration is missing the required property apiKey. Fill in
**Pinecone.io API Key** first, together with the index name and namespace, before you pick keys. You can keep the values already shown when your records
use `text`, `link` and `title`.

**Is there a Test connection button for Pinecone?**
No. The KnowledgeBase Connection section has none for this store. Save, then ask a question on
the Seek tab and check the returned sources.

**How do I make one document always come first?**
Choose a **Re-Sort Field**, then add rows to the **Priority** / **Value or RegExp** table under
**Re-Sort values list.** A matching result is re-ranked above other results "regardless of KB
score".

**Where did Expansion Window go?**
With Pinecone, the KnowledgeBase Tuning section shows **Snippet size** (100 to 1000) in its place.
See [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

**Where do I choose the embedding model?**
Not in this section. Add it in [Embedding Models](/configuration/neural-config/embedding-models/),
and make sure your index's vector size matches it.
