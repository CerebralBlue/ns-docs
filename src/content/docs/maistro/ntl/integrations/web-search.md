---
title: "Web Search"
description: "Search the web across Google, Bing, Yahoo, DuckDuckGo, and Brave to find relevant online information and sources."
---

## Google Search 


Search the web using Google.
:::note[Parameters]

- **query**: The search query

- **apiKey**: Google API Key

- **engine**: Programmable Search Engine ID
:::

---


## Bing Search 


Search the web using Bing.
:::note[Parameters]

- **query**: The search query
:::

---


## Yahoo Search 


Search the web using Yahoo.
:::note[Parameters]

- **query**: The search query
:::

---


## DuckDuckGo Search 


Search the web using DuckDuckGo.
:::note[Parameters]

- **query**: The search query
:::

---


## Brave Search 


Search the web using Brave.
:::note[Parameters]

- **query**: The search query

- **apiKey**: Your api key

- **count**: 
    - **text**: The number of responses
    - **min**: 1
    - **max**: 20
    - **step**: 1
    - **default**: 5

- **cache**: Cache results
:::

---

## Exa Search 


Search the web using Exa neural search. Returns model-extracted highlights, optionally scoped to specific domains.
:::note[Parameters]

- **query**: The search query

- **apiKey**: Your Exa API key

- **type**: Search type (leave blank for auto)

- **numResults**: 
    - **text**: The number of responses
    - **min**: 1
    - **max**: 20
    - **step**: 1
    - **default**: 5

- **includeDomains**: Restrict to these domains (comma or newline separated, eg: epa.gov, osha.gov). Leave blank for the whole web.

- **highlightChars**: 
    - **text**: Max characters per highlight
    - **min**: 500
    - **max**: 10000
    - **step**: 500
    - **default**: 3000

- **jsonOverride**: Advanced: raw JSON merged into the Exa request body. Override or add any Exa API param (eg excludeDomains, startPublishedDate, category, livecrawl, contents). Top-level keys here win over the fields above.

- **cache**: Cache results
:::

---