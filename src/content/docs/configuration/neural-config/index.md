---
title: "Neural Config options"
description: "A directory of the Edit Configuration dialog in Neural Config: every section in screen order, what each one decides, and the page that documents its settings, plus the Corporate Logging and Dynamic Personalization settings."
---

The settings that decide how an instance answers — which knowledge base it searches, which
models generate and embed, what is cached, logged and personalized — live in one dialog on the
**Neural Config** screen: **Edit Configuration**. This page is the directory to that dialog. It
lists the sections in the order the dialog shows them, says in one line what each section
decides, and links to the page that documents its settings. Use it when you know what you want
to change but not which section holds it. Two short sections, Corporate Logging and Dynamic
Personalization, are documented in full at the end of this page.

## Where to find it

1. Open **Neural Config** from the top navigation.
2. Select the **Default Config** node at the top of the routing tree. A **Default
   Configuration** panel opens; the tree and that panel are described on
   [Configuration overview](/configuration/overview/).
3. Select **Edit Configuration**. The dialog `Configuration: Default Config` opens with every
   section collapsed. Select a section's header to expand it.

Nothing you change in the dialog applies until you commit it from the footer: **Save** applies
the change, and **Propose Changes** keeps it for review instead. How each one works, including
the version name that **Save** asks for, is on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

## Settings

### Sections of the Edit Configuration dialog

![The Configuration: Default Config dialog with every section collapsed, from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and the Propose Changes and Save footer](/img/neural-config/edit-configuration-edit-panel.png)

The dialog has fourteen sections. A fifteenth, **Hybrid & Vector Search Settings**, appears
between KnowledgeBase Tuning and LLM Details only when the **KnowledgeBase Type** is
ElasticSearch or watsonx Discovery. The last sections sit below the fold when the dialog opens,
so scroll the list to reach **mAIstro Configuration** and **Secrets**.

