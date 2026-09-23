---
title: "Corporate document filter"
description: "The corporate document filter sends the ids of the documents NeuralSeek found, plus the user's id, to an endpoint you run on every request — any id the endpoint does not return is blocked."
---

The corporate document filter connects NeuralSeek to a document-entitlement service you already
run. After NeuralSeek retrieves candidate documents for a question, it sends their ids to your
endpoint together with the user's id; your service answers with the ids that user is allowed to
see, and NeuralSeek drops the rest.

## What is it

**Corporate Document Filter** is one accordion of the configuration dialog in Neural Config. The
paragraph under its header states the whole contract:

> Connect NeuralSeek to an external corporate rules engine to filter allowed documentation by
> user. Each request will send the id's of the found documentation to a endpoint you set here.
> Any ID's not returned back from the corporate filter will be blocked.

The last sentence is the behaviour to plan around: the filter is **default-deny**. NeuralSeek
keeps only the ids your service returns, so a document your rules engine does not mention is
treated as not allowed rather than allowed.

The filter holds no access rules of its own — no user directory, no groups, no per-document
permissions. Those stay in the system that already owns them. What the section configures is the
shape of one outbound GET request and which KnowledgeBase field carries the document ids.

## Why it matters

A knowledgebase is usually shared by people with different entitlements. Without a per-user check,
a generated answer can quote a document its reader would never have been able to open — and
because the answer is synthesised, the leak is not obvious from a document list.

Putting the decision in your own rules engine keeps one source of truth for entitlements. Access
rules change in the system that owns them, and NeuralSeek follows on the next request, with no
second copy of the permission model to keep in sync.

The filter acts on the documents NeuralSeek has already found for the request — the screen calls
them "the found documentation" — so it narrows the retrieved set rather than editing the wording
of an answer.

Per-user document security in NeuralSeek has a second half: when the documents come from
SharePoint, the connector can carry that platform's own access control — see
[SharePoint sync](/integrations/sharepoint-sync/).

## When to use it

Use the corporate document filter when:

- entitlements differ per user and already live in an external system (an IAM service, a rules
  engine, an entitlement database), and
- every document in the knowledgebase carries a stable id in a KnowledgeBase field your service
  also knows, and
- you can serve a low-latency endpoint — the screen says each request sends the found ids, so
  plan for one call per request that retrieves documents.

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

The section is one enable control, three fields that assemble the request URL across a single
row, and one field naming the KnowledgeBase field to send.

### Where the filter is configured

![The Configuration: Default Config dialog in Neural Config with the Corporate Document Filter accordion expanded, showing the enable control, the assembled filter URL row and the Knowledgebase field to send](/img/neural-config/corporate-document-filter.png)

In Neural Config, click the **Default Config** node, then **Edit Configuration**. The dialog that
opens is titled **Configuration: Default Config** and lists its settings as accordions;
**Corporate Document Filter** is the seventh header, between **Platform Preferences** and
**Corporate Logging**. Click the header to expand it.

