---
title: "Transform"
description: "Generic value and format transforms: HTML/Markdown conversion, cleansing, numeric coercion, and math."
---

## HTML to Markdown

Transforms HTML that flows into the node into Markdown

---

## Markdown to HTML

Transforms Markdown that flows into the node into HTML

---

## Translate HTML

Translate a HTML document.

:::note[Parameters]

- **target**: The 2-char language code

- **additionalInstructions**: Optional - Additional instructions to the LLM
:::

---

## Clean HTML

Cleanse HTML.

:::note[Parameters]

- **selectors**: An array of CSS selectors to remove from the HTML
:::

---

## Clean Markdown

Clean markdown into plain text for content-embedding and vector generation. Strips images, links, headings, bold, backticks, tables, blockquotes, list markers, horizontal rules, footnotes, and common noise phrases. Normalizes whitespace.

---

## Force Numeric

Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array.

---

## Mathematical Calculation

Run a mathematical equation using math.js equation syntax. Supports date/time helpers: now() returns the current UTC datetime as an ISO string; addTime(isoString, value, unit) adds time to an ISO string (units: ms, s, m, h, d); today() returns today as a day-index integer; date('YYYY-MM-DD') converts a date string to the same unit. Use the math node for date arithmetic (eg: addTime(now(), 1, "h") to compute an expiry), then compare results in the condition node with DATE(<<expiry>>) > DATE(<<current>>).

:::note[Parameters]

- **equation**: The equation, eg: 1+1 or addTime(now(), 1, "h") for TTL math
:::
