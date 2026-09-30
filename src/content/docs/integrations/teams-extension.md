---
title: "Microsoft Teams extension"
description: "The Teams Extension connects NeuralSeek to Microsoft Teams through an Azure Bot: you point the bot's messaging endpoint at NeuralSeek, save its Microsoft App ID, client secret and (for a Single Tenant bot) Tenant ID in Teams Credentials, then install the Teams app package NeuralSeek generates."
---

## What is it

The Teams Extension is the page under **API's & Integration** → **Teams Extension**, titled **Integrating with Microsoft Teams**. It connects a Microsoft Teams workspace to NeuralSeek, so people can ask questions of your knowledge base in a personal chat with a bot, or by @mentioning the bot in a channel.

The connection runs through an **Azure Bot** that you create in your own Azure tenant. NeuralSeek gives you the URL the bot delivers Teams messages to, stores the bot's credentials, and generates the Teams app package you install. In the screen's own words, the integration lets "team members to query, analyze, and share insights directly in Teams", and can "optionally route events to specialized agents for custom behaviors". The Teams Extension page itself has no control for routing events to agents — everything it offers is described below.

## Why it matters

Most questions get asked where people already work. With the bot in Teams, a user does not open a separate tool to get an answer from NeuralSeek: they message the bot, or @mention it in the channel where the conversation is already happening, and the answer comes back in Teams.

The page walks you through the whole setup in seven numbered steps and generates the two NeuralSeek-specific pieces for you — the messaging endpoint and the app package. The only values you create yourself are the Azure Bot's credentials.

## When to use it

Use the Teams Extension when your organization works in Microsoft Teams and you want NeuralSeek answers available there, either to everyone (deployed through the Teams Admin Center) or to a few testers first (sideloaded).

It is the wrong tool when:

- Your team works in Slack — use the [Slack extension](/integrations/slack-extension/) instead.
- You are building your own chat front end or calling NeuralSeek from an application — call the [REST API](/integrations/rest-and-console-api/) directly.
- You cannot create an Azure Bot resource in your Azure tenant. The bot is required; there is no Teams connection without it.

## How it works

The page is a numbered setup guide — seven steps — followed by two collapsed sections, **Teams Credentials** and **Additional Settings**, and a **Save** button at the bottom right. Steps 1 to 4 happen in Azure; you then fill in the two sections, save, and install the app package in Teams.

### Create and connect the Azure Bot (steps 1–4)

<!-- SCREENSHOT: /img/admin-tools/teams-extension.png — redact the host and instance id in the Messaging endpoint box before publishing -->

![The Teams Extension page, Integrating with Microsoft Teams: steps 1 to 5 with the Azure Portal link, the Messaging endpoint box with its copy button, the Download App Package button, and Save at the bottom right](/img/admin-tools/teams-extension.png)

Steps 1 to 4 create the bot, give you its credentials and point it at NeuralSeek.

1. **Create an Azure Bot** — go to the **Azure Portal** (the link opens portal.azure.com) and create a new Azure Bot resource. Select "Single Tenant" for the app type and create a new Microsoft App ID. Once it is created, note the **Microsoft App ID** shown on the bot's Configuration page.
2. **Get App Credentials** — on the same Configuration page, click **Manage Password** next to the App ID and create a new **Client Secret**. Copy it immediately: the screen warns "it won't be shown again". You enter the App ID and the Client Secret under **Teams Credentials** (next section) and click **Save**.
3. **Configure Messaging Endpoint** — in the Azure Bot Configuration, set the **Messaging endpoint** to the URL the page shows in its code box. It has this form:

   ```text
   https://<console host>/v1/teams/messages/<instance id>
   ```

   The URL is specific to your NeuralSeek instance. Use the **Copy to clipboard** button next to the box and paste it into Azure rather than typing it (the same copy button appears on other integration pages — see [Embed codes](/configuration/administration/embed-codes/)). This is the address Teams messages are delivered to.

4. **Enable Teams Channel** — in your Azure Bot, go to **Channels** and add **Microsoft Teams**. Accept the terms of service and click **Apply**.

### Teams Credentials

**Teams Credentials** is the first collapsed section below the setup steps. Expand it to enter the Azure Bot's credentials. It holds three fields.

![Teams Credentials: the Microsoft App ID field](/img/admin-tools/teams-credentials--microsoft-app-id.png)

