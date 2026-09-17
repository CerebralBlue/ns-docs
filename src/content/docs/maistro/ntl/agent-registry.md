---
title: "Agent Registry node"
description: "Given an example agent, neuralseekupdates:"
---

## Use Agent

```text
{{ maistro | template : "agentName" }}
```
Imports the contents of `agentName` into the current environment.

<details>
<summary>Example Usage 1</summary>

Given an example agent, `neuralseek_updates`:

```text
Based on the changelogs found here:
{{ web|url:"https://documentation.neuralseek.com/changelog/" }}
list the items for the latest month.
{{ LLM }}
```

Simply using `{{ maistro | template: "neuralseek_updates" }}` will produce the sample result.

</details>

<details>
<summary>Example Usage 2</summary>

To pass parameters to mAIstro agents, you simply define the variables in your current environment.

Given an example agent, `neuralseek_updates`:

```text
Based on the changelogs found here:
{{ web|url:"<< name:'url' >>" }}
list the items for the latest month.
{{ LLM }}
```

To pass the `url` variable to the agent:

```text
{{ variable  | name: "url" | value: "https://documentation.neuralseek.com/changelog/" }}

{{ maistro | template : "neuralseek_updates" }}
```

This allows agents to be brought into current context, effectively "splicing" the contents into the desired context.

</details>

---

## Use Agent (Sandbox)

```text
{{ maistroSandbox  | template: "agentName" | params: "jsonParams" }}
```

Executes the specified `agentName` in the current environment, returning only the agent's final output.

<details>
<summary>Example Usage 1</summary>

Given an example agent, `video_loop`:

```text
Based on this description, extract a list of objects from the video:
{{ maistroSandbox  | template: "video_loop" | params: "" }}
{{ LLM  | prompt: "" | cache: "true" }}
```

Simply using `{{ maistroSandbox | template: "video_loop" }}` will only use the result within the sandboxed agent with something like:

```plain
Based on the description provided, the list of objects present in the video is:
Hands
Knitting needles/Crochet hooks
Textured fabric/Textile project
Mug/Cup
Coaster/Small mat
Crocheted/Knitted items
Couch/Chair
Blanket/Sheet
```

</details>

<details>
<summary>Example Usage 2</summary>

Let's consider an example agent called `generate_user_card` that creates a simple user presentation card:

```text
{{ LLM | prompt: "Create a simple user info JSON to render in a presentation card" | cache: "true" }} => {{ extractCode }} => {{ variable | name: "userInfoJson" | mode: "" | value: "" }}
{{ maistroSandbox | template: "generate_user_card" | params: "{\"userInfo\": \"<< name: userInfoJson, prompt: false >>\"}" }}
```

In this example, the `generate_user_card` agent takes the `userInfoJson` parameter and processes it in a sandboxed environment. You can achieve the same result by using:

```text
{{ maistroSandbox | template: "generate_user_card" | params: "{\"userInfo\": \"<< name: userInfoJson, prompt: false >>\"}" }}
```

This will pass the `userInfo` parameter to the sandboxed agent, resulting in the creation of a presentation card similar to the one shown below:

![Card Example](/img/maistro/ntl/agent-registry/card_example.png)

</details>

---

## Select Agent

```text
{{ selectAgent | registry: "registryName" | query: "specifyQuery"  }}
```

Allows you to choose an agent from a specified registry based on a given query. This functionality is essential for automating task delegation by dynamically selecting the most appropriate agent for a task.

:::note[Parameters]
- **Registry**: The Agent Registry to select from
- **Query**: The query used to identify the correct agent
:::

Before using the 'Select Agent' node, ensure you have completed the following setup steps:

1. **Create a Registry**: Establish an Agent Registry that will house your agents.

    ![Agents Registry](/img/maistro/ntl/agent-registry/agent_registry.png)

2. **Attach Agents to the Registry**: Ensure that all relevant agents are properly attached to the registry.

    ![Agents Attached](/img/maistro/ntl/agent-registry/attached_agents.png)

After the registry and agents have been set up, you can use the 'Select Agent' node to specify a registry and query:

<details>
<summary>Example Usage 1</summary>


Suppose you have an agents registry named `digital_tasks` with agents assigned to various tasks. You need to find an agent to handle the query *"Send approved pull request email"*.

```text
{{ selectAgent  | registry: "digital_tasks" | query: "Send approved pull request email" }}
```

The node identifies `send_email` as the most suitable agent for the task:

```plain
send_email
```

Once the agent is selected, you can store its name in a variable and use it in subsequent nodes like 'Use Agent':

```text
{{ selectAgent  | registry: "digital_tasks" | query: "Send approved pull request email" }}=>{{ variable  | name: "selectedAgent" }}
{{ maistro  | template: "<< name: selectedAgent, prompt: false >>" }}
```

This process enables seamless task execution by dynamically selecting and utilizing agents based on your workflow requirements.

</details>

---

## Select Agent Plan

```text
{{ selectAgentPlan | registry: "registryName" | query: "specifyQuery"  }}

```
Allows to retrieve an ordered list of agents from a specified registry based on a provided query. This node functions similarly to the 'Select Agent' node and accepts the same parameters.

:::note[Parameters]
- **Registry**: The Agent Registry to select from
- **Query**: The query used to identify the correct agent
:::

<details>
<summary>Example Usage 1</summary>


Suppose you have an agent registry named `digital_tasks`. You want to retrieve agents capable of performing the following tasks in sequence:

* Send an approved pull request email
* Fetch posts data
* Extract objects from a video

```text
{{ selectAgentPlan  | registry: "digital_tasks" | query: "Send approved pull request email, fetch posts data and extract objects present in video" }}
```

The output will be an ordered string array of agent names:

