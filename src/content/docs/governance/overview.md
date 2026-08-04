---
title: "Governance overview"
description: "Explore NeuralSeek's Governance tab for a comprehensive view of RAG governance. Access insights on system performance, semantic confidence, and documentation metrics to make informed decisions."
---

## Overview

![gov_overview](/img/governance/overview/gov_overview.png)
![gov_overview_intents](/img/governance/overview/gov_overview_intents.png)


**What is it?**

- The Governance tab is a comprehensive tool designed to provide users with a holistic view of Retrieval Augenmented Generation (RAG) governance. It serves as a centralized platform where users can access various insights and metrics related to the governance of their NeuralSeek system.
    
**Why is it important?**

- NeuralSeek's Governance ensures the effective management and oversight of NeuralSeek systems. With features like semantic insights, documentation insights, intent analytics, system performance, and configuration insights, users gain valuable information to make informed decisions about their NeuralSeek instance. This level of transparency and control is essential for maintaining the integrity and efficiency of NeuralSeek processes.

**How does it work?**

- The Governance tab operates by aggregating and analyzing data from various sources within the NeuralSeek platform. By consolidating these insights in one accessible interface, NeuralSeek's Governance tab empowers users to make well-informed decisions regarding their NeuralSeek governance strategies. Additionally, the Goverance tab's dyanmic interface allows users to filter by intent, category, or date for a more specified scope of internal analytics. 

## Seek Governance

:::note

All the values provided are intended for illustrative purposes only.
:::

### Semantic Insights

![Semantic insights](/img/governance/overview/semanticinsights.png)

**Semantic Confidence**

This section speaks to the confidence level in understanding the queries semantically. It indicates the lowest, average, and highest semantic confidence of answers across the instance, providing a sense of how well the system grasps the meaning of the questions asked.
:::note[Values]
- **Min**: 0.0% - This represents the lowest level of confidence the system has shown.
- **Average**: 32.0% - This is the typical confidence level across all queries.
- **Max**: 100.0% - This indicates the highest confidence level achieved.
:::

**Longest Source Phrase in Answer**

This insight reflects the smallest, average, and largest verbatim phrase or quote from the documentation source material that has been included in the answers. It shows how much direct quoting from the source material is used in the responses.
:::note[Values]
- **Min**: 10 - The shortest phrase taken directly from the source.
- **Average**: 146 - The typical length of quoted phrases.
- **Max**: 445 - The longest phrase included in an answer.
:::

**Top Source Coverage**

This shows the percentage of documentation coverage of the "top document" for each query. It indicates how often the top-ranked source document is used to generate the answer.
:::note[Values]
- **Min**: 0.0% - Instances where the top source was not used.
- **Average**: 50.0% - On average, how frequently the top source is utilized.
- **Max**: 100.0% - Full reliance on the top source for generating answers.
:::

**Total Coverage**

This describes the overall coverage percentage of all sources used in generating the answers. It highlights how diverse the sources are that contribute to the final response.
:::note[Values]
- **Min**: 0.0% - Scenarios where no sources were used.
- **Average**: Not specified - The typical coverage across queries.
- **Max**: 100.0% - Full utilization of available sources.
:::

**Total Answer Length**

This insight measures the total length of the answers provided, indicating the smallest, average, and largest lengths. It helps in understanding the verbosity of the responses.
:::note[Values]
- **Min**: 56 - The shortest answer length.
- **Average**: Not specified - The typical answer length.
- **Max**: 771 - The longest answer length.
:::

**Answer Source Standard Deviation**

This shows the variability in the number of sources used in generating answers, represented by the standard deviation. It indicates how consistently the same number of sources is used across different answers.
:::note[Values]
- **Min**: 0 - No variation in the number of sources.
- **Average**: 97 - Typical variability in source usage.
- **Max**: 204 - Highest variability in the number of sources used.
:::

**Answer Source Jumps**

This measures the number of times the source of information changes during the generation of an answer. It shows the smallest, average, and largest number of source jumps, indicating how often the system switches between different sources.
:::note[Values]
- **Min**: 0 - No jumps between sources.
- **Average**: 19 - Typical number of source jumps.
- **Max**: 28 - Highest number of jumps between sources.
:::

**Cache Hit %**

This indicates the percentage of times answers were retrieved from the cache, edited, or uncached. It highlights the efficiency of the caching mechanism in providing quick responses.
:::note[Values]
- **Min**: 0.0% - Instances where the cache was not used.
- **Cached**: 100.0% - Full reliance on cached answers.
- **Edited**: Not specified - Frequency of edited cached responses.
- **UnCached**: Not specified - Frequency of answers not retrieved from the cache.
:::

