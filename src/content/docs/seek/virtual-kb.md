---
title: "Virtual KB"
description: "Discover mAIstro's Virtual KnowledgeBase, a powerful tool to unify multiple knowledge sources for enhanced search and discovery. Learn to configure and expand your Virtual KB for flexible, scalable solutions."
---

## Overview

**What is it?**

- Virtual KB is a feature in mAIstro that allows you to define a flow and use it as a virtual knowledge base. This feature enables you to combine multiple knowledge sources into a single, unified knowledge base, providing a more comprehensive and flexible solution for your information retrieval needs.

**Why is it important?**

- A Virtual KB enhances your application's search and discovery by integrating multiple knowledge sources, delivering more comprehensive and relevant results. It offers flexibility and scalability, allowing you to easily adjust the knowledge sources as your needs change.

**How does it work?**

- Virtual KB allows you to connect and integrate various knowledge sources, such as databases, content management systems, and external APIs, into a single virtual knowledge base. Begin by building a flow in mAIstro utilizing our variety of native functions and connectors or reference our Virtual KB example template for an easy guide on configuring a Virtual KB. 

## Example Template in mAIstro

1. Navigate to the mAIstro tab in your NeuralSeek instance.
2. Click on Example Templates, and search for the template titled **Virtual KB**. 

![image](/img/seek/virtual-kb/virtualKB_selectExTemp.png)
![image](/img/seek/virtual-kb/virtualKB_selectVirtualKBtemplate.png)

This flow utilizes the **Virtual In** and **Virtual Out** nodes, located underneath RAG Tools on the sidebar menu. It passes a DuckDuckGo Search connector and a Rest API connector with a Wikipedia URL to the Large Language Model for answer generation within the Seek tab. We are now able to utilize the World Wide Web as a knowledge source for answer generation.

![image](/img/seek/virtual-kb/virtualKB_mAIstroVisual.png)

```
{{ virtualKbIn  }}
{{ duckSearch  | query: "<< name: virtualKbIn.contextQuery>>" }}=>{{ variable  | name: "parallelDuckRaw" }}
{{ post  | url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=<< name: virtualKbIn.contextQuery, prompt: true >>" | body: "" | headers: "" | username: "" | password: "" | apikey: "" | operation: "POST" | jsonToVars: "true" }}=>{{ varsToJSON  | path: "query.search" | variable: "s1" | includePath: "false" | output: "true" }}=>{{ arrayFilter  | filter: "0-3" | filterType: "IndexRange" }}=>{{ reMapJSON  | match: "title" | replace: "document" }}=>{{ reMapJSON  | match: "snippet" | replace: "passage" }}=>{{ regex  | match: "/(\"document\":\")([^\"]+)/g" | replace: "$1$2\",\"url\":\"https://en.wikipedia.org/wiki/$2" | group: "" }}=>{{ regex  | match: "/^\[/" | replace: "" | group: "" }}=>{{ regex  | match: "/<\/?span.*?>/g" | replace: "" | group: "" }}=>{{ variable  | name: "wikipedia" }}
<< name: parallelDuckRaw, prompt: false >>=>{{ jsonEscape  }}=>{{ variable  | name: "duck" }}=>
<< name: duck, prompt: false >>=>{{ regex  | match: "/https?:\/\/[^\s)]+/g" | replace: "" | group: "0" }}=>{{ variable  | name: "url" }}
{{ virtualKbOut  | context: "[{
\"document\": \"DuckDuckGo Search\",
\"url\": \"<< name: url >>\",
\"passage\": \"<< name: duck, prompt: false >>\"
},<< name: wikipedia, prompt: false >>" | kbCoverage: 0 | kbScore: 0 | url: "<< name: url >>" | document: "" }}
```

## Selecting a Virtual KB

1. Navigate to the Configure tab in your NeuralSeek instance.
2. Expand the **KnowledgeBase Connection** accordion.
3. For KnowledgeBase Type, select the **Virtual KB** option.
4. For mAIstro Virtual KB template, select the **ex_Virtual_KB** option.
5. Click the red Save icon at the bottom of the screen to save your configuration. 

![image](/img/seek/virtual-kb/virtualKB_selectKB.png)
![image](/img/seek/virtual-kb/virtualKB_selectTemplate.png)
![image](/img/seek/virtual-kb/virtualKB_saveConfig.png)

## Seek With a Virtual KB

1. Navigate to the Seek tab in your NeuralSeek instance.
2. Type in any question. For example, **Who is Taylor Swift?**
3. Click the Seek button to generate an answer. 

As we review the answer generated, we can highlight over the statistical details and source brought back by NeuralSeek. The response is synthesized from a combination of DuckDuckGo and Wikipedia searches related to the singer. Our semantic analysis tells us about the varying jumps between source articles. Considering there is vast information on Wikipedia about Taylor Swift, we also receive a 99% KB Coverage score back. 
 
