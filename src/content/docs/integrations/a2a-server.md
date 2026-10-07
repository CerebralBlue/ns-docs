---
title: "a2a server"
description: "The a2a Server screen under API's & Integration gives the URL and the Bearer authentication header an Agent-to-Agent (a2a) client needs to call your NeuralSeek mAIstro agents."
---

## What is it

The **a2a Server** screen, under **API's & Integration** in the top navigation, is where NeuralSeek tells you how to reach your mAIstro agents over a2a (Agent-to-Agent), an open protocol that lets agents built on different platforms call one another. The screen holds no settings: it shows your instance's a2a server URL and the format of the authentication header, and links to the a2a project.

This page covers the **server** direction — other systems calling your agents. The opposite direction, where one of your agents calls an external a2a agent, is the [a2a client](/maistro/ntl/integrations/a2a/). The same agents can also be exposed over the Model Context Protocol; see [MCP server](/integrations/mcp-server/).

## Why it matters

An agent you build in mAIstro is useful beyond the NeuralSeek console only if something outside can call it. With the a2a server, an agent framework or orchestrator that already speaks a2a can use your mAIstro agents with two pieces of information — a URL and an API key — instead of a custom integration written against the REST API.

## When to use it

Use the a2a server when the system that needs your agents is an a2a client: another company's agent, a multi-agent orchestrator, or an LLM tool that supports a2a.

It is the wrong tool when:

- **Your client speaks MCP** rather than a2a — use the [MCP server](/integrations/mcp-server/), which exposes the same mAIstro agents over MCP.
- **Your agent is the caller.** To have one of your agents call someone else's a2a agent, use the [a2a client](/maistro/ntl/integrations/a2a/).
- **You are writing a plain HTTP application.** Calling agents from your own code is usually simpler through the [REST and Console APIs](/integrations/rest-and-console-api/).

## How it works

### What the screen gives you

Open **API's & Integration** in the top navigation, then **a2a Server** in the side navigation. The page is titled **Agent to Agent (a2a) Server** and is read-only: there is nothing to change or save.

![The Agent to Agent (a2a) Server screen: an intro paragraph and four numbered cards with the server URL, the authorization header format and a link to the a2a project](/img/admin-tools/a2a-server.png)

Under the title, the screen describes a2a as "an open protocol that standardizes how applications provide context to LLMs. a2a provides a standardized way to connect AI models to different data sources and tools." What matters in practice is the agent-to-agent part: a2a lets an agent on one platform call an agent on another. The four numbered cards below it are the whole setup:

1. "You can consume NeuralSeek mAIstro Agents via a2a by providing your unique URL and an api key to an a2a client or LLM."
2. **Your a2a Server url is:** — a code box with your instance's endpoint and a **Copy to clipboard** button. The URL has this shape:

   ```text
   https://<your console host>/v1/<your instance id>/a2a
   ```

   It is unique to your instance, so copy it from the screen rather than building it by hand.

3. "Generate an api key, and then use it as an authentication header value, with the format:" — a second code box, also with **Copy to clipboard**:

   ```text
   Authorization: Bearer [ Generate an API Key ]
   ```

   The bracketed part is a placeholder: replace `[ Generate an API Key ]` with a key you create on [API keys](/configuration/administration/api-keys/).

4. "Learn more about a2a at" **https://github.com/a2aproject/A2A** — the a2a project, which documents the protocol itself.

### Connecting an a2a client

Connecting a client takes three steps:

1. **Copy the URL.** On **a2a Server**, use **Copy to clipboard** next to **Your a2a Server url is:**.
2. **Create a key.** Open **API Keys** (first item in the same side navigation) and select **Create ApiKey**. In the **Add API Key** dialog, give the key a **Key Name** (required and must be unique) and, if the caller should lose access at a known date, set **Expiration date** (optional). Under **Scope this API key**, the screen reads "Leave everything unchecked to grant full access", so a key with no scope selected can do everything — for a key you hand to an outside system, prefer to scope it. The scope groups are **Functions**, **Configs**, **Agents**, **API** and **Console API**; what each one covers is on the [API keys](/configuration/administration/api-keys/) page.
3. **Send the key as a header.** Configure the a2a client to send `Authorization: Bearer <your API key>` with every call to the URL from step 1.

![The Add API Key dialog: Key Name, Keys count, Expiration date, and the Scope this API key groups Functions, Configs, Agents, API and Console API](/img/admin-tools/create-apikey-panel.png)

Create one key per calling system, so each caller's access has its own name, its own expiration date and its own scope, and ending one caller's access does not affect the others.

<!-- UNCONFIRMED: how mAIstro agents are presented to an a2a client (agent card, skills listing, streaming support) — not shown on the a2a Server screen; see the a2a project for the protocol side -->

The screen does not show how your agents are described to a client once it connects (for example, which agents it lists or how their inputs appear). Point your a2a client at the URL and inspect what it discovers; the protocol side is documented by the [a2a project](https://github.com/a2aproject/A2A).

## FAQ

### What is my a2a server URL?

Open **API's & Integration** → **a2a Server**. The second card, **Your a2a Server url is:**, shows it with a **Copy to clipboard** button. It has the shape `https://<your console host>/v1/<your instance id>/a2a` and is unique to your instance.

### How do a2a clients authenticate?

With an API key sent as a header: `Authorization: Bearer <your API key>`. Create the key with **Create ApiKey** on [API keys](/configuration/administration/api-keys/). A key with no scope selected grants full access, so scope keys you give to outside systems.

### Should I use MCP Server or a2a Server?

Both expose your mAIstro agents; pick the protocol your client speaks. MCP suits LLM applications that call tools over the Model Context Protocol ([MCP server](/integrations/mcp-server/)); a2a suits agent frameworks and orchestrators that speak Agent-to-Agent.

### How do I call another company's a2a agent from one of my agents?

That is the client direction, handled inside an agent by the [a2a client](/maistro/ntl/integrations/a2a/). The a2a Server screen only covers other systems calling your agents.

### Is there anything to configure on the a2a Server screen?

No. The screen is read-only: it shows the URL, the header format and a link to the a2a project. Access is controlled by the API key you create and how you scope it.
