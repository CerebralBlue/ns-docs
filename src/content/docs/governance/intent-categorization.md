---
title: "Intent categorization"
description: "Intent categorization sorts the questions that reach NeuralSeek into categories you define on the Neural Config screen; each category decides whether Seek answers a matching question or a mAIstro agent takes it, and Intent Insights reports coverage and confidence per category."
---

Intent categorization sorts every question that reaches NeuralSeek into a category you define — a product, a department, a kind of request. You create the categories on the [Neural Config](/configuration/overview/) routing tree, each with a name and a short description. The same categories do two jobs: they decide where a matching question goes (answer generation, or a [mAIstro](/maistro/overview/) agent), and they are what the Governance dashboards group your traffic by, so the owner of each area can see how their questions are doing.

## How intent categorization works

### Where categories are defined

Categories live on the Neural Config routing tree. Under the **Default Config** root, and under every category, a **Category Routing** node holds that level's categories and ends with **Add a Category**. Select **Add a Category** to open the dialog that creates one; select an existing category node to open its **Edit Category** dialog. Each category node shows its name, its action and whether it runs on the **Default Configuration** or a **Custom Configuration** of its own.

![The Add a Category dialog: the Action to take on match selector set to Answer Generation, the Category Name and Category Description fields showing their placeholders, a greyed-out Add Custom Configuration button and Save Category](/img/neural-config/add-a-category-panel.png)

