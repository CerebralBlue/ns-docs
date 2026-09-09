---
title: "Extract Data"
description: "Collect structured values from a user with the Gather node's slot-filling."
---

## Gather

Gather info from a user based on slots. Create new custom entities on the Extract tab of the NeuralSeek UI.

:::note[Parameters]

- **slots**: The slots to fill

- **input**: The user statement (leave blank to take the node input)

- **retries**: 
    - **text**: The amount of retries to attempt if the user does not provide the required information
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 3

- **includeAllEntities**: Include all entities in the generated question
:::
