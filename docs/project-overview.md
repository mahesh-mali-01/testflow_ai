# Technical Product Requirements Document (PRD) for AI-Native Frontend Functional Testing Tool - TESTFLOW.AI

## Version History
- **Version**: 1.0
- **Date**: September 26, 2025
- **Author**: Mahesh (based on discussions with Grok)
- **Status**: Draft
- **Purpose of Document**: This PRD synthesizes all discussions to date on the project's vision, features, architecture, tech stack, data formats, and key decisions. It serves as a blueprint for implementing the MVP using a coding agent, focusing on BDD-style E2E functional testing for dynamic frontend UIs (e.g., SPAs like React apps). The goal is to create an AI-orchestrated tool that reduces manual maintenance by leveraging LLMs for test authoring, execution, and analysis.

## Project Overview
### Problem Statement
Traditional frontend functional testing (e.g., using Cypress, Playwright, or Selenium) is brittle for dynamic UIs due to frequent changes (e.g., async loads, A/B testing), leading to high maintenance overheads (40-70% of QA time), flakiness, and low ROI. Human-led testing dominates for complex E2E flows, but it's slow and error-prone. Existing AI platforms (e.g., Applitools, Testim, mabl, Functionize, Leapwork, ACCELQ) offer self-healing and agentic automation but lack deep LLM-native formats and full-cycle management tailored to BDD.

### Solution Vision
Build an AI-native tool targeting BDD E2E tests for user behaviors/flows. Key innovations:
- LLM translates natural language workflows to structured test formats.
- Centralized TMS for CRUD operations on test suites/tests.
- LLM-driven execution in isolated browsers, with self-healing for dynamic UIs.
- Persistent storage for results, enabling analysis and viewing in TMS.
- Differentiators: LLM-friendly formats (YAML input, JSON output), full autonomy (translation to execution), and observability (logs, LLM failure reasons).

### High-Level Goals
- MVP: Build in one day—focus on core TMS CRUD + basic execution POC.
- Outcomes: Reduce test authorship time by 50-80%, maintenance by 80-90%, outperform traditional tools in dynamic scenarios.
- Assumptions: Target web frontends (no mobile/desktop for MVP); assume good-faith user inputs; local dev setup.

## Functional Requirements
### Core Features
1. **Test Authoring/Translation**:
    - User inputs natural language workflow (e.g., "Test invalid login flow").
    - GenAI (LLM) translates to structured YAML format (metadata, preconditions, BDD steps).
    - Integrate into TMS for creation.

2. **Test Management System (TMS)**:
    - CRUD for Test Suites: View, create, delete, update name.
    - Per Suite: CRUD for Tests (create via natural input → LLM translation → store YAML).
    - Display: Render YAML in UI (e.g., tags as chips, steps as stepper).
    - No auth/polish for MVP.

3. **Test Execution**:
    - Run individual tests from TMS.
    - Isolated env: Per-test browser instance (headless Playwright).
    - LLM controls browser via Browser Use: Interprets YAML steps, performs actions, asserts outcomes.
    - Log results: Pass/fail, per-stage observations, logs, screenshots.
    - Output: Structured JSON for DB storage.

4. **Storage and Analysis**:
    - Persistent DB for suites/tests/results.
    - Basic viewing: Dashboards for results, failure trends (e.g., LLM-suggested fixes).
    - Analytics: Historical failure reasons, auto-audits for app changes.

### Non-Functional Requirements
- **Performance**: Execution <5s per simple test; scale to 10+ parallel tests later.
- **Reliability**: Self-healing for UI changes; retry logic for flakiness.
- **Security**: Sandboxed browsers; no persistent data in envs.
- **Usability**: Intuitive UI for non-technical users; natural language input.
- **Cost**: Use local LLMs to minimize API calls.

### User Flows
1. **Create Test**:
    - User enters natural text in TMS UI.
    - Backend: LLM translates to YAML → Store in DB.
    - UI refreshes with parsed YAML display.

2. **Execute Test**:
    - User clicks "Run" in TMS.
    - Backend: Fetch YAML → Browser Use runs in isolated browser → Generate JSON output → Update DB.
    - UI: Poll/display results (status, logs, observations).

3. **View/Analyze**:
    - UI: List suites/tests; expand to see YAML/JSON details.
    - Basic filters: By tags, status.

## Architecture and System Flow
### High-Level Architecture
- **Frontend**: React app for TMS UI (forms, tables, buttons).
- **Backend**: Python/FastAPI for APIs (CRUD, translation, execution).
- **DB**: MongoDB (schemaless docs for suites/tests/results).
- **AI Layer**: LLM (Grok API/Ollama) for translation/observations; Browser Use for execution.
- **Integration**: Langflow for Browser Use POC (rapid prototyping of agent flows).

### End-to-End Flow
1. **Authoring**: Natural input → FastAPI endpoint → LLM prompt (e.g., "Convert to YAML schema: {input}") → Generate YAML → Store in MongoDB.
2. **Management**: React fetches via API (e.g., GET /suites) → Render parsed YAML (js-yaml).
3. **Execution**: Trigger API (POST /tests/{id}/execute) → Fetch YAML → Browser Use: MCP loop (observe page → LLM plans action → Playwright executes → log) → Post-process to JSON (LLM summarizes observations) → Update MongoDB.
4. **Analysis**: React displays JSON (e.g., stages as accordion, logs as table).

