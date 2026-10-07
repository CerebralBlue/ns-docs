---
title: "Auto data cleanse"
description: "HTML Cleansing cleans web pages scraped into a supported knowledge base so page clutter does not reach answers; you switch it on or off and add your own CSS selectors to remove in Platform Preferences."
---

When web pages feed your knowledge base, each page arrives with more than its content: menus, banners, footers and other page furniture. If that text is indexed with the page, it can be retrieved as a passage and end up in an answer. Auto data cleanse — called **HTML Cleansing** on the screen, with its switch named the automatic HTML Cleanser — cleans scraped pages so that what NeuralSeek answers from is the page's content. It is for anyone who answers from web content, and it gives you two levers: the automatic cleaner, and a list of CSS selectors for the elements you want removed as well.

## How HTML cleansing works

Both settings sit in the **HTML Cleansing** group of [Platform Preferences](/configuration/neural-config/platform-preferences/). To reach them, open **Neural Config**, select the **Default Config / Answer Generation** node, select **Edit Configuration**, and expand **Platform Preferences**. Its help line describes the scope: "NeuralSeek will automatically cleanse scraped HTML pages in supported KB's."

### Turn the automatic cleaner on or off

![The HTML Cleansing group in Platform Preferences: the help line, Enable the automatic HTML Cleanser set to True, and the Provide an array of CSS selectors to remove from the HTML box holding an empty array](/img/neural-config/platform-preferences--html-cleansing.png)

**Enable the automatic HTML Cleanser** switches the automatic cleaner on (`True`) or off (`False`); both values are described under [HTML Cleansing in Platform Preferences](/configuration/neural-config/platform-preferences/#html-cleansing).

<!-- UNCONFIRMED: the cleaner identifies documents that come from web scrapes and runs its own algorithm on the full page HTML to keep the core content — old Auto data cleanse page -->

The cleaner works on the full HTML of each scraped page. It keeps the core content and removes as much of the surrounding material as it can.

<!-- UNCONFIRMED: banners and cookie notices are among what the cleaner removes — old Auto data cleanse page -->

Typical targets are banners and cookie notices, which add words to a page without adding anything a user would ask about.

:::note[Under review]
The [Platform Preferences](/configuration/neural-config/platform-preferences/#html-cleansing) page lists cookie banners among the elements the automatic cleaner leaves in, to be removed with CSS selectors. Whether the automatic cleaner removes cookie notices is being confirmed.
:::

To change the setting, pick the value, then select **Save** at the foot of the dialog and name the version.

### Strip extra elements with CSS selectors

When the automatic cleaner keeps an element you do not want answers drawn from, such as a navigation rail or a footer that repeats on every page, name it in **Provide an array of CSS selectors to remove from the HTML**; the value format is described under [HTML Cleansing in Platform Preferences](/configuration/neural-config/platform-preferences/#html-cleansing).

Selectors are the precise tool: they act only on the elements you name, so they are the right fix when one recurring element on your site keeps showing up in answers.

### Which content is cleaned

HTML Cleansing acts on scraped HTML pages, in the knowledge bases that support it. It changes how those pages are prepared for answers, not how a question is handled. For the ways web content and other documents reach the knowledge base, see [Getting documents in](/knowledge/ingestion-overview/); files you load yourself go through the [Data Loader](/knowledge/load/), and the [Document Manager](/knowledge/document-manager/) shows what has been indexed. Tables inside your documents are handled by [Table understanding](/knowledge/table-understanding/), not by HTML Cleansing.

## When to use it

- **You answer from web pages.** Keep **Enable the automatic HTML Cleanser** set to `True` so that the page furniture of a scraped site does not compete with its content.
- **One element keeps appearing in answers.** When a menu or footer survives the automatic cleaner, add its CSS selector to **Provide an array of CSS selectors to remove from the HTML** instead of turning the cleaner off.
- **The cleaner removes content you need.** If text you want answered from is missing from your scraped pages, set **Enable the automatic HTML Cleanser** to `False` and keep the pages as they were scraped.
- **The noise is in words, not in page elements.** HTML Cleansing removes elements of a page; it does not decide which words NeuralSeek ignores. To change that list, use [Stopwords](/configuration/neural-config/platform-preferences/#stopwords) in Platform Preferences instead.

## FAQ

### The cleaner leaves a footer that repeats on every page. How do I remove it?

Find the CSS selector of the footer on your site and add it to **Provide an array of CSS selectors to remove from the HTML**, in the format of the placeholder: an array of selector strings, such as `['.mybadclass']`.

### Can I turn automatic cleansing off?

Yes. In Platform Preferences, set **Enable the automatic HTML Cleanser** to `False`, then save the configuration. Scraped pages are then kept as they were scraped.

## Related

- [Platform Preferences](/configuration/neural-config/platform-preferences/)
- [Getting documents in](/knowledge/ingestion-overview/)
- [Loading documents](/knowledge/load/)
- [Document Manager](/knowledge/document-manager/)
- [Table understanding](/knowledge/table-understanding/)