Everything about the tree itself — nesting categories, giving a category its own settings with **Add Custom Configuration**, and removing one with **Delete Category** — is documented in [Configuration overview](/configuration/overview/#editing-a-category). This page explains what a category means for how questions are sorted and reported.

### Writing a description that matches the right questions

<!-- UNCONFIRMED: a question is matched to a category by the category's title and description — previous documentation ("User input is scored and bucketed based on the category title and description"); the dialog's labels ask for a name and a 2-3 sentence description -->

A category is matched to questions by its **Category Name** and its **Category Description (2-3 sentences)**. The description does most of the work, so write it as a list of the kinds of request that belong there, in the words your users would use. The product's own placeholder shows the pattern: a category named `Payroll` described as `Payroll inquiries, Tax withholding questions, benefits contributions`.

![The Category Description field with the Auto-generate description wand icon beside its label and the placeholder text "Payroll inquiries, Tax withholding questions, benefits contributions"](/img/neural-config/add-a-category--category-description-2-3-sentences.png)

To get a first draft, select the wand icon beside the label, **Auto-generate description**, then edit the result so it names the requests you actually see. Keep categories distinct: two descriptions that cover the same requests make it hard for a question to land in the right one. When a category picks up questions it should not, or misses ones it should catch, sharpen its description and watch its tab on [Intent Insights](#intent-insights-categories-in-your-traffic).

### What happens when a question matches

Categorization is also routing. Each category's **Action to take on match** decides who handles a question that falls into it:

- **Answer Generation** — Seek answers the question from your [KnowledgeBase](/knowledge/connect-a-kb/), using the category's configuration: the Default Configuration, or the category's Custom Configuration if you gave it one.
- **mAIstro-led** — the question goes to a mAIstro agent. The category's **Default Action** on the routing tree picks the agent; see [Intents and the Default Action](/configuration/overview/#intents-and-the-default-action).

![The Action to take on match selector set to Answer Generation, with the Delete Category button below it in the Edit Category dialog](/img/neural-config/account-access-answer-generation-default--action-to-take-on-match.png)

Because the categories that route questions and the categories the dashboards report on are one set, a category you add for routing shows up in Governance as well, and a category you add for reporting can also change how its questions are handled — its action, and any configuration you give it, apply to them.

<!-- UNCONFIRMED: a question that matches no category (or several too closely) goes to the default category Other, which cannot be modified — previous documentation; the Other tab and "Category: Other" rows are on screen, the rule is not -->

A question that none of your categories catches is answered under the **Default Config** root (see [the routing tree](/configuration/overview/#the-routing-tree)) and reported on the Governance screens as **Other**. You cannot edit Other; to take questions out of it, add a category that describes them.

### Category ID

Every saved category has a numeric identifier. Open the category's **Edit Category** dialog to see it, and select **Copy to clipboard** to copy it. The row reads **Category ID** on a category badged **Default Configuration** and **Category Proposal ID** on a category badged **Custom Configuration**.

![The Category ID row of the Edit Category dialog: a numeric ID in a read-only box with a Copy to clipboard icon](/img/neural-config/account-access-answer-generation-default--category-id.png)

<!-- UNCONFIRMED: the Category ID is the number other tools use to refer to a category — the numeric `category` parameter of the NTL curate node; the old map gap says "the ID used to reference a category from the API" -->

Use the ID when a tool asks for a category by number rather than by name — for example, the optional numeric `category` parameter of the NTL `curate` node. Inside a mAIstro agent you can also categorize text yourself: the `categorize` node takes the text in its `question` parameter, and the `categories` node returns the categories in the active configuration. Both are listed in [RAG tools](/maistro/ntl/rag-tools/).

```text
{{ categorize | question: "..." }}
```

For calling NeuralSeek from your own code, see the [REST and console API](/integrations/rest-and-console-api/).

### Intent Insights: categories in your traffic

**Intent Insights** shows how your Seek traffic splits across categories and how the intents inside each category score. An intent is a group of questions that ask the same thing; NeuralSeek groups incoming questions into intents as described in [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/). To open it, go to **Governance** and, in the side navigation group **Seek Governance**, select **Intent Insights** (the Governance navigation is described in the [Governance overview](/governance/overview/)).

![The Intent Insights dashboard: the Lookback Period (Days) slider from 1 to 30 at the top, a strip of category tabs each with a percentage above its name, and the Coverage (%) chart listing intents with a distribution curve for each](/img/governance/intent-insights.png)

- **Lookback Period (Days)** — the time window the dashboard covers. Drag the slider between 1 and 30 days: a short window shows the effect of a recent change, a long one shows the steady pattern.
- The category tabs — one tab per category, with a percentage above the category name. Select a tab to see that category's charts; the first tab is selected when the page opens.
- **Coverage (%)** — "Intents, sorted descending by frequency": one row per intent in the selected category, most frequent first, each drawn as a distribution curve on a 0–100 scale.
- **Confidence (%)** — the same intents in the same order, on the same 0–100 scale, for confidence. What the confidence and semantic scores mean is explained in [Semantic Insights](/governance/seek-semantic-insights/).

<!-- UNCONFIRMED: each tab's percentage is that category's share of the questions in the lookback window, and only categories with questions in the window get a tab — inferred from the screen (the percentages add up to 100; routing-tree categories without traffic had no tab) -->

The percentages across the tabs add up to 100: each one is the category's share of the questions asked in the lookback window, and a category gets a tab once questions in the window fall into it. Long intent names are shortened with "…".

Read the two charts row by row. Because the intents are sorted by how often they are asked, a weak reading near the top of a tab affects more of your users than the same reading further down — start there when you decide which content to add or which category description to sharpen.

### Where else categories show up

The category a question was sorted into follows it through the other Governance screens:

- [Seek Logs](/governance/analytics/seek-logs-and-config-insights/) shows each logged question's **Intent:** and **Category:**, so you can read the actual questions behind an Intent Insights tab.
- The **Filter** dialog on the Seek dashboards filters by **Category** and by **Intent**; see [Reading the dashboards](/governance/analytics/reading-the-dashboards/).
- The **Category Landscape** panel on the Seek [Overview dashboard](/governance/analytics/seek-overview/) shows the top categories or intents by volume.

## When to use it

- **Different areas need different handling.** When billing questions should be answered under stricter settings, or API questions should go to an agent, give them a category with its own configuration or set it to **mAIstro-led**.
- **Content owners need their own view.** A category per product or department gives each subject-matter expert a tab on Intent Insights and a filter on every Seek dashboard, so they can act on their area without reading everyone else's traffic.
- **Routing outside answer generation.** A **mAIstro-led** category hands its questions to an agent you build, so a kind of request can be processed by your own flow — for example, one that passes it to the right team — instead of receiving a generated answer.

Categories are the wrong tool for a single question that needs a fixed answer — use an intent and [curation](/seek/curation/) for that. To change how every question is answered, change the [Default Config](/configuration/overview/) settings instead of adding a category.

## FAQ

### Do categories only affect reporting?

No. The same category decides, through **Action to take on match**, whether Seek answers a question or a mAIstro agent takes it, and which configuration the answer uses.

### Why do I see questions in a category called Other?

Other holds the questions that none of your categories caught. To move them out, open the **Other** tab on Intent Insights to see which intents it holds, then add a category for the ones that deserve their own, or sharpen the description of an existing category so it covers them.

### I added a category but it has no tab on Intent Insights.

A category gets a tab once questions asked in the **Lookback Period (Days)** window fall into it. Ask a few questions the category should catch, then reopen Intent Insights; if they still land elsewhere, sharpen the category's description.

## Related

- [Configuration overview](/configuration/overview/) — the routing tree, adding and editing categories
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — saving changes on Neural Config
- [mAIstro overview](/maistro/overview/)
- [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/)
- [Reading the dashboards](/governance/analytics/reading-the-dashboards/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
- [Answer curation](/seek/curation/)
