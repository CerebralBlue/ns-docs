---
title: "REST and Console APIs"
description: "NeuralSeek has two API surfaces: the runtime API at /v1/<instance id> for Seek, mAIstro and related calls, and the Console API at /c1/<instance id> for managing an instance's data."
---

## What is it

NeuralSeek has two HTTP APIs, and each one does a different job:

- **The runtime API** handles the calls your applications make while they run: Seek answers, mAIstro agents, ratings, translation, guardrails, analytics and logs. You find it on the **API** screen.
- **The Console API** manages the data behind the console screens: intents, answers, curated data, mAIstro files, NeuralEdit, governance figures, documents and dashboards. You find it on the **Console API** screen.

The **API** and **Console API** screens are both in **API's & Integration**, in the side navigation. Each one is an interactive OpenAPI 3.0 viewer that shows the API's spec file, its base URL for your instance, an **Authorize** button, and every operation grouped by topic.

## Why it matters

If you pick the wrong surface, the call fails in ways that can be hard to diagnose. The two APIs use different path prefixes (`/v1/` for the runtime API, `/c1/` for the Console API), so a runtime operation sent to the Console base URL does not exist there, and the reverse is also true. Both screens also help you secure your keys. Every operation they list, by method and path, is a scope you can grant to an API key one at a time. A key that only needs to ask Seek questions can be limited to `POST /seek`.

## When to use it

- **Use the runtime API** from a server, script or integration that asks questions, runs mAIstro agents, rates answers, translates text, checks for PII, or reads analytics and logs. The [Webhook](/integrations/webhook/) screen's URL is this API's `/seek` operation.
- **Use the Console API** to automate what you would otherwise do in the console. For example, you can load intent examples, edit or delete answers, pull curated data (the same data as the [Curation](/seek/curation/) screen), manage mAIstro files, or read governance figures (see [Governance](/governance/overview/)).

When not to use them:

- **From a browser.** API keys belong on a server. Browser code calls Seek with an [embed code](/configuration/administration/embed-codes/), which opens the Seek endpoint only.
- **To change Neural Config settings.** The Console API screen has no operation that reads or writes Neural Config. Its only configuration operations are `GET /neuralEdit/config` and `POST /neuralEdit/config`, and both are for NeuralEdit.

## How it works

### Two API surfaces

| Surface                  | Screen          | Spec title        | Server option on the screen                                      | Base URL                                   | Covers                                                                                                   |
| ------------------------ | --------------- | ----------------- | ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Runtime API              | **API**         | **NeuralSeek**    | `https://<console host>/v1/{instance} - NeuralSeek API server`     | `https://<console host>/v1/<instance id>`  | Seek, NeuralEdit streaming, ratings, mAIstro, categorize, extract, translate, guardrails, training, tests, analytics, logs, keys, user data |
| Console API              | **Console API** | **NeuralSeek UI** | `https://<console host>/c1/{instance} - NeuralSeek Console server` | `https://<console host>/c1/<instance id>`  | Intents, categories, answers, questions, curated data, mAIstro files and agent list, NeuralEdit, governance, documents, dashboards |

Both specs share the subtitle "NeuralSeek - The business LLM accelerator" and carry a version badge and an `OAS 3.0` badge. Each screen shows your own console host and instance ID. On this page they appear as `<console host>` and `<instance id>`.

The spec title at the top of each screen tells you which API you are on. **NeuralSeek** is the runtime API:

