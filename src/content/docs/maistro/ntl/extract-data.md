---
title: "Extract Data"
description: "NeuralSeek Entity extraction."
---

## Extract Entities 


NeuralSeek Entity extraction. Define custom entities on the Extract Tab

    

```text
{{ extract }}
```

<details>
<summary>Example Usage</summary>

Input: 
```
My phone number is 555-555-5555=>{{ extract }}
```
Output: (You may see more entities than shown below - this is only an example)
```json
{
  "phone-number": [
    "555-555-5555"
  ]
}
```

</details>

---


## Extract Keywords 


Extract keywords fro input text
:::note[Parameters]

- **nouns**: Consider normal nouns as keywords
:::

```text
{{ keywords | nouns: true }}
```
<details>
<summary>Example Usage 1</summary>

```
I have 20 cats and 40 dogs
{{ keywords|nouns:true }}
```
Will yield:
```
20 cats, 40 dogs
```

</details>

<details>
<summary>Example Usage 2</summary>

```
Howard has 20 cats and 40 dogs
{{ keywords|nouns:false }}
```
Will yield:
```
Howard
```
If the `nouns: true` is used, the following below is returned:
```
Howard, 20 cats, 40 dogs
```

</details>

---


## Extract Grammar 


Extract grammar from text

    

```text
{{ grammar }}
```

<details>
<summary>Example Usage</summary>

```
Howard has 20 cats and 40 dogs. 
He took them to the vet last week.
{{ grammar  }}
```
Will yield in the environment (see the Inspector):
```
grammar.year: [2024]
grammar.context:
grammar.dates: ["last","week"]
grammar.propernouns: ["Howard"]
grammar.nouns: ["20 cats","40 dogs","vet","week"]
grammar.preps: ["He","them"]
grammar.determiners: []
```

</details>

---


## OCR 


OCR an image.
:::note[Parameters]

- **name**: The image name
:::

```text
{{ ocr  | name: "" }}
```

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Gather — collect values from a user using slots defined on the Extract tab
-->
