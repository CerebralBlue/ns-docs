---
title: "Platform Preferences"
description: "Platform Preferences is the section of Neural Config that sets instance-wide request behaviour: the generation timeout, how much conversation context is carried, language and filter handling, the output format for exported virtual agents, HTML and stopword cleansing, and the mAIstro agents NeuralSeek triggers on save and after each Seek."
---

## What is it

**Platform Preferences** is a section of the **Edit Configuration** accordion in Neural Config, below **Company / Organization Preferences** and above [Corporate Document Filter](/governance/corporate-document-filter/). It is the largest section in that dialog, and the one with the least in common between its settings: what they share is that each applies to the whole instance rather than to one knowledge base, one prompt or one category.

Grouped by what they touch, the section holds:

- how long a request may take, and how much of the conversation is carried into it;
- which language an answer comes back in;
- whether a filtered search may be retried without its filter, and what is logged or streamed;
- the output format used when the Curate tab builds a virtual agent, and whether links are embedded in answers;
- the text NeuralSeek strips before indexing or answering;
- the mAIstro agents NeuralSeek triggers on save and after each Seek.

Nothing here changes what is in the knowledge base ([KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)) or how the prompt is written ([Prompt Engineering](/configuration/neural-config/prompt-engineering/)).

## Why it matters

Most of the settings that make NeuralSeek fit the platform around it are on this screen. A chatbot host with a 30-second request limit, a channel that needs answers in the caller's language, an integration that expects Watson Assistant Actions rather than raw text — all of those are configured here, and a mismatch shows up as a broken integration rather than as a bad answer.

Two of these settings also carry a cost that is not obvious from their labels. **Context Turns** trades documentation context for conversation memory, and the product explicitly recommends against raising it. **Hide API Keys** cannot be turned back off once it is on.

## When to use it

- Your chatbot platform times out before NeuralSeek returns an answer.
- Follow-up questions lose their subject, or one user's context is being carried further than you expect.
- A filtered search returns nothing and you want to know whether NeuralSeek retried.
- Answers come back in the wrong language, or semantic scores disappeared after a language change.
- You are exporting a virtual agent from the Curate tab and need a particular format, or links inside the answers.
- Scraped HTML pages are bringing navigation and boilerplate into answers.
- Every Seek has to be recorded in a system NeuralSeek does not know about.

## How it works

### Where the section lives

Open **Neural Config**, click the **Default Config** node in the routing tree, then **Edit Configuration**. In the accordion that opens, expand **Platform Preferences**.

![The Edit Configuration dialog with Platform Preferences expanded, showing the Timeout, Context Turns and Context Timeout - Session sliders, and the dialog footer with Propose Changes and Save](/img/neural-config/platform-preferences.png)

The dialog footer carries **Propose Changes** and **Save** — nothing on this page takes effect until one of them is used.

:::note
Every value quoted on this page is the value on the instance captured for it, not a product default. The controls in this section carry no default indicator on screen, and the instance's configuration export is a packed restore blob with no readable key index, so this page cannot tell you which of these values ship out of the box. Read your own instance before assuming.
:::

### Timeouts and conversation context

Each setting in this group is a slider with a **Slider value** box beside it; you can drag the slider or type the number. The two labels at the ends of the track are the range.

- **Timeout** — range `4000` to `90000`; `25000` on the instance captured here. The help text says what to set it to: "Language Generation Timeout (milliseconds). Set this to a few seconds less than the timeout of your chatbot platform. When timeout is reached Neuralseek will attempt to catch the timeout by serving the closest possible cached answer, if one is available." So the timeout is not purely a failure boundary — hitting it makes NeuralSeek fall back to the nearest cached answer where one exists.
- **Context Turns** — range `0` to `50`; `1` on the instance captured here. "Maximum number of previous context turns to feed to the LLM. Increasing this is not recommended as it will reduce the available LLM context available to your documentation, and opens additional risk of attack from users trying to elicit inappropriate responses." Raising it is a trade, and the product names both sides of it: less room for retrieved documents, and more surface for a user steering the model through the conversation history.
- **Context Timeout - Session** — range `0` to `999999`; `360000` on the instance captured here. "Timeout of a session_id based user session."
- **Context Timeout - User Only** — range `0` to `999999`; `1800` on the instance captured here. "Timeout of a user based session with no session_id." These are two separate windows: one for callers that pass a `session_id`, one for callers identified only by user. On the instance captured here the user-only window is two hundred times shorter than the session one — reasonable, since a user with no session boundary has nothing else to end their context.

  The screen does not label the units of either timeout, so whether `1800` means seconds or milliseconds is not something this page can tell you from the capture.

