---
title: "Slack extension"
description: "The Slack Extension connects a Slack app to NeuralSeek: you create the app from a manifest NeuralSeek generates, paste its App Signing Secret and Bot User OAuth Token, and can route Slack events to mAIstro agents."
---

## What is it

The Slack extension puts NeuralSeek inside a Slack workspace. You create a Slack app, link it to your NeuralSeek instance, and people in the workspace ask questions by mentioning the bot; NeuralSeek answers in the channel.

You set it up under **API's & Integration** > **Slack Extension**. The screen is titled **Integrating with Slack** and describes itself this way: "This integration connects your Slack workspace with NeuralSeek, allowing team members to query, analyze, and share insights directly in Slack. By setting up a Slack App and linking it to NeuralSeek through your extension, you can enable real-time responses and optionally route events to specialized agents for custom behaviors."

## Why it matters

Most questions get asked where people already work. With the Slack extension, answers from your NeuralSeek knowledge base arrive in the Slack channel where the question came up, so nobody has to open another tool first.

The extension can also do more than answer questions. **Event Handler Agents** hand selected Slack events to mAIstro agents, so a Slack event can run a workflow you built, not only the standard Seek answer.

## When to use it

- Your team works in Slack and you want NeuralSeek answers there, from a bot that people mention in channels.
- You want Slack events to trigger mAIstro agents, for example to post a custom-formatted reply instead of the standard answer.
- You manage the Slack app yourself. You need permission to create an app in the workspace and install it, because the setup needs two values from the app's own settings.

If your team uses Microsoft Teams, use the [Microsoft Teams extension](/integrations/teams-extension/). It is set up the same way and shares **Streaming Responses** and **Reply to all messages in channels** with this page. To call NeuralSeek from your own code instead of from a chat app, see [REST and Console API](/integrations/rest-and-console-api/).

## How it works

The screen has two parts. At the top, four numbered steps walk you through the setup. Below them are three sections you open one at a time: **Slack Credentials**, **Event Handler Agents** and **Additional Settings**. A single **Save** button sits at the bottom right of the page.

### Set up the Slack app (steps 1–4)

