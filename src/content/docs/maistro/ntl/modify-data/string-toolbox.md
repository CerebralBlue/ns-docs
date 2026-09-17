---
title: "String Toolbox"
description: "Convert a string to UPPERCASE."
---

## UPPERCASE 


Convert a string to UPPERCASE.

    

```
{{ uppercase  }}
```

<details>
<summary>Example Usage</summary>

```
The Quick Brown Fox Jumps Over The Lazy Dog
{{ uppercase  }}
```
Would yield:
```
THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
```

</details>

---


## lowercase 


Convert a string to lowercase.

    

```
{{ lowercase }}
```

<details>
<summary>Example Usage</summary>

```
The Quick Brown Fox Jumps Over The Lazy Dog
{{ lowercase  }}
```
Would yield:
```
the quick brown fox jumps over the lazy dog
```

</details>

---


## Base64 Encode 


Take input text and encode it to Base64 encoding.

    

```
{{ b64encode }}
```

<details>
<summary>Example Usage</summary>

```
The Quick Brown Fox Jumps Over The Lazy Dog
{{ b64encode  }}
```
Would yield:
```
VGhlIFF1aWNrIEJyb3duIEZveCBKdW1wcyBPdmVyIFRoZSBMYXp5IERvZwo=
```

</details>

---


## Base64 Decode 


Take input text and decode it from Base64 encoding.

    

```
{{ b64decode }}
```

<details>
<summary>Example Usage</summary>

```
VGhlIFF1aWNrIEJyb3duIEZveCBKdW1wcyBPdmVyIFRoZSBMYXp5IERvZwo=
{{ b64decode  }}
```
Would yield:
```
The Quick Brown Fox Jumps Over The Lazy Dog
```

</details>

---


## URL Encode 


Take input text and URL encode it.

    

```
{{ urlencode }}
```

<details>
<summary>Example Usage</summary>

```
The Quick Brown Fox Jumps Over The Lazy Dog
{{ urlencode  }}
```
Would yield:
```
The%20Quick%20Brown%20Fox%20Jumps%20Over%20The%20Lazy%20Dog%0A
```

</details>

---


## URL Decode 


Take input text and URL decode it.

    

```
{{ urldecode }}
```

<details>
<summary>Example Usage</summary>

```
The%20Quick%20Brown%20Fox%20Jumps%20Over%20The%20Lazy%20Dog%0A
{{ urldecode }}
```
Would yield:
```
The Quick Brown Fox Jumps Over The Lazy Dog
```

</details>

---


## Split (extract section) 


Take input text and extract a section from it based on matching start and end text of the section, while optionally removing headers and footers. You must specifiy a unique start and end character set for this node to work.
:::note[Parameters]

- **start**: Find text to start the split.

- **end**: Find text to end the split

- **removeHeaders**: Remove detected Headers and Footers
:::

```
{{ split  | start: "" | end: "" | removeHeaders: "true" }}
```

<details>
<summary>Example Usage</summary>

```
I have 20 cats and 40 dogs.
{{ split | start: "20" | end: "40" | removeHeaders: false }}
```
Would yield:
```
20 cats and
```

</details>

---


## Split (on delimiter) 


Take input text and split it by a specified delimiter into an array of values.
:::note[Parameters]

- **delimiter**: The delimiting string or regex on which to split the input text

- **outputJson**: Output the split result as a JSON array (defaults to false)

- **variable**: The base variable name to use for the array
:::

```
{{ splitDelim  | delimiter: "," | outputJson: "" | variable: "" }}
```

<details>
<summary>Example Usage</summary>

```
I have 20 cats and 40 dogs.
{{ splitDelim  | delimiter: "cats" | outputJson: "true" | variable: "" }}
```
Would yield:
```
["I have 20 "," and 40 dogs.\n"]
```

</details>

---


## Regular Expression 


Use a Regular Expression to modify or extract data from text.  The match option must be a valid regex, starting with a forward slash and ending with a forward slash plus any regex flags, for example: /d+.d+/.  In the regex escape all special characters with a single backslash. Use either the replace option to replace matched text, or the group option to extract text from the specified regex group number 
:::note[Parameters]

- **match**: The regular expression

- **replace**: The text to replace the match. Use this OR 'group'

- **group**: The group to extract. Use this OR 'replace'
:::

```
{{ regex  | match: "" | replace: "" | group: "" }}
```

<details>
<summary>Example Usage 1</summary>

If you have a text that you need to replace with something else, you can use the following expression:
```
my name is howardyoo
{{ regex  | match: "yoo" | replace: "yu" }}
```
Which yields:
```
my name is howardyu
```

</details>

<details>
<summary>Example Usage 2</summary>

Regex also supports extraction. For example, if you want to extract the email address in a text message, you can do so:
```
my name is howardyoo@email.com
{{ regex | match: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" | group: "0" }}
```
This will extract the email address (group 0). The result is:
```
howardyoo@email.com
```

</details>

<details>
<summary>Example Usage 3</summary>

Regex also supports groups, so in case you want to get the last digits of a phone number, you can do so:
```
my phone number is 213-292-3322
{{ regex  | match: "([0-9]+)-([0-9]+)-([0-9]+)" | group: "3" }}
```
which will result in:
```
3322
```

</details>

---


## JSON Escape 


Escapes a string for use within a JSON object.
