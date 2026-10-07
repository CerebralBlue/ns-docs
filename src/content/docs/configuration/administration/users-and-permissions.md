---
title: "Users and permissions"
description: "The Profile page shows the NeuralSeek permissions enabled for your own account, and the Users page lists every authorized user of an instance with their permissions and lets you change them with Change Permissions."
---

<!-- TODO: RBAC — revisit this page when the RBAC work ships (reviewer, 2026-10-07) -->

## What is it

NeuralSeek controls what each person can do in an instance through **permissions** — thirteen of them, such as **Seek**, **Configure** or **Run Agents**. Two account screens show them:

- **Profile** shows the permissions enabled for your own account. It is read-only.
- **Users** lists every authorized user of the instance, with the permissions each one holds, and is where you change an account's permissions.

A third screen in the same place, [Default permissions](/configuration/administration/default-permissions/), sets the baseline a new user starts from.

## Why it matters

Every permission opens a part of the product: a person with **Configure** can change how the whole instance answers, and a person with **Load** can change the content it answers from. Granting only what someone needs keeps configuration and knowledge content in the hands of the people responsible for them, and the Users page is the one place where you can see, account by account, who holds what.

## When to use it

- You want to know why a menu item or screen is not available to you — check **Profile**.
- A colleague needs access to a part of the console they cannot reach, or should lose access to one — use **Users** and **Change Permissions**.
- You are auditing who can configure or load content into an instance — read the **Permissions** column on **Users**.
- You want every future user to start with a different set of permissions — that is [Default permissions](/configuration/administration/default-permissions/), not this page.

## How it works

### Where to find Profile, Users and Default Permissions

Select the person icon (the avatar) at the top right of the console header. It is a direct link, not a menu: it opens the **Profile** page. A side navigation on the left then offers three pages:

- **Profile** — your own permissions.
- **Default Permissions** — the baseline for new users, described on [Default permissions](/configuration/administration/default-permissions/).
- **Users** — every authorized user and their permissions.

