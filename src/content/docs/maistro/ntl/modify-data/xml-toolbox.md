---
title: "XML Toolbox"
description: "Turn XML into JSON"
---

## XML to JSON 


Turn XML into JSON

    

```text
{{ XMLtoJSON }}
```

<details>
<summary>Example Usage</summary>

Here’s how to convert XML data into JSON using some sample XML:
```text
<library>
  <book>
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <genre>Fiction</genre>
  </book>
  <book>
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
    <genre>Fiction</genre>
  </book>
</library>=>{{ XMLtoJSON }}=>{{ variable | name: "jsonOutput" }}
<< name: jsonOutput, prompt: false >>
```
The result will be in JSON format and can be further processed within mAIstro:
```json
{
  "LIBRARY": {
    "BOOK": [
      {
        "TITLE": [
          "The Great Gatsby"
        ],
        "AUTHOR": [
          "F. Scott Fitzgerald"
        ],
        "YEAR": [
          "1925"
        ],
        "GENRE": [
          "Fiction"
        ]
      },
      {
        "TITLE": [
          "To Kill a Mockingbird"
        ],
        "AUTHOR": [
          "Harper Lee"
        ],
        "YEAR": [
          "1960"
        ],
        "GENRE": [
          "Fiction"
        ]
      }
    ]
  }
}
```

</details>

---


## JSON to XML 


Turn JSON to XML

    

```text
{{ JSONtoXML }}
```

<details>
<summary>Example Usage</summary>

Here’s how to convert JSON data into XML using some sample JSON:
```text
{
  "library": {
    "book": [
      {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "year": "1925",
        "genre": "Fiction"
      },
      {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "year": "1960",
        "genre": "Fiction"
      }
    ]
  }
}=>{{ JSONtoXML }}=>{{ variable | name: "xmlOutput" }}
<< name: xmlOutput, prompt: false >>
```
The resulting XML will follow the same structure as the original JSON.
```xml
<library>
  <book>
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <genre>Fiction</genre>
  </book>
  <book>
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
    <genre>Fiction</genre>
  </book>
</library>
```

</details>

:::note[Note]
Using these transformations allows for easy data format conversions within mAIstro, enabling smooth data handling across applications. Make sure that the input format aligns with expected syntax to avoid conversion errors.
:::
