---
title: "Get Data"
description: "Nodes that read or retrieve data: local documents, web pages, RSS feeds, session and cache lookups, and the list/read operations for Box, SFTP, Azure Blob Storage, and Google Calendar and Gmail."
---

## Local Document

Read a local document

:::note[Parameters]

- **name**: The document name
:::

---

## Read Base64 Document

Read a local document as base64 encoded data

:::note[Parameters]

- **name**: The document name
:::

---

## Website Data

Scrape a webpage or a document from a URL and cleanse and return the text on it.

:::note[Parameters]

- **url**: The URL to scrape

- **selectors**: An array of CSS selectors to remove from the HTML
:::

---

## Get Links

Scrape a webpage for links or current flowing text into this node and return a JSON array of objects of the links.

:::note[Parameters]

- **url**: The URL to scrape

- **filters**: An array of filters to remove from the links
:::

---

## RSS to Markdown

Get RSS feeds and turn it into markdown.

:::note[Parameters]

- **rss**: The RSS feed urls, separated by comma

- **items**: 
    - **text**: The number of items per feed
    - **min**: 1
    - **max**: 100
    - **step**: 1
    - **default**: 5

- **title**: The title for the markdown
:::

---

## Query Cache

Query stored answers from the curate tab

:::note[Parameters]

- **question**: The text to search
:::

---

## Session History

Grab session history for a sessionId and number of previous turns of the conversation

:::note[Parameters]

- **sessionId**: The session ID

- **turns**: 
    - **text**: The number of previous turns of the conversation to return
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 1
:::

---

## Categories

Return the categories in the active configuration

---

## Intents

Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category

---

## Box List

Connect to Box and list a folder, returning the data.

:::note[Parameters]

- **folder**: The folder to list

- **token**: The JWT
:::

---

## Box Read

Connect to Box and read a file, saving it locally.

:::note[Parameters]

- **id**: The id of the file to read

- **token**: The JWT
:::

---

## SFTP List

Connect to SFTP and list a folder, returning the data.

:::note[Parameters]

- **folder**: The path to list

- **host**: The hostname or ip

- **port**: The port

- **user**: The username

- **password**: Password. Enter this or the key

- **key**: SSH Key. Enter this or the password
:::

---

## SFTP Read

Connect to SFTP and read a file, saving it locally.

:::note[Parameters]

- **name**: The file to read

- **folder**: The path the file will be read from

- **host**: The hostname or ip

- **port**: The port

- **user**: The username

- **password**: Password. Enter this or the key

- **key**: SSH Key. Enter this or the password
:::

---

## Azure Blob List Containers

Connect to Azure Blob Storage and list containers

:::note[Parameters]

- **connectionString**: Azure Storage connection string
:::

---

## Azure Blob List Blobs

Connect to Azure Blob Storage and list blobs

:::note[Parameters]

- **containerName**: The container name

- **connectionString**: Azure Storage connection string

- **prefix**: Optional prefix to filter blobs

- **maxResults**: Maximum number of blobs to return (optional)
:::

---

## Azure Blob Read

Connect to Azure Blob Storage and read a blob

:::note[Parameters]

- **blobName**: The blob name (path) to read

- **containerName**: The container name

- **connectionString**: Azure Storage connection string

- **filename**: Optional - save the file locally with this name
:::

---

## Google Calendar - Search

Search a google calendar. Requires a JSON key and a calendar id.

:::note[Parameters]

- **search**: The search query.

- **timeMin**: The minimum time

- **timeMax**: The max time

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Google Calendar - List

List events on a google calendar. Requires a JSON key and a calendar id.

:::note[Parameters]

- **timeMin**: The minimum time

- **timeMax**: The max time

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Google Calendar - Get Event

Get a google calendar event. Requires a JSON key and a calendar id.

:::note[Parameters]

- **eventId**: The event ID.

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Search — **Deprecated**

Search gmail. Requires a JSON key. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **search**: The search query.

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - List — **Deprecated**

List a gmail inbox. Requires a JSON key. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **timeMin**: The minimum time

- **timeMax**: The max time

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Get Email — **Deprecated**

Get a gmail email. Requires a JSON key and a email id. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **emailId**: The email ID.

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::