**Top Hallucinated Terms**

![Top hallucinated terms](/img/governance/overview/tophallucinated.png)

This pie chart identifies the most frequently hallucinated terms by the model. Hallucination in this context refers to terms generated by the model that were not present in the source material. The chart is divided into three categories.

:::note[Categories]
- **NeuralSeeks Flex**: 33.3% - Terms related to NeuralSeeks Flex.
- **Leverage**: 33.3% - Terms related to leveraging information.
- **Language Model**: 33.3% - Terms generated by the language model.
:::

<details>
<summary>Example</summary>

If a user clicks on one of the hallucinated term names to the right of the pie chart, a pop-up will appear asking if the user wants to allow-list the term. This will add the term to the instance's library and remove it from the hallucinated terms list. 

![Allowlist](/img/governance/overview/allow-list.png)

After allowing the term, you can head over to the Configure tab and check the Semantic Model Tuning settings in Semantic Scoring, and see how the allowed term has been added to the list of phrases that can be used without penalty, in regards to Semantic Match scores.

![penalty](/img/governance/overview/no-penalty-answer.png)

</details>

### Documentation Insights
This document provides an overview of the documentation insights for NeuralSeek. The insights are visualized using various gauge charts and pie charts, each representing different aspects of the documentation's performance and usage.

![Knowledge base](/img/governance/overview/knowledgebase.png)

**KnowledgeBase Confidence**

This chart indicates the confidence level in the information provided by the knowledge base. It shows the lowest, average, and highest confidence scores across different instances.
:::note[Values]
- **Min**: 0.0% - Represents the lowest confidence recorded.
- **Average**: 34.0% - The typical confidence level in the knowledge base.
- **Max**: 100.0% - The highest confidence score achieved.
:::

**KnowledgeBase Coverage**

This chart shows how extensively the knowledge base covers the necessary topics and information. It presents the smallest, average, and largest coverage percentages.
:::note[Values]
- **Min**: 0.0% - Indicates no coverage in some instances.
- **Average**: 84.0% - The typical coverage percentage.
- **Max**: 100.0% - Full coverage of the necessary topics.
:::

**Most Referenced Documents**

![Most referenced docs](/img/governance/overview/mostreferencedocs.png)

This pie chart identifies the documents that are most frequently referenced by the system. It provides a breakdown of the most utilized documentation sources, indicating their relative importance.
<details>
<summary>Top Documents</summary>

- **NeuralSeek Documentation**: 56.1%
- **Changelog NeuralSeek Documentation**: 9.3%
- **KnowledgeBase Tuning NeuralSeek Documentation**: 8.4%
- **Configuration Details NeuralSeek Documentation**: 7.5%
- **No Title**: 6.5%
- **Implementing Feedback NeuralSeek Documentation**: 5.6%
- **Conversational Capabilities NeuralSeek Documentation**: Not specified
- **Advanced Features NeuralSeek Documentation**: Not specified
- **Configuring ElasticSearch for Vector Search NeuralSeek Documentation**: Not specified
- **NeuralSeek User Interface NeuralSeek Documentation**: Not specified

</details>

**Most Referenced URLs**

![Most referenced urls](/img/governance/overview/mostreferenceurls.png)

This pie chart shows the URLs of the documents that are most frequently referenced. It provides a detailed breakdown of the most accessed online resources.

**User Ratings**

This chart shows the average user ratings of the documentation. It helps in understanding the user satisfaction with the quality and usefulness of the documentation provided.
:::note[Values]
- **Average User Rating**: Not specified - The typical rating given by users.
:::

### Intent Insights

This document provides an overview of the coverage and confidence insights for NeuralSeek. The insights are visualized using distribution charts, each representing different aspects of intent coverage and confidence over a lookback period.

**Coverage Insights**

![Coverage](/img/governance/overview/coverage.png)

This chart shows the percentage of coverage for various intents, sorted by frequency. It provides insights into how well different intents are covered by the system.
:::note[Examples]
- **FAQ-neuralseek**: Shows high coverage, indicating that queries related to NeuralSeek are well supported.
- **FAQ-collection**: Indicates low coverage, reflecting weak support for collection-related queries.
:::

**Confidence Insights**

![Confidence](/img/governance/overview/confidence.png)

