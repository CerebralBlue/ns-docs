---
title: "Jira"
description: ""
---

## Jira Search 


Connect to Jira and run a search based on the provided query, returning the data.
:::note[Parameters]

- **query**: The Jira search

- **URI**: The URI to use. EG: "xyz.atlassian.net"

- **username**: The username to use

- **apitoken**: The API token to use

- **sentences**: Return in sentences (true) or as JSON (false)
:::

---


## Get Jira Projects 


Connect to Jira and list all projects.
:::note[Parameters]

- **URI**: The URI to use. EG: "xyz.atlassian.net"

- **username**: The username to use

- **apitoken**: The API token to use

- **sentences**: Return in sentences (true) or as JSON (false)
:::

---


## Get Jira Issue 


Connect to Jira and get details about an issue by passing an issue id or key to the id option.
:::note[Parameters]

- **id**: The Jira Issue id or key

- **URI**: The URI to use. EG: "xyz.atlassian.net"

- **username**: The username to use

- **apitoken**: The API token to use

- **sentences**: Return in sentences (true) or as JSON (false)
:::

---


## Add Jira Issue 


Connect to Jira add an issue to the specified project, based on project id or key.
:::note[Parameters]

- **summary**: The title of the Issue

- **description**: The issue description

- **project**: The project id or key to add the issue to

- **raw**: Optional - pass a JSON Issue object to create the issue. This overrides summary and description.

- **URI**: The URI to use. EG: "xyz.atlassian.net"

- **username**: The username to use

- **apitoken**: The API token to use
:::

---


## Edit Jira Issue 


Connect to Jira and edit an issue. Pass the Jira Issue id or key to the id option, and a JSON Issue edit object to the raw option. EG: {"update":{"summary":[{"set":"New Title"}]}}
:::note[Parameters]

- **id**: The Jira Issue id or key

- **raw**: A JSON Issue edit object. EG: {"update":{"summary":[{"set":"New Title"}]}}

- **URI**: The URI to use. EG: "xyz.atlassian.net"

- **username**: The username to use

- **apitoken**: The API token to use
:::
