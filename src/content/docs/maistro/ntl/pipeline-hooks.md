---
title: "Pipeline hooks"
description: "The In/Out node pairs that make the pipeline-agent settings in Neural Config usable — governance, personalization, post-KB, save hooks, corporate logging, Slack events and NeuralEdit."
---

## Pre-llm Governance In

This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow.

---

## Pre-llm Governance Out

This node is used only for returning a custom pre-llm govenance. This node must be the last step in a mAIstro agent.

:::note[Parameters]

- **block**: Block a response

- **blockMessage**: The message to return if blocking

- **originalQuery**: The original query

- **contextQuery**: The context enhanced query

- **lastTurn**: The last turn array

- **language**: The language

- **langCode**: The language code

- **intent**: The intent

- **categoryName**: The category name

- **stump**: The stump context
:::

---

## Governance Input

This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow.

---

## Governance Output

This node is used only for returning a custom governance. This node must be the last step in the mAIstro agent.

:::note[Parameters]

- **block**: Block a response

- **blockMessage**: The message to return if blocking

- **answer**: The answer

- **passages**: The trusted information you used as an array.

- **stump**: The stump context

- **url**: The primary source URL (optional)

- **document**: The primary source document name (optional)
:::

---

## Personalization - In

This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.

This node provides the following Seek variables:

- dynamicPersonalizationIn.user: The user ID
- dynamicPersonalizationIn.originalQuery: The original user query
- dynamicPersonalizationIn.sessionId: The session ID
- dynamicPersonalizationIn.options: The full options object from the API call

---

## Personalization - Out

This node is used only for creating a dynamic personalization agent for use in Seek. This node must be the last step in a mAIstro agent.

:::note[Parameters]

- **preferredName**: The preferred name of the user

- **additionalDetails**: Additional text to pass to language generation about the user.

- **filter**: The filter string used to filter document queries.

- **noWelcome**: The user has already been welcomed, do not re-welcome. Defaults to 'false'.

- **forceFirstPerson**: Use a first-person speaking style, even if no preferred name is set. Defaults to 'false'.

- **products**: The products this customer currently consumes from your company (Separate multiple by commas)

- **personalize**: The personalization JSON object (seek's options.personalize) to override personalization.

- **override**: The override data for the payload. USE WITH CARE. This will allow complete payload override (for other things like prompt engineering or other parameter overrides).
:::

---

## postKB Agent - In

This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.

This node provides the following Seek variables:

- postKBAgentIn.user: The user ID
- postKBAgentIn.originalQuery: The original user query
- postKBAgentIn.sessionId: The session ID
- postKBAgentIn.context: The KB context array
- postKBAgentIn.options: The full options object from the API call

---

## postKB Agent - Out

This node is used only for modifying a KB context for use in Seek. This node must be the last step in a mAIstro agent.

:::note[Parameters]

- **context**: The trusted information to pass on to the LLM as an array.
:::

---

## Post-Seek Agent - In

This node is used only for post-seek processing. It runs asynchronously after each Seek response and does not affect Seek latency. This node must be the first step in a mAIstro agent.

Prefixed variables (postSeekAgentIn.*):

postSeekAgentIn.question, .answer, .answerId, .sessionId, .userId, .user, .score, .url, .document, .langCode, .sentiment, .semanticScore, .params.*, .options.*, .user_session.*

Top-level shortcuts (no prefix needed):

question, answer, session_id, user_id, score

Seek params are also injected at top level: any field in the seek request params (e.g. token, db_uri) is accessible directly by name.

---

## Config Save Input

This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent.

---

## mAIstro Save Input

This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent.

---

## Corp Log Input

This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.

This node provides the following variables:

- corpLogIn.log: The Log JSON
- corpLogIn.id: The id of the log.
- corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro).

---

## Corp Log Replay Input

This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.

This node provides the following variables:

- corpLogReplay.id: The id of the log.
- corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro).

---

## NeuralEdit Input

This node is used only as the first step of a NeuralEdit Agent

---

The Slack Extension's event-handler hooks — **Slack Event - In**, **Slack Event - Out**, and
**Slack Event - Cancel** — follow this same In/Out pattern but are documented on the
[Slack integration page](/maistro/ntl/integrations/slack/) alongside the rest of the Slack nodes.
