---
title: "Virtual agents"
description: "Explore NeuralSeek's supported virtual agents, including watsonx Assistant and AWS Lex. Discover features like fallback search, answer curation, and round-trip monitoring for enhanced chatbot integration."
---

| Virtual Agent Platform                                                                          | Answer Curation     | Round-Trip Monitoring | Fallback Search Template/Extension | 
| ----------------------------------------------------------------------------------------------- | --------------------| --------------------- | ---------------------------------- |
| [watsonx Assistant](https://www.ibm.com/products/watsonx-assistant)                             | ✓    | ✓      | ✓                   |
| [AWS Lex](https://aws.amazon.com/lex/)                                                          | ✓    | ✓      | ✓                   |
| [kore.ai](https://kore.ai/)                                                                     | ✓    | ✓      | ✗                   |
| [Cognigy](https://www.cognigy.com/)                                                             | ✓    | ✗      | ✗                   |
| [Azure AI Bot](https://azure.microsoft.com/en-us/products/ai-services/ai-bot-service)           | ✓    | ✗      | ✗                   |



  - **What is Fallback Search?**
    - Fallback search is sometimes also known as "RAG". This allows you to helpfully answer customer/user questions where there is no intent/dialog mapping in your chatbot solution, providing an enhanced user experience.
    - We offer templates for some chatbot platforms to quick-start, eg watsonx Assistant and AWS Lex.
    - With the REST API, any platform that is able to utilize REST APIs are able to integrate with NeuralSeek.

  - **What is Answer Curation?**
    - NeuralSeek offers an option to export questions and answers previously generated in a format compatible with some existing chatbot solutions, allowing users to "Curate" or import these generated answers directly into their chatbot service. 
    
        - Pros of this can be: Faster answers, reduced cost of language generation.
        
        - Cons of this can be: Stagnant pools of answers that manually need updating. However, we do offer Round-trip monitoring to help with this task.

  - **What is Round-Trip Monitoring?**
    - NeuralSeek will monitor the usage of NeuralSeek-curated intents that have been imported into your chatbot solution, and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase.
