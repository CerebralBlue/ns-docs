---
title: "Secrets"
description: "Secrets is the last section of the Edit Configuration dialog in Neural Config: a Name / Value table for values mAIstro flows use as variables without carrying them in the agent."
---

## What is it

**Secrets** is the final section of the **Edit Configuration** dialog on the Neural Config
screen — the fourteenth accordion header, below **mAIstro Configuration**. It holds a table of
named values, one **Name** and one **Value** per row, that belong to the configuration rather
than to any one agent.

The screen describes its purpose in two sentences:

> Store secrets for use in mAIstro flows to protect sensitive data from view. Secrets you set
> here will be available as variables in mAIstro.

The section stores values; it does not run anything, and nothing on the screen says which agent
may read which row or where a row is used. A secret is only useful once a mAIstro flow refers to
it by name.

## Why it matters

A credential written directly into an agent travels with that agent: it shows up in the agent
body, in anything copied from it, and in anyone's view of the agent. Moving the value into a
**Secrets** row means the agent carries the _name_ of the value instead, and the value itself
is changed in one place when it rotates.

Two honest limits before you rely on it:

- The section belongs to the configuration you are editing — the capture behind this page was
  taken in the **Configuration: Default Config** dialog. Whether rows are shared with a
  category's custom configuration on the same instance is not something the screen states.
- How the **Value** is displayed once saved — masked, or in clear text to anyone who can open
  the dialog — could not be observed: the table on the instance captured here was empty. Treat
  a secret as visible to configuration admins until you have checked your own instance.

## When to use it

Use a **Secrets** row when a mAIstro flow needs a value that should not be part of its text: an
API token for a service the flow calls, a shared key, an account identifier you would not paste
into a prompt.

Do not use it for these, which have their own homes:

- **A NeuralSeek API key** — the key callers use to reach _your_ instance. That is
  [API keys](/configuration/administration/api-keys/), and whether those keys stay visible to
  configuration admins is governed by **Hide API Keys** on
  [Platform Preferences](/configuration/neural-config/platform-preferences/).
- **The API key of an external mAIstro marketplace** — that has its own **API Key** column on
  [mAIstro Configuration](/configuration/neural-config/maistro-configuration/).
- **A value that is not sensitive.** A plain setting is easier to follow as an ordinary
  variable inside the agent than as an indirection through a store whose contents the agent's
  reader cannot see.

## How it works

![The Edit Configuration dialog scrolled to the bottom: Secrets is the last accordion header, expanded, below mAIstro Configuration](/img/neural-config/secrets.png)

Open Neural Config (`/configure`), click the **Default Config / Answer Generation** node, then
**Edit Configuration**. The dialog is a list of accordion sections; **Secrets** is the last
one, so you scroll past **mAIstro Configuration** to reach it.

### The Secrets section

**Secrets** is an accordion header. Clicking it expands the section in place, the same way every
other section of the dialog behaves — the dialog stays open and the other sections keep their
state.

![The expanded Secrets section: the two help sentences, the Name and Value column headers, and the add button in the empty row](/img/neural-config/secrets--be-sure-to-escape-any-double-quotes-in-y.png)

Under the header are two lines of help text and the table. The first line is the purpose
statement quoted above; the second is the only formatting rule the screen gives:

> Be sure to escape any double quotes in your Value with a backslash.

So a value such as `{"token":"abc"}` is entered as `{\"token\":\"abc\"}`. The screen says
nothing about other characters.

### The Name / Value table

![The Secrets table alone: Name and Value column headers, one empty body row, and the add button in its third cell](/img/neural-config/secrets-panel.png)

The table has three columns — **Name**, **Value**, and a third column with no heading, which
holds the row's action button.

| Column    | What it holds                                                        |
| --------- | -------------------------------------------------------------------- |
| **Name**  | The identifier a mAIstro flow uses to refer to the value.            |
| **Value** | The value itself — the token, key or string being kept out of view.  |

**Adding a secret.** The last row's third cell holds a button whose tooltip reads
**Add a new row.**; it appends an empty **Name** / **Value** pair for you to fill in. The same
tooltip text appears on the Regular Expression / Replacement table of
[Answer Engineering & Preferences](/seek/tuning/) — that is a separate button on a separate
table.