**Microsoft App ID** — the App ID you noted in step 1. The help text says: "Find this on the 'Configuration' page in your Azure Bot resource". The field's placeholder shows the ID's shape, `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

![Teams Credentials: the App Password (Client Secret) field with its eye icon](/img/admin-tools/teams-credentials--app-password-client-secret.png)

**App Password (Client Secret)** — the client secret you created in step 2. The screen names two places to create it: step 2 says **Manage Password** next to the App ID on the bot's Configuration page, and the field's help text says "Create this under 'Certificates & secrets' in the App Registration". The value is hidden as you type; the eye icon (**Show password**) reveals it so you can check it before saving — it works the same way as on [SharePoint sync](/integrations/sharepoint-sync/).

![Teams Credentials: the Tenant ID (Single Tenant apps only) field and its help text](/img/admin-tools/teams-credentials--tenant-id-single-tenant-apps-only.png)

**Tenant ID (Single Tenant apps only)** — your Azure tenant's ID. Whether you fill it in depends on the app type you picked when you created the bot:

- **Single Tenant** (what step 1 tells you to select): the field is required. The help text says to find it in "Azure Active Directory > Overview > Tenant ID".
- **Multi-Tenant**: leave it empty — the help text says "Leave empty for Multi-Tenant apps."

When the three fields are filled in, click **Save** at the bottom right of the page (covered in the last section below).

### Additional Settings

**Additional Settings** is the second collapsed section. Step 7, **(Optional) Additional Settings**, points to it: "Review other settings like streaming responses and reply behavior in channels." It controls how the bot talks in a conversation — two messages and two switches.

![Additional Settings: the Text placeholder field and its help text](/img/admin-tools/additional-settings--text-placeholder.png)

**Text placeholder** — a message the bot sends while it works on an answer, so the user sees that something is happening. The help text: "Send a message to show "loading" or "thinking" when processing. An empty value disables the initial message." The field shows `_Thinking..._`. Change it to match your bot's tone or language; clear it if you do not want an interim message before each answer.

![Additional Settings: the Welcome Message box and its help text](/img/admin-tools/additional-settings--welcome-message.png)

**Welcome Message** — the message the bot sends when a user first interacts with it. The help text: "Message sent when users first interact with the bot. Supports markdown. Leave empty to disable the welcome message." The box shows "👋 Welcome! I'm your AI assistant powered by NeuralSeek. Simply send a message to get started, or @mention me in a channel." Rewrite it to tell your users what the bot knows about and how to ask; clear it to send no welcome message.

![Additional Settings expanded: Text placeholder, Welcome Message, and the Streaming Responses (Disable) and Reply to all messages in channels (@mentions Only) switches](/img/admin-tools/additional-settings-panel.png)

The two switches at the bottom of the section each show the name of their current position next to them:

| Switch                                | Positions                             | What it changes                                                                                                                      |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Streaming Responses**               | **Disable** · **Enable**              | Whether the bot streams its answers into Teams. The screen gives no help text for it.                                                 |
| **Reply to all messages in channels** | **@mentions Only** · **All Messages** | In a channel, **@mentions Only** makes the bot answer only messages that @mention it; **All Messages** makes it answer every message. |

Leave **Reply to all messages in channels** on **@mentions Only** in busy channels: with **All Messages**, the bot replies to conversations that were not meant for it. **All Messages** suits a channel set aside for asking the bot questions. The position the switches show on your page is your current setting, not a recommendation.

### Save, download the app package and deploy (steps 5–6)

![The lower half of the setup steps: Option A and Option B for deploying the app package, step 6 Test the Integration, step 7, the Teams Credentials section, and the Save button at the bottom right](/img/admin-tools/teams-credentials.png)

**Save** sits at the bottom right of the page, outside both sections. Step 2 tells you to enter the App ID and Client Secret "and click Save", and step 5 starts "After saving your credentials" — so save before you download the app package. The page does not say whether saving checks the credentials against Azure; the first real test is step 6.

Step 5, **Download & Deploy App Package**, is where NeuralSeek hands you the Teams app. Click **Download App Package** to download "the auto-generated Teams app package" — a zip file. Install it in Teams in one of two ways:

**Option A: Deploy for your organization** — for a rollout to your users.

1. Go to **Teams Admin Center** (the link opens admin.teams.microsoft.com).
2. Navigate to **Teams apps** > **Manage apps**.
3. Click **Upload new app** and select the downloaded zip.
4. Configure app policies under **Setup policies** to control access.

**Option B: Sideload for testing** — for trying the bot yourself first.

1. Open Microsoft Teams.
2. Click **Apps** in the left sidebar.
3. Click **Manage your apps** at the bottom.
4. Click **Upload an app** > **Upload a custom app**.
5. Select the downloaded zip file.

Step 6, **Test the Integration**: find your bot in Teams by searching for it in the Apps section. Start a personal chat, or @mention it in a channel, to confirm NeuralSeek responds.

## FAQ

**Do I need a Tenant ID?**
Only for a Single Tenant bot — the app type step 1 tells you to select. The **Tenant ID (Single Tenant apps only)** field says it is "Required for Single Tenant apps" and to "Leave empty for Multi-Tenant apps." You find it in "Azure Active Directory > Overview > Tenant ID".

**Where do I find the Microsoft App ID and the client secret?**
The **Microsoft App ID** is on the Configuration page of your Azure Bot resource. The client secret is created from **Manage Password** next to the App ID (step 2), or under "Certificates & secrets" in the App Registration, as the field's help text says. Copy the secret as soon as you create it — it is not shown again.

**What URL goes in the Azure Bot's Messaging endpoint?**
The one shown in step 3, **Configure Messaging Endpoint**, of the form `https://<console host>/v1/teams/messages/<instance id>`. Copy it with the **Copy to clipboard** button and paste it into the bot's **Messaging endpoint** in Azure.

**Why does the bot only answer when I @mention it in a channel?**
Because **Reply to all messages in channels** is set to **@mentions Only**. Switch it to **All Messages** in **Additional Settings** and click **Save** to have the bot answer every message in the channels it is in.

**Can I change or turn off the welcome message and the "thinking" message?**
Yes, in **Additional Settings**. Edit **Welcome Message** (Markdown is supported) or **Text placeholder**, or leave either one empty to turn it off, then click **Save**.

**How do I try the bot before rolling it out to everyone?**
Sideload it (Option B in step 5): click **Download App Package**, then in Teams go to **Apps** > **Manage your apps** > **Upload an app** > **Upload a custom app** and select the zip.
