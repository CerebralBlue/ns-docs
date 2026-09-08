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


## Post a Message


Connect to Slack and post a message. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc
:::note[Parameters]

- **message**: The message to send

- **channel**: The channel to send the message in

- **token**: A user, bot, or app token with correct permissions.

- **arguments**: Additional arguments, separated by comma. EG: sort=score, sort_dir=desc
:::

---

## Send a Message


Connect to Slack and post a message. You may provide the blockkit array, a body override, or just the message text. You may also provide a thread timestamp to send the message in a thread.
:::note[Parameters]

- **message**: The message to send as text. Use this OR blockkit body, not both.

- **body**: The json/blockkit body of the message. If not provided, the message will be sent as a markdown message.

- **channel**: The channel to send the message in. Use 'event' if you want to automatically reply to the incoming event.

- **token**: A user, bot, or app token with correct permissions.

- **thread_ts**: The thread timestamp to send the message in. If not provided, the message will be sent as a new thread. Use 'event' if you want to automatically reply to the incoming event.

- **reply**: Enable to automatically fill token, channel, and thread_ts to reply to the incoming event.
:::

---

## Slack Event - In
This node is used only for Slack integration, to fulfill incoming events as hooks. This node must be the first step in a mAIstro flow.

All parameters from Slack's Event object are accessible here.

This node provides, but is not limited to, the following mAIstro variables:

- `slackEventIn.type`: The triggering event type.
- `slackEventIn.event`: The event object from Slack.
- `slackEventIn.view`: The view object from Slack.
- `slackEventIn.actions`: The actions object from Slack.
- `slackEventIn.oauthToken`: Your configured slack token for outgoing API calls.
:::note[Parameters]

- **placeholder**: Enable to send the configured placeholder message. Disable this to skip the initial message. Useful when you don't need custom slack messaging payloads.
:::

---

## Slack Event - Out
This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack.

---

## Slack Event - Cancel
This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running.

---

## Slack API Call
Connect to any of Slack's API methods. See https://docs.slack.dev for more details.
:::note[Parameters]

- **method**: The API method to call (e.g. chat.postMessage)

- **payload**: The JSON payload for the API method

- **token**: A user, bot, or app token with correct permissions.

- **outputJSON**: Output the response as JSON instead of variables. (default to false)
:::

---
