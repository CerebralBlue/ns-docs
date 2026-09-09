---
title: "GuardRails"
description: "The GuardRails nodes: HTTP blocking, JWT signing and validation, schema checks, PII detection and redaction, rate limiting, prompt-injection and profanity filtering, and action risk scoring."
---

## HTTP Guardrails

Block outbound http requests after this node according to your config.  Use caution as this guardrail will affect any HTTP-dependant node after it.

:::note[Parameters]

- **blockedMethods**: An array of methods to block

- **url**: An array of strings or regexes to block from the URL

- **path**: An array of strings or regexes to block from the path

- **query**: An array of strings or regexes to block from the query

- **body**: An array of strings or regexes to block from the body

- **allowDisable**: Allow the block to be disabled
:::

---

## Disable HTTP Guardrails

Disable a previously installed HTTP Guardrail

---

## Create JWT

Create/Sign a JWT

:::note[Parameters]

- **signingkey**: Private key for signing the JWT

- **algorithm**: Algorithm for signing the JWT

- **body**: JWT payload, must be valid JSON
:::

---

## Validate JWT

Validate/Verify a JWT. The JWT token flows in from the pipeline (previous node output). Provide either a static verification key OR a JWKS auth URL for key fetching. On success, the decoded payload is pushed to the pipeline and available as the jwtValidate.payload variable.

:::note[Parameters]

- **verifykey**: Public key (RS256) or shared secret (HS256) for verifying the JWT

- **algorithm**: Algorithm used to sign the JWT

- **authurl**: JWKS endpoint URL (e.g. https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys). Provide this OR a static key, not both.
:::

---

## Schema Check

Validate input against a type or JSON Schema. Sets schemaCheck.valid (true/false) and schemaCheck.errors (array of error messages). Chain data into this node. Use with condition + startLoop for LLM output retry patterns.

:::note[Parameters]

- **type**: Quick type check (string, number, boolean, json, array, object, email, url, date)

- **schema**: JSON Schema for complex validation. Example:
{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
"name": { "type": "string" },
"age": { "type": "number", "minimum": 0 }
  }
}
:::

---

## PII Redact Image

Runs OCR over the input image, finds PII (via the platform PII engine + your wordlist), and burns black rectangles over the matched words at the pixel level. The redaction is destructive - the output is a flattened PNG with the masked pixels overwritten, not an overlay that can be removed.

:::note[Parameters]

- **image**: Source image to redact. A base64-encoded image string. Leave empty to consume the chained pipe value.

- **imageFile**: Image file uploaded to this instance

- **wordlist**: Additional patterns to redact, one per line. Each line is a regex pattern (plain text is a valid regex). Matching is case-insensitive. These run in addition to whatever the platform PII engine catches.

- **usePII**: Run the platform's built-in PII detectors against the OCR'd text. Uses the same configuration as the instance's text PII filter (set in the PII tab of Configure). Default: true.

- **usePIIModel**: Also run LLM-based PII detection. Catches contextual PII (names not in your list, etc.) that regex misses. Adds an LLM call per redaction, has a token cost. Default: false.

- **name**: Optional output filename.
:::

---

## Protect

Protect from prompt injection. Add custom blocked prompt words via Platform Preferences on the Configure tab.

:::note[Parameters]

- **piThreshold**: 
    - **text**: The threshold to block all input (0.0 - 1.0)
    - **min**: 0
    - **max**: 1
    - **step**: 0.01
    - **default**: 0.9

- **piRemoveThreshold**: 
    - **text**: The threshold to remove offending phrases (0.0 - 1.0)
    - **min**: 0
    - **max**: 1
    - **step**: 0.01
    - **default**: 0.6
:::

---

## Profanity Filter

Filter for profane text and block it.

---

## Remove PII

Find and mask PII in the input text, based on the settings in yout Configuration tab

---

## Identify PII

Find PII via the built-in NeuralSeek and custom added REGEX patterns

---

## Rate Limit

Checks whether the configured number of calls has been exceeded within the time period. If both IP and Email are provided, the limit is keyed on the combination of both. If neither is provided, this limits based on the IP address and account of the agent run request.

This node provides the following variable:

- rateLimit.limited: true if the limit has been exceeded, false otherwise

:::note[Parameters]

- **ip**: IP to rate limit on (optional)

- **email**: Email to rate limit on (optional)

- **usesAllowed**: 
    - **text**: Number of calls allowed within the time period
    - **min**: 1
    - **max**: 10000
    - **step**: 1
    - **default**: 10

- **timePeriod**: 
    - **text**: Time period in seconds
    - **min**: 1
    - **max**: 86400
    - **step**: 1
    - **default**: 60
:::

---

## Score Risk

Score the risk of an Action.

:::note[Parameters]

- **action**: A sentence or prompt that the user wants to run

- **permissions**: The user's permissions, separated by comma

- **destination**: The destination of the action

- **external**: Is this an external action?

- **tool**: Which Agent or tool will be called

- **records**: How many records will be affected
:::
