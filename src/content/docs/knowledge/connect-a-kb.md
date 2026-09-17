---
title: "Connect a knowledge base"
description: "Discover how to seamlessly integrate NeuralSeek with virtual agents, APIs, and more with NeuralSeek's Integrate page. Access step-by-step guides, enhance user experience, and optimize performance with comprehensive logging tools."
---

## Overview

![integrate](/img/knowledge/connect-a-kb/integrate.png)

**What is it?**

- The Integrate tab provides users with detailed instruction on integration of NeuralSeek with selected Virtual Agents, WebHook, API, or self-hosted LLM. 

**Why is it important?**

- NeuralSeek provides comprehensive guidance on selected integrations which allows for a more user-friendly experience.  

**How does it work?**

- The Integrate tab on NeuralSeek's user interface provides step-by-step instructions on how to connect to various virtual agent frameworks. Once connected, users are able to call on NeuralSeek through the chosen framework as either a "fallback intent" or other action. 

    - **Custom Extension:** This contains the information to build a custom NeuralSeek extension within Watson Assistant.
    - **LexV2 Lambda:** Use AWS Lambda to send user input that routes the Lex FallbackIntent to NeuralSeek. Used in conjunction with AWS LexV2.
    - **LexV2 Logs:** How to enable Round-Trip Logging using LexV2 Logs, to monitor the usage of curated intents. The purpose of round-trip logging is to improve the virtual agent’s performance by analyzing the data and identifying areas for improvement.
    - **Watson Logs**: How to enable Round-Trip Logging using Watson Logs, to monitor the usage of curated intents. The purpose of round-trip logging is to improve the virtual agent’s performance by analyzing the data and identifying areas for improvement.
    - **WebHook**: This is the backbone of NeuralSeek, how users connect and communicate with the solution. One can make a call to this WebHook from any application (e.g. slack, servicenow, etc.) that can forward its question to it and receive answers from.
    - **API (REST)**: Where to find necessary information regarding how to invoke NeuralSeek’s REST API, and navigate and test it right on its openAPI generated page. You can get examples of JSON message requests and responses, as well as JSON schema of the message payloads.
    - **KoreAI**: Activate Round-Trip monitoring for deployed NeuralSeek Intents. This feature enables NeuralSeek to continuously monitor the usage of its curated intents through KoreAI event Tasks. It will promptly alert you if any curated intents require updates due to changes in the associated KnowledgeBase documents.
    - **Console API**: This integration allows users to access debugging and monitoring features conveniently from within the NeuralSeek application, simplifying tasks such as error identification, performance analysis, and data insights without the need to switch between different tools or interfaces. It enhances the user experience by providing seamless access to the Console API's functionality within NeuralSeek's interface, streamlining development and monitoring tasks

## API Keys

The API Keys page allows you to easily create API Keys for NeuralSeek that can be integrated with various other services.

To add an API Key, click on the Create ApiKey button and input the name you want to use for the Key in the pop-up prompt.

![addkey](/img/knowledge/connect-a-kb/addkey.png)

After the key has been created, you will be able to see both the name of the key as well as the API code that you are able to copy immediately after creation.

![keycode](/img/knowledge/connect-a-kb/keycode.png)

**If you don’t copy the API key immediately after creating it, you won’t be able to copy it again.** However, the key will continue to function normally for any services where it has already been defined.

If you want to delete an API Key and terminate its services, simply check off the checkbox next to a key's name and click on the Delete ApiKey button. This will remove the key from your instance.

![deletekey](/img/knowledge/connect-a-kb/keydelete.png)

## REST API

Virtual Agents, chatbots, and applications can send user questions and receive answers via NeuralSeek’s REST API. In the `Integrate > API`, you can access its openAPI documentation that covers its service endpoints, and also can test its executions, as well as access the message schema. For more information, please refer to [https://api.neuralseek.com/](https://api.neuralseek.com/).

### Example of curl command to invoke REST API

```bash
curl -X 'POST' \
  'https://api.neuralseek.com/v1/test/seek' \
  -H 'accept: application/json' \
  -H 'apikey: xxxxxx07-xxxxxxbc-xxxxxxae-xxxxxxef' \
  -H 'Content-Type: application/json' \
  -d '{ "question": "I want to know more about NeuralSeek" }'
```

### Example of JSON Response

```json
{
  "answer": "NeuralSeek is an AI-powered Answers-as-a-Service platform designed to enhance information sharing and customer support within virtual agents. It leverages a sophisticated Large Language Model (LLM) and a corporate KnowledgeBase to provide contextually relevant responses to user queries. NeuralSeek offers features such as fact-checking, data analytics, and step-by-step instructions to improve AI-generated responses. It can be integrated with virtual agents like IBM Watson Assistant or AWS Lex and used as an internal organization tool. NeuralSeek also provides training resources, demos, and support for users.",
  "ufa": "NeuralSeek is an AI-powered Answers-as-a-Service platform designed to enhance information sharing and customer support within virtual agents. It leverages a sophisticated Large Language Model (LLM) and a corporate KnowledgeBase to provide contextually relevant responses to user queries. NeuralSeek offers features such as fact-checking, data analytics, and step-by-step instructions to improve AI-generated responses. It can be integrated with virtual agents like IBM Watson Assistant or AWS Lex and used as an internal organization tool. NeuralSeek also provides training resources, demos, and support for users.",
  "intent": "FAQ-neuralseek",
  "category": 0,
  "categoryName": "Other",
  "answerId": 1706800601368,
  "warningMessages": [],
  "cachedResult": false,
  "langCode": "en",
  "sentiment": 5,
  "totalCount": 14,
  "KBscore": 53,
  "score": 26,
  "url": "http://documentation.neuralseek.com/overview/",
  "document": "NeuralSeek Overview",
  "kbTime": 7472,
  "kbCoverage": 56,
  "semanticScore": 26,
  "semanticAnalysis": "The answer has many jumps between source articles, which lowered the overall score.  Source jumping may indicate the meaning & intent of the source articles are not carrying thru to the answer.  The high standard deviation of the contributing sources increased the overall score.  The primary source does not match the full answer well, which decreased the total score.  The answer had the terms \"Service platform\" and \"leverages\" and \"checking\" that were not backed by a reference to source documentation, which decreased the final score significantly.",
  "semanticDetails": {
    "sourceJumps": 17,
    "stdDeviation": 78.71767414134023,
    "topSourceCoverage": 0.4640198511166253,
    "totalCoverage": 1.0397022332506203,
    "answerLength": 403,
    "longestPhrase": 41,
    "unattributedKeyTerms": [],
    "unattributedTerms": [
      "Service platform",
      "leverages",
      "checking"
    ],
    "unattributedNumbers": [],
    "missingKeyTerms": [],
    "missingTerms": []
  },
  "time": 13181,
  "thumbs": "https://api.neuralseek.com/v1/test/thumbs/1706800601368/1393218967/rate.svg"
}
```

## Supported Integrations

{pagelist b supportedintegration}


## Guides
Here is a list of guides relevant to the Integrate tab.

{pagelist 1000 Gintegrate}
