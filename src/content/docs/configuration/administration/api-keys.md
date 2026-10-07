---
title: "API keys"
description: "The API Keys screen creates, scopes, expires and deletes the keys that authenticate calls to NeuralSeek; a key left unscoped has full access."
---

## What is it

An API key is the credential a program presents when it calls NeuralSeek. You manage keys on the **API Keys** screen: open **API's & Integration** in the top navigation, and **API Keys** is the first item of the side navigation. The same screen is reachable from the **Admin Tools** menu, under **API's & Integration**.

The screen lists every key the instance has, with when each was last used and when it expires. **Create ApiKey** opens the **Add API Key** dialog, where you name the key, optionally create a numbered batch, set an expiration date, and limit what the key may reach.

## Why it matters

A key is only as safe as what it can do. The **Add API Key** dialog says it plainly: "Leave everything unchecked to grant full access." A key created without a scope can reach everything, and its details show an **All access** badge. If that key leaks, whoever holds it has the run of the instance.

The screen gives you three ways to limit that risk:

- **Scope** a key to the functions, configurations, agents or API areas a caller actually needs.
- Give a key an **Expiration date**, so temporary access ends on its own.
- Watch the **Last used** column, so you can find keys nobody uses any more and remove them.

## When to use it

Create an API key when a server-side program needs to call NeuralSeek: a backend service, a script, an integration, or an AI client connecting through the [MCP Server](/integrations/mcp-server/) or the [a2a Server](/integrations/a2a-server/). Both of those screens ask you to generate an API key and use it as an authentication header value.

Create one key per caller rather than sharing one key everywhere. A separate key can be scoped to that caller, expired on its own schedule, and deleted without breaking anything else.

An API key is the wrong credential for code that runs in a browser, where anyone can read it. For a web page or a chat widget, use an embed code instead — see [Embed codes](/configuration/administration/embed-codes/).

## How it works

