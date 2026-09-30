---
title: "What is NeuralSeek"
description: "NeuralSeek answers questions from your own KnowledgeBase with a large language model, shows the sources behind each answer, and lets you build no-code LLM routines in mAIstro — this page walks through the Home screen and each navbar item."
---

## What is it

NeuralSeek answers questions from your organization's own content. You connect a **KnowledgeBase**,
ask a question on the **Seek** tab, and NeuralSeek has a large language model (LLM) write the answer
from the passages it retrieved — and shows you which sources those passages came from. Around that
core sit the tools to improve answers over time (**Curate**, **Analytics**, **Governance**), to
configure the whole pipeline (**Neural Config**), and to build LLM-backed routines without code
(**mAIstro**).

NeuralSeek describes itself as "AI-Powered Answers-as-a-Service" — the title of one of the videos on
the Home screen. The typical consumer of those answers is a virtual agent (a chatbot) that calls
NeuralSeek when it has no scripted reply, but the same answers are available to people directly in
the console.

## Why it matters

NeuralSeek answers from your documents and shows the sources behind each answer. The Home screen
names three things you can do with that:

- You can "trace answers back to their sources and train question-to-source relevancy" on the
  **Seek** tab.
- You can "edit, organize, and train Answers on style and content" on the **Curate** tab.
- You can view **Analytics** "on your content and explore how source coverage and confidence has
  changed over time".

## When to use it

- **Answers for a virtual agent.** Your chatbot handles the scripted intents; NeuralSeek answers the
  long tail from your documentation. Start from the Home tile "**Integrate** with your Virtual Agent".
- **Internal knowledge search.** Employees ask questions on **Seek** and get an answer with its
  sources, instead of searching a document library.
- **Content and automation.** **mAIstro** generates content, automates tasks and runs LLM-backed
  routines; **NeuralEdit** is an agent-assisted editor for documents.

NeuralSeek is the wrong tool when the answer is not written down anywhere: it answers from your
KnowledgeBase, so load or fix the content first.

## How it works

![The NeuralSeek Home screen after sign-in: the navbar, the "Watch. Learn. Build faster." video browser and the Next steps panel](/img/home/default.png)

### What you see when you sign in

The first screen after sign-in is **Home** — you get back to it with the **Home** navbar link or the
NeuralSeek logo. Its heading reads "Watch. Learn. Build faster." and it has three parts: the video
browser (below), a **Support & Development Subscription** button in the top-right corner, and a
**Get more value from NeuralSeek** panel. The subscription button opens the support and development
subscription options; see [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).

![The Get more value from NeuralSeek panel: Newest features on the left, eight next-step tiles on the right](/img/home/default--get-more-value-from-neuralseek.png)

**Get more value from NeuralSeek** (eyebrow "Next steps") says: "Continue setting up your
environment, connect with the community, and explore the tools that help you improve answers over
time." On its left, the **Newest features** list names recent additions to the product; the full
history is in the [changelog](/reference/changelog/). On its right are eight tiles. Each linked word
opens that part of the console:

| Tile                                                                                                        | Where the link goes                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Get a support and development subscription                                                                  | Text only — use the **Support & Development Subscription** button                                           |
| Join our **community** to learn and get help                                                                | The NeuralSeek community site, `https://neuralseek.com/community`                                           |
| Try **NeuralEdit**, our interactive agent-assisted document creation and editing tool                       | The **NeuralEdit** screen — see [NeuralEdit overview](/maistro/neuraledit/overview/)                        |
| **Integrate** with your Virtual Agent                                                                       | **Neural Config** — see [What can we connect to?](/integrations/overview/)                                  |
| Trace answers back to their sources and train question-to-source relevancy on the **Seek** tab              | The **Seek** tab — see [Seek](/seek/overview/)                                                              |
| Edit, organize, and train Answers on style and content on your Q&A content on the **Curate** tab            | The **Curate** tab — see [Answer curation](/seek/curation/)                                             |
| Explore **mAIstro** and generate content, automate tasks, and build LLM-backed routines with no code        | The **mAIstro** screen — see [mAIstro](/maistro/overview/)                                                  |
| View **Analytics** on your content and explore how source coverage and confidence has changed over time     | The **Analytics** screen — see [Content analytics](/governance/content-analytics/)                          |

### The product, by navbar item

The navbar across the top of every screen is the map of the product. Its items, left to right, are
**Home**, **Neural Config**, **Seek**, **KnowledgeBase**, **mAIstro**, **NeuralEdit**,
**Governance**, **Run Agents** and **Admin Tools** (a menu, not a link). **Curate** and
**Analytics** are not in the navbar; you reach them from the Home tiles above, and **Curate** also
from the **Admin Tools** menu. The avatar at the far right opens your profile.

