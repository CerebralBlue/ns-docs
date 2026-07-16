# NeuralDocs — Structure Sketch (v1 DRAFT for team review)

> 10,000-ft structure for the new Starlight docs site (https://cerebralblue.github.io/ns-docs/).
> **From-scratch restructure, not a 1:1 migration** (per RJ, 2026-07-14): capability-based
> top-levels replace the UI-tab tour; audience = developers/admins only; every page follows the
> "what / why / when + FAQ" pattern so the docs chatbot can retrieve and cite it.
> Old site source: `CerebralBlue/knowledge` → `neuralseek/documentation/` (86 pages, of which
> **18 are published but orphaned from the nav** — all re-homed below).

## Proposed navigation tree (8 top-level groups)

```
/                                  Landing — hero: "Get started" CTA + live-demo (target TBD),
│                                  cards: Set up · Seek · mAIstro · Connect your stack
├─ Getting Started
│  ├─ What is NeuralSeek           ← rewrite of index.md (marketing stripped)
│  ├─ Quickstart: Seek             ← NEW ("first grounded answer in 15 minutes")
│  ├─ Quickstart: mAIstro          ← NEW ("your first agent")
│  ├─ Core concepts                ← NEW (Seek pipeline, mAIstro, KB, curation lifecycle)
│  └─ Deployment options           ← distilled from plans.md (admin-relevant only)
├─ Seek — Answering Questions
│  ├─ Overview                     ← ui/seek (capability framing, not tab tour)
│  ├─ Tuning answers               ← tuning_guide (flagship)
│  ├─ Virtual KB                   ← virtual_kb (flagship)   [placement Q3]
│  ├─ Dynamic filters              ← dynamic_filters
│  ├─ Conversational context       ← MERGE features/convo_context + guides/providing_context
│  ├─ Caching                      ← features/caching (orphan)
│  ├─ Personalization              ← features/dynamic_pers (orphan)
│  ├─ Answer curation              ← MERGE ui/curate + features/answer_curation
│  └─ Chat client                  ← ui/chat (slimmed)
├─ mAIstro — Agents & Workflows
│  ├─ Overview                     ← ui/maistro
│  ├─ Visual editor                ← NEW (nav-listed on old site but file never existed)
│  ├─ NTL overview                 ← NEW (same)
│  └─ NTL Node Reference           ← the 30 existing NTL pages, directory-driven nav
│     │                              (future: ~260 nodes auto-generated into these dirs,
│     │                               categories mirror the product UI — zero nav edits)
│     ├─ get-data · upload-data · generate-data · local-cache · extract-data ·
│     │  multi-agent · control-flow · rag-tools · guardrails · system-variables ·
│     │  sandboxes · send-data · agent-registry · database-connections
│     ├─ modify-data/  (transform · string · json · xml · code)
│     └─ integrations/ (aws-s3 · databases · github · google-drive · jira ·
│                       knowledgebases · sharepoint · slack · trello ·
│                       watsonx-governance · web-search)
├─ Knowledge & Data
│  ├─ Connect a knowledge base     ← ui/integrate (task-oriented rewrite)
│  ├─ Supported knowledge bases    ← supported_knowledgebases
│  ├─ Pinecone setup               ← pinecone_configuration (explicit KEEP)
│  ├─ Elasticsearch vector model   ← elasticsearch_vector_model
│  ├─ Loading documents            ← ui/load (rewrite)
│  ├─ Extracting data              ← ui/extract (rewrite)
│  ├─ Table understanding          ← features/table_understanding (orphan)
│  └─ Auto data cleanse            ← features/auto_data_cleanse (orphan)
├─ Integrations
│  ├─ Virtual agents               ← supported_virtual_agents
│  ├─ Training virtual agents      ← training_virtual_agents
│  ├─ watsonx Assistant streaming  ← wa_context_guide
│  ├─ NICE CXone                   ← nice_cxone_integration
│  ├─ Chat SDK                     ← chat_sdk_integration
│  └─ Implementing feedback        ← implementing_feedback
├─ Configuration
│  ├─ Overview                     ← ui/configure (restructured)
│  ├─ Neural Config options        ← NEW section; per-option what/why/how pages
│  │                                 (filled by Alejandro's gap report — starts as stubs)
│  ├─ Supported LLMs               ← supported_llms
│  ├─ Multi-LLM                    ← features/multi_llm (orphan)
│  ├─ Multimodal                   ← guides/models/multimodal
│  ├─ Semantic model tuning        ← guides/models/semantic_model
│  ├─ Language handling            ← MERGE features/language + language_indentification (orphans)
│  └─ Backup & restore             ← backup_and_restore
├─ Governance & Analytics          [split into two groups? Q5]
│  ├─ Overview                     ← MERGE ui/governance + reference_material/governance
│  ├─ PII detection                ← features/pii_detect (orphan)
│  ├─ Real-time logging            ← features/RT_logging (orphan)
│  ├─ Replay                       ← MERGE features/replay_feature + guides/replay_guide
│  ├─ Data security & privacy      ← more_about_NS/data_security_and_privacy
│  ├─ Semantic analytics           ← features/semantic_analytics (orphan)
│  ├─ Content analytics            ← features/content_analytics (orphan)
│  ├─ Sentiment                    ← features/sentiment (orphan)
│  ├─ Intent categorization        ← features/intent_cat (orphan)
│  └─ Entity extraction            ← features/entity_extraction (orphan)
└─ Reference
   ├─ Changelog                    ← changelog.md
   └─ Plans & platforms            ← matrix distilled from plans.md
```

## Page contract (every page — this is what feeds the chatbot)

- Frontmatter `title` + `description` (the bot cites URLs; descriptions are retrieval gold).
- One topic per page. H2 sections: **What is it · Why it matters · When to use it · How it works**.
- Closing `## FAQ` with H3 questions (real questions users/support actually ask).
- Template: `planning/templates/feature-page.md`.

## Full mapping — all 86 existing pages

Legend: **KEEP** convert as-is (+ FAQ pass) · **REWRITE** keep substance, reframe ·
**MERGE** fold into another page · **DISTILL** extract the dev/admin-relevant part ·
**KILL** do not migrate.

| # | Old path | Action | New route / destination |
|---|----------|--------|--------------------------|
| 1 | `index.md` | REWRITE | `getting-started/what-is-neuralseek` (+ feeds new landing) |
| 2 | `changelog.md` | KEEP | `reference/changelog` [format Q9] |
| 3 | `ui/seek/index.md` | REWRITE | `seek/overview` |
| 4 | `guides/data/tuning_guide/` | KEEP | `seek/tuning` |
| 5 | `guides/data/virtual_kb/` | KEEP | `seek/virtual-kb` [Q3] |
| 6 | `guides/data/dynamic_filters/` | KEEP | `seek/dynamic-filters` |
| 7 | `features/convo_context/` (orphan) | MERGE | `seek/conversational-context` |
| 8 | `guides/integration/providing_context/` | MERGE | `seek/conversational-context` |
| 9 | `features/caching/` (orphan) | KEEP | `seek/caching` |
| 10 | `features/dynamic_pers/` (orphan) | KEEP | `seek/personalization` |
| 11 | `ui/curate/index.md` | MERGE | `seek/curation` |
| 12 | `features/answer_curation/` (orphan) | MERGE | `seek/curation` |
| 13 | `ui/chat/index.md` | REWRITE | `seek/chat-client` |
| 14 | `ui/maistro/index.md` | REWRITE | `maistro/overview` |
| 15–28 | `ntl_functions/*.md` (14 flat: get_data, upload_data, generate_data, local_cache, extract_data, multi-agent, control_flow, rag_tools, guardrails, system_variables, sandboxes, send_data, agent_registry, database_connections) | KEEP | `maistro/ntl/<kebab-name>` |
| 29–33 | `ntl_functions/modify_data/*` (transform, string, json, xml, code toolboxes) | KEEP | `maistro/ntl/modify-data/<name>` |
| 34–44 | `ntl_functions/integrations/*` (11: aws_s3 … web_searches) | KEEP | `maistro/ntl/integrations/<kebab-name>` |
| 45 | `ui/integrate/index.md` | REWRITE | `knowledge/connect-a-kb` |
| 46 | `…/supported_knowledgebases.md` | KEEP | `knowledge/supported-knowledgebases` |
| 47 | `guides/integration/pinecone_configuration/` | KEEP | `knowledge/pinecone` |
| 48 | `guides/integration/elasticsearch_vector_model/` | KEEP | `knowledge/elasticsearch-vector-model` |
| 49 | `ui/load/index.md` | REWRITE | `knowledge/load` |
| 50 | `ui/extract/index.md` | REWRITE | `knowledge/extract` |
| 51 | `features/table_understanding/` (orphan) | KEEP | `knowledge/table-understanding` |
| 52 | `features/auto_data_cleanse/` (orphan) | KEEP | `knowledge/auto-data-cleanse` |
| 53 | `…/supported_virtual_agents.md` | KEEP | `integrations/virtual-agents` |
| 54 | `guides/integration/training_virtual_agents/` | KEEP | `integrations/training-virtual-agents` |
| 55 | `guides/integration/wa_context_guide/` | KEEP | `integrations/watsonx-assistant-streaming` |
| 56 | `guides/integration/nice_cxone_integration/` | KEEP | `integrations/nice-cxone` |
| 57 | `guides/integration/chat_sdk_integration/` | KEEP | `integrations/chat-sdk` |
| 58 | `guides/integration/implementing_feedback/` | KEEP | `integrations/feedback` |
| 59 | `ui/configure/index.md` | REWRITE | `configuration/overview` (seeds Neural Config section) |
| 60 | `…/supported_llms.md` | KEEP | `configuration/supported-llms` |
| 61 | `features/multi_llm/` (orphan) | KEEP | `configuration/multi-llm` |
| 62 | `guides/models/multimodal/` | KEEP | `configuration/multimodal` |
| 63 | `guides/models/semantic_model/` | KEEP | `configuration/semantic-model` |
| 64 | `features/language/` (orphan) | MERGE | `configuration/language` |
| 65 | `features/language_indentification/` (orphan) | MERGE | `configuration/language` |
| 66 | `guides/integration/backup_and_restore/` | KEEP | `configuration/backup-restore` |
| 67 | `ui/governance/index.md` | MERGE | `governance/overview` |
| 68 | `reference_material/governance/governance.md` (orphan) | MERGE | `governance/overview` |
| 69 | `features/pii_detect/` (orphan) | KEEP | `governance/pii-detection` |
| 70 | `features/RT_logging/` (orphan) | KEEP | `governance/logging` |
| 71 | `features/replay_feature/` (orphan) | MERGE | `governance/replay` |
| 72 | `guides/data/replay_guide/` | MERGE | `governance/replay` |
| 73 | `more_about_NS/data_security_and_privacy.md` | KEEP | `governance/data-security` |
| 74 | `features/semantic_analytics/` (orphan) | KEEP | `governance/semantic-analytics` |
| 75 | `features/content_analytics/` (orphan) | KEEP | `governance/content-analytics` |
| 76 | `features/sentiment/` (orphan) | KEEP | `governance/sentiment` |
| 77 | `features/intent_cat/` (orphan) | KEEP | `governance/intent-categorization` |
| 78 | `features/entity_extraction/` (orphan) | KEEP | `governance/entity-extraction` |
| 79 | `more_about_NS/plans.md` | DISTILL | `getting-started/deployment` + `reference/plans-and-platforms` [Q2c] |
| 80 | `ui/index.md` | **KILL** | tab-tour shell; nothing to salvage |
| 81 | `ui/home/index.md` | **KILL** | tab tour; real content → Getting Started |
| 82 | `features/index.md` | **KILL** | MkDocs tag index; graph/backlinks replace it |
| 83 | `guides/data/proposals/` | **KILL** | legacy per RJ [confirm — Q2a] |
| 84 | `guides/data/doc_ingestion/` | **KILL** | outdated ingestion guide [kill vs rewrite — Q2b] |
| 85 | `more_about_NS/index.md` | **KILL** | marketing → main site |
| 86 | `more_about_NS/partners.md` | **KILL** | marketing → main site |

NEW pages (no old source): `getting-started/quickstart-seek`, `getting-started/quickstart-maistro`,
`getting-started/concepts`, `maistro/visual-editor`, `maistro/ntl-overview` (both were nav-listed
on the old site but the files never existed), `configuration/neural-config/` (awaits gap report).

## Open questions for the team

1. **Live-demo hero button** — where should it point? (docs chat widget · labs.neuralseek.com · a demo instance) — RJ.
2. **Kill confirmations:** (a) Proposals — anything to salvage? (b) doc_ingestion — kill, or rewrite later as a proper "Document ingestion" topic? (c) plans.md — where's the marketing/admin line?
3. **Virtual KB placement** — under Seek (answering) or Knowledge & Data?
4. **Screenshots** — ~450 images capture the old UI. Migrate as-is and re-capture opportunistically, or re-capture flagships now?
5. **Governance & Analytics** — one group (10 pages) or split into two?
6. **Public stubs** — site is public-but-unannounced; OK to show "content coming" stubs for a few weeks?
7. **Old-site drift** — documentation.neuralseek.com keeps changing during migration; who reconciles at each Monday gate?
8. **NTL syntax highlighting** — Shiki has no NTL grammar; code renders plain until someone writes a tmLanguage. Owner?
9. **Changelog** — keep the single long page, or fresh format on the new site linking back?