![The API screen's spec header: the NeuralSeek title with its version and OAS 3.0 badges, the ./neuralseek.json link and the support links](/img/admin-tools/api--neuralseek-2-1-91-oas-3-0.png)

**NeuralSeek UI** is the Console API:

![The Console API screen's spec header: the NeuralSeek UI title with its version and OAS 3.0 badges and the ./consoleapi.json link](/img/admin-tools/console-api--neuralseek-ui-2-1-91-oas-3-0.png)

### The runtime API screen (API)

Open **API's & Integration** and select **API** in the side navigation. The spec header (shown above) has these links:

- **./neuralseek.json**: the runtime API's OpenAPI 3.0 spec file. It holds the whole API in one file, so you can download it to generate a client or import it into an API tool.
- Under the subtitle is a row of links. **Terms of service** and **End User License Agreement** both open the NeuralSeek EULA. **NeuralSeek Support - Website** opens neuralseek.com, **Send email to NeuralSeek Support** starts an email to NeuralSeek support, and **Documentation** opens the NeuralSeek documentation.

Below the header is the server block:

<!-- SCREENSHOT: /img/admin-tools/api--server-variables.png — same crop with the Computed URL and instance values blurred. Why: shows a live instance id. -->

![The API screen's Servers dropdown, Computed URL, API Key and Server variables, with the Authorize button](/img/admin-tools/api--server-variables.png)

- **Servers**: a dropdown with one option, `https://<console host>/v1/{instance} - NeuralSeek API server`.
- **Computed URL:**: the base URL with your instance filled in, `https://<console host>/v1/<instance id>`. Every operation path is appended to it. For example, Seek is `https://<console host>/v1/<instance id>/seek`.
- **API Key:**: this shows the literal text `[ Generate an API Key ]`, not a key. You have to create a key on the [API keys](/configuration/administration/api-keys/) screen first.
- **Server variables**: one row, **instance**, prefilled with your instance ID. This is the value that replaces `{instance}` in the server URL.
- **Authorize**: the green button with a padlock. It is where the viewer takes the credential for the operations it lists. Each operation row has a padlock icon, which marks it as an operation that needs that credential.

Neither API screen prints a header name for the key. They show only **API Key:** and the **Authorize** button.

<!-- UNCONFIRMED: the Authorize dialog shows the security scheme (header name and format) the spec declares — standard OpenAPI-viewer behaviour; the Authorize dialog has not been opened and checked. -->

Open **Authorize**, or read **./neuralseek.json**, to see which scheme the spec declares.

**Schemas** is a collapsible section at the bottom of the screen. It lists two models, **seek** and **seek_response**: the request and response bodies of the Seek operation.

### Runtime API operations

The operations are grouped under collapsible headings. Each row shows the method, the path and a one-line summary. The summaries below are copied exactly from the screen, including its spellings.

![The mAIstro group of the API screen: /maistro, /maistro/{agent}, /maistro_stream, the three /maistro_batch operations and /chat/completions](/img/admin-tools/api--maistro-collapse-operation.png)

| Group                 | Operation                  | Summary on the screen                                                |
| --------------------- | -------------------------- | -------------------------------------------------------------------- |
| Seek                  | `POST /seek`               | Seek an answer from NeuralSeek                                       |
| Seek                  | `POST /seek_stream`        | Stream a Seek an answer from NeuralSeek                              |
| NeuralEdit            | `POST /neuralEdit`         | Stream neuralEdit response                                           |
| Seek Answer Ratings   | `GET /rate`                | Get an answer rating                                                 |
| Seek Answer Ratings   | `DELETE /rate`             | Delete an answer rating                                              |
| Seek Answer Ratings   | `POST /rate`               | Rate an answer                                                       |
| Seek Answer Ratings   | `POST /answerRatings`      | Get the average user ratings for an answer                           |
| mAIstro               | `POST /maistro`            | Run mAistro NTL or agent                                             |
| mAIstro               | `GET /maistro/{agent}`     | Run a mAIstro agent via GET                                          |
| mAIstro               | `POST /maistro_stream`     | Stream mAIstro NTL or an agent                                       |
| mAIstro               | `POST /maistro_batch`      | Call mAIstro NTL or an agent via batch                               |
| mAIstro               | `GET /maistro_batch`       | Get mAIstro batch results                                            |
| mAIstro               | `DELETE /maistro_batch`    | Cancel current mAIstro batch run                                     |
| mAIstro               | `POST /chat/completions`   | Chat Completions - compatible mAIStro endpoint                       |
| mAIstro Agent Ratings | `GET /maistroRate`         | Get an agent rating                                                  |
| mAIstro Agent Ratings | `DELETE /maistroRate`      | Delete an agent rating                                               |
| mAIstro Agent Ratings | `POST /maistroRate`        | Rate an Agent                                                        |
| mAIstro Agent Ratings | `POST /maistroRatings`     | Get the average user ratings for an agent                            |
| Categorize            | `POST /categorize`         | Categorize text into an Intent & Category                            |
| Extract Entities      | `POST /extract`            | Extract entitites from text                                          |
| Translate             | `POST /translate`          | Translate text into a desired language                               |
| Translate             | `POST /translateGlossary`  | Add custom translations                                              |
| Translate             | `DELETE /translateGlossary`| Delete the custom translations                                       |
| Translate             | `POST /identify`           | Identify the source language                                         |
| Translate             | `POST /identify-single`    | Identify the source language (JSON)                                  |
| Guardrails            | `POST /pii`                | Find PII in a user utterance                                         |
| Guardrails            | `POST /score`              | Run the Semantic Scoring model on text against an array of passages  |
| Train KB              | `POST /train`              | Submit KnowledgeBase Training                                        |
| Service Test          | `GET /test`                | Service check                                                        |
| Test Questions        | `POST /test`               | Test questions via batch upload                                      |
| Test Questions        | `GET /getTestResults`      | Get Test Results                                                     |
| Analytics             | `POST /analytics`          | Instance Analytics                                                   |
| Logs                  | `POST /logs`               | Instance Logs                                                        |
| Logs                  | `POST /logExternalAgent`   | Log external agent execution details                                 |
| Keys                  | `POST /otp`                | Create a One Time Password                                           |
| Keys                  | `POST /keycheck`           | Validate an api key                                                  |
| User Data             | `DELETE /user_data`        | Delete all user data                                                 |

Some rows answer common questions:

- **Streaming a mAIstro agent.** `POST /maistro_stream` is listed in the **mAIstro** group. For how streaming is used with watsonx Assistant, see [watsonx Assistant streaming](/integrations/watsonx-assistant-streaming/). `POST /seek_stream` is the streaming counterpart of `POST /seek`.
- **Entity extraction.** `POST /extract` is on the runtime API, alone in the **Extract Entities** group. The entities it finds are the ones described in [Entity extraction](/governance/entity-extraction/).

![The Extract Entities group of the API screen, with its single POST /extract operation](/img/admin-tools/api--extract-entities-collapse-operation.png)

- **Chat completions.** The screen describes `POST /chat/completions` as "Chat Completions - compatible mAIStro endpoint". The screen says nothing more about it.
- **The service check.** `GET /test`, in **Service Test**, is the only operation on the API screen whose row has no padlock icon.

![The Service Test group of the API screen: GET /test, Service check, with no padlock icon on its row](/img/admin-tools/api--service-test-collapse-operation.png)

### The Console API screen

Select **Console API** in the same side navigation. The screen has the same layout as the API screen, with a different spec (**NeuralSeek UI**, shown above) and a different server:

- **./consoleapi.json**: the Console API's OpenAPI 3.0 spec file.
- The header links (**Terms of service**, **End User License Agreement**, **NeuralSeek Support - Website**, **Send email to NeuralSeek Support**, **Documentation**) are the same as on the API screen.

<!-- SCREENSHOT: /img/admin-tools/console-api--server-variables.png — same crop with the Computed URL and instance values blurred. Why: shows a live instance id. -->

![The Console API screen's Servers dropdown, Computed URL, API Key and Server variables, with the Authorize button](/img/admin-tools/console-api--server-variables.png)

- **Servers**: one option, `https://<console host>/c1/{instance} - NeuralSeek Console server`.
- **Computed URL:**: `https://<console host>/c1/<instance id>`. Note `/c1/` where the runtime API has `/v1/`.
- **API Key:**, **Server variables** / **instance** and **Authorize** work the same way as on the API screen, described above. **API Key:** again shows `[ Generate an API Key ]`.

Every one of the 39 Console API operations has the padlock icon. There is no **Schemas** section on this screen.

### Console API operations

![The Intents group of the Console API screen: /addIntent, /loadUserResponse, /ren, /flag, /merge, /unmerge and /delUserData](/img/admin-tools/console-api--intents-collapse-operation.png)

| Group         | Operation                       | Summary on the screen                      |
| ------------- | ------------------------------- | ------------------------------------------ |
| Intents       | `POST /addIntent`               | Add an Intent                              |
| Intents       | `POST /loadUserResponse`        | Add Intent Examples                        |
| Intents       | `POST /ren`                     | Rename an Intent                           |
| Intents       | `POST /flag`                    | Flag an Intent                             |
| Intents       | `POST /merge`                   | Merge Intents                              |
| Intents       | `POST /unmerge`                 | UnMerge Intents                            |
| Intents       | `POST /delUserData`             | Delete Intents / Data                      |
| Categories    | `POST /category`                | Update a Category                          |
| Answers       | `POST /findAnswerId`            | Find AnswerId                              |
| Answers       | `POST /editAnswer`              | Edit Answer                                |
| Answers       | `POST /delAnswer`               | Delete Answer                              |
| Questions     | `POST /delQuestion`             | Delete Question                            |
| Curated Data  | `POST /curate`                  | Get Curated Data                           |
| mAIstro       | `POST /exploreUpload`           | Upload a file to mAIstro                   |
| mAIstro       | `POST /maistroOCR`              | OCR upload to mAIstro                      |
| mAIstro       | `POST /exploreFiles`            | List Maistro Files                         |
| mAIstro       | `POST /maistroFiles`            | List Maistro Files (paginated)             |
| mAIstro       | `POST /fdel`                    | Delete Maistro File(s)                     |
| mAIstro       | `POST /exploreTemplates`        | List Agents                                |
| NeuralEdit    | `POST /neuralEdit/getFile`      | Get NeuralEdit File                        |
| NeuralEdit    | `GET /neuralEdit/config`        | Get NeuralEdit Config                      |
| NeuralEdit    | `POST /neuralEdit/config`       | Save NeuralEdit Config                     |
| NeuralEdit    | `POST /neuralEdit/category`     | Select NeuralEdit Category/Agent           |
| Governance    | `POST /goover`                  | Governance Overview                        |
| Governance    | `POST /gosemantic`              | Governance - Semantic Details              |
| Governance    | `POST /godocument`              | Governance - Documentation Details         |
| Governance    | `POST /goperf`                  | Governance - Performance Details           |
| Governance    | `POST /gotokens`                | Governance - Token Usage                   |
| Governance    | `POST /gomaistro`               | Governance - mAIstro Usage                 |
| Governance    | `POST /gomaistrotokens`         | Governance - mAIstro Token Usage           |
| Governance    | `POST /aiPricing`               | AI Pricing                                 |
| Documents     | `GET /documents/list`           | List documents                             |
| Documents     | `POST /documents/search`        | Search documents                           |
| Documents     | `DELETE /documents`             | Delete documents                           |
| Dashboards    | `POST /agentdashboards`         | Get Agent Dashboards                       |
| Dashboards    | `POST /agentdashboards/add`     | Add Agent Dashboard                        |
| Dashboards    | `POST /agentdashboards/delete`  | Delete Agent Dashboard                     |
| Dashboards    | `GET /agentpanels`              | Get Agent Panels                           |
| Dashboards    | `POST /agentpanels`             | Set Agent Panels                           |

The **Intents**, **Answers**, **Questions** and **Curated Data** groups cover the same data as the [Curation](/seek/curation/) screen. The **Governance** group returns the figures shown on the [Governance](/governance/overview/) screens. The screen only gives these names and summaries. It does not say that the request and response fields match what those screens show.

### Credentials and scoped keys

Both APIs take an API key. Keys are created and managed on the [API keys](/configuration/administration/api-keys/) screen, which covers the rest of the dialog. This section covers only how a key is scoped to these two APIs.

In the **Add API Key** dialog, the **Scope this API key** section limits what a key can call. Its help text reads: "Optional. Leave everything unchecked to grant full access. Function scopes and API/Console API scopes are mutually exclusive."

- Leave every box unchecked to create a key with full access, including both APIs.
- **API** (the header shows a count of 37): open it to see one checkbox for each runtime API operation, labelled with the same method and path as the API screen (`POST /seek`, `GET /maistro/{agent}`, `POST /maistro_stream`, `POST /extract` and so on). Check only the operations the caller needs. For example, a key for the [Webhook](/integrations/webhook/) caller can be limited to `POST /seek`.

![The Add API Key dialog with Scope this API key and the API group open, showing POST /seek, POST /seek_stream and POST /neuralEdit checkboxes](/img/admin-tools/api-37-panel.png)

- **Console API** (count 39): one checkbox for each Console API operation, from `POST /addIntent` to `POST /agentpanels`.

![The Add API Key dialog with the Console API group open, count 39](/img/admin-tools/console-api-39-panel.png)

- You cannot mix groups. A key scoped with **Functions** cannot also carry **API** or **Console API** scopes, and the reverse is also true.

Browser code does not use an API key. It calls the runtime Seek endpoint with an [embed code](/configuration/administration/embed-codes/), which opens the Seek endpoint only. Embed codes are not documented for the Console API, so use an API key there.

## FAQ

### What is the difference between the API and the Console API?

The API (`https://<console host>/v1/<instance id>`, "NeuralSeek API server") is the runtime API. It covers Seek, mAIstro, ratings, translation, guardrails, analytics and logs. The Console API (`https://<console host>/c1/<instance id>`, "NeuralSeek Console server") manages the instance's data: intents, answers, curated data, mAIstro files, NeuralEdit, governance figures, documents and dashboards.

### Where do I download the OpenAPI spec?

Use the **./neuralseek.json** link under the title on the **API** screen and the **./consoleapi.json** link on the **Console API** screen. Both are OpenAPI 3.0 files.

### Can I run a mAIstro agent over REST, and stream it?

Yes. `POST /maistro` runs NTL or an agent, and `GET /maistro/{agent}` runs an agent via GET. `POST /maistro_stream` streams the result. For batch runs, `POST /maistro_batch` starts the run, `GET /maistro_batch` gets the results and `DELETE /maistro_batch` cancels it.

### Is entity extraction available over the API?

Yes. `POST /extract` ("Extract entitites from text") is in the **Extract Entities** group of the runtime API, under `/v1/`. See [Entity extraction](/governance/entity-extraction/) for the entities it finds.

### Can one key be limited to a single endpoint?

Yes. In the **Add API Key** dialog, open the **API** or **Console API** group under **Scope this API key** and check only that operation. You cannot combine **Functions** scopes with API or Console API scopes on the same key.

### Which credential do I use from a browser?

Use an [embed code](/configuration/administration/embed-codes/). It works for the Seek endpoint only. Keep API keys on the server.
