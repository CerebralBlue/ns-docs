---
title: "NICE CXone"
description: ">"
---

## Architecture Overview

The following diagram illustrates the end-to-end flow from the Chat Point of Contact within NICE CXone to your NeuralSeek mAIstro Agent via the Custom Exchange Endpoint.

![Architecture Overview](/img/integrations/nice-cxone/nice_cxone_integration.png)

<details>
<summary>Chat Point of Contact</summary>

The entry point where the customer initiates a conversation, typically via webchat, mobile app, or messaging platforms, connecting directly to NICE CXone.

</details>

<details>
<summary>Studio Script</summary>

NICE CXone Studio Script controls the flow of interactions, integrating the Custom Exchange Endpoint to send and receive user messages dynamically.

</details>

<details>
<summary>Custom Exchange Endpoint</summary>

Acts as the HTTP interface between CXone and external services, forwarding user requests to your Proxy Tunnel and handling responses from the Virtual Agent.

</details>

<details>
<summary>Proxy Tunnel</summary>

A secure communication channel used to connect NICE CXone’s environment to your backend services and Virtual Agent without exposing public endpoints.

</details>

<details>
<summary>Virtual Agent</summary>

Your AI-based chatbot or Virtual Assistant that processes user inputs and returns context-aware responses, integrated with NICE CXone through the Proxy Tunnel.

</details>

## CXone Configuration

This section outlines the required CXone configuration settings for the Point of Contact integration.

## NICE CXone Studio script

For the NeuralSeek integration test, you will use the standard `VAHSampleChatScript` provided by NICE CXone. This script handles the communication between CXone Studio and your Virtual Agent via the Virtual Agent Hub (VAH) Custom Exchange Endpoint.

You can download the Studio Script from the official NICE CXone resources here: 
<!-- [Download Chat Sample Script](scripts/TDD_TEXT_VAHSampleChatScript.json) -->
::ns-button[Download sample chat script]{href="/files/integrations/nice-cxone/TDD_TEXT_VAHSampleChatScript.json" variant=primary}

![NICE CXone sample script for Chat](/img/integrations/nice-cxone/virtual_agent_hub_sample_chat_script.png)
![Virtual Agent Hub Text Bot Welcome intent flow](/img/integrations/nice-cxone/text_bot_welcome_message_flow.png)
![Virtual Agent Hub Text Bot conversational flow](/img/integrations/nice-cxone/text_bot_conversational_flow.png)

The script manages:

- Handling inbound chat requests via ACD Chat channel.
- Exchanging messages with your NeuralSeek Virtual Agent through the VAH endpoint.
- Managing session flow and error handling within the CXone Studio environment.

The first part of the flow handles the welcome message intent, and the latter handles the following conversational flow between the user and the NeuralSeek mAIstro agent.

<details>
<summary>Studio script for production</summary>

No custom modifications to the script are required for basic integration testing with NeuralSeek. For production environments, you can extend or modify the script based on your specific business logic.

</details>

### ACD Chat Configuration

![ACD configuration Sidebar](/img/integrations/nice-cxone/nice_cxone_sample_configuration.png)

<details>
<summary>Sample Configuration</summary>

```md
Campaign: 
  - Campaign Name: Hospital Patient Digital Engagement
Skill:
  - Media Type: Chat
  - Skill Name: Chat - Appointment Scheduling
  - Campaign: Hospital Patient Digital Engagement
Chat Profile:
  - Profile Name: Chat Widget V2
  - Interface: V2 (HTML5)
Point of Contact:
  - Media Type: Chat
  - Name: Chat - Home Page
  - Point of Contact:
  - Skill: Chat - Appointment Scheduling
  - Script: VAHSampleChatScript
  - Chat Profile: Chat Widget V2
```

</details>

## Service Endpoint Authorization

The authorization mechanism for accessing the NeuralSeek Virtual Agent service endpoint is based on an API key passed through a custom request header.

![NeuralSeek mAIstro endpoint](/img/integrations/nice-cxone/maistro_endpoint.png)

### Authorization Method

**Header-based API Key authentication** is used. This ensures secure and straightforward access control.

### Required Header

- `apiKey`: `<your-neuralseek-api-key>`

The API key value will vary depending on the client and environment (staging or production).

No additional authentication mechanisms (such as OAuth) are required. This simplifies integration while maintaining secure access through per-client API key management.

## Virtual Agent Hub Configuration

This section defines the necessary configuration for the Virtual Agent Hub (VAH) to connect with your NeuralSeek mAIstro Agent.

![Virtual Agent Hub Configuration for NeuralSeek mAIstro Agent](/img/integrations/nice-cxone/virtual_agent_hub_configuration.png)

### Webhook URL
```
https://api.neuralseek.com/v1/<your-neuralseek-instance>/maistro
```

