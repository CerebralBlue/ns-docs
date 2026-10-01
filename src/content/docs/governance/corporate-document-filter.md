---
title: "Corporate document filter"
description: "The corporate document filter sends the ids of the documents NeuralSeek found, plus the id of the user asking, to an endpoint you run on every request, and blocks any document whose id the endpoint does not return."
---

The corporate document filter connects NeuralSeek to an entitlement service you already run, so
that each user's answers draw only on documents that user is allowed to see. For every request,
NeuralSeek sends the ids of the documents it found and the id of the user asking to your endpoint;
your service replies with the ids that user may see, and NeuralSeek blocks the rest. It is for
admins whose access rules live outside NeuralSeek and must stay there.

## How the corporate document filter works

Access rules stay in the system that owns them. What you configure is the shape of one outbound
GET request and the KnowledgeBase field that identifies each document in it.

The section's own description states the contract:

> Connect NeuralSeek to an external corporate rules engine to filter allowed documentation by
> user. Each request will send the id's of the found documentation to a endpoint you set here.
> Any ID's not returned back from the corporate filter will be blocked.

The last sentence is the behaviour to plan around: the filter blocks by default. A document your
rules engine does not return is treated as not allowed, not as allowed. And because the filter acts
on "the found documentation", it narrows the set of documents an answer can use; it does not edit
the wording of an answer.

### Where the filter is configured

![The Configuration: Default Config dialog with its sections listed and Corporate Document Filter expanded below Platform Preferences](/img/neural-config/corporate-document-filter.png)

The filter is a section of the configuration dialog in [Neural Config](/configuration/overview/).

1. Open **Neural Config** and select the **Default Config / Answer Generation** node.
2. Select **Edit Configuration**. The dialog `Configuration: Default Config` opens with its
   settings listed as sections.
3. Expand **Corporate Document Filter**, the section between
   [Platform Preferences](/configuration/neural-config/platform-preferences/) and
   [Corporate Logging](/governance/logging/).
4. Set the fields described below, then select **Save** or **Propose Changes** at the bottom of the
   dialog. [Using the Neural Config page](/configuration/neural-config/using-this-page/) explains
   the difference.

The **Corporate Document Filter** section is also listed in the configuration dialog of a
category; [Configuration overview](/configuration/overview/) explains how category configurations
relate to the default one.

### Turning the filter on

![The Enable Corporate Filter option list, open, offering Disabled and Enabled](/img/neural-config/corporate-document-filter--options-enable-corporate-filter.png)

**Enable Corporate Filter** switches the filter on or off. It has two options:

- `Disabled` — no request goes to your endpoint. The four text fields of the section are disabled
  (greyed out and not editable) while this option is selected.
- `Enabled` — NeuralSeek calls your endpoint on each request and keeps only the documents it
  returns.

Select `Enabled` before you fill in the request fields; while the filter reads `Disabled` there is
nothing to type into. Make the change deliberately and with the receiving service already running:
from then on, every request sends document ids and a user id to a service outside NeuralSeek, and
any document that service does not return is blocked.

### The request NeuralSeek builds

![The Corporate Document Filter fields: Base URL for the corporate filter (get), URL paramenter for the UserName and URL paramenter for the KB field on one row with the fixed text between them, and Knowledgebase field to send below](/img/neural-config/corporate-document-filter--enable-corporate-filter.png)

The first three fields sit on one row in the order they appear in the request URL, with fixed text
printed between them. The greyed values inside the fields are examples (placeholders), not
defaults.

| Field                                       | Example in the field        | What it sets                                     | Followed on screen by                                 |
| ------------------------------------------- | --------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| **Base URL for the corporate filter (get)** | `https://my.corpfilter.com` | The endpoint NeuralSeek calls, with a GET        | `?`                                                   |
| **URL paramenter for the UserName**         | `eid`                       | The name of the query parameter for the user id  | `={{user_id}}&`                                       |
| **URL paramenter for the KB field**         | `docids`                    | The name of the query parameter for document ids | `={{Knowledgebase field values, separated by comma}}` |

The two parameter labels are spelled `paramenter` on screen. Both fields take a parameter **name**:
**URL paramenter for the UserName** names the parameter that carries the user's id, not the user
name itself, and **URL paramenter for the KB field** names the parameter that carries the document
ids. Pick names your endpoint already expects.

Read left to right with the example values, the row builds this request:

```text
https://my.corpfilter.com?eid={{user_id}}&docids={{Knowledgebase field values, separated by comma}}
```

