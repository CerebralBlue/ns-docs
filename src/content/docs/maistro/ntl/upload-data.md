---
title: "Upload Data"
description: "Nodes that write files out to storage: Box, SFTP, Azure Blob Storage, and local Base64 documents."
---

## Box Write

Connect to Box and write a file.

:::note[Parameters]

- **name**: The file to write

- **folder**: The folder the file will be written to

- **token**: The JWT
:::

---

## SFTP Write

Connect to SFTP and write a file.

:::note[Parameters]

- **name**: The file to write

- **folder**: The path the file will be written to

- **host**: The hostname or ip

- **port**: The port

- **user**: The username

- **password**: Password. Enter this or the key

- **key**: SSH Key. Enter this or the password
:::

---

## Azure Blob Write

Connect to Azure Blob Storage and write a blob

:::note[Parameters]

- **data**: The data to write (or leave blank to use chain input)

- **blobName**: The blob name (path) to write

- **containerName**: The container name

- **connectionString**: Azure Storage connection string

- **filename**: Optional - read and upload this local file instead of data
:::

---

## Azure Blob Delete

Connect to Azure Blob Storage and delete a blob

:::note[Parameters]

- **blobName**: The blob name (path) to delete

- **containerName**: The container name

- **connectionString**: Azure Storage connection string
:::

---

## Save Base64 Document

Save a base64 encoded document

:::note[Parameters]

- **name**: The document name

- **base64String**: The base 64 encoded document string
:::
