---
title: "Dynamic filters"
description: "Explore NeuralSeek's Dynamic Filters to refine document searches with precision using DQL. Learn setup, application, and examples for real-time query adjustments without altering core datasets."
---

## Overview

**What is it?**

- Dynamic Query Language (DQL) is a system for defining flexible, operator and rule-based filters that refine document results based on specific criteria. This interprets filter expressions, enabling real-time adjustments to document queries without modifying the core dataset.

**Why is it important?**

- Dynamic filters empower users to refine document searches using DQL operators. This allows for more precise queries by narrowing document results to specific groups or areas without being limited to filtering by one singular metadata property in a very rigid manner (exact matches). DQL allows you to filter by many or few facets as needed.

**How does it work?**

- NeuralSeek converts DQL into the correct query format for the connected KnowledgeBase (KB), allowing support for DQL even on KBs that do not natively support it.

---

## Setting up Dynamic Filters

To use dynamic filter capabilities within NeuralSeek, we need to configure `DQL_Pushdown` as follows:

1. Navigate to the **Configuration** tab in the **KnowledgeBase Connection** section.

   ![Configuration Knowledge Base](/img/seek/dynamic-filters/config_knowledge.png)

2. In the **Filter Field** drop-down, select the `DQL_Pushdown` option. This enables queries to include dynamic filters.

   ![DQL Pushdown](/img/seek/dynamic-filters/dql_pushdown.png)

You can now pass dynamic filter language through the filter parameters available.

:::caution[Elasticsearch and watsonx Discovery users]
Please note that due to the tokenization method that Elasticsearch uses, dynamic filters will not always work as expected on properties that are not of type `keyword`. For best results, set up your index to either have important types as `keyword` or have a duplicate nested property that is type `keyword` for use with dynamic filters.
:::

#### Applying filters in Seek

1. Navigate to the Seek tab.

2. Find the "filters" button (highlighted by the red arrow)

3. Input your DQL filter string.

![seek filters](/img/seek/dynamic-filters/seek_filters.png)

#### Applying filters in mAIstro

1. Locate the `KB Search` node in mAIstro.

2. You can now begin adding filters to query the KnowledgeBase effectively.

![KB Search Example](/img/seek/dynamic-filters/kb_search_example.png)

#### Applying filters via the API

Simply pass the regular or DQL filter string as the `filter` parameter of the Seek API call.

![api filter](/img/seek/dynamic-filters/api_filter.png)

:::tip
NeuralSeek's DQL parser is able to distinguish between numbers, booleans, and strings. It also allows for intentionally blank values.

For example: 

- `age::25` is a **number**, where `age::"25"` is a **string**.
- `available::true` is a **boolean**, where `available::"true"` is a **string**.
- `value::""` is an intentionally blank value. 
:::

---

## Query Filtering Examples

Here are some examples of how to filter the KnowledgeBase in NeuralSeek using dynamic filters, given this example document that we want to highlight using filters:

  ```json title="bubble_sort.py"
  {
    "document_id": "doc_001",
    "section_name": "Overview",
    "content": {
      "title": "NeuralSeek Use Cases Overview",
      "text": "An introductory guide to NeuralSeek use cases, focusing on application and benefits.",
      "date_created": "2023-02-15"
    },
    "author": "NeuralSeek Bot"
  }
  ```

* **Exact Match Filter**: To retrieve only documents that are exactly matched with the term `"Overview"`, apply the filter as follows. This will return documents related to 'neuralseek use cases' with "Overview" specifically in the `section_name` property.

  ```plaintext
  section_name::"Overview"
  ```

* **Delimiter and Date Comparison Filter**: To retrieve only documents that are greater or equal `"2023-01-01"`, apply the filter as follows. This will return documents in that range specifically in the `content.date_created` property.

  ```plaintext
  content.date_created >= "2023-01-01"
  ```

* **Wildcard Filter**: To retrieve documents where the `title` within `content` begins with "neu" and is followed by any characters, use the wildcard filter as shown below. This filter will return all documents with a `content.title` that starts with "neu" (e.g., "NeuralSeek," "neurobiology").

  ```plaintext
  content.title:neu*
  ```

---

## Operator reference

### Delimiter `.` (JSON hierarchy delimiter)

**Description**:  
The `.` operator is used to access fields within a nested JSON structure. It allows you to specify subfields within a field, making it easy to search within specific sections of hierarchical data.
 
`title.subsection:"AI"`

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Phrase Query `""`

**Description**:  
Placing terms within quotation marks `" "` searches for an exact phrase match within the specified field, preserving the word order. This is useful for finding specific phrases instead of individual terms. Please note that Phrase Query converts all values to strings, even in KnowledgeBases that support native data types such as numbers, booleans, or dates. 
 
`url:"neuralseek"`

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Exact Match `::`

**Description**:  
The `::` operator performs an exact match, ensuring that the field content matches the specified term or phrase exactly. It is stricter than `:` and `""`, as it does not allow partial or flexible matches.
 
`content::"AI"`  

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Not an Exact Match `::!`

**Description**:  
The `::!` operator excludes documents that exactly match a specified term or phrase. It is the negation of the `::` operator and can be useful for filtering out precise phrases.
 
`content::!"large models"`  

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Nested Grouping `()`

**Description**:  
Parentheses `()` are used to group queries, allowing for more complex expressions with combined operators. They let you control the order of operations in a query, much like in mathematical expressions.
 
`(title:"AI" | title:"ML") , content:"deep learning"`

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### OR `|`

**Description**:  
The `|` operator allows you to perform an OR operation between two or more terms. It returns documents that contain at least one of the specified terms, making it useful for broad searches.
 
`title:"AI" | title:"machine learning"` 

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### AND `,`

**Description**:  
The `,` operator performs an AND operation, requiring that both terms appear within the specified fields. This is useful when you need to find documents containing multiple specific terms.
 
`title:"AI", content:"neural networks"` 

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Numerical and Date Comparisons `>, <, >=, <=`

**Description**:  
These operators allow for numerical or date comparisons within fields. Use them to search for records within a specific range or threshold of values.
 
`publish_date>=2023-01-01`  
`revision>5, revision<10`

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
- Kendra

---

### Includes `:`

**Description**:  
The `:` operator performs a search to see if the specified field includes the given term or phrase. This is a broad match that will return results containing the specified term anywhere within the field.
 
`title:"LLMs"`  

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch

---

### Does Not Include `:!`

**Description**:  
The `:!` operator is used to exclude documents that contain a specified term within a field. It is the negation of the `:` operator and helps filter out unwanted terms.
 
`content:!"profanity"` 

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch

---

### Field Exists `:*`

**Description**:  
The `:*` operator checks if a field is present in a document, regardless of its content. It’s useful for filtering records based on the existence of specific fields.
 
`author:*`  

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch

---

### Field Does Not Exist `:*!`

**Description**:  
The `:*!` operator checks if a field is absent in a document. It’s useful for finding records missing a specific field.
 
`author:*!`  

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch

---

### Wildcard Operator `:*`

**Description**:  
The `:*` operator is used to match any value within a specified field, acting as a wildcard. This operator is helpful for locating records where a field contains any value, rather than a specific one.

`author:*` 

**Supported By**:

- Watson Discovery
- watsonx Discovery
- ElasticSearch
