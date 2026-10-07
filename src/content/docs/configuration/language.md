---
title: "Language handling"
description: "NeuralSeek's language behaviour is set by KnowledgeBase Language, Default Output Language and Cross Language in Neural Config, and carried out by the LLM cards that have the Translate and Fallback Language Id functions enabled."
---

The language your documents are written in, the language a question is asked in and the language the answer comes back in are three separate things, and NeuralSeek configures them separately. Five controls, spread over three sections of the **Edit Configuration** dialog in [Neural Config](/configuration/neural-config/using-this-page/), decide them: **KnowledgeBase Language**, **Default Output Language**, **Cross Language**, and — on each model card — **LLM Languages** and the **Translate** and **Fallback Language Id** functions. This page explains each one from the language angle and how they work together; the rest of each section is documented on its own page.

## Where to find it

Open **Neural Config**, select the **Default Config / Answer Generation** node of the routing tree, and select **Edit Configuration**. Each section of the dialog is an accordion; the language settings are in three of them:

| Setting                                   | Section                                                                             | Where in the section                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| **KnowledgeBase Language**                | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | Next to **KnowledgeBase Type**                  |
| **Default Output Language**               | [Platform Preferences](/configuration/neural-config/platform-preferences/)         | Under the heading **Default Language**          |
| **Cross Language**                        | Platform Preferences                                                                | Its own heading                                 |
| **LLM Languages**                         | [LLM Details](/configuration/neural-config/llm-details/)                           | Each model card → **Connection Info**           |
| **Translate**, **Fallback Language Id**   | LLM Details                                                                         | Each model card → **LLM Functions**             |

A change takes effect only after you select **Save** at the bottom of the dialog.

## Settings

### KnowledgeBase Language

**KnowledgeBase Language** tells NeuralSeek what language the documents in your knowledge base are written in. It sits next to **KnowledgeBase Type** in **KnowledgeBase Connection**.