NeuralSeek fills `{{user_id}}` with the id of the user asking, and
`{{Knowledgebase field values, separated by comma}}` with the values of one KnowledgeBase field,
taken from each document it found.

**Knowledgebase field to send**, on its own row below, names that field; the example in the field is
`id`. Its values are what your rules engine has to recognise, so the field must hold an identifier
your entitlement system stores too. The choice also sets how fine-grained the decision is: a field
that is unique per document gives document-level control, while a field shared by many documents,
such as a source or a folder, gives group-level control with a shorter list in the request. Which
fields a document carries depends on how it was loaded; see
[Document manager](/knowledge/document-manager/).

### What your endpoint must return

Your service replies with the ids, out of those it received, that the user may see. Every id it
leaves out is blocked, so an empty reply blocks every document found for that request.

<!-- UNCONFIRMED: the exact response body the endpoint must return (for example a JSON array of ids) — not stated on the Corporate Document Filter screen -->
<!-- UNCONFIRMED: behaviour when the corporate filter endpoint is slow or unreachable — not stated on the Corporate Document Filter screen -->

Confirm the exact response format, and what NeuralSeek does when your endpoint is slow or does not
answer, with NeuralSeek support before you put the filter in front of a production knowledgebase.

## When to use the corporate document filter

Use the corporate document filter when all three of these hold:

- Entitlements differ per user and already live in an external system: an identity and access
  management service, a rules engine, an entitlement database.
- Every document in the knowledgebase carries a stable id, in a KnowledgeBase field, that your
  service also knows.
- You can serve a fast, available endpoint. The filter calls it on each request, and a document it
  does not return is blocked.

Putting the decision in your own rules engine keeps one source of truth for entitlements: access
changes in the system that owns it, and NeuralSeek follows on the next request, with no second
copy of the permission model to keep in sync.

It is the wrong tool for:

- **Narrowing a search by metadata.** Restricting what is searched by a KnowledgeBase field is
  [Dynamic filters](/seek/dynamic-filters/). Dynamic filters narrow what is searched; the corporate
  filter removes, per user, what was found.
- **Carrying SharePoint's own permissions.** [SharePoint sync](/integrations/sharepoint-sync/) has
  a Capture access control (slower) option that records each file's SharePoint permissions on the
  indexed document. That is the other half of per-user document security, for content from
  SharePoint; the corporate filter asks your endpoint on every request, for documents from any
  source.
- **Redaction.** The filter blocks whole documents by id. Removing sensitive text from a document a
  user is otherwise entitled to read is a job for [Guardrails](/governance/guardrails/overview/).
- **Separating audiences that never share content.** If two groups must never see each other's
  material, separate knowledgebases are a stronger boundary than a call your service could fail to
  answer.

## FAQ

**Who decides which documents a user may see?**

Your rules engine. NeuralSeek sends it the ids of the documents it found and keeps only those it
returns: "Any ID's not returned back from the corporate filter will be blocked."

**What does my endpoint receive?**

A GET request to **Base URL for the corporate filter (get)** with two query parameters you name:
the one in **URL paramenter for the UserName** carries `{{user_id}}`, the id of the user asking,
and the one in **URL paramenter for the KB field** carries the comma-separated values of the field
named in **Knowledgebase field to send**.

**Why are the URL fields greyed out?**

**Enable Corporate Filter** is set to `Disabled`, and the four text fields stay disabled until you
select `Enabled`.

**What must my endpoint return, and what happens if it is down?**

The ids the user may see; anything left out is blocked. Confirm the response format, and what
NeuralSeek does when your endpoint does not answer, with NeuralSeek support.

**Is this the same as SharePoint permissions?**

No. [SharePoint sync](/integrations/sharepoint-sync/) records SharePoint's own permissions on the
documents it indexes from SharePoint. The corporate document filter asks your endpoint on every
request, for documents from any source.

## Related

- [Neural Config sections](/configuration/neural-config/): every section of the configuration
  dialog
- [Using the Neural Config page](/configuration/neural-config/using-this-page/): saving and
  proposing changes
- [Configuration overview](/configuration/overview/): how category configurations relate to the
  default one
- [Dynamic filters](/seek/dynamic-filters/): narrow a search by a KnowledgeBase field
- [SharePoint sync](/integrations/sharepoint-sync/): SharePoint permissions on indexed documents
- [Document manager](/knowledge/document-manager/): the KnowledgeBase fields of a document
- [Corporate Logging](/governance/logging/): the next section of the dialog
- [Governance overview](/governance/overview/)