### Endpoint Parameters
- None required.

### Custom Headers (Required for NeuralSeek)
- `apiKey`: `<your-neuralseek-api-key>`  
- `overrideschema`: `"true"` – Accepts the request schema coming from Virtual Agent Hub.  
- `overrideagent`: `proxy_tunnel_v3_agent` – The mAistro agent.  
- `debug`: `"true"` – Recommended during setup to include debug details; disable for production.

### Timeout
- No change needed.

### Integration Version
- Version **3.0.0** is recommended for this integration.

### Authorization and OAuth
- No authorization header or OAuth configuration required.

<details>
<summary>Note</summary>

Make sure that each TextBot Exchange action in your NICE CXone script is linked to the Neuralkseek virtual agent. You’ll know it’s selected when you see the green check mark next to its name in the Virtual Agent Hub.

</details>

## Proxy Tunnel

The NeuralSeek integration uses a pre-configured proxy tunnel agent called `proxy_tunnel_v3_agent`.  
This agent is designed to be compatible with CXone Textbot Exchange version 3.0, and also supports versions 1.0 and 2.0.  
Version 3.0 is recommended for optimal flexibility and feature support.

![Proxy tunnel mAIstro Agent](/img/integrations/nice-cxone/proxy_tunnel_maistro_agent.png)

### Hosting

The proxy tunnel is hosted directly within NeuralSeek as a **no-code Maistro agent**, requiring no additional infrastructure from the client side.  
This setup reduces maintenance overhead and allows for rapid customization.

### Customization and Expansion

The `proxy_tunnel_v3_agent` can be customized and extended within NeuralSeek to accommodate specific client use cases and workflows.

### Failover Strategy

As the proxy tunnel is managed within NeuralSeek's cloud infrastructure, standard cloud resilience applies.  
Clients do not need to set up a separate failover mechanism.

### NeuralSeek Template Language (NTL)

**NTL (NeuralSeek Template Language)** is a simple, declarative language used to define NeuralSeek agents.  
It allows you to easily share, customize, and extend agent behavior without writing complex code.

Below is the NTL configuration for the `proxy_tunnel_v3_agent` used in this integration:

### NTL Code Example

Below is an example of NeuralSeek Template Language (NTL) code.  
You can copy it easily using the button provided.

<details>
<summary>Proxy tunnel mAIstro agent NTL (NeuralSeek Template Language)</summary>

