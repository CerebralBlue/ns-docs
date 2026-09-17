---
title: "RAG Tools"
description: "Use with a custom RAG flow to send answers to Curate and Analytics."
---

## Curate 


Use with a custom RAG flow to send answers to Curate and Analytics. You do not need to pass any options when using with the Seek node.
:::note[Parameters]

- **question**: The User question (optional only if using the Seek node)

- **answer**: The provided answer (optional only if using the Seek node)

- **category**: The category (numerical - optional)

- **intent**: The intent (optional)

- **session_id**: A session id (optional)
:::

```text
{{ curate  | question: "" | answer: "" | category: "" | intent: "" | session_id: "" }}
```
:::note
You do not need to pass any options when using with the Seek node.
:::

---


## Categorize 


Categorize a question
:::note[Parameters]

- **question**: The text to categorize
:::

```text
{{ categorize  | question: "" }}
```

    

---


## Query Cache 


Query stored answers from the curate tab
:::note[Parameters]

- **question**: The text to search
:::

```text
{{ queryCache  | question: "" }}
```

    

---


## Session History 


Grab session history for a sessionId and number of previous turns of the conversation
:::note[Parameters]

- **sessionId**: The session ID

- **turns**: 
    - **text**: The number of previous turns of the conversation to return
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 1
:::

```text
{{ sessionHistory  | sessionId: "" | turns: 1 }}
```


---


## Semantic Score 


Run the semantic scoring model
:::note[Parameters]

- **text**: The text to score (leave blank for current input)

- **truth**: The ground truth (leave blank for identified sources)
:::

```text
{{ semanticScore  | text: "" | truth: "" }}
```

<details>
<summary>Example Usage</summary>

```text
{{ semanticScore  | text: "The sky is blue because of science." | truth: "The sky appears blue because when sunlight enters Earth's atmosphere, the tiny air molecules scatter the shorter wavelengths of light like blue more readily than longer wavelengths, causing the blue light to be dispersed across the sky, making it appear blue; this process is called Rayleigh scattering. " }}
```
- The text we are including is `The sky is blue because of science.`
- The truth documentation we are including is `The sky appears blue because when sunlight enters Earth's atmosphere, the tiny air molecules scatter the shorter wavelengths of light like blue more readily than longer wavelengths, causing the blue light to be dispersed across the sky, making it appear blue; this process is called Rayleigh scattering. `
The Agent Output does not return any values. Click the mAIstro Inspector icon in the top right corner to view the semantic analysis. 
![SS_output](/img/maistro/ntl/rag-tools/semantic_score_NTL_output.png)

</details>

---


## Add Context 


Add context to text
:::note[Parameters]

- **session_id**: A session ID for the context. Must use the same as was sent to Curate
:::

```text
{{ addContext  | session_id: "" }}
```

    

---


## Generate Embeddings 


Create embeddings from input text
:::note[Parameters]

- **text**: Input text. Leave blank to take text flowing into the node instead.

- **model**: The embedding Model to use
:::

```text
{{ embeddings  | text: "" | model: "" }}
```


    

---


## Context Grammar - In 


This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:<br>contextGrammar.text: The input text to process.<br>contextGrammar.language: The name of the identified language.<br>contextGrammar.langCode: The language code identified from the input text.

    

```text
{{ contextGrammar  }}
```
    

---


## Min Confidence - In 


This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:<br>minConfMsg.originalQuery: The original user Input<br>minConfMsg.context: The previous message's context if in a mutli-turn conversation.<br>minConfMsg.kbContext: The knowledgebase documentation.<br>minConfMsg.language: The selected or determined language<br>minConfMsg.langCode: The selected or determined language code<br>minConfMsg.intent: The selected or determined Intent <br>minConfMsg.categoryName: The selected or determined category name<br>minConfMsg.categoryURL: The selected or determined category url 

    

```text
{{ minConfMsg  }}
```


    

---

## minTextMsg 

undefined

---


## Max Words - In 


This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:<br>maxWordsMsg.originalQuery: The original user Input<br>maxWordsMsg.context: The previous message's context if in a mutli-turn conversation.<br>maxWordsMsg.language: The selected or determined language<br>maxWordsMsg.langCode: The selected or determined language code<br>maxWordsMsg.intent: The selected or determined Intent <br>maxWordsMsg.categoryName: The selected or determined category name<br>minConfMsg.maxWordsMsg: The static response set in config 

    

```text
{{ maxWordsMsg  }}
```

    

---


## Virtual KB - In 


This node is used only for creating a virtual KB for use in Seek. This node must be the first step in a m<span class='d1'>AI</span>stro virtual KB.<br><br>This node provides the following Seek variables:<br>virtualKbIn.originalQuery: The original user Input<br>virtualKbIn.contextQuery: The query enhanced with NeuralSeek context keeping.<br>virtualKbIn.language: The selected or determined language<br>virtualKbIn.langCode: The selected or determined language code<br>virtualKbIn.intent: The selected or determined Intent <br>virtualKbIn.categoryName: The selected or determined category name <br>virtualKbIn.filter: The filter string used 

    

```text
{{ virtualKbIn  }}
```


    

---


## Virtual KB - Out 


This node is used only for creating a virtual KB for use in Seek. This node must be the last step in a m<span class='d1'>AI</span>stro virtual KB.
:::note[Parameters]

- **context**: The trusted information to pass on to the LLM. Pass either a string of plain text or an array.

- **kbCoverage**: The coverage score of this kb context 0-100. (optional)

- **kbScore**: The confidence score of this kb context 0-100. (optional)

- **url**: The primary source URL (optional)

- **document**: The primary source document name (optional)
:::

```text
{{ virtualKbOut  | context: "" | kbCoverage: "0" | kbScore: "0" | url: "" | document: "" }}
```

    

---


## Seek - In 


This node is used only for creating a virtual KB for use in Seek. This node must be the first step in a m<span class='d1'>AI</span>stro virtual KB.<br><br>This node provides the following Seek variables:<br>seekIn.originalQuery: The original user Input<br>seekIn.contextQuery: The query enhanced with NeuralSeek context keeping.<br>seekIn.lastTurn: The chat history as an array of objects.<br>seekIn.language: The selected or determined language<br>seekIn.langCode: The selected or determined language code<br>seekIn.intent: The selected or determined Intent <br>seekIn.categoryName: The selected or determined category name 

    

```text
{{ seekIn  }}
```


    

---


## Seek - Out 


This node is used only for returning a custom Seek. This node must be the last step in a m<span class='d1'>AI</span>stro seek.
:::note[Parameters]

- **answer**: The answer

- **passages**: The trusted information you used as an array.

- **kbCoverage**: The coverage score of this kb context 0-100. (optional)

- **kbScore**: The confidence score of this kb context 0-100. (optional)

- **url**: The primary source URL (optional)

- **document**: The primary source document name (optional)
:::

```text
{{ seekOut  | answer: "" | passages: "" | kbCoverage: "0" | kbScore: "0" | url: "" | context: "" | document: "" }}
```
:::note[Parameters]
- **Answer**: 
- **Passages**: The trusted information you used as an array.
- **kbCoverage**: Optional. The coverage score of this KB context from 0-100.
- **kbScore**: Optional. The confidence score of this KB context from 0-100.
- **URL**: Optional. The primary source URL.
- **Context**: Optional.
- **Document**: Optional. The primary source document name.
:::
