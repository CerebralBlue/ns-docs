---
title: "Google Drive"
description: ""
---

## Google Drive - Read 


Read from Google Drive. To set this up, enable the Google Drive API and create a service account and JSON key.  Then in your Google drive, choose a folder ID to write to and share it with the service account's email.  The folder ID is viewable in the URL when in that folder in Googgle Drive.
:::note[Parameters]

- **title**: The document title. Either this or the ID are required.

- **id**: The ID of the document.  Either this or the title are required.

- **key**: The Google Service account key, in JSON format

- **folder**: The folder ID containing the file. Ensure you have shared it with the service account
:::

---


## Google Drive - Write 


Write text to Google Drive. To set this up, enable the Google Drive API and create a service account and JSON key.  Then in your Google drive, choose a folder ID to write to and share it with the service account's email.  The folder ID is viewable in the URL when in that folder in Googgle Drive.
:::note[Parameters]

- **title**: The document title

- **key**: The Google Service account key, in JSON format

- **folder**: The folder ID to write to. Ensure you have shared it with the service account
:::