![KnowledgeBase Connection: the KnowledgeBase Type and KnowledgeBase Language dropdowns above the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The options are an alphabetical list of language names, from `Abkhazian` to `Zulu`. Choose the one your documents are written in. Every option is a language name, because the field describes the documents, not the people asking.

![The KnowledgeBase Language dropdown open, starting at Abkhazian, Afar, Afrikaans and Akan](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

This value is "the KB language" that **Cross Language** compares a question against. Change it when your documents change language — if it does not match them, every cross-language decision is made against the wrong language.

### Default Output Language

**Default Output Language** is the one dropdown under the **Default Language** heading in **Platform Preferences**. Its help text: "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option."

![Platform Preferences: the Default Language heading, its help text and the Default Output Language dropdown](/img/neural-config/platform-preferences--default-language.png)

| Option               | What choosing it does                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Match Input`        | The only option that is not a language; see the note below.                                                         |
| A language name      | Answers are written in that language by default. Same list as **KnowledgeBase Language**, `Abkhazian` to `Zulu`. |

The list includes `Chinese (Simplified)`, `Chinese (Traditional)` and `Brazillian Portuguese`, spelled that way in the console.

<!-- UNCONFIRMED: Match Input makes the answer follow the language the question was asked in — old page "Language handling"; no screen or probe shows the option's behaviour -->

By its name, `Match Input` writes the answer in the language the question was asked in, and the previous documentation described it that way. Test it on your own configuration before relying on it.

This value is a default, not a constraint. To get a different answer language for one integration without changing it for everyone, set the language on the request instead: on the Seek tab (see [Seek](/seek/overview/)) or through the language option of the API (see [REST and Console APIs](/integrations/rest-and-console-api/)).

### Cross Language

**Cross Language** decides whether a question asked in a language other than the knowledge base's is translated before the search. Its help text: "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled."

![Platform Preferences: the Cross Language heading, its help text and its dropdown](/img/neural-config/platform-preferences--cross-language.png)

| Option  | What choosing it does                                                                                                                                                                                    |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `True`  | When the question's language differs from **KnowledgeBase Language**, the question is translated into the knowledge base's language, so the documents are searched in their own language. Semantic Scoring is turned off for those answers. |
| `False` | The question is searched as asked. Semantic Scoring stays available.                                                                                                                                    |

![The Cross Language dropdown open, listing True and False](/img/neural-config/platform-preferences--options-cross-language.png)

Set it to `True` when your documents are in one language and your users ask in others. Leave it at `False` when everyone asks in the documents' language, or when you depend on the semantic score: anything that relies on [Semantic Scoring](/governance/guardrails/semantic-scoring/) goes without it for cross-language answers.

<!-- UNCONFIRMED: with Cross Language on, the answer language still follows Default Output Language (or the per-request override) — inferred from the two help texts; the previous documentation described the answer being returned in the user's language, and no probe has shown it -->

Cross Language changes the language the knowledge base is searched in. The language the answer is written in is governed by **Default Output Language** and its per-request override; check the result on your configuration before going live.

### LLM Languages

Every model card in **LLM Details** has an **LLM Languages** field under its **Connection Info** accordion: a multi-select named **Enabled Languages** that lists the languages that model is enabled for.

![A model card's Connection Info: the LLM Languages field with its count chip and the Enabled Languages box](/img/neural-config/llm-details--llm-languages.png)

Closed, the field shows only a count chip — how many languages are enabled on that card. Open it to see the same alphabetical list of language names, each with a checkbox; clear a language to remove it from the card. Cards can show different counts, so open the list to see which languages a card covers.

![The Enabled Languages list open, with Abkhazian and Afar ticked](/img/neural-config/llm-details--options-llm-languages.png)

<!-- UNCONFIRMED: a card is not used for a language it does not enable — inferred from the field's name; no screen describes how cards are chosen per language -->

Restrict a card when a model handles some languages poorly, or when you want a different model to serve a given language. Leave the list whole otherwise. The rest of the card is documented on [LLM Details](/configuration/neural-config/llm-details/).

### Translate and Fallback Language Id

The language work itself is done by the models. Each card's **LLM Functions** grid has two language checkboxes:

- **Translate** — the card or cards with it ticked perform translation.
- **Fallback Language Id** — the card or cards with it ticked identify the language of a text.

![The LLM Details section open in Edit Configuration: its help text and two model cards, each with Connection Info and an LLM Functions grid that includes Translate and Fallback Language Id](/img/neural-config/llm-details.png)

<!-- UNCONFIRMED: Fallback Language Id is used when NeuralSeek's primary language identification does not return a result — inferred from the name; no screen describes the function -->

By its name, **Fallback Language Id** is a fallback: the model steps in when NeuralSeek's primary language identification does not identify the language.

Two sentences of the **LLM Details** help text govern both checkboxes. "Features that an LLM are not capable of will be unselectable" — a greyed-out checkbox means that model cannot perform the function. And "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled" — so if no card has **Translate** ticked, translation is off. Check this before you turn on **Cross Language**. When several cards claim the same function, NeuralSeek load-balances across them; see [Multi-LLM](/configuration/multi-llm/). A card built only for translation, with every other function greyed out, is one way to do this; see [Managed LLM](/configuration/neural-config/managed-llm/).

## How the settings work together

1. A question arrives in some language — the "Seek Language" in the **Cross Language** help text.
2. If that language differs from **KnowledgeBase Language** and **Cross Language** is `True`, the question is translated into the knowledge base's language and Semantic Scoring is turned off for that answer.
3. The knowledge base is searched and the answer is generated.
4. The answer is written in the **Default Output Language**, unless the Seek tab or the API request sets another language. This is the behaviour with **Cross Language** `False`; with it `True`, check the answer language on your configuration.

For example, with **KnowledgeBase Language** `English`, **Default Output Language** `English` and **Cross Language** `False`, the question `¿Qué es NeuralSeek y para qué sirve?` comes back in English:

```text
NeuralSeek is a platform that lets users query a connected KnowledgeBase and generate answers. Its Seek feature “enables users to test questions and generate answers using content from their connected KnowledgeBase,” while highlighting the sources and using semantic match scores to ensure accuracy and transparency.
```

A fixed **Default Output Language** wins over the language of the question. If your users expect answers in their own language, change the default or set the language per request.

## Translating text inside a mAIstro agent

The settings above apply to Seek. To translate text as a step of a [mAIstro](/maistro/overview/) agent, use the NTL `translate` node (or `translateHTML` for an HTML document). Its one parameter, `target`, is the 2-character language code to translate into:

```text
{{ translate | target: "en" }}
```

The node reference is on [Transform](/maistro/ntl/modify-data/transform/).

To translate text or identify its language from your own code, use the Translate endpoints in [REST and Console APIs](/integrations/rest-and-console-api/).

## FAQ

### My documents are in English but users ask in Spanish — what do I set?

Set **KnowledgeBase Language** to `English` and **Cross Language** to `True`, and make sure at least one model card has **Translate** ticked. The Spanish question is then translated into English before the search. Expect Semantic Scoring to be off for those answers.

### Why did a Spanish question get an English answer?

With **Cross Language** `False`, because **Default Output Language** is set to `English`: it is the language answers are written in unless the request sets another one. Change the default, or set the language on the Seek tab or in the API request. With **Cross Language** `True`, check the answer language on your configuration.

### Can one integration get a different answer language from the rest?

Yes. The **Default Language** help text says the language "can be overridden on the Seek tab and the api by setting the language option". Set it on the request and leave the default alone.

### Why did the semantic score disappear after I turned on Cross Language?

The **Cross Language** help text says so: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." If the score matters more than serving other languages, set **Cross Language** to `False`. See [Semantic Scoring](/governance/guardrails/semantic-scoring/).

### Which model does the translating?

The model card or cards with **Translate** ticked in **LLM Functions**. If no card has it, "there is no fallback and that function of NeuralSeek will be disabled". A greyed-out checkbox means that model cannot translate.

## Related

- [Platform Preferences](/configuration/neural-config/platform-preferences/)
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [LLM Details](/configuration/neural-config/llm-details/)
- [Multi-LLM](/configuration/multi-llm/)
- [Semantic Scoring](/governance/guardrails/semantic-scoring/)
- [Seek](/seek/overview/)
- [Transform (NTL)](/maistro/ntl/modify-data/transform/)
