---
title: "Entity extraction"
description: "NeuralSeek entity extraction reads a sentence and returns the entities it detects, each as an entity type with the matched text, for use in mAIstro agents, virtual agents and chatbots."
---

## What is it

Entity extraction is NeuralSeek's service for pulling entities out of free text. You give it a sentence, and it returns the entities it detects: each one as an entity type (for example a product or a phone number) with the words from the sentence that matched it. You can also define your own entity types, called custom entities, for things the built-in set does not cover.

You open the tool from **Admin Tools** > **Entity Extraction**. This page explains what extraction detects and where you can use it. The screen itself, with its tabs and fields, is covered on [Extracting data](/knowledge/extract/).

## Why it matters

A virtual agent needs to know what the user is talking about, not only what they want. In "I would like to buy a movie ticket", the intent is _buy_ and the entity is the thing being bought. Once the agent knows it is a movie ticket, it can list films, ask for a date and time, and move on to payment.

Most virtual-agent platforms detect entities from lists you maintain: an entity such as _product_ with its values (_movie ticket_, _movie reservation_, _ticket_) and their synonyms, sometimes with fuzzy matching for misspellings. That approach has three costs:

- **Every value must be listed.** A word that is not on the list is not recognised, or is recognised as the wrong entity.
- **The lists need maintenance.** A large set of entities and values takes time to keep current.
- **Each language needs its own vocabulary.** Supporting several languages means listing every value again in each one.

Entity extraction takes a different route: it detects the entity from the sentence itself, so you do not have to enumerate the values in advance.

## When to use it

Use entity extraction when you need structured values from what a user typed:

- a virtual agent or chatbot that has to fill a slot (a product, a phone number, a date) from a free-text message;
- a mAIstro agent that needs to act on a value found in its input, such as routing on a product name or storing a contact number;
- a quick test of what NeuralSeek detects in a sample sentence before you build a flow around it.

It is the wrong tool when you need a list of the important words in a text rather than typed entities, or a breakdown of its grammar. mAIstro has separate keyword and grammar nodes for that, listed on the same [Extract Data](/maistro/ntl/extract-data/) reference page as the extraction node. For a walk-through of the Extract screen's tabs, go to [Extracting data](/knowledge/extract/).

## How it works

### Where entity extraction lives

**Entity Extraction** is an item in the **Admin Tools** menu at the top right of the console. The menu lists, in order: API's & Integration, Data Loader, Entity Extraction, Chat SDK, QA Tools and Curate. Choosing **Entity Extraction** opens the extraction page.

![The Admin Tools menu open at the top right of the console, with Entity Extraction as its third item](/img/admin-tools/default.png)

The extraction page has three tabs: Custom Entities, System Entities and Slot Builder. What each tab holds and how to fill it in is documented on [Extracting data](/knowledge/extract/).

### What gets detected

Extraction takes a piece of text and returns the entities it found in it. Each result pairs an entity type with the text that matched it, and a sentence can yield several entities at once. The built-in entity types, called system entities, work with no setup: you do not list values or patterns for them.

<!-- UNCONFIRMED: "I would like to buy a movie ticket" returns movie ticket as a product entity with no configuration, and the same sentence in Korean returns the same entity — old page, features/entity_extraction/index.md; not re-tested on the current release -->

For example, extracting from "I would like to buy a movie ticket" returns `movie ticket` as a `product` entity, without any entity being defined first. The same sentence written in another language, such as Korean, returns the same entity, so you do not maintain a vocabulary per language.

### Custom entities refine detection

When you need an entity type that the system entities do not cover, or want to categorise something in your own way, you define a custom entity. You add and edit custom entities on the Custom Entities tab; see [Extracting data](/knowledge/extract/) for the tab itself.

<!-- UNCONFIRMED: a custom entity is a name plus a description, NeuralSeek uses the description to detect it, and one definition works across languages — old page, features/entity_extraction/index.md -->

A custom entity is a name and a description of what it means. NeuralSeek uses the description to recognise the entity in text, rather than a list of values, and a single definition also applies to sentences in other languages.

### Use extraction in an agent or a virtual agent

Extraction is available outside its own page, so a flow can call it on each user message:

<!-- UNCONFIRMED: the {{ extract }} node ("NeuralSeek Entity extraction. Define custom entities on the Extract Tab"), fed text with =>, returns a JSON object keyed by entity type — from the Extract Data NTL page, not re-checked against the current NTL reference -->

- **In a mAIstro agent**, use the extraction node, `{{ extract }}`. Pass it the text to analyse with the `=>` chaining operator and it returns the entities it found as JSON, keyed by entity type. Custom entities you defined are used by the node too. The node's syntax and an example are on [Extract Data](/maistro/ntl/extract-data/).

<!-- UNCONFIRMED: extraction is exposed as a REST endpoint documented in the console's API documentation (old page: "under the Integrate tab"); the endpoint path and surface were not checked -->

- **From an external application**, such as a virtual agent or chatbot, call extraction through the NeuralSeek REST API; see [REST and Console API](/integrations/rest-and-console-api/). This lets the bot detect an entity in the middle of its conversation flow instead of relying only on its own entity lists.

For how NeuralSeek connects to virtual-agent platforms in general, see [Virtual agents](/integrations/virtual-agents/).

## FAQ

### Do I have to list every value of an entity, like in a virtual agent?

No. Extraction detects entities from the sentence itself, so you do not enumerate values or synonyms. You add a custom entity only for a type that the built-in system entities do not cover.

### Where do I try entity extraction?

Open **Admin Tools** > **Entity Extraction** in the console. The page's tabs (Custom Entities, System Entities, Slot Builder) are explained on [Extracting data](/knowledge/extract/).

### Does it work in languages other than English?

The documented example extracts the same entity from an English sentence and its Korean translation, with no extra configuration, and a custom entity definition applies across languages as well. See [What gets detected](#what-gets-detected).

### How do I use it inside a mAIstro agent?

Use the extraction node: pass it the text, and it returns the entities it found as JSON. The syntax is on the [Extract Data](/maistro/ntl/extract-data/) NTL reference page.

### What is the difference between this page and Extracting data?

This page explains what entity extraction does and where you can use it. [Extracting data](/knowledge/extract/) walks through the extraction screen: its tabs, fields and buttons.
