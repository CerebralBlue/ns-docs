---
title: "Language handling"
description: "Where NeuralSeek's three language settings live — KnowledgeBase Language, Default Output Language and Cross Language — how they decide which language a question is retrieved and answered in, and which LLM card handles translation and language identification."
---

## What is it

Language handling is not one setting in NeuralSeek but three, spread across three sections of the **Edit Configuration** dialog in Neural Config:

- **KnowledgeBase Language** (in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)) says what language your documents are written in.
- **Default Output Language** and **Cross Language** (in [Platform Preferences](/configuration/neural-config/platform-preferences/)) say what language answers come back in, and whether a question asked in another language is translated into the KnowledgeBase's language before retrieval.
- **LLM Languages**, **Translate** and **Fallback Language Id** (on each card in [LLM Details](/configuration/neural-config/llm-details/)) say which model is allowed to work in which languages, and which model performs translation and language identification.

This page explains how those settings fit together. Each control is owned and documented in full by its own section page, linked above.

## Why it matters

The language of the documents, the language of the question and the language of the answer are three different things, and NeuralSeek treats them separately. If the three settings are left at their defaults — on the instance captured for this page, `English` for the KnowledgeBase, `English` for output and **Cross Language** off — a question asked in Spanish is answered in English. That is the behaviour the probe on this page shows, and it surprises people who expected the answer to follow the question.

The setting that changes it, **Cross Language**, has a cost the screen states plainly: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." Any guardrail or dashboard that relies on the semantic score goes quiet for those answers. If everyone asking questions uses the KnowledgeBase's language, leave **Cross Language** off and keep the score.

## When to use it

- Your documents are in one language and your users ask in another — set **KnowledgeBase Language** to the documents' language and decide whether **Cross Language** is worth losing semantic scoring for.
- Answers must always come back in one fixed language regardless of the question — set **Default Output Language** to it.
- One integration needs a different answer language from the rest — the **Default Language** help text says the default "can be overridden on the Seek tab and the api by setting the language option", so leave the default alone and set it per request.
- A model should only be used for some languages — restrict the card's **LLM Languages** list on the LLM Details screen.
- You need a model that translates or identifies languages — make sure one card claims the **Translate** or **Fallback Language Id** function; without one, that function is off.

## How it works

All three settings sit inside Neural Config. Open **Configure**, click the **Default Config / Answer Generation** node of the routing tree, and the **Edit Configuration** dialog opens with one accordion per section. The three that matter here are **KnowledgeBase Connection**, **Platform Preferences** and **LLM Details**. Nothing takes effect until you **Save** the dialog.

### The language of the KnowledgeBase

**KnowledgeBase Language** is the second control in the **KnowledgeBase Connection** section, next to **KnowledgeBase Type** and above **Notes**. It tells NeuralSeek what language the documents are written in. On the instance captured for this page it is `English`.

