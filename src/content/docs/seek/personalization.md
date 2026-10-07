---
title: "Personalization"
description: "Personalization tailors a Seek answer to the customer asking — their preferred name, the products they hold and other details — supplied with the question or looked up by a mAIstro Dynamic Personalization agent."
---

Personalization tailors an answer to the customer who asks the question: it can address them by
their preferred name, take into account the products they already hold, and use any other detail
you know about them. A generic answer can be correct and still unhelpful — a customer with a
brokerage account asking about fees does not want the savings-account answer. Because those
details may contain personal data, personalized answers are kept out of
[Curate](/seek/curation/).

## How personalization works

Seek passes the customer details to answer generation along with the question. The details reach
Seek in one of two ways:

- **With the question.** You type them in the **Personalize** dialog on the
  [Seek](/seek/overview/) tab to try an answer by hand, or your application sends them with each
  [Seek API](/integrations/rest-and-console-api/) call.
- **From a personalization agent.** A [mAIstro](/maistro/overview/) agent you build runs for
  each question that reaches the configuration, receives who is asking, and returns the details —
  for example by looking the customer up in your CRM by user ID. To use one, set **Enable Dynamic
  Personalization** to `Enabled` and choose the agent in **mAIstro Personalization Agent**, both in
  the **Dynamic Personalization** section of
  [Neural Config](/configuration/neural-config/#dynamic-personalization).

### Try a personalized answer in the Personalize dialog

The **Personalize** dialog is the quickest way to see what personalization does to an answer
before you wire it into an application.

![The Personalize dialog: the PII notice, the Preferred Name, Products and Additional Customer details fields, and the Clear and Save buttons](/img/seek/personalize-panel.png)

1. On the Seek tab, select **Personalize** in the toolbar next to **Seek**.
2. Describe the customer:
   - **Preferred Name** — the name the answer can address the customer by, for example `Dan`.
   - **Products this customer purchased, subscribes to, or consumes (Separate by commas)** — the
     customer's products as a comma-separated list, for example
     `Savings Account, Brokerage Account`.
   - **Additional Customer details** — free text about anything else worth taking into account:
     their plan, region, or what they asked about last time.
3. Select **Save**, then type a question and select **Seek**.

<!-- UNCONFIRMED: the question asked after Save is answered with the details saved in the dialog — old page ("This can be previewed in the Seek tab") -->

The answer is generated with the details you saved. **Clear** empties the dialog's fields.

The dialog states the trade-off that comes with personalization: "Personalized answers will not
be displayed in the curate tab and are ineligible for curation and intent generation, as they may
contain PII." A personalized answer never appears in Curate, so you cannot
curate it or generate intents from it. For how NeuralSeek handles personal data, see
[PII detection](/governance/pii-detection/).

### What the personalization agent receives and returns

A personalization agent is an ordinary mAIstro agent that starts with the
`dynamicPersonalizationIn` node and ends with the `dynamicPersonalizationOut` node — the
Personalization In/Out pair listed with the other [pipeline hooks](/maistro/ntl/pipeline-hooks/).
Everything between the two is yours: a CRM lookup, a database query, an LLM step.

`dynamicPersonalizationIn` must be the first step. It gives the agent these variables:

| Variable                                 | What it holds                             |
| ---------------------------------------- | ----------------------------------------- |
| `dynamicPersonalizationIn.user`          | The user ID                               |
| `dynamicPersonalizationIn.originalQuery` | The original user query                   |
| `dynamicPersonalizationIn.sessionId`     | The session ID                            |
| `dynamicPersonalizationIn.options`       | The full options object from the API call |

`dynamicPersonalizationOut` must be the last step. It hands the details back to Seek:

```text
{{ dynamicPersonalizationOut | preferredName: "..." | forceFirstPerson: "..." | products: "..." | personalize: "..." | override: "..." }}
```

That line is the short form given in the NTL reference; the node accepts every parameter in the
table below.

| Parameter | What it sets |
| --- | --- |
| `preferredName` | The preferred name of the user. |
| `products` | The products this customer currently consumes from your company, separated by commas. |
| `additionalDetails` | Additional text about the user to pass to language generation. |
| `filter` | A filter string used to filter document queries — see [Dynamic filters](/seek/dynamic-filters/). |
| `noWelcome` | `true` when the user has already been welcomed and must not be welcomed again. Defaults to `false`. |
| `forceFirstPerson` | `true` to use a first-person speaking style even when no preferred name is set. Defaults to `false`. |
| `personalize` | A full personalization JSON object (Seek's `options.personalize`) that overrides personalization. |
| `override` | Override data for the whole request payload. Use with care: it replaces the payload. |

`preferredName`, `products` and `additionalDetails` carry the same three details as the
Personalize dialog's fields.

### Pass personalization details from your application

In production, your application sends the customer details with each Seek call, in the
`personalize` object of the request's `options` — the same object a personalization agent can
replace with its `personalize` parameter. The Seek API itself is documented on
[REST & Console APIs](/integrations/rest-and-console-api/).

## When to use it

- **The right answer depends on who asks.** Plans, entitlements, products held or region change
  what a correct answer is, and a generic answer sends the customer looking further.
- **You already know the customer.** Your application holds their details, or a CRM can return
  them from the user ID — pass them with the call, or let a personalization agent fetch them.
- **You want a warmer conversation.** Addressing the customer by name and not re-welcoming them
  on every turn (`noWelcome`) makes an assistant feel less like a search box.

Personalization is the wrong tool when:

- **You only need to restrict which documents are searched.** Use
  [Dynamic filters](/seek/dynamic-filters/) — or return a `filter` from your personalization agent
  when the filter depends on the customer.
- **You want to curate the answer or build intents from it.** Personalized answers never reach
  Curate. Questions every customer asks the same way are better left unpersonalized and curated.

## FAQ

**Why doesn't a personalized answer show up in Curate?**
Personalized answers may contain personal data, so they are not displayed in the Curate tab and
are ineligible for curation and intent generation.

**What is the difference between the Personalize dialog and a personalization agent?**
The dialog supplies the details for the questions you type on the Seek tab, to see the effect by
hand. A personalization agent, selected in **mAIstro Personalization Agent**, supplies them for
every question that reaches the configuration, from whatever source it reads.

**Can a personalization agent limit which documents are searched?**
Yes. `dynamicPersonalizationOut` takes a `filter` parameter, the filter string used to filter
document queries, so the documents searched can depend on the customer. See
[Dynamic filters](/seek/dynamic-filters/).

**What should I put in Additional Customer details?**
Anything about the customer that the answer should take into account and that is not a name or a
product: their plan, region, or recent history. It is free text passed to answer generation.

## Related

- [Seek](/seek/overview/)
- [Neural Config](/configuration/neural-config/)
- [Answer curation](/seek/curation/)
- [PII detection](/governance/pii-detection/)
- [Dynamic filters](/seek/dynamic-filters/)
- [mAIstro overview](/maistro/overview/)
- [Pipeline hooks](/maistro/ntl/pipeline-hooks/)
- [REST & Console APIs](/integrations/rest-and-console-api/)
