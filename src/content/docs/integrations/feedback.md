---
title: "Implementing feedback"
description: "Rate NeuralSeek answers with the thumbs-up and thumbs-down icons on the Seek tab, in watsonx Assistant or through the /rate API, and read the ratings back in Curate."
---

A rating tells you which answers your users trust and which they do not. You can rate an answer yourself while you test on the [Seek](/seek/overview/) tab, show the same rating icons to end users inside a [virtual agent](/integrations/virtual-agents/) conversation, or send a rating from your own application through the API. Every rating is tied to one answer, and you review the ratings by intent in [Curate](/seek/curation/). This page covers all three ways to rate, how to find the answer a rating belongs to, and where to read the ratings back.

## Rate an answer on the Seek tab

Use this while you tune your KnowledgeBase and configuration, to mark the answers that are right and the ones that need work.

1. On the **Seek** tab, type a question and select **Seek**.
2. When the answer appears, select the thumbs-up icon if the answer is good, or the thumbs-down icon if it is not. The two icons sit at the lower right of the **Answer** box.

![The Seek tab with an answer, the thumbs-up and thumbs-down icons at the lower right of the Answer box](/img/seek/default.png)

<!-- UNCONFIRMED: thumbs up records a score of 5 and thumbs down a score of 0; the rating is recorded against the answer's intent in Curate — old page integrations/feedback -->

A thumbs-up records a score of 5 and a thumbs-down a score of 0. The rating is recorded against the answer's intent, which is where you read it back (see [Read ratings back in Curate](#read-ratings-back-in-curate)).

## Find the answer you are rating

An application that rates answers itself needs to know which answer it is rating. On the Seek tab, the statistics table under each answer identifies it:

- **Category ID / Answer ID** shows two numbers separated by a slash. The second number is the answer ID.
- **Intent** names the intent the question was matched to, as a link to that intent in Curate.

The [Seek overview](/seek/overview/) explains the other rows of the statistics table.

![Screenshot pending: the Intent and Category ID / Answer ID rows of the Seek statistics table](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/seek/default--statistics.png — Seek tab > ask a question > crop of the statistics table rows Intent and Category ID / Answer ID. Why: shows the reader which number is the answer ID. -->

## Read ratings back in Curate

Ratings are reviewed by intent, so start from the answer you rated.

<!-- UNCONFIRMED: Curate shows the rating as stars on the expanded intent, the score is the average of all ratings, and ratings do not affect answer generation — old page integrations/feedback; no captured Curate screen shows a rating -->

1. In the answer's statistics table, select the link in the **Intent** row. Curate opens on that intent.
2. Expand the intent to see its rating.

The rating appears as stars, and the score shown is the average of all the ratings that intent's answers received. A rating is feedback for you to review. It does not change how NeuralSeek generates later answers, so act on a low rating yourself, for example by curating the answer or fixing the source content.

## Show the rating icons in watsonx Assistant

<!-- UNCONFIRMED: every Seek response through watsonx Assistant carries a rating URL at body.thumbs; the optional style parameter; an iframe height of 45 — old page integrations/feedback -->

When NeuralSeek answers through [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/), you can show the thumbs-up and thumbs-down icons under each answer so that end users rate it without leaving the conversation. The icons are embedded as an iframe that points at a rating URL NeuralSeek returns with every answer.

1. In watsonx Assistant, open the **Action** that calls NeuralSeek.
2. In the conversation step that shows the answer, open the **Assistant says** field and select the **iframe** response type.
3. Set **iframe source** to the `body.thumbs` value from the NeuralSeek step's response. To match the background of your chat window, you can append a style parameter, for example `?style=background-color%3A%23f4f4f4`.
4. Optionally, enter a **Title** for the iframe.
5. Turn **Display iframe inline** on, so the icons appear inside the conversation.
6. Set the height of the iframe to `45`, then select **Apply**.

## Rate answers from your own application

Use the API when your own front end collects feedback: the runtime API's **Seek Answer Ratings** operations rate an answer, read or delete a rating, and return an answer's average rating, as listed in [REST and Console APIs](/integrations/rest-and-console-api/).

<!-- UNCONFIRMED: a /seek response returns the answer ID, and POST /rate takes that answer ID with a score from 0 to 5 — old page integrations/feedback (its JSON example was malformed and is not reproduced) -->

To rate an answer, take the answer ID that your `/seek` call returned (the same number as the second half of **Category ID / Answer ID** on the Seek tab) and send it to `POST /rate` with a score from 0 to 5. Expand **POST /rate** on the **API** screen to see the exact request fields before you write the call.

## Troubleshooting

- **A rated answer does not appear in Curate.** Personalized answers are not displayed in Curate and are not eligible for curation or intent generation, because they may contain personal data. Ask the question again without [personalization](/seek/personalization/) to rate an answer you can review there.
- **A rating call is refused.** If your API key is scoped to specific operations, it needs `POST /rate` in its scope. Check the key's scope on the [API keys](/configuration/administration/api-keys/) screen.

## Related

- [Seek overview](/seek/overview/)
- [Answer curation](/seek/curation/)
- [REST and Console APIs](/integrations/rest-and-console-api/)
- [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/)
- [Virtual agents](/integrations/virtual-agents/)
