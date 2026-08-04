---
title: "Intent categorization"
description: "Discover how NeuralSeek's Intent Categorization effortlessly organizes user input into customizable categories, enhancing efficiency and routing accuracy. Perfect for scaling within organizations."
---

**What is it?**

- NeuralSeek can automatically categorize user input and questions into categories.  These categories can be anything - products, organizations, departments, etc. Users can set up categories on the Configure Tab, by entering category names and descriptions. These will then be used to match user input into categories. User inputs that do not match any category, or that too closely match multiple categories will be placed in a default category called "Other". This default category cannot be modified. 

**Why is it important?**

- Categorization is very useful at scaling NeuralSeek within an organization.  By grouping intents into categories it can make things much easier for subject matter experts to quickly take action on their specific area of content.  Categorization can be useful even outside the context of answering user questions - for example, in routing customer questions to the correct department or live agent. Categorization can be called directly via the API.

**How does it work?**

- User input is scored and bucketed based on the category title and description, and based on intents that have been manually moved into categories (self-learning).  Once categorization is enabled, the Curate and Analytics screens will change to show groupings around categories. Categorization is not retroactive - meaning if you define a new category, we will not automatically re-run all old user input against the new categories. Users may move intents into categories manually through the Curate tab or the CSV download/edit features. The edits made will be used to train the system for future categorization events.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Absorbs the Neural Config > Intent Categorization panel
  - Category table — add, edit and delete intent categories
  - Action to take on match — Answer Generation, or hand the request to a mAIstro agent
  - Category description and auto-generate — the description is what input is matched against; the LLM can draft it
  - Category ID — the ID used to reference a category from the API
  - Delete cascade — deleting a category deletes all child categories and settings
  - These categories ARE the multi-agent routing categories; one set, two screens
  - Its test surface: Chat > Edit Configuration
-->
