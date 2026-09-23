---
title: "KnowledgeBase Connection"
description: "KnowledgeBase Connection is the first section of the Edit Configuration dialog in Neural Config: it sets the KnowledgeBase Type NeuralSeek queries (fifteen options, from Watson Discovery to ChromaDB), the KnowledgeBase Language of that content, and the Notes stored with the configuration — and the type it names decides which other connection fields the section shows."
---

## What is it

**KnowledgeBase Connection** is the first section of the **Edit Configuration** accordion in Neural Config. It names the store NeuralSeek searches when it answers a question, and holds the settings that describe that store.

On the instance captured for this page the section is short: a **KnowledgeBase Type** selector, a **KnowledgeBase Language** selector and a **Notes** box. That is not the whole of the feature — the fields drawn under the type are chosen by the type. With `NeuralSeek KB` selected there is nothing else to fill in; other store types add the connection details that store needs, and those forms were not on screen during the capture.

## Why it matters

Every other retrieval setting acts on what this store returns. [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) decides how many documents come back and how strictly they are scored, scoring and attribution judge those documents, and the LLM only ever sees text that this connection produced. If the wrong store is selected, or the connection details are wrong, nothing downstream can compensate: seeks come back empty or answer from content you did not mean to publish.

It is also the one place where the shape of the screen changes under you. Because the fields are conditional on the type, a walkthrough written against one store does not match what another store shows — which is why this page describes the gate and the option list rather than pretending every store looks alike.

## When to use it

- You are setting up a new instance and need to point it at a knowledge base for the first time.
- You are moving from one store to another — for example from the built-in `NeuralSeek KB` to your own vector database, or to a mAIstro agent acting as a [Virtual KB](/seek/virtual-kb/).
- Seeks return nothing, and you want to confirm which store the configuration is actually querying.
- The documentation in the store is not in English and the language needs to be stated.
- You want a note left beside the configuration for whoever opens it next.

## How it works

### Where the section lives

Open **Neural Config**, click the **Default Config** node in the routing tree, then the **Edit Configuration** button. The dialog that opens is titled `Configuration: Default Config`, and **KnowledgeBase Connection** is the first of its accordion headers. Clicking the header expands the section in place; the other headers stay collapsed below it. The full list of sections is on the [Neural Config directory](/configuration/neural-config/).

![The Edit Configuration dialog titled "Configuration: Default Config", with the KnowledgeBase Connection accordion expanded to show the KnowledgeBase Type selector set to NeuralSeek KB, the KnowledgeBase Language selector set to English, and an empty Notes box, above the collapsed KnowledgeBase Tuning, LLM Details, Embedding Models, Company / Organization Preferences, Platform Preferences and Corporate Document Filter headers](/img/neural-config/knowledgebase-connection.png)

Nothing you change here is applied while the dialog is open. The footer carries **Propose Changes** and **Save**; both are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/), along with what happens to a proposal.

### The connection fields

With `NeuralSeek KB` selected the section renders exactly three controls: **KnowledgeBase Type** and **KnowledgeBase Language** side by side, each a dropdown whose button shows the current value with its label underneath, and a wide **Notes** box beneath them. None of the three carries help text.

