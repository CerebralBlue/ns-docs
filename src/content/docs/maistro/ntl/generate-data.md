---
title: "Generate Data"
description: "This node takes all text flowing into it and sends it to an LLM."
---

## Send to LLM 


This node takes all text flowing into it and sends it to an LLM.  If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes.  Be sure that any text being sent to this node has new prompting to send to the LLM.  When chaining multiple LLM nodes be sure that each llm node has adding additional prompting specifiying the new or next action to be taken. For models that support image processing you may add a single base64 encoded image to the images option to pass to the LLM.
:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **cache**: Cache and reuse LLM response for identical requests

- **images**: A single base64 encoded image string, for use with LLM's that support image processing.

- **modelCard**: Override the default m<span class='d1'>AI</span>stro LLM

- **stream**: Override the streaming setting for this LLM node

- **maxTokens**: Override the template's max Tokens

- **minTokens**: Override the template's min Tokens

- **temperatureMod**: 
    - **text**: Override the template's Temperature
    - **min**: -1
    - **max**: 1
    - **step**: 0.01
    - **default**: 0

- **toppMod**: 
    - **text**: Override the template's Top Probability
    - **min**: -1
    - **max**: 1
    - **step**: 0.01
    - **default**: 0

- **freqpenaltyMod**: 
    - **text**: Override the template's Frequency Penalty
    - **min**: -1
    - **max**: 1
    - **step**: 0.01
    - **default**: 0

- **timeout**: 
    - **text**: Set a timeout for the KB call
    - **min**: 0
    - **max**: 30000
    - **step**: 1
    - **default**: 0
:::

```text
{{ LLM }}
{{ LLM | prompt: "" }}
{{ LLM | prompt: "" | modelCard: "" | maxTokens: "" | minTokens: "" | temperatureMod: "" | toppMod: "" | freqpenaltyMod: "" }}
```

<details>
<summary>Example Usage</summary>

```
Write a short poem about NeuralSeek
Here is the definition of NeuralSeek:
{{ web|url:"https://documentation.neuralseek.com/" }}=>{{ summarize|length:200 }}
{{ LLM }}
```
This will write a short poem about NeuralSeek, based on the content retrieved from our documentation. 
In the LLM syntax, you can add additional prompts such as:
```
Write a short poem about NeuralSeek
Here is the definition of NeuralSeek:
{{ web|url:"https://documentation.neuralseek.com/" }}=>{{ summarize|length:200 }}
{{ LLM|prompt: "write in Spanish" }}
```
This will prepend "write in Spanish" to the whole prompt given to the LLM, outputting a poem in Spanish.

</details>

---


## Write Doc (txt, csv, html) 


Create a local file.
:::note[Parameters]

- **file**: The filename
:::

---


## Write PowerPoint 


Create a local file.
:::note[Parameters]

- **file**: The filename
:::

---


## Write Word Doc 


Create a local Microsoft Word file.
:::note[Parameters]

- **file**: The filename
:::

---


## Write PDF 


Create a local PDF file.
:::note[Parameters]

- **file**: The filename
:::

---


## Table Understanding 


Take CSV input data and try and answer a query directly
:::note[Parameters]

- **query**: The Question to ask of the table
:::

```text
{{ TableUnderstanding|query:"What year had the highest revenue?" }}
```

<details>
<summary>Example Usage</summary>

![explore_feature_tableunderstanding1](/img/maistro/ntl/generate-data/explore_feature_tableunderstanding1.png)
![explore_feature_tableunderstanding2](/img/maistro/ntl/generate-data/explore_feature_tableunderstanding2.png)

</details>

---


## Mathematical Equation 


Run a mathermeatical equation using math.js equation syntax
:::note[Parameters]

- **equation**: The equation, eg: 1+1
:::

```text
{{ math|equation:"1 + 1" }}
```
:::note[Operators]
- **Equation**: The math equation to process. Supports the following (not all inclusively):
    - **Expression Syntax:**
        - **Operators:**
            - Arithmetic: `+`, `-`, `*`, `/`, `%`, `^`
            - Unary: `+`, `-`, `!`
            - Bitwise: `&`, `|`, `~`, `^|`, `<<`, `>>`, `>>>`
            - Logical: `and`, `or`, `not`, `xor`
            - Relational: `==`, `!=`, `<`, `>`, `<=`, `>=`
            - Assignment: `=`
            - Conditional: `? :`
            - Range: `:`
            - Unit conversion: `to`, `in`
            - Implicit multiplication: e.g., `2 pi`, `(1+2)(3+4)`
            - Precedence: Grouping with `()`, `[]`, `{}`
        - **Functions:**
            - Called with parentheses: e.g., `sqrt(25)`, `log(10000, 10)`
            - Custom function definition: e.g., `f(x) = x ^ 2`
            - Dynamic variables in functions, no closures
            - Functions as parameters: e.g., `twice(func, x) = func(func(x))`
            - Operator equivalent functions: e.g., `add(a, b)` for `a + b`
            - Associative functions with multiple arguments: e.g., `add(a, b, c, ...)`
        - **Constants and Variables:**
            - Constants: `pi`, `e`, `i`, `Infinity`, `NaN`, `null`, `phi`, ...
            - Variable naming: Start with alpha, underscore, or dollar sign; may include digits
        - **Data Types:**
            - Types: Booleans, numbers, complex numbers, units, strings, matrices, objects
            - Booleans: Convertible to numbers and strings
            - Numbers: Exponential notation, binary/octal/hex formatting
            - BigNumbers: Arbitrary precision
            - Complex numbers: Imaginary unit `i`
            - Units: Arithmetic operations, conversions
            - Strings: Enclosed by quotes, `concat` for concatenation
            - Matrices: Created with `[]`, indexed and ranged
            - Objects: Key/value pairs in `{}`
:::