- **Context detection** — "Use our (fast) model for carrying language context or use an LLM-based mAIstro flow for custom PoS tagging." Two controls sit under it: **Detection Method** (`Model Only` on the instance captured here) and **mAIstro flow** (`ex_Context_Grammar`). The **mAIstro flow** selector names the agent that would do the part-of-speech tagging if you switched the method to the LLM-based option; in the capture it is not interactive while **Detection Method** reads `Model Only`. The option lists were not opened during the capture, so this page cannot list the other detection methods.
- **Force carry context** — `False` on the instance captured here. "If no subject / nouns are found in a question assume the question is a follow on to the previous question." This is the setting for a bare "why?" or "and the second one?" — with it off, a question with no subject is answered on its own; with it on, it is treated as a continuation.

The behaviour these five controls produce is described from the runtime side on [Conversational context](/seek/conversational-context/); this section is the console half of it.

### Language behaviour

![Screenshot needed — the middle of Platform Preferences: Cross Language, Relax Filters with Must Keep Keys, mAIstro Stream Plan, Log Alternate Configs, Hide API Keys, Default Language, Virtual Agent Type, the two link checkboxes, Stopwords and HTML Cleansing](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/platform-preferences-middle.png — Neural Config > Default Config > Edit Configuration > Platform Preferences, scrolled from the Cross Language heading down to HTML Cleansing.
     Why: this band holds eleven controls and neither captured screenshot reaches it; readers matching a label to a control have nothing to look at between Context Timeout and Save Agents. -->

- **Cross Language** — `False` on the instance captured here. "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." The second sentence is the part worth reading twice: turning cross-language translation on silently removes semantic scoring from the answers, and the screen says so only here. If your guardrails depend on the semantic score, this setting disables them for those answers. See [Semantic scoring](/governance/guardrails/semantic-scoring/) and [Semantic model tuning](/configuration/semantic-model/) for what is lost.
- **Default Language** — `English` on the instance captured here, with the label **Default Output Language** under the selector. "Set the default platform language. The language can be overridden on the Seek tab and the api by setting the language option." So this is a default rather than a constraint: a caller that sets the `language` option overrides it per request.

[Language handling](/configuration/language/) covers the language settings across the product, including the knowledge base language these two are compared against.

### Filters, streaming and logging

- **Relax Filters** — `False` on the instance captured here. "If no documents are found while filtering, relax the filter and try again." With it on, a filtered search that finds nothing is retried with the filter loosened rather than returning empty.

  :::caution
  Relaxing a filter after an empty result can widen what a user is allowed to see. If a filter is doing access control rather than relevance narrowing, list its key under **Must Keep Keys** so it is never relaxed — or leave **Relax Filters** off.
  :::

- **Must Keep Keys (filters to never remove) separated by comma** — a text box with the placeholder `a,b,c`; empty on the instance captured here. Keys listed here are excluded from the relaxation above. This is how a tenant, region or entitlement filter stays enforced while relevance filters are allowed to loosen.
- **mAIstro Stream Plan** — `True` on the instance captured here. "Stream the Agent Plan." When an agent runs, its plan is streamed to the caller as it is built rather than delivered with the result.
- **Log Alternate Configs** — `True` on the instance captured here. "When calling seek with a Proposal or Override of the configuration, should the answers be logged to the Curate Tab." A seek run against a proposed or overridden configuration is a test of a configuration you have not adopted; this decides whether those answers join your real ones in Curate.
- **Hide API Keys** — `False` on the instance captured here. The help text reads: "Hide API kets of connected platforms from Configuration Admins. By default API keys are only shown to users with Admin / Configure permissions. Setting this option to true will require you re-enter all API keys when importing a configuration file. Once set to true this option cannot be disabled." ("kets" is a typo on screen; the setting is about API keys.)

  :::danger[This switch is one-way]
  In the screen's own words: "Once set to true this option cannot be disabled." Turning **Hide API Keys** on also means, in the screen's words, that you "re-enter all API keys when importing a configuration file" from then on. Decide before you save, not after.
  :::

### Output format and links

- **Virtual Agent Type** — `Watson Assistant Actions` on the instance captured here, with the label **Virtual Agent Type** repeated under the selector. "When using the Curate tab to auto-buld a virtual agent, what format should be written to." The option list was not opened during the capture, so `Watson Assistant Actions` is the only format this page can name; open the selector on your own instance to see the rest.
- **Embed links into returned responses for Virtual Agent Types that support it.** — a checkbox with `Disable` and `Enable` states, unchecked on the instance captured here. Source links are written into the generated answers, for the output formats that can carry them. The qualifier in the label is load-bearing: a format that has no link representation ignores this.
- **Only show unique embedded links** — a checkbox with `Disable` and `Enable` states, unchecked on the instance captured here. When several passages in one answer come from the same document, this keeps a single link instead of repeating it.

### Text cleansing

- **Stopwords** — a text box with the placeholder `a, and, the`; empty on the instance captured here. "Custom StopWords list. Only use this if you want to override the NeuralSeek default stopwords. Separate stopwords by comma." Note what the help text says: this is an override, not an addition, so anything you type replaces NeuralSeek's own list rather than extending it. Leaving it empty keeps the product's defaults.
- **HTML Cleansing** — "NeuralSeek will automatically cleanse scraped HTML pages in supported KB's." Two controls sit under it:
  - **Enable the automatic HTML Cleanser** — `True` on the instance captured here.
  - **Provide an array of CSS selectors to remove from the HTML** — a text box with the placeholder `['.mybadclass']`, holding `[]` on the instance captured here. This is where you add the selectors the automatic cleanser does not catch: a cookie banner, a navigation rail, a site-wide footer that would otherwise be ingested as content.

### Agents triggered by the platform

The last two groups in the section are mAIstro hooks. They are at the bottom of the accordion, immediately above **Corporate Document Filter**.

![The tail of Platform Preferences: the Configuration Save Agent and mAIstro Save Agent selectors, the Post-Seek Agent help text listing the postSeekAgentIn variables, and the Post-Seek mAIstro Agent selector, with the Corporate Document Filter section below](/img/neural-config/corporate-document-filter.png)

- **Save Agents** — "NeuralSeek can trigger mAIstro agents to run upon saving the configuration and/or mAIstro agents." Two selectors: **Configuration Save Agent** and **mAIstro Save Agent**, both `Disabled` on the instance captured here. They run on a save, which makes them the hook for change notification, approval workflows and external audit trails.
- **Post-Seek Agent** — "Trigger a mAIstro agent asynchronously after each Seek response. This does not affect Seek latency. Use it to save conversations, log custom analytics, or run any post-processing workflow. The agent receives the full Seek context via `postSeekAgentIn` variables: question, answer, answerId, sessionId, user, score, url, document, langCode, sentiment, semanticScore, params, and options." Its control is **Post-Seek mAIstro Agent**, `Disabled` on the instance captured here.

  Two things in that description are worth keeping: the agent runs _asynchronously_, so it does not sit in the caller's response path, and the context it receives is named — those thirteen `postSeekAgentIn` variables are what your agent has to work with.

The option lists on all three selectors were not opened during the capture, so this page cannot say which agents they offer. What a hook agent can do, and how it fits with the other hooks in the pipeline, is on [Pipeline hooks](/maistro/ntl/pipeline-hooks/); for sending Seek records to your own store, see also [Logging](/governance/logging/).

### Settings that are not in this section

- Retrieval — how many documents a seek returns and how they are scored: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
- Temperature, top probability and maximum tokens: [Prompt Engineering](/configuration/neural-config/prompt-engineering/).
- The answer and intent caches: [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).
- Per-user document filtering through an external rules engine: [Corporate Document Filter](/governance/corporate-document-filter/).

## FAQ

### My chatbot times out before NeuralSeek answers — what do I set?

**Timeout**, in the first group of this section. The screen's guidance is to set it to "a few seconds less than the timeout of your chatbot platform", so that NeuralSeek is the one that gives up first and can serve the closest cached answer instead of leaving your platform to fail. The slider runs from `4000` to `90000` milliseconds, and reads `25000` on the instance captured here.

### How much of the previous conversation does the LLM see?

**Context Turns** decides it — `1` on the instance captured here, meaning one previous turn. The product recommends against raising it, for two stated reasons: every turn of conversation takes context away from your documentation, and a longer history gives a user more room to steer the model. If follow-up questions are failing, try **Force carry context** before raising the turn count.

### Why did my semantic scores disappear after turning on cross-language answers?

Because they are switched off with it. The help text under **Cross Language** says: "Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." Any guardrail that reads the semantic score is therefore inactive for cross-language answers — see [Semantic scoring](/governance/guardrails/semantic-scoring/).

### Can I undo Hide API Keys?

No. The screen states it plainly: "Once set to true this option cannot be disabled." It also changes imports: "Setting this option to true will require you re-enter all API keys when importing a configuration file." Treat it as a permanent change to the instance.

### A filtered search returns nothing — will NeuralSeek retry?

Only if **Relax Filters** is on; it reads `False` on the instance captured here, which is this instance's current setting and not necessarily the product default. When it is on, an empty filtered result is retried with the filter loosened — except for any key you have listed in **Must Keep Keys (filters to never remove) separated by comma**, which is never relaxed.

### How do I log every answer to my own system?

Point **Post-Seek mAIstro Agent** at an agent under **Post-Seek Agent**. The screen describes it as running "asynchronously after each Seek response", and says it "does not affect Seek latency". The agent receives the request's context in `postSeekAgentIn`: question, answer, answerId, sessionId, user, score, url, document, langCode, sentiment, semanticScore, params, and options. See [Pipeline hooks](/maistro/ntl/pipeline-hooks/) for how to build one.

For configuration changes rather than answers, the equivalent hooks are **Configuration Save Agent** and **mAIstro Save Agent** under **Save Agents**.
