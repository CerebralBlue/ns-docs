---
title: "MCP client"
description: "Call external MCP (Model Context Protocol) tools and agents from inside your own agent."
---

## MCP

Call a tool by MCP.

:::note[Parameters]

- **baseURL**: The URL of the MCP server

- **endpoint**: MCP endpoint (/mcp)

- **action**: The action to take

- **method**: The method to send

- **tool**: The tool to call

- **params**: The params

- **arguments**: The Arguments

- **headers**: The headers

- **bearer**: The bearer token

- **timeout**: 
    - **text**: The timeout
    - **min**: 1000
    - **max**: 60000
    - **step**: 1000
    - **default**: 30000
:::
