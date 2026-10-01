---
title: "Platform Preferences"
description: "Platform Preferences is the Neural Config section for instance-wide request behaviour: the generation timeout, conversation context, cross-language and output language, filter relaxation, logging, the one-way Hide API Keys switch, the virtual agent export format, stopwords, HTML cleansing, and the mAIstro agents run on save and after each Seek."
---

Platform Preferences holds the settings that fit NeuralSeek to the systems around it: how long a request may take before your chatbot gives up, how much of a conversation is carried into the next question, which language answers come back in, what a filtered search does when it finds nothing, and which [mAIstro](/maistro/overview/) agents run on save or after every answer. Some of them change what an answer says or where it comes from — Cross Language, the output language, filter relaxation, stopwords and HTML cleansing — while the rest fit NeuralSeek to the platforms around it. Retrieval and prompting are configured in other sections of the same dialog. The values in the screenshots are one instance's settings, not product defaults.

## Where to find it

Open **Neural Config**, select the **Default Config / Answer Generation** node in the routing tree, then select **Edit Configuration**. In the **Configuration: Default Config** dialog, expand **Platform Preferences**. Because the section sits in the Default Config, its settings apply to the whole instance.

![The Configuration: Default Config dialog with Platform Preferences expanded under Company / Organization Preferences, showing the Timeout, Context Turns and Context Timeout - Session sliders and the Context Timeout - User Only heading, above the Propose Changes and Save footer](/img/neural-config/platform-preferences.png)

Change the settings you need, then select **Save** and name the version, or select **Propose Changes** to keep the edit for review. Both are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## Settings

The first four settings are sliders with a number box beside them: drag the slider or type a value. The numbers at each end of the track are the range.

### Timeout

**Timeout** is the language generation timeout, in milliseconds, with a range of 4000 to 90000. Set it a few seconds below the timeout of your chatbot platform. When the timeout is reached, NeuralSeek tries to serve the closest cached answer, if one is available, instead of failing — so NeuralSeek has to give up before your platform does for that fallback to reach the user. How cached answers are kept is on [Caching](/seek/caching/).

Raise it when long answers or a slow LLM are cut off and your platform allows the extra time; lower it when your platform's own limit is shorter.

### Context Turns

**Context Turns** sets the maximum number of previous turns of the conversation that are fed to the LLM, from 0 to 50. The screen recommends against increasing it, for two reasons: every earlier turn takes LLM context away from your documentation, and a longer history gives users more room to steer the model toward inappropriate responses.