| Component | Flow Integration |
|-----------|------------------|
| **TMS UI (React)** | Forms for input, tables for lists, buttons for CRUD/execute. Use Axios for API calls. |
| **Backend (FastAPI)** | Endpoints: /suites (CRUD), /tests (CRUD with LLM translation), /execute (Browser Use integration). |
| **DB (MongoDB)** | Collections: suites (with embedded tests), results (linked by test_id). Store YAML/JSON strings + parsed objects. |
| **Browser Use** | In /execute: Agent.run(yaml_string) → MCP handles steps → Output logs/observations. |

## Tech Stack and Tools
| Category | Selection | Rationale |
|----------|-----------|-----------|
| **Backend** | Python 3.12+ with FastAPI | Quick API setup; integrates with Browser Use (Python-native). Alternatives: Node.js/Express if JS preferred, but Python for agent ease. |
| **Frontend** | React (with Vite) | Component-based UI for dynamic rendering (e.g., YAML to tags/steppers). Hooks for state; Axios for APIs. |
| **Database** | MongoDB (local/Atlas) | Schemaless for YAML/JSON storage; easy embeds (suites with tests). Mongoose if needed for schemas. |
| **LLM Integration** | Grok API or Ollama (local Llama 3.1) | For translation/observations; LangChain for prompts/chaining. Local for cost/privacy. |
| **Browser Control** | Browser Use (with Playwright) | AI agent for LLM-driven execution; MCP loop for self-healing; observability (logs/screenshots). Setup: pip install browser-use playwright. |
| **Prototyping Aids** | Langflow (for Browser Use POC), GitHub Copilot/Cursor | Rapid agent flows; AI code gen for snippets. |
| **Other** | js-yaml (FE parsing), PyYAML (BE validation) | For YAML handling. No deployment for MVP (local run). |

- **MVP Build Plan**: 1-day focus—setup (1h), backend/DB (2-3h), frontend (2-3h), execution integration (2h), test/debug (1-2h).
- **Dependencies**: Minimal; e.g., pip: fastapi, uvicorn, pymongo, langchain, browser-use. npm: react, vite, axios, js-yaml.

## Data Formats
### Input Format (Test YAML)
Pure YAML for structure/LLM parsing ease. Generated by LLM from natural input.

```yaml
test_id: unique-test-id-123
tags: [smoke, login, critical]
priority: high
author: user@example.com
created_at: 2025-09-26T12:00:00Z
app_url: https://example.com
browser: chrome
timeout: 30000

preconditions:
  - User must have a valid account registered.
  - Browser cookies should be cleared before starting.
  - API backend must be responding (e.g., mock if needed).

feature: User Authentication

scenarios:
  - name: Invalid Login Attempt
    steps:
      - type: Given
        description: the user navigates to the login page
      - type: When
        description: the user enters username "invaliduser" and password "wrongpass"
      - type: Then
        description: the user sees an error message "Invalid credentials"
```

### Output Format (Execution JSON)
Structured for DB/FE; generated post-execution via Browser Use + LLM summarization.

```json
{
  "test_id": "unique-test-id-123",
  "status": "pass",
  "summary": "Test completed successfully with expected error message displayed.",
  "execution_time_ms": 4500,
  "timestamp": "2025-09-26T12:05:00Z",
  "stages": [
    {
      "stage": "Given",
      "description": "the user navigates to the login page",
      "actions": [
        {
          "action": "page.goto('https://example.com/login')",
          "outcome": "success",
          "details": "Navigated successfully; page loaded in 1200ms."
        }
      ],
      "observations": "Page loaded but form delayed; LLM suggested retry.",
      "status": "pass"
    }
  ],
  "logs": [
    "2025-09-26T12:05:01Z: Browser launched."
  ],
  "screenshots": [
    {
      "stage": "Given",
      "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "timestamp": "2025-09-26T12:05:02Z"
    }
  ],
  "error": {}
}
```

## Key Decisions and Rationale
| Decision | Rationale |
|----------|-----------|
| **YAML over Markdown for Input** | Improves LLM parsing accuracy (structured keys reduce ambiguity); easier FE parsing (js-yaml to object); token-efficient for hybrid content. |
| **Browser Use for Execution** | Open-source, Python-native agent with MCP for self-healing; strong observability (logs/screenshots) fits TMS; reduces custom code vs. raw Playwright. Alternatives (Skyvern, Agent-E) considered but Browser Use best for MVP speed. |
| **Python Backend Shift** | User comfort with Python for Browser Use; FastAPI for quick APIs. JS (Node/React) for FE to leverage familiarity. |
| **MongoDB** | Schemaless for flexible YAML/JSON; easy scaling for logs/screenshots. |
| **MVP Scope Limits** | Focus on TMS CRUD + simple execution; skip advanced (e.g., multi-scenario, auth, scalability) for one-day build. Validate with POC in Langflow. |
| **LLM Choices** | Grok/Ollama for accessibility; local models cut costs. Prompt engineering for YAML/JSON ensures consistency. |
| **Isolation/Self-Healing** | Per-test browsers prevent interference; LLM reasoning adapts to dynamic UIs, addressing core pain points. |

## Risks and Mitigations
- **Risk**: LLM hallucinations in translation/execution. **Mitigation**: Structured prompts with examples; few-shot tuning.
- **Risk**: Performance overhead. **Mitigation**: Local LLMs; limit MVP test complexity.
- **Risk**: Integration bugs. **Mitigation**: Langflow POC for Browser Use; modular build.
- **Next Steps**: Use this PRD to guide coding agent; iterate post-MVP (e.g., add VLMs for visual assertions).

This PRD captures our full discussion—ready for implementation! If tweaks needed, let me know.