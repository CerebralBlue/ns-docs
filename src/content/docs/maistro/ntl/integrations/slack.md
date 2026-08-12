---
title: "Slack"
description: "Connect to Slack to search messages, retrieve conversation history, and post messages to channels."
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


## Send a Message 


Connect to Slack and post a message. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc
:::note[Parameters]

- **message**: The message to send as text. Use this OR blockkit body, not both.

- **channel**: The channel to send the message in. Use 'event' if you want to automatically reply to the incoming event.

- **token**: A user, bot, or app token with correct permissions.

- **body**: The json/blockkit body of the message. If not provided, the message will be sent as a markdown message.

- **thread**: The thread timestamp to send the message in. If not provided, the message will be sent as a new thread. Use 'event' if you want to automatically reply to the incoming event.

- **fill**: Enable to automatically fill token, channel, and thread_ts to reply to the incoming event.
:::

---

## Slack Event - In
This node is used only for Slack integration, to fulfill incoming events as hooks. This node must be the first step in a mAIstro flow.
:::note[Parameters]

- **enable**: Enable to send the configured placeholder message. Disable this to skip the initial message. Useful when you don't need custom slack messaging payloads.
:::

---

## Slack Event - Out
Enable to send the configured placeholder message. Disable this to skip the initial message. Useful when you don't need custom slack messaging payloads.
:::

---

## Slack Event - Cancel
Enable to send the configured placeholder message. Disable this to skip the initial message. Useful when you don't need custom slack messaging payloads.
:::

---

## Slack API Call
Connect to any of Slack's API methods. See https://docs.slack.dev for more details.
:::note[Parameters]

- **method**: The API method to call (e.g. chat.postMessage)

- **payload**: The JSON payload for the API method

- **permission**: A user, bot, or app token with correct permissions.

- **output**: Output the response as JSON instead of variables. (default to false)
:::

---