![Screenshot needed — Slack Extension, the four numbered setup steps with the manifest buttons and the slack event URL](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/slack-extension--setup-steps.png — API's & Integration > Slack Extension, crop steps 1–4 with the slack event URL box redacted (host and instance id blurred). Why: the full-screen image shows a live instance URL. -->

Follow the steps in the order the screen lists them.

1. **Create a Slack App.** The screen says: "Go to **Slack API Apps** and create a new app from manifest. Choose the workspace to install your new App. Paste the Slack App manifest provided here:". **Slack API Apps** is a link to Slack's app dashboard (`https://api.slack.com/apps`), outside NeuralSeek. The screen notes that "you can rename the app now in the manifest or later in the app settings". NeuralSeek generates the manifest for your instance and gives you two ways to take it:
   - **Copy to Clipboard** copies the manifest so you can paste it into Slack's "create from manifest" dialog.
   - **Save Manifest File** downloads the same manifest as a file. Use it when you want to keep a copy or pass it to whoever administers your Slack workspace.

   The manifest text is not shown on the page, so copy it or download it to see what it holds. If you would rather set up the app by hand, the screen gives a second path: "Or, alternatively assign similar app event subscriptions to match the manifest. Then, use the provided slack event URL:". The slack event URL is where your Slack app sends its events. It has the form `https://<console host>/v1/slack/events/<instance id>` and is specific to your instance. A copy button beside the box copies it.

2. **Get Credentials.** The screen says: "On the Basic Information page of your Slack App, you can find the Signing Secret. Then under OAuth & Permissions, install your app to the workspace and locate the Bot User OAuth Token. Input both of these below, under Slack Credentials, and click Save." The token only exists after you install the app to the workspace, so install it before you look for the token. The next section describes both fields.

3. **Test the Integration.** "Mention your bot in Slack or trigger an event you subscribed to, and confirm that NeuralSeek responds." If nothing comes back, check the two credentials first. Then check that the app's event subscriptions point at your slack event URL.

4. **(Optional) Additional Settings.** "Review other platform-specific settings, like unfurling media, streaming responses, and file handling." The settings are in the [Additional Settings](#additional-settings) section below.

### Slack Credentials

![The Slack Credentials section, with the App Signing Secret and Bot User OAuth Token fields showing their example text, and the Save button](/img/admin-tools/slack-extension-panel.png)

**Slack Credentials** holds the two values that link NeuralSeek to your Slack app. Both come from your app's settings on Slack's side, and both are secrets: store them the way you store any password.

<!-- UNCONFIRMED: that NeuralSeek uses the signing secret to verify incoming Slack requests — Slack's standard meaning of the signing secret; the screen does not state the purpose -->

- **App Signing Secret** — the help text reads "Find this on the 'Basic Information' page in your Slack App Settings". Step 2 calls it the Signing Secret. Slack signs every request it sends to your app with this secret, so NeuralSeek needs it to confirm that incoming events really come from your Slack app.
- **Bot User OAuth Token** — the help text reads "Find this on the 'OAuth & Permissions' page in your Slack App Settings". It lets NeuralSeek post in Slack as your bot. Slack bot tokens start with `xoxb-`, as the field's example text shows. If the token changes on Slack's side, for example after you reinstall the app, paste the new one here and save.
- **Show password** — the eye icon at the end of each field shows the value you typed, so you can check that you pasted it in full. The fields are masked otherwise.
- **Save** — step 2 ends with "click Save" once both values are in. **Save** sits at the bottom right of the page, below all three sections, and is the only save button on the screen.

<!-- UNCONFIRMED: that Save stores the Event Handler Agents rows and the Additional Settings as well as the credentials — inferred from Save being the page's only save button, below all three sections -->

Because it is the page's only save button, click **Save** after any change in the three sections.

The grey text inside each empty field is an example of the format, not a saved value.

### Event Handler Agents

![Screenshot needed — Slack Extension ▸ Event Handler Agents expanded, the table with its three columns and Add a new row](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/slack-extension--event-handler-agents.png — API's & Integration > Slack Extension, expand Event Handler Agents, crop the table with its column headers and the Add a new row control (and one row's dropdowns open if possible). Why: the Event Hook Type values and the agent picker appear on no image. -->

Without handlers, the bot answers with the standard NeuralSeek answer. **Event Handler Agents** lets you hand specific Slack events to a mAIstro agent instead, so you can decide what happens when that event arrives. Each row of the table is one handler, with three columns:

<!-- UNCONFIRMED: that the Event Hook Type values are Slack Event In, Slack Event Out and Slack Event Cancel — the route's gap list names them; the column's options appear on no screen image -->

- **Event Hook Type** — which Slack hook the agent is attached to: Slack Event In, Slack Event Out or Slack Event Cancel, the pipeline-hook nodes described below.
- **Event Name (from Slack)** — the Slack event the row reacts to, written the way Slack names it.
- **mAIstro Agent Handler** — the mAIstro agent that handles the event. Build the agent in [mAIstro](/maistro/overview/) first, then pick it here.

The table starts empty. Click **Add a new row** to add a handler, then **Save**.

An agent used as a Slack handler is built with the Slack pipeline-hook nodes, Slack Event In, Slack Event Out and Slack Event Cancel. The NTL reference describes them like this:

- `slackEventIn` — "This node is used only for Slack integration, to fulfill incoming events as hooks. This node must be the first step in a mAIstro flow." It gives the agent the Slack event: `slackEventIn.type` (the triggering event type), `slackEventIn.event`, `slackEventIn.view` and `slackEventIn.actions` (Slack's event, view and actions objects) and `slackEventIn.oauthToken` ("Your configured slack token for outgoing API calls" — the **Bot User OAuth Token** above). Its one parameter, `placeholder`, is described as "Enable to send the configured placeholder message. Disable this to skip the initial message."
- `slackEventOut` — "This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack." Use it when your agent sends its own reply and the standard answer should not be posted as well.
- `slackEventCancel` — "This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running."

```text
{{ slackEventIn | placeholder: "..." }}
```

For how pipeline-hook nodes work together, see [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

### Additional Settings

![Screenshot needed — Slack Extension ▸ Additional Settings expanded, with its four settings](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/slack-extension--additional-settings.png — API's & Integration > Slack Extension, expand Additional Settings, crop the four settings with their control type and any help text. Why: the control type (toggle/checkbox) and the saved state appear on no image. -->

**Additional Settings** controls how the bot behaves in Slack. It holds four settings. Save the page after you change any of them.

<!-- UNCONFIRMED: what Streaming Responses, Unfurl Media, Reply to all messages in channels and Reply to other bots do, and the reply-loop caution — read from the setting names and step 4's wording; no help text or observed behaviour -->

- **Streaming Responses** — posts the answer in Slack gradually, while it is being generated, instead of as one finished message. Turn it on when answers are long and people would otherwise see nothing for a while. Leave it off if you want each answer to arrive as one message. The Teams extension has a setting with the same name.
- **Unfurl Media** — decides whether Slack builds previews (unfurls) for links and media in the bot's messages. Turn it on when answers link to pages or images that readers should see inline. Turn it off to keep the bot's replies compact, for example when answers cite several source URLs.
- **Reply to all messages in channels** — makes the bot answer every message in a channel it belongs to, not only the messages that mention it. Use it in a channel dedicated to questions for the bot. Leave it off in busy channels, where the bot would reply to conversations that were not meant for it.
- **Reply to other bots** — makes the bot answer messages that other bots post as well. Turn it on only for a specific flow in which another bot hands questions to NeuralSeek.

:::caution[Replies can loop between bots]
With **Reply to all messages in channels** and **Reply to other bots** both on, your NeuralSeek bot answers every bot message in the channel. If another bot in that channel also replies to everything (or it is a second NeuralSeek bot set up the same way), each bot answers the other's reply, and the two can keep posting to each other without end. Keep **Reply to other bots** off unless you need a bot-to-bot flow, and use it only with a bot that does not reply to every message.
:::

## FAQ

### Where do I find the App Signing Secret and the Bot User OAuth Token?

Both are in your Slack app's settings on Slack's side. The Signing Secret is on the **Basic Information** page. The Bot User OAuth Token is under **OAuth & Permissions**, and it appears only after you install the app to your workspace. Paste both under **Slack Credentials** and click **Save**.

### Do I have to create the Slack app from the manifest?

No. **Copy to Clipboard** and **Save Manifest File** give you the manifest NeuralSeek generates for "create a new app from manifest". You can also set up an existing app by hand: give it event subscriptions that match the manifest and point them at the slack event URL shown on the screen (`https://<console host>/v1/slack/events/<instance id>`).

### How do I check that the integration works?

Save the credentials, then mention your bot in Slack or trigger an event you subscribed to, and confirm that NeuralSeek responds (step 3, **Test the Integration**). If it stays silent, re-check both credentials, then the event URL in your Slack app.

### Can a Slack event run one of my mAIstro agents?

Yes. Under **Event Handler Agents**, click **Add a new row** and fill in **Event Hook Type**, **Event Name (from Slack)** and **mAIstro Agent Handler**, then **Save**. Build the agent with the Slack pipeline-hook nodes (`slackEventIn` first, `slackEventOut` last). See [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

### Why does my bot keep replying to another bot?

**Reply to all messages in channels** and **Reply to other bots** are probably both on, so your bot answers the other bot's messages, and the other bot answers back. Turn **Reply to other bots** off under **Additional Settings** and save.
