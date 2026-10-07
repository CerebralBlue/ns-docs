---
title: "Implementing feedback"
description: "Rate a NeuralSeek answer with the Thumbs Up / Thumbs Down icons on the Seek answer panel, read those ratings back in Curate, embed the icons in a virtual agent, and rate answers programmatically with the /rate API."
---

## What is it

Feedback is the **Thumbs Up** / **Thumbs Down** rating a user gives a generated answer. On the
Seek tab, the two thumb icons appear at the bottom-right of the Answer panel once a question has
been asked. Clicking one records a rating against the answer without changing the answer itself.

The same icons can be shown inline in a chatbot conversation, so the people using a virtual agent
can rate its answers the same way, and an answer can also be rated from the API.

![The Seek Answer panel, with the Thumbs Up and Thumbs Down icons at its bottom-right](/img/seek/default.png)

## Why it matters

Feedback is the cheapest signal you get about answer quality. A Thumbs Up or Thumbs Down is one
click for the user, it is tracked against the intent that produced the answer, and it does not
touch answer generation — so collecting it never risks changing the answers your users see. Read
back over time, those ratings tell you which intents are answering well and which need tuning.

## When to use it

Turn on and surface the thumbs when you want end users — in the Seek tab or in a virtual agent
you have embedded NeuralSeek into — to rate answers, and you want to read those ratings back to
guide curation. Use the [`/rate` API](#custom-ratings-via-the-rate-api) instead of the icons when
the rating comes from a system rather than a person, or when your front end is not NeuralSeek's
own UI.

## How it works

### Rating an answer — Thumbs Up / Thumbs Down

After a question is answered on the Seek tab, the **Thumbs Up** and **Thumbs Down** icons sit at
the bottom-right of the Answer panel. They are icon-only buttons — a raised thumb and a lowered
thumb — with no text label. A user clicks the one that matches their impression of the answer, and
that click records a rating.

<!-- UNCONFIRMED: A Thumbs Up records a score of 5 and a Thumbs Down a score of 0 — from the previous docs page; the scores are not shown on the captured Seek screen. -->

A Thumbs Up records a score of 5 and a Thumbs Down a score of 0. The rating is tied to the intent
that matched the question, which is where you read it back (see below).

The answer-rating entry point is also named on the [Seek overview](/seek/overview/), where answers
are described as things a user can rate.

### Where a rating surfaces — Curate

A rating is tracked against the intent that produced the answer — the intent shown on the Seek
statistics table's **Intent** row (captured value `Other-neuralseek`, whose link opens the Curate
tab for that intent). To read the ratings your users left, open the [Curate tab](/seek/curation/)
and find that intent.

![Screenshot needed — the Curate tab with an intent expanded to show its ratings](/img/_placeholder.svg)

<!-- SCREENSHOT: /curate — an intent row expanded to show its rating, and the Download to CSV
     toolbar button. Why: the ratings are not visible from prose alone. -->

