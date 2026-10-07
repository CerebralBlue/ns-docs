---
title: "PII detection"
description: "NeuralSeek finds personal data in a user's question with built-in detectors, your own regular expressions and LLM-trained example sentences, then flags, masks, hides or deletes it according to the PII tab of the Guardrails dialog."
---

PII detection finds personally identifiable information — names, card numbers, phone numbers,
e-mail addresses, credentials, your own account or employee IDs — in the questions users send to
NeuralSeek, and decides what happens to the question once it is found. It is for teams that must
control what happens to the personal data their users type, from masking it to deleting the
question. You
configure it on the **PII** tab of the [Guardrails](/governance/guardrails/overview/) dialog, with
three ways to detect PII and one action that applies to everything they find.

## How PII detection works

PII settings belong to a configuration. On the Neural Config routing tree, select the
**Guardrails** node under **Default Config** to set them for the whole instance, or the
**Guardrails** node under a category with its own Custom Configuration to set them for that
category only (the tree is described in [Configuration overview](/configuration/overview/)). In
the dialog that opens, select the **PII** tab.

The tab works on the user's input. Three detectors look for personal data — NeuralSeek's built-in
detectors, your regular-expression rules, and LLM-based rules trained from example sentences — and
whatever any of them finds is handled by one action. The PII tab is saved together with the other
guardrail tabs: make your changes, then select **Save** at the bottom of the dialog.

### What happens when PII is found

![The two selectors at the top of the PII tab: Action to take when PII is found on user input and Trust words found in source docs to not be PII](/img/neural-config/pii--action-to-take-when-pii-is-found-on-user.png)

**Action to take when PII is found on user input** decides what NeuralSeek does with a question in
which any detector on this tab found personal data. Pick it by asking two questions: may the
personal data stay in the question as the user typed it, and do you still want the question
counted in analytics?

![The open list of actions: No Action, Flag, Mask, Hide (retain for Analytics), Delete (including from Analytics)](/img/neural-config/pii--options-action-to-take-when-pii-is-found-on-user.png)

<!-- UNCONFIRMED: what No Action, Flag and Mask do beyond their names (detection only / marked as containing PII / the PII replaced so the value is not shown) — inferred from the option names and the old PII page -->

