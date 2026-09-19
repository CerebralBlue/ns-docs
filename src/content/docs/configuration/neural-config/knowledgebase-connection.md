---
title: "KnowledgeBase Connection"
description: "KnowledgeBase Connection is the first section of the Edit Configuration dialog in Neural Config: it sets the KnowledgeBase Type NeuralSeek queries, the KnowledgeBase Language of that content, and the Notes stored with the configuration — and the type it names decides which other connection fields the section shows."
---

## What is it

**KnowledgeBase Connection** is the first section of the **Edit Configuration** accordion in Neural Config. It names the store NeuralSeek searches when it answers a question, and holds the settings that describe that store.

On the instance captured for this page the section is short: a **KnowledgeBase Type** selector, a **KnowledgeBase Language** selector and a **Notes** box. That is not the whole of the feature — the fields drawn under the type are chosen by the type. With **NeuralSeek KB** selected, there is nothing else to fill in; other store types add the connection details that store needs.

## Why it matters

Every other retrieval setting acts on what this store returns. [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) decides how many documents come back and how strictly they are scored, scoring and attribution judge those documents, and the LLM only ever sees text that this connection produced. If the wrong store is selected, or the connection details are wrong, nothing downstream can compensate: seeks come back empty or answer from content you did not mean to publish.

It is also the one place where the shape of the screen changes under you. Because the fields are conditional on the type, a walkthrough written against one store does not match what another store shows — which is why this page describes the gate rather than pretending every store looks alike.

## When to use it

- You are setting up a new instance and need to point it at a knowledge base for the first time.
- You are moving from one store to another — for example from the built-in NeuralSeek KB to your own vector database.
- Seeks return nothing, and you want to confirm which store the configuration is actually querying.
- The documentation in the store is not in English and the language needs to be stated.
- You want a note left beside the configuration for whoever opens it next.

## How it works

### Where the section lives

Open **Neural Config**, click the **Default Config** node in the routing tree, then the **Edit Configuration** button. The dialog that opens is titled `Configuration: Default Config`, and **KnowledgeBase Connection** is the first accordion header in it. Clicking the header expands the section in place.

![The Edit Configuration dialog titled "Configuration: Default Config", with the KnowledgeBase Connection accordion expanded to show the KnowledgeBase Type selector set to NeuralSeek KB, the KnowledgeBase Language selector set to English, and an empty Notes box, above the collapsed KnowledgeBase Tuning, LLM Details, Embedding Models, Company / Organization Preferences, Platform Preferences and Corporate Document Filter headers](/img/neural-config/kb-connection.png)

Nothing you change here is applied while the dialog is open. The footer carries **Propose Changes** and **Save**; both are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/), along with what happens to a proposal.

### The connection fields

- **KnowledgeBase Type** — the store NeuralSeek queries. This is the control that decides what the rest of the section shows. On the instance captured for this page it reads `NeuralSeek KB`, and with that value the section renders only the three controls listed here: no endpoint, key, index, filter or schema fields appear at all. The list of types this selector offers was not captured, so this page does not reproduce one; see [Supported knowledge bases](/knowledge/supported-knowledgebases/) for the stores NeuralSeek works with, and check the selector on your own instance for what your build offers.
- **KnowledgeBase Language** — the language of the content in that store. It sits beside the type and reads `English` on the captured instance. This is not the language answers are written in; that is **Default Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/).
- **Notes** — a free-text box, empty on the captured instance, labelled `Notes` beneath the field. The screen offers no help text or placeholder for it, so treat it as a note kept with the configuration rather than a setting that changes behaviour.

The values quoted above are what one captured instance had, not product defaults. Read your own screen before assuming a number or a selection.

### What the section shows for other store types

Because **KnowledgeBase Type** gates the fields, a different type draws a different form — typically the endpoint, credentials and index or collection that store needs, and in some cases extra controls such as a search-type selector or a key generator. None of that was on screen during the capture behind this page, which ran on `NeuralSeek KB`.

Rather than describe forms nobody has looked at, this page lists them as pending. The per-store connection fields still to be documented here are: Watson Discovery on CP4D, watsonx Discovery (including its key-generation helper), OpenSearch, Kendra, Bedrock and its search-type setting, Milvus, Postgres with pgvector, Coveo, Virtual KB, the built-in NeuralSeek KB's own options, running with no knowledge base at all, the advanced schema controls that decide which payload fields reach the prompt, and the choice to combine or separate a document's snippets.

![Screenshot needed — the KnowledgeBase Type selector with its option list open](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/kb-connection-type-options.png — Neural Config > Default Config > Edit Configuration > KnowledgeBase Connection, with the KnowledgeBase Type listbox open so every store type it offers is visible.
     Why: the list of types is the one fact this section turns on, and three capture runs have never opened it. -->

Until each of those is captured, [Supported knowledge bases](/knowledge/supported-knowledgebases/) is the list of what NeuralSeek can connect to, and the per-store guides under Knowledge & Data carry the setup steps.

### Settings that are not in this section

- What retrieval returns from the store — document scores, document counts, the expansion window and the query cache: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
- Getting documents into the NeuralSeek KB in the first place: [Connect a knowledge base](/knowledge/connect-a-kb/).
- Using a mAIstro agent as the knowledge base instead of a document store: [Virtual KB](/seek/virtual-kb/).
- The language answers are written in: **Default Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/).
- Saving, proposing and reverting a configuration: [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

### Where do I tell NeuralSeek which knowledge base to use?

**Neural Config** → the **Default Config** node → **Edit Configuration** → **KnowledgeBase Connection** → **KnowledgeBase Type**.

### I only see three fields — where are the endpoint and API key?

They are drawn per store. On an instance using `NeuralSeek KB` the section is exactly **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**, because the built-in store needs no connection details. Choosing a different type adds the fields that store requires.

### What does KnowledgeBase Language do?

It states the language of the content in the store, and reads `English` on the instance captured here. It is not the language of the answer — that is **Default Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/). Whether it also affects retrieval, translation, or both, is not stated on this screen.

### Do my changes take effect as soon as I pick a type?

No. The dialog's footer holds **Propose Changes** and **Save**, and nothing in the accordion is applied until one of them is used — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### What is the Notes box for?

The screen says nothing about it: no help text, no placeholder, no example. It is a free-text field stored with the configuration, so the safe use is a note to the next administrator — what this configuration is for, or why the type was changed — rather than anything the product reads.

### How do I get documents into the NeuralSeek KB?

Not from this section. This one only names the store; ingestion is [Connect a knowledge base](/knowledge/connect-a-kb/) and the rest of the Knowledge & Data section, including the Document Loader reached from the KnowledgeBase page.