```text
<< name: botSessionState, prompt: false >>=>{{ jsonToVars  }}
{{ condition  | value: "'<< name: userInputType >>' == '5'" }}=>{{ variable  | name: "nextPromptSequence" | value: "{\"prompts\":[{\"transcript\":\"Welcome to CareHaven Health, What can I do for you?\"}]}" }}=>{{ variable  | name: "intentInfo" | value: "{\"Slots\": {},\"intent\":\"Welcome\",\"intentConfidence\":\"100\"}" }}
{{ condition  | value: "'<< name: userInputType >>' == '1'" }}=>{{ seek  | query: "<< name: followUpCategory, prompt: false >>
<< name: followUpQuery, prompt: false >><< name: userInput, prompt: false >>
<< name: followUpContext, prompt: false >><< name: dataPoints, prompt: false >>" }}=>{{ variable  | name: "seekResult" }}
<< name: seekResult, prompt: false >>=>{{ jsonToVars  }}
{{ condition  | value: "'<< name: intentInfo.Slots, prompt: false >>' == '[object Object]'" }}=>{{ variable  | name: "Slots" | value: "{}" }}
{{ condition  | value: "'<< name: botSessionState.dataPoints, prompt: false >>' == '[object Object]'" }}=>{{ variable  | name: "dataPoints" | value: "''" }}
{{ condition  | value: "'<< name: botSessionState.isCompleted, prompt: false >>' = ''" }}=>{{ variable  | name: "isCompleted" | value: "false" }}
{{ varsToJSON  | path: "botSessionState.dataPoints" | variable: "botSessionStateDataPoints" | includePath: "false" | output: "" }}
{{ varsToJSON  | path: "botSessionState.isCompleted" | variable: "botSessionStateIsCompleted" | includePath: "false" | output: "" }}
{{ condition  | value: "'<< name: seek.categoryName >>' == 'FAQ'" }}=>{{ variable  | name: "nextPromptSequence" | value: "{\"prompts\":[{\"transcript\":\"<< name: seekResult>>\",\"textToSpeech\":\"<< name: seekResult >>\"}]}" }}=>{{ variable  | name: "intentInfo" | value: "{\"Slots\": {},\"intent\":\"NLU_NEEDED\",\"intentConfidence\":\"100\"}" }}
{{ condition  | value: "<< name: seek.category >> == 706287" }}=>{{ variable  | name: "nextPromptSequence" | mode: "" | value: "{\"prompts\":[{\"transcript\":\"<< name: nextPromptSequence.prompts[0].transcript, prompt: false >>\",\"textToSpeech\":\"<< name: nextPromptSequence.prompts[0].textToSpeech, prompt: false >>\"}]}" }}=>{{ variable  | name: "intentInfo" | value: "{\"Slots\": {},\"intent\":\"NLU_NEEDED\",\"intentConfidence\":\"100\"}" }}=>{{ variable  | name: "botSessionState" | value: "{\"lastIntent\":\"<< name: seek.intent, prompt: false >>\",\"followUpQuery\":\"<< name: botSessionState.followUpQuery, prompt: false >>\",\"followUpCategory\":\"<< name: botSessionState.followUpCategory, prompt: false >>\",\"followUpTurn\":\"<< name: botSessionState.followUpTurn, prompt: false >>\",\"dataPoints\":\"<< name: botSessionStateDataPoints, prompt: false >>\",\"isCompleted\":\"<< name: botSessionState.isCompleted, prompt: false >>\"}" | mode: "overwrite" }}
{{ condition  | value: "'<< name: userInputType >>' == '2'" }}=>{{ condition  | value: "AND('<< name: base64WavFile >>' == '')" }}=>
TREATMENT: base64 audio=>{{ variable  | name: "nextPromptSequence" | value: "{\"prompts\":[{\"transcript\":\"No audio found\"}]}" }}
{{ condition  | value: "'<< name: userInputType >>' == '0'" }}=>{{ condition  | value: "AND('<< name: mediaType >>' == 'voip')" }}=>
TREATMENT: no input=>{{ variable  | name: "nextPromptSequence" | value: "{\"prompts\":[{\"base64EncodedG711ulawWithWavHeader\":\"<< name: base64WavFile >>\"}]}" }}
{{ condition  | value: "'<< name: userInputType >>' == '0'" }}=>{{ condition  | value: "AND('<< name: mediaType >>' != 'voip')" }}=>
TREATMENT: no input=>{{ variable  | name: "intentInfo" | value: "{\"Slots\": {},\"intent\":\"NLU_NEEDED\",\"intentConfidence\":\"100\"}" }}
{{ condition  | value: "'<< name: botSessionState, prompt: false >>' == ''" }}=>{{ variable  | name: "botSessionState" | value: "{}" }}
{{ variable  | name: "errorDetails" | value: "{\"errorBehaviour\":0,\"errorPromptSequence\":{\"prompts\":[{}]}}" }}=>{{ variable  | name: "nextPromptBehaviours" | value: "null" }}=>{{ variable  | name: "customPayload" | value: "{}" }}
{{ variable  | name: "branchName" | value: "PromptAndCollectNextResponse" }}
{"branchName":"<< name: branchName, prompt: false >>",
"nextPromptSequence":<< name: nextPromptSequence, prompt: false >>,
"intentInfo":<< name: intentInfo, prompt: false >>,
"nextPromptBehaviours":<< name: nextPromptBehaviours, prompt: false >>,
"errorDetails":<< name: errorDetails, prompt: false >>,
"customPayload":<< name: customPayload, prompt: false >>,
"botSessionState":<< name: botSessionState, prompt: false >>}   
```

</details>

## NeuralSeek mAIstro Agent use case

The NeuralSeek mAIstro Agent demonstrates how CXone can orchestrate multi‑turn conversations using NeuralSeek’s agentic AI framework. In this use case, the agent is configured to handle appointment scheduling by collecting all required user inputs, maintaining session state, and generating structured JSON outputs compatible with Virtual Agent Hub. The workflow leverages NeuralSeek Template Language (NTL) to define conversation logic, enforce required fields, and determine when the session is complete, ensuring the Virtual Agent can pass validated data back to downstream CXone systems.


![NeuralSeek Appointment Scheduling Use Case](/img/integrations/nice-cxone/sample_appointment_scheduling_agent.png)
![NeuralSeek mAIstro Agent Use Case](/img/integrations/nice-cxone/nice_cxone_neuralseek_use_case.png)

The diagram and accompanying NTL example illustrate how the mAIstro Agent manages the full appointment scheduling workflow. Incoming user input is evaluated, missing fields are requested in a single prompt to minimize conversation turns, and session state is continuously updated in botSessionState. When all required fields are collected, the agent generates a final JSON response that includes a structured summary for CXone, while clearing the session state to prepare for the next interaction.

<details>
<summary>Appointment scheduling Agent NTL (NeuralSeek Template Language)</summary>

