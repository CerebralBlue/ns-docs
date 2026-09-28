---
title: "MCP server"
description: "The MCP Server screen gives you your instance's MCP server URL and the Authorization: Bearer header format, so an MCP client can connect with a NeuralSeek API key and consume your mAIstro agents."
---

## What is it

The **Model Context Protocol Server** screen shows how to reach your NeuralSeek mAIstro agents from outside NeuralSeek over the Model Context Protocol (MCP). The screen introduces MCP as "an open protocol that standardizes how applications provide context to LLMs", and states what it gives you: "You can consume NeuralSeek mAIstro Agents via MCP by providing your unique URL and an api key to an MCP client or LLM."

The screen has no settings. It shows two values to copy (your server URL and the authentication header format) and a link to the Model Context Protocol specification.

This page covers the **server** direction: other applications call your agents. The opposite direction, where one of your agents calls a tool on someone else's MCP server, is the [MCP client](/maistro/ntl/integrations/mcp/) node in NTL.

## Why it matters

An agent you build in mAIstro usually runs inside NeuralSeek, through the REST API or one of the chat integrations. An MCP client, such as an AI assistant, an IDE or your own LLM application, expects its tools to come from an MCP server. With your MCP server URL and an API key, that client can use your mAIstro agents without an adapter or a custom connector written for NeuralSeek.

## When to use it

- **Use it** when an MCP-capable client or LLM should call your mAIstro agents.
- **Use the [MCP client](/maistro/ntl/integrations/mcp/) node instead** when your agent is the one that needs an external tool. This screen does not configure outgoing calls.
- **Use the [a2a server](/integrations/a2a-server/) instead** when the caller speaks the Agent-to-Agent protocol rather than MCP. The two screens are laid out the same way: a URL, a Bearer header and a link to the protocol.
- **Use the [REST and Console API](/integrations/rest-and-console-api/)** when you are writing code that calls NeuralSeek directly and you do not need an MCP client between your code and the agents.

## How it works

### What the screen gives you

Open **API's & Integration** in the top navigation, then **MCP Server** in the side navigation. The screen's title is **Model Context Protocol Server**, followed by one paragraph and four numbered cards.

![The Model Context Protocol Server screen: an introduction and four numbered cards with the server URL, the Bearer header format and a link to modelcontextprotocol.io](/img/admin-tools/mcp-server.png)

1. **What it exposes.** Card 1 says you can consume NeuralSeek mAIstro agents via MCP by giving your URL and an API key to an MCP client or LLM.
2. **Your MCP Server url is:** card 2 shows your server URL in a code box. The URL has the form `https://<your console host>/v1/<your instance id>/mcp`, and each instance has its own. Use **Copy to clipboard** next to the box to copy it rather than typing it.
3. **The authentication header.** Card 3 reads "Generate an api key, and then use it as an authentication header value, with the format:" followed by `Authorization: Bearer [ Generate an API Key ]`. The part in brackets is a placeholder. Replace it, brackets included, with a key you create on the [API keys](/configuration/administration/api-keys/) page. The code box has its own **Copy to clipboard** button.
4. **Learn more about MCP at** [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/), the protocol's own site.

The screen does not show a transport setting, a list of agents or a way to switch the server off.

### Connecting an MCP client

You need two things to connect a client: the URL from card 2 and an API key.

1. **Copy the URL.** On **MCP Server**, copy the value under **Your MCP Server url is:**.
2. **Create a key.** Go to **API Keys** in the same side navigation and select **Create ApiKey**. The **Add API Key** dialog opens.

   ![The Add API Key dialog: Key Name, Keys count, Expiration date and the Scope this API key groups](/img/admin-tools/create-apikey-panel.png)

   - Give the key a name that identifies the client using it. The field is **Key Name — required and must be unique**, so a separate key per client lets you tell them apart in the key list.
   - Set an expiration date if the client only needs access for a limited time. The field is marked **Expiration date optional**.
   - Consider scoping the key under **Scope this API key**. The dialog says: "Optional. Leave everything unchecked to grant full access." A key with nothing checked grants the client full access, not only access to your agents.

   Every field in the dialog is explained on [API keys](/configuration/administration/api-keys/).

3. **Configure the client.** In your MCP client, add a server with the URL from step 1 and a request header named `Authorization` whose value is `Bearer ` followed by your key, the same format card 3 shows. Where you enter the URL and header depends on the client. See your client's documentation for its configuration format.

Treat the key like a password. Anyone with the URL and the key can call your agents.

### Which agents are exposed and how they appear as tools

The screen tells you what the server exposes, your mAIstro agents, but it does not list them. You cannot choose on this screen which agents are included, and it does not show how each agent appears to a client.

<!-- UNCONFIRMED: every mAIstro agent in the instance is exposed, one MCP tool per agent — from the changelog entry "MCP Server. Now you can consume any mAIstro agent via Model Context Protocol (MCP)" and the brief; not shown on the screen or by a probe -->

MCP clients discover what a server offers by listing its tools. In general, you can expect every mAIstro agent in your instance to be offered as a tool.

<!-- UNCONFIRMED: the tool name is the agent name, the tool description is the agent description, and the tool's parameters are the agent's input variables — inferred in the brief from how MCP describes tools; not shown on the screen or by a probe -->

In that case, the client sees each tool under the agent's name, with the agent's description as the text an LLM reads when it decides whether to call the tool. The tool's inputs are the agent's input variables. A clear agent description therefore makes it more likely that the LLM picks the right agent.

To see exactly what your client receives, connect it and open its tool list.

<!-- UNCONFIRMED: checking specific agents under the Agents scope of the key limits which agents the MCP client can call or see — inferred in the brief from the Add API Key dialog; not tested -->

To limit what a client can reach, scope its key. The **Agents** group under **Scope this API key** in the **Add API Key** dialog lets you pick specific agents instead of granting full access.

## FAQ

### Where do I find my MCP server URL?

Open **API's & Integration** → **MCP Server**. Card 2, **Your MCP Server url is:**, shows it in the form `https://<your console host>/v1/<your instance id>/mcp`. Use **Copy to clipboard** to copy it. Each instance has its own URL.

### How does an MCP client authenticate?

With a NeuralSeek API key sent as a request header: `Authorization: Bearer <your key>`. Card 3 on the screen shows the format with a `[ Generate an API Key ]` placeholder. Create the key on the [API keys](/configuration/administration/api-keys/) page.

### What does NeuralSeek's MCP server expose?

Your mAIstro agents. The screen says: "You can consume NeuralSeek mAIstro Agents via MCP by providing your unique URL and an api key to an MCP client or LLM." The screen does not list the agents; your MCP client's tool list shows what it can call.

### Can I limit which agents a client can reach?

No control on this screen does that. The only control available is the API key: in the **Add API Key** dialog, **Scope this API key** has an **Agents** group. A key with nothing checked grants full access. Whether an Agents scope also filters the tool list the client sees has not been verified; connect the client with a scoped key and check its tool list.

### I want my agent to call someone else's MCP server. Is this the page?

No. This page covers exposing your agents to MCP clients. To call an external MCP server from inside an agent, use the [MCP client](/maistro/ntl/integrations/mcp/) node in NTL.

### Is there an equivalent for the Agent-to-Agent protocol?

Yes. The [a2a server](/integrations/a2a-server/) screen, next to MCP Server in the side navigation, gives you a URL and a Bearer header in the same layout, for clients that use the Agent-to-Agent protocol.
