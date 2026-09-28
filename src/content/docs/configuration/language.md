---
title: "Language handling"
description: "NeuralSeek's language behaviour is set by three Neural Config settings — KnowledgeBase Language, Default Output Language and Cross Language — and carried out by the LLM cards that have the Translate and Fallback Language Id functions enabled."
---

## What is it

Language handling in NeuralSeek is not one switch. Three settings and two LLM functions, spread across three sections of the **Edit Configuration** dialog in Neural Config, decide which language a question is searched in and which language the answer comes back in:

- **KnowledgeBase Language**, in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), says what language your documents are written in.
- **Default Output Language** (under the heading **Default Language**) and **Cross Language**, in [Platform Preferences](/configuration/neural-config/platform-preferences/), set the default answer language and whether a question in another language is translated into the documents' language.
- **Translate** and **Fallback Language Id**, two functions on each LLM card in [LLM Details](/configuration/neural-config/llm-details/), say which model does the language work, and each card's **LLM Languages** list says which languages that model is enabled for.

This page explains how those pieces fit together. Every control on it is documented in full on the section page linked above.

## Why it matters

The language of your documents, the language of a question and the language of the answer are three separate things, and NeuralSeek configures them separately. With **KnowledgeBase Language** and **Default Output Language** both set to `English` and **Cross Language** set to `False`, a question asked in Spanish is answered in English — which surprises people who expected the answer to follow the question. The example under [The language answers come back in](#the-language-answers-come-back-in) shows it.

The setting that lets users ask in their own language, **Cross Language**, has a cost the screen states plainly: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." Anything that relies on the semantic score goes without it for those answers. If everyone asks in the language your documents are written in, you do not need it.

## When to use it

- **Your documents are in one language and your users ask in another.** Set **KnowledgeBase Language** to the documents' language and decide whether **Cross Language** is worth losing semantic scoring for.
- **Answers must come back in one fixed language.** Set **Default Output Language** to that language.
- **One integration needs a different answer language from the rest.** Leave the default alone and override it per request — the **Default Language** help text says the language "can be overridden on the Seek tab and the api by setting the language option".
- **A model should only be used for some languages.** Restrict that card's **LLM Languages** list.
- **You need translation or language identification to work at all.** Make sure at least one LLM card has **Translate** or **Fallback Language Id** ticked; a function no card claims is disabled.

This page is the wrong place if you want to translate arbitrary text as a service call; see the note at the end of [Which model does the translating](#which-model-does-the-translating).

## How it works

All the settings sit in Neural Config. Open **Configure**, click the **Default Config** node (**Answer Generation**) of the routing tree, and open **Edit Configuration**: the dialog has one accordion per section. The three that matter here are **KnowledgeBase Connection**, **Platform Preferences** and **LLM Details**. A change takes effect only after you **Save** the dialog.

### The language your documents are in

**KnowledgeBase Language** is the dropdown next to **KnowledgeBase Type** in the **KnowledgeBase Connection** section; the status text under it reads "Select a Language". It tells NeuralSeek what language the documents in your KnowledgeBase are written in.

![KnowledgeBase Connection: the KnowledgeBase Type, KnowledgeBase Language and Notes fields](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The options are an alphabetical list of language names, from `Abkhazian` to `Zulu` — for example `English`, `Spanish`, `Chinese (Simplified)`, `Chinese (Traditional)` and `Brazillian Portuguese` (spelled that way on screen). Choose the one your documents are written in. There is no `Match Input` entry here: a KnowledgeBase is described by a single language.

![The KnowledgeBase Language dropdown open, starting at Abkhazian, Afar, Afrikaans](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

The field has no help text of its own. Its role shows up in the **Cross Language** help text, which compares "the KB language" — this value — with the language a question is asked in. Change it when your documents change language; if it does not match the documents, every cross-language decision is made against the wrong language. The rest of the section is documented on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### The language answers come back in

In **Platform Preferences**, the group headed **Default Language** holds one dropdown, labelled **Default Output Language**. Its help text reads: "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option." So this is a default, not a constraint: a request that sets its own language wins.

![Platform Preferences: the Default Language heading, its help text and the Default Output Language dropdown](/img/neural-config/platform-preferences--default-language.png)

The options are `Match Input` first, then the same alphabetical list of language names as **KnowledgeBase Language**:

- **A language name** — answers are written in that language by default.
- **`Match Input`** — the only option that is not a language. The screen does not describe it.

![The Default Output Language dropdown open, with Match Input above Abkhazian, Afar, Afrikaans and Akan](/img/neural-config/platform-preferences--options-default-output-language.png)

<!-- UNCONFIRMED: Match Input makes the answer follow the language the question was asked in — old page ("NeuralSeek will try to determine if the user is asking a question in a certain language … and will try to convert the responses into the language that the user asked"); no screen describes the option and the experiment that would test it did not run -->

By its name, `Match Input` makes the answer follow the language of the question, and the previous documentation described that behaviour; test it on your own configuration before relying on it.

**What a fixed default does to a foreign-language question.** With **KnowledgeBase Language** `English`, **Default Output Language** `English` and **Cross Language** `False`, the question `¿Qué es NeuralSeek y para qué sirve?` came back from Seek in English:

```text
NeuralSeek is a platform that lets users query a connected KnowledgeBase and generate answers. Its Seek feature “enables users to test questions and generate answers using content from their connected KnowledgeBase,” while highlighting the sources and using semantic match scores to ensure accuracy and transparency.
```

To answer in another language for one integration only, override the default per request, as the help text says — on the Seek tab (see [Seek overview](/seek/overview/)) or on the API.

<!-- UNCONFIRMED: the API override is the `language` field inside the `options` object of a /seek request — old page; the field name is not on any screen -->

On the API, the option is a `language` setting in the request's options; check the exact field in the [REST and Console APIs](/integrations/rest-and-console-api/) reference. The rest of the section is documented on [Platform Preferences](/configuration/neural-config/platform-preferences/).

### Asking in one language, searching in another (Cross Language)

**Cross Language** is a dropdown in the same **Platform Preferences** section. Its help text is its whole specification: "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled."

![Platform Preferences: the Cross Language heading, its help text and its dropdown](/img/neural-config/platform-preferences--cross-language.png)

It has two options:

- **`True`** — when a question arrives in a language different from **KnowledgeBase Language**, NeuralSeek translates it into the KnowledgeBase's language, so the documents are searched in their own language. Semantic scoring is switched off for those answers.
- **`False`** — the question is not translated into the KnowledgeBase's language, and semantic scoring stays available.

![The Cross Language dropdown open, listing True and False](/img/neural-config/platform-preferences--options-cross-language.png)

Turn it on when your users ask in languages your documents are not written in. Leave it off when everyone asks in the documents' language, or when you depend on the semantic score — the Semantic Scoring tab says the same thing from its side: "Semantic scoring is not available in cross-laguage usecases." (spelled that way on screen). See [Semantic model tuning](/configuration/semantic-model/) for what the score does and what is lost without it.

<!-- UNCONFIRMED: with Cross Language on, the answer is generated from the KB-language sources and then returned in the user's own language (steps 4–5 of the old page's Spanish → English → Spanish flow) — old page "Cross-language support for KBs"; the help text only covers translating the question into the KB language, and the experiment that would test it did not run -->

For example, with English documents and **Cross Language** `True`, a user asking "¿Cuál es la capital de Francia?" has the question translated into English before the KnowledgeBase is searched. The help text covers only that first leg. The previous documentation described the answer then being returned in the user's language; whether it comes back in the question's language or in the **Default Output Language** is not stated on screen, so check it on your configuration.

### Which model does the translating

Translation and language identification are LLM functions. Every card in **LLM Details** has an **LLM Functions** list of checkboxes, and two of them are about language:

- **Translate** — the card or cards with it ticked do translation work, which is what **Cross Language** relies on to put a question into the KnowledgeBase's language.
- **Fallback Language Id** — the second language-related function in the list; the screen gives it no description.

![The Translate checkbox in an LLM card's function list](/img/neural-config/llm-details--translate.png)

![The Fallback Language Id checkbox in an LLM card's function list](/img/neural-config/llm-details--fallback-language-id.png)

Two sentences of the LLM Details help text govern both checkboxes. "Features that an LLM are not capable of will be unselectable" — a greyed-out checkbox means that model cannot perform the function. And "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled" — so if no card has **Translate** ticked, translation is off; if no card has **Fallback Language Id** ticked, that function is off. When several cards claim the same function, NeuralSeek load-balances across them.

A managed model card named **Translate** is an example of a card built for this job: on it, **Translate** is the only function that can be selected and every other checkbox is greyed out. Whether your account has such a card depends on your LLM setup; see [LLM Details](/configuration/neural-config/llm-details/) and [Managed LLM](/configuration/neural-config/managed-llm/).

<!-- UNCONFIRMED: NeuralSeek exposes translation (JSON body with a `text` array and a `target` language code; response with `translations[]`, `detected_language`, `detected_language_confidence`) and language identification (`text/plain` body; response `[{language, confidence}]`) as REST endpoints — old page "Language handling"; no screen shows them -->

The previous documentation also described translation and language identification as REST endpoints you can call directly. They are not shown on any console screen; check the [REST and Console APIs](/integrations/rest-and-console-api/) reference before building on them.

### Which languages a model will handle

Each LLM card carries an **LLM Languages** field under its **Connection Info** accordion. The field is a multi-select combobox named **Enabled Languages**.

![An LLM card's Connection Info: the LLM Languages field with its count badge and the Enabled Languages combobox](/img/neural-config/llm-details--llm-languages.png)

Closed, it shows only a count badge — how many languages are enabled on that card — with an × next to it. Open, it is a checklist of the same alphabetical language names, each with a checkbox; untick a language to remove it from that card's enabled languages.

![The Enabled Languages list open, with Abkhazian and Afar ticked under a 187 count badge](/img/neural-config/llm-details--options-llm-languages.png)

Restrict a card when a model handles some languages poorly, or when you want a different model to serve a given language; leave the list whole otherwise. Two cards can show different counts — a card restricted to a subset shows a smaller number — but which languages a restricted card covers is visible only by opening its list. Everything else on the card is documented on [LLM Details](/configuration/neural-config/llm-details/).

## FAQ

### Where do I say what language my documents are in?

In **KnowledgeBase Language**, next to **KnowledgeBase Type** in the **KnowledgeBase Connection** section of **Edit Configuration**. It takes a single language name; it has no `Match Input` option, because it describes the documents, not the users.

### My documents are in English but users ask in Spanish — what do I turn on?

Set **Cross Language** to `True` in **Platform Preferences**. Its help text says it will "Translate into the KB language when the KB language is different than the Seek Language", so the Spanish question is searched against the English documents. Make sure **KnowledgeBase Language** is `English` and that at least one LLM card has **Translate** ticked. Semantic scoring is disabled for those answers.

### What does "Match Input" mean?

It is the first option of **Default Output Language**, above the list of language names, and the only one that is not a language. The screen does not describe it. By its name — and according to the previous documentation — answers follow the language of the question; that has not been confirmed, so test it before relying on it.

### Why did my semantic score disappear?

Because **Cross Language** is on and the question was in a different language from the KnowledgeBase. Its help text says: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." The Semantic Scoring tab says the same. If the score matters more than serving other languages, set **Cross Language** to `False`. See [Semantic model tuning](/configuration/semantic-model/).

### Which model translates?

The LLM card or cards that have **Translate** ticked in their **LLM Functions** list in **LLM Details**. If no card has it, "there is no fallback and that function of NeuralSeek will be disabled". A greyed-out checkbox means that model cannot translate.

### Can I get a different answer language for one integration only?

Yes. **Default Output Language** is only the default; its help text says it "can be overridden on the Seek tab and the api by setting the language option". Set the language on the request instead of changing the default for everyone.
