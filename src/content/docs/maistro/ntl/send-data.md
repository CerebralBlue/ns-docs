---
title: "Send Data"
description: "Nodes that send data out: REST calls, email (SMTP send, mailbox read and send, parse and create .eml), streaming, Curate, and the write operations for Google Calendar and Gmail."
---

## REST

Send a REST request and return the received data

:::note[Parameters]

- **url**: The URL to send the POST to

- **headers**: The JSON formatted header

- **username**: Username for APIs using Basic Auth

- **password**: Password for APIs using Basic Auth

- **apikey**: API Key for APIs using Oauth/Bearer tokens

- **body**: The message body

- **operation**: The REST operation

- **tlsverify**: TLS certificate verification (defaults to true)

- **jsonToVars**: Transform response JSON to variables

- **filename**: Save the output to a file directly

- **attachment**: Attach a file to the operation

- **cert**: Client certificate for the REST API
:::

---

## Send Email (SMTP)

Send an email through an SMTP server. Leave the host, port, user, password and from fields blank to use the NeuralSeek default mail server. This node only sends - to read, search or manage a mailbox, use the Email (Read & Manage) node.

:::note[Parameters]

- **to**: The Email 'to' address. Separate multiple by comma.

- **subject**: The Email subject

- **message**: The Email body

- **attachment**: Optional Attachments. Separate multiple attachements filenames by newline or semicolon

- **host**: The SMTP server (optional)

- **port**: The SMTP server port (optional)

- **user**: The Email username (optional)

- **pass**: The Email password (optional)

- **from**: The Email 'from' address (optional)
:::

---

## Email (Read & Manage)

Read and manage email in Gmail, Microsoft 365, IMAP or POP3. Pick the mail system with "provider" and the action with "operation". Use list or search first to get an email's id, then pass that id to get, delete, move or mark it read.

:::note[Parameters]

- **provider**: Which mail system to talk to

- **operation**: What to do

- **folder**: The folder / label to work in (default: INBOX). For 'move' this is where the message is now

- **search**: What to search for. IMAP servers also accept criteria like: FROM "bob" UNSEEN

- **timeMin**: Only messages on or after this date

- **timeMax**: Only messages before this date

- **maxResults**: 
    - **text**: How many messages to return
    - **min**: 1
    - **max**: 100
    - **step**: 1
    - **default**: 25

- **emailId**: The id of the message, as returned by list or search

- **toFolder**: The destination folder / label to move the message into

- **markSeen**: Mark the message as read when you fetch it

- **includeAttachments**: Save attachments to the agent's files and list their names

- **read**: true marks the message read, false marks it unread

- **to**: Who to send to. Separate multiple addresses with commas

- **cc**: Copy these addresses

- **bcc**: Blind-copy these addresses

- **subject**: The subject line

- **html**: The message body. HTML is allowed

- **replyAll**: Reply to everyone on the original message, not just the sender

- **accessToken**: OAuth access token. The usual way to connect to Gmail and Microsoft 365

- **host**: The mail server hostname, eg. imap.example.com

- **user**: The mailbox username, usually the email address

- **pass**: The mailbox password, or an app password

- **port**: Server port. Defaults to 993/995 with TLS, 143/110 without

- **secure**: Use a secure connection. Leave this on unless your mail server needs it off

- **refreshToken**: Optional. Lets a long-running agent get a fresh access token if the current one expires

- **clientId**: OAuth client id, needed only to refresh a token

- **clientSecret**: OAuth client secret, needed only to refresh a token

- **tenantId**: Microsoft directory (tenant) id

- **key**: A Google service-account key in JSON format, if you are not using a token

- **userId**: The mailbox to act on, usually its email address
:::

---

## Parse Email

Read and parse an email in either .eml or .msg format.

:::note[Parameters]

- **name**: The email file (.eml or .msg). Include this or the email data.

- **data**: The email data. Include this or the file name

- **includeHeaders**: Return the email headers (Default False)
:::

---

## Create Email

Create a .eml file, output as a string. Takes the input of the parseEmail node to recreate a .eml.

:::note[Parameters]

- **emlJSON**: The eml input JSON (parseEmail output)
:::

---

## Stream

Send a string to the client when response streaming is enabled. Plain text will be converted to JSON.

:::note[Parameters]

- **string**: The text to stream (leave blank for current input)

- **raw**: Stream raw text with no cleansing or conversion
:::

---

## Curate

Use with a custom RAG flow to send answers to Curate and Analytics. You do not need to pass any options when using with the Seek node.

:::note[Parameters]

- **question**: The User question (optional only if using the Seek node)

- **answer**: The provided answer (optional only if using the Seek node)

- **category**: The category (numerical - optional)

- **intent**: The intent (optional)

- **session_id**: A session id (optional)
:::

---

## Add Context

Add context to text

:::note[Parameters]

- **session_id**: A session ID for the context. Must use the same as was sent to Curate
:::

---

## Google Calendar - Add Event

Add a google calendar event. Requires a JSON key and a calendar id.

:::note[Parameters]

- **event**: The event in JSON Format.

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Google Calendar - Update Event

Update a google calendar event. Requires a JSON key and a calendar id.

:::note[Parameters]

- **eventId**: The event ID.

- **event**: The event in JSON Format.

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Google Calendar - Delete Event

Delete a google calendar event. Requires a JSON key and a calendar id.

:::note[Parameters]

- **eventId**: The event ID.

- **calendarId**: The calendar ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Reply — **Deprecated**

Reply to a gmail email. Requires a JSON key and an email id. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **text**: The reply text

- **emailId**: The email ID

- **replyAll**: Reply to all?

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Send — **Deprecated**

Send a gmail email. Requires a JSON key. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **to**: To.

- **cc**: CC.

- **bcc**: BCC.

- **subject**: Subject.

- **html**: HTML.

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Delete — **Deprecated**

Delete a gmail email. Requires a JSON key and a email id. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **emailId**: The email ID.

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::

---

## Gmail - Move — **Deprecated**

Move a gmail email. Requires a JSON key and a email id. Deprecated - prefer the "mailbox" node, which does this for Gmail with an OAuth token and also covers Microsoft 365, IMAP and POP3.

:::note[Parameters]

- **folder**: The folder to move to

- **emailId**: The email ID.

- **userId**: The user ID (typically your email address)

- **key**: The Google Service account key, in JSON format
:::
