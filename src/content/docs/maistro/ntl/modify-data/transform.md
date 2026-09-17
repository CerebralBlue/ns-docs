---
title: "Transform"
description: "Summarize a large block of text into a smaller set of extracted sentences."
---

## Summarize 


Summarize a large block of text into a smaller set of extracted sentences.
:::note[Parameters]

- **length**: The desired summary length in characters

- **match**: Text to prioritize building the summary around
:::

```
{{ summarize|length:100|match:"" }}
```

<details>
<summary>Example Usage 1</summary>

```
I have 20 cats and 40 dogs - it's a lot of furry friends to take care of! 
My name is Jane and I run an animal rescue shelter out of my home. 
It all started a few years ago when I took in a litter of abandoned kittens. 
I fell in love with them and decided to make it my mission to give unwanted animals a forever home. 
{{ summarize|length:100 }}
```
Yields:
```
I have 20 cats and 40 dogs - it's a lot of furry friends to take care of!
```

</details>

<details>
<summary>Example Usage 2 - Using <code>match</code></summary>

```
I have 20 cats and 40 dogs - it's a lot of furry friends to take care of! 
My name is Jane and I run an animal rescue shelter out of my home. 
It all started a few years ago when I took in a litter of abandoned kittens. 
I fell in love with them and decided to make it my mission to give unwanted animals a forever home. 
{{ summarize|length:100|match:"love" }}
```
Yields:
```
I fell in love with them and decided to make it my mission to give unwanted animals a forever home.
```

</details>

---


## Translate 


Translate input text.
:::note[Parameters]

- **target**: The 2-char language code

- **additionalInstructions**: Optional - Additional instructions to the LLM
:::

```
{{ translate  | target: "" }}
```

<details>
<summary>Example Usage</summary>

```
The translate function can easily translate text into any language you desire!
{{ translate  | target: "es" }}
```
Would yield:
```
La función de traducción puede traducir fácilmente el texto a cualquier idioma que desee.
```

</details>

---


## Truncate by Tokens 


Truncate text to a max number of LLM tokens.
:::note[Parameters]

- **tokens**: The number of tokens to truncate to. A token is typically 3-4 characters.
:::

```
{{ truncateToken  | tokens: "" }}
```

<details>
<summary>Example Usage</summary>

```
{{ kb | query: "NeuralSeek" }}=>{{ truncateToken | tokens: "2000" }}=>{{ variable | name: "documentation" }}
```
Would yield a variable far too large to include here, but would limit the resulting documentation text to 2000 (2k) tokens before assigning to the `documentation` variable. This helps prevent exceeding context windows of some smaller LLMs.

</details>

---


## Remove Stopwords 


Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text.

    

```
{{ stopwords }}
```

<details>
<summary>Example Usage</summary>

```
I have 20 cats and 40 dogs, isn't this amazing?
{{ stopwords }}
```
Will yield
```
20 cats 40 dogs, amazing?
```
Notice the words `I, have, and, isn't, this` are deemed as stopwords and thus have been removed.

</details>

---


## Force Numeric 


Extract numbers from text.  When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array.

    

```
{{ forceNumeric }}
```

<details>
<summary>Example Usage</summary>

`I have 20 cats and 40 dogs` contains numeric values.  So, running this:
```
I have 20 cats and 40 dogs
{{ forceNumeric }}
```
Will yield: `2040`

</details>

---


## Table Prep 


Take CSV input data and reduce it down to the rows and columns that most likely contain the answer to a query, for use in later steps or to send to an LLM.
:::note[Parameters]

- **query**: The Question to ask of the table

- **sentences**: Return as sentences, an array, or an object
:::

```
{{ tablePrep | query:"" | sentences: "true" }}
```

<details>
<summary>Example Usage 1</summary>

If we have CSV data, table prep will convert it to JSON or natural language:
```
col1,col2,col3
data1,data2,data3
data11,data22,data33
{{ tablePrep | sentences: "false" }}
```
The result will be:
```
{
"col1": [
"data1",
"data11"
],
"col2": [
"data2",
"data22"
],
"col3": [
"data3",
"data33"
]
}
```

</details>

<details>
<summary>Example Usage 2 - Using the <code>query</code> parameter</summary>

```
col1,col2,col3
data1,data2,data3
data11,data22,data33
{{ tablePrep|query: "values for col1" }}
```
Will yield all the values for col1:
```
{
"col1": [
"data1",
"data11"
]
}
```

</details>

<details>
<summary>Example Usage 3 - Using the <code>sentences: true</code> parameter</summary>

```
col1,col2,col3
data1,data2,data3
data11,data22,data33
{{ tablePrep | sentences: "true" }}
```
Will yield:
```
Record number 0 lists that col1 is data1, and the col2 is data2, and the col3 is data3.
Record number 1 lists that col1 is data11, and the col2 is data22, and the col3 is data33.
```

</details>
