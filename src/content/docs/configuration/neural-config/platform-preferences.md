---
title: "Platform Preferences"
description: "Platform Preferences is the section of the Edit Configuration dialog in Neural Config that sets instance-wide request behaviour: the generation timeout, how much conversation context is carried and for how long, cross-language and default output language, filter relaxation, plan streaming and logging, the one-way Hide API Keys switch, the virtual agent export format, stopwords and HTML cleansing, and the mAIstro agents run on save and after each Seek."
---

## What is it

**Platform Preferences** is the sixth section of the **Edit Configuration** accordion in Neural Config, between **Company / Organization Preferences** and [Corporate Document Filter](/governance/corporate-document-filter/). It is the section whose settings have the least in common with each other: what unites them is that each applies to the whole instance rather than to one knowledge base, one prompt or one category.

Grouped by what they touch, the section holds:

- how long a request may take, and how much of the conversation is carried into it and for how long;
- which language an answer comes back in, and whether cross-language answers are translated;
- whether a filtered search may be retried without its filter, and what is streamed or logged;
- whether connected-platform API keys stay visible to Configuration Admins;
- the output format used when the Curate tab builds a virtual agent, and whether links are embedded in answers;
- the stopwords and HTML that NeuralSeek strips;
- the mAIstro agents NeuralSeek runs on save and after each Seek.

Nothing here changes what is retrieved from the knowledge base ([KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)) or how the prompt is written ([Prompt Engineering](/configuration/neural-config/prompt-engineering/)).

## Why it matters

Most of the settings that make NeuralSeek fit the platform around it are on this screen. A chatbot host with a 30-second request limit, a channel that needs answers in the caller's language, an integration that expects Watson Assistant Actions rather than raw text — all of those are configured here, and a mismatch shows up as a broken integration rather than as a bad answer.

Three of these settings carry a cost that is not obvious from their labels. **Context Turns** trades documentation context for conversation memory, and the product's own help text recommends against raising it. **Cross Language** switches Semantic Scoring off for the answers it translates. **Hide API Keys** cannot be turned back off once it is on.

## When to use it

- Your chatbot platform times out before NeuralSeek returns an answer.
- Follow-up questions lose their subject, or one user's context is carried longer or shorter than you expect.
- Answers come back in the wrong language, or semantic scores disappeared after a language change.
- A filtered search returns nothing and you want NeuralSeek to retry without the filter — but never without certain keys.
- You need to stop Configuration Admins from reading connected-platform API keys.
- You are exporting a virtual agent from the Curate tab and need a particular format, or links inside the answers.
- Scraped HTML pages are bringing navigation and boilerplate into answers.
- Something has to run every time the configuration is saved, or after every Seek, without slowing the answer.

## How it works

### Where the section lives

Open **Neural Config**, click the **Default Config / Answer Generation** node in the routing tree, then **Edit Configuration**. In the accordion that opens, expand **Platform Preferences** — the sixth header, between **Company / Organization Preferences** and **Corporate Document Filter**.

![The Edit Configuration dialog with Platform Preferences expanded, showing the Timeout, Context Turns and Context Timeout - Session sliders, and the dialog footer with Propose Changes and Save](/img/neural-config/platform-preferences.png)

The dialog footer carries **Propose Changes** and **Save** — nothing on this page takes effect until one of them is used.

:::note
Every value quoted on this page is the value on the instance captured for it, not a product default. The controls in this section carry no default indicator on screen, so this page cannot tell you which of these values ship out of the box. Read your own instance before assuming.
:::

The first four settings are sliders, each with a **Slider value** box beside it: drag the slider or type the number. The two labels at the ends of the track are the range.

### Timeout

![The Timeout slider, range 4000 to 90000, reading 25000, with the Context Turns heading below it](/img/neural-config/platform-preferences--timeout.png)

**Timeout** — range `4000` to `90000`; `25000` on the instance captured here. The help text says what to set it to: "Language Generation Timeout (milliseconds). Set this to a few seconds less than the timeout of your chatbot platform. When timeout is reached Neuralseek will attempt to catch the timeout by serving the closest possible cached answer, if one is available."

So the timeout is not purely a failure boundary. Hitting it makes NeuralSeek fall back to the nearest cached answer where one exists — which is only useful if NeuralSeek gives up before your chatbot platform does. That is the reason for the "a few seconds less" guidance.

