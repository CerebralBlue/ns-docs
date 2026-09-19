---
title: "Corporate document filter"
description: "The corporate document filter asks an external rules engine, on every request, which of the retrieved documents a user is allowed to see — anything the engine does not return is blocked."
---

The corporate document filter connects NeuralSeek to a document-entitlement service you already
run. After NeuralSeek retrieves candidate documents for a question, it sends their ids to your
endpoint together with the user's id; your service answers with the ids that user is allowed to
see, and NeuralSeek drops the rest.

## What is it

**Corporate Document Filter** is a section of the Edit Configuration dialog in Neural Config
(**Default Config** → **Edit Configuration** → **Corporate Document Filter**). The screen states
the contract in full:

> Connect NeuralSeek to an external corporate rules engine to filter allowed documentation by
> user. Each request will send the id's of the found documentation to a endpoint you set here.
> Any ID's not returned back from the corporate filter will be blocked.

The last sentence is the behaviour to plan around: the filter is **default-deny**. NeuralSeek
keeps only the ids your service returns, so a document your rules engine does not mention is
treated as not allowed rather than allowed.

The filter does not hold any access rules of its own. It has no user directory, no groups and no
per-document permissions — those stay in the system that already owns them. What the section
configures is the shape of one outbound GET request and which KnowledgeBase field carries the
document ids.

## Why it matters

A knowledgebase is usually shared by people with different entitlements. Without a per-user check,
a generated answer can quote a document its reader would never have been able to open — and
because the answer is synthesised, the leak is not obvious from a document list.

Putting the decision in your own rules engine keeps one source of truth for entitlements. Access
rules change in the system that owns them, and NeuralSeek follows on the next request, with no
second copy of the permission model to keep in sync.

The filter operates on the documents NeuralSeek has already found for the request — the screen
calls them "the found documentation" — so it narrows the retrieved set itself rather than editing
the wording of an answer.

Per-user document security in NeuralSeek has a second half: when the documents come from
SharePoint, the connector can carry that platform's own access control —
see [SharePoint sync](/integrations/sharepoint-sync/).

## When to use it

Use the corporate document filter when:

- entitlements differ per user and already live in an external system (an IAM service, a rules
  engine, an entitlement database), and
- every document in the knowledgebase carries a stable id in a KnowledgeBase field your service
  also knows, and
- you can serve a low-latency endpoint — it is called on every request that retrieves documents.

Do not use it for:

- **Shaping a query by metadata.** Filtering retrieval by a KnowledgeBase field at query time is
  [Dynamic filters](/seek/dynamic-filters/); those narrow what is searched, while the corporate
  filter removes what was found, per user.
- **Separating populations that never share content.** If two audiences must never see each
  other's material at all, separate knowledgebases (or separate instances) are a stronger boundary
  than a call your service could fail to answer.
- **Redaction.** The filter blocks whole documents by id. Removing sensitive spans from text that
  a user is otherwise entitled to read is a [Guardrails](/governance/guardrails/overview/) matter.

## How it works

![The Corporate Document Filter section of the Edit Configuration dialog, showing the enable control and the assembled filter URL across one row](/img/neural-config/corporate-document-filter.png)

The section is one enable control, three fields that assemble the request URL across a single row,
and one field naming the KnowledgeBase field to send.

### Turning the filter on

**Enable Corporate Filter** is the listbox at the top of the section. On the instance captured for
this page it reads `Disabled`, and every field below it is disabled — greyed out and not editable
— while it is off. Set it before filling in the endpoint fields, or there is nothing to type into.

Because enabling the filter starts sending document ids and user ids to a third-party endpoint on
every request, treat it as a change to make deliberately, with the receiving service already
running.

### The request NeuralSeek builds

The three fields on the URL row are laid out in the order they appear in the request, with the
fixed fragments printed between them as screen text rather than as inputs:

| Field                                       | Placeholder                 | Followed on screen by                                 |
| ------------------------------------------- | --------------------------- | ----------------------------------------------------- |
| **Base URL for the corporate filter (get)** | `https://my.corpfilter.com` | `?`                                                   |
| **URL paramenter for the UserName**         | `eid`                       | `={{user_id}}&`                                       |
| **URL paramenter for the KB field**         | `docids`                    | `={{Knowledgebase field values, separated by comma}}` |

The label **URL paramenter for the UserName** is spelled that way on screen; it is the name of the
query parameter that will carry the user id, not the user name itself. **URL paramenter for the KB
field** names the parameter that will carry the document ids.

With the placeholder values, the call NeuralSeek would make reads:

```text
https://my.corpfilter.com?eid={{user_id}}&docids={{Knowledgebase field values, separated by comma}}
```

It is a **GET** — the base-URL label says `(get)`. At request time NeuralSeek substitutes the id
of the user making the request and the comma-separated field values of the documents it retrieved.

Your service replies with the subset of ids that user may see. Every id you leave out of the
reply is blocked.

<!-- UNCONFIRMED: the exact response body the endpoint must return (for example a JSON array of ids) — not stated on the Corporate Document Filter screen -->

The screen does not state the response format your endpoint must return, nor what happens when it
is slow or unreachable. Confirm both with NeuralSeek support before putting the filter in front of
a production knowledgebase, since the default-deny wording implies an empty or failed reply blocks
everything.

<!-- UNCONFIRMED: behaviour when the corporate filter endpoint times out or is unreachable — not stated on screen -->

### Which KnowledgeBase field is sent

**Knowledgebase field to send** sits on its own row below the URL. It names the KnowledgeBase
field whose values are substituted into the request — the placeholder is `id`. Those values are
what your rules engine has to recognise, so the field you pick must hold an identifier your
entitlement system stores too.

The choice is a design decision, not a formatting one. A field that is unique per document gives
you document-level control; a field shared by many documents (a source system, a folder, a
classification) gives you group-level control with a much shorter list on the wire.

### Related filter settings

Two settings on [Platform Preferences](/configuration/neural-config/platform-preferences/) decide
whether a filter may be dropped when a search returns nothing — **Relax Filters** and **Must Keep
Keys (filters to never remove) separated by comma**. They govern the query-time dynamic filters,
not this one, but the distinction matters when you reason about your security posture: a relaxed
filter is a recall trade-off, while an access-control filter must never be relaxed.

For the rest of the governance surfaces, see the
[Governance overview](/governance/overview/).

## FAQ

**Does NeuralSeek decide which documents a user may see?**

No. It asks your endpoint and takes the answer as given. The screen says "Any ID's not returned
back from the corporate filter will be blocked", so the decision — and the default, which is to
block — belongs to your rules engine.

**What exactly does my endpoint receive?**

A GET request to the base URL you set, with two query parameters you name yourself: one carrying
the user id (`{{user_id}}`) and one carrying the comma-separated values of the KnowledgeBase field
you chose in **Knowledgebase field to send**.

**Which KnowledgeBase field is sent?**

Whatever you put in **Knowledgebase field to send**. The placeholder on screen is `id`. Pick a
field whose values your entitlement service already recognises.

**Why are the URL fields greyed out?**

They stay disabled until **Enable Corporate Filter** is switched on. On a fresh instance that
control reads `Disabled`, so the whole row below it is read-only.

**Does this replace dynamic filters?**

No, and they solve different problems. [Dynamic filters](/seek/dynamic-filters/) shape the query —
they decide what NeuralSeek searches. The corporate document filter runs on the results, per user,
after retrieval. A deployment can use both.

**Does the filter run on every request?**

The screen says each request sends the ids of the found documentation to your endpoint, so plan
for one call per request that retrieves documents and size your service accordingly.
