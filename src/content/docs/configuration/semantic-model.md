---
title: "Semantic model tuning"
description: "Unlock the full potential of NeuralSeek with our Semantic Model Tuning Guide. Learn to optimize search results, adjust settings, and enhance semantic scores for precise, confident answers."
---

## Overview
This guide provides information on how to use Semantic Model Tuning to improve your search results. It includes detailed explanations of how each setting works, and what effects they have on the model depending on their tuning scores.

## What is Semantic Model Tuning?

![semanticdetail](/img/configuration/semantic-model/semantic-score-details.png)

Whenever a question is asked in NeuralSeek's `Seek` feature, users are able to see the answer's semantic score, which is a measure of how confident NeuralSeek is in its answer, as well as its semantic analysis, which thoroughly details the information used to get the answer as well as any complications that made NeuralSeek less confident in its response. If you are consistently getting low semantic scores in your responses despite the answers being correct, you may find use in configuring the semantic model tuning results so that the semantic score does not get as penalized for various external factors.

## Locating Semantic Scoring
To begin, navigate to the `Configure` tab on the Home page, and open the "Governance and Guardrails" dropdown. There, you will see a tab for Semantic Scoring.

![location](/img/configuration/semantic-model/governance-page.png)

You will notice a black button at the bottom of the Semantic Scoring settings labeled "Semantic Model Tuning". By clicking on it, you will be brought to a settings page where you can customize settings for Semantic Model answers.

![tuning](/img/configuration/semantic-model/semantic-model-tuning.png)

## Tuning Your Search Results

The following is an in-depth analysis on how each setting in Semantic Model Tuning can affect your search results in NeuralSeek:

#### Missing key search term Penalty
This penalty is applied for answers that lack KnowledgeBase attribution of *proper* nouns included in the search. This setting is at 0.6 by default.

#### Missing search term Penalty
This penalty is applied for answers that are missing KnowledgeBase attribution of *other* nouns that were included in the search. This setting is at 0.25 by default.

#### Source Jump Penalty
When answers join across many source documents it can be an indication of lost meaning or intent, depending on your source documentation. This setting is at 3 by default. It is recommended to turn this setting low if you have many source documentations and generally need help "stitching" answers together from many documents. Likewise, increase this penalty to encourage citations from few or single documents.

#### LLM Decline Penalty
When LLM answers seem to indicate the question is unrelated to the documentation, or refuses to answer, NeuralSeek will apply an additional penalty to the semantic score. This setting is at a 1 by default.

#### Total Coverage Weight
Looking at the answer, how much weight should be given to the total coverage alone, regardless of other penalties. This setting is at a 0.25 by default. Increasing this helps prevent abnormally low scores from long, highly stitched answers. Decreasing will better catch hallucinations in short answers.

#### Re-Rank Min Coverage %
What is the minimum coverage of the total answer that the top used source document needs to be re-ranked over the top KB-sourced document. This setting is at a 0.25 by default. 

#### Allowed Terms
We provide a text box at the bottom of the page where you can input words and phrases that should not be penalized, regardless of whether they are present in the sourced document passages.

## How to make use of Semantic Model Tuning

### Example 1
Suppose a user asks NeuralSeek a simple question that can easily be answered by our documentation, for example, "How do I connect to an LLM". Although NeuralSeek gives a correct response, you may notice that its Semantic Match score is unusually low.

![llm1](/img/configuration/semantic-model/llm-question-1.png)

By clicking on the Statistical Details button in Semantic Analysis, you will be brought to a page that thoroughly details the penalties that resulted in a low Semantic Match. In this case, we can see that the two biggest factors were a large amount of source jumps, and a lower-than-average Top Source Coverage score.

![llm2](/img/configuration/semantic-model/llm-question-2.png)

Since these two settings are the ones most responsible for our low Semantic Match score, the settings for those two should be appropriately adjusted so that they do not influence the results as much. By heading back into our Configuration tab and heading over to the Semantic Model Tuning settings, you can decrease their initial values so that NeuralSeek knows to factor those penalties in less severely.

![llm3](/img/configuration/semantic-model/llm-question-3.png)

After saving your settings, you can head back to the Seek tab and ask the same question, and notice that your Semantic Match score has increased greatly thanks to the adjusted settings.

![llm4](/img/configuration/semantic-model/llm-question-4.png)

### Example 2
Suppose a question you ask NeuralSeek contains a term that is not contained in your source documentation and thus cannot be properly defined. For example, let's ask how NeuralSeek differs from other competitors on the market, like ChatGPT. Since ChatGPT is not a term defined in our documentation, NeuralSeek will penalize the response since it contains a "hallucinated term", which are terms generated by the model that are not present in our source material.

![gpt1](/img/configuration/semantic-model/chatgpt-1.png)

If you don't want to penalize responses containing ChatGPT in them, head over to the Semantic Model Tuning settings, and in the text box, type in ChatGPT. This will remove ChatGPT from the hallucinated terms list, and will no longer have a negative impact on future Seeks including the term.

![gpt2](/img/configuration/semantic-model/chatgpt-2.png)

By heading back to the Seek tab and asking the same question, we can see that the Semantic Analysis no longer penalizes the user for the use of the now allowed-term word ChatGPT.

![gpt3](/img/configuration/semantic-model/chatgpt-3.png)


## Conclusions

Generally speaking, semantic model tuning should be a fine tuning exercise after data prep and kb tuning - not a first resort. Typically this activity is last after all other methods of data prep, kb tuning, etc have been tried and tested. These settings have a very broad effect on your answers, so change them sparingly and re-test broadly after changes are made.
