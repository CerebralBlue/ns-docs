---
title: "mAIstro overview"
description: "Explore mAIstro, a dynamic platform for retrieval-augmented generation. Seamlessly integrate your preferred LLM, enhance data quality, and enjoy user-friendly content creation with expert guidance."
---

## Overview

![mAIstro1](/img/maistro/overview/page1.png)
![mAIstro2](/img/maistro/overview/overview2.png)

**What is it?**

- The mAIstro feature is a versatile and innovative platform, offering an open-ended playground for "retrieval augmented generation". It empowers users to seamlessly integrate their preferred Language Model (LLM), select from a range of data sources including Knowledge Bases, websites, local files, or typed text, and employ the NeuralSeek Template Language (NTL) markup for dynamic content retrieval. Notably, mAIstro enhances data by incorporating features like summarization, stopwords removal, and keyword extraction, all while providing expert guidance with LLM prompt syntax and base weighting. With the ability to output results to an editor or directly to a Word document, mAIstro delivers a powerful and user-friendly experience, making it a standout feature in content generation and retrieval.

**Why is it important?**

- **Efficient Content Retrieval:** mAIstro simplifies the process of accessing and retrieving content from various sources. This efficiency is crucial for anyone who relies on accurate and relevant information.
- **Enhanced Data Quality:** mAIstro enhances data quality by providing tools for summarization, stopwords removal, and keyword extraction. This ensures that the retrieved content is refined, concise, and tailored to the user's needs, saving time and effort in manual data preprocessing.
- **User-Friendly Interface:** mAIstro offers a user-friendly interface that makes interacting with Language Models and crafting dynamic prompts accessible to a broader audience. This accessibility is vital for individuals who may not have advanced technical skills but still require the benefits of advanced language models.
- **Expert Guidance:** mAIstro provides users with expert guidance by pre-configuring LLM prompt parameters and model-specific base weights. This guidance helps users achieve optimal results without the need for in-depth knowledge of language model intricacies.
- **Output Flexibility:** The ability to output results to an editor or directly to a Word document enhances flexibility and convenience for users, allowing them to seamlessly integrate the generated content into their workflows.
- **Semantic Scoring:** The incorporation of a Semantic Scoring model allows users to assess the relevance and alignment of generated content with their specific requirements. This feature adds a layer of precision and control to the content generation process.

**How does it work?**

- mAIstro streamlines the interaction with Language Models, making it accessible and user-friendly while providing powerful tools for content retrieval and enhancement. Users can seamlessly integrate retrieved content into their workflows with precision and control, making it a valuable asset for various professional fields.

<details>
<summary>Additional Capabilities</summary>

1. **Choice of LLM**: (BYOLLM Plans) Select your preferred LLM, and seamlessly integrate it with mAIstro. 2. **Utilize NeuralSeek Template Language (NTL)**: Craft dynamic prompts using a combination of regular words and NTL markup to retrieve content from different sources. 3. **User-Friendly Agent Editor**: Create custom prompts with an easy-to-use point-and-click visual agent editor.

4. **Utilize Other NeuralSeek Features**: Extract, Protect, or Seek a query through the mAIstro platform.  
5. **Versatile Content Retrieval**: Retrieve data from various sources, including KnowledgeBases, SQL Databases, websites, local files, or your own text. 6. **Content Enhancement**: Improve your data with features like summarization, stopword removal, keyword extraction, and PII removal to ensure your content is refined and valuable. 7. **Guarded Prompts**: mAIstro provides Prompt Injection Protection and Profanity Guardrails, preventing embarrassing moments with Language Generation. 8. **Table Understanding**: Conduct searches and generate answers with natural language queries against structured data. 9. **Effortless Output**: Easily view your generated content within the built-in editor or export it directly to a Word document, offering convenient control over your output. 10. **Precision Semantic Scoring**: Importantly, all these operations are assessed using our Semantic Scoring model. This allows insight into the content's scope tailored to your preferences.

</details>

## NeuralSeek Template Language (NTL)

