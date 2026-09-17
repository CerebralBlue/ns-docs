---
title: "Language handling"
description: "Discover NeuralSeek's powerful language translation API, supporting numerous languages for seamless multilingual communication. Effortlessly translate text with JSON payloads and explore extensive language options."
---

**What is it?**

- NeuralSeek provides language translation that will let users call it to translate languages into different languages.

**Why is it important?**

- Any application that would need to translate a given text to another language can now use NeuralSeek to do it, rather than relying on other external translation services.

**How does it work?**

- Translation is provided as REST API, and can be tested on [NeuralSeek API documentation](https://api.neuralseek.com/). 
- Message payload is in JSON format, and contains an array of `text` in certain language(s). Another attribute is `target` which specifies the target language the translation needs to be performed in. An example message would look something like this:

```json
{
    "text": [
    "NeuralSeek introduced several new features in July 2023, including streaming responses for web use cases, enhanced cross-lingual support, curate to CSV/upload curated QA from CSV, improved semantic match analysis, updated IBM WatsonX model compatibility, and AWS Lex round-trip monitoring."
    ],
    "target": "ko"
},
```

:::note
For more details on what language codes are supported, please refer to the **Multi Language Support** section below.
:::

NeuralSeek would then translate the given text into the target language `ko` which is Korean:

```json
{
    "word_count": 39,
    "character_count": 289,
    "translations": [
        "NeuralSeek은 2023년 7월에 웹 사용 사례를 위한 스트리밍 응답, 향상된 교차 언어 지원, CSV에 대한 선별/선별 QA 업로드, 개선된 의미 일치 분석, 업데이트된 IBM WatsonX 모델 호환성 및 AWS Lex 왕복 모니터링과 같은 여러 가지 새로운 기능을 도입했습니다."
    ],
    "detected_language": "en",
    "detected_language_confidence": 0.9999967787054185
}
```

You can also provide texts in different languages that can all be translated into the target language:

```json
{
    "text": [
    "soy un chico.",
    "나는 소년입니다.",
    "私は男の子です."
    ],
    "target": "en"
}
```

Which will be translated into `en` which is English:

```json
        {
        "word_count": 6,
        "character_count": 30,
        "translations": [
        "I am a boy.",
        "I am a boy.",
        "I am a boy."
        ],
        "detected_language": "es",
        "detected_language_confidence": 0.95
        }
```

## Multi Language Support

**What is it?**

- NeuralSeek has several different language options available for understanding questions and delivering answers. These include English, Spanish, Portuguese, French, German, Italian, Arabic, Korean, Chinese, Czech, Dutch, Indonesian, Japanese, and more. These can be adjusted on the “Configure” section of the NeuralSeek console, or on the “Seek” endpoint. Please see the below table for the full list of supported languages. 

**Why is it important?**

- Instead of having to train your virtual agents to understand various different languages, your question can be automatically converted into the response in the language of your choice.

**How does it work?**

- NeuralSeek will try to determine if the user is asking a question in a certain language (e.g. Spanish), and will try to convert the responses into the language that the user asked without any additional set ups.

### Supported Languages

<details>
<summary>Languages and Language Codes</summary>

|Language|Lang code|
|---|---|
|English|en|
|Match Input|xx|
|Arabic|ar|
|Basque|eu|
|Bengali|bn|
|Bosnian|bs|
|Bulgarian|bg|
|Catalan|ca|
|Chinese (Simplified)|zh-cn|
|Chinese (Traditional)|zh-tw|
|Croatian|hr|
|Czech|cs|
|Danish|da|
|Dutch|nl|
|Estonian|et|
|Finnish|fi|
|French|fr|
|German|de|
|Greek|el|
|Gujarati|gu|
|Hebrew|he|
|Hindi|hi|
|Hungarian|hu|
|Irish|ga|
|Indonesian|id|
|Italian|it|
|Japanese|ja|
|Kannada|kn|
|Korean|ko|
|Latvian|lv|
|Lithuanian|lt|
|Malay|ms|
|Malayalam|ml|
|Maltese|mt|
|Marathi|mr|
|Montenegrin|cnr|
|Nepali|ne|
|Norwegian Bokmål|nb|
|Polish|pl|
|Portuguese|pt-br|
|Punjabi|pa|
|Romanian|ro|
|Russian|ru|
|Serbian|sr|
|Sinhala|si|
|Slovak|sk|
|Slovenian|sl|
|Spanish|es|
|Swedish|sv|
|Tamil|ta|
|Telugu|te|
|Thai|th|
|Turkish|tr|
|Ukrainian|uk|
|Urdu|ur|
|Vietnamese|vi|
|Welsh|cy|

</details>

Match Input Feature: NeuralSeek can understand and support conversations that are initiated in languages other than the ones listed through the Match Input Feature. On the “Seek” endpoint, click the dropdown for language navigation and click "Match Input".


<!-- MERGE: everything below came from features/language_indentification/index.md. Fold it into the sections above, then delete this comment. -->


**What is it?**

- NeuralSeek provides a service that would analyze and identify the language of a given text.

**Why is it important?**

- Any application that would need to understand which language a given text is can now use NeuralSeek to do it, rather than relying on other external services.

**How does it work?**

- Language identification is provided as REST API, and can be tested on [NeuralSeek API documentation](https://api.neuralseek.com/). Message payload is in `text/plain` format, and contains `text` in certain languages. An example message would look something like this:

```
이 언어는 어떤 언어입니까?
```

- NeuralSeek would then identify what language this is in, and returns the language code and the confidence score:

```json
[
    {
        "language": "ko",
        "confidence": 0.95
    }
]
```

## Specifying a Language
If you would like to specify a certain target language that you want NeuralSeek to generate answers into, you can do so by specifying a language code (e.g. es) in the request when you are invoking `Seek`.

![lang selection](/img/configuration/language/image-001.png)

The same can be achieved when you are invoking `Seek` using REST API. You can specify the language under the `options > language`.


## Cross-language support for KBs

NeuralSeek offers robust multi-language support, allowing users to interact with a knowledge base (KB) in a different language than the one the KB is written in. This is particularly useful in scenarios where the knowledge base is in one language (e.g., English), but users need to query it in another language (e.g., Spanish).


**How It Works**

When a user queries the knowledge base in a different language, NeuralSeek handles the translation process seamlessly:

![query example](/img/configuration/language/spanish-test.png)


1. **User Query in Native Language**: The user asks a question in their native language (e.g., Spanish).
2. **Translation to KB Language**: NeuralSeek translates the user's question into the language of the knowledge base (e.g., English).
3. **Querying the KB**: The translated question is used to search the knowledge base.
4. **Retrieving the Answer**: NeuralSeek retrieves the answer from the LLM in their native language.
5. **Delivering the Response**: The user receives the response in their native language.

<details>
<summary>Example Scenario</summary>


Question in Spanish, KB in English

1. **User Query**: "¿Cuál es la capital de Francia?"
2. **Translate to English**: "What is the capital of France?"
3. **Query the English KB**: The system searches for "What is the capital of France?" in the English knowledge base.
4. **Retrieve Answer from the LLM in Spanish**: "La capital de Francia es París."
5. **Deliver Response**: "La capital de Francia es París."

To configure NeuralSeek for multi-language support, follow these steps:

**Step 1**: Configure the Knowledge Base Language

![kb](/img/configuration/language/kb-language.png)

- **Navigate to the Configure Tab**: Access the configuration settings of NeuralSeek.
- **Select the Language of Your Knowledge Base**: Choose the language your knowledge base is written in (English, in this case).
- **Save the Configuration**: Ensure that your settings are saved properly to apply the changes.

**Step 2**: Testing Multi-Language Queries

![seek](/img/configuration/language/french-example.png)

- **Go to the Seek Tab**: Access the query interface of NeuralSeek.
- **Enter a Question in Spanish**: Test the configuration by entering a question in Spanish, such as "¿Cuál es la capital de Francia?"
- **Observe the Response**: NeuralSeek should translate the question, query the English knowledge base, and return the response in the desired language: "La capital de Francia es París."

</details>