![KnowledgeBase Connection: KnowledgeBase Type set to NeuralSeek KB, KnowledgeBase Language set to English, and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

This is the "KB language" that the **Cross Language** help text refers to — the anchor every translation decision is made against. It is a single value: the dropdown lists 185 languages and has no "Match Input" entry, because a KnowledgeBase is assumed to be in one language.

![The KnowledgeBase Language dropdown open, listing Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic and so on](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

The full list, as captured from the dropdown on 2026-09-19; two entries, `Brazillian Portuguese` and `Interlingua)`, are spelled here exactly as the screen spells them:

<details>
<summary>The 185 languages in the KnowledgeBase Language list</summary>

Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic, Arabic, Aragonese, Armenian, Assamese, Avaric, Avestan, Aymara, Azerbaijani, Bambara, Bashkir, Basque, Belarusian, Bengali, Bihari languages, Bislama, Bosnian, Brazillian Portuguese, Breton, Bulgarian, Burmese, Catalan, Central Khmer, Chamorro, Chechen, Chichewa, Chinese, Chinese (Simplified), Chinese (Traditional), Church Slavic, Chuvash, Cornish, Corsican, Cree, Croatian, Czech, Danish, Divehi, Dutch, Dzongkha, English, Esperanto, Estonian, Ewe, Faroese, Fijian, Finnish, French, Fulah, Gaelic, Galician, Ganda, Georgian, German, Greek, Guarani, Gujarati, Haitian, Hausa, Hebrew, Herero, Hindi, Hiri Motu, Hungarian, Icelandic, Ido, Igbo, Indonesian, Interlingua), Interlingue, Inuktitut, Inupiaq, Irish, Italian, Japanese, Javanese, Kalaallisut, Kannada, Kanuri, Kashmiri, Kazakh, Kikuyu, Kinyarwanda, Kirghiz, Komi, Kongo, Korean, Kuanyama, Kurdish, Lao, Latin, Latvian, Limburgan, Lingala, Lithuanian, Luba-Katanga, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Manx, Maori, Marathi, Marshallese, Mongolian, Nauru, Navajo, Ndebele, Ndonga, Nepali, Northern Sami, Norwegian, Norwegian Bokmål, Occitan, Ojibwa, Oriya, Oromo, Ossetian, Pali, Panjabi, Persian, Polish, Portuguese, Pushto, Quechua, Romanian, Romansh, Rundi, Russian, Samoan, Sango, Sanskrit, Sardinian, Serbian, Shona, Sichuan Yi, Sindhi, Sinhala, Slovak, Slovenian, Somali, Sotho, Spanish, Sundanese, Swahili, Swati, Swedish, Tagalog, Tahitian, Tajik, Tamil, Tatar, Telugu, Thai, Tibetan, Tigrinya, Tonga, Tsonga, Tswana, Turkish, Turkmen, Twi, Uighur, Ukrainian, Urdu, Uzbek, Venda, Vietnamese, Volapük, Walloon, Welsh, Western Frisian, Wolof, Xhosa, Yiddish, Yoruba, Zhuang, Zulu

</details>

The same 185 names appear in the **Default Output Language** and **LLM Languages** dropdowns. The screen shows names only; the language codes behind them are visible in the **Change Logs** panel of Neural Config, where the list is stored as name/code pairs — `English` is `en`, `Spanish` is `es`, `Korean` is `ko`, `Brazillian Portuguese` is `pt-br`, `Chinese (Simplified)` is `zh-cn`, `Chinese (Traditional)` is `zh-tw`, and `Match Input` is `xx`. That stored list has 187 language entries rather than 185 because two names carry two codes each: `Ndebele` (`nd` and `nr`) and `Norwegian` (`nn` and `no`).

The rest of the section — the KnowledgeBase type, its connection fields and the notes box — is documented on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Answering in a language other than the KnowledgeBase's

Two settings in the **Platform Preferences** section decide what happens when the question, the documents and the answer are not all in one language.

**Default Language** is the heading; the dropdown under it is labelled **Default Output Language** and is `English` on the instance captured here. The help text under the heading reads: "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option." So this is a default, not a constraint — a request that carries its own language option wins.

![Platform Preferences: the Default Language group with its help text and the Default Output Language dropdown set to English](/img/neural-config/platform-preferences--default-language.png)

Its dropdown has 186 entries: **Match Input** first, then the same 185 languages as the KnowledgeBase list. `Match Input` is the only entry that is not a language name and the screen gives it no description.

![The Default Output Language dropdown open, with Match Input above Abkhazian, Afar, Afrikaans and Akan](/img/neural-config/platform-preferences--options-default-output-language.png)

<!-- UNCONFIRMED: Match Input makes NeuralSeek answer in the language the question was asked in — old page ("Match Input Feature: NeuralSeek can understand and support conversations that are initiated in languages other than the ones listed"); no probe or screen on this capture describes the option -->

The name suggests the answer language follows the question's language, and that is what the previous documentation said it does; nothing on the captured screens describes it, so treat that reading as unverified until you have tested it on your instance.

**Cross Language** is a dropdown a little further up the same section; it shows `False` on the instance captured here (its option list was not opened for this capture, so the other value is presumed to be `True`, as on the neighbouring switches). Its help text is the whole specification: "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled."

![Platform Preferences: the Cross Language group with its help text and the dropdown showing False](/img/neural-config/platform-preferences--cross-language.png)

Read the two sentences separately:

- **What it does.** With **Cross Language** on, a question whose language differs from the **KnowledgeBase Language** is translated into the KnowledgeBase's language before retrieval, so the documents can be searched in their own language.
- **What it costs.** Semantic scoring is switched off for those answers. The Semantic Scoring tab says the same thing from its side ("Semantic scoring is not available in cross-laguage usecases", spelled that way on screen). If you rely on the score — for guardrails or for analytics — see [Semantic model tuning](/configuration/semantic-model/) for what is lost before turning this on.

<!-- UNCONFIRMED: with Cross Language on, the answer is generated and delivered back in the user's own language (steps 4–5 of the old page's Spanish → English → Spanish flow) — old page "Cross-language support for KBs"; the captured help text only covers translating the question into the KB language -->

