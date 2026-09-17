---
title: "System Variables"
description: "Insert the current date."
---

## Current Date 


Insert the current date. The date will also be available via the variable "sys_Date"
:::note[Parameters]

- **timezone**: The timezone
:::

```
{{ date | timezone: "" }}
```

<details>
<summary>Example Usage</summary>

Set the sys_Date variable globally by evaluating the **Current Date** mAIstro node. 
```text
{{ date }}
```
The generated output will show the following date, and set the sys_Date variable.
```text 
`2024-2-16`
```

</details>

---


## Current Time 


Insert the current time.  The time will also be available via the variable "sys_Time"
:::note[Parameters]

- **timezone**: The timezone
:::

```
{{ time  | timezone: "" }}
```
<details>
<summary>Example Usage</summary>

Set the sys_Time variable globally by evaluating the **Current Time** mAIstro node. 
```text
{{ time  | timezone: "UTC−05:00, R" }}
```
The generated output will show the following time, and set the sys_Time variable.
```text 
`20:20:44`
```

</details>

---


## Generate UUID 


Create a UUID.  The UUID will also be available via the variable "sys_UUID"
:::note[Parameters]
No name available.
:::

```text
{{ uuid }}
```
<details>
<summary>Example Usage</summary>

Set the sys_UUID variable globally by evaluating the **Generate UUID** mAIstro node. 
```text
{{ uuid }}
```
The generated output will show a randomly generated UUID, and set the sys_UUID variable.
```text 
`c4c6fc20-12212aea-9129f14b-5de16d39`
```

</details>

---


## Random Number 


Generate a random number.  The number will also be available via the variable "sys_Random"
:::note[Parameters]

- **upper**: The max number

- **lower**: The Min Number
:::

```
{{ random  | upper: "" | lower: "" }}
```

<details>
<summary>Example Usage</summary>

Set the sys_Random variable globally by evaluating the **Random Number** mAIstro node. 
```text
{{ random  | upper: "200" | lower: "100" }}
```
The generated output will show a randomly generated number, and set the sys_Random variable.
```text 
`153`
```

</details>

---


## Categories 


Return the categories in the active configuration
:::note[Parameters]

- **timezone**: The timezone
:::

```
{{ categories  | timezone: "" }}
```

<details>
<summary>Example Usage</summary>

```text
{{ categories  | timezone: "UTC−05:00, R" }}
```
The generated output will show the category types that are currently active in your configuration.
```text 
`LLMs, Chatbots, KnowledgeBases, Finances`
```

</details>

---


## Intents 


Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category

    

```text
{{ intents  }}
```
<details>
<summary>Example Usage</summary>

```text
{{ intents  }}
```
The generated output will show the most recent intents in your currently active configuration.
`The intent "LinkedIn_post-Agentic_Workflows_in_NeuralSeek" has questions like "I need help writing a post about our new Agentic workflows in NeuralSeek. it's for linkedin social media"`
`The intent "Other-draft_sow" has questions like "draft sow"`
`The intent "Other-nerualseek" has questions like "what is nerualseek"`
`The intent "Other-neuralseek" has questions like "what is neuralseek"`
`The intent "Social_Media_Post-Agentic_Workflows_in_NeuralSeek" has questions like "I need help writing a post about our new Agentic workflows in NeuralSeek. it's for linkedin social media"`

</details>
