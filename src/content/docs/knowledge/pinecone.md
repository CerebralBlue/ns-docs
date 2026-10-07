---
title: "Pinecone setup"
description: "To use a Pinecone index as NeuralSeek's knowledge base, set KnowledgeBase Type to Pinecone in the KnowledgeBase Connection section of Neural Config, enter the index name, namespace and API key, map your records' metadata keys, and save."
---

Connect NeuralSeek to a Pinecone index you already maintain, so that Seek answers come from the
records in that index. NeuralSeek reads the index; it does not upload to it. You embed and upsert
the records with your own tooling, then tell NeuralSeek where the index is and which metadata keys
hold the passage text, the source link and the document name. Everything on this page is set in
the [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) section of
[Neural Config](/configuration/neural-config/), and every Pinecone field is shown only
when **KnowledgeBase Type** is `Pinecone`.

Pinecone is one of several stores on the same list. If you do not have an index yet and only want
to upload documents, NeuralSeek's own store needs no external account; compare the options on
[Supported knowledge bases](/knowledge/supported-knowledgebases/), and see
[Connect a knowledge base](/knowledge/connect-a-kb/) for the general procedure.

## Before you begin

You need three things from Pinecone: an index, the namespace in it that holds your records, and an
API key of the Pinecone project that owns the index.

The index stores vectors of a fixed dimension, and NeuralSeek has to embed each question with the
same model your records were embedded with. Add that model in the
[Embedding Models](/configuration/neural-config/embedding-models/) section of the same dialog;
that page explains the **KB Search** function on a model card.

<!-- UNCONFIRMED: the vector sizes text-embedding-ada-002 1536, text-embedding-3-small 1536, text-embedding-3-large 3072, infloat-e5-small-v2 384 — the sizes come from the earlier version of this page; the model names are confirmed, the sizes are not shown on a NeuralSeek screen -->

Common vector sizes: `text-embedding-ada-002` 1536, `text-embedding-3-small` 1536,
`text-embedding-3-large` 3072, `infloat-e5-small-v2` 384.

<!-- UNCONFIRMED: the record shape {id, values, metadata: {text, title, link}} — from the upload example on the earlier version of this page (Pinecone SDK + LangChain OpenAI embeddings); customer tooling, not re-run -->

Give every record a metadata object with the passage text, the document title and the source URL.
A record shaped like this (vector shortened) matches the values the NeuralSeek form shows when you
pick Pinecone:

```json
{
  "id": "refund-policy",
  "values": [0.0123, -0.0456, 0.0789],
  "metadata": {
    "text": "Refunds are issued within 14 days of the request…",
    "title": "Refund policy",
    "link": "https://example.com/policies/refunds"
  }
}
```

## Select Pinecone and enter the index details

1. Open **Neural Config** and select the **Default Config / Answer Generation** node in the
   routing tree. The configuration dialog opens.
2. Expand **KnowledgeBase Connection**.
3. Open **KnowledgeBase Type** and choose `Pinecone`. The list scrolls; `Pinecone` sits below the
   first entries. Picking a type only changes the form; nothing is stored until you save.

   ![The KnowledgeBase Type dropdown open in the KnowledgeBase Connection section, with Pinecone as the current value and the list starting at Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch](/img/neural-config/knowledgebase-connection@kb-pinecone--options-knowledgebase-type.png)

   **KnowledgeBase Language** and **Notes** stay at the top of the section for every store; they
   are described on the KnowledgeBase Connection page.

