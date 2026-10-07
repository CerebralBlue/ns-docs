---
title: "Default permissions"
description: "Default Permissions, opened from the avatar menu, lists the permissions NeuralSeek automatically enables for every new user of an instance, and its Update Default Permissions button is where an administrator changes that baseline."
---

## What is it

**Default Permissions** is the screen that sets the baseline access for people who join your NeuralSeek instance. In the screen's own words, these are "Permissions automatically enabled for new users unless restricted."

The screen lists every permission in that baseline as a card — **Admin**, **Update**, **Configure**, **Integrate**, **Extract**, **Chat**, **mAIstro**, **Load**, **Run Agents**, **Seek**, **Curate**, **Logs** and **Governance** — and gives you one button, **Update Default Permissions**, to change the set.

## Why it matters

Every permission in the defaults is something a new user can do from their first sign-in, before an administrator has looked at their account. A generous baseline saves you from granting the same permissions one account at a time; a careless one hands every newcomer more than they need.

The **Admin** card is the clearest example. It is described as "Full administrative access across this instance." — so while **Admin** is among the defaults, every new user becomes an administrator of the instance.

## When to use it

- **Before you invite people.** Decide what a typical new user should be able to do — for example **Seek** and **Chat** for someone who only asks questions — and set the defaults to match.
- **When your team's shape changes.** If most new users are now builders rather than readers, add what they need (for example **mAIstro** or **Load**) so you do not have to grant it to each one.
- **When you want to tighten access.** Remove broad permissions such as **Admin** or **Configure** from the defaults and grant them to specific people instead.

It is the wrong tool for changing what **one** person can do. That is done per account on the Users page with **Change Permissions** — see [Users and permissions](/configuration/administration/users-and-permissions/).

## How it works

### Where to find Default Permissions

Select the avatar icon at the top right of the console header. It opens your profile, whose side navigation lists **Profile**, **Default Permissions** and **Users**. Select **Default Permissions**.

![The Default Permissions screen, selected in the side navigation: the Update Default Permissions button beside the Enabled permissions heading, and the permission cards Admin, Update, Configure, Integrate, Extract, Chat, mAIstro, Load, Run Agents, Seek, Curate and Logs, each with a green dot; the Governance card is below the fold](/img/profile/default-permissions.png)

### What the page shows

The top of the screen, labelled **Access defaults**, carries the heading **Default Permissions** and the sentence "Permissions automatically enabled for new users unless restricted."

Below it, the **Default access** section is headed **Enabled permissions** and reads "These capabilities are granted by default for this NeuralSeek instance." Under that heading is one card per permission currently granted to new users. The screen lists these thirteen:

| Card           | Description on the card                              |
| -------------- | ---------------------------------------------------- |
| **Admin**      | "Full administrative access across this instance."   |
| **Update**     | "Modify responses, intents, and user-managed data."  |
| **Configure**  | "Manage instance configuration and settings."        |
| **Integrate**  | "Manage APIs, integrations, and connection settings." |
| **Extract**    | "Extract structured information from content."       |
| **Chat**       | "Use the conversational chat experience."            |
| **mAIstro**    | "Create, run, and manage mAIstro agents."            |
| **Load**       | "Load and manage knowledge content."                 |
| **Run Agents** | "Run available agents and automation workflows."     |
| **Seek**       | "Search and generate grounded answers."              |
| **Curate**     | "Review, edit, and improve generated answers."       |
| **Logs**       | "Access operational and governance logs."            |
| **Governance** | "Review governance insights and controls."           |

What each permission unlocks in the console is explained on [Users and permissions](/configuration/administration/users-and-permissions/). On this page, each card means one thing: a new user receives this capability.

The cards are for reading, not editing — there is no switch or checkbox on them. Each card shows a green dot in its top-right corner; the screen does not label the dot. Your instance may list a different set: the grid shows what is enabled for new users on that instance, not a fixed NeuralSeek default.

### Changing the defaults

To change what new users receive:

<!-- UNCONFIRMED: the controls inside the Edit Default Permissions dialog (how each permission is picked) — the dialog exists but was closed in the capture; only its title and the Cancel / Save footer are known -->

1. Select **Update Default Permissions**, the blue button to the right of the **Enabled permissions** heading.
2. In the **Edit Default Permissions** dialog, choose the permissions new users should receive.
3. Select **Save** to apply the new defaults, or **Cancel** to close the dialog and leave the defaults as they were.

### What "default" means

The screen describes the defaults as "Permissions automatically enabled for new users unless restricted." So the defaults decide what an account has when it is **new**. "Unless restricted" means an administrator can still narrow a user's access after that — which is what **Change Permissions** on the Users page does.

<!-- UNCONFIRMED: whether changing the defaults also changes the permissions of accounts that already exist — the screen only mentions new users -->

The screen does not say whether changing the defaults also changes accounts that already exist. After changing the defaults, check existing accounts on the Users page and adjust them there if needed.

### Defaults and per-user permissions

Permissions work on two levels:

- **Default Permissions** sets the baseline every new user starts from.
- The **Users** page, next to **Default Permissions** in the same side navigation, shows each account's actual permissions in its **Permissions** column. **Change Permissions** there gives one person more or less than the baseline.

Use the defaults for what most people need, and the Users page for the exceptions. The per-user flow is on [Users and permissions](/configuration/administration/users-and-permissions/).

## FAQ

### What does a new user get when they first join my instance?

The permissions listed under **Enabled permissions** on the **Default Permissions** screen. The screen describes them as "Permissions automatically enabled for new users unless restricted."

### How do I change the defaults?

Open **Default Permissions** from the avatar icon, select **Update Default Permissions**, choose the permissions in the **Edit Default Permissions** dialog, then select **Save**. **Cancel** closes the dialog without changing anything.

### If I change the defaults, do existing users change too?

The screen describes the defaults as applying to new users and does not say whether existing accounts change. Check existing accounts on the Users page and use **Change Permissions** to adjust any that need it — see [Users and permissions](/configuration/administration/users-and-permissions/).

### Can I give one user more or fewer permissions than the default?

Yes. The defaults are only the starting point. On the Users page, **Change Permissions** sets a single account's permissions — see [Users and permissions](/configuration/administration/users-and-permissions/).

### Should new users get Admin by default?

Usually not. **Admin** is "Full administrative access across this instance.", so leaving it in the defaults makes every new user an administrator. Keep it out of the baseline and grant it to the people who run the instance.
