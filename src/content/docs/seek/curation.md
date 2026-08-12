---
title: "Answer curation"
description: "Explore NeuralSeek's Curate feature to manage and optimize intents from your KnowledgeBase. Import, export, and customize Q&A, track changes, and enhance user interactions with ease."
---

## Overview

![curate](/img/seek/curation/curate.png)

**What is it?**

- NeuralSeek's Curate features allows users to view intents generated from the KnowledgeBase, import and export intents into the virtual agent, and manage example questions and answers. The content and parameters of each 'Intent' can be adapted and adjusted to accommodate employee and customer needs.
- Users can also view the results of other features as well, such as round trip logging, merge/unmerge actions, whether the intent contains any Personally Identifiable Information (P.I.I.), and whether the source KnowledgeBase information has changed so that users can easily detect whether the answers that were generated needs to be updated or not.
- Sometimes, it is easier to curate all the questions and answers outside of NeuralSeek, and upload them in batch. Use the Curate feature to upload and update the curated Q&A's (supports CSV format). A template CSV file is given for you to use it.

**Why is it important?**

- This feature enhances the user experience by providing a streamlined and accessible interface. Additionally, it enables users to closely monitor incoming queries and the corresponding generated answers, allowing for a better understanding of user interactions. Users are able to easily identify outdated information within the connected documentation through the displayed coverage and confidence scores, facilitated by the built-in semantic scoring model. Furthermore, the ability to adjust answers and parameters ensures customization to better align with user queries and intents. Lastly, the feature allows users to view and modify auto-generated queries for each intent, providing a comprehensive toolkit for refining and optimizing responses. Overall, these functionalities collectively contribute to a more effective and tailored knowledge management experience.

**How does it work?**

- The Curate feature in NeuralSeek's UI allows users to manage intents and answers efficiently. Accessed through the Curate tab, the UI comprises columns like Intent, displaying categorized questions with indicators for status; Q&A, indicating the number of questions and answers per intent; Coverage %, showing KnowledgeBase contribution; and Confidence %, reflecting the likelihood of user satisfaction. The trend graphs use color codes for coverage and confidence states. Users can hover over the graph to observe changes over time. Intents and answers can be displayed, searched, and filtered based on various criteria. Users can edit, delete, or backup answers, and perform operations on intents, such as merging or renaming. Caution is advised for irreversible actions like deletion and merging.

:::tip
For more information see [Curation of Answers](../../features/answer_curation/index.md).
:::

## Uploading Q/A Files (CSV/XLSX)

NeuralSeek supports ingesting Q/A pairs directly from CSV or Excel files into the Curate tab. This process expedites intent generation for both the NeuralSeek environment and a virtual agent. You can either upload new Q&A pairs, or edit existing ones.

### If uploading new Q&A pairs, follow these steps:

![QA Upload12](/img/seek/curation/QnA_upload.png)

- Download the template from the Curate tab by clicking the **Load Q&A** button.
- Fill in the required columns — `question` and `answer` at minimum. Optionally, you can add additional payload fields with column titles like tags, category, etc.
- Drag and drop or click to upload the file on the Q&A Upload screen. 
- Additionally, you can select to improve your answers by sending them through Seek by checking "Yes" on the **Improve my answers** button. 
- Finally, click **Submit**.

:::tip[Tips]
- Keep new and exisiting Q&A pairs separate — do not mix them in one file.
- Add only one question per row.
- Ensure answers are SME-approved, or select the option to improve your answers by running them through Seek.
- Perform a quality assurance test first with 5–10 rows, before bulk upload. 
- Use UTF-8 encoding for CSVs.
:::

## Guides
Here is a list of guides relevant to the Curate tab and the curation of answers. 

{pagelist 1000 Gcurate}


<!-- MERGE: everything below came from features/answer_curation/index.md. Fold it into the sections above, then delete this comment. -->


**What is it?**