![The API Keys screen, with the API's & Integration side navigation and the Admin Tools menu open](/img/admin-tools/default.png)

### The API Keys list

![The API Keys list sorted by the Expires column](/img/admin-tools/sort-by-expires.png)

The toolbar above the table holds three controls:

- **Search API keys** — narrows the table to the keys that match what you type.
- **Delete all expired** — deletes, in one action, every key whose expiration date has passed. It is a deletion, not a filter: the keys are gone afterwards.
- **Create ApiKey** — opens the **Add API Key** dialog (see [Creating keys](#creating-keys--the-add-api-key-dialog)).

The table has one row per key. The **Select all API keys** checkbox in the header selects every row, and each row has its own checkbox.

Every column header is a sort button; a ▲ next to a header marks the column the list is sorted by.

| Column        | What it shows                                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**      | The key's name. Under it, **Details** expands the row (see [Key details](#key-details)).                                                                                                       |
| **Key**       | The key value, masked: asterisks, with only the last four characters readable. Use those four characters to match a key in your own configuration to its row.                                 |
| **Last used** | The date and time the key last authenticated a call.                                                                                                                                           |
| **Expires**   | The key's expiration date. A key created without one reads **No expiration**.                                                                                                                  |

<!-- UNCONFIRMED: a key that has never authenticated shows "Never" in Last used — from the route's gap list, no unused key was on screen -->

A key that has never been used shows **Never** in **Last used**. Sort by **Last used** to bring unused and long-idle keys together when you clean up.

<!-- UNCONFIRMED: the Expires cell carries Expires / Expired badges for keys with a date — from the route's gap list, no key with a date was on screen -->

For a key with a date, the **Expires** cell carries a badge: **Expires** while the date is still ahead, **Expired** once it has passed. Expired keys stay in the list until you delete them, which is what **Delete all expired** is for.

Below the table, **Items per page:** sets how many keys a page holds — `10`, `25` or `50` — next to the range of keys shown and a page selector with **Previous page** and **Next page** arrows.

### Key details

![A key's details row, showing its Created date and an All access Scope badge](/img/admin-tools/details-panel.png)

**Details** under a key's name (shown as **+ Details**, and **− Details** while open) expands a row below the key with two fields:

- **Created** — the date and time the key was created.
- **Scope** — what the key is allowed to reach. A key created with nothing checked under **Scope this API key** shows a green **All access** badge. Open **Details** on any key you did not create yourself: an **All access** badge means it is a full-access key.

### Creating keys — the Add API Key dialog

**Create ApiKey** opens the **Add API Key** dialog. The top of the dialog names the key and says how many to create:

![The Key Name field and the Keys counter in the Add API Key dialog](/img/admin-tools/create-apikey--key-name-required-and-must-be-unique.png)

- **Key Name** — required, and must be unique: the label under the field reads "Key Name — required and must be unique". Pick a name that says who or what uses the key, so the list stays readable.
- **Keys** — how many keys to create. The dialog opens at `1`. Above 1 the dialog creates a batch; as the help text says, "If greater than 1, names will be generated as name-1, name-2, etc." — a **Key Name** of billing with **Keys** set to 3 gives billing-1, billing-2 and billing-3. Use a batch when several callers of the same kind each need their own key.

<!-- UNCONFIRMED: Keys accepts 1 to 100 — from the route's gap list, the range is not shown on screen -->

A batch holds from 1 to 100 keys.

![The Expiration date field in the Add API Key dialog](/img/admin-tools/create-apikey--expiration-date-optional.png)

- **Expiration date** — optional (the label reads "Expiration date optional"). Type a date in `mm/dd/yyyy` form or pick one with the calendar button. Set one for a key that is meant to be temporary: a contractor, a proof of concept, a test integration. Leave it empty for a key that never expires; the list then shows **No expiration** for it.

Below these fields is **Scope this API key** (next section). **Save** creates the key or keys; it is greyed out while the form is empty. **Cancel** or the close button leaves the dialog without creating anything.

### Scoping a key

![The Add API Key dialog, with Scope this API key and its five collapsed groups](/img/admin-tools/create-apikey-panel.png)

**Scope this API key** decides what the new key may reach. Its help text sets the two rules:

> Optional. Leave everything unchecked to grant full access. Function scopes and API/Console API scopes are mutually exclusive.

- **Unscoped means full access.** If you check nothing, the key can reach everything and its details show **All access**. Scope every key that does not need that.
- **Function scopes and API/Console API scopes do not mix.** A key is scoped either by **Functions** or by **API** and **Console API**, not both. If a caller needs both kinds of access, create two keys.

The scopes are grouped under five collapsible headers. Each header shows a count of the items it contains; open a header to see its items and check the ones the key may use:

- **Functions**
- **Configs**
- **Agents**
- **API**
- **Console API**

<!-- UNCONFIRMED: Configs lists the instance's configurations, Agents its mAIstro agents, and API / Console API list individual endpoints as a method plus a path pattern — inferred from the group names and counts and from the route's gap list; the groups were not opened -->

**Configs** lists the configurations a key may use and **Agents** the mAIstro agents it may run, so you can allow one agent without exposing the others. **API** and **Console API** go down to single endpoints: each item is an HTTP method plus a path pattern, for a key limited to, say, one runtime endpoint of the [REST API](/integrations/rest-and-console-api/).

## FAQ

### How do I create several keys at once?

In **Add API Key**, set **Keys** to more than 1. NeuralSeek generates the names from the **Key Name** you typed: name-1, name-2, and so on.

### What happens if I don't scope a key?

It gets full access. The dialog says "Leave everything unchecked to grant full access", and the key's **Details** show an **All access** badge under **Scope**.

### Can one key have both Function scopes and API scopes?

No. The dialog states that Function scopes and API/Console API scopes are mutually exclusive. Create one key for each kind of access instead.

### Do keys expire?

Only if you set an **Expiration date** when you create them. Without one, the **Expires** column reads **No expiration**. **Delete all expired** removes every key whose date has passed.

### How do I know if a key is still in use?

The **Last used** column shows when each key last authenticated a call. Sort by it to find keys that have been idle for a long time.

### Can I use an API key in a web page?

No. Anything in browser code can be read by visitors. Use an [embed code](/configuration/administration/embed-codes/) for browser-side calls and keep API keys on your servers.
