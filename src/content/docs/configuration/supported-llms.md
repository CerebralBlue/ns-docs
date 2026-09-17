---
title: "Supported LLMs"
description: "Explore NeuralSeek's extensive support for LLMs from top providers like Amazon, Azure, Google, and OpenAI. Discover how to integrate and configure these models for seamless AI experiences."
---

## Overview

NeuralSeek supports LLMs from many providers, including:

- Amazon Bedrock
- Azure Cognitive Services
- Cloudflare
- Google Vertex AI
- HuggingFace
- OpenAI
- together.ai
- watsonx.ai

In addition to any generic OpenAI-compatible endpoints.

<br/>

**Supported LLM details by provider:**

<details>
<summary>Amazon Bedrock</summary>

|LLM|Notes|
|---|---|
|Claude 3 Haiku|Claude 3 Haiku is Anthropic's fastest, most compact model for near-instant responsiveness. It answers simple queries and requests with speed. Customers will be able to build seamless AI experiences that mimic human interactions. Claude 3 Haiku can process images and return text outputs, and features a 200K context window.|
|Claude 3 Opus|Claude 3 Opus is Anthropic's most powerful AI model, with state-of-the-art performance on highly complex tasks. It can navigate open-ended prompts and sight-unseen scenarios with remarkable fluency and human-like understanding. Claude 3 Opus shows us the frontier of what’s possible with generative AI. Claude 3 Opus can process images and return text outputs, and features a 200K context window.|
|Claude 3 Sonnet|Claude 3 Sonnet by Anthropic strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It offers maximum utility at a lower price than competitors, and is engineered to be the dependable, high-endurance workhorse for scaled AI deployments. Claude 3 Sonnet can process images and return text outputs, and features a 200K context window.|
|Claude 3.5 Haiku|Claude 3.5 Haiku is Anthropic's fastest, most compact model for near-instant responsiveness. It answers simple queries and requests with speed. Customers will be able to build seamless AI experiences that mimic human interactions. Claude 3 Haiku can process images and return text outputs, and features a 200K context window.|
|Claude 3.5 Sonnet|Claude 3.5 Sonnet by Anthropic strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It offers maximum utility at a lower price than competitors, and is engineered to be the dependable, high-endurance workhorse for scaled AI deployments. Claude 3 Sonnet can process images and return text outputs, and features a 200K context window.|
|Claude 3.5 Sonnet v2|Claude 3.5 Sonnet v2 by Anthropic strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It offers maximum utility at a lower price than competitors, and is engineered to be the dependable, high-endurance workhorse for scaled AI deployments. Claude 3 Sonnet can process images and return text outputs, and features a 200K context window.|
|Claude Instant v1.2|A faster and cheaper yet still very capable model, which can handle a range of tasks including casual dialogue, text analysis, summarization, and document question-answering.|
|Claude v2|Anthropic's most powerful model, which excels at a wide range of tasks from sophisticated dialogue and creative content generation to detailed instruction following.|
|Claude v2.1|Anthropic's most powerful model, which excels at a wide range of tasks from sophisticated dialogue and creative content generation to detailed instruction following.|
|Jurassic-2 Mid|Jurassic-2 Mid is AI21’s mid-sized model, carefully designed to strike the right balance between exceptional quality and affordability. Jurassic-2 Mid can be applied to any language comprehension or generation task including question answering, summarization, long-form copy generation, advanced information extraction and many others.|
|Jurassic-2 Ultra|Jurassic-2 Ultra is AI21’s most powerful model offering exceptional quality. Apply Jurassic-2 Ultra to complex tasks that require advanced text generation and comprehension. Popular use cases include question answering, summarization, long-form copy generation, advanced information extraction, and more.|
|Llama-2-chat 13B|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|Llama-2-chat 70B|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|llama-3-1-405b-instruct|llama-3-405b instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-1-70b-instruct|Llama 3.1 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-1-8b-instruct|Llama 3.1 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-11b-vision-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-1b-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-3b-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-90b-vision-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-3-70b-instruct|Llama 3.3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mistral-large|The most advanced Mistral AI Large Language model capable of handling any language task including complex multilingual reasoning, text understanding, transformation, and code generation. |
|Mistral-small|Mistraql Small is optimized for high-volume, low-latency language-based tasks. Mistral Small is perfectly suited for straightforward tasks that can be performed in bulk, such as classification, customer support, or text generation. |
|Mixtral-8x7B-Instruct|The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Nova Lite|Amazon Nova is a new generation of state-of-the-art (SOTA) foundation models (FMs) that deliver frontier intelligence and industry leading price-performance, available exclusively on Amazon Bedrock.|
|Nova Micro|Amazon Nova is a new generation of state-of-the-art (SOTA) foundation models (FMs) that deliver frontier intelligence and industry leading price-performance, available exclusively on Amazon Bedrock.|
|Nova Pro|Amazon Nova is a new generation of state-of-the-art (SOTA) foundation models (FMs) that deliver frontier intelligence and industry leading price-performance, available exclusively on Amazon Bedrock.|
|Titan Text G1 - Express|Amazon Titan Text Express has a context length of up to 8,000 tokens, making it well-suited for a wide range of advanced, general language tasks such as open-ended text generation and conversational chat, as well as support within Retrieval Augmented Generation (RAG). At launch, the model is optimized for English, with multilingual support for more than 100 additional languages available in preview.|