**Editing and removing a secret.** On the instance captured for this page the table was empty
— one header row and one body row holding only the add button — so no per-row edit or remove
control was visible. Expect to change a saved row by editing its **Name** or **Value** in place
and to remove one with a control in the unnamed third column, but this page cannot yet show
either.

There is no per-row type, no description field and no usage indicator: what a secret is _for_
lives in the flow that refers to it, not here. Because the **Name** is the only handle on the
value, name rows for the thing that consumes them rather than for the vendor — a row called
`crm_api_token` is findable a year later; one called `key2` is not.

:::caution[Do not experiment on a shared instance]
Anything typed into **Value** is stored on the instance the dialog belongs to once you save.
There is no test mode for this section — try it on an instance you own, not on a production
configuration somebody else depends on.
:::

### How an agent reads a secret

The Secrets screen says only that the values "will be available as variables in mAIstro". The
consumer side is documented with mAIstro, not here.

<!-- UNCONFIRMED: the mAIstro visual builder has a hover menu "Secrets" that lists the variables defined as secrets in the configure tab — from the old prose on /maistro/overview/, not observed in this capture -->

The [mAIstro overview](/maistro/overview/) describes a **Secrets** entry in the visual
builder's hover menus that lists the secrets defined on this screen, so a flow can insert one
without retyping it.

Two rules that circulate about secrets are **not** stated on this screen, and the NTL reference
does not state them either. The runner searched the `ntl://reference` resource for "secret" and
"prompt: false": every "secret" hit is an unrelated connector credential parameter (`s3Secret`,
`azBlobSecret`, `sharepointClientSecret`), and the only `prompt: false` line is the generic
syntax row for input variables:

```text
| Use variable | `<< name: x >>` | Use `prompt: false` for internal refs |
```

<!-- UNCONFIRMED: a mAIstro parameter declared `prompt: false` falls back to the secret of the same name, and passing the parameter explicitly at call time overrides the stored value — scripts/migration-map.json gaps for this route; absent from the Secrets screen and from ntl://reference (probe p31) -->

The expected pattern — a parameter declared `<< name: myToken, prompt: false >>` falling back
to the secret named `myToken` when the caller supplies nothing, and an explicitly passed
parameter overriding the stored value for that run — is therefore unverified. Check it against
[NTL](/maistro/ntl-overview/) on your own instance before you build on it.

### Saving

**Secrets** is edited inside the same dialog as every other section, so it is committed the
same way — with the dialog's **Save**, or sent for review with **Propose Changes**. Both are
described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
Closing the dialog without saving discards what you typed.

## FAQ

**Where do I put a credential that one of my agents needs?**

In Neural Config: click the **Default Config / Answer Generation** node, open **Edit
Configuration**, scroll to **Secrets**, click the button with the tooltip **Add a new row.**,
fill in **Name** and **Value**, then **Save** the dialog.

**How does an agent get at the value?**

The screen says secrets "will be available as variables in mAIstro". The exact syntax belongs
to the [NTL](/maistro/ntl-overview/) side; the `prompt: false` fallback often described for it
is not confirmed on this screen or in the NTL reference, so verify it on your instance.

**My value contains double quotes — what do I do?**

Follow the on-screen rule: "Be sure to escape any double quotes in your Value with a
backslash." Write `\"` for every `"` in the value.

**Is a secret the same thing as a NeuralSeek API key or a marketplace key?**

No. A secret is a value _your flows_ use to reach something else. A NeuralSeek API key is what
a caller uses to reach _your_ instance and is managed on
[API keys](/configuration/administration/api-keys/); an external marketplace's key goes in
the **API Key** column of
[mAIstro Configuration](/configuration/neural-config/maistro-configuration/).

**Are secret values hidden from other admins?**

Not observed. The table on the captured instance was empty, so whether the **Value** column
masks a saved value is unverified, and nothing on the screen says. **Hide API Keys** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) speaks only about
the API keys of connected platforms, not about this store.

**Does a self-hosted install behave the same way?**

<!-- UNCONFIRMED: secrets behave differently on on-prem installs — scripts/migration-map.json gaps for this route; nothing on screen and no probe backs it -->

Unverified. Everything above was observed on a SaaS instance; the route's gap list notes that
secrets behave differently on on-prem installs, but nothing captured here shows how.
