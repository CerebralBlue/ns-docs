---
title: "SharePoint sync"
description: "The SharePoint Online Background Connector indexes SharePoint Online documents into the NeuralSeek managed KnowledgeBase or your own Elasticsearch index, configured in four steps: credentials, site collections, sync target, and schedule."
---

## What is it

SharePoint sync is the **SharePoint Online Background Connector**, a page under **API's &
Integration** (the **SharePoint** link in the side navigation). The screen introduces it this way:

> Index SharePoint Online documents, pages, and lists directly into the NeuralSeek managed
> Knowledge Base — or into an Elasticsearch index. Configure your Azure AD credentials below,
> select the site collections to crawl, and set a sync schedule. The connector runs in the
> background and keeps the KB up to date incrementally.

You configure it once through a four-step wizard — **1 · Connection & Authentication**,
**2 · Site Collections**, **3 · Sync Target** and **4 · Schedule & Controls** — and from then on
it copies SharePoint content into the index you chose, on the schedule you set.

## Why it matters

Content that lives in SharePoint changes every day. Loading it by hand means the knowledgebase is
out of date the moment someone edits a file. The connector reads the tenant with an Azure AD app
registration, runs in the background, and keeps the index current incrementally, so Seek answers
from what is in SharePoint now rather than from a snapshot someone uploaded last quarter.

It can also carry each file's SharePoint permissions onto the indexed document
(**Capture access control (slower)**, step 4). The screen says only that the permissions are
recorded, not how they are applied when a user asks a question. Filtering the documents found for
a given user through an endpoint you run is a separate feature, the
[Corporate Document Filter](/governance/corporate-document-filter/).

## When to use it

Use SharePoint sync when:

- the documents your users ask about are kept in SharePoint Online and change often enough that
  re-uploading them is a chore;
- you can register an Azure AD application with the **Sites.Read.All** permission and a client
  secret — the connector cannot authenticate without one;
- you want the content in the NeuralSeek managed KnowledgeBase, or in an Elasticsearch cluster you
  already run.

It is the wrong tool when:

- the documents are a one-off set, or come from somewhere other than SharePoint Online — load
  them through the Data Loader instead ([Loading documents](/knowledge/load/));
- you need per-user access decisions taken by your own entitlement service on every request —
  that is the [Corporate Document Filter](/governance/corporate-document-filter/).

## How it works

### The four steps at a glance

![The SharePoint Online Background Connector page: the intro, the status strip with Indexed and Errors counters, the four wizard steps with step 2 greyed out, and the Sync Now, Full Resync and Save buttons in the footer](/img/admin-tools/sharepoint.png)

Open **API's & Integration** in the top navigation, then **SharePoint** in the side navigation.
Under the intro, a status strip shows an **Indexed:** counter and an **Errors:** counter for the
connector. Below it, the wizard's four steps are accordions:

| Step                                | What you set                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| **1 · Connection & Authentication** | The Azure AD credentials that give NeuralSeek read access to your tenant.         |
| **2 · Site Collections**            | The site collections to crawl. Disabled until the step 1 credentials are entered. |
| **3 · Sync Target**                 | Where the content lands, and which template does the syncing.                     |
| **4 · Schedule & Controls**         | How often the sync runs, whether it is on, and whether permissions are recorded.  |