</details>

<details>
<summary>Azure Cognitive Services</summary>

|LLM|Notes|
|---|---|
|Azure GPT4 Turbo (Preview)|GPT-4 Turbo provides a good balance of speed and capability.  The 16K context window version of the model allows for more information to be passed to it, generally yeilding better responses.|
|GPT-4o|GPT-4o matches GPT-4 Turbo performance on text in English and code, with significant improvement on text in non-English languages.|
|GPT-4o-mini|GPT-4o mini is an affordable and intelligent small model for fast, lightweight tasks. GPT-4o mini is cheaper and more capable than GPT-3.5 Turbo..|
|GPT3.5|GPT-3.5 provides a good balance of speed and capability.|
|GPT4|GPT-4 can often take longer than 30 seconds for a full response.  Use caution when using in conjunction with a Virtual Agent platform that imposes a strict timeout.|
|GPT4 (32K)|GPT-4 can often take longer than 30 seconds for a full response.  Use caution when using in conjunction with a Virtual Agent platform that imposes a strict timeout. The 32K context window version of the model allows for more information to be passed to it, generally yeilding better responses.|
|o1|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|
|o1-mini|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|
|o1-preview|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|

</details>

<details>
<summary>Cloudflare</summary>

|LLM|Notes|
|---|---|
|Llama-2-chat-7b|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|llama-3-8b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3.1-8b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3.2-1b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3.2-3b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|m2m100-1.2b|M2M100 is a multilingual encoder-decoder (seq-to-seq) model primarily intended for translation tasks. M2M100 does not support custom translation dictionaries.|
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |

</details>

<details>
<summary>Google Vertex AI</summary>

|LLM|Notes|
|---|---|
|gemini-1.5-flash (128K Context)|Gemini 1.5 Flash is designed for high-volume, high-frequency tasks where cost and latency matter. On most common tasks, Flash achieves comparable quality to other Gemini Pro models at a significantly reduced cost. Flash is well-suited for applications like chat assistants and on-demand content generation where speed and scale matter.|
|gemini-1.5-flash (1M Context)|Gemini 1.5 Flash is designed for high-volume, high-frequency tasks where cost and latency matter. On most common tasks, Flash achieves comparable quality to other Gemini Pro models at a significantly reduced cost. Flash is well-suited for applications like chat assistants and on-demand content generation where speed and scale matter.|
|gemini-1.5-flash-001 (128K Context)|Gemini 1.5 Flash is designed for high-volume, high-frequency tasks where cost and latency matter. On most common tasks, Flash achieves comparable quality to other Gemini Pro models at a significantly reduced cost. Flash is well-suited for applications like chat assistants and on-demand content generation where speed and scale matter.|
|gemini-1.5-flash-001 (1M Context)|Gemini 1.5 Flash is designed for high-volume, high-frequency tasks where cost and latency matter. On most common tasks, Flash achieves comparable quality to other Gemini Pro models at a significantly reduced cost. Flash is well-suited for applications like chat assistants and on-demand content generation where speed and scale matter.|
|gemini-1.5-flash-8b|Gemini 1.5 Flash-8B is a small model designed for lower intelligence tasks. .|
|gemini-1.5-pro (128K Context)|Gemini 1.5 Pro is a foundation model that performs well at a variety of multimodal tasks such as visual understanding, classification, summarization, and creating content from image, audio and video. It's adept at processing visual and text inputs such as photographs, documents, infographics, and screenshots.|
|gemini-1.5-pro (1M Context)|Gemini 1.5 Pro is a foundation model that performs well at a variety of multimodal tasks such as visual understanding, classification, summarization, and creating content from image, audio and video. It's adept at processing visual and text inputs such as photographs, documents, infographics, and screenshots.|
|gemini-1.5-pro-001 (128K Context)|Gemini 1.5 Pro is a foundation model that performs well at a variety of multimodal tasks such as visual understanding, classification, summarization, and creating content from image, audio and video. It's adept at processing visual and text inputs such as photographs, documents, infographics, and screenshots.|
|gemini-1.5-pro-001 (1M Context)|Gemini 1.5 Pro is a foundation model that performs well at a variety of multimodal tasks such as visual understanding, classification, summarization, and creating content from image, audio and video. It's adept at processing visual and text inputs such as photographs, documents, infographics, and screenshots.|
|gemini-2.0-flash-001|Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, multimodal generation, and a 1M token context window.|
|gemini-2.0-flash-exp|Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, multimodal generation, and a 1M token context window.|
|gemini-2.0-flash-lite-preview-02-05|Gemini 2.0 Flash-Lite is the fastest and most cost efficient Flash model. It's an upgrade path for 1.5 Flash users who want better quality for the same price and speed.|
|gemini-2.0-pro-exp-02-05|Gemini 2.0 Pro is the strongest model for coding and world knowledge and features a 2M long context window. Gemini 2.0 Pro is available as an experimental model in Vertex AI and is an upgrade path for 1.5 Pro users who want better quality, or who are particularly invested in long context and code.|

