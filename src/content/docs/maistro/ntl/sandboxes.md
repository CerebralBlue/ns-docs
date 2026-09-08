---
title: "Sandboxes"
description: "Nodes that run isolated code or agents: Custom Connector, Javascript Sandbox, and Python Sandbox."
---

## Custom Connector

Call another mAIstro template as a custom connector, keeping a separate variable space from the current mAIstro and only returning the final output.

:::note[Parameters]

- **template**: The mAIstro agent name.

- **params**: The parameters to pass to the agent, in JSON format

- **path**: (Optional) mAIstro call url of the region/instance

- **apikey**: (Optional) mAIstro api key
:::

---

## Javascript Sandbox

Run arbitrary javascript ESM code. You must use import and not require (CJS)

:::note[Parameters]

- **script**: The script

- **maxTime**: 
    - **text**: Max execution time in MS
    - **min**: 100
    - **max**: 30000
    - **step**: 1
    - **default**: 1000
:::

---

## Python Sandbox

Run arbitrary Python code.

:::note[Parameters]

- **script**: The script

- **maxTime**: 
    - **text**: Max execution time in MS
    - **min**: 100
    - **max**: 30000
    - **step**: 1
    - **default**: 1000
:::
