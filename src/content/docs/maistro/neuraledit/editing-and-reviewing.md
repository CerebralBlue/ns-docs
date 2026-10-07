---
title: "Editing and reviewing"
description: "Open or create a file in NeuralEdit, ask the assistant to write or change text, check your changes, format the document, then save it or download it as text, Word, PowerPoint or HTML."
---

[NeuralEdit](/maistro/neuraledit/overview/) is NeuralSeek's chat-assisted editor: you work on a document by hand and ask an AI assistant, backed by a [mAIstro](/maistro/overview/) agent, to draft new text or rewrite the parts you select. This page walks through a working session — open a file, ask the assistant for changes, check them, format the result, and save or download it. Use it when you want a document drafted or revised against your own material rather than typed from scratch.

## Open NeuralEdit

1. In the top navigation, select **NeuralEdit**.

The editor opens with the file toolbar across the top, the document area below it and the assistant panel on the right; [Where NeuralEdit lives](/maistro/neuraledit/overview/#where-neuraledit-lives) walks through the layout.

![NeuralEdit with the assistant panel minimised: the file toolbar, the status line with Current file, Agent and Cursor, and the rich text formatting toolbar above an empty document](/img/home/item.png)

The status line tells you what you are working on:

- **Current file:** — the name of the open file. It reads `untitled` until you open or save a file.
- **Agent:** — the agent that handles your requests in the assistant panel. Which agent that is, and how to build your own, is covered in [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/).
- **Cursor:** — the cursor position, counted in characters. It matters because a request sent with no text selected is inserted at the cursor.

**NeuralEdit Settings** opens the editor's own settings; it sits at the right end of the file toolbar.

## Open or create a file

To continue work on an existing document:

1. Select **File Browser**.
2. Choose the file to open. Its name appears after **Current file:**.

To start a new document:

1. Select **Create File**.
2. Enter a **File name**. Use letters, numbers, `_` and `-` only, with an optional extension, and no spaces.
3. Under **What will this file do?**, describe the document's purpose, then select **Create File**.

## Ask the assistant to write or change text

The assistant works on the open document. Where its output goes depends on what you select first: with text selected, the request applies to that selection; with nothing selected, the result is inserted at the cursor or at the end of the document.

1. Decide where the change goes:
   - To rewrite part of the document, select that text.
   - To add new text, place the cursor where it belongs, or select nothing to add it at the end.
2. In the assistant panel (titled **NeuralEdit**), type your request in the box at the bottom — for example, "Shorten this paragraph to two sentences" or "Write an introduction for this proposal".
3. Select **Send**. The request goes to the agent named after **Agent:** in the status line.

![The AI Chat Assistant panel open on the right of NeuralEdit, with its three opening messages, the request box and the Send button](/img/home/neuraledit.png)

The panel's opening messages describe what you can ask for:

- "You can attach additional documents for use as reference via the 'Context Files' button."
- "Then you can ask me to create content, modify sections of the document that you highlight, or answer questions."
- "You can ask me to do "deep research" on a topic if you want me to work extra hard."

To ground the assistant in your own material — a style guide, a source report, last year's version — attach it with **Context Files (0)** before you ask. The assistant uses context files as reference, and the number on the button is how many are attached. Adding and managing them is covered in [Context files](/maistro/neuraledit/context-files/).

The panel can cover the right end of the file toolbar. Select **—** in its header to minimise it to a bar titled **NeuralEdit**, and **+** to open it again.

## Review your changes before you save

Check what changed before you keep it, especially after the assistant has rewritten a passage.

1. Select **Compare Changes**.
   <!-- UNCONFIRMED: Compare Changes shows the document's changes since the last save — the view's title in the screen's markup; the view itself was not opened in any capture -->
   It shows the document's changes since the last save.
2. To step back through your edits, select **Undo**; select **Redo** to reapply what you undid.
3. When the document reads the way you want, [save it](#save-and-download-the-file).

## Format the document

Format text by hand with the formatting toolbar above the editing area: select the text, then select the button or choose a value from the list.

![The rich text formatting toolbar: B, I, U, the two list buttons, H1, H2, P, Code, alignment, Quote, the Font and Size lists, Text and Fill colours, Table, Card, Link and Clear](/img/home/item--rich-text-formatting-toolbar.png)

<!-- UNCONFIRMED: Clear removes formatting rather than content — inferred from its place in the formatting toolbar; not tried in any capture -->

| Control                          | What it does                                                                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **B**, **I**, **U**              | Bold, italic, underline.                                                                                                                             |
| **• List**, **1. List**          | Bulleted list, numbered list.                                                                                                                        |
| **H1**, **H2**, **P**            | Heading 1, heading 2, normal paragraph. **P** is selected in a new, empty document.                                                                  |
| **Code**                         | Code formatting.                                                                                                                                     |
| **Left**, **Center**, **Right**  | Text alignment.                                                                                                                                      |
| **Quote**                        | Block quote.                                                                                                                                         |
| **Font family**                  | The typeface: **IBM Plex Sans**, **Arial**, **Georgia**, **Times** or **Courier**. The list shows **Font** until you pick one.                       |
| **Font size**                    | The text size: **Small**, **Normal**, **Large**, **XL** or **XXL**. The list shows **Size** until you pick one.                                      |
| **Text**                         | Text colour. Select the swatch to pick a colour.                                                                                                     |
| **Fill**                         | Background colour behind the text. Select the swatch to pick a colour.                                                                               |
| **Table**                        | Inserts a table.                                                                                                                                     |
| **Card**                         | Inserts a card block.                                                                                                                                |
| **Link**                         | Adds a link.                                                                                                                                         |
| **Clear**                        | Clears formatting.                                                                                                                                   |

## Save and download the file

Save the file to keep your work in NeuralEdit; download it when you need a copy in another format.

1. If the assistant panel is open, select **—** to minimise it so **Save File** is visible.
2. Select **Save File**.
3. To download the document, use the buttons beside **Current file:** in the status line:
   - **Download text file** — plain text.
   - **Download as Word document (.docx)** — a Word document.
   - **Download as PowerPoint (.pptx)** — a PowerPoint presentation.
   - **Download as HTML (.html)** — a web page.

![The status line: Current file followed by the four download buttons, the Agent name in the middle and the Cursor position on the right](/img/home/item--current-file.png)

## Troubleshooting

- **You cannot see Save File.** The open assistant panel covers the right end of the file toolbar on narrower windows. Select **—** in the panel's header to minimise it, and **+** to bring it back.
- **Undo and Redo are greyed out.** Both stay unavailable until there is an edit to step back through — for example, when you have just opened the editor.
- **The assistant changed the wrong text.** Requests apply to the selection; with nothing selected, the result goes in at the cursor or at the end. Select exactly the passage you want changed before you select **Send**, and check the result with **Compare Changes** before you save.

## FAQ

### How do I make the assistant change only one paragraph?

Select the paragraph before you send your request. A request edits the selected text; when nothing is selected, the assistant inserts its result at the cursor or at the end of the document instead.

### Which formats can I download a document in?

Plain text, Word (`.docx`), PowerPoint (`.pptx`) and HTML (`.html`), from the four buttons beside **Current file:** in the status line.

### What does the number on Context Files mean?

It is the number of reference documents attached for the assistant to read. **Context Files (0)** means none are attached yet. See [Context files](/maistro/neuraledit/context-files/).

## Related

- [NeuralEdit overview](/maistro/neuraledit/overview/) — what NeuralEdit is and who can use it.
- [Context files](/maistro/neuraledit/context-files/) — attach documents the assistant uses as reference.
- [Authoring a NeuralEdit agent](/maistro/neuraledit/authoring-an-agent/) — build the agent that answers your requests.
- [Agent Marketplace](/maistro/agent-marketplace/) — ready-made NeuralEdit agents.
- [REST and Console API](/integrations/rest-and-console-api/) — NeuralEdit files and settings from the Console API.