</details>

<details>
<summary>HuggingFace</summary>

|LLM|Notes|
|---|---|
|Flan-t5-xxl|The Flan models are primarily english-only, and may struggle with joining thoughts across multiple documents. You will find answers tend to be selected from a single source, even when a stitched answer may be better.  Flan does suffer from strong hallucinations, so it is recommended to only use Flan for internal usecases and ensure the Semantic Scoring model is on and primary with a minimum confidence level set of at least 10-15%.|
|Flan-ul2|The Flan models are primarily english-only, and may struggle with joining thoughts across multiple documents. You will find answers tend to be selected from a single source, even when a stitched answer may be better.  Flan does suffer from strong hallucinations, so it is recommended to only use Flan for internal usecases and ensure the Semantic Scoring model is on and primary with a minimum confidence level set of at least 10-15%.|
|Llama-2|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the non-chat version (Llama-2-7b-hf, Llama-2-13b-hf, Llama-2-70b-hf) |
|Llama-2-chat|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|llama-3-chat|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mixtral-8x22B-Instruct-v0.1|The Mixtral-8x22B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. It outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mixtral-8x7B-Instruct|The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|MPT-7B-instruct|The mpt-7b-instruct2 model can generate longer text than the Flan models. Use caution, however, as the model is prone to both extreme hallucination and runaway responses.  Be sure to set a minimum confidence level to control this. Not reccomended for public usecases. |

</details>

<details>
<summary>NeuralSeek</summary>

|LLM|Notes|
|---|---|
|llama-3.1-8b-instruct|Llama 3.1 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. This is a Globally-hosted model and is not guaranteed to run within a particular geography. Do not use this model if you have data residency requirements.|
|Translate|The translate model is an encoder-decoder model focused on language translation. This model does not support custom translation dictionaries or additional LLM instructions. If you require those capabilities do not use this model.This is a Globally-hosted model and is not guaranteed to run within a particular geography. Do not use this model if you have data residency requirements.|

</details>

<details>
<summary>OpenAI</summary>

|LLM|Notes|
|---|---|
|gpt-3.5-turbo-0125|GPT-3.5 provides a good balance of speed and capability.|
|GPT-4o|GPT-4o matches GPT-4 Turbo performance on text in English and code, with significant improvement on text in non-English languages.|
|gpt-4o-mini|GPT-4o mini is an affordable and intelligent small model for fast, lightweight tasks. GPT-4o mini is cheaper and more capable than GPT-3.5 Turbo..|
|GPT3.5|GPT-3.5 provides a good balance of speed and capability.|
|GPT3.5 (16K)|GPT-3.5 provides a good balance of speed and capability.  The 16K context window version of the model allows for more information to be passed to it, generally yeilding better responses.|
|GPT4|GPT-4 can often take longer than 30 seconds for a full response.  Use caution when using in conjunction with a Virtual Agent platform that imposes a strict timeout.|
|GPT4 (32K)|GPT-4 can often take longer than 30 seconds for a full response.  Use caution when using in conjunction with a Virtual Agent platform that imposes a strict timeout. The 16K context window version of the model allows for more information to be passed to it, generally yeilding better responses.|
|GPT4 Turbo (Preview)|GPT-4 Turbo provides a good balance of speed and capability.  The 16K context window version of the model allows for more information to be passed to it, generally yeilding better responses.|
|o1|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|
|o1-mini|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|
|o1-preview|The o1 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|
|o3-mini|The o3 series of large language models are trained with reinforcement learning to perform complex reasoning. o1 models think before they answer, producing a long internal chain of thought before responding to the user.|