The help text covers the question's trip into the KnowledgeBase's language. Whether the answer then comes back in the user's language, or in the **Default Output Language**, is not stated on screen; the previous documentation described the answer returning in the user's language.

**What the default configuration does with a foreign-language question.** The instance captured for this page has **KnowledgeBase Language** `English`, **Default Output Language** `English` and **Cross Language** `False`. Asked, through the MCP, `¿Qué es NeuralSeek y para qué sirve?`, it answered in English — the question's language was not followed:

```text
NeuralSeek is a knowledge‑base‑driven question‑answering platform. It lets users query a connected KnowledgeBase, generate answers, and see where those answers come from. The system highlights source provenance, uses semantic match scores to gauge alignment with the source material, and offers extensive configuration options for tailoring behavior.
```

That answer came back with a KB score of 70 and a semantic score of 18, and the MCP response carried no field naming the language it was written in. With these settings the output language is the configured default, whatever language the question arrives in.

The rest of **Platform Preferences** — generation timeout, context turns, relax filters, stopwords, HTML cleansing, the save and post-Seek agents — is not about language and is documented on [Platform Preferences](/configuration/neural-config/platform-preferences/).

### Which LLM handles which languages

Every LLM card on the **LLM Details** screen carries three language-related controls under its **Connection Info** accordion. The section's own help text sets the rule for all of them: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

**LLM Languages** is a multi-select labelled `Enabled Languages`, with a number badge showing how many languages the card is enabled for. An LLM is only used for the languages its list enables.