### Context Turns

![The Context Turns slider, range 0 to 50, reading 1, with the Context Timeout - Session heading below it](/img/neural-config/platform-preferences--context-turns.png)

**Context Turns** — range `0` to `50`; `1` on the instance captured here. "Maximum number of previous context turns to feed to the LLM. Increasing this is not recommended as it will reduce the available LLM context available to your documentation, and opens additional risk of attack from users trying to elicit inappropriate responses."

Raising it is a trade, and the product names both sides of it: less room in the prompt for retrieved documents, and more surface for a user steering the model through the conversation history. If follow-up questions are failing, try [Force carry context](#force-carry-context) before raising the turn count.

### Context Timeout - Session

![The Context Timeout - Session slider, range 0 to 999999, reading 360000, with the Context Timeout - User Only heading below it](/img/neural-config/platform-preferences--context-timeout-session.png)

**Context Timeout - Session** — range `0` to `999999`; `360000` on the instance captured here. "Timeout of a session_id based user session." This is the window for callers that pass a `session_id`: how long the conversation context behind that id is kept.

The screen does not label the unit of this slider. Whether `360000` means seconds or milliseconds is not something this page can tell you from the capture.

### Context Timeout - User Only

![The Context Timeout - User Only slider, range 0 to 999999, reading 1800](/img/neural-config/platform-preferences--context-timeout-user-only.png)

**Context Timeout - User Only** — range `0` to `999999`; `1800` on the instance captured here. "Timeout of a user based session with no session_id."

This is the second of two separate windows: one for callers that pass a `session_id`, one for callers identified only by user. On the instance captured here the user-only window is two hundred times shorter than the session one — that is this instance's choice, not a product rule, but it is a sensible one, since a user with no session boundary has nothing else to end their context. The unit is not labelled on screen for this slider either.

Which id a caller sends, and what the runtime does with it, is described from the request side on [Conversational context](/seek/conversational-context/); these two sliders and the next two settings are the console half of it.

### Context detection

![The Context detection field group: Detection Method reading Model Only, and the greyed-out mAIstro flow selector reading ex_Context_Grammar](/img/neural-config/platform-preferences--context-detection.png)

**Context detection** — "Use our (fast) model for carrying language context or use an LLM-based mAIstro flow for custom PoS tagging." Two selectors sit under it:

- **Detection Method** — `Model Only` on the instance captured here. The options are `Model Only`, `Model + mAIstro fallback` and `mAIstro Only`.

  ![The Detection Method menu open: Model Only, Model + mAIstro fallback, mAIstro Only](/img/neural-config/platform-preferences--options-detection-method.png)

- **mAIstro flow** — `ex_Context_Grammar` on the instance captured here; the options offered were `Disabled` and `ex_Context_Grammar`. This selector names the agent that does the part-of-speech tagging when the method includes mAIstro. While **Detection Method** reads `Model Only` the selector is greyed out, as in the crop above.

  ![The mAIstro flow menu open: Disabled, ex_Context_Grammar](/img/neural-config/platform-preferences--options-maistro-flow.png)

The built-in model is the fast path; the mAIstro options are for when you need custom tagging that the model does not do, at the cost of an LLM call per question.

Do not expect this menu to list every agent on your instance. During the capture, the playground's agent list (`list_agents` via the MCP) returned 16 agents, and `ex_Context_Grammar` was not one of them — while the **mAIstro flow** menu offered `ex_Context_Grammar` and none of those 16. So the menu is not simply the instance's saved agents. What it is instead — a fixed set of shipped examples, or only the agents built around the matching hook node — is not something the capture settles. Open it on your instance to see what it offers; the same applies to the two selectors under [Save Agents](#save-agents).

### Force carry context

![The Force carry context selector reading False, with its help text](/img/neural-config/platform-preferences--force-carry-context.png)

**Force carry context** — `False` on the instance captured here. "If no subject / nouns are found in a question assume the question is a follow on to the previous question."

This is the setting for a bare "why?" or "and the second one?". With it off, a question with no subject is answered on its own; with it on, it is treated as a continuation of the previous question. It is the cheaper fix for lost follow-ups than raising **Context Turns**, because it changes how one question is interpreted rather than how much history every question carries.

### Cross Language

![The Cross Language selector reading False, with the help text that Semantic Scoring is disabled on cross-language generation](/img/neural-config/platform-preferences--cross-language.png)

**Cross Language** — `False` on the instance captured here. "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled."

The second sentence is the part worth reading twice: turning cross-language translation on removes Semantic Scoring from the answers it translates, and the screen says so only here. If your guardrails depend on the semantic score, they are inactive for those answers. See [Semantic scoring](/governance/guardrails/semantic-scoring/) for what the score does and [Semantic model tuning](/configuration/semantic-model/) for where it is configured. The knowledge base language this setting compares against, and the language settings across the product, are on [Language handling](/configuration/language/).

### Relax Filters

![The Relax Filters selector reading False, and below it the Must Keep Keys text box with the placeholder a,b,c](/img/neural-config/platform-preferences--relax-filters.png)

**Relax Filters** — `False` on the instance captured here. "If no documents are found while filtering, relax the filter and try again." With it on, a filtered search that finds nothing is retried with the filter loosened rather than returning empty.

<!-- UNCONFIRMED: the old page described Relax Filters as "on by default" — the captured instance reads False and the screen shows no default marker, so this page does not state a default -->

The captured instance has it off; whether that is the product default is not shown on screen.

:::caution
Relaxing a filter after an empty result can widen what a user is allowed to see. If a filter is doing access control rather than relevance narrowing, list its key under **Must Keep Keys** so it is never relaxed — or leave **Relax Filters** off.
:::

**Must Keep Keys (filters to never remove) separated by comma** — a text box with the placeholder `a,b,c`; empty on the instance captured here. Keys listed here are excluded from the relaxation above. This is how a tenant, region or entitlement filter stays enforced while relevance filters are allowed to loosen. The label is the whole explanation the screen gives.

### mAIstro Stream Plan

![The mAIstro Stream Plan selector reading True, with its help text](/img/neural-config/platform-preferences--maistro-stream-plan.png)

**mAIstro Stream Plan** — `True` on the instance captured here. "Stream the Agent Plan." When an agent runs, its plan is streamed to the caller as it is built rather than delivered with the result. The help text is the whole of what the screen says about it.

### Log Alternate Configs

![The Log Alternate Configs selector reading True, with its help text](/img/neural-config/platform-preferences--log-alternate-configs.png)

**Log Alternate Configs** — `True` on the instance captured here. "When calling seek with a Proposal or Override of the configuration, should the answers be logged to the Curate Tab."

A Seek run against a proposed or overridden configuration is a test of a configuration you have not adopted; this decides whether those answers join your real ones in Curate. Leave it on if you want to review test answers there; turn it off if test traffic would pollute the curation queue.

### Hide API Keys

![The Hide API Keys selector reading False, with the help text ending "Once set to true this option cannot be disabled."](/img/neural-config/platform-preferences--hide-api-keys.png)

**Hide API Keys** — `False` on the instance captured here. The help text reads: "Hide API kets of connected platforms from Configuration Admins. By default API keys are only shown to users with Admin / Configure permissions. Setting this option to true will require you re-enter all API keys when importing a configuration file. Once set to true this option cannot be disabled." ("kets" is a typo on screen; the setting is about API keys.)

:::danger[This switch is one-way]
In the screen's own words: "Once set to true this option cannot be disabled." Turning **Hide API Keys** on also means, in the screen's words, that you "re-enter all API keys when importing a configuration file" from then on — which affects every restore from [Backup, restore & change logs](/configuration/backup-restore/). Decide before you save, not after.
:::

### Default Language

![The Default Language field group: the Default Output Language selector reading English, with its help text](/img/neural-config/platform-preferences--default-language.png)

**Default Language** — "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option." The selector under it is labelled **Default Output Language**, reading `English` on the instance captured here.

This is a default rather than a constraint: a caller that sets the `language` option overrides it per request. The option list opens with `Match Input` — which, as its name says, follows the language of the question — followed by the full language list, the same one the KnowledgeBase Language selector offers.

![The Default Output Language menu open: Match Input at the top, then the alphabetical language list](/img/neural-config/platform-preferences--options-default-output-language.png)

[Language handling](/configuration/language/) covers the language settings across the product and the full list, including the knowledge base language that **Cross Language** compares against.

### Virtual Agent Type

![The Virtual Agent Type selector reading Watson Assistant Actions, with its help text and the repeated label under it](/img/neural-config/platform-preferences--virtual-agent-type.png)

**Virtual Agent Type** — `Watson Assistant Actions` on the instance captured here, with the label **Virtual Agent Type** repeated under the selector. "When using the Curate tab to auto-buld a virtual agent, what format should be written to." ("auto-buld" is the screen's spelling.)

The options are `Watson Assistant Actions`, `AWS Lex V2`, `Kore.ai`, `Cognigy`, `Watson Assistant Dialog`, `Azure Knowledge Base` and `None / Webpage HTML`. Pick the one your chatbot platform imports. The export itself happens on the [Curate](/seek/curation/) tab.

![The Virtual Agent Type menu open: Watson Assistant Actions checked, AWS Lex V2, Kore.ai, Cognigy, Watson Assistant Dialog, Azure Knowledge Base](/img/neural-config/platform-preferences--options-virtual-agent-type.png)

Two checkboxes sit directly under the selector, each with `Disable` and `Enable` states:

- **Embed links into returned responses for Virtual Agent Types that support it.** — unchecked on the instance captured here. Source links are written into the generated answers, for the output formats that can carry them. The qualifier in the label is load-bearing: a format that has no link representation ignores this.
- **Only show unique embedded links** — unchecked on the instance captured here. When several passages in one answer come from the same document, this keeps a single link instead of repeating it — which only matters once links are being embedded at all.

### Stopwords

![The Stopwords text box with the placeholder a, and, the, and its help text](/img/neural-config/platform-preferences--stopwords.png)

**Stopwords** — a text box with the placeholder `a, and, the`; empty on the instance captured here. "Custom StopWords list. Only use this if you want to override the NeuralSeek default stopwords. Separate stopwords by comma."

Note what the help text says: this is an override, not an addition, so anything you type replaces NeuralSeek's own list rather than extending it. Leaving it empty keeps the product's defaults, which is what the help text recommends unless you have a reason.

### HTML Cleansing

![The HTML Cleansing field group: Enable the automatic HTML Cleanser reading True, and the CSS selectors text box holding an empty array](/img/neural-config/platform-preferences--html-cleansing.png)

**HTML Cleansing** — "NeuralSeek will automatically cleanse scraped HTML pages in supported KB's." Two controls sit under it:

- **Enable the automatic HTML Cleanser** — `True` on the instance captured here; the options are `True` and `False`.

  ![The Enable the automatic HTML Cleanser menu open: True, False](/img/neural-config/platform-preferences--options-enable-the-automatic-html-cleanser.png)

- **Provide an array of CSS selectors to remove from the HTML** — a text box with the placeholder `['.mybadclass']`, holding `[]` on the instance captured here. The placeholder shows the expected shape: an array of selector strings, in the same bracket-and-quote notation. This is where you add the selectors the automatic cleanser does not catch — a cookie banner, a navigation rail, a site-wide footer that would otherwise be ingested as content.

### Save Agents

![The Save Agents field group: the Configuration Save Agent and mAIstro Save Agent selectors, both reading Disabled](/img/neural-config/platform-preferences--save-agents.png)

**Save Agents** — "NeuralSeek can trigger mAIstro agents to run upon saving the configuration and/or mAIstro agents". Two selectors:

- **Configuration Save Agent** — `Disabled` on the instance captured here; the options offered were `Disabled` and `ex_config_save_agent`. Runs when the configuration is saved.

  ![The Configuration Save Agent menu open: Disabled checked, ex_config_save_agent](/img/neural-config/platform-preferences--options-configuration-save-agent.png)

- **mAIstro Save Agent** — `Disabled` on the instance captured here; the options offered were `Disabled` and `ex_maistro_save_agent`. Runs when a mAIstro agent is saved.

  ![The mAIstro Save Agent menu open: Disabled checked, ex_maistro_save_agent](/img/neural-config/platform-preferences--options-maistro-save-agent.png)

These are the hooks for change notification, approval workflows and external audit trails: an agent here can post the saved change somewhere, or open a ticket for it. The screen says nothing about what input a save agent receives; the In/Out node pair such an agent is built around is on [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

The two `ex_` names offered here were, like `ex_Context_Grammar`, absent from the 16 agents the playground's agent list returned during the capture, and none of those 16 was offered — see the note under [Context detection](#context-detection). Open the selector on your instance to see what it offers.

### Post-Seek Agent

![The Post-Seek Agent help text naming the postSeekAgentIn variables, and the Post-Seek mAIstro Agent selector reading Disabled](/img/neural-config/platform-preferences--post-seek-agent.png)

**Post-Seek Agent** — "Trigger a mAIstro agent asynchronously after each Seek response. This does not affect Seek latency. Use it to save conversations, log custom analytics, or run any post-processing workflow. The agent receives the full Seek context via `postSeekAgentIn` variables: question, answer, answerId, sessionId, user, score, url, document, langCode, sentiment, semanticScore, params, and options."

Its control is **Post-Seek mAIstro Agent**, `Disabled` on the instance captured here. On that instance the menu offered `Disabled` and nothing else — the list is the agents your instance can run here, and on the captured one it was empty.

![The Post-Seek mAIstro Agent menu open, offering only Disabled](/img/neural-config/platform-preferences--options-post-seek-maistro-agent.png)

Two things in that description are worth keeping: the agent runs _asynchronously_, so it does not sit in the caller's response path, and the context it receives is named — those thirteen `postSeekAgentIn` variables are what your agent has to work with. How a hook agent is built, and how it fits with the save hooks above, is on [Pipeline hooks](/maistro/ntl/pipeline-hooks/); for sending Seek records to your own store, see also [Logging](/governance/logging/).

### Settings that live elsewhere

- Retrieval — how many documents a Seek returns and how they are scored: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
- Temperature, top probability and maximum tokens: [Prompt Engineering](/configuration/neural-config/prompt-engineering/).
- The answer and intent caches: [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).
- Per-user document filtering through an external rules engine: [Corporate Document Filter](/governance/corporate-document-filter/).

## FAQ

### My chatbot times out before NeuralSeek answers — what do I set?

**Timeout**, the first slider in this section. The screen's guidance is to set it to "a few seconds less than the timeout of your chatbot platform", so that NeuralSeek is the one that gives up first and can serve "the closest possible cached answer, if one is available" instead of leaving your platform to fail. The slider runs from `4000` to `90000` milliseconds, and reads `25000` on the instance captured here.

### Which formats can Curate export a virtual agent to?

The seven options of **Virtual Agent Type**: `Watson Assistant Actions`, `AWS Lex V2`, `Kore.ai`, `Cognigy`, `Watson Assistant Dialog`, `Azure Knowledge Base` and `None / Webpage HTML`. The selected one is the format the Curate tab writes when it builds the agent.

### Why did my semantic scores disappear after turning on Cross Language?

Because they are switched off with it. The help text under **Cross Language** says: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." Any guardrail that reads the semantic score is therefore inactive for cross-language answers — see [Semantic scoring](/governance/guardrails/semantic-scoring/).

### Can I undo Hide API Keys?

No. The screen states it plainly: "Once set to true this option cannot be disabled." It also changes imports: "Setting this option to true will require you re-enter all API keys when importing a configuration file." Treat it as a permanent change to the instance.

### A filtered search returns nothing — will NeuralSeek retry without the filter?

Only if **Relax Filters** is `True`; it reads `False` on the instance captured here, which is that instance's current setting and not necessarily the product default. When it is on, an empty filtered result is retried with the filter loosened — except for any key you have listed in **Must Keep Keys (filters to never remove) separated by comma**, which is never relaxed.

### How do I run something after every answer without slowing Seek?

Point **Post-Seek mAIstro Agent** at an agent under **Post-Seek Agent**. The screen describes it as running "asynchronously after each Seek response" and says it "does not affect Seek latency". The agent receives the request's context in `postSeekAgentIn`: question, answer, answerId, sessionId, user, score, url, document, langCode, sentiment, semanticScore, params, and options. See [Pipeline hooks](/maistro/ntl/pipeline-hooks/) for how to build one.

For configuration changes rather than answers, the equivalent hooks are **Configuration Save Agent** and **mAIstro Save Agent** under **Save Agents**.