</details>

<details>
<summary>together.ai</summary>

|LLM|Notes|
|---|---|
|DeepSeek-R1|DeepSeek-R1, a strong Mixture-of-Experts (MoE) language model with 671B total parameters . |
|DeepSeek-V3|DeepSeek-V3, a strong Mixture-of-Experts (MoE) language model with 671B total parameters . |
|Llama-2 Chat 13B|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|Llama-2 Chat 70B|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|Llama-2 Chat 7B|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|llama-2-13b|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the non-chat version (Llama-2-7b-hf, Llama-2-13b-hf, Llama-2-70b-hf) |
|llama-2-70b|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the non-chat version (Llama-2-7b-hf, Llama-2-13b-hf, Llama-2-70b-hf) |
|LLaMA-2-7B-32K-Instruct|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the non-chat version (Llama-2-7b-hf, Llama-2-13b-hf, Llama-2-70b-hf) |
|Llama-3.1-405B-Instruct-Turbo|llama-3-405b instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.|
|Llama-3.1-8B-Instruct-Turbo-128K|Llama-3.1-8B-Instruct-Turbo-128K instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.|
|Llama-3.3-70B-Instruct-Turbo|Llama-3.3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.|
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mistral-7B-Instruct|Mistral brings capabilities similar to many popular commercial models. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mixtral-8x22B-Instruct-v0.1|The Mixtral-8x22B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. It outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |
|Mixtral-8x7B-Instruct|The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |

</details>

<details>
<summary>watsonx.ai</summary>

