---
title: "Slack"
description: ""
---

## Search for Messages 


Connect to Slack and run a search for messages based on the provided query. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc
:::note[Parameters]

- **query**: The search. Qualifiers are supported

- **token**: A user, bot, or app token with correct permissions.

- **arguments**: Additional arguments, separated by comma. EG: sort=score, sort_dir=desc

- **sentences**: Return in sentences (true) or as JSON (false)
:::

---


## Conversation History 


Connect to Slack and get the conversation history for a channel. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc
:::note[Parameters]

- **channel**: The channel to pull history from

- **token**: A user, bot, or app token with correct permissions.

- **arguments**: Additional arguments, separated by comma. EG: limit=2, oldest=1234567890.123456

- **sentences**: Return in sentences (true) or as JSON (false)
:::

---


## Post a Message 


Connect to Slack and post a message. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc
:::note[Parameters]

- **message**: The message to send

- **channel**: The channel to send the message in

- **token**: A user, bot, or app token with correct permissions.

- **arguments**: Additional arguments, separated by comma. EG: sort=score, sort_dir=desc
:::
