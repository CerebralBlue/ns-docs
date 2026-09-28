---
title: "AWS Lex"
description: "NeuralSeek connects to an Amazon Lex V2 bot through two AWS Lambda functions: one sends questions that reach the bot's FallbackIntent to NeuralSeek's Seek endpoint, the other ships the bot's conversation logs to NeuralSeek every 15 minutes for round-trip monitoring."
---

## What is it

NeuralSeek integrates with Amazon Lex V2 through two screens under **API's & Integration**, each reached from the side navigation:

- **LexV2 Lambda** opens the **AWS Lex V2 Lambda** screen. It walks you through deploying an AWS Lambda function that sends "user input that routes to the Lex FallbackIntent to NeuralSeek", so your bot can answer questions it has no intent for.
- **LexV2 Logs** opens the **AWS LexV2 Logs** screen. It walks you through shipping your bot's conversation logs from Amazon CloudWatch to NeuralSeek on a schedule, so NeuralSeek can monitor the curated intents in your bot.

Both screens are step-by-step instructions, most of which you carry out in the AWS consoles. Each one gives you the two values the Lambda code needs (an API key and a NeuralSeek URL) in copyable code boxes, and a **Lambda Archive** button at the bottom that downloads the `.zip` you upload to AWS Lambda. Nothing you do on these screens is saved in NeuralSeek; the configuration lives in your AWS account.

## Why it matters

A Lex bot answers well only what its intents cover. Everything else lands in the FallbackIntent. Routing the FallbackIntent to NeuralSeek turns those unmatched questions into answers generated from your KnowledgeBase, without writing a new intent for each one.

Answers you curate in NeuralSeek and import into Lex as intents are fast and cheap to serve, but they go stale when the source documents change. Round-trip logging closes that loop: NeuralSeek reads which intents your bot actually served and flags the curated ones that may need updating on the **Curate** tab. See [Logging](/governance/logging/) for round-trip logging across all virtual agents.

## When to use it

- **Use the LexV2 Lambda** when you run a Lex V2 bot and want questions with no matching intent answered from your KnowledgeBase instead of a generic fallback reply.
- **Use the LexV2 Logs** when you have imported NeuralSeek-curated answers into Lex as intents and want to know when they may be out of date.
- The two are independent: you can deploy either one without the other.

These screens are the wrong tool for a bot on another platform. See [Virtual agents](/integrations/virtual-agents/) for the platforms NeuralSeek supports, and the [REST and Console API](/integrations/rest-and-console-api/) for connecting any platform that can call a REST API.

Both Lambdas authenticate with a NeuralSeek API key. Create one on [API keys](/configuration/administration/api-keys/) before you start.

## How it works

### Answer Lex fallback questions with NeuralSeek (LexV2 Lambda)

![The AWS Lex V2 Lambda screen: the intro sentence, the first steps, and the API key and instance URL code boxes in step 7](/img/admin-tools/lexv2-lambda.png)

Select **LexV2 Lambda** in the side navigation of **API's & Integration**. The **AWS Lex V2 Lambda** screen lists 28 numbered steps. They fall into three stages.

**Create the Lambda.** In the AWS Lambda console:

1. Open the **Functions** page on the Lambda console (the link on the screen opens it).
2. Select "Create function" and create a function from scratch.
3. In the Code Source pane, choose **Upload from**, then **.zip file**, and upload the archive you downloaded with the **Lambda Archive** button at the bottom of the NeuralSeek screen. Choose **Save**.
4. Click `index.mjs` and enter your API key and the instance URL. The screen shows both in code boxes, each with a **Copy to clipboard** button:
   - The API key box reads `[ Generate an API Key ]` until you have a key; create one on [API keys](/configuration/administration/api-keys/).
   - The instance URL box shows your instance's Seek endpoint, in the form `https://<console host>/v1/<instance id>/seek`. Copy it from the screen rather than typing it.
5. Click "Deploy".
6. On the **Configuration** tab, open the **General Configuration** pane, click "Edit", set **Timeout** to **1 min 0 sec**, and click "Save".

**Connect the Lambda to the bot alias.** In the Amazon Lex console (the screen links to `https://console.aws.amazon.com/lexv2/home#bots`):

1. From the list of bots, choose the bot you want to use.
2. Under **Deployment** in the left panel, select **Aliases**, then choose the alias you want to use.
3. Choose the language the Lambda function is used for.
4. Choose the Lambda function, then its version or alias, and choose **Save**.

The Lambda is attached per alias and per language: repeat these steps for every alias and language that should reach NeuralSeek.

**Route the FallbackIntent to the Lambda.** Still in the Lex console:

1. In the left panel under **All languages**, select **Intents** under the language the fallback intent is used for.
2. Select **FallbackIntent**.
3. Under **Fulfillment**, set it to **Active**.
4. Under **Fulfillment**, click **Advanced options**, check **Use a Lambda function for fulfillment**, and click "Updated options".
5. Click **Save intent**.
6. Click **Build** to build the bot.

