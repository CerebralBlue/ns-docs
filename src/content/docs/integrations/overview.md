---
title: "What can we connect to?"
description: "One map of every external system NeuralSeek connects to — knowledge bases, LLMs, virtual agents, chat platforms, protocol servers and the APIs — with a link to each setup guide."
---

## What is it

This page maps every external system NeuralSeek connects to and points to the guide that sets each one up. It covers the content sources NeuralSeek answers from (knowledge bases and SharePoint), the language models that write the answers, the virtual agents and chat platforms that put those answers in front of users, the protocol servers that let other AI tools call your agents, and the APIs underneath all of them.

It does not repeat any setup steps. Each connection has its own page, and the table at the end of [How it works](#one-link-per-setup-guide) lists them all in one place.

## Why it matters

NeuralSeek's connections are not all configured in one place. Most outward-facing connections — virtual agents, Slack, Teams, MCP, a2a, SharePoint, the webhook and the APIs — have a screen under **API's & Integration**. The knowledge base and the language model are set in Neural Config instead. Knowing which is which saves a search through the console.

The connections also use different credentials. A server-side integration authenticates with an API key; code that runs in a visitor's browser uses the embed code. Picking the wrong one either exposes an admin credential or fails to authenticate, so it is worth deciding before you start a setup guide.

## When to use it

- You are planning a deployment and want to see what NeuralSeek can plug into before you commit to an architecture.
- You know the system you want to connect — say, Microsoft Teams or AWS Lex — and need the right guide and the right console screen.
- You are deciding between two ways to reach NeuralSeek, such as an MCP client versus the REST API, or a virtual-agent extension versus a webhook.

This page is the wrong place to follow a setup end to end. Go to the linked guide; it has the steps, the fields and the screenshots for that one system.

## How it works

### Where the integrations live in the console

Open **API's & Integration** in the top navigation. The same link is the first item of the **Admin Tools** menu. It opens the **API Keys** screen, and a side navigation on the left lists every integration screen, in this order: **API Keys**, **Embed Key**, **MCP Server**, **a2a Server**, **LexV2 Lambda**, **LexV2 Logs**, **KoreAI Logs**, **SharePoint**, **Slack Extension**, **Teams Extension**, **Watson Custom Extension**, **Watson Logs**, **WebHook**, **API**, **Console API** and **Self-Hosted LLM**.

![The API's & Integration screen: the side navigation lists API Keys, Embed Key, MCP Server, a2a Server, LexV2 Lambda, LexV2 Logs, KoreAI Logs, SharePoint, Slack Extension, Teams Extension, Watson Custom Extension, Watson Logs, WebHook, API, Console API and Self-Hosted LLM; the Admin Tools menu is open with API's & Integration, Data Loader, Entity Extraction, Chat SDK, QA Tools and Curate](/img/admin-tools/default.png)

Screens such as **MCP Server**, **LexV2 Lambda** and **Watson Custom Extension** are instruction screens: numbered steps with your instance's URL and a slot for an API key, each with a copy button, ready to paste into the other system.

Two other items in the **Admin Tools** menu matter when you connect NeuralSeek to something:

- **Data Loader** loads documents into your KnowledgeBase — see [Loading documents](/knowledge/load/).
- **Chat SDK** opens the chat page you can embed on a website — see [Chat SDK](/integrations/chat-sdk/).

The other menu items — Entity Extraction, QA Tools and Curate — are not integrations and are covered in their own sections.

### Credentials: API keys and embed codes

Every connection authenticates with one of two credentials. Decide which one before you open a setup guide.

![The Add API Key dialog: Key Name, Keys, Expiration date, and the Scope this API key groups FUNCTIONS, CONFIGS, AGENTS, API and CONSOLE API](/img/admin-tools/create-apikey-panel.png)

- **API Keys** holds the server-side credential. The **LexV2 Lambda**, **LexV2 Logs**, **KoreAI Logs**, **Watson Custom Extension**, **MCP Server** and **a2a Server** screens all ask you to generate an API key and paste it into the other system. When you create a key, **Scope this API key** is optional: leaving everything unchecked grants full access, and function scopes and API/Console API scopes are mutually exclusive. Keep API keys on a server, never in browser code. See [API keys](/configuration/administration/api-keys/).
- **Embed Key** holds the browser-safe credential. The screen, titled **Embed Seek**, shows the embed code to pass in an `embedcode` header and the Seek endpoint to call with it, and states that the embed code only allows access to that endpoint. Use it for code that runs in a visitor's browser. See [Embed codes](/configuration/administration/embed-codes/).

### Knowledge bases and LLM platforms

The two connections every NeuralSeek answer depends on — where the content comes from and which model writes the answer — are set in **Neural Config**, not on the API's & Integration screens.

- **Knowledge bases.** You pick the KnowledgeBase Type and fill in its connection fields in Neural Config. [Supported knowledge bases](/knowledge/supported-knowledgebases/) lists the types and what each one supports; [Connect a knowledge base](/knowledge/connect-a-kb/) walks through the connection.
- **LLM platforms.** You add a model in Neural Config's LLM Details section. [Supported LLMs](/configuration/supported-llms/) lists the platforms.
- **Self-Hosted LLM** is the one model-related entry in the API's & Integration side navigation. Use it when you run your own model rather than a hosted platform — see [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).
- **SharePoint** is a content source with its own screen. The screen is titled **SharePoint Online Background Connector**: it indexes SharePoint Online documents, pages and lists into the NeuralSeek managed Knowledge Base or into an Elasticsearch index, in four steps — Connection & Authentication (Azure AD credentials), Site Collections, Sync Target, and Schedule & Controls — and keeps the index up to date in the background. See [SharePoint sync](/integrations/sharepoint-sync/).

![The SharePoint Online Background Connector screen, open on step 1, Connection & Authentication, with Tenant ID, Tenant Name, Application (Client) ID and Client Secret](/img/admin-tools/sharepoint.png)

### Virtual agents (chatbots)

A virtual agent is a chatbot platform — watsonx Assistant, AWS Lex, Kore.ai — that runs the conversation and hands questions to NeuralSeek; AWS Lex, for example, routes its FallbackIntent to NeuralSeek. Start with [Virtual agents](/integrations/virtual-agents/) for what the integration does, then open the platform's guide. The side navigation has these entries for them:

- **Watson Custom Extension** — the screen is titled **Custom Extension** and says: "Use the custom extension to call NeuralSeek within Watson Assistant's 'Actions' framework." **Watson Logs** is its logging counterpart. Both are covered in [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
- **LexV2 Lambda** — uses an AWS Lambda archive to send user input that routes to the Lex FallbackIntent to NeuralSeek. **LexV2 Logs** sends Lex logs back through Amazon CloudWatch and EventBridge. Both are covered in [AWS Lex](/integrations/virtual-agents/aws-lex/).
- **KoreAI Logs** — enables round-trip monitoring: NeuralSeek watches how the intents it curated are used, through Kore.ai event tasks, and tells you which ones may need updating when the related documents in your KnowledgeBase change. See [Kore.ai](/integrations/virtual-agents/kore-ai/).

![The Custom Extension screen under Watson Custom Extension: eight numbered steps for building the extension in Watson Assistant, with an API key field](/img/admin-tools/watson-custom-extension.png)

Related guides without a side-navigation entry of their own:

- [watsonx Assistant streaming](/integrations/watsonx-assistant-streaming/) — streaming answers into watsonx Assistant.
- [NICE CXone](/integrations/nice-cxone/) — has no screen under API's & Integration; see the guide.
- [Training virtual agents](/integrations/training-virtual-agents/) — training a virtual agent with NeuralSeek.

### Chat platforms, agent protocols and webhooks

These entries put NeuralSeek inside a chat tool, or let other AI tools and services call it.

- **Slack Extension** — NeuralSeek in a Slack workspace. See [Slack extension](/integrations/slack-extension/).
- **Teams Extension** — NeuralSeek in Microsoft Teams. The screen, **Integrating with Microsoft Teams**, walks you through creating an Azure Bot, pointing its messaging endpoint at NeuralSeek, adding the Teams channel and downloading the generated Teams app package. See [Microsoft Teams extension](/integrations/teams-extension/).
- **MCP Server** — the screen, **Model Context Protocol Server**, says you can consume NeuralSeek mAIstro agents via MCP by giving an MCP client or LLM your unique MCP Server URL and an API key, sent as an `Authorization: Bearer` header. See [MCP server](/integrations/mcp-server/).
- **a2a Server** — the same pattern for the Agent-to-Agent protocol: the **Agent to Agent (a2a) Server** screen shows your a2a Server URL and the `Authorization: Bearer` header format. See [a2a server](/integrations/a2a-server/).
- **WebHook** — a generic entry point for systems that have no dedicated integration. See [Webhook](/integrations/webhook/).

![The Model Context Protocol Server screen: your MCP Server URL and the Authorization: Bearer header format, each with a copy button](/img/admin-tools/mcp-server.png)

MCP and a2a work in both directions, and the two directions are documented separately. **MCP Server** and **a2a Server** expose _your_ agents to outside clients. To have one of your agents call _someone else's_ MCP server or a2a agent, use the mAIstro integrations instead: [mAIstro MCP](/maistro/ntl/integrations/mcp/) and [mAIstro a2a](/maistro/ntl/integrations/a2a/).

### The three API surfaces

When no dedicated integration fits, you call NeuralSeek directly over HTTP. There are three APIs, and they do different jobs:

- **API** (side navigation) — the runtime API: the calls that do the work, such as Seek and mAIstro.
- **Console API** (side navigation) — the management API: the calls that administer the instance rather than answer questions.
- **Managed KnowledgeBase API** — not in the API's & Integration side navigation; it works with the managed KnowledgeBase. See [KnowledgeBase API](/knowledge/managed-knowledgebase/kb-api/).

[REST and Console APIs](/integrations/rest-and-console-api/) explains all three and when to reach for each. The Add API Key dialog (above) has separate **API** and **CONSOLE API** scope groups, so a key can be scoped to the endpoints of either.

### One link per setup guide

| System                                        | Where in the console                                                  | Guide                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| API keys                                      | API's & Integration → **API Keys**                                    | [API keys](/configuration/administration/api-keys/)                      |
| Embed code                                    | API's & Integration → **Embed Key**                                   | [Embed codes](/configuration/administration/embed-codes/)                |
| Knowledge base                                | Neural Config                                                         | [Connect a knowledge base](/knowledge/connect-a-kb/)                     |
| Knowledge base types                          | Neural Config                                                         | [Supported knowledge bases](/knowledge/supported-knowledgebases/)        |
| Loading documents                             | Admin Tools → **Data Loader**                                         | [Loading documents](/knowledge/load/)                                    |
| SharePoint Online                             | API's & Integration → **SharePoint**                                  | [SharePoint sync](/integrations/sharepoint-sync/)                        |
| LLM platforms                                 | Neural Config                                                         | [Supported LLMs](/configuration/supported-llms/)                         |
| Self-hosted LLM                               | API's & Integration → **Self-Hosted LLM**                             | [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/) |
| Virtual agents (overview)                     | —                                                                     | [Virtual agents](/integrations/virtual-agents/)                          |
| watsonx Assistant                             | API's & Integration → **Watson Custom Extension**, **Watson Logs**    | [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/)     |
| watsonx Assistant streaming                   | —                                                                     | [watsonx Assistant streaming](/integrations/watsonx-assistant-streaming/) |
| AWS Lex                                       | API's & Integration → **LexV2 Lambda**, **LexV2 Logs**                | [AWS Lex](/integrations/virtual-agents/aws-lex/)                         |
| Kore.ai                                       | API's & Integration → **KoreAI Logs**                                 | [Kore.ai](/integrations/virtual-agents/kore-ai/)                         |
| NICE CXone                                    | —                                                                     | [NICE CXone](/integrations/nice-cxone/)                                  |
| Training a virtual agent                      | —                                                                     | [Training virtual agents](/integrations/training-virtual-agents/)        |
| Website chat                                  | Admin Tools → **Chat SDK**                                            | [Chat SDK](/integrations/chat-sdk/)                                      |
| Slack                                         | API's & Integration → **Slack Extension**                             | [Slack extension](/integrations/slack-extension/)                        |
| Microsoft Teams                               | API's & Integration → **Teams Extension**                             | [Microsoft Teams extension](/integrations/teams-extension/)              |
| MCP clients calling your agents               | API's & Integration → **MCP Server**                                  | [MCP server](/integrations/mcp-server/)                                  |
| Your agents calling an MCP server             | mAIstro                                                               | [mAIstro MCP](/maistro/ntl/integrations/mcp/)                            |
| a2a clients calling your agents               | API's & Integration → **a2a Server**                                  | [a2a server](/integrations/a2a-server/)                                  |
| Your agents calling an a2a agent              | mAIstro                                                               | [mAIstro a2a](/maistro/ntl/integrations/a2a/)                            |
| Webhook                                       | API's & Integration → **WebHook**                                     | [Webhook](/integrations/webhook/)                                        |
| Runtime API and Console API                   | API's & Integration → **API**, **Console API**                        | [REST and Console APIs](/integrations/rest-and-console-api/)             |
| Managed KnowledgeBase API                     | —                                                                     | [KnowledgeBase API](/knowledge/managed-knowledgebase/kb-api/)            |

A dash means the guide has no screen of its own under API's & Integration.

## FAQ

### Where are the integration settings in the console?

Under **API's & Integration** in the top navigation — the same link is also the first item of the **Admin Tools** menu. Each integration is an entry in the side navigation on the left of that screen. The knowledge base and the language model are the exception: they are set in Neural Config.

### Do I need an API key or an embed code?

Server-side integrations use an API key: the virtual-agent screens, MCP Server and a2a Server all ask for one. Code that runs in a visitor's browser uses the embed code from **Embed Key**, which only gives access to the endpoint it is issued for, so it is safe to ship in frontend code. Never put an API key in browser code.

### How do I connect a knowledge base or an LLM?

In Neural Config, not on the API's & Integration screens. See [Supported knowledge bases](/knowledge/supported-knowledgebases/) and [Connect a knowledge base](/knowledge/connect-a-kb/) for the content side, and [Supported LLMs](/configuration/supported-llms/) for the model side. If you host your own model, start from **Self-Hosted LLM** and [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

### What is the difference between MCP Server and mAIstro's MCP integration?

They point in opposite directions. **MCP Server** exposes your mAIstro agents to outside MCP clients, which call NeuralSeek with your MCP Server URL and an API key. The [mAIstro MCP](/maistro/ntl/integrations/mcp/) integration does the reverse: one of your agents calls someone else's MCP server. a2a works the same way — [a2a server](/integrations/a2a-server/) versus [mAIstro a2a](/maistro/ntl/integrations/a2a/).

### My platform has no screen — can I still connect?

Yes. Call NeuralSeek through the [runtime API](/integrations/rest-and-console-api/) or the [Webhook](/integrations/webhook/), which the API's & Integration side navigation lists as **API** and **WebHook**.