NeuralSeek's **mAIstro** feature is powered by **NeuralSeek Template Language (NTL)**, enabling users or developers to create expressions, or extract and format data from various sources for subsequent processing by an LLM without traditional coding. Often times, this is faster than a custom Python script.

It simplifies many tasks - API connections, data formatting, mathematics - streamlining the process of preparing data for further language model processing.

![agent_ntl](/img/maistro/overview/agentntl.png)

**How does it work?**

- Users utilize agent commands within NTL to query databases, websites, uploaded documents, APIs, and more, while specifying parameters for extraction and formatting. The resulting data is then available for use in driving subsequent language generation.

**Some general rules**

- Considering the extensive use of double quotes in NTL, typically you will need to \"\" escape double quotes to use in functions. For example, in SQL / Database queries.
- Any blank value (e.g. "") is considered "not present" or null-equivalent.
- Variables used with << >> notation will always expand in-place.

**Syntax Highlighting**

The NeuralSeek Template Language (NTL) brings flexibility to mAIstro by enabling dynamic workflows through functions that support data querying, HTTP requests, calculations, and variable management. Now, with **syntax highlighting** in the **Agent NTL**, it’s even easier to write, read, and manage complex code snippets for efficient development.

<details>
<summary>Examples of Syntax Highlighting</summary>


![Syntax Highlighting](/img/maistro/overview/syntaxhighlight.png)

- Considering the extensive use of double quotes in NTL, typically you will need to \"\" escape double quotes to use in functions. For example, in SQL / Database queries.
- Any blank value (e.g. "") is considered "not present" or null-equivalent.
- Variables used with << >> notation will always expand in-place.

</details>

:::note[Important]
Any of the example NTL shown here can be copy-pasted into the Agent NTL tab, and then switch back to the Agent Editor for easier analysis.
:::


## Agent Editor

The Agent Editor allows users to create expressions using movable, chain-linked, and customizable blocks that execute commands. It simplifies user interaction through drag-and-drop blocks, making it easy to navigate complex use cases with no code required.

![agent_editor](/img/maistro/overview/exampleflow.png)

### Click to insert

All the elements on the left panel can be created in the editor by clicking them.

![Click_to_insert](/img/maistro/overview/click-to-insert.png)

You can also drag and drop a node from the sidebar into the editor and use it to "chain" nodes together

![Drag](/img/maistro/overview/dragndrop.png)

### Click to edit

Selecting a card will highlight the node blue, and a dialog will appear on the right side to edit the configuration options for the selected node. Depending on the type of the node, there may be several options. See the NTL reference page for a description of all configurable options.

![Click_to_edit-2](/img/maistro/overview/click-to-edit.png)

### Deleting a node

You may delete a node by clicking the red `Delete Node` button at the bottom of the options panel.

### Hover Menus

Hover menus allow users to easily access and insert secrets, user-defined variables, system-defined variables, or generate new variables while working in the visual builder. This feature enhances the building process by providing quick access to essential elements without disrupting the workflow.

![Click_to_edit-3](/img/maistro/overview/hover_menu1.png)

#### Secrets

This function will provide a dropdown of variables defined as "secrets" in the configure tab. This code will vary depending on your staging instance.

![secrets](/img/maistro/overview/secrets.png)

#### Variables

This function will provide a dropdown list of previously defined variables that the user can call on with the click of a button.

![variables](/img/maistro/overview/variables.png)

#### Dynamic Variables

This function will provide a dropdown list of system-defined variables that can be added to the mAIstro flow. The user must evaluate the agent first before they can make use of this feature.

![dynamic-variables](/img/maistro/overview/dynamic.png)

#### New

This function will generate a new variable prompt: `<< name: myVar, prompt: true >>`.

![new](/img/maistro/overview/new.png)

### Stacking elements

Adding nodes, by default, will connect the elements vertically. We call this `Stacking`, or building a `Flow`.

Stacked elements flow from top to bottom, meaning the output produced by the top element will become available as input to the bottom/next element.

![Stacking](/img/maistro/overview/stack-flow.png)