![The KnowledgeBase Connection fields: the KnowledgeBase Type dropdown reading NeuralSeek KB, the KnowledgeBase Language dropdown reading English, and the empty multi-line Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The values shown are what one captured instance had, not product defaults. Read your own screen before assuming a selection.

### KnowledgeBase Type — the fifteen options

**KnowledgeBase Type** is the store NeuralSeek queries, and the control that decides what the rest of the section shows. On the captured instance it reads `NeuralSeek KB`. Opening it lists fifteen values, in this order:

`Watson Discovery` · `Watson Discovery (CP4D)` · `Elastic AppSearch` · `ElasticSearch` · `watsonx Discovery` · `OpenSearch` · `Kendra` · `Bedrock` · `Pinecone` · `Milvus` · `Postgres` · `Virtual KB` · `NeuralSeek KB` · `No KnowledgeBase` · `ChromaDB`

![The KnowledgeBase Type dropdown open, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery and the top of OpenSearch, with a scrollbar for the rest of the list](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

The list scrolls — the open menu shows about six entries at a time, so `Pinecone` onward is below the fold. Two entries are worth noting against other pages: `ChromaDB` is on the list, and Coveo is not, on this build. Which stores NeuralSeek supports and how each is set up on the Knowledge & Data side is the subject of [Supported knowledge bases](/knowledge/supported-knowledgebases/) and [Connect a knowledge base](/knowledge/connect-a-kb/); `Virtual KB` and `No KnowledgeBase` are the two values whose names do not point at a document store — what `Virtual KB` does is described on [Virtual KB](/seek/virtual-kb/); what `No KnowledgeBase` does to a Seek is in the pending list below. The screen offers no help text for any value.

### KnowledgeBase Language

**KnowledgeBase Language** sits beside the type and reads `English` on the captured instance. Its dropdown is a long alphabetical language list: the open menu holds 187 rows, from `Abkhazian` to `Zulu`, with 185 distinct names (`Ndebele` and `Norwegian` each appear twice). Two entries are spelled oddly on this build and are quoted here exactly so you recognise them: `Brazillian Portuguese` and `Interlingua)` (with a stray closing parenthesis). `Chinese`, `Chinese (Simplified)` and `Chinese (Traditional)` are three separate entries.

![The KnowledgeBase Language dropdown open, showing Abkhazian, Afar, Afrikaans, Akan, Albanian and the top of Amharic, with a scrollbar for the rest of the list](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

The screen does not say what the setting drives — retrieval, translation, or both. What it is not is the language answers are written in: that has its own control, **Default Output Language**, in the **Default Language** field group of [Platform Preferences](/configuration/neural-config/platform-preferences/), whose help text reads "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option." On the captured instance, with both set to `English`, a question asked in Spanish through the MCP came back entirely in English — the probe and its caveats are on [Language settings](/configuration/language/).

### Notes

**Notes** is a multi-line text box labelled `Notes` beneath the field, empty on the captured instance, with no placeholder and no help text. It is shown in the section crop above. Treat it as a note kept with the configuration rather than a setting that changes behaviour — what this configuration is for, or why the type was changed — since nothing on screen says the product reads it.

### What other KnowledgeBase Types show — not captured on this instance

Because **KnowledgeBase Type** gates the fields, a different type draws a different form. None of those forms was on screen during the capture behind this page: the capture never changes a configuration value, and the captured instance runs on `NeuralSeek KB`, which needs no connection details. The captured section shows no advanced-schema control, no snippet-combining control and no "Toggle Advanced" switch of any kind.

Rather than describe forms nobody has looked at, this page lists them as pending. Each line below comes from the route's gap audit, not from a screen, and stays unconfirmed until the type is captured:

<!-- UNCONFIRMED: the per-type field sets below — CP4D Auth URL; watsonx Discovery endpoint/private key/index/Generate Key; OpenSearch endpoint/username/password/index; Kendra index ID/region/role keys; Bedrock KB ID/region/keys/Bedrock Search Type; Milvus host/collection/database/token/one-way TLS/server name; Postgres table/distance metric/embedding column; Advanced Schema; combine/separate snippets — from the route's `gaps` in scripts/migration-map.json; no capture has shown any of them -->

- Watson Discovery on CP4D — said to add an Auth URL field.
- watsonx Discovery — said to take an endpoint, a private key and an index, with a key-generation helper.
- OpenSearch — said to take an endpoint, a username, a password and an index rather than an API key.
- Kendra — said to take an index ID, an AWS region, and a role access key and secret.
- Bedrock — said to take a knowledge base ID, a region and keys, plus a Bedrock search-type dropdown.
- Milvus — said to take a host, a collection, a database, a token, a one-way TLS switch and a server name.
- Postgres — said to use pgvector as the store, with a table, a distance metric and an embedding column.
- Virtual KB — said to let you pick the mAIstro agent that acts as the knowledge base.
- No KnowledgeBase — said to run mAIstro-only, with no retrieval.
- An advanced-schema control deciding which payload fields reach the prompt, and a choice to combine or separate a document's snippets — neither exists on the captured section, so if they exist at all they belong to another type.
- Coveo — in the gap audit and on [Supported knowledge bases](/knowledge/supported-knowledgebases/), but not an option in the list on this build.

One related surface is known to exist and was never opened: a **Generate an API key** dialog, with a **Generate** button, sits in the markup of every Neural Config state but is hidden until something raises it.

<!-- UNCONFIRMED: that the Generate an API key dialog is the watsonx Discovery key-generation helper — the route's gap audit and the IA assignment of 2026-09-19 say so; no capture has opened it -->

The gap audit ties it to the `watsonx Discovery` type as its key-generation helper. Nothing in the capture confirms which type raises it, so this page does not say.

Until each of those is captured, [Supported knowledge bases](/knowledge/supported-knowledgebases/) is the list of what NeuralSeek can connect to, and the per-store guides under Knowledge & Data carry the setup steps.

### Settings that are not in this section

- What retrieval returns from the store — document scores, document counts, the expansion window and the query cache: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
- Getting documents into the `NeuralSeek KB` in the first place: [Connect a knowledge base](/knowledge/connect-a-kb/).
- Using a mAIstro agent as the knowledge base instead of a document store: [Virtual KB](/seek/virtual-kb/).
- The language answers are written in: **Default Output Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/).
- Saving, proposing and reverting a configuration: [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

### Where do I tell NeuralSeek which knowledge base to use?

**Neural Config** → the **Default Config** node → **Edit Configuration** → **KnowledgeBase Connection** → **KnowledgeBase Type**.

### Which knowledge base types can I pick?

On this build, fifteen: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. Coveo is not among them. The list can differ by build, so check the dropdown on your own instance.

### I only see three fields — where are the endpoint and API key?

They are drawn per store. On an instance using `NeuralSeek KB` the section is exactly **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**, because the built-in store needs no connection details. Choosing a different type adds the fields that store requires; those forms have not been captured yet, and the section above lists what each is expected to ask for.

### Does KnowledgeBase Language change the language of the answer?

Not on its own, as far as the product shows. It states the language of the content in the store, and reads `English` on the instance captured here. The answer language has its own control, **Default Output Language**, on [Platform Preferences](/configuration/neural-config/platform-preferences/). Whether KnowledgeBase Language also affects retrieval or translation is not stated on the screen.

### Do my changes take effect as soon as I pick a type?

No. The dialog's footer holds **Propose Changes** and **Save**, and nothing in the accordion is applied until one of them is used — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### What is the Notes box for?

The screen says nothing about it: no help text, no placeholder, no example. It is a free-text field stored with the configuration, so the safe use is a note to the next administrator rather than anything the product reads.
