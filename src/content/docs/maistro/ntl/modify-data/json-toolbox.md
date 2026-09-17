---
title: "JSON Toolbox"
description: "Turn a JSON object into flattened variables for use in later steps."
---

## JSON Tools 


Turn a JSON object into flattened variables for use in later steps.
:::note[Parameters]

- **filter**: A comma separated list of values to filter for

- **filterType**: Equals or Not Equals Filter
:::

```
{{ jsonTools  | filter: "value" | filterType: "" }}
```

<details>
<summary>Example Usage</summary>

```json
{
  "books": [
{
      "title": "The Great Gatsby",
      "summary": "The Great Gatsby is a novel by F. Scott Fitzgerald that follows the story of Jay Gatsby, a wealthy and mysterious man, and his pursuit of the American Dream. Set in the 1920s, the book explores themes of love, wealth, and the corruption of the American Dream.",
      "author": "F. Scott Fitzgerald"
}
]
}
{{ jsonTools  | filter: "The Great Gatsby" | filterType: "Equals" }}
```
Would yield:
```json
{
  "books": [
{
      "title": "The Great Gatsby"
}
]
}
```
Where setting `filterType` to `Not Equals` would yield:
```json
{
  "books": [
{
      "summary": "The Great Gatsby is a novel by F. Scott Fitzgerald that follows the story of Jay Gatsby, a wealthy and mysterious man, and his pursuit of the American Dream. Set in the 1920s, the book explores themes of love, wealth, and the corruption of the American Dream.",
      "author": "F. Scott Fitzgerald"
}
]
}
```

</details>

---


## ReMap a JSON object 


Remap elements in a JSON object from one key name to another. 
:::note[Parameters]

- **match**: The element to match.

- **replace**: The replacement.
:::

---


## Array Filter 


Filter a JSON Array.<br><br>You can use a filterType of "Index" and pass the numerical index of the array to return.<br><br>"IndexRange" expects number-number of indexes to extract EG: 1-3.<br><br>Value match and value Contains will filter the array by finding objects in the array with properties that match the filter value.
:::note[Parameters]

- **filter**: The value to filter for based on Filter Type

- **filterType**: Select the type of filter
:::

---


## Key Filter 


Filter a JSON Object by list of keys
:::note[Parameters]

- **filter**: A comma separated list of keys to filter a json object by
:::

---


## JSON to Variables 


Turn a JSON object into flattened variables for use in later steps.

    

<details>
<summary>Example Usage</summary>

Data can come from a LLM, a file, REST API response, etc
```
{{ LLM  | prompt: "Output some information about a book in JSON format. Include title, summary, and author." | modelCard: "" }}=>{{ jsonToVars }}
```
The output from the LLM:
```json
{
  "title": "The Great Gatsby",
  "summary": "The Great Gatsby is a novel by F. Scott Fitzgerald that follows the story of Jay Gatsby, a wealthy and mysterious man, and his pursuit of the American Dream. Set in the 1920s, the book explores themes of love, wealth, and the corruption of the American Dream.",
  "author": "F. Scott Fitzgerald"
}
```
Finally, looking in the variable inspector, you can see the variables now set available for use: 
![variable inspector](/img/maistro/ntl/modify-data/json-toolbox/explore_variable_inspector_json_variables.png)

</details>

---


## Variables to JSON 


Turn flattened variables into JSON object. (The opposite of jsonToVars) 
:::note[Parameters]

- **path**: The starting path of the flattened JSON to begin from, in dot notation.

- **variable**: The variable to assign the formed JSON to.

- **includePath**: Include the full path in the JSON

- **output**: output the JSON from the node in addition to setting it as a variable
:::

```
{{ varsToJSON  | path: "" | variable: "" }}
```

<details>
<summary>Example Usage 1</summary>

```
Howard has 20 cats and 40 dogs. 
He took them to the vet last week.=>{{ grammar }}=>{{ variable | name: "text" }}
{{ varsToJSON  | path: "" | variable: "gm" }}
<< name: gm, prompt: false >>
```
Will yield:
```
{
"grammar": {
"year": [
2024
],
"context": "",
"dates": [
"last",
"week"
],
"propernouns": [
"Howard"
],
"nouns": [
"20 cats",
"40 dogs",
"vet",
"week"
],
"preps": [
"He",
"them"
],
"determiners": []
},
"text": "Howard has 20 cats and 40 dogs. \nHe took them to the vet last week."
}
```

</details>

<details>
<summary>Example Usage 2</summary>

Using the `path` parameter, we can specify the starting path of values we want:
```
Howard has 20 cats and 40 dogs. 
He took them to the vet last week.=>{{ grammar }}=>{{ variable | name: "text" }}
{{ varsToJSON  | path: "grammar.dates" | variable: "gm" }}
<< name: gm, prompt: false >>
```
Will yield:
```
{
"grammar": {
"dates": [
"last",
"week"
]
}
}
```

</details>

---


## JSON Escape 


Escapes a string for use within a JSON object.

    

```
{{ jsonEscape  }}
```

<details>
<summary>Example Usage</summary>

```json
{
  "books": [
{
      "title": "The Great Gatsby",
      "summary": "The Great Gatsby is a novel by F. Scott Fitzgerald that follows the story of Jay Gatsby, a wealthy and mysterious man, and his pursuit of the American Dream. Set in the 1920s, the book explores themes of love, wealth, and the corruption of the American Dream.",
      "author": "F. Scott Fitzgerald"
}
]
}
{{ jsonEscape }}
```
Would yield:
```json
{\n \"books\": [\n {\n \"title\": \"The Great Gatsby\",\n \"summary\": \"The Great Gatsby is a novel by F. Scott Fitzgerald that follows the story of Jay Gatsby, a wealthy and mysterious man, and his pursuit of the American Dream. Set in the 1920s, the book explores themes of love, wealth, and the corruption of the American Dream.\",\n \"author\": \"F. Scott Fitzgerald\"\n }\n ]\n}\n
```

</details>