### Chaining elements

You can also connect elements horizontally. This is called `Chaining`.

Chaining is useful when you want to direct a node's output. In this example, the output of the LLM will be provided as input to the extract keywords element - `chained` together.

<details>
<summary>1. Click the element <code>Extract Keywords</code> to get stacked under <code>Send To LLM</code>. 2. Select the node, and drag it the right side of the element that you want to chain. You will see a blue dot indicating the chained connection. 3. Release the selection, chaining the nodes together.</summary>


1.
![Chaining_1](/img/maistro/overview/flowp1.png)

2.
![Chaining_2](/img/maistro/overview/flowp2.png)

3.
![Chaining_3](/img/maistro/overview/flowp3.png)

</details>

### Evaluating

Clicking the evaluate button will run the expression, and generate output.

![Evaluating](/img/maistro/overview/maistro-answer.png)

### Saving as user agent

You may frequently use the same expression over and over again. We offer the ability to save the agent for re-use, and also be triggered via an API call.

Build an expression, and then click the `Save` button along the bottom of the editor. Enter the agent name and (optional) description. Click `Save` in the dialog to save it as a user agent.

![Saving_template](/img/maistro/overview/visual_editor_9.png)

### Loading the agent

Your saved agent can be loaded into the editor, or called upon later from the API.

Click the `Load` button along the bottom of the editor, select `User Agents`, and click the checkbox to the agent that you want to load. Click `Load Agent` to load the saved agent into the editor.

![Load template](/img/maistro/overview/visual_explore_load_template.png)

### Output Formats

- **Inline** - Suitable for displaying rendered output from the flow, supporting charts and HTML.

<details>
<summary>Example</summary>

Display a chart using data retrieved from an API endpoint, rendered with Chart.js.


![Inline_output](/img/maistro/overview/output_inline_1.png)

Preview the HTML generated by the LLM node.

![Inline_output](/img/maistro/overview/output_inline_2.png)

</details>

- **Raw** - Useful for viewing the unprocessed text output from the flow.

<details>
<summary>Example</summary>

Validate raw HTML generated from a HTTP request to a user endpoint, creating a presentation HTML user card.


![Raw_output](/img/maistro/overview/output_raw_1.png)

View the underlying HTML behind the inline format to ensure expected output.

![Raw_output](/img/maistro/overview/output_raw_2.png)

</details>

- **Word** - Quickly download the raw output as a Word document for easy sharing or storage.

<details>
<summary>Example</summary>

Generate Word documents from CV data.


![Word_output](/img/maistro/overview/output_word_1.png)

The resulting document will appear similar to this:

![Word_output](/img/maistro/overview/output_word_2.png)

</details>

- **PDF** (text) - Generate a text document in PDF format from the raw output.

<details>
<summary>Example</summary>

Export the document in PDF format.


![PDF_output](/img/maistro/overview/output_pdf_1.png)

</details>

- **PDF** (html) - Converts an HTML format into a PDF document.

<details>
<summary>Example</summary>

Export the document in PDF format.


![PDF_html_output](/img/maistro/overview/pdf-html-example.png)

</details>

- **CSV** - Create CSV files with extracted data from various sources.

<details>
<summary>Example</summary>

Extract and preview CSV data, such as medical texts with illnesses and corresponding medications or therapies.


![CSV_output](/img/maistro/overview/output_csv_1.png)

The resulting CSV will look similar to this:

![CSV_output](/img/maistro/overview/output_csv_2.png)

</details>

## mAIstro Inspector

- The mAIstro Inspector (the small bug icon near the top-right) allows users to drill down to the details of each step, exposing **what** was set, **when** it was set, and **how** it was processed.
- Expand steps individually to drill down into specific values, calculations, assignments, or generation.

![Step Inspector](/img/maistro/overview/maistroinspector1.png)
![Variable Inspector](/img/maistro/overview/maistroinspector2.png)

## Quick Start to Building Agents