4. Fill in the three Pinecone boxes:
   - **Pinecone.io Index Name**: the name of the index NeuralSeek searches.
   - **Pinecone.io Index Namespace**: the namespace inside that index that holds your records.
   - **Pinecone.io API Key**: an API key of the Pinecone project that owns the index. Treat it as
     a secret.

   ![The KnowledgeBase Connection section with Pinecone selected: KnowledgeBase Type and KnowledgeBase Language, Notes, the empty Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key boxes, then the Curation Data Field, Link Field, Document Name Field and Attribute sources dropdowns, above the Propose Changes and Save footer](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

Fill in all three before you change the metadata fields below: while the Pinecone.io boxes are
empty, opening one of those dropdowns shows an apiKey error banner.

## Map your record metadata

Each Pinecone record carries a vector and a metadata object. These controls tell NeuralSeek which
metadata key to read for each part of a source.

### Curation Data Field, Link Field and Document Name Field

1. Set **Curation Data Field** to the key that holds the passage text. The form shows `text` when
   you pick Pinecone.
2. Set **Link Field** to the key that holds the document's URL, which becomes the source link.
   The form shows `link`.
3. Set **Document Name Field** to the key that holds the document's name or title, which becomes
   the source name. The form shows `title`.

If your records use `text`, `link` and `title`, keep the values the form shows.

These dropdowns have no fixed list. When you open one, it shows the current value and a
**Loading data...** row. If the Pinecone.io boxes are empty, a banner also appears: "The client configuration must have required property: apiKey. You can
find the configuration values for your project in the Pinecone developer console at
https://app.pinecone.io."

![The Curation Data Field dropdown open, with the value text ticked and a Loading data... row beneath it; Link Field, Document Name Field, Attribute sources, Filter Field and the Re-Sort values list block around it](/img/neural-config/knowledgebase-connection@kb-pinecone--options-curation-data-field.png)

### Attribute sources inside LLM Context by Document Name

Choose whether the passages NeuralSeek hands to the LLM carry the name of the document they came
from. The form shows `Enabled` when you pick Pinecone.

<!-- UNCONFIRMED: what Enabled and Disabled change in the LLM context — read from the control's label (old field name "Attribute Resources"); no answer was compared with the setting changed -->

| Option     | What it does                                                                         |
| ---------- | ------------------------------------------------------------------------------------ |
| `Enabled`  | Each passage in the LLM context is attributed to its **Document Name Field** value. |
| `Disabled` | Passages reach the LLM without that attribution.                                     |

Keep it enabled when your document names are meaningful, such as titles or page names, so the LLM
can tell passages from different documents apart. Consider disabling it when **Document Name
Field** holds opaque values such as IDs or file hashes.

![The Attribute sources inside LLM Context by Document Name dropdown open with two options, Enabled (ticked) and Disabled](/img/neural-config/knowledgebase-connection@kb-pinecone--options-attribute-sources-inside-llm-context-by-.png)

## Filter and re-rank results (optional)

Skip this section if every search may return any record in the namespace, ranked by score.

### Filter Field and Static Default Filter Value

1. Set **Filter Field** to the metadata key a filter value is matched against.
2. In **Static Default Filter Value (when no runtime filter is passed)**, enter the value to apply
   on every search whose request carries no filter of its own. A filter sent with the request is
   used instead; see [Dynamic filters](/seek/dynamic-filters/).

Use a static value when one NeuralSeek configuration should only see part of a shared index, for
example the documents of one product line.

### Re-Sort values list

The **Re-Sort values list.** block puts chosen documents at the top. Its description on the screen:
"Enter a prioritized list of values you want to re-rank above other results, regardless of KB
score."

1. Set **Re-Sort Field** to the metadata key whose value is compared with the list.
2. Select the add-row icon (tooltip **Add a new row.**) under the table.
3. Enter a **Priority** and a **Value or RegExp**: a literal value or a regular expression.
4. Repeat for each value you want to promote.

Use it to make an authoritative document, such as a current policy or an official guide, win over
near-duplicates with similar wording.

![The lower half of the Pinecone form with the Document Name Field dropdown open (title and a Loading data... row), and below it Filter Field, Static Default Filter Value (when no runtime filter is passed), the Re-Sort values list. heading and description, Re-Sort Field, and the Priority / Value or RegExp table with its add-row icon](/img/neural-config/knowledgebase-connection@kb-pinecone--options-document-name-field.png)

### Enable Advanced Schema

The Pinecone form ends with an **Enable Advanced Schema** button, below the Re-Sort table.

## Save the configuration

1. At the bottom of the dialog, select **Save** to apply the configuration, or **Propose Changes**
   to keep it for review. Nothing in the dialog applies until you do; when to use which is covered
   on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

With Pinecone selected, the **KnowledgeBase Tuning** section also offers **Snippet size** ("Use
this setting to window relevant details in a document that do not specifically mention the user
question, but apply to it."), set from 100 to 1000; it is described on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## Verify the connection with a Seek

1. Open the [Seek](/seek/overview/) tab.
2. Ask a question whose answer you know is in the index.
3. Check the sources under the answer: their names should come from your **Document Name Field**
   key and their links from your **Link Field** key.

## Troubleshooting

**Opening a field dropdown shows "The client configuration must have required property: apiKey".**
The Pinecone.io boxes are empty. Fill in **Pinecone.io Index Name**, **Pinecone.io Index
Namespace** and **Pinecone.io API Key**, then open the dropdown again.

**Answers show sources without a name or a link.**
The metadata keys on the form do not match the keys in your records. **Document Name Field**
supplies the source name and **Link Field** the source link, so set each to the key your records
actually use (for example `title` and `link`), save, and ask the Seek again.

## FAQ

**Which fields connect NeuralSeek to my Pinecone index?**
With **KnowledgeBase Type** set to `Pinecone`: **Pinecone.io Index Name**,
**Pinecone.io Index Namespace** and **Pinecone.io API Key**. Then set **Curation Data Field**,
**Link Field** and **Document Name Field** to the metadata keys your records use, and save.

**How do I make one document always rank first?**
Choose a **Re-Sort Field**, then add a row to the **Priority** / **Value or RegExp** table under
**Re-Sort values list.** with a value that only that document carries. A matching result is
re-ranked above other results "regardless of KB score".

**Where do I choose the embedding model?**
Not in KnowledgeBase Connection. Add it in
[Embedding Models](/configuration/neural-config/embedding-models/), and make sure your index's
vector size matches it.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/): every
  KnowledgeBase Type and the fields common to all of them
- [Supported knowledge bases](/knowledge/supported-knowledgebases/): Pinecone compared with Milvus,
  Postgres and the other stores
- [Connect a knowledge base](/knowledge/connect-a-kb/): the general procedure for any store
- [Embedding Models](/configuration/neural-config/embedding-models/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Dynamic filters](/seek/dynamic-filters/)
