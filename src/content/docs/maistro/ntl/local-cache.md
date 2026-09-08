---
title: "Local Cache"
description: "The Local Cache nodes: read, write, search, and manage key/value and phonetic indexes."
---

## List Cache Indexes

List all current Cache Indexes

---

## List Cache Keys

List all keys on a Cache Index

:::note[Parameters]

- **index**: The index
:::

---

## Read Cache

Read from local cache

:::note[Parameters]

- **index**: The index

- **key**: The key
:::

---

## Delete Cache Key

Delete a key from local cache

:::note[Parameters]

- **index**: The index

- **key**: The key
:::

---

## Search Cache Index

Search an index in local cache by index key

:::note[Parameters]

- **index**: The index

- **value**: The key or partial key to search for

- **limit**: 
    - **text**: The number of options to return
    - **min**: 1
    - **max**: 100
    - **step**: 1
    - **default**: 10
:::

---

## Phonetic Search Cache Index

Phonetic search an index in local cache by value

:::note[Parameters]

- **index**: The index

- **value**: The search value

- **limit**: 
    - **text**: The number of options to return
    - **min**: 1
    - **max**: 100
    - **step**: 1
    - **default**: 10

- **blockchars**: 
    - **text**: The minimum number of chars in a word
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 3
:::

---

## Delete Cache Index

Delete an index from local cache

:::note[Parameters]

- **index**: The index
:::

---

## Write Cache

Write a key to local cache. Pass a single string, an array, or values separated by comma or newline

:::note[Parameters]

- **index**: The index

- **key**: The key

- **timeExpire**: The expiration time in seconds (maximum 1 day / 86400 seconds)

- **value**: The Value
:::

---

## Write Phonetic Cache

Write a value to local cache with automatic phonetic keying. Takes either node input or defined value. Pass a single string, an array, or values separated by comma or newline

:::note[Parameters]

- **index**: The index

- **value**: The Value
:::