This chart shows the confidence level for various intents, sorted by frequency. It provides insights into the system's confidence in answering queries related to different intents.
:::note[Examples]
- **FAQ-maistro**: Shows moderate confidence, reflecting a reasonable level of confidence in answering Maistro-related queries.
- **FAQ-collection**: Displays good confidence, indicating strong confidence in addressing collection-related queries.
- **FAQ-industry**: Demonstrates low confidence, suggesting some uncertainty in handling masking PII-related queries.
:::

**Lookback Period**

The lookback period slider allows for the analysis of coverage and confidence based on the desired recent time period.

### Token Insights

This document provides an overview of the token insights for NeuralSeek. The insights are visualized using various gauge charts, bar charts, and line charts, each representing different aspects of token usage, cost, and generation performance.

![Token usage](/img/governance/overview/tokenusage.png)

**Total Tokens**

This chart shows the total number of tokens processed, including both input and generated tokens.
:::note[Values]
- **Input Tokens**: 21,174 - The number of tokens received as input.
- **Generated Tokens**: 209,637 - The number of tokens generated as output.
- **Total**: 230,811 - The sum of input and generated tokens.
:::

**Total Token Cost**

This chart indicates the total cost associated with token processing, including both input and generated tokens.
:::note[Values]
- **Input Tokens Cost**: $0.03 - The cost incurred for processing input tokens.
- **Generated Tokens Cost**: $0.05 - The cost incurred for processing generated tokens.
- **Total Cost**: $0.08 - The total cost for processing both input and generated tokens.
:::

**Input Tokens per Seek**

This chart shows the number of input tokens used per seek, indicating the smallest, average, and largest number of tokens.
:::note[Values]
- **Min**: 2 - The minimum number of input tokens used in a single seek.
- **Average**: 1,959 - The average number of input tokens used per seek.
- **Max**: 2,508 - The maximum number of input tokens used in a single seek.
:::

**Generated Tokens per Seek**

This chart shows the number of generated tokens per seek, indicating the smallest, average, and largest number of tokens.
:::note[Values]
- **Min**: 23 - The minimum number of tokens generated in a single seek.
- **Average**: 198 - The average number of tokens generated per seek.
- **Max**: 282 - The maximum number of tokens generated in a single seek.
:::

**Cost per 1k Seeks**

This chart indicates the cost associated with every 1,000 seeks.
:::note[Values]
- **Min**: $0.00 - The minimum cost per 1,000 seeks.
- **Average**: Not specified - The average cost per 1,000 seeks.
- **Max**: Not specified - The maximum cost per 1,000 seeks.
:::

**Token Generation per Second**

This chart shows the rate of token generation per second, indicating the smallest, average, and largest rates.
:::note[Values]
- **Min**: 3 - The minimum rate of token generation per second.
- **Average**: 7 - The average rate of token generation per second.
- **Max**: 41 - The maximum rate of token generation per second.
:::

**Token Over Time**

![Tokens over time](/img/governance/overview/tokensovertime.png)

This line chart shows the total tokens, input tokens, and generated tokens over a period of time.

### Cost Insights

![Model cost](/img/governance/overview/modelcost.png)

**Model Cost Comparison**

This bar chart compares the costs associated with different models used within NeuralSeek. Easily compare your selected model cost against other popular models.

### Seek Logs

![logs](/img/governance/overview/logsfilter.png)
![filter](/img/governance/overview/seek-filter.png)

This feature allows users to filter their log history by date efficiently, including session ID, questions, and answers, for a more streamlined and informative experience. The efficient filtering options enhance the usability of the log, providing a streamlined experience. This functionality is important for troubleshooting, understanding user behavior, and making informed decisions to improve the overall efficiency and effectiveness of the Seek and Chat features within NeuralSeek.
:::note[Values]
- **Date:** The time and date the logged Seek/Chat occurred.
- **Session:** The session ID of the logged response.
- **Question:** The question inputted by the user.
- **Answer:** The response generated by NeuralSeek. You can now see the filters applied during the Seek query search.
:::