![An LLM card's Connection Info accordion: the LLM Languages multi-select with a 187 badge and the Enabled Languages placeholder](/img/neural-config/llm-details--llm-languages.png)

On the instance captured here, three of the four cards — **Managed GPT**, **Managed gpt-image** and **gpt-oss-20b** — show `187`, which is the whole stored language list (the 185 names plus the two double-coded ones, as explained above). The fourth card, **Translate**, shows `96`: a card can be restricted to a subset. Which 96 they are is not visible in the capture, because the multi-select shows only its count once it is closed.

![The LLM Languages multi-select open, with Abkhazian, Afar, Afrikaans, Akan and Albanian all checked](/img/neural-config/llm-details--options-llm-languages.png)

**Translate** is one of the function checkboxes on each card. A card with it checked performs translation — which is what **Cross Language** needs to translate a question into the KnowledgeBase's language. On the captured instance it is checked on the **Translate** card (where it is the only checked function) and on **gpt-oss-20b**, unchecked on **Managed GPT**, and greyed out on **Managed gpt-image**, which cannot perform the function.

![The Translate function checkbox on an LLM card](/img/neural-config/llm-details--translate.png)

**Fallback Language Id** is the other language function. Its label is all the screen says about it: it reads as the function that identifies the language of a text, with "Fallback" suggesting it is called when a cheaper identifier is not confident — both are inferences from the label, not stated behaviour. On the captured instance it is checked on **gpt-oss-20b** only, unchecked on **Managed GPT**, and greyed out on both **Managed gpt-image** and **Translate**.

![The Fallback Language Id function checkbox on an LLM card](/img/neural-config/llm-details--fallback-language-id.png)

The practical consequence of the "no fallback" rule: if no card has **Translate** checked, cross-language translation is disabled on that instance; if none has **Fallback Language Id** checked, language identification is. The captured playground ships a dedicated **Translate** card; whether your instance does is a question for your LLM Details screen. The cards themselves — connection fields, the other functions, load balancing — are documented on [LLM Details](/configuration/neural-config/llm-details/).

### Translation and language identification as APIs (unverified)

The previous version of this page documented a translation REST API and a language-identification REST API, both testable at [api.neuralseek.com](https://api.neuralseek.com/). Neither appears on any captured screen, and the pipeline that wrote this page has no tool that can call them, so the shapes below are carried over from that documentation without verification. The only on-screen evidence that these functions exist is the **Translate** and **Fallback Language Id** checkboxes described above; per the LLM Details rule, both are off on an instance where no card claims them. Check the request and response fields against the [REST and Console APIs](/integrations/rest-and-console-api/) reference before building on them.

<!-- UNCONFIRMED: the translation REST API takes a JSON body with a `text` array and a `target` language code, and returns `word_count`, `character_count`, `translations[]`, `detected_language` and `detected_language_confidence` — old page "Language handling / How does it work?"; not on any captured screen, no probe path -->

**Translation.** The request carried an array of `text` strings, in any language or mix of languages, plus a `target` language code; the response returned one translation per input string together with the detected source language:

```json
{
  "text": ["soy un chico.", "나는 소년입니다.", "私は男の子です."],
  "target": "en"
}
```

```json
{
  "word_count": 6,
  "character_count": 30,
  "translations": ["I am a boy.", "I am a boy.", "I am a boy."],
  "detected_language": "es",
  "detected_language_confidence": 0.95
}
```

<!-- UNCONFIRMED: the language-identification REST API takes a `text/plain` body and returns an array of `{ language, confidence }` — old page "features/language_indentification"; not on any captured screen, no probe path -->

**Language identification.** The request was a `text/plain` body containing the text to identify; the response was an array of language code and confidence pairs:

```text
이 언어는 어떤 언어입니까?
```

```json
[
  {
    "language": "ko",
    "confidence": 0.95
  }
]
```

The codes in these examples (`en`, `es`, `ko`) are the same codes the configuration's stored language list pairs with the names in the dropdowns.

## FAQ

### Where do I set the language my documents are written in?

In **KnowledgeBase Language**, the second control of the **KnowledgeBase Connection** section of the **Edit Configuration** dialog (Neural Config, **Default Config / Answer Generation** node). It is `English` on the instance captured for this page, and the dropdown offers 185 languages. It is the one language setting with no "Match Input" option, because it describes the documents, not the users.

### How do I get answers in a language different from my documents?

Two settings in **Platform Preferences**. **Default Output Language** sets the language answers are written in, and its help text says the Seek tab and the API can override it per request "by setting the language option". **Cross Language** makes NeuralSeek translate a question into the KnowledgeBase's language first when the two differ, so retrieval works against the documents in their own language. With both left at their defaults (`English` and `False`), a Spanish question on the captured instance came back in English.

### Why did semantic scoring disappear after I turned Cross Language on?

Because the setting turns it off. The **Cross Language** help text says: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." The Semantic Scoring tab repeats it from its side. There is no way to have both; if the score matters more than serving questions in other languages, leave **Cross Language** at `False`. See [Semantic model tuning](/configuration/semantic-model/).

### What does "Match Input" do?

It is the first entry in the **Default Output Language** dropdown and the only one that is not a language name — 186 entries against the 185 of the KnowledgeBase list. The screen does not describe it. The previous documentation said it makes the answer follow the language the question was asked in, which is what the name suggests, but nothing captured for this page confirms it; test it on your instance before relying on it.

### Which languages does NeuralSeek support?

The 185 names listed in the collapsible section above, captured from the **KnowledgeBase Language** dropdown on 2026-09-19; **Default Output Language** and each card's **LLM Languages** offer the same names. Whether a given language actually works for answers also depends on the LLM cards: a card serves only the languages its **LLM Languages** list enables, which can be all of them (the `187` badge) or a subset (the `96` on the captured instance's **Translate** card).

### Is there a translation API?

The captured LLM Details screen shows a **Translate** function that a card can claim, and a dedicated **Translate** card on the playground, so a translation capability exists on that instance. The REST endpoints the previous documentation described — a JSON `text` array plus `target` for translation, and a `text/plain` body for language identification — were not verified for this page; their shapes are reproduced above as unconfirmed background. Confirm them against the [REST and Console APIs](/integrations/rest-and-console-api/) reference or at [api.neuralseek.com](https://api.neuralseek.com/).
