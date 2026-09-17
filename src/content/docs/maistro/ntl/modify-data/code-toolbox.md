---
title: "Code Toolbox"
description: "Extract code from markdown."
---

## Extract Code 


Extract code from markdown.

    

```text
{{ extractCode }}
```

<details>
<summary>Example Usage</summary>

Here’s how to extract Python code from a LLM output:
```text
{{ LLM  | prompt: "Create a Python script to iterate over an array of 3 different fruits and print their name and characters size" | cache: "true" }}
{{ extractCode  }}=>{{ variable  | name: "extractedCode" }}
<< name: extractedCode, prompt: false >>
```

The result will be the extracted code. In this case it would be Python:
```python
# Define an array of fruits
fruits = ["apple", "banana", "cherry"]
# Iterate over the array
for fruit in fruits:
    # Get the length of the fruit name
    length = len(fruit)
    # Print the fruit name and its character size
    print(f"Fruit: {fruit}, Characters: {length}")
```

</details>

---


## Clean HTML 


Cleanse HTML.
:::note[Parameters]

- **selectors**: An array of CSS selectors to remove from the HTML
:::

```text
{{ cleanHTML }}
```

<details>
<summary>Example Usage</summary>

Here’s how to convert extract HTML code from a LLM output:
```text
<html>
<head>
    <title>Sample HTML</title>
</head>
<body>
    <div class="header">
        <h1>Welcome to the Sample Page</h1>
    </div>
    <div class="content">
        <p>This is a sample paragraph with some <span class="highlight">highlighted text</span>.</p>
        <p>Another paragraph with <a href="https://example.com">a link</a>.</p>
    </div>
    <div class="footer">
        <p>Footer content here.</p>
    </div>
</body>
</html>
{{ cleanHTML  | selectors: "['.footer']" }}=>{{ variable  | name: "cleanedHTML" }}
<< name: cleanedHTML, prompt: false >>
```

The result will be the extracted HTML:
```html
<html>
<head>
    <title>Sample HTML</title>
</head>
<body>
    <div class="header">
        <h1>Welcome to the Sample Page</h1>
    </div>
    <div class="content">
        <p>This is a sample paragraph with some <span class="highlight">highlighted text</span>.</p>
        <p>Another paragraph with <a href="https://example.com">a link</a>.</p>
    </div>
</body>
</html>

```

</details>

---


## Clean SQL 


Cleanse SQL.
:::note[Parameters]

- **reformat**: Parse and reformat the SQL

- **onlySelect**: Only allow select statements

- **dbType**: The type of database
:::

```text
{{ cleanSQL  | reformat: "true" | onlySelect: "false" | dbType: "PostgresQL" }}
```

<details>
<summary>Example Usage</summary>

Here’s how to clean SQL:
```text
{{ LLM  | prompt: "Generate a SELECT query to count and group students by course enrollment using the students, courses, and enrollments tables. Return SQL code only, without any explanations." | cache: "true" }}
{{ cleanSQL  | reformat: "true" | onlySelect: "true" | dbType: "PostgresQL" }}=>{{ variable  | name: "cleanedSQL" }}
<< name: cleanedSQL, prompt: false >>

```

The result will be the extracted and formatted SQL:
```sql
SELECT "c".course_name, COUNT("e".student_id) AS "student_count" FROM "courses" AS "c" INNER JOIN "enrollments" AS "e" ON "c".course_id = "e".course_id GROUP BY "c".course_name    
```

</details>