Get started by giving a prompt in the auto-builder. Use this example prompt: `Build an agent to send individualized emails to each address listed in an input CSV file`. This gives you the ability to start from scratch, use an existing agent or build one using natural language commands.

![Quick_start_prompt](/img/maistro/overview/autobuild.png)

This will output a customizable agent that you can test or adapt to your needs.

![Quick_start_prompt](/img/maistro/overview/newflow.png)

## AI Agent Marketplace

As a starting point for building agents, you can use `Example templates`. These templates solve some use cases.
![AI_agent_marketplace](/img/maistro/overview/position_ai_agent_marketplace.png)

Some are more specific and others can be used in general business situations, you should read their descriptions and choose the most suitable.
![AI_agent_marketplace](/img/maistro/overview/elastic_seach_uploader_ai_agent_marketplace.png)

In this case we'll use the `ElasticSearch Uploader` prebuilt agent to divide documents into sections and upload them into ElasticSearch, this reduces you time when you need a similar functionality.

![AI_agent_marketplace](/img/maistro/overview/maistro_agent_ai_agent_marketplace.png)

## Automagic Parallel Execution

To optimize performance and reduce the overall execution time, you can run multiple nodes in parallel by assigning their outputs to variables. This allows the total execution time to depend on the longest-running node, rather than the sum of all nodes. This all happens automatically under the hood!

**Steps for Parallel Execution**

1. **Define Nodes**: Set up multiple nodes to query different data sources (e.g., KnowledgeBase, Websites, Seek).
2. **Assign Variables**: Assign the output of each node to a variable (e.g., `kbResult`, `webResult`, `seekResult`).
3. **Execute in Parallel**: All nodes run simultaneously, and the system will wait only for the slowest node to complete.
4. **Use Results**: After all nodes finish, select the result that best fits your needs by comparing outputs across variables.

**Example**

In this setup, three nodes are executed in parallel:

- Node 1 retrieves data from a **KnowledgeBase**.

![kb](/img/maistro/overview/kb.png) ![kb](/img/maistro/overview/nodekb.png)

- Node 2 scrapes content from a **Website**.

![kb](/img/maistro/overview/website.png) ![kb](/img/maistro/overview/nodeweb.png)

- Node 3 performs a query using **Seek**.

![kb](/img/maistro/overview/seek.png) ![kb](/img/maistro/overview/nodeseek.png)

**Final Result**

![kb](/img/maistro/overview/llm.png)

By assigning each node's output to a variable, you ensure that the total runtime is determined by the longest-running node. This strategy improves efficiency by taking advantage of parallelism, ensuring your task completes in the shortest possible time.

Using parallelism in this way significantly reduces execution time and enhances workflow efficiency, without having to write complex code or manage states.

## Agent Scheduler

The Agent Scheduler allows you to schedule select times that an agent will automatically run itself. This can be useful for when you're looking for an application that needs to be run every week, month, etc., and saves you from the manual effort of running it yourself.

To locate the Agent Scheduler, go to the mAIstro tab, and click on the Agent Scheduler header. By clicking the blue Create Schedule button, an additional menu will pop up underneath that will allow you to create a schedule for one of your preexisting agents.

![createschedule](/img/maistro/overview/createschedule.png)

Once in the schedule editor, you are given many options on how to create your schedule, and gives you control over how often the agent will run in minutes, hours, days of the month, months, and days of the week.

![schedulemenu](/img/maistro/overview/schedulemenu.png)

By default, the schedule is set to run at every minute of every day. It's recommended to set the "Every/At" setting under Frequency to 00 so that the schedule is not constantly running.

Once you're finished customizing an agent schedule, you can hit the blue Save button at the top of the menu. This will add the agent schedule to the list and automatically run at the selected times you instructed. You can also adjust the schedule at any time by selecting the agent from the list and clicking the checkmark next to it, then pressing the Edit Schedule button.

![finished](/img/maistro/overview/finishedschedule.png)
![editselect](/img/maistro/overview/editselect.png)

## Guides

Here is a list of guides relevant to the mAIstro tab.

{pagelist 1000 Gmaistro}