To export the ratings, select one or more intents and use the Curate toolbar's **Download to
CSV** button (see [Bulk actions and export](/seek/curation/#bulk-actions-and-export)). The
**Rating** column holds the intent's rating and **TotalRatings** the number of ratings it has
received.

The score shown for an intent is an average of all the ratings it has received.

### Embedding the feedback icons in a virtual agent

The thumb icons can be shown inline inside a chatbot conversation, so users rate answers without
leaving the chat.

<!-- UNCONFIRMED: the watsonx Assistant iframe response type and its fields (Source URL, Title, Display iframe inline, iframe height, Apply) are carried from the previous docs page and are not re-verified against watsonx Assistant. -->
Each `/seek` response returns a `body.thumbs` value — a URL to an SVG of the two
icons — which you embed as an **iframe** response type. The steps below are for IBM
[watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/); the same URL embeds the same
way in any agent that supports an inline iframe.

![Screenshot needed — the watsonx Assistant iframe response type configured with body.thumbs as the Source URL](/img/_placeholder.svg)

<!-- SCREENSHOT: watsonx Assistant — the iframe response type editor with Source URL set to
     body.thumbs, Display iframe inline On, and iframe height 45. Why: this is a watsonx Assistant
     screen, not a NeuralSeek one, and it is not in this capture. -->

The steps below are carried from the previous docs page and are not re-verified against watsonx
Assistant in this capture:

<!-- UNCONFIRMED: the watsonx Assistant embedding steps below (Action / Assistant says, the iframe response type, Source URL, Title, Display iframe inline, iframe height, Apply) are carried from the previous docs page and are not re-verified against watsonx Assistant. -->

1. In watsonx Assistant, open an **Action** and go to the conversation step whose **Assistant
   says** response you want to add the icons to.
2. Add an **iframe** response type. <!-- UNCONFIRMED: old-page label, not re-verified against watsonx Assistant -->
3. Set the **Source URL** to the NeuralSeek step response's **`body.thumbs`** value. Optionally
   append a background-color query parameter: `?style=background-color%3A%23f4f4f4`. <!-- UNCONFIRMED: old-page labels, not re-verified against watsonx Assistant -->
4. Optionally add a **Title**. <!-- UNCONFIRMED: old-page label, not re-verified against watsonx Assistant -->
5. Turn **Display iframe inline** to **On** so the icons render inside the conversation. <!-- UNCONFIRMED: old-page label, not re-verified against watsonx Assistant -->
6. Set the **iframe height** to `45`. <!-- UNCONFIRMED: old-page label, not re-verified against watsonx Assistant -->
7. **Apply** to save the response type. <!-- UNCONFIRMED: old-page label, not re-verified against watsonx Assistant -->

### Custom ratings via the /rate API

An answer can be rated programmatically instead of by a click. A POST to `/seek` returns an answer
id — the same value shown on the Seek statistics table's **Category ID / Answer ID** row (captured
example `1790731229555`). Pass that id to the `/rate` endpoint with a `score` from `0` to `5`.

```json
{
  "answerID": "1790731229555",
  "score": "5"
}
```

The `/rate` endpoint is one of the console-API operations; see
[the REST and Console API reference](/integrations/rest-and-console-api/) for authorizing and
calling it.

## FAQ

**How does a user rate an answer?**
With the Thumbs Up or Thumbs Down icon at the bottom-right of the Answer panel on the Seek tab.
The icons appear once a question has been answered; clicking one records the rating.

**What score does a thumb record?**
A Thumbs Up records a score of 5 and a Thumbs Down a score of 0. The rating shown for an intent is
an average of all the ratings it has received. (The 5 and 0 values are carried from the previous docs
and are not shown on the current Seek screen.)

**Where can I see the ratings my users left?**
On the [Curate tab](/seek/curation/), against the intent that matched the question. Expand or
select the intent and download the CSV to read the **Rating** and **TotalRatings** columns.

**Can I add the thumbs to my own chatbot?**
Yes. Each `/seek` response returns a `body.thumbs` SVG URL that you embed as an inline iframe in a
virtual agent such as watsonx Assistant. See [Embedding the feedback icons in a virtual
agent](#embedding-the-feedback-icons-in-a-virtual-agent) for the steps.

**Can I rate an answer from the API instead of the UI?**
Yes. Take the answer id from the `/seek` response (the **Category ID / Answer ID** value) and POST
it to `/rate` with a `score` from `0` to `5`.

**Why doesn't an answer I rated appear in Curate?**
Personalized answers are not displayed in Curate and are ineligible for curation and intent
generation, because they may contain personal data. Ask the question again without
[personalization](/seek/personalization/) to rate an answer you can review there.

**Why is my rating call refused?**
If your API key is scoped to specific operations, it needs `POST /rate` in its scope. Check the
key's scope on the [API keys](/configuration/administration/api-keys/) screen.
