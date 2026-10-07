---
title: "Corporate Logging"
description: "Corporate Logging connects NeuralSeek to your own audit log store — ElasticSearch, OpenSearch or a mAIstro agent — so every request and response to the Seek API endpoint and the Curate tab is recorded where your organization keeps its audit trail."
---

Corporate Logging sends NeuralSeek's traffic to an audit log store your organization runs. Once it is connected and enabled, every request and response to the Seek endpoint of the [NeuralSeek API](/integrations/rest-and-console-api/), and activity on the [Curate](/seek/curation/) tab, is written to your ElasticSearch or OpenSearch cluster, or handed to a [mAIstro](/maistro/overview/) agent you build to process it. Admins use it when an audit or retention policy requires the record of what users asked and what NeuralSeek answered to live in a system the organization controls.

## How Corporate Logging works

Corporate Logging is a section of the **Edit Configuration** dialog in [Neural Config](/configuration/neural-config/). To reach it, open **Neural Config**, select the **Default Config / Answer Generation** node, open **Edit Configuration** and expand **Corporate Logging**. Like every section of that dialog, your changes take effect when you select **Save** at the bottom of the dialog.

### What Corporate Logging records

The section's help text states its scope: "Connect NeuralSeek to a corporate audit logging endpoint. When connected and enabled, all requests and responses to the Seek api endpoint, as well as the Curate tab will be logged to your Elastic or OpenSearch instance."

![The Edit Configuration dialog in Neural Config with the Corporate Logging section expanded below Corporate Document Filter](/img/neural-config/corporate-logging.png)

Two sources feed the log:

- **The Seek API endpoint** — each request your applications send to Seek and the response NeuralSeek returns.
- **The Curate tab** — activity on the Curate tab, where your team reviews and edits answers.

Logging starts only when both conditions in the help text hold: a log store is connected, and logging is enabled.

### Enable Corporate Logging

**Enable Corporate Logging** is the on/off switch for the whole section. It has two options:

- `Disabled` — nothing is sent to the log store. While logging is disabled, **Logger Endpoint**, **Logger API Key**, **Test** and **Prompt Logging** are unavailable and cannot be edited.
- `Enabled` — NeuralSeek sends the traffic described above to the store you configure below, and the connection fields become editable.

![The Enable Corporate Logging list open, showing the options Disabled and Enabled](/img/neural-config/corporate-logging--options-enable-corporate-logging.png)

Set it to `Enabled` first, then fill in the connection details.

### Logger Service

**Logger Service** decides what kind of store receives the log:

| Option          | What it is                                                                       | When to choose it                                                            |
| --------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ElasticSearch` | An Elasticsearch deployment, for example on Elastic Cloud.                       | Your audit logs already live in Elasticsearch.                               |
| `OpenSearch`    | An OpenSearch cluster.                                                           | Your organization runs OpenSearch rather than Elasticsearch.                 |
| `mAIstro`       | A mAIstro agent you build as a corporate logger.                                 | You want to transform, filter or forward each log entry with your own logic. |

![The Logger Service list open, showing the options ElasticSearch, OpenSearch and mAIstro](/img/neural-config/corporate-logging--options-logger-service.png)

A corporate logger agent for the `mAIstro` option starts with one of two NTL nodes from the Corporate Logging category, both of which must be the first step of the agent ([pipeline hooks](/maistro/ntl/pipeline-hooks/)):

| Node            | Variables it provides                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `corpLogIn`     | `corpLogIn.log` (the log JSON), `corpLogIn.id` (the id of the log), `corpLogIn.function` (the function that generated the log, for example `seek`, `seekPrompt`, `maistro`) |
| `corpLogReplay` | `corpLogReplay.id` (the id of the log), `corpLogReplay.function` (the function that generated the log)                                                                       |

### Connection details

The connection fields below are the ones shown when **Logger Service** is `ElasticSearch`.

![The Corporate Logging section: Enable Corporate Logging, Logger Service, Logger Endpoint, Logger API Key, and the Test and Prompt Logging buttons](/img/neural-config/corporate-logging--enable-corporate-logging.png)

- **Logger Endpoint** — the URL of your deployment. The field's placeholder shows the expected shape: an Elastic Cloud deployment URL such as `https://my-deployment.es.azure.elastic-cloud.com`.
- **Logger API Key** — an API key that NeuralSeek uses to write to that deployment. The key is masked as you type; use the show/hide control at the right of the field to check what you entered. Give the key only the permissions logging needs, so the credential stored in NeuralSeek cannot read or change other data in your cluster.
<!-- UNCONFIRMED: Test checks the connection to the endpoint with the key entered — purpose from the button's position and the route's gap list; the result message was not captured -->
- **Test** — checks that NeuralSeek can reach the endpoint with the key you entered.