```plain
["send_email","fetch_posts_data","subrun_video_extraction"]
```

Once the agents are selected, you can store them in a variable and use them in subsequent nodes, such as the 'Use Agent' node, to execute each task in a loop:

```text
{{ selectAgentPlan  | registry: "digital_tasks" | query: "Send approved pull request email, fetch posts data and extract objects present in video" }}=>{{ variable  | name: "selectedAgents" }}
{
"agentsList": << name: selectedAgents, prompt: false >>
}=>{{ jsonToVars  }}
{{ variableLoop  | variable: "agentsList" | loopType: "" }}
{{ maistro  | template: "<< name: loopValue, prompt: false >>" }}
{{ endLoop  | sleep: "0" }}
```

</details>

---

## Make NTL

```text
{{ makeNTL | query: "specificQuery" | modelCard: "specificLLM"}}

```

This node allows users to query the Large Language Model (LLM), in natural language, to dynamically generate NTL. If an LLM is not specified, the default LLM will be used. 

:::note[Parameters]
- **Query**: A natural language query used to generate NTL. 
- **Model Card**: The specified LLM of choice. If blank, the default LLM will be used. 
:::

<details>
<summary>Example Usage 1</summary>

Suppose your use case is to scrape a news website and output a summary, but you want to dynamically generate the NTL and execute a mAIstro agent for this task.

- Step 1: Select the **Make NTL** node. Add a natural language prompt to scrape Yahoo News and summarize the news. Use the drop-down menu to select an LLM or utilize the default LLM.
- Step 2: Chain a **Set Variable** node to the Make NTL node. Assign a unique name for the variable. This will allow us to call the NTL generated as a mAIstro agent for execution.
- Step 3: Select the **Use Agent** node. Skip assigning a template name, and instead click the NTL box. A menu will appear for you to select the name of your newly created variable. 

```text
{{ makeNTL  | query: "Scrape Yahoo News and summarize the news." | modelCard: "" }}=>{{ variable  | name: "news" | mode: "" | value: "" }}
{{ maistro  | template: "" | ntl: "<< name: news, prompt: false >>" }} 
```

The output will result in a summary of the current news generated from the Yahoo News web source. 

```text
Five stunning portraits in the new issue of Positive News magazine.
Summary: The latest issue of Positive News magazine features five inspiring portrait photographs. The magazine focuses on quality, independent reporting about positive developments and uplifting stories.

What went right this week: potential 'huge gains' for nature, plus more.
Summary: This article highlights positive environmental news from the past week, suggesting there could be major benefits for nature. It focuses on uplifting developments and progress being made.

Thrifty couple choose a charity shop for their 'shiny, sustainable wedding'.
Summary: An eco-conscious couple decided to have a sustainable wedding by getting married in a charity shop. This unique choice allowed them to save money while also reducing waste and supporting a good cause.

Read, swap, repeat: secondhand book recycling platform launches in the UK.
Summary: A new online platform in the UK allows people to recycle and swap secondhand books. This service promotes literacy and sustainability by giving used books a new life and reducing waste.
```

</details>

---

## Agent Loop
 ```text
 {{ agentLoop }}
 ```

 This node allows users to loop through an Agent Plan when used with the **selectAgentPlan** node.

:::note[Parameters]
There are no configuration options for this node. It must be used with the **selectAgentPlan** node.
:::

<details>
<summary>Example Usage 1</summary>

Suppose you have an Agent Registry titled "Weather". This Agent Registry contains two mAIstro Agents.

1. The first mAIstro Agent outputs a description and provides a recap of the weather based on a REST API connector. 
2. The second mAIstro Agent outputs a description of what to wear based on the weather recap generated in the first mAIstro Agent. 

Utilize the **Agent Loop** node to loop through the Weather Agent Registry to output both the recap of the weather and a recommendation of what to wear. 

```text
{{ selectAgentPlan  | registry: "Weather" | query: "Get the current weather recap and tell me what I should wear" | modelCard: "" }}
{{ agentLoop  }}
{{ maistro  | template: "agentLoop.agent" | ntl: "" }}
{{ endLoop  | sleep: "0" }} 
```

- Step 1: Select the "Weather" Agent Registry in the **Select Agent Plan** node. Provide a natural language query to select the correct agents. 
- Step 2: Select the **Agent Loop** node to loop through the mAIstro Agents in the Weather registry. 
- Step 3: Select the **Use Agent** node to import and run the mAIstro templates in the Weather registry. Select **AgentLoop Current Agent** as the mAIstro Agent name. 
- Step 4: Select the **End Loop** node to end the looping. 

The output will show the recap of the weather and a recommendation of what to wear accorindly. 

```text
Based on the forecast, here's what I would advise you to wear:

Today (Afternoon):

Wear light, breathable clothing such as a t-shirt or a lightweight sweater to stay comfortable in the sunny weather.
Consider wearing a light jacket or a sweater to layer over your top for a bit of warmth, given the high temperature is only 43 degrees.
You can wear comfortable walking shoes or sneakers, as the wind is light and not expected to be a factor.

Tonight:

As it's going to be clear skies and quite chilly, dress in layers for the evening. Wear a warm sweater or a light jacket to keep you cozy.
Consider wearing warm socks and comfortable pants or leggings to keep your lower half warm.
You may also want to bring a scarf or a hat to add an extra layer of warmth, especially if you plan to be outside for an extended period.
Overall, dress in layers to adjust to the changing temperatures throughout the day and evening!
```

</details>

---

## End Loop

```text
{{ endLoop  | sleep: "0" }}
```

This node allows users to loop for a set number of times. 

:::note[Parameters]
- **Sleep**: The amount of time in milliseconds to delay the loop iteration. 
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Retitled 'Agent Registry node' to disambiguate from the maistro/agent-registry product screen
-->
