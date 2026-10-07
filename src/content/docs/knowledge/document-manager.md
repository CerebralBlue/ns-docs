---
title: "Document Manager"
description: "The Knowledgebase Manager lists the records indexed in your NeuralSeek knowledge base, shows a document count, and lets you search, page through and select records to remove outdated content."
---

The Document Manager is the **Knowledgebase Manager** page of the console: in its own words, the place to "Manage your indexed documents, search content, and remove outdated records." Use it to check what your [managed knowledge base](/knowledge/managed-knowledgebase/overview/) holds, to find specific records, and to take content out of the index when it no longer should be used to answer questions in [Seek](/seek/overview/).

## How the Knowledgebase Manager works

### Open the page and read the document count

To open the page, select **KnowledgeBase** in the top navigation. The **Knowledgebase Manager** page opens.

![The Knowledgebase Manager page: the heading and description line, the Document Count badge, the Go to Document Loader link, the search and paging toolbar, and the top of the Documents table](/img/knowledge/default.png)

**Document Count** tells you at a glance how much content the index holds. Read it before and after a load to see that the load added content, or after a cleanup to see that records left the index.

Select **Go to Document Loader** to open the **NeuralSeek Data Loader** page, where you upload files and run a loader template — see [Loading documents](/knowledge/load/). For every way content can reach the knowledge base, see [Getting documents in](/knowledge/ingestion-overview/).

### Search and page through documents

The toolbar above the table finds a record and controls how much of the table you see at once.

![The search and paging toolbar: the Search button, the Search documents box, the Rows per page dropdown, and the Previous and Next buttons](/img/knowledge/default--rows-per-page.png)

- **Search documents** and **Search** — type what you are looking for in **Search documents**, then select **Search** to search the indexed documents.
- **Rows per page** — how many rows of the **Documents** table one page shows. Choose **10**, **50** or **100**. A larger page is quicker to scan after a big load; a smaller one is easier to work through row by row.
- **Previous** and **Next** — move backwards and forwards through the table one page at a time. On the first page, **Previous** is unavailable.

### The Documents table

The **Documents** table lists one record per row.

![The Documents table: the Select all documents checkbox in the header row, the Record ID and Document Title columns, and a checkbox at the start of each row](/img/knowledge/default--documents.png)

- **Record ID** — the identifier of the record in the index.
- **Document Title** — the title of the source document the record came from.
- **Select all documents** — the checkbox in the header row selects every row in the table. Each row also has its own checkbox, so you can select records one at a time.

<!-- UNCONFIRMED: rows that share a Document Title are records from the same source document (one document can be split into several records) — inferred from Record IDs ending ::0, ::1, ::2 under one title in the capture; not stated on the screen -->

When several rows share a **Document Title**, they are records produced from the same source document.

### Removing outdated records

Content that stays in the index can still be retrieved when the instance answers a question, so an outdated page or a superseded policy keeps influencing answers until its records are removed. To remove records, select their rows in the **Documents** table — use **Search documents** to find them first, and **Select all documents** to select every row in the table.

<!-- UNCONFIRMED: selecting rows reveals a Delete Selected action that permanently removes the selected records from the index — route gap list; no capture shows the page with a row selected -->

Once rows are selected, **Delete Selected** removes those records from the index permanently. If the content is still needed in a newer form, load the new version through **Go to Document Loader**.

### Who can open this page

Managing knowledge content belongs to the **Load** permission, which reads "Load and manage knowledge content." Grant it to the people who maintain what your instance answers from, on the Users page (see [Users and permissions](/configuration/administration/users-and-permissions/)), or make it part of the baseline new users receive on [Default permissions](/configuration/administration/default-permissions/).

<!-- UNCONFIRMED: the Load permission grants the Knowledgebase Manager, and therefore the removal of records — route gap list; no capture shows a user without Load being refused the page -->

Because **Load** covers managing content, a user who holds it can remove records here as well as add them. Treat it as a permission that can change what the instance answers from, not only add to it.

## When to use it

- After a load, to confirm the new content is in the index: compare **Document Count** with what it was before, and search for the new document.
- When an answer cites something it should not, to find the records behind it and remove them.
- During a content cleanup, to page through everything indexed and remove outdated records.

It is the wrong place for:

- Adding content: use the Data Loader ([Loading documents](/knowledge/load/)), reachable from **Go to Document Loader**.
- Choosing or connecting the knowledge base itself: which knowledge base the instance answers from is set in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/); to answer from your own index, see [Connect a knowledge base](/knowledge/connect-a-kb/).

## FAQ

### How do I add documents from this page?

Select **Go to Document Loader**. It opens the Data Loader, where you upload files and run a loader template; see [Loading documents](/knowledge/load/).

### Can I see more than ten documents at once?

Yes. Set **Rows per page** to **50** or **100**, or move through the table with **Next** and **Previous**.

### Who can use this page?

Managing knowledge content belongs to the **Load** permission, described as "Load and manage knowledge content." See [Users and permissions](/configuration/administration/users-and-permissions/).

## Related

- [Loading documents](/knowledge/load/)
- [Getting documents in](/knowledge/ingestion-overview/)
- [Managed KnowledgeBase overview](/knowledge/managed-knowledgebase/overview/)
- [Connect a knowledge base](/knowledge/connect-a-kb/)
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Users and permissions](/configuration/administration/users-and-permissions/)
