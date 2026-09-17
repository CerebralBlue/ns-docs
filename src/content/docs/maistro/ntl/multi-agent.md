---
title: "Multi-Agent"
description: "Import and run another m<span class='d1'>AI</span>stro template in the same variable space as the current m<span class='d1'>AI</span>stro."
---

## Use Agent 


Import and run another m<span class='d1'>AI</span>stro template in the same variable space as the current m<span class='d1'>AI</span>stro.
:::note[Parameters]

- **template**: The m<span class='d1'>AI</span>stro template name.  This template will share the same variable space as your current template.

- **ntl**: The NTL - Do not include both a template and NTL. Set one or the other only.
:::

---


## Use Agent (sandbox) 


Call another m<span class='d1'>AI</span>stro template, keeping a separate variable space from the current m<span class='d1'>AI</span>stro and only returning the final output.
:::note[Parameters]

- **template**: The m<span class='d1'>AI</span>stro template name.

- **params**: The parameters to pass to the template, in JSON format

- **ntl**: The NTL - Do not include both a template and NTL. Set one or the other only.
:::

---


## Select Agent 


Select a single agent from an agent registry to accomplish a task
:::note[Parameters]

- **registry**: The Registry to select from

- **query**: The query to use to chose the correct agent

- **modelCard**: The LLM to use
:::

---


## Select Agent Plan 


Select an ordered list of agents to accomplish a task
:::note[Parameters]

- **registry**: The Registry to select from

- **query**: The query to use to chose the correct agents

- **modelCard**: The LLM to use
:::

---


## Make NTL 


Use the default LLM to generate NTL
:::note[Parameters]

- **query**: The query to use to chose the correct agents

- **modelCard**: The LLM to use
:::

---


## Agent Loop 


Loop thru an Agent Plan. Must be used with selectAgentPlan

    


    

---


## End Loop 


Loop for a set number of times. Use the Break Loop node to stop the loop early
:::note[Parameters]

- **sleep**: 
    - **text**: Amount of time in milliseconds to delay the next loop iteration
    - **min**: 0
    - **max**: 4000
    - **step**: 100
    - **default**: 0
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - LLM Plan / LLM Act — build a plan in JSON, then execute it via sub-LLM calls
  - Make & Test NTL — generate NTL, test it, iterate
  - Describe NTL / Title NTL — use the LLM to describe or title an NTL script (not in the node menu)
-->
