# NeuralSeek orientation for the writer

Enough product context to write about NeuralSeek without inventing things, plus the tools that
let you check a fact. Read this before authoring a Path B page, or before writing anything that
touches the API or NTL.

Everything here is orientation. Nothing here is a substitute for verifying a specific parameter,
default or label against the ladder in `SKILL.md`.

## Contents

- [What NeuralSeek is](#what-neuralseek-is)
- [The product surfaces](#the-product-surfaces)
- [The two API planes](#the-two-api-planes)
- [NTL, and how to write about it](#ntl-and-how-to-write-about-it)
- [The MCP tooling, and how to probe for it](#the-mcp-tooling-and-how-to-probe-for-it)
- [Terminology and capitalisation](#terminology-and-capitalisation)

## What NeuralSeek is

NeuralSeek is a platform with two main halves:

- **Seek** — retrieval-augmented question answering over a connected KnowledgeBase. You ask a
  question, it retrieves source passages, generates an answer, and scores how well the answer
  matches the sources. The scoring and provenance are the point: an answer arrives with a semantic
  match score, KnowledgeBase confidence and coverage percentages, and the passages it drew from.
- **mAIstro** — the agent layer. Agents are written in **NTL** (NeuralSeek Templating Language), a
  node-based orchestration language, and run either interactively or over an API.

Around those sit knowledge ingestion, integrations with virtual-agent platforms, configuration,
and a governance/analytics layer.

An instance is a named tenant (for example `neuralseek-documentation-website`). Instances live on
one of three planes — **staging** (`stagingapi.neuralseek.com`), **partners**
(`console-partners.neuralseek.com`, where the instance id is a hash rather than a name), and
**prod** (`api.neuralseek.com`). A screenshot or a URL from one plane is not automatically valid
for another; say which plane a procedure assumes when it matters.

## The product surfaces

The documentation's eight sections mirror the product. This list is the site's own navigation
(`astro.config.mjs`), so it is a reliable map of what exists and what a page is expected to cover.

- **Getting Started** — what NeuralSeek is, quickstarts for Seek and mAIstro, core concepts, the
  onboarding wizard, how to get an instance.
- **Seek** (9 routes, all migrated from old pages) — overview, tuning answers, virtual KB, dynamic
  filters, conversational context, caching, personalization, answer curation, chat client.
- **mAIstro** (48 routes) — overview, the visual editor, running and inspecting an agent, Agent
  Visualizer, Agent Registry, Agent Marketplace, Agent Scheduler, Run Agents, **NeuralEdit**
  (context files, editing and reviewing, authoring a NeuralEdit agent), and the **NTL Node
  Reference**.
- **Knowledge & Data** (15) — connecting a knowledge base, supported knowledge bases, Pinecone
  setup, Elasticsearch vector model, hybrid/vector/semantic search, loading documents, extracting
  data, Document Manager, table understanding, auto data cleanse, and the Managed KnowledgeBase
  (web crawler, synonyms, KnowledgeBase API).
- **Integrations** (17) — virtual agent platforms (watsonx Assistant, AWS Lex, Kore.ai, NICE
  CXone), Slack and Microsoft Teams extensions, SharePoint sync, **MCP server**, **a2a server**,
  webhook, REST and Console APIs, Chat SDK, implementing feedback.
- **Configuration** (26) — Neural Config and its option pages (KnowledgeBase Connection,
  KnowledgeBase Tuning, LLM Details, Managed LLM Details, embedding models, mAIstro Configuration,
  Platform Preferences, Prompt Engineering, Intent Matching & Cache, Secrets), supported LLMs,
  multi-LLM, multimodal, semantic model tuning, language handling, backup/restore/change logs, and
  Administration (API keys, embed codes, users & permissions, default permissions, self-hosting an
  LLM, flex licensing, support plans).
- **Governance & Analytics** (27) — Seek Governance (Semantic/Documentation/Intent/Token/Cost
  Insights, Seek Logs, Model Comparison, Configuration Insights), mAIstro Governance (Agent
  Insights, Agent Details, Agent Timeline, Red Team Testing, mAIstro Logs, Token/Cost Insights,
  Model Comparison), and Custom Governance.
- **Reference** (3) — including deployment.

The old MkDocs site was organised as a UI tab tour: `ui/{home,seek,curate,chat,configure,extract,
governance,integrate,load,maistro}` plus `features/`, `guides/`, `configure/`, `reference_material/`
and `more_about_NS/`. That is why so many old pages read as "here are the columns on this screen"
and why converting them means reshaping, not just reformatting.

## The two API planes

Getting this wrong in a doc page sends a reader down a 403 rabbit hole.

**Runtime / data plane** — `…api.neuralseek.com/v1/{instance}`, endpoints including `/seek` and
`/maistro`. Authenticated with an API key in the `apikey` header. This is the plane a customer
integration calls.

**Console / control plane** — `…consoleapi.neuralseek.com/{instance}`, endpoints including
`/consoleData`, `/upConfigure` and `/exploreFiles`. **Server-side only** — it returns 403 from
outside; reaching it from inside an agent requires the `apikey` plus a
`Referer: …/{instance}/configure` header. `consoleData` (GET) returns the whole instance config
blob; `upConfigure` (POST) saves it and **replaces by top-level key**, so anything programmatic
must read-modify-write a whole branch.

**Credentials.** The admin API key is server-side only and must never appear in client code or a
committed file. The browser-safe credential is the **embed code** — a numeric value passed in an
`embedcode` header, scoped to only the `/seek` and `/maistro` endpoints. When a doc page shows
frontend code, it shows an embed code, never an API key. (This repo's own chat widget is the
worked example: instance `neuralseek-documentation-website`, embed code in
`src/lib/ns-chat/constants.ts`.)

**Field names are exact and inconsistent across surfaces.** The `/seek` REST response spells the
KnowledgeBase score `KBscore`, while the NTL `seekOut` node spells the same concept `kbScore`.
There is no `confidence` or `sources` field on the REST response. Copy field names from a verified
source; never normalise them to what looks tidier.

## NTL, and how to write about it

NTL is the language mAIstro agents are written in — `{{ node }}` calls and `<< name: x >>`
parameter references. Two mechanical rules apply to documentation:

- **NTL code fences are ` ```text `.** Shiki has no NTL grammar yet, so ` ```ntl ` breaks the
  build. The converter rewrites it; hand-written pages must use `text`.
- **Pages stay `.md`, partly because of NTL.** MDX would try to parse `{{ … }}` as JSX and fail.

**Do not hand-write pages under `maistro/ntl/`.** The NTL doc generator that produces them is
broken — it stopped detecting nodes — and fixing it auto-emits 103 of the 112 node gaps. Any node
page written by hand now is work that gets overwritten. `maistro/ntl` is also the one sidebar
subtree on `autogenerate`, so adding files there changes the navigation. If asked for node pages,
say this and offer the surrounding conceptual pages instead.

When a conceptual page needs an NTL example, take it from a real agent (`get_agent` over MCP) or
from `ntl://reference` — not from memory. Details that are easy to get wrong and worth checking
before publishing an example: `maistro` is a shared variable space while `maistroSandbox` is
isolated; inline `{{ LLM }}` nodes stream to the client unless `stream: "disable_streaming"` is
set; the condition grammar is literal-only (single-quoted strings, bare numbers, `AND(...)` /
`OR(...)` wrappers rather than operator precedence).

## The MCP tooling, and how to probe for it

Two different MCP servers may be connected, with **different tool names**. Check which you
actually have before planning around either.

| Server                      | Transport              | Tool names                                                                                                                                                                                    | Notes                                                                                                                                                       |
| --------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `neuralseek-fabio-instance` | HTTP (platform-native) | `mcp_`-prefixed: `mcp_seek`, `mcp_list_agents`, `mcp_get_agent`, `mcp_save_agent`, `mcp_call_agent`, `mcp_get_logs`, `mcp_replay_run`, `mcp_example`, `mcp_generate_ntl`, `mcp_improve_agent` | Its `mcp_save_agent` has been unreliable — irrelevant for documentation work, which is read-only                                                            |
| `neuralseek-node`           | local STDIO (`mcpns`)  | unprefixed: `seek`, `list_agents`, `get_agent`, `run_agent`, `get_logs`, `replay_run`, `sync_agents`                                                                                          | Reads `.neuralseekrc.json` **from the working directory**, and `ns-docs` has none — so it is probably pointed at another project's instance, or unavailable |

For documentation work the useful calls are read-only: `list_agents` / `get_agent` for real agent
shapes, `seek` for product Q&A, `example` for a worked node pattern, `get_logs` / `replay_run` when
documenting an error path.

**The caveat that matters most:** a `seek` call answers from _that instance's_ knowledge base. The
connected instance is not necessarily loaded with NeuralSeek's own product documentation, so an
answer may be confident and irrelevant. Treat it as a lead to confirm against the old docs clone or
the live portal, not as a citable fact.

**The NTL resources** — `ntl://reference` (full node dictionary and syntax), `ntl://gotchas`
(silent failure modes and platform limits), `ntl://agent-patterns` (building blocks, condition
grammar) — are MCP _resources_, read with `ReadMcpResourceTool`. That tool is frequently
_deferred_ rather than absent: load its schema with `ToolSearch("select:ReadMcpResourceTool")`
before concluding it is unavailable. If it genuinely does not resolve, offline copies ship inside
the npm package; the path is node-version pinned, so resolve it rather than hardcoding it:

```bash
ls "$(npm root -g)/@osuna0102/mcp/docs"
# api-data-extraction.md  conditions-and-orchestration.md  ntl-gotchas.md
# ntl-reference.md  patterns-library.md
```

Offline copies can be stale relative to the running platform. Say so if you rely on one.

## Terminology and capitalisation

Get these right; they are what a reader searches for.

- **NeuralSeek** — one word, capital N and S. Never "Neural Seek", never "NS" in prose.
- **mAIstro** — lowercase m, capital AI, lowercase stro. Even at the start of a sentence, which is
  why sentences are usually rewritten to avoid starting with it.
- **NTL** — NeuralSeek Templating Language. Expand it on first use per page.
- **KnowledgeBase** — one word, capital K and B, as the product spells it. "knowledge base" as two
  words appears in the sidebar ("Connect a knowledge base") and in generic prose; follow whichever
  the surrounding page and the product UI use, and stay consistent within a page.
- **Seek** capitalised when it names the product surface or the endpoint; lowercase when it is the
  verb.
- **NeuralEdit**, **Neural Config** — as spelled here.
- **a2a** — lowercase, as the sidebar has it.
- **watsonx Assistant** — lowercase w, as IBM spells it.
- **PII** in body text; the old docs sometimes wrote "P.I.I." — do not carry that forward.