To connect a log store:

1. Set **Enable Corporate Logging** to `Enabled`.
2. Choose the store in **Logger Service**.
3. Enter the **Logger Endpoint** and the **Logger API Key**.
4. Select **Test** to check the connection.
5. Select **Save** at the bottom of the Edit Configuration dialog.

### Prompt Logging

**Prompt Logging** sits under the connection fields and becomes available once **Enable Corporate Logging** is `Enabled`. Decide whether your log store is cleared to hold prompt content before you turn it on.

<!-- UNCONFIRMED: Prompt Logging adds the prompts NeuralSeek sends to the LLM to the log, after you accept a non-disclosure agreement — inferred from the button name and the route's gap list; the dialog it opens was not captured -->
Selecting it adds the prompts NeuralSeek sends to the LLM to the corporate log, after you accept a non-disclosure agreement.

### Corporate Logging and the Governance logs

NeuralSeek also keeps its own log views in Governance: [Seek Logs](/governance/analytics/seek-logs-and-config-insights/) under Seek Governance, and [mAIstro Logs](/governance/analytics/agent-logs-tokens-cost/) under mAIstro Governance. Use those to browse recent traffic inside NeuralSeek. Corporate Logging is a separate path that writes to a store you own, under your retention rules.

<!-- UNCONFIRMED: Red Team Testing's Test logs panel and Replay rely on Corporate Logging (Replay with an Elasticsearch store) — from the old Replay page and the Red Team Testing gap list; not shown on a captured screen -->
Two features build on the corporate log: the **Test logs** panel of [Red Team Testing](/governance/red-team-testing/), and [Replay](/governance/replay/) of a logged answer.

## When to use it

- **Audit and compliance.** Your organization must keep a record of what users asked and what the system answered, in a store it controls and under its own retention rules.
- **Central log analysis.** You already collect application logs in Elasticsearch or OpenSearch and want NeuralSeek's Seek traffic next to them, searchable with the same tools.
- **Custom processing.** You want each log entry transformed, filtered or forwarded before it is stored — choose `mAIstro` and build a corporate logger agent.

It is the wrong tool when you only want to look at recent questions and answers: [Seek Logs](/governance/analytics/seek-logs-and-config-insights/) shows them inside NeuralSeek.

## FAQ

### What exactly gets logged?

All requests and responses to the Seek API endpoint, and activity on the Curate tab. **Prompt Logging** is a separate step on top of that.

### Can I send the log somewhere other than Elasticsearch?

Yes. **Logger Service** also offers `OpenSearch`, and `mAIstro` to hand each log entry to an agent you build.

### Why can't I fill in the Logger Endpoint?

The connection fields stay unavailable until **Enable Corporate Logging** is set to `Enabled`.

## Related

- [Neural Config options](/configuration/neural-config/) — every section of the Edit Configuration dialog
- [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/)
- [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/)
- [Red team testing](/governance/red-team-testing/)
- [Replay](/governance/replay/)
- [Pipeline hooks](/maistro/ntl/pipeline-hooks/) — the `corpLogIn` and `corpLogReplay` nodes
- [Answer curation](/seek/curation/)
- [Secrets](/configuration/neural-config/secrets/) — named values a mAIstro corporate logger agent can use without carrying credentials in the agent
