---
title: "NeuralEdit overview"
description: "NeuralEdit is a document editor with an AI assistant beside it that drafts and rewrites text from your own reference files, with its behaviour set by a mAIstro agent."
---

NeuralEdit is a document editor with an AI assistant beside it. You write in the editor, select the passage you want changed, and tell the assistant what to do: it writes new content, rewrites the selection, or answers questions about the document, using reference files you attach. What the assistant does with a request is decided by a [mAIstro](/maistro/overview/) agent, which is why NeuralEdit sits in the mAIstro part of the documentation. This page explains the parts of the editor and how they fit together; the task pages cover [context files](/maistro/neuraledit/context-files/), [editing and reviewing](/maistro/neuraledit/editing-and-reviewing/) and [authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/).

## How NeuralEdit works

### Where NeuralEdit lives

Open the editor from **NeuralEdit** in the console's top navigation. The screen has three parts.

![The NeuralEdit screen: the file toolbar across the top, the document area with its formatting toolbar on the left, and the NeuralEdit assistant panel on the right](/img/home/neuraledit.png)

- The file toolbar — **File Browser** and **Create File** open or start a document; **Context Files (0)** manages the reference files the assistant reads (the number is how many are attached); **Compare Changes** shows what changed since the last save; **Undo** and **Redo** step through edits; **Save File** stores the document; **NeuralEdit Settings** holds the editor's settings.
- The document area — the header shows **Current file:** with the document's name (`untitled` for a new document), buttons to download it as a text file, a Word document (.docx), a PowerPoint presentation (.pptx) or an HTML page, and the line **Agent:** followed by the agent that drives the assistant. Below it, a formatting toolbar (bold, lists, headings, alignment, font, colours, tables, links) works on the text like any rich-text editor.
- The assistant panel, titled **NeuralEdit** — type a request in the box ("Describe how to edit selected text, or insert at cursor/end if nothing is selected...") and select **Send**. Select **—** to minimise the panel when you need the full width of the document.

How to open, edit, compare, save and download documents is on [Editing and reviewing](/maistro/neuraledit/editing-and-reviewing/).

### What you can ask the assistant

The assistant introduces itself with three messages that sum up what it is for:

> You can attach additional documents for use as reference via the 'Context Files' button.
>
> Then you can ask me to create content, modify sections of the document that you highlight, or answer questions.
>
> You can ask me to do "deep research" on a topic if you want me to work extra hard.

Where the result goes depends on the selection. With text selected, your request is applied to that text. With nothing selected, the assistant inserts its output at the cursor, or at the end of the document. Ask for "deep research" when a topic needs more work than a quick rewrite.

### A mAIstro agent decides what the assistant does

The assistant is not a fixed feature: every request is handled by a [mAIstro](/maistro/overview/) agent. The document header names the agent in use; on a new document it reads **Agent: default**. Because the behaviour lives in an agent, a different agent gives the assistant a different job, such as editing spreadsheets or saving the document in another format, and you can build your own in the [visual editor](/maistro/visual-editor/). How an agent receives the editor's request is on [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/).

NeuralEdit can also be reached programmatically. The API has a "Stream neuralEdit response" operation; the Console API has "Get NeuralEdit File", "Get NeuralEdit Config", "Save NeuralEdit Config" and "Select NeuralEdit Category/Agent", so the agent can also be selected over the Console API. See [REST and console API](/integrations/rest-and-console-api/).

### Grounding edits in your own files

The assistant writes better when it has your source material. **Context Files (0)** attaches documents the assistant uses as reference: a style guide, a product specification, last quarter's report. They are reference material, not the file you are editing, and the count on the button tells you at a glance how many are attached. How to add and manage them is on [Context files](/maistro/neuraledit/context-files/).

### Ready-made NeuralEdit agents

You do not have to build an agent to get started: the **NeuralEdit** category of the mAIstro **Marketplace** offers ready-to-use agents and starter templates for the editor, listed on [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/#start-from-a-neuraledit-agent-in-the-marketplace).

## When to use NeuralEdit

Use NeuralEdit when the output is a document you are working on, not an answer:

- Drafting a document, or rewriting part of one, against your own source material: attach the sources as context files, highlight a section, and ask for the change.
- Producing a deliverable to share, downloaded as a Word document, a PowerPoint presentation, HTML or plain text.
- Researching a topic in depth while you write, with the result inserted where you need it.

It is the wrong tool when you only need an answer to a question from your KnowledgeBase; that is [Seek](/seek/overview/), which answers and cites without touching a document. When the job has no document at all (a scheduled data pull, an integration step), build a plain [mAIstro](/maistro/overview/) agent instead.

When the ready-made agents do not fit, build your own. A NeuralEdit agent starts from the **NeuralEdit - In** node (one of the [pipeline hooks](/maistro/ntl/pipeline-hooks/)), in the [**RAG Tools**](/maistro/ntl/rag-tools/) group of the mAIstro function library, which receives the editor's request; see [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/).

## Who can use NeuralEdit

Who can open NeuralEdit is set with the other console permissions, including how access relates to the [Run Agents](/maistro/run-agents/) permission; see [Users and permissions](/configuration/administration/users-and-permissions/#run-agents-and-neuraledit).

## FAQ

**Which agent is NeuralEdit using?**
The document header shows it, next to **Agent:**. On a new document it reads **Agent: default**.

**Can the assistant use my own documents?**
Yes. Attach them with **Context Files**; the assistant reads them as reference when it writes. See [Context files](/maistro/neuraledit/context-files/).

**Where can I get a NeuralEdit agent without building one?**
On the mAIstro **Marketplace** tab, select the **NeuralEdit** category. See [Agent Marketplace](/maistro/agent-marketplace/).

## Related

- [Context files](/maistro/neuraledit/context-files/)
- [Editing and reviewing](/maistro/neuraledit/editing-and-reviewing/)
- [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/)
- [mAIstro overview](/maistro/overview/)
- [Visual editor](/maistro/visual-editor/)
- [Agent Marketplace](/maistro/agent-marketplace/)
- [REST and console API](/integrations/rest-and-console-api/)
- [Users and permissions](/configuration/administration/users-and-permissions/)
- [Seek](/seek/overview/)