- NeuralSeek is directly trained off of the documentation loaded into the KnowledgeBase. If there are undesired answers from NeuralSeek, the first step is to review the documentation within the KnowledgeBase, and effectively curate the answer which can then be used by NeuralSeek to train itself better the next time it answers.

**Why is it important?**

- One of the key factors in reducing costs is the utilization of curated answers sourced from a pool of responses, which proves to be more economical. Also, when the collection of answers becomes stagnant, potentially leading to outdated information, this feature will be able to detect it and refresh those with less manual process.

**How does it work?**

- To tackle this challenge, NeuralSeek provides a solution by automatically monitoring the sources of information. It continuously tracks and compares the generated responses with the source documents to determine if any changes have occurred. By doing so, NeuralSeek ensures that the answers remain up-to-date and relevant. This eliminates the need for manual intervention and the potential for outdated information, allowing users to trust the accuracy and currency of the answers provided.


## Curating Intents and Answers

![curate](/img/seek/curation/currate-page.png)

Let's first visit the UI page for curating intents and answers. Click the `Curate` tab on the top menu. 

The UI is composed of the following columns:

**Intent**: 

- Intents are a collection of questions that may be related to the similar `intent` of the question. It is prefixed by certain types of intents, such as `FAQ`, followed by the question's subject areas. By default, all the intents do fall under a category `Others`, but you can also define your own category in NeuralSeek's configuration.
- Intents also have a number of indicators that help users to understand the status of the intent. For example, it can show whether the intent has any new answers, whether the intent contains any PII (personally identifiable information), or whether the intent's underlying data has been outdated, etc.

**Q&A**: 

- Shows the number of questions (white dialog icon) and answers (blue dialog icon) that this particular intent contains.

**Coverage %**: 

- Indicates how much the KnowledgeBase has contributed to the answer's coverage. If NeuralSeek was able to find all the necessary information from the KnowledgeBase, this percentage is going to be very high.

**Confidence %**: 

- Indicates how much NeuralSeek's answer is most likely to satisfy the user. If this score is high, it means the answer has a high score of being legitimate and true to the facts.

### Reading the trend
![graph and color](/img/seek/curation/image-002.png)

The data is presented through two distinct graphs: Coverage and Confidence. 

1. **Coverage Graph**: This graph illustrates the total number of citations or reference materials utilized to address a specific question. A coverage value of zero indicates the absence of relevant documentation, while a value of 100% signifies comprehensive documentation available on the topic.

2. **Confidence Graph**: This graph assesses NeuralSeek’s confidence in the automated response provided. High confidence suggests that the answer is likely cited by the documentation well, whereas low confidence infers that the resource material might have conflicting documentation or ambiguity.

Both graphs are integral to data governance, directly reflecting the quality and reliability of the data used in generating answers. It is possible to have an accurate answer with low coverage but high confidence. It is also possible to have an inaccurate answer with high coverage and low confidence because the multiple resources have conflicting information.

**Color Coding**:

- **Coverage**: Represented in shades of blue, with intensity varying based on coverage levels. The darker the shade, the more comprehensive documentation is referenced.
- **Confidence**: Indicated by green for high confidence and red for low confidence.

**Slope**: The slope's height indicates the number of hits. A higher slope will show the majority of where the answers were bucketed - for example, if all the answers but one were scored at 99%, but there is one at 20%, the slope will be far larger at 99% and very small at 20%. By hovering over the graph, you can observe the trend of slope changes over time.

![changes](/img/seek/curation/image-003.png)

In this case, there were instances of when the confidence had dropped from 83% to 22%, over the period between 14:07:31 to 14:12:15 on July 20th.

### Displaying Intents and Answers
If you click the `⌄` Arrow next to the intent name, you will see the list of example questions and its generated answers:

![Alt text](/img/seek/curation/image-004.png)

The example questions have either black color or gray color, depending on how they were created. The black colored examples are the ones that were actually submitted by the user's question. NeuralSeek automatically generates similar meaning questions per each question that it receives.