By expanding the sources below, we can examine each one in detail. The provenance highlights indicate the specific keywords and phrases drawn from each source to form the final response.

![image](/img/seek/virtual-kb/virtualKB_seek.png)
![image](/img/seek/virtual-kb/virtualKB_seekStats.png)

## Expanding Your KnowledgeBase

Ultimately, you can connect virtually any knowledge source to your NeuralSeek instance for answer generation via the Virtual KB connectors in mAIstro. You can choose from a variety of built-in database connectors, KnowelgeBase connectors, or Web Search connectors. Or, connect to any additional source via our Rest API connector node. 

#### Building a Flow

1. Navigate to mAIstro in your NeuralSeek Instance.
2. Select the **Virtual KB - In** node from the sidebar menu under RAG Tools. 

This node gives you several variables to use inside of your flow. 

![image](/img/seek/virtual-kb/virtualKB_addKBin.png)

3. Select the **Website Data** node from the sidebar menu under Get Data. This will automatically link below your first node.
4. Click the gear icon to input any valid URL. In this example, we are connecting to a Google search: `https://www.google.com/search?gfns=1&q=<< name: virtualKbIn.contextQuery>>`
5. Select the **Set Variable** node from the sidebar menu under Control Flow. 
6. Click and drag the Set Variable node to the right of the Website Data node to chain it. 
7. Click the gear icon to set the variable name. In this example, the variable name is `google`. 

The addition of the variable **virtualKbIn.contextQuery** allows the context of the user's query to be dynamically carried forward in the Google search. 

![image](/img/seek/virtual-kb/virtualKB_addWeb1.png)
![image](/img/seek/virtual-kb/virtualKB_addVar1.png)

8. Select a second **Website Data** node. 
9. Click the gear icon to input any additional URL. In this example, we are connecting to NeuralSeek's documentation page: `https://documentation.neuralseek.com/`
10. Select the **Set Variable** node from the sidebar menu under Control Flow. 
11. Click and drag the Set Variable node to the right of the second Website Data node to chain it. 
12. Click the gear icon to set the variable name. In this example, the variable name is `docs`.

We have added the NeuralSeek documentation as a second source of reference for our KnowledgeBase and are performing a static pull of the website's information.

![image](/img/seek/virtual-kb/virtualKB_addWeb2.png)
![image](/img/seek/virtual-kb/virtualKB_addVar2.png)

13. Select the **Virtual KB - Out** node from the sidebar menu under RAG Tools. 
14. Click the gear icon to configure the information to be piped back into Seek. In this example, we want to define the passage by including the variable names: `<< name: google >>\n<< name: docs >>`. 
15. Additionally, we can preset the kbCoverage, kbScore, url, and document name. In this example, we define the document name as `Virtual KB`. 
16. Save your mAIstro flow with a unique name and optional description. In this example, the name is `websiteKB`.

Both of the websites will now be pulled live every time a Seek comes in. The information scraped from the sites will come out dynamically and in parallel, then plugged back into the Seek process for answer generation.

:::note
While we use a single, concatenated document here for the sake of simplicity, it is possible to split this into multiple documents. Simply build a JSON object with an array of document objects containing properties: document (title), url, score, and passage.
:::

![image](/img/seek/virtual-kb/virtualKB_addKBout.png)
![image](/img/seek/virtual-kb/virtualKB_finalBuild.png)
![image](/img/seek/virtual-kb/virtualKB_saveNewFlow.png)

```

{{ virtualKbIn  }}
{{ web  | url: "https://www.google.com/search?gfns=1&q=<< name: virtualKbIn.contextQuery>>" }}=>{{ variable  | name: "google" }}
{{ web  | url: "https://documentation.neuralseek.com/" }}=>{{ variable  | name: "docs" }}
{{ virtualKbOut  | context: "<< name: google >>\n<< name: docs >>" | kbCoverage: 0 | kbScore: 0 | url: "" | document: "Virtual KB" }}

```

#### Configuring a Virtual KB

1. Navigate to the Configure tab in your NeuralSeek instance.
2. Expand the **KnowledgeBase Connection** accordion.
3. For KnowledgeBase Type, select the **Virtual KB** option.
4. For mAIstro Virtual KB template, select the **websiteKB** option.
5. Click the red Save icon at the bottom of the screen to save your configuration. 

![image](/img/seek/virtual-kb/virtualKB_saveNewConfig.png)

#### Seek with a Virtual KB

1. Navigate to the Seek tab in your NeuralSeek instance.
2. Type in any question. For example, **Does NeuralSeek provide a Hands-On Lab?**
3. Click the Seek button to generate an answer. 

We can expand the Virtual KB source underneath KnowledgeBase Context and view which information was pulled from the Google Search and which was pulled from our NeuralSeek Documentation URL to generate the answer.

![image](/img/seek/virtual-kb/virtualKB_seekNewBuild.png)
![image](/img/seek/virtual-kb/virtualKB_seekNewContext.png)