| Section                                   | What it decides                                                                                                                                                          | Settings documented on                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **KnowledgeBase Connection**              | Which knowledge base NeuralSeek retrieves from (**KnowledgeBase Type**), its language, and the connection and field-mapping settings of that type.                       | [KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/)             |
| **KnowledgeBase Tuning**                  | How many documents a Seek uses, how they are scored and dated, how much text around a match comes with them, the query cache, and an optional agent that processes results. | [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/)                     |
| **Hybrid & Vector Search Settings**       | Appears only for ElasticSearch and watsonx Discovery. Sets the **Elastic Query Type** — whether ElasticSearch runs Lucene, hybrid or pure vector search.                                                   | [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/)                |
| **LLM Details**                           | The language models the instance uses, one card each, and the LLM functions each model performs.                                                                         | [LLM details](/configuration/neural-config/llm-details/)                                       |
| **Embedding Models**                      | The embedding models, and whether each one serves KB Search, mAIstro or Vector Intent.                                                                                   | [Embedding models](/configuration/neural-config/embedding-models/)                             |
| **Company / Organization Preferences**    | The company display name, **Company Response Affinity** and the **Stump Speech**.                                                                                        | [Tuning answers](/seek/tuning/)                                                                |
| **Platform Preferences**                  | Instance-wide request behaviour: timeout, conversation context, languages, filters, logging switches, and the agents that run on save and after a Seek.                  | [Platform preferences](/configuration/neural-config/platform-preferences/)                     |
| **Corporate Document Filter**             | Checks every returned document against an endpoint you run before it reaches the answer.                                                                                 | [Corporate document filter](/governance/corporate-document-filter/)                            |
| **Corporate Logging**                     | Sends Seek requests and responses, and Curate activity, to your own audit log.                                                                                           | [Corporate Logging](#corporate-logging) below, and [Logging](/governance/logging/)             |
| **Prompt Engineering**                    | Extra instructions to the LLM, and offsets for **Temperature**, **Top Probability**, **Frequency penalty** and **Maximum Tokens**.                                       | [Prompt engineering](/configuration/neural-config/prompt-engineering/)                         |
| **Dynamic Personalization**               | Personalizes answers through a mAIstro agent.                                                                                                                            | [Dynamic Personalization](#dynamic-personalization) below, and [Personalization](/seek/personalization/) |
| **Answer Engineering & Preferences**      | Answer verbosity, **Force Answers from the Knowledgebase**, and **Regular Expression** / **Replacement** rules applied to the answer text.                                | [Tuning answers](/seek/tuning/)                                                                |
| **Intent Matching & Cache Configuration** | How questions group into intents, and when an edited or recent answer is served from cache.                                                                             | [Intent matching and caching](/configuration/neural-config/intent-matching-caching/)           |
| **mAIstro Configuration**                 | External agent marketplaces, each an **Endpoint** and an **API Key**.                                                                                                    | [mAIstro configuration](/configuration/neural-config/maistro-configuration/)                   |
| **Secrets**                               | A **Name** / **Value** table of values your mAIstro flows use.                                                                                                           | [Secrets](/configuration/neural-config/secrets/)                                               |

Company / Organization Preferences and Answer Engineering & Preferences link to Tuning answers,
which covers how those settings shape an answer.

### A category's Custom Configuration

![The Configuration: Refunds dialog for a category with its own configuration: the same section headers from KnowledgeBase Connection down to Intent Matching & Cache Configuration, and a footer with Delete Configuration and Save](/img/neural-config/edit-custom-configuration-edit-panel.png)

A category can carry a configuration of its own, so a change there applies to that category
rather than to the whole instance. Select the category's node on the routing tree, then **Edit Custom
Configuration**. The dialog that opens is headed with the category's name — for example
`Configuration: Refunds` — and lists the same sections as Default Config in the same order,
except **mAIstro Configuration**: external marketplaces are set once, for the whole instance. Its
footer has **Delete Configuration** and **Save**. Categories and the routing tree are described
on [Configuration overview](/configuration/overview/); deleting a category's configuration is on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Corporate Logging

![The expanded Corporate Logging section: its help text, Enable Corporate Logging set to Disabled, Logger Service set to ElasticSearch, the Logger Endpoint and Logger API Key fields, and the Test and Prompt Logging buttons, all greyed out](/img/neural-config/corporate-logging--enable-corporate-logging.png)

Corporate Logging keeps an audit trail of NeuralSeek traffic in a log store you own. The section
describes itself as follows: "Connect NeuralSeek to a corporate audit logging endpoint. When
connected and enabled, all requests and responses to the Seek api endpoint, as well as the
Curate tab will be logged to your Elastic or OpenSearch instance." Turn it on when your
organization must retain every question and answer for compliance or review outside
NeuralSeek. How logging fits with the rest of NeuralSeek's monitoring is on
[Logging](/governance/logging/).

| Setting                      | What it does                                                                | When to change it                                                    |
| ---------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Enable Corporate Logging** | `Disabled` or `Enabled`. Turns sending to your log store off or on.         | Set to `Enabled` once the service, endpoint and key below are ready. |
| **Logger Service**           | The kind of log store NeuralSeek writes to. Options below.                  | Match the service your organization runs.                            |
| **Logger Endpoint**          | The address of your log store, for example an Elastic Cloud deployment URL. | When you connect or move the log store.                              |
| **Logger API Key**           | The key NeuralSeek uses to write to that endpoint. The value is masked.     | When the key is issued or rotated.                                   |

![The Logger Service list open, offering ElasticSearch, OpenSearch and mAIstro](/img/neural-config/corporate-logging--options-logger-service.png)

**Logger Service** offers three options:

<!-- UNCONFIRMED: mAIstro as a Logger Service hands each request and response to a mAIstro agent instead of a search cluster — the gap list on governance/logging ("Logging Agent (mAIstro mode) — the agent that receives every request and response") -->

- **ElasticSearch** — writes the log to an Elasticsearch deployment.
- **OpenSearch** — writes the log to an OpenSearch deployment.
- **mAIstro** — hands the log to a mAIstro agent instead of a search cluster; see
  [Logging](/governance/logging/).

While **Enable Corporate Logging** is `Disabled`, the endpoint and key fields and the **Test**
and **Prompt Logging** buttons are greyed out. Once the four settings are filled in, select
**Save** in the dialog footer to apply them.

### Dynamic Personalization

Dynamic Personalization personalizes answers by running a mAIstro agent you choose. What
personalization does to an answer, and the data it can draw on, is on
[Personalization](/seek/personalization/). The section holds two settings:

![The Enable Dynamic Personalization dropdown, set to Disabled](/img/neural-config/dynamic-personalization--enable-dynamic-personalization.png)

- **Enable Dynamic Personalization** — `Disabled` or `Enabled`. Set it to `Enabled` to
  personalize answers with the agent below.

![The mAIstro Personalization Agent dropdown, with no agent selected](/img/neural-config/dynamic-personalization--maistro-personalization-agent.png)

- **mAIstro Personalization Agent** — the mAIstro agent that does the personalizing. Agents
  are built in [mAIstro](/maistro/overview/).

## FAQ

**Why do I not see Hybrid & Vector Search Settings?**

It appears only when **KnowledgeBase Type** in KnowledgeBase Connection is ElasticSearch or
watsonx Discovery. With any other type the dialog goes straight from KnowledgeBase Tuning to LLM
Details.

**Why is mAIstro Configuration missing from a category's configuration?**

A category's `Configuration: <category>` dialog lists every section of Default Config except
mAIstro Configuration. External marketplaces are set only on Default Config.

**Do my changes apply as soon as I change a field?**

No. Select **Save** (or **Propose Changes**) in the dialog footer. See
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

**Where are PII, profanity and confidence thresholds?**

Not in this dialog. They are on the **Guardrails** node of the routing tree — see
[Guardrails overview](/governance/guardrails/overview/).

## Related

- [Configuration overview](/configuration/overview/) — the routing tree, categories and the
  Default Configuration panel
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — Save, Propose
  Changes and Delete Configuration
- [Backup, restore and change logs](/configuration/backup-restore/) — versions and rollback
- [Logging](/governance/logging/)
- [Personalization](/seek/personalization/)
- [Tuning answers](/seek/tuning/)
