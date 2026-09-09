---
title: "JSON Toolbox"
description: "JSON and array utilities: flattening to variables, filtering, merging, remapping, and compression."
---

## JSON Escape

Escapes a string for use within a JSON object.

---

## JSON to Variables

Turn a JSON object into variables for use in later steps. By default this will flatten the object into dot and bracket notation EG: var[0], var[1] for an input object {var: ['a','b']}

:::note[Parameters]

- **startingPath**: Starting path name (optional). Navigate into a nested JSON path before flattening to variables. Use dot notation for nested paths, e.g. 'data.results'.

- **prefix**: Prefix (optional). Prepend a prefix to all variable names. e.g. a prefix of 'myPrefix' turns 'test.a.b' into 'myPrefix.test.a.b'.

- **flatten**: Flatten any nested arrays or objects forund into variables in dot notation of their path. (default true)
:::

---

## ReMap a JSON object

Remap elements in a JSON object from one key name to another.

:::note[Parameters]

- **match**: The element to match.

- **replace**: The replacement.
:::

---

## Variables to JSON

Turn flattened variables into JSON object. (The opposite of jsonToVars)

:::note[Parameters]

- **path**: The starting path of the flattened JSON to begin from, in dot notation.

- **variable**: The variable to assign the formed JSON to.

- **includePath**: Include the full path in the JSON

- **output**: output the JSON from the node in addition to setting it as a variable
:::

---

## JSON Tools

Turn a JSON object into flattened variables for use in later steps.

:::note[Parameters]

- **filter**: A comma separated list of values to filter for

- **filterType**: Equals or Not Equals Filter
:::

---

## JSON Compress

Takes JSON from the previous chained node and returns a compressed version: null / undefined / empty string / empty array / empty object / NaN / Infinity values are removed; string values are trimmed and internal whitespace collapsed; parents that become empty from pruning are dropped as well. Output is a minified JSON string.

---

## Array Merge

Merge two JSON arrays

:::note[Parameters]

- **array1**: The first array

- **array2**: The second array
:::

---

## Array Filter

Filter a JSON Array.

You can use a filterType of "Index" and pass the numerical index of the array to return.

"IndexRange" expects number-number of indexes to extract EG: 1-3.

Value match and value Contains will filter the array by finding objects in the array with properties that match the filter value.

:::note[Parameters]

- **filter**: The value to filter for based on Filter Type

- **filterType**: Select the type of filter
:::

---

## ReSort Array

Resort an array by a string of index numbers. Either include a full list of the new indici positions, or a partial list of indicis to order.  EG: -1 would mean make the last array item the first. 3,4 would bring the 3rd and 4th index to the front.

:::note[Parameters]

- **array**: The array

- **sort**: A string of numbers separated by comma specifying the new array indici order
:::

---

## Key Filter

Filter a JSON Object by list of keys

:::note[Parameters]

- **filter**: A comma separated list of keys to filter a json object by
:::

---

## JSON to CSV

Turn JSON to CSV