Everything the product says about the filter is the paragraph at the top of the section, quoted
in full under [What is it](#what-is-it). The controls below it configure the request; nothing on
the screen describes the response, so that part of the contract is between you and NeuralSeek
support (see below).

### Turning the filter on

![The Enable Corporate Filter option list, open, offering Disabled and Enabled](/img/neural-config/corporate-document-filter--options-enable-corporate-filter.png)

**Enable Corporate Filter** is the listbox at the top of the section. Its options are `Disabled`
and `Enabled`. On the instance captured for this page it reads `Disabled`, and the four text
fields below it are disabled — greyed out and not editable — while it does. Set it before filling
in the endpoint fields, or there is nothing to type into.

Enabling the filter starts sending document ids and user ids to an endpoint outside NeuralSeek on
every request, so treat it as a change to make deliberately, with the receiving service already
running.

### The request NeuralSeek builds

![The Corporate Document Filter section: Enable Corporate Filter, then the URL row — Base URL for the corporate filter (get), URL paramenter for the UserName, URL paramenter for the KB field — and Knowledgebase field to send](/img/neural-config/corporate-document-filter--enable-corporate-filter.png)

The three fields on the URL row are laid out in the order they appear in the request, with the
fixed fragments printed between them as screen text rather than as inputs:

| Field                                       | Placeholder                 | Followed on screen by                                 |
| ------------------------------------------- | --------------------------- | ----------------------------------------------------- |
| **Base URL for the corporate filter (get)** | `https://my.corpfilter.com` | `?`                                                   |
| **URL paramenter for the UserName**         | `eid`                       | `={{user_id}}&`                                       |
| **URL paramenter for the KB field**         | `docids`                    | `={{Knowledgebase field values, separated by comma}}` |

The two parameter labels are spelled `paramenter` on screen; that is the label to look for.
**URL paramenter for the UserName** names the query parameter that will carry the user id, not
the user name itself. **URL paramenter for the KB field** names the parameter that will carry the
document ids.

Read left to right with the placeholder values, the call NeuralSeek builds is:

```text
https://my.corpfilter.com?eid={{user_id}}&docids={{Knowledgebase field values, separated by comma}}
```

`{{user_id}}` and `{{Knowledgebase field values, separated by comma}}` are the screen's own
placeholders for what NeuralSeek substitutes per request: the id of the user asking, and the
comma-separated values of the field chosen below, taken from the documents it retrieved. It is a
**GET** — the base-URL label says `(get)`.

Your service replies with the subset of ids that user may see. Every id you leave out of the reply
is blocked.

<!-- UNCONFIRMED: the exact response body the endpoint must return (for example a JSON array of ids) — not stated on the Corporate Document Filter screen -->

The screen does not state the response format your endpoint must return, nor what happens when it
is slow or unreachable. Confirm both with NeuralSeek support before putting the filter in front of
a production knowledgebase; the default-deny wording implies that an empty reply blocks everything,
and this page does not go further than that.

<!-- UNCONFIRMED: behaviour when the corporate filter endpoint times out or is unreachable — not stated on screen -->

### Which KnowledgeBase field is sent

**Knowledgebase field to send** sits on its own row below the URL (the last row in the crop
above). It names the KnowledgeBase field whose values are substituted into the request — the
placeholder is `id`. Those values are what your rules engine has to recognise, so the field you
pick must hold an identifier your entitlement system stores too.

The choice is a design decision, not a formatting one. A field that is unique per document gives
you document-level control; a field shared by many documents (a source system, a folder, a
classification) gives you group-level control with a much shorter list on the wire. Which fields
your knowledgebase exposes depends on how its documents were loaded — see
[Document manager](/knowledge/document-manager/).

### Per-user document security beyond this filter

The corporate document filter is one of several mechanisms that decide what a user's answer can
draw on, and it helps to keep them apart:

- **Source-side permissions.** When documents come from SharePoint, the
  [SharePoint sync](/integrations/sharepoint-sync/) connector carries that platform's own access
  control. The corporate filter, by contrast, asks an endpoint of yours on every request,
  whatever the source.
- **Query-time narrowing.** [Dynamic filters](/seek/dynamic-filters/) restrict a search by a
  KnowledgeBase field before retrieval.
- **Relaxation of query-time filters.** Two settings on
  [Platform Preferences](/configuration/neural-config/platform-preferences/) — **Relax Filters**
  ("If no documents are found while filtering, relax the filter and try again.") and **Must Keep
  Keys (filters to never remove) separated by comma** — govern the dynamic filters. They are a
  different mechanism; nothing on the Corporate Document Filter screen ties them to this filter.

For the rest of the governance surfaces, see the [Governance overview](/governance/overview/).

## FAQ

**Who decides which documents a user may see?**

Your rules engine. NeuralSeek sends it the ids of the found documentation and takes the answer as
given: the screen says "Any ID's not returned back from the corporate filter will be blocked", so
the decision — and the default, which is to block — sits with your endpoint.

**What exactly does my endpoint receive?**

A GET request to **Base URL for the corporate filter (get)**, with two query parameters you name
yourself: **URL paramenter for the UserName** carrying `{{user_id}}`, and **URL paramenter for
the KB field** carrying the comma-separated values of the field you chose in **Knowledgebase
field to send**.

**What must my endpoint return?**

The screen only says "ID's … returned back" — the ids the user may see. The exact response format
is not documented on the screen and this page does not guess it; check with NeuralSeek support
before relying on it.

**Why are the URL fields greyed out?**

**Enable Corporate Filter** reads `Disabled`, and the four text fields are disabled while it does.
The listbox's other option is `Enabled`.

**What happens if my filter service is down?**

Not stated on screen. The default-deny wording — anything not returned is blocked — suggests that
nothing would pass, but that is an inference from the paragraph, not documented behaviour.
Confirm it with NeuralSeek support and size your service for one call per request.

**Is this the same as SharePoint permissions?**

No. SharePoint's own access control comes through the [SharePoint sync](/integrations/sharepoint-sync/)
connector and applies to documents from that source. The corporate document filter asks an
endpoint of yours on every request, for documents from any source.