As necessary, you can also enter your own Example question in addition to the ones that NeuralSeek generates.

![Alt text](/img/seek/curation/image-005.png)

:::tip
It is also possible to add Notes that may save additional information regarding this particular intent.
:::

## Searching the intent
The size of intent can vary but could grow over multiple pages, so you may want to search for a particular intent from time to time. You could do that by using the search form at the top of the page. Enter the keyword and it will narrow down your search.

![search](/img/seek/curation/image-010.png)

## Filtering the intent
There is a more fine-grained way of filtering intents based on criteria such as whether they were edited, or a new answer was added, flagged, or out-of-date data was found. Click the filter button, set the criterias that you want, and the page will only show the ones that meet the filtering condition.

![filter](/img/seek/curation/image-011.png)

## Editing the Answer
On all the answers generated, a Subject Matter Expert can edit answers for both style and content. Edited answers automatically become training for the underlying LLM and will train the model on the style and content of the desired answer for that intent. Edited answers are also eligible for independant caching and can be directly served to the end user without going back to language genration.

Editing can be done by clicking the answer, modifying its content, and saving it.

![editing](/img/seek/curation/image-006.png)

After saving, you will see that the answer that you edited will be marked as `Edited`.

![Alt text](/img/seek/curation/image-007.png)

<details>
<summary>Formating edited answers</summary>


Edited answers can be styled using [Markdown syntax](https://www.markdownguide.org/cheat-sheet/), depending on the formatting capabilities of the assistant/agent ([Supported Virtual Agents](/integrations/virtual-agents/)) or the delivery channel (e.g., Slack, Facebook, WhatsApp).

Supported elements may include: **bold**, *italic*, `inline code`, [hyperlinks](https://example.com), etc.

</details>

<details>
<summary>Example of Mardown formating</summary>

```md
This is a **bold** word, this is an *italic* word, and here is a [link to a website](https://example.com).
```

Will render as:

This is a **bold** word, this is an *italic* word, and here is a [link to a website](https://example.com). 

</details>

## Deleting Questions and Answers
If you wish to delete either the question or answer under the intent, you can do so by clicking the `circle with i` icon and selecting `Remove`.

![remove](/img/seek/curation/image-008.png)

:::caution
Once they are removed, there is no way to roll back the removal, so be careful.
:::

### Deleting all data
You can delete all data by selecting the gear icon at the top and selecting:

![deletion](/img/seek/curation/image-009.png)

- Delete all data
- Delete all analytics
- Delete all unEdited Answers

These are a useful feature if you wish to simply reset all of these data and start from the scratch.

### Intent operations
When you select an intent, a popup will be displayed which shows you the operations that you can do with the selected intent.

![operations](/img/seek/curation/image-012.png)

- Edit category - will let you edit the current category
- Download to CSV - will export this into a CSV file. It will have the following format: `ID,question,score,kbCoverage,answer,category,intent,pii`
- Generate Conversation - This will convert the intent into conversation, instead of a simple question and answer. This will give a better context for the NeuralSeek to generate answers from.
- Flag - Will flag the intent so that you can quickly find it later.
- Rename - Will let you rename its name
- Delete - Deletes the selected intent(s).
- Backup - Backs up the intent for later recovery. Note that the backed up file is not a text file, but in binary format.
- Merge - appears only when two or more intents are selected. It merges all of their questions and answers into a single intent.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Delete user data — the bulk GDPR/CCPA erasure path
  - Delete and Regenerate Responses for an intent
  - Enhance Conversation — improve a stored conversation with the LLM
  - Notes on an intent — free-text annotation for the next curator
  - Generate / Remove Examples — bulk-create or clear auto-generated example questions
  - User Agents modal in the Curate context
  - Add Intent > mAIstro toggle — an intent answered by an agent instead of by Seek
  - Export to the configured Virtual Agent Type
-->