![The Seek tab with an answer: the navbar at the top, the answer with its scores, and the KnowledgeBase Context list of sources](/img/home/seek--knowledgebase-context.png)

| Navbar item       | What it is for                                                                                        | Read more                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Home**          | The landing screen: videos, next steps, newest features.                                              | This page                                                   |
| **Neural Config** | The configuration of the answer pipeline — KnowledgeBase connection, LLM, prompts, answer rules.     | [Configuration overview](/configuration/overview/)          |
| **Seek**          | Ask a question and get an answer from your KnowledgeBase, with its scores and sources.               | [Seek](/seek/overview/)                                     |
| **KnowledgeBase** | The documents NeuralSeek answers from.                                                                | [Getting documents in](/knowledge/ingestion-overview/)      |
| **mAIstro**       | Build agents and LLM-backed routines without code.                                                    | [mAIstro](/maistro/overview/)                               |
| **NeuralEdit**    | An agent-assisted document editor.                                                                    | [NeuralEdit overview](/maistro/neuraledit/overview/)        |
| **Governance**    | Dashboards on how answers and agents behave.                                                          | [Governance](/governance/overview/)                         |
| **Run Agents**    | Dashboards of agent tiles for people who do not open mAIstro.                                         | [Run Agents](/maistro/run-agents/)                          |
| **Admin Tools**   | A menu of administration and integration screens.                                                     | [What can we connect to?](/integrations/overview/)          |

The screenshot shows what "trace answers back to their sources" means in practice. After a
question, the **Seek** tab shows the answer, a table of scores for it — among them
**Semantic Match**, **KnowledgeBase Confidence** and **KnowledgeBase Coverage** — and a
**KnowledgeBase Context** list with the URL of each source document and a percentage for how much
it matched. How
these fit together is explained in [Concepts](/getting-started/concepts/); to ask your first
question, follow [Quickstart: Seek](/getting-started/quickstart-seek/).

### Learn with the video browser

The top of Home is a region called the NeuralSeek video browser — NeuralSeek's video library inside
the console. It has two parts.

The player shows one video, with a "Now playing" card beside it giving the title, its date and "Learn
more about NeuralSeek". The player carries the usual YouTube controls: **Play video**,
**Show player controls** / **Hide player controls**, **Copy link** (copies the video's address),
**Watch on YouTube** (opens it on YouTube), and the channel link **NeuralSeek**.

![The two scroll buttons of the video list](/img/home/default--video-scroller-controls.png)

Below the player is the list, **NeuralSeek videos**. Each entry reads "Play" followed by the video
title, with its publication date. The list holds the monthly
webinars in English and Spanish, feature walkthroughs (mAIstro, analytics, intent matching, round-trip
logging) and provisioning tutorials for cloud providers. A line under the list tells you how many
videos loaded.

- **Search NeuralSeek videos** — a search box that filters the list.
- **Scroll videos left** / **Scroll videos right** — the ‹ and › buttons move the list sideways.

### Deployment and plans

Home does not say where NeuralSeek runs or which plan you are on. For deployment options see
[Deployment](/reference/deployment/); for plans and how to sign up see
[How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).

## FAQ

**What is the first screen I see after signing in?**
**Home**. It has a video browser under the heading "Watch. Learn. Build faster.", a
**Support & Development Subscription** button, and a **Get more value from NeuralSeek** panel with
next-step tiles and a **Newest features** list.

**Where do I ask a question?**
On **Seek** in the navbar. The answer comes with its scores and the list of source documents it was
built from. [Quickstart: Seek](/getting-started/quickstart-seek/) walks through a first question.

**Where do I build agents?**
In **mAIstro** — the Home tile describes it as the place to "generate content, automate tasks, and
build LLM-backed routines with no code". Start with
[Quickstart: mAIstro](/getting-started/quickstart-maistro/). **Run Agents** is where people use
finished agents without opening mAIstro.

**How do I connect NeuralSeek to my virtual agent?**
The Home tile "**Integrate** with your Virtual Agent" opens **Neural Config**. The supported
platforms and how each connects are in [What can we connect to?](/integrations/overview/).

**Where can I get help or learn more?**
The **community** link on Home opens the NeuralSeek community, and the video browser on Home holds
webinars and feature walkthroughs. For a support and development subscription, use the button in
the top-right corner of Home.