| Option                                | What it does                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No Action**                         | Detects PII but leaves the question as it is. Useful while you tune the detectors and watch what they find.                                            |
| **Flag**                              | Marks the question as containing PII and otherwise leaves it as it is, so you can find and review it in [Governance](#where-detected-pii-shows-up-in-governance). |
| **Mask**                              | Masks the personal data in the question, so the value itself is not shown.                                                                             |
| **Hide (retain for Analytics)**       | Hides the question, but keeps it for analytics, so your dashboards still count it.                                                                     |
| **Delete (including from Analytics)** | Deletes the question, including the copy analytics would otherwise keep. Choose it when personal data must not be stored anywhere.                    |

<!-- UNCONFIRMED: when True, a word that also appears in your KnowledgeBase documents is not treated as PII — inferred from the control's label; the option list was not captured -->

**Trust words found in source docs to not be PII** helps with false positives. When it is set to
**True**, a word that also appears in your KnowledgeBase documents is not treated as personal
data. Turn it on when your content is full of product, place or people names — a product called
"Morgan", a city name, a named support plan — that the detectors would otherwise mask in users'
questions.

### Built-in detectors

Select **NeuralSeek PII Detectors** on the PII tab to open a dialog of the same name. It lists
NeuralSeek's own detectors, one per kind of personal data, each with a switch between
**Disabled** and **Enabled**:

![The NeuralSeek PII Detectors dialog: a Disabled/Enabled switch for each detector and the box for extra names](/img/neural-config/neuralseek-pii-detectors-panel.png)

- **Names**
- **Credit Card Number**
- **Street Address**
- **Zipcode**
- **U S Phone Number**
- **U K Phone Number**
- **Ip Address**
- **Us Social Security Number**
- **Email Address**
- **Username**
- **Password**
- **Credentials**

Enable the detectors for the kinds of data your users are likely to type and you are not allowed
to keep. Leave a detector disabled when the data it looks for is a normal part of your questions —
a support desk that routinely takes street addresses for deliveries, for example, may not want
every address treated as PII.

Under the switches, the box **Names to add to NeuralSeek's default list. Separate names by a
comma.** extends the list of personal names NeuralSeek recognises. Add names a general model is
unlikely to know — unusual or local names, surnames that look like brand words — as a
comma-separated list, for example `Okonkwo, Nguyen-Tran, Sølvberg`.

<!-- UNCONFIRMED: the added names are only used while the Names detector is Enabled — inferred from the dialog layout -->

The added names are used by the **Names** detector, so keep it Enabled. Select **Close** to
return to the PII tab.

### Your own patterns: Pre-LLM PII Filters

![The PII tab: the action selectors, the NeuralSeek PII Detectors and Try it Out buttons, the Pre-LLM PII Filters table with Description and Regular Expression columns, and the LLM - Based PII Filters heading](/img/neural-config/pii-panel.png)

The built-in detectors know common formats; they cannot know your organisation's identifiers.
**Pre-LLM PII Filters** are regular-expression rules for those — employee numbers, customer or
policy numbers, internal account IDs. As the tab says, "These rules run dynamically on user input
before it is sent to LLM's or KB's", so a match is handled before any model or KnowledgeBase sees
the question.

Each row is one rule:

- **Description** — a name for the rule, so the next person knows what it catches.
- **Regular Expression** — the pattern to match.

To add a rule, select **Add a new row.** in the empty last row and fill in both columns; to
remove one, select **Remove this row.** at the end of its row. For example, a company whose employee IDs
look like `EMP-004211` would add:

| Description | Regular Expression |
| ----------- | ------------------ |
| Employee ID | `\bEMP-\d{6}\b`    |

Anchor patterns with `\b` (word boundary) so that they match the identifier and not a longer
number that happens to contain it.

### Example-based filters: LLM - Based PII Filters

Some personal data has no fixed format — a blood type, a medical condition. **LLM - Based PII
Filters** handle it by example: "These rules use your chosen LLM to identify PII." The LLM that
does this work is the one enabled for **PII Detection** in
[LLM Details](/configuration/neural-config/llm-details/). Because these rules work by passing the
user's input to that LLM, LLM-based detection is itself a call to a model. For identifiers that
must be caught before the input is sent to any LLM, write a **Pre-LLM PII Filters** rule instead.

Each row is one training example with two columns:

- **Example sentence** — a sentence of the kind your users write.
- **Each PII element, Separated by a comma. Leave blank train "No PII"** — the parts of that
  sentence that are personal data, separated by commas. Leave it blank to teach the opposite: the
  sentence contains **no** PII and must not be flagged.

| Example sentence                                                    | Each PII element, Separated by a comma. Leave blank train "No PII" |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| My name is Dana Whitfield and my blood type is O negative.         | Dana Whitfield, O negative                                         |
| What time does the Leeds office open on Saturdays?                 |                                                                    |

The first row teaches the LLM that a name and a blood type are personal data, even though no
regular expression could find a blood type. The second is a "No PII" row: it shares nothing with
the first and stops a question about an office location from being treated as personal data. Add a "No PII" row whenever you see questions flagged
that clearly contain nothing personal. Rows are added and removed with the same buttons as in the
**Pre-LLM PII Filters** table.

### Test before you save

Select **Try it Out** on the PII tab to open a test of the current PII settings. Use it after
adding a regular expression or an example sentence, before you select **Save**, so that a pattern
that is too broad or too narrow is caught before it affects your users' questions.

### Where detected PII shows up in Governance

![The Seek Overview page of Governance, with the Questions containing PII panel at the bottom right](/img/governance/overview.png)

Detection is also reported. On the [Seek Overview](/governance/analytics/seek-overview/) page of
Governance, the **Questions containing PII** panel ("PII detection rate") shows a ring chart split
into **PII** and **Other**: the share of questions in which PII was detected over the selected
period. It is the running measure of how often your users type personal data, and it moves when
you enable a detector or add a filter. To see the questions themselves, open
[Seek Logs](/governance/analytics/seek-logs-and-config-insights/) and choose **PII** in its
**Filter** dialog.

## When to use PII detection

- **Regulated data.** Turn on the detectors and choose **Mask**, **Hide (retain for Analytics)**
  or **Delete (including from Analytics)** when health, payment or identity data must not stay in
  the question as the user typed it. For identifiers that must be caught before the input is sent
  to an LLM or KnowledgeBase, use **Pre-LLM PII Filters**; **LLM - Based PII Filters** themselves
  pass the input to the LLM enabled for **PII Detection**.
- **Your own identifiers.** Add **Pre-LLM PII Filters** for any ID format your organisation
  issues; the built-in detectors will not recognise it.
- **Data with no fixed shape.** Use **LLM - Based PII Filters** when what counts as personal data
  depends on context rather than on a pattern.
- **Too many false positives.** Add "No PII" example rows and set **Trust words found in source
  docs to not be PII** before you disable a detector outright.
- **Inside a mAIstro agent.** The NTL node `PII` finds and masks PII in its input text based on
  these settings, and `regexPII` finds PII with the built-in and your custom regular-expression
  patterns — see [mAIstro](/maistro/overview/):

  ```text
  {{ PII | about: "..." | plan: "Remove PII" }}
  ```

PII detection works on the user's input. It is the wrong tool for rewriting a question in other
ways or for blocking whole topics — use
[custom governance agents](/governance/guardrails/custom-governance-agents/) for that. What is
sent to your own logging system is set in [Corporate Logging](/governance/logging/).

## FAQ

### How do I stop NeuralSeek from treating a product or place name as personal data?

Add a row to **LLM - Based PII Filters** with a sentence that uses the name and leave the
elements column blank, which trains it as "No PII". If the name appears in your KnowledgeBase
documents, also set **Trust words found in source docs to not be PII** to **True**.

### Can I detect our own ID formats?

Yes. Add a row to **Pre-LLM PII Filters** with a **Description** and a **Regular Expression**.
These rules run on the question before it is sent to an LLM or the KnowledgeBase.

### Does Delete remove the question from analytics too?

Yes — **Delete (including from Analytics)** removes it from analytics as well. If you need the
question out of the way but still counted on your dashboards, choose **Hide (retain for
Analytics)** instead.

### Where do I see how often users send PII?

On the **Questions containing PII** panel of the
[Seek Overview](/governance/analytics/seek-overview/), and in
[Seek Logs](/governance/analytics/seek-logs-and-config-insights/) with the **PII** filter.

### Can one category use different PII settings from the rest of the instance?

Yes. Each category with its own Custom Configuration has its own **Guardrails** node on the Neural
Config tree; its **PII** tab applies to that category only.

## Related

- [Guardrails overview](/governance/guardrails/overview/) — the dialog the PII tab belongs to
- [Prompt injection](/governance/guardrails/prompt-injection/) — the other input guardrail with a
  **Try it Out** test
- [Profanity (HAP)](/governance/guardrails/profanity-hap/)
- [LLM Details](/configuration/neural-config/llm-details/) — choose the LLM for **PII Detection**
- [Seek Overview](/governance/analytics/seek-overview/) and
  [Seek Logs](/governance/analytics/seek-logs-and-config-insights/)
- [Custom governance agents](/governance/guardrails/custom-governance-agents/)
- [Corporate Logging](/governance/logging/)
- [Data security](/governance/data-security/)