|LLM|Notes|
|---|---|
|elyza-japanese-llama-2-7b-instruct|ELYZA-japanese-Llama-2-7b は、 Llama2をベースとして日本語能力を拡張するために追加事前学習を行ったモデルです。|
|Flan-t5-xxl|The Flan models are primarily english-only, and may struggle with joining thoughts across multiple documents. You will find answers tend to be selected from a single source, even when a stitched answer may be better.  Flan does suffer from strong hallucinations, so it is recommended to only use Flan for internal usecases and ensure the Semantic Scoring model is on and primary with a minimum confidence level set of at least 10-15%.|
|Flan-ul2|The Flan models are primarily english-only, and may struggle with joining thoughts across multiple documents. You will find answers tend to be selected from a single source, even when a stitched answer may be better.  Flan does suffer from strong hallucinations, so it is recommended to only use Flan for internal usecases and ensure the Semantic Scoring model is on and primary with a minimum confidence level set of at least 10-15%.|
|granite-13b-chat-v2|The Granite series of models are a step ahead of their counterpart t5 and UL2 models.  They excel at retrieving correct information from good documentation, and can join phrases from a limited number of documents.  They do not have much ability to reason, however.  This can be good or bad, depending on your usecase. Use granite to answer a well defined set of questions from good documentation. Granite likes to generate short results, and will create runaway responses if pressed to generate longer than it wants to. Granite will hallucinate if asked questions without a good reference in your knowledgeBase, or that stray too closely to its training data, and may refuse to follow your documentation.  Use semantic scoring to block this hallucination.|
|granite-13b-instruct-v2|The Granite series of models are a step ahead of their counterpart t5 and UL2 models.  They excel at retrieving correct information from good documentation, and can join phrases from a limited number of documents.  They do not have much ability to reason, however.  This can be good or bad, depending on your usecase. Use granite to answer a well defined set of questions from good documentation. Granite likes to generate short results, and will create runaway responses if pressed to generate longer than it wants to. Granite will hallucinate if asked questions without a good reference in your knowledgeBase, or that stray too closely to its training data, and may refuse to follow your documentation.  Use semantic scoring to block this hallucination.|
|granite-20b-multilingual|The Granite series of models are a step ahead of their counterpart t5 and UL2 models.  They excel at retrieving correct information from good documentation, and can join phrases from a limited number of documents.  They do not have much ability to reason, however.  This can be good or bad, depending on your usecase. Use granite to answer a well defined set of questions from good documentation. Granite likes to generate short results, and will create runaway responses if pressed to generate longer than it wants to. Granite will hallucinate if asked questions without a good reference in your knowledgeBase, or that stray too closely to its training data, and may refuse to follow your documentation.  Use semantic scoring to block this hallucination.|
|granite-3-2b-instruct|Granite-3.0-2B-Instruct is a lightweight and open-source 8B parameter model fine tuned from Granite-3.0-8B-Base on a combination of open-source and proprietary instruction data with a permissively licensed. This language model is designed to excel in instruction following tasks such as summarization, problem-solving, text translation, reasoning, code tasks, funcion-calling, and more. |
|granite-3-8b-instruct|Granite-3.0-8B-Instruct is a lightweight and open-source 8B parameter model fine tuned from Granite-3.0-8B-Base on a combination of open-source and proprietary instruction data with a permissively licensed. This language model is designed to excel in instruction following tasks such as summarization, problem-solving, text translation, reasoning, code tasks, funcion-calling, and more. |
|granite-34b-code-instruct|The Granite series of models are a step ahead of their counterpart t5 and UL2 models.  They excel at retrieving correct information from good documentation, and can join phrases from a limited number of documents.  They do not have much ability to reason, however.  This can be good or bad, depending on your usecase. Use granite to answer a well defined set of questions from good documentation. Granite likes to generate short results, and will create runaway responses if pressed to generate longer than it wants to. Granite will hallucinate if asked questions without a good reference in your knowledgeBase, or that stray too closely to its training data, and may refuse to follow your documentation.  Use semantic scoring to block this hallucination.|
|granite-7b-lab (Deprecated)|The Granite 7 Billion LAB (granite-7b-lab) model is the chat-focused variant initialized from the pre-trained Granite 7 Billion (granite-7b) model, which is Meta Llama 2 7B architecture trained to 2T tokens.|
|granite-8b-japanese|The Granite 8 Billion Japanese model is an instruct variant initialized from the pre-trained Granite Base 8 Billion Japanese model. Pre-training went through 1.0T tokens of English, 0.5T tokens of Japanese, and 0.1T tokens of code. This model is designed to work with Japanese text. IBM Generative AI Large Language Foundation Models are Enterprise-level Multilingual models trained with large volumes of data that has been subjected to intensive pre-processing and careful analysis.|
|jais-13b-chat|Jais-13b-chat is Jais-13b fine-tuned over a curated set of 4 million Arabic and 6 million English prompt-response pairs. |
|Llama-2-chat 13B (Deprecated)|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|Llama-2-chat 70B (Deprecated)|Llama-2 brings capabilities similar to many popular commercial models. Llama-2 is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.|
|llama-3-1-70b-instruct|Llama 3.1 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-1-8b-instruct|Llama 3.1 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-11b-vision-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-1b-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-3b-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-2-90b-vision-instruct|Llama 3.2 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-3-70b-instruct|Llama 3.3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-405b-instruct|llama-3-405b instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-70b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama-3-8b-instruct|Llama 3 instruction-tuned models are fine-tuned and optimized for dialogue/chat use cases and outperform many of the available open-source chat models on common benchmarks.. |
|llama3-llava-next-8b-hf (depricated)|Llama 3-llava Supports image captioning, image-to-text transcription (OCR) including handwriting, data extraction and processing, context Q&A, object identification. |
|Mistral-large|The most advanced Mistral AI Large Language model capable of handling any language task including complex multilingual reasoning, text understanding, transformation, and code generation. |
|Mixtral-8x7B-Instruct|The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks. Mistral is good at joining thoughts across multiple documents.  It is also highly sensitive.  Slight variations in prompt and weighting can have a profound impact on usability of the system. Use extreme caution if applying prompt engineering or weight tuning.  This model is the instruct version. |

</details>

:::note[Info]
**LLM choice is available with NeuralSeek’s BYOLLM (bring your own Large Language Model) plan.**

LLMs can vary in their capabilities and performances. Some LLM can take up to 30 seconds and longer to generate a full response. Use caution when using in conjunction with a virtual agent platform that imposes a strict timeout.
:::

## Configuring an LLM 
:::caution[Warning]
In order to configure an LLM, make sure that you have subscribed to the Bring Your Own LLM (BYOLLM) plan. All other plans will default to NeuralSeek's curated LLM, and this option will not be available.
:::

1. In NeuralSeek UI, navigate to `Configure > LLM Details` page, using the top menu.
2. Click `Add an LLM` button.
3. Select the Platform and LLM Selection. (e.g. Platform: Self-Hosted, LLM: Flan-u2)
4. Click `Add`.
5. Enter the `LLM API key` in the LLM API Key input field.
6. Review the Enabled Languages (presented as multi-select)
7. Review the LLM functions available (presented as checkbox)
8. Click `Test` button to test whether the API key works.

:::note[Info]
You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - xAI is missing from the supported-LLM platform list
  - The model catalogue is stale — around 287 models are offered and the list is roughly two generations behind
-->