Step 1 is open when you arrive. The footer, always visible, holds **Sync Now**, **Full Resync**
and **Save** — see [Run and save](#run-and-save-sync-now-full-resync-save).

### Step 1 · Connection & Authentication

![Step 1 · Connection & Authentication: the Sites.Read.All instruction, the Tenant ID (Directory ID), Tenant Name, Application (Client) ID and Client Secret fields, and the Test Connection button](/img/admin-tools/sharepoint--tenant-id-directory-id.png)

The step opens with its instruction: "Register an Azure AD application with the
**Sites.Read.All** permission and create a client secret. Paste the credentials below to connect
your SharePoint Online tenant." Do the registration in Azure first, then copy four values across:

| Field                        | What to paste                                           | Placeholder on screen                  |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------- |
| **Tenant ID (Directory ID)** | The Directory (tenant) ID of your Azure AD tenant.      | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| **Tenant Name**              | Your SharePoint tenant name, without `.sharepoint.com`. | `contoso (without .sharepoint.com)`    |
| **Application (Client) ID**  | The client ID of the app registration.                  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| **Client Secret**            | The value of the client secret you created for it.      | `Client secret value`                  |

**Tenant ID (Directory ID)**, **Application (Client) ID** and **Client Secret** are masked as
you type, like passwords. Each has an eye icon, **Show password**, that reveals the value so you
can check a paste; **Tenant Name** is a plain text field.

**Test Connection** sits under the fields and carries an external-link icon. Use it once the four
values are in. The screen does not say what the test checks or how it reports the result.

### Step 2 · Site Collections

![The SharePoint page with step 3 · Sync Target open; above it, 2 · Site Collections is greyed out and cannot be opened](/img/admin-tools/3-sync-target.png)

**2 · Site Collections** is where you choose which SharePoint sites the connector crawls — the
intro asks you to "select the site collections to crawl". It stays disabled (greyed out, and it
does not expand) until the connection credentials in step 1 are entered, so fill in step 1 first.

The step holds items labelled **All Sites**, **Include All Subsites** and **Filter sites**. Their
exact behaviour is not documented here yet.

### Step 3 · Sync Target

![Step 3 · Sync Target: the Index Target dropdown showing NeuralSeek Managed KB (recommended), the Sync Template dropdown, and the Elasticsearch Node URL, ES API Key and Index Name fields greyed out](/img/admin-tools/3-sync-target--index-target.png)

The step text reads: "Choose where indexed content lands. **NeuralSeek KB** (default) feeds your
managed Knowledge Base directly — the same destination used by the Data Loader.
**Elasticsearch** indexes content into your own cluster." The Data Loader is described in
[Loading documents](/knowledge/load/).

**Index Target** has two options:

| Option                                  | What it does                                                                                  | What it needs                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **NeuralSeek Managed KB (recommended)** | The default. Synced content goes into your managed KnowledgeBase, where Seek answers from it. | Nothing more on this step.                                     |
| Elasticsearch                           | Synced content goes into an index in your own Elasticsearch cluster.                          | **Elasticsearch Node URL**, **ES API Key** and **Index Name**. |

The three Elasticsearch fields sit below the dropdowns:

- **Elasticsearch Node URL** — the address of your cluster, for example
  `https://my-es.example.com:9200` (the placeholder).
- **ES API Key** — a base64-encoded API key for the cluster; masked, with a **Show password** eye.
- **Index Name** — the index to write to; the field shows `sharepoint-content`.

While **Index Target** is `NeuralSeek Managed KB (recommended)`, those three fields are greyed out.

<!-- UNCONFIRMED: the three Elasticsearch fields become editable (and are required) when Index Target is set to Elasticsearch — inferred from the greyed-out fields; the Elasticsearch option was not shown selected -->

Choose Elasticsearch when your search stack already runs on your own cluster and you want the
SharePoint content next to it; otherwise leave the managed KnowledgeBase selected.

![The Sync Template dropdown showing ex_sharepoint_KB_sync (built-in), with its help text about the sharepointListFiles node and the esKbAddDocument and nsKbAddDocument nodes](/img/admin-tools/3-sync-target--sync-template.png)

**Sync Template** chooses the template that performs the sync. The one option shown is
`ex_sharepoint_KB_sync (built-in)`. Its help text sets the rule for any template you use:

> Template for syncing SharePoint documents. Templates must start with the "sharepointListFiles"
> node and use the add-document node matching the selected target (Elasticsearch →
> esKbAddDocument, NeuralSeek → nsKbAddDocument).

So the template and **Index Target** have to agree: a template that writes with `nsKbAddDocument`
belongs with the managed KnowledgeBase, one that writes with `esKbAddDocument` with Elasticsearch.

The built-in template describes itself as: "Downloads every file from a SharePoint drive and loads
it into the NeuralSeek managed KB." It is an NTL flow: it lists the drive's files with
`sharepointListFiles`, loops over them, keeps only files with a supported extension — `pdf`,
`doc`/`docx`, `ppt`/`pptx`, `xls`/`xlsx`, `txt`, `xml`, `htm`/`html`, `tsv`, `csv`, `json`, `eml`
and `msg` — downloads each one with `sharepointDownload`, and adds it with `nsKbAddDocument`. The
add step is where each document gets its identity and its `allowAccess` value:

```text
{{ nsKbAddDocument | text: "<< name: spFileContent, prompt: false >>" | filter: "<< name: spDriveName, prompt: false >>" | url: "<< name: loopObject.webUrl, prompt: false >>" | title: "<< name: loopObject.name, prompt: false >>" | docId: "sharepoint::drive::<< name: loopObject.id, prompt: false >>" | allowAccess: "<< name: loopObject.allowAccess, prompt: false >>" }}
```

For each file, `url` takes the file's SharePoint `webUrl`, `title` the file name, `filter` the
drive name, and `docId` the form `sharepoint::drive::<file id>`; `allowAccess` passes the file's
`allowAccess` value along with the document. The built-in template does not use
`esKbAddDocument`. Templates are NTL flows like this one — see [mAIstro](/maistro/overview/) —
and a template of your own must follow the two node rules in the help text.

### Step 4 · Schedule & Controls

![Step 4 · Schedule & Controls: the Sync Schedule dropdown showing Daily (recommended), the Enabled toggle, and the Capture access control (slower) toggle with its help text](/img/admin-tools/4-schedule-controls--sync-schedule.png)

**Sync Schedule** sets how often the background sync runs. The dropdown has four options; the
one marked `Daily (recommended)` is the screen's suggestion. The labels of the other three options
are not documented here yet.

**Enabled** is a checkbox beside **Sync Schedule**, with no help text. The screen does not say
what it switches on or off.

![The Capture access control (slower) toggle with its help text](/img/admin-tools/4-schedule-controls--capture-access-control-slower.png)

**Capture access control (slower)** decides whether SharePoint's permissions travel with the
content. Its help text reads: "Records each file's SharePoint permissions on the indexed document.
Adds one Graph call per file, so syncs take longer."

- Unchecked — documents are indexed without their SharePoint permissions, and the sync is faster.
- Checked — each indexed document records who may access the file in SharePoint, at the cost of
  one extra Microsoft Graph call per file.

Turn it on when not every user should see every synced document. Leave it off for content
everyone may read, such as a public policy library, where the extra calls buy nothing.

<!-- UNCONFIRMED: Seek filters answers per user from the permissions this toggle records, as part of the per-user document-security story with the Corporate Document Filter — from the route's gap audit; the screen only says the permissions are recorded -->

Recording permissions is one half of per-user document security. How the recorded permissions are
applied when a given user asks a question is not stated on this screen; the
[Corporate Document Filter](/governance/corporate-document-filter/) is the mechanism that filters
the documents found for each user through an endpoint you run, whatever their source.

### Run and save: Sync Now, Full Resync, Save

![Step 4 expanded above the footer, which holds Sync Now, Full Resync and Save](/img/admin-tools/4-schedule-controls-panel.png)

The footer stays at the bottom of the page whichever step is open.

**Save** stores the wizard's settings. The screen does not say what it checks before saving or
whether saving also starts a sync.

<!-- UNCONFIRMED: Sync Now runs an incremental sync immediately, without waiting for the schedule — inferred from the intro ("keeps the KB up to date incrementally") and the contrast with Full Resync; no help text on the button -->

**Sync Now** has no help text. By contrast with **Full Resync** it is the everyday choice: it runs
a sync now instead of waiting for the schedule, picking up what changed.

**Full Resync** has a tooltip: "Re-index every file from scratch — use after the destination index
was deleted or rebuilt." Use it in that situation, not routinely: every file is processed again,
and with **Capture access control (slower)** checked, every file costs its extra Graph call again
too.

## FAQ

**What Azure permission does the app registration need?**

**Sites.Read.All**, plus a client secret. The step 1 text says: "Register an Azure AD application
with the Sites.Read.All permission and create a client secret." Paste the tenant ID, tenant name,
application (client) ID and secret into **1 · Connection & Authentication**.

**Why is "2 · Site Collections" greyed out?**

It stays disabled until the connection credentials in **1 · Connection & Authentication** are
entered. Fill in the four step 1 fields first.

**Can I sync into my own Elasticsearch instead of the NeuralSeek KnowledgeBase?**

The **3 · Sync Target** step offers it: "**Elasticsearch** indexes content into your own
cluster." The step also holds **Elasticsearch Node URL**, **ES API Key** and **Index Name**
fields, which are greyed out while **Index Target** is `NeuralSeek Managed KB (recommended)`; the
Elasticsearch choice itself is not shown selected here, so how those fields behave then is not
documented yet. A template for Elasticsearch must write with `esKbAddDocument`; the built-in
`ex_sharepoint_KB_sync` writes to the managed KnowledgeBase with `nsKbAddDocument`.

**When should I use Full Resync instead of Sync Now?**

After the destination index was deleted or rebuilt. The **Full Resync** tooltip reads: "Re-index
every file from scratch — use after the destination index was deleted or rebuilt." For day-to-day
updates, the schedule and **Sync Now** are enough.

**Can SharePoint permissions follow the documents into NeuralSeek?**

Yes: turn on **Capture access control (slower)** in **4 · Schedule & Controls**. It records each
file's SharePoint permissions on the indexed document, at the cost of one Graph call per file. For
filtering what each user sees through your own entitlement service, see the
[Corporate Document Filter](/governance/corporate-document-filter/).

**Can I use my own sync template?**

The **Sync Template** help text allows it, with two rules: the template must start with the
`sharepointListFiles` node and must add documents with the node matching the target —
`nsKbAddDocument` for the NeuralSeek KnowledgeBase, `esKbAddDocument` for Elasticsearch. The
built-in template is `ex_sharepoint_KB_sync`.