![Screenshot needed — the account side navigation with Profile, Default Permissions and Users](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/profile/default.png recropped to the side navigation (Profile / Default Permissions / Users) only — the full viewport shows the signed-in account email in the page heading -->

### Your profile and enabled capabilities

The **Profile** page opens under the eyebrow **User profile**, with your account's email address as the page heading. The page has no separate field labelled as a user ID; the identifier NeuralSeek holds for each account appears in the **ID** column of the Users page.

Below the heading, the **Access** section titled **Permissions** says "Your enabled NeuralSeek capabilities for this instance." and shows one card per permission: an icon, the permission name, a one-line description and a small coloured dot in the top-right corner. The cards and their descriptions are the same as the ones listed in [The 13 permissions](#the-13-permissions) below.

The Profile page has no buttons, inputs or toggles. You cannot change your own permissions here; someone with access to the Users page changes them.

![Screenshot needed — the Permissions card grid on the Profile page](/img/_placeholder.svg)

<!-- SCREENSHOT: /pr-profile, crop of the "Access / Permissions" section only (the card grid under the heading "Permissions"), full height so the Governance card is included — the full viewport /img/profile/default.png shows the signed-in email in the "User profile" heading -->

### The Users page

The **Users** page opens under the eyebrow **Administration** with the line "Manage authorized users and NeuralSeek access permissions for this instance." Its **Access control** section, **Authorized users**, reads "Search, review, and update permissions for users who have access to this NeuralSeek workspace."

![Screenshot needed — the Authorized users table on the Users page](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/profile/users--authorized-users.png with the Email and ID cells masked (or recaptured with a test account) — the current crop shows real account emails -->

The table has three columns, and each column header is a button:

| Column          | What it shows                                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Email**       | The account's email address.                                                                                                                                                                     |
| **ID**          | The account's identifier. It can be the same value as the email address.                                                                                                                         |
| **Permissions** | A comma-separated list of the permissions the account holds, for example `Admin, Update, Configure, Integrate, Extract, Chat, mAIstro, Load, runAgent, Seek, Curate, Logs, Governance`. |

The **Permissions** column uses the internal name `runAgent` for the permission whose card is titled **Run Agents**; every other permission appears under its card title.

The other controls on the page:

- The search box — at the top right of the table, with a magnifier icon. Use it to search the list of authorized users.
- The row checkbox — one per row, in the leftmost column. Selecting one or more rows brings up a batch-action bar above the table with a counter of the selected items.
- **Change Permissions** — in the batch-action bar. It opens the **Edit Permissions** dialog for the selected users; the dialog has **Cancel** and **Save** in its footer. Your changes apply only when you select **Save**.
- **Cancel** — in the batch-action bar, next to **Change Permissions**. It backs out of the selection without changing any permission.
- **Items per page:** — how many users the table shows at once: `10`, `25` or `50`. Next to it, a counter shows the range of rows on screen and the total number of users.
- The page-number selector — a selector for the page to show, followed by the total number of pages.
- **Previous page** / **Next page** — move through the list one page at a time. Both are disabled when every user fits on one page.

<!-- UNCONFIRMED: the fields inside the Edit Permissions dialog (one control per permission?) — the dialog was present on the Users screen but not opened -->

The Edit Permissions dialog lists the permissions you can switch on or off for the selected accounts; check it against the [13 permissions](#the-13-permissions) before you save.

### Adding a user

The Users page manages the permissions of accounts that are already on the list. It has no add or invite control: the only actions on the screen are search, row selection, **Change Permissions**, **Cancel** and the page controls. How an account first appears on the list is not shown on this screen.

When a new account does appear, it starts with the permissions set on [Default permissions](/configuration/administration/default-permissions/), a screen that describes itself as "Permissions automatically enabled for new users unless restricted." To give that person a different set:

1. Open **Users** from the account side navigation.
2. Find the account with the search box and select its row checkbox.
3. Select **Change Permissions**.
4. Adjust the permissions in the **Edit Permissions** dialog and select **Save**.

### The 13 permissions

The screen shows thirteen permission cards, in the same order on **Profile** and on **Default Permissions**. The table quotes each card's description as it appears on screen.

![Permission cards (Default Permissions screen) — Admin, Update, Configure, Integrate, Extract, Chat, mAIstro, Load, Run Agents, Seek, Curate and Logs; Governance is below the fold](/img/profile/default-permissions.png)

<!-- UNCONFIRMED: the "Console area" column is an inference from each permission's name and description; the screens give only the description -->

| Card             | In the **Permissions** column | Description on the card                              | Console area it most likely unlocks                                                                                             |
| ---------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**        | `Admin`                       | "Full administrative access across this instance."   | Instance-wide administration                                                                                                    |
| **Update**       | `Update`                      | "Modify responses, intents, and user-managed data."  | Editing answers and intents                                                                                                     |
| **Configure**    | `Configure`                   | "Manage instance configuration and settings."        | [Neural Config](/configuration/neural-config/)                                                                                  |
| **Integrate**    | `Integrate`                   | "Manage APIs, integrations, and connection settings." | [API keys](/configuration/administration/api-keys/) and integrations                                                            |
| **Extract**      | `Extract`                     | "Extract structured information from content."       | [Extract](/knowledge/extract/)                                                                                                  |
| **Chat**         | `Chat`                        | "Use the conversational chat experience."            | The chat experience                                                                                                             |
| **mAIstro**      | `mAIstro`                     | "Create, run, and manage mAIstro agents."            | [mAIstro](/maistro/overview/)                                                                                                   |
| **Load**         | `Load`                        | "Load and manage knowledge content."                 | [KnowledgeBase loading](/knowledge/load/)                                                                                       |
| **Run Agents**   | `runAgent`                    | "Run available agents and automation workflows."     | [Run Agents](/maistro/run-agents/)                                                                                              |
| **Seek**         | `Seek`                        | "Search and generate grounded answers."              | Seek                                                                                                                            |
| **Curate**       | `Curate`                      | "Review, edit, and improve generated answers."       | [Curation](/seek/curation/)                                                                                                     |
| **Logs**         | `Logs`                        | "Access operational and governance logs."            | [Logging](/governance/logging/)                                                                                                 |
| **Governance**   | `Governance`                  | "Review governance insights and controls."           | [Governance](/governance/overview/)                                                                                             |

**Admin** is the broadest card — "Full administrative access across this instance." Grant it only to the people who administer the instance.

#### Run Agents and NeuralEdit

The **Run Agents** card says only "Run available agents and automation workflows." None of the thirteen cards is named NeuralEdit, even though **NeuralEdit** has its own item in the console's top navigation, and the **Permissions** column lists no separate NeuralEdit permission.

<!-- UNCONFIRMED: the Run Agents permission also grants NeuralEdit — from the gap list of the previous stub page; no screen or help text shows it -->

Because there is no NeuralEdit permission of its own, access to [NeuralEdit](/maistro/neuraledit/overview/) is reportedly bundled with **Run Agents**: granting **Run Agents** may give that person both products.

#### Load and the Document Manager

The **Load** card says "Load and manage knowledge content." — broader than loading alone. Treat it as a permission that can change or remove what the instance answers from, not only add to it.

<!-- UNCONFIRMED: the Load permission grants the Document Manager, including deleting documents — from the gap list of the previous stub page; no screen names the Document Manager -->

**Load** reportedly also grants the [Document Manager](/knowledge/document-manager/), which can delete documents from the KnowledgeBase.

### Relationship to Default Permissions

**Default Permissions**, the second item in the account side navigation, sets the baseline: "These capabilities are granted by default for this NeuralSeek instance." A new user starts with those permissions unless restricted. The Users page is where you then depart from the baseline for one account, with **Change Permissions**.

The screens do not say whether changing the defaults also changes accounts that are already on the list, so after editing the defaults, check the **Permissions** column on **Users** for existing accounts. How to set the baseline is described on [Default permissions](/configuration/administration/default-permissions/).

## FAQ

### Who can manage users and their permissions?

Anyone who can open the **Users** page (avatar, then **Users**) sees the authorized users and can use **Change Permissions**. The **Admin** permission is described as "Full administrative access across this instance."; the screens do not state which permission is required to open the Users page itself.

### How do I see which permissions I have?

Select the avatar icon at the top right of the console header. The **Profile** page opens, and its **Permissions** section lists "Your enabled NeuralSeek capabilities for this instance."

### What can a new user do?

Whatever is enabled on [Default permissions](/configuration/administration/default-permissions/) — "Permissions automatically enabled for new users unless restricted." You can change an individual account afterwards with **Change Permissions** on the Users page.

### How do I add a user?

The Users page has no add or invite control; it manages the permissions of accounts already on the list. Once an account appears there, it holds the default permissions until you change them.

### How do I remove someone's access?

The Users page has no control to delete an account from the list. To narrow what someone can do, select their row, choose **Change Permissions**, adjust their permissions in the **Edit Permissions** dialog, and select **Save**. Whether an account with no permissions left keeps any access is not shown on the screen.

### Why does the Users table say `runAgent` when the card says Run Agents?

They are the same permission. The **Permissions** column uses the internal name `runAgent`; the card on Profile and Default Permissions shows the title **Run Agents**.