```text
{{ seekIn  }}=>{{ variable  | name: "seekInput" | value: "<< name: seekIn.originalQuery, prompt: false >>" | mode: "overwrite" }}
{{ LLM  | prompt: "You are CareHaven Health's virtual scheduling assistant. Your job is to collect all required patient details to book healthcare appointments.

**Required Fields**: Email, DoctorSpecialty, PreferredDate, PreferredTime  
**Response**: Return valid JSON (no markdown).

**Schema**:
{
\"nextPromptSequence\":{\"prompts\":[{\"transcript\":\"\",\"textToSpeech\":\"\"}]},
\"intentInfo\":{\"Slots\":{},\"intent\":\"\"},
\"botSessionState\":{\"lastIntent\":\"<< name: seek.intent, prompt: false >>\",\"followUpQuery\":\"User input: \",\"followUpCategory\":\"Category: Appointments\",\"followUpTurn\":\"Last collected data: \",\"dataPoints\":{},\"isCompleted\":false}
}

**Instructions**:
- Always return valid JSON matching the type.
- Use dataPoints to pre-fill Slots.
- Do not modify the values of followUpQuery, followUpCategory, or followUpTurn.
- **CRITICAL**: If ANY fields are missing, ask for ALL missing fields in a SINGLE message in the transcript. Do not ask for fields one by one - gather all missing information at once to minimize conversation turns.
- Only set isCompleted: true when ALL required fields (Email, DoctorSpecialty, PreferredDate, PreferredTime) are provided.
- If all fields are filled, isCompleted: true and transcript confirms booking.

**Input**: 
<< name: seekInput, prompt: false >>

**Important**
- Always return a complete JSON with all closed braces.
- Ask for multiple missing fields together, not individually." | cache: "true" | stream: "disable_streaming" | modelCard: "ns-claude3.5-haiku" }}=>{{ variable  | name: "llmResponse" }}
<< name: llmResponse, prompt: false >>=>{{ jsonToVars  }}
{{ condition  | value: "'<< name: botSessionState.isCompleted, prompt: false >>' == 'true'" }}=>{{ LLM  | prompt: "Create a clean summary with the appointment details provided below. Return the summary in the required JSON format.

**Response**: Return valid JSON (no markdown).

**Schema**:
{
\"nextPromptSequence\":{\"prompts\":[{\"transcript\":\"\",\"textToSpeech\":\"\"}]},
\"intentInfo\":{\"Slots\":{},\"intent\":\"\"},
\"botSessionState\":{}
}

**Instructions**:
- Always return valid JSON matching the exact schema above.
- Put the appointment summary in the transcript field
- Format the summary with each detail on a separate line: Email, Doctor Specialty, Preferred Date, Preferred Time
- Use the format: \"Email: [value]\" for each line
- Leave botSessionState as an empty object {}
- Leave intentInfo.Slots and intentInfo.intent as empty

<< name: botSessionState.dataPoints.Email, prompt: false >>
<< name: botSessionState.dataPoints.PreferredDate, prompt: false >>
<< name: botSessionState.dataPoints.PreferredTime, prompt: false >>
<< name: botSessionState.dataPoints.DoctorSpecialty, prompt: false >>

**Important**
- Always return a complete JSON with all closed braces.
- The summary goes in the transcript field, not as separate text.
- botSessionState must be empty: {}" | cache: "true" | stream: "disable_streaming" | modelCard: "ns-claude3.5-haiku" }}=>{{ variable  | name: "llmResponse" }}
<< name: llmResponse, prompt: false >>
```

</details>

### Governance and guardrails

The NeuralSeek mAIstro Agent demonstrates a reference implementation of an agent-driven workflow using NeuralSeek’s NTL (NeuralSeek Template Language). This use case focuses on an appointment scheduling scenario, where the agent manages multi-turn conversations, captures required data fields, and maintains session state across interactions. The mAIstro Agent executes LLM-driven responses under strict governance controls, including PII redaction, prompt injection detection, semantic scoring, and length constraints. All collected data is structured in JSON for compatibility with CXone’s Virtual Agent Hub, enabling downstream automation such as scheduling, logging, or analytics.

![mAIstro seek node settings](/img/integrations/nice-cxone/maistro_no_code_seek_node_settings.png)
![multi agent seek flows](/img/integrations/nice-cxone/multi_agent_seek_flows.png)

In this Agentic AI architecture, Governance configurations and guardrail settings can be modified for each agent flow. The NICE CXone hits the proxy tunnel mAIstro agent using the mAIstro API, and this agent calls Seek with the required context, where it can be properly routed to the appropriate agent, such as Appointments, FAQ, etc.

![NeuralSeek agent custom configurations](/img/integrations/nice-cxone/agent_governance_configuration.png)
![NeuralSeek agent custom guardrails](/img/integrations/nice-cxone/agent_guardrails_settings.png)
