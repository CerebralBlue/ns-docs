---
title: "RAG Tools"
description: "The RAG Tools: entity extraction, embeddings, scoring, table understanding, summarization, categorization, and the Seek and Virtual KB pipeline nodes."
---

## Extract

NeuralSeek Entity extraction. Define custom entities on the Extract Tab

:::note[Parameters]

- **useLLM**: Use the configued extract LLM
:::

---

## Embeddings

Create embeddings from input text

:::note[Parameters]

- **text**: Input text. Leave blank to take text flowing into the node instead.

- **model**: The embedding Model to use
:::

---

## Semantic Score

Run the semantic scoring model

:::note[Parameters]

- **text**: The text to score (leave blank for current input)

- **truth**: The ground truth (leave blank for identified sources)
:::

---

## Table Understanding

Take CSV input data and try and answer a query directly

:::note[Parameters]

- **query**: The Question to ask of the table
:::

---

## Table Prep

Take CSV input data and reduce it down to the rows and columns that most likely contain the answer to a query, for use in later steps or to send to an LLM.

:::note[Parameters]

- **query**: The Question to ask of the table

- **sentences**: Return as sentences, an array, or an object
:::

---

## Summarize

Summarize a large block of text into a smaller set of extracted sentences.

:::note[Parameters]

- **length**: 
    - **text**: The desired summary length in characters
    - **min**: 10
    - **max**: 10000
    - **step**: 10
    - **default**: 500

- **match**: Text to prioritize building the summary around
:::

---

## Categorize

Categorize a question

:::note[Parameters]

- **question**: The text to categorize
:::

---

## Score Sentiment

Score the sentiment of the input to the node.

---

## Extract Keywords

Extract keywords from input text

:::note[Parameters]

- **nouns**: Consider normal nouns as keywords
:::

---

## Remove Stopwords

Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text.

---

## Grammar

Extract grammar from text

---

## Virtual KB Input

This node is used only for creating a virtual KB for use in Seek. This node must be the first step in a mAIstro virtual KB.

This node provides the following Seek variables:

- virtualKbIn.originalQuery: The original user Input
- virtualKbIn.contextQuery: The query enhanced with NeuralSeek context keeping.
- virtualKbIn.language: The selected or determined language
- virtualKbIn.langCode: The selected or determined language code
- virtualKbIn.intent: The selected or determined Intent
- virtualKbIn.categoryName: The selected or determined category name
- virtualKbIn.filter: The filter string used
- virtualKbIn.prefs: (opt-in) The instance preferences (secrets redacted)

:::note[Parameters]

- **passPrefs**: Include the instance preferences as virtualKbIn.prefs
:::

---

## Virtual KB Output

This node is used only for creating a virtual KB for use in Seek. This node must be the last step in a mAIstro virtual KB.

:::note[Parameters]

- **context**: The trusted information to pass on to the LLM. Pass either a string of plain text or an array.

- **kbCoverage**: The coverage score of this kb context 0-100. (optional)

- **kbScore**: The confidence score of this kb context 0-100. (optional)

- **url**: The primary source URL (optional)

- **document**: The primary source document name (optional)
:::

---

## Seek Input

This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.

This node provides the following Seek variables:

- seekIn.originalQuery: The original user Input
- seekIn.contextQuery: The query enhanced with NeuralSeek context keeping.
- seekIn.lastTurn: The chat history as an array of objects.
- seekIn.language: The selected or determined language
- seekIn.langCode: The selected or determined language code
- seekIn.intent: The selected or determined Intent
- seekIn.categoryName: The selected or determined category name

---

## Seek Output

This node is used only for returning a custom Seek. This node must be the last step in a mAIstro seek.

:::note[Parameters]

- **answer**: The answer

- **passages**: The trusted information you used as an array.

- **kbCoverage**: The coverage score of this kb context 0-100. (optional)

- **kbScore**: The confidence score of this kb context 0-100. (optional)

- **url**: The primary source URL (optional)

- **document**: The primary source document name (optional)
:::

---

## Seek

Run a Seek

:::note[Parameters]

- **query**: The Question to Seek

- **stump**: Information to add as priority in the Context

- **filter**: A filter to pass to the KB

- **language**: The response language, if different than the default

- **seekLLM**: Set a specific model card to use for this seek
:::

---

## Context Grammar - IN

This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:

- contextGrammar.text: The input text to process.
- contextGrammar.language: The name of the identified language.
- contextGrammar.langCode: The language code identified from the input text.

---

## Min Confidence - IN

This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:

- minConfMsg.originalQuery: The original user Input
- minConfMsg.context: The previous message's context if in a mutli-turn conversation.
- minConfMsg.kbContext: The knowledgebase documentation.
- minConfMsg.language: The selected or determined language
- minConfMsg.langCode: The selected or determined language code
- minConfMsg.intent: The selected or determined Intent
- minConfMsg.categoryName: The selected or determined category name
- minConfMsg.categoryURL: The selected or determined category url

---

## Max Words - IN

This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:

- maxWordsMsg.originalQuery: The original user Input
- maxWordsMsg.context: The previous message's context if in a mutli-turn conversation.
- maxWordsMsg.language: The selected or determined language
- maxWordsMsg.langCode: The selected or determined language code
- maxWordsMsg.intent: The selected or determined Intent
- maxWordsMsg.categoryName: The selected or determined category name
- minConfMsg.maxWordsMsg: The static response set in config

---

## Min Text - IN

This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:

- minWordsMsg.originalQuery: The original user Input
- minWordsMsg.context: The previous message's context if in a mutli-turn conversation.
- minWordsMsg.language: The selected or determined language
- minWordsMsg.langCode: The selected or determined language code
- minWordsMsg.intent: The selected or determined Intent
- minWordsMsg.categoryName: The selected or determined category name
- minWordsMsg.categoryURL: The selected or determined category url