Once the bot is built, a user question that matches no intent goes to the FallbackIntent, whose fulfillment calls the Lambda, which sends the question to your instance's Seek endpoint.

### Round-trip logging with LexV2 Logs

![The AWS LexV2 Logs screen: the intro sentence and steps 1 to 11, from creating the CloudWatch log group to enabling text logs on the bot alias](/img/admin-tools/lexv2-logs.png)

Select **LexV2 Logs** in the side navigation of **API's & Integration**. The **AWS LexV2 Logs** screen sets up a second Lambda that reads your bot's conversation logs from Amazon CloudWatch and sends them to NeuralSeek every 15 minutes. NeuralSeek compares what the bot served with the answers you curated and marks the intents that may need updating. The screen repeats the intro sentence of the LexV2 Lambda screen; the steps below are what this screen actually sets up.

**Create a CloudWatch log group.**

1. Open Amazon CloudWatch **Log Groups** (linked from the screen). Make sure you are in the same region as your bot.
2. Click "Create log group", give it a name (this group will hold your bot's chat logs), and click "Create".

**Turn on Lex conversation logs.**

1. Open the Amazon **LexV2** console (linked from the screen), choose your bot, then **Aliases** in the left menu, and the alias you want to log.
2. In the **Conversation logs** section, choose **Manage conversation logs**.
3. For text logs, choose **Enable** and enter the name of the log group you just created.
4. Choose **Save**. If necessary, Amazon Lex V2 updates your service role with permissions to access the CloudWatch Logs log group.

**Create the log-shipping Lambda.**

1. Open the **Functions** page on the Lambda console, select "Create function" and create a function from scratch.
2. In the Code Source pane, choose **Upload from**, then **.zip file**, and upload the archive from the **Lambda Archive** button at the bottom of the LexV2 Logs screen. Choose **Save**.
3. Click `index.mjs` and enter your API key, the instance URL and `LogGroupName`:
   - The API key box reads `[ Generate an API Key ]` until you have a key.
   - The instance URL box shows your instance's log endpoint, in the form `https://<console host>/logs/lex/<instance id>`. Copy it from the screen.
   - `LogGroupName` is the name you gave the log group you created earlier.
4. Click "Deploy".
5. On the **Configuration** tab, open **General Configuration**, click "Edit", set **Timeout** to **5 min 0 sec**, and click "Save". This is longer than the fallback Lambda's one minute.

**Let the Lambda read CloudWatch.**

1. In the **Permissions** pane, click the link under **Role name**.
2. Click **Add permissions**, then **Attach policies**.
3. Search for `CloudWatchReadOnlyAccess`, select it, and click **Add permissions**.

**Run the Lambda every 15 minutes.** In the Amazon EventBridge **Rules** page (linked from the screen):

1. Click "Create rule" and give the rule a name.
2. Under **Rule type**, select **Schedule**, then click "Continue to create rule".
3. Under **Schedule pattern**, select "A schedule that runs at a regular rate, such as every 10 minutes."
4. Under **Rate expression**, set **Value** to `15` and the unit to **Minutes**. Click "Next".
5. Under **Select a target**, select **Lambda function**, and under **Function** select the log Lambda you created. Click "Next" twice, then "Create rule".

**Validate the connection.** Trigger an intent in the language tab of your bot in AWS Lex V2. After the next EventBridge run (at most 15 minutes later), an icon appears next to the corresponding intent on the **Curate** tab in NeuralSeek. See [Answer curation](/seek/curation/) for what the Curate tab shows about each intent.

## FAQ

### Which Lex intent sends questions to NeuralSeek?

The **FallbackIntent**. On the LexV2 Lambda steps you set its fulfillment to **Active** and check **Use a Lambda function for fulfillment**, so every question that matches no other intent is passed to the NeuralSeek Lambda.

### What timeout should the Lambda have?

The two Lambdas differ. The fallback Lambda from the **LexV2 Lambda** screen uses a timeout of 1 min 0 sec; the log-shipping Lambda from the **LexV2 Logs** screen uses 5 min 0 sec. Both are set under **Configuration** > **General Configuration** > **Edit** in the Lambda console.

### How often are Lex logs sent to NeuralSeek?

Every 15 minutes. The LexV2 Logs steps have you create an Amazon EventBridge rule with a rate expression of 15 Minutes that triggers the log Lambda.

### How do I know round-trip logging works?

Trigger an intent in your Lex bot. After the next EventBridge run, an icon appears next to that intent on NeuralSeek's **Curate** tab.

### Which AWS permission does the log Lambda need?

`CloudWatchReadOnlyAccess`, attached to the Lambda's execution role from its **Permissions** pane. Without it the Lambda cannot read the conversation logs from CloudWatch.

### Do I need a NeuralSeek API key?

Yes. Both Lambdas take an API key in `index.mjs`. The code box on each screen reads `[ Generate an API Key ]` until one exists; create it on [API keys](/configuration/administration/api-keys/).
