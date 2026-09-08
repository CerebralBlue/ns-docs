---
title: "String Toolbox"
description: "Text utilities: splitting, encoding, case conversion, translation, regex, and token management."
---

## Text

This node inserts text

:::note[Parameters]

- **text**: The text
:::

---

## Split (extract section)

Take input text and extract a section from it based on matching start and end text of the section, while optionally removing headers and footers. You must specifiy a unique start and end character set for this node to work.

:::note[Parameters]

- **start**: Find text to start the split.

- **end**: Find text to end the split

- **removeHeaders**: Remove detected Headers and Footers
:::

---

## Split (on delimiter)

Take input text and split it by a specified delimiter into an array of values.

:::note[Parameters]

- **delimiter**: The delimiting string or regex on which to split the input text

- **outputJson**: Output the split result as a JSON array (defaults to false)

- **variable**: The base variable name to use for the array
:::

---

## Base64 Encode

Take input text and encode it to Base64 encoding.

---

## Base64 Decode

Take input text and decode it from Base64 encoding.

---

## URL Encode

Take input text and URL encode it.

---

## URL Decode

Take input text and URL decode it.

---

## UPPERCASE

Convert a string to UPPERCASE.

---

## lowercase

Convert a string to lowercase.

---

## Deduplicate Log

Removes exact duplicate lines and structurally similar lines (differing only in timestamps, numbers, or UUIDs) from log text to reduce context size.

---

## Translate

Translate input text.

:::note[Parameters]

- **target**: The 2-char language code

- **additionalInstructions**: Optional - Additional instructions to the LLM
:::

---

## Remove Words

Remove specified words and phrases from text. Provide one phrase per line. Removal is case-insensitive. Whitespace is normalized after removal.

:::note[Parameters]

- **words**: Words or phrases to remove (one per line). Case-insensitive.
:::

---

## Truncate by Tokens

Truncate text to a max number of LLM tokens.

:::note[Parameters]

- **tokens**: The number of tokens to truncate to. A token is typically 3-4 characters.
:::

---

## Pack

Pack text

:::note[Parameters]

- **text**: The text to pack. Leave blank to take the node input
:::

---

## UnPack

UnPack text

:::note[Parameters]

- **text**: The text to unpack. Leave blank to take the node input
:::

---

## Regular Expression

Use a Regular Expression to modify or extract data from text. The match option must be a valid regex, starting with a forward slash and ending with a forward slash plus any regex flags, for example: /d+.d+/. In the regex escape all special characters with a single backslash. Use either the replace option to replace matched text, or the group option to extract text from the specified regex group number

:::note[Parameters]

- **match**: The regular expression

- **replace**: The text to replace the match. Use this OR 'group'

- **group**: The group to extract. Use this OR 'replace'
:::
