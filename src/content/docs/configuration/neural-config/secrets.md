---
title: "Secrets"
description: "Secrets is the last section of the Edit Configuration dialog in Neural Config: a Name / Value store for values an agent needs but should not contain."
---

## What is it

**Secrets** is the final section of the **Edit Configuration** dialog on the Neural Config
screen, below **mAIstro Configuration**. It holds a list of named values — each row is a
**Name** and a **Value** — that belong to the configuration rather than to any one agent.

The section stores values; it does not run anything. Nothing on the screen decides which agent
may read which row, and nothing on the screen shows where a value is used. A secret is only
useful once something else refers to it by name.

## Why it matters

A credential written directly into an agent travels with that agent: it shows up in the agent
body, in anything copied from it, and in anyone's view of the agent. Moving the value into a
**Secrets** row means the agent carries the *name* of the value instead, and the value itself is
changed in one place when it rotates.

Two honest limits before you rely on it:

- The section is part of the configuration you are editing — the capture behind this page was
  taken in the **Configuration: Default Config** dialog. Whether rows are shared with other
  configurations on the same instance is not something the screen states.
- How the value is displayed once saved — masked, or in clear text to anyone with Configure
  permission — is not documented here yet. Treat a secret as visible to configuration admins
  until you have checked your own instance.

## When to use it

Use a **Secrets** row when an agent needs a value that should not be part of its text: an API
token for a service the agent calls, a shared key, an account identifier you would not paste
into a prompt.

Do not use it for these, which have their own homes:

- **A NeuralSeek API key** — the key callers use to reach *your* instance. That is
  [API keys](/configuration/administration/api-keys/), and whether those keys are visible to
  configuration admins is controlled by **Hide API Keys** on
  [Platform Preferences](/configuration/neural-config/platform-preferences/).
- **The API key of an external mAIstro marketplace** — that already has its own **Marketplace
  API key** field on
  [mAIstro Configuration](/configuration/neural-config/maistro-configuration/).
- **A value that is not sensitive.** A plain setting is easier to follow as a variable inside
  the agent than as an indirection through a store nobody can see the contents of.

## How it works

![The Edit Configuration dialog's section list; Secrets is the last section, below the ones visible here](/img/neural-config/edit-configuration.png)

Open Neural Config (`/configure`), click the **Default Config / Answer Generation** node, then
**Edit Configuration**. The dialog is a list of accordion sections; **Secrets** is the last one,
so you scroll past **mAIstro Configuration** to reach it.

### Opening the Secrets section

**Secrets** is a collapsed accordion header. Clicking it expands the section in place, the same
way every other section of the dialog behaves — the dialog stays open and the other sections
keep their state.

![Screenshot needed — the expanded Secrets section with its Name and Value columns](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/secrets-panel.png — Neural Config > Default Config node > Edit Configuration > scroll to the last section and expand Secrets. Capture the Name / Value table and the "Add a new row." control. Why: this is the only section of the dialog with no capture of its expanded state, so a reader cannot tell what the section contains. Do not type a real credential to produce the screenshot. -->

### The Name / Value table

The section is a two-column table:

| Column    | What it holds                                                       |
| --------- | ------------------------------------------------------------------- |
| **Name**  | The identifier something else uses to refer to the value.           |
| **Value** | The value itself — the token, key or string being kept out of view. |

**Add a new row.** appends an empty pair to the table. There is no per-row type, no description
field and no usage indicator: what a secret is *for* lives in whatever refers to it, not here.

Because the **Name** is the only handle on the value, name rows for the thing that consumes
them rather than for the vendor — a row called `crm_api_token` is findable a year later; one
called `key2` is not.

:::caution[Do not experiment on a shared instance]
Anything typed into **Value** is stored on the instance the dialog belongs to. There is no
"test" mode for this section — try it on an instance you own, not on a production
configuration somebody else depends on.
:::

### How an agent reads a secret

<!-- UNCONFIRMED: a mAIstro parameter declared `prompt: false` falls back to the secret of the same name — scripts/migration-map.json gaps for this route; not shown on the Secrets screen and not yet checked against the NTL reference -->

The expected pattern is that a mAIstro parameter declared with `prompt: false` — the NTL
parameter form `<< name: myToken, prompt: false >>` — falls back to the secret with the same
name when the caller supplies nothing.

<!-- UNCONFIRMED: passing the parameter explicitly at call time overrides the stored secret — scripts/migration-map.json gaps for this route -->

Passing that parameter explicitly when the agent is called is expected to override the stored
value for that run.

Neither rule is stated on this screen, so check both against the NTL reference before you build
on them: the parameter syntax itself belongs to [NTL](/maistro/ntl-overview/), not to this page.

### Saving a change

**Secrets** is edited inside the same dialog as every other section, so it is saved the same
way — with the dialog's **Save**, or sent for review with **Propose Changes**. Both are
described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
Closing the dialog without saving discards what you typed.

## FAQ

**Where do I put a credential that one of my agents needs?**

In Neural Config: click the **Default Config / Answer Generation** node, open **Edit
Configuration**, scroll to **Secrets**, and add a **Name** / **Value** row with **Add a new
row.** Save the dialog afterwards.

**How does an agent get at the value?**

By name, through a mAIstro parameter — the expected form is a parameter declared
`prompt: false`, which falls back to the secret of the same name. That rule is not shown on the
Secrets screen; confirm it against the [NTL](/maistro/ntl-overview/) reference before relying
on it.

**Can I override a secret for a single call?**

Passing the parameter explicitly when you call the agent is the intended override. This is not
evidenced on the configuration screen either — treat it as a pattern to verify, not a
guarantee.

**Is a secret the same thing as a NeuralSeek API key?**

No. A secret is a value *your agents* use to reach something else. An API key is what a caller
uses to reach *your* NeuralSeek instance; those are managed on
[API keys](/configuration/administration/api-keys/) and hidden from configuration admins by
**Hide API Keys** on [Platform Preferences](/configuration/neural-config/platform-preferences/).

**Are secret values hidden from other admins, and do they survive a backup?**

Not answered by this page. The **Secrets** section has not been observed in its expanded state,
so whether the **Value** column masks what it holds is unverified, and the configuration export
is an opaque blob that cannot be inspected to see whether secrets are inside it. **Hide API
Keys** on Platform Preferences speaks only about platform API keys, not about this store.

**Does a self-hosted install behave the same way?**

Unverified. Everything above was observed on a SaaS instance; whether an on-prem deployment
stores or surfaces secrets differently is not covered here yet.