:::tip[Replay]
You can also use the Replay feature here, which allows you to "replay" previously logged questions and analyze their Semantic scores. For more information, see [Replay](https://documentation.neuralseek.com/main_features/advanced_features/advanced_features/#replay).
:::

## mAIstro Governance
### Flow Insights

![flow-insights](/img/governance/overview/flowinsights-one.png)

**Time Per Run**

This chart shows the amount of time spent on a typical mAIstro run, measured in milliseconds.

:::note[Values]
- **Min**: 0 - Represents the lowest amount of time spent on a run.
- **Average**: 7291.7 - Represents the typical amount of time spent on a run.
- **Max**: 131885 - Represents the most time spent on a run.
:::

**Equivalent Seeks per run**

This chart shows the amount of seeks that would be used to complete a mAIstro agent.

:::note[Values]
- **Min**: 0.2 - Represents the lowest amount of seeks used on a run.
- **Average**: 0.4 - Represents the typical amount of seeks used on a run.
- **Max**: 3 - Represents the most seeks used on a run.
:::

**Agent Runs**

This pie chart shows how many times a specific mAIstro agents have been run. By hovering over certain slices on the chart, you can see the agent name and the number of times it has been run.

**Average Total Component Time by Agent**

![average-time-flow](/img/governance/overview/average-time.png)

This radar chart shows the average amount of time it takes each component of an agent to run, in milliseconds. By hovering over a component name, you can view the average time in that specific category.

![hover-label](/img/governance/overview/hover.png)

**Agent Run times**

![template-run-times](/img/governance/overview/template-run-times.png)

This chart shows the performance of different mAIstro agents over time, measured in milliseconds.

### Token Insights

![maistro-tokens](/img/governance/overview/tokens-charts.png)

**Total Tokens**

This chart shows the total number of tokens processed, including both input and generated tokens.
:::note[Values]
- **Input Tokens**: 214,304 - The number of tokens received as input.
- **Generated Tokens**: 1,438,276 - The number of tokens generated as output.
- **Total**: 1,653K - The sum of input and generated tokens.
:::

**Total Token Cost**

This chart indicates the total cost associated with token processing, including both input and generated tokens.
:::note[Values]
- **Input Tokens Cost**: $0.88 - The cost incurred for processing input tokens.
- **Generated Tokens Cost**: $1.61 - The cost incurred for processing generated tokens.
- **Total Cost**: $2.49 - The total cost for processing both input and generated tokens.
:::

**Input Tokens per run**

This chart shows the number of input tokens used per run, indicating the smallest, average, and largest number of tokens.
:::note[Values]
- **Min**: 5 - The minimum number of input tokens used in a single run.
- **Average**: 2,610.3 - The average number of input tokens used per run.
- **Max**: 70,039 - The maximum number of input tokens used in a single run.
:::

**Generated Tokens per run**

This chart shows the number of generated tokens per run, indicating the smallest, average, and largest number of tokens.
:::note[Values]
- **Min**: 0 - The minimum number of tokens generated in a single run.
- **Average**: 389 - The average number of tokens generated per run.
- **Max**: 4,032 - The maximum number of tokens generated in a single run.
:::

**Cost per 1k runs**

This chart indicates the cost associated with every 1,000 runs.
:::note[Values]
- **Min**: $0.00 - The minimum cost per 1,000 runs.
- **Average**: $15.17 - The average cost per 1,000 runs.
- **Max**: $366.00 - The maximum cost per 1,000 runs.
:::

**Token Generation per Second**

This chart shows the rate of token generation per second, indicating the smallest, average, and largest rates.
:::note[Values]
- **Min**: 0.2 - The minimum rate of token generation per second.
- **Average**: 9.1 - The average rate of token generation per second.
- **Max**: 333.3 - The maximum rate of token generation per second.
:::

**Tokens over Time**

![tokens-over-time](/img/governance/overview/tokens-over-time.png)

This line chart shows the total tokens, input tokens, and generated tokens over a period of time.

### Cost Insights

**Model Cost Comparison**

![model-cost-comparison](/img/governance/overview/model-cost.png)

This bar chart compares the costs associated with different models used within NeuralSeek. Easily compare your selected model cost against other popular models.

## System Governance

### System Performance

This provides an overview of the performance insights for NeuralSeek. The insights are visualized using line charts, each representing different aspects of instance and universe performance over time.

**Instance Performance**

![Instance performance](/img/governance/overview/instanceperformance.png)

This chart shows the performance of a single instance over time, measured in milliseconds. It helps in understanding the response time and efficiency of the instance.

**Universe Performance**

![Universe performance](/img/governance/overview/universeperformance.png)

This chart shows the performance of the entire region of instances over time, measured in milliseconds.


<!-- MERGE: everything below came from reference_material/governance/governance.md. Fold it into the sections above, then delete this comment. -->




<!-- STILL TO DOCUMENT ON THIS PAGE:
  - The old standalone governance page is empty — decide what it contributes before merging it in
-->
