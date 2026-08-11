AI Knowledge Ledger

A personal knowledge management system that organizes what you'velearned into intelligent knowledge ledgers.

AI Knowledge Ledger is a work-in-progress full-stack applicationdesigned to turn scattered learning notes, conversations, andaccumulated knowledge into an organized personal knowledge base.

The current version focuses on the frontend experience and uses mockdata. The backend, persistence, authentication, and AI-powered knowledgeextraction will be added in later stages.

✨ Current Features

📊 Dashboard with knowledge statistics

🗂️ Knowledge ledgers/categories

🧠 Memory/knowledge item cards

📈 Confidence indicators

🕒 Recent activity

🔎 Ledger-level search and filtering

👀 Memory detail view

➕ Add Memory flow using local state

📱 Responsive navigation

🎨 Consistent SaaS-style UI

🧩 Reusable React components

📝 TypeScript throughout the frontend

🛠️ Tech Stack

Frontend

Next.js 16

React

TypeScript

Tailwind CSS

shadcn/ui

Base UI

Lucide React

Planned Backend

Go --- backend/API

PostgreSQL --- persistent storage

AI/LLM pipeline --- knowledge extraction and classification

Authentication and user accounts

📁 Project Structure

ai-knowledge-ledger/
├── app/
│   ├── page.tsx
│   ├── ledger/
│   │   └── [id]/
│   │       └── page.tsx
│   └── settings/
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── ledger/
│   └── ui/
├── lib/
│   ├── dashboard-utils.ts
│   ├── icon-map.ts
│   ├── ledger-colors.ts
│   ├── ledger-utils.ts
│   ├── types.ts
│   └── mock-data/
├── public/
├── package.json
└── README.md

🚀 Getting Started

Prerequisites

Node.js

npm

Git

Installation

git clone <your-repository-url>
cd ai-knowledge-ledger
npm install

Development

npm run dev

Open http://localhost:3000 in your browser.

Production Build

npm run build
npm start

🧠 Core Concepts

Ledger

A ledger represents a category of knowledge.

Examples:

Programming

Web Development

Blockchain

Linux

System Design

Career

A ledger contains information such as its name, description, icon,color, item count, and last updated timestamp.

Knowledge Item

A knowledge item represents an individual piece of knowledge or memory.

A memory can contain:

Title

Description/content

Confidence score

Tags

Evidence/source references

Created timestamp

Updated timestamp

Ledger association

📈 Confidence System

Knowledge items can have confidence scores. A ledger confidence score isderived from the confidence of its knowledge items.

The long-term goal is to make confidence more meaningful using signalssuch as:

Repeated confirmation

Source quality

Recency

Contradicting information

User corrections

AI-generated confidence

The current implementation is intentionally simple and is mainly used tosupport frontend development.

🗺️ Roadmap

Phase 1 --- Frontend Foundation

Project setup

Dashboard

Sidebar navigation

Knowledge category cards

Statistics

Recent activity

Ledger detail page

Memory cards

Memory detail view

Add Memory UI

Settings page

Import conversations

Export knowledge

Phase 2 --- Persistent Backend

Go backend

REST API

PostgreSQL database

Database migrations

CRUD APIs for ledgers

CRUD APIs for memories

Evidence/source management

Authentication

Phase 3 --- AI Knowledge Pipeline

Conversation / Input
        ↓
   Data ingestion
        ↓
   Text processing
        ↓
 Knowledge extraction
        ↓
 Classification
        ↓
 Confidence scoring
        ↓
   Deduplication
        ↓
     PostgreSQL

Planned capabilities:

Import ChatGPT/Claude conversations

Automatically extract useful knowledge

Categorize knowledge into ledgers

Detect duplicate memories

Update existing knowledge

Identify contradictions

Generate confidence scores

Track evidence for each memory

Phase 4 --- Advanced Intelligence

Full-text search

Semantic search

Embeddings/vector search

Knowledge graph

Related memories

Contradiction detection

Knowledge summaries

AI-powered recommendations

Phase 5 --- Production

Authentication

User accounts

Cloud deployment

Database backups

Monitoring

Rate limiting

Security hardening

🎯 Project Goal

The long-term goal is to build a system that answers:

"What do I actually know?"

Instead of keeping knowledge scattered across ChatGPT conversations,Claude conversations, YouTube notes, PDFs, bookmarks, Notion pages, andrandom files, AI Knowledge Ledger aims to continuously organizeaccumulated knowledge into a structured personal knowledge base.

🔐 Current Limitations

This is an early-stage project.

Currently:

Data is primarily mock/local data.

Added memories are not permanently persisted.

There is no authentication.

There is no backend API.

There is no PostgreSQL database.

AI extraction is not implemented yet.

Import/export functionality is still under development.

These limitations are intentional while the frontend architecture anduser experience are being developed.

🤝 Contributing

This is currently being developed as a personal project. Contributionguidelines may be added when the project becomes open source.

📄 License

License information will be added when the project reaches its initialrelease.

🚧 Status

Early Development --- Frontend Phase

The core dashboard and ledger experience are currently being developed.The architecture will evolve as the backend and AI knowledge pipelineare introduced.

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and shadcn/ui.