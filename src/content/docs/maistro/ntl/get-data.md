---
title: "Get Data"
description: "User input text or prompting."
---

## Text 


User input text or prompting.
:::note[Parameters]

- **text**: Text to inject
:::

---


## KB Documentation 


Run a query directly against the KnowledgeBase. The options snippet and scoreRange are optional overrides of your configuration and should not normally be set.
:::note[Parameters]

- **query**: The KnowledgeBase search

- **filter**: The KnowledgeBase filter

- **snippet**: Override the Passage Size

- **scoreRange**: Override the Score Range
:::

```
{{ kb|query:"your KB query" | snippet: "" | scoreRange: "" | filter: "" }}
```

:::note
This sets some global variables after use, like `kb.score`, `kb.context`, `kb.url`, and more. All of the KB search return values are available under this `kb` object. Use the Inspector to see all variables set.
:::

---


## Seek 


Run a Seek
:::note[Parameters]

- **query**: The Question to Seek

- **stump**: Information to add as priority in the Context

- **filter**: A filter to pass to the KB

- **language**: The response language, if different than the default

- **seekLLM**: Set a specific model card to use for this seek
:::

```
{{ seek|query:"your Seek query" | stump: "" | filter: "" | language: "" | seekLLM: "" }}
```

:::note
This sets some global variables after use, like `seek.score`, `seek.answer`, `seek.semanticScore`, and more. All of seek's return values are available under this `seek` object. Use the Inspector to see all variables set.
:::

---


## REST 


Send a REST request and return the received  data
:::note[Parameters]

- **url**: The URL to send the POST to

- **headers**: The JSON formatted header

- **username**: Username for APIs using Basic Auth

- **password**: Password for APIs using Basic Auth

- **apikey**: API Key for APIs using Oauth/Bearer tokens

- **body**: The message body

- **operation**: The REST operation

- **jsonToVars**: Transform response JSON to variables
:::

```
{{ post|url: "" | headers: "" | body: "" | operation: "POST" | jsonToVars: "true" }}
```
:::note
This sets some global variables if "JSON to Vars" is enabled. Use the Inspector to see all variables set from the API response.
:::

---


## Website Data 


Scrape a webpage or a document from a URL and cleanse and return the text on it.
:::note[Parameters]

- **url**: The URL to scrape

- **selectors**: An array of CSS selectors to remove from the HTML
:::
