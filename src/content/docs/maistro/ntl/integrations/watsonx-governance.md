---
title: "watsonx.governance"
description: ""
---

## watsonx.governance Seek 


Connect to watsonx.governance and log a Seek. This node is designed for use with the Seek node. For custom RAG, use the watsonXGovRaw node instead.
:::note[Parameters]

- **instanceId**: The watsonx Evaluation datamart ID / Openscale Instance ID

- **payloadDatasetURL**: Enter either the watsonx Subscription Id (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) or The Payload Dataset URL (/v2/data_sets/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx)

- **key**: The IAM api key
:::

---


## watsonx.governance Raw 


Connect to watsonx.governance / OpenScale and send a JSON object
:::note[Parameters]

- **url**: The URL uncluding path of your watsonx.governance / Openscale scoring payload (https://cloud.ibm.com/apidocs/ai-openscale#records-add)

- **key**: The IAM api key

- **raw**: THe JSON object to send
:::
