---
title: "Send Data"
description: "Send a REST request and return the received data :::note[Parameters]"
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

---


## Email 


Connect to an SMTP server and send an email
:::note[Parameters]

- **host**: The SMTP server

- **port**: The SMTP server port

- **user**: The Email username

- **pass**: The Email password

- **from**: The Email 'from' address

- **to**: The Email 'to' address. Separate multiple by comma.

- **subject**: The Email subject

- **message**: The Email body

- **attachment**: Optional Attachment
:::

```
{{ email|host:"" | port: "" | user: "" | pass: "" | from: "" | to: "" | subject: "" | message: "" }}
```