If follow-up questions lose their subject, try [Force carry context](#force-carry-context) before raising this number. How turns are tied together from the request side is on [Conversational context](/seek/conversational-context/).

### Context Timeout - Session

**Context Timeout - Session** is the timeout of a conversation identified by a `session_id`, from 0 to 999999. Within that window, a new question carrying the same `session_id` continues the earlier conversation; after it, the question starts fresh.

### Context Timeout - User Only

![The Context Timeout - User Only slider with its help text, Timeout of a user based session with no session_id](/img/neural-config/platform-preferences--context-timeout-user-only.png)

**Context Timeout - User Only** is the timeout of a conversation identified by a user but no `session_id`, from 0 to 999999. It is set separately from **Context Timeout - Session**, so you can keep user-only conversations for a different length of time than session-based ones.

### Context detection

![The Context detection group: Detection Method set to Model Only, and the mAIstro flow selector greyed out beside it](/img/neural-config/platform-preferences--context-detection.png)

**Context detection** decides how NeuralSeek recognises the language context it carries from one question to the next: with its own fast model, or with an LLM-based mAIstro flow that does custom part-of-speech tagging.

**Detection Method** has three options:

| Option                     | What it does                                                 |
| -------------------------- | ------------------------------------------------------------ |
| `Model Only`               | Uses NeuralSeek's built-in model alone. The fast path.       |
| `Model + mAIstro fallback` | Uses the built-in model, with a mAIstro flow as a fallback.  |
| `mAIstro Only`             | Uses the mAIstro flow selected in **mAIstro flow** for every question. |

**mAIstro flow** selects the agent that does the tagging. It offers `Disabled` and a list of agents to choose from, and it is greyed out while **Detection Method** is `Model Only`. Choose a mAIstro method when your questions need tagging the built-in model does not do; each question that uses it then runs an agent.

### Force carry context

![The Force carry context selector set to False, with its help text](/img/neural-config/platform-preferences--force-carry-context.png)

**Force carry context** handles questions with no subject. Set it to `True` and a question in which NeuralSeek finds no subject or nouns — "and the second one?", "why?" — is treated as a follow-on to the previous question. Set it to `False` and such a question is answered on its own.

### Cross Language

![The Cross Language selector set to False, with the help text saying Semantic Scoring is disabled on cross-language generation](/img/neural-config/platform-preferences--cross-language.png)

**Cross Language** (`True` or `False`) translates into the knowledge base language when it differs from the language of the Seek. Semantic Scoring cannot run on cross-language response generation, so turning this on disables it automatically for those answers — and any guardrail that relies on the [semantic score](/governance/guardrails/semantic-scoring/) is inactive for them. How Cross Language works with the knowledge base language and the other language settings is on [Language handling](/configuration/language/).

### Relax Filters

![The Relax Filters selector set to False, and below it the Must Keep Keys text box](/img/neural-config/platform-preferences--relax-filters.png)

**Relax Filters** decides what happens when a [filtered search](/seek/dynamic-filters/) finds no documents. Turned on, NeuralSeek relaxes the filter and tries again, so the user gets an answer from the wider knowledge base instead of none.

**Must Keep Keys (filters to never remove) separated by comma** lists the filter keys that stay applied even when the rest are relaxed. Use it for any filter that controls what a user may see rather than what is most relevant: without it, relaxing an empty result could widen access.

### mAIstro Stream Plan

![The mAIstro Stream Plan selector set to True, with its help text, Stream the Agent Plan](/img/neural-config/platform-preferences--maistro-stream-plan.png)

**mAIstro Stream Plan** controls whether the agent plan is streamed while a mAIstro agent runs; set it to `True` to stream the plan.

### Log Alternate Configs

![The Log Alternate Configs selector set to True, with its help text](/img/neural-config/platform-preferences--log-alternate-configs.png)

**Log Alternate Configs** decides whether answers from a Seek called with a proposal or an override of the configuration are logged to the [Curate](/seek/curation/) tab. Those calls test a configuration you have not adopted. Keep logging on to review the test answers next to real ones; turn it off when test traffic would crowd the curation list. Proposals are described on [Backup, restore & change logs](/configuration/backup-restore/).

### Hide API Keys

![The Hide API Keys selector set to False, with the help text ending Once set to true this option cannot be disabled](/img/neural-config/platform-preferences--hide-api-keys.png)

**Hide API Keys** hides the API keys of connected platforms from configuration admins. Without it, API keys are shown only to users with Admin / Configure permissions.

:::caution[This setting is one-way]
Once **Hide API Keys** is set to `True`, it cannot be disabled. From then on, every API key has to be re-entered in every configuration file you upload with **Upload Settings** on [Backup, restore & change logs](/configuration/backup-restore/). Decide before you save.
:::

### Default Language

![The Default Language group: the Default Output Language selector set to English, with its help text](/img/neural-config/platform-preferences--default-language.png)

**Default Language** sets the default platform language through **Default Output Language**. The list starts with `Match Input`, followed by the languages by name. The default can be overridden for a single request on the Seek tab or in the API by setting the language option.

<!-- UNCONFIRMED: Match Input answers in the language of the question — inferred from the option name; the screen does not describe it -->

Choose `Match Input` to answer in the language of the question; choose a language to answer in that language whatever the question's language. How the output language works with the knowledge base language and translation is on [Language handling](/configuration/language/).

### Virtual Agent Type

![The Virtual Agent Type selector set to Watson Assistant Actions, with its help text](/img/neural-config/platform-preferences--virtual-agent-type.png)

**Virtual Agent Type** is the format the [Curate](/seek/curation/) tab writes when it builds a [virtual agent](/integrations/virtual-agents/). Choose the one your chatbot platform imports:

| Option                     | Writes for                                                                     |
| -------------------------- | ------------------------------------------------------------------------------ |
| `Watson Assistant Actions` | [Watson Assistant](/integrations/virtual-agents/watsonx-assistant/), as actions |
| `AWS Lex V2`               | [Amazon Lex V2](/integrations/virtual-agents/aws-lex/)                         |
| `Kore.ai`                  | [Kore.ai](/integrations/virtual-agents/kore-ai/)                               |
| `Cognigy`                  | Cognigy                                            |
| `Watson Assistant Dialog`  | Watson Assistant, as a dialog                      |
| `Azure Knowledge Base`     | An Azure knowledge base                            |
| `None / Webpage HTML`      | No virtual agent platform: a web page, as HTML     |

Two switches under the selector, each set with **Disable** or **Enable**, control links in the answers:

- **Embed links into returned responses for Virtual Agent Types that support it.** — writes the source links into the returned answers, on the virtual agent types that can carry them.
- **Only show unique embedded links** — shows each embedded link once. It matters only when links are embedded.

### Stopwords

![The Stopwords text box with its help text](/img/neural-config/platform-preferences--stopwords.png)

<!-- UNCONFIRMED: stopwords are insignificant words removed during pre-processing — old docs, documentation.neuralseek.com/ui/configure/ -->

Stopwords are the insignificant words NeuralSeek removes during pre-processing. Use **Stopwords** only when you want to override NeuralSeek's default stopwords: type your list separated by commas — for example `a, and, the`. Leave it empty unless you have a reason to change which words are ignored.

### HTML Cleansing

![The HTML Cleansing group: Enable the automatic HTML Cleanser set to True, and the CSS selectors text box holding an empty array](/img/neural-config/platform-preferences--html-cleansing.png)

**HTML Cleansing** cleans scraped HTML pages in the knowledge base types that support it, so navigation and page furniture do not end up in answers.

- **Enable the automatic HTML Cleanser** — `True` cleans scraped pages automatically; `False` keeps them as scraped.
- **Provide an array of CSS selectors to remove from the HTML** — extra elements to strip, written as an array of selectors, such as `['.mybadclass']`. Add the cookie banners, navigation rails or footers that the automatic cleanser leaves in. `[]` removes nothing extra.

### Save Agents

![The Save Agents group: Configuration Save Agent and mAIstro Save Agent, both set to Disabled](/img/neural-config/platform-preferences--save-agents.png)

**Save Agents** runs a mAIstro agent whenever something is saved. Each selector offers `Disabled` and a list of agents to choose from.

- **Configuration Save Agent** — runs when the configuration is saved.
- **mAIstro Save Agent** — runs when a mAIstro agent is saved.

Use them for work that should follow a save, such as sending a notification or recording the change in an external log. How an agent built for these hooks is put together is on [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

### Post-Seek Agent

![The Post-Seek Agent group: its help text naming the postSeekAgentIn variables, and the Post-Seek mAIstro Agent selector set to Disabled](/img/neural-config/platform-preferences--post-seek-agent.png)

**Post-Seek Agent** runs a mAIstro agent asynchronously after each Seek response, so it does not add to Seek latency. Use it to save conversations, log custom analytics or run any other post-processing. Choose the agent in **Post-Seek mAIstro Agent**; `Disabled` runs nothing.

The agent receives the full Seek context in the `postSeekAgentIn` variables: `question`, `answer`, `answerId`, `sessionId`, `user`, `score`, `url`, `document`, `langCode`, `sentiment`, `semanticScore`, `params` and `options`.

## FAQ

### My chatbot times out before NeuralSeek answers. What do I set?

Set **Timeout** a few seconds below your chatbot platform's timeout. NeuralSeek then stops first and tries to serve the closest cached answer, if one is available, instead of leaving your platform to fail the request.

### Can I turn Hide API Keys off again?

No. Once **Hide API Keys** is set to `True` it cannot be disabled, and every API key has to be re-entered when you import a configuration file afterwards.

### Why did semantic scores disappear after I turned on Cross Language?

Semantic Scoring cannot run on cross-language response generation, so turning on **Cross Language** disables it automatically for those answers. Guardrails that depend on the [semantic score](/governance/guardrails/semantic-scoring/) do not apply to them.

### How do I run something after every answer without slowing Seek down?

Choose an agent in **Post-Seek mAIstro Agent**. It runs asynchronously after each Seek response and receives the Seek context through the `postSeekAgentIn` variables.

## Related

- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — save, name and propose configuration changes
- [Conversational context](/seek/conversational-context/) — how `session_id` and user tie turns together
- [Caching](/seek/caching/) — the cached answers a timeout falls back to
- [Language handling](/configuration/language/) — Cross Language, output language and the knowledge base language
- [Pipeline hooks](/maistro/ntl/pipeline-hooks/) — agents the platform runs on save
- [Answer curation](/seek/curation/) — the Curate tab, its logged answers and the virtual agent it builds
- [Backup, restore & change logs](/configuration/backup-restore/) — proposals, Upload Settings and restoring a configuration
- [Neural Config options](/configuration/neural-config/) — the other sections of the configuration dialog
