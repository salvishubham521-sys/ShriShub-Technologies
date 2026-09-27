# Nexora — AI Web Development Marketplace

A production-oriented full-stack foundation for selling fixed-price website/web-app development services.

## What is included

- Premium responsive public marketing site
- Service/product catalog
- Guided requirement intake
- AI-analysis API with safe fallback behavior
- Customer dashboard foundation
- Admin operations dashboard foundation
- Database schema for customers, products, pricing, orders, projects, contracts, payments, invoices, messages, notifications, reviews, portfolio, FAQs, AI knowledge and audit logs
- Supabase Auth/RLS architecture
- Razorpay server-side order creation and signature verification skeleton
- Environment-based secrets
- Health endpoint
- Dark futuristic design with accessibility-conscious contrast and reduced-motion support

## Architecture

Next.js 16 App Router + React 19
→ server routes / server components
→ Supabase Auth + PostgreSQL + Storage + Realtime
→ payment adapter (Razorpay first; Stripe/PayPal can be additional adapters)
→ AI provider adapter
→ email/notification provider

Next.js is appropriate because it provides full-stack React application capabilities and the current 16.3 line is Active LTS. Supabase is used for managed Postgres/Auth/Storage/Realtime, with RLS as the authorization boundary.

## Important production boundary

This repository is a serious foundation, not a claim that external services have been provisioned or legally approved. Before launch you must:

1. Create a Supabase production project.
2. Apply `supabase/schema.sql` as a migration and add Storage policies.
3. Configure email authentication and admin role provisioning.
4. Replace demo UI data with database queries.
5. Implement server-protected admin routes and middleware/proxy.
6. Configure Razorpay credentials and webhook endpoint; persist gateway events idempotently.
7. Add contract PDF generation/storage and an approved contract template.
8. Add transactional email provider and notification jobs.
9. Add real-time messaging using Supabase Realtime after RLS tests.
10. Add CSRF/origin checks for sensitive mutations, rate limiting and bot protection.
11. Add automated tests for authorization, payments and webhook replay.
12. Add backups, monitoring, error tracking and alerting.
13. Have privacy, refund and service-contract wording reviewed for your jurisdiction.

## Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Payment design

The client never receives the gateway secret. The server creates a gateway order after checking the database order, contract acceptance and final admin-approved amount. The gateway callback/webhook is verified server-side and processed idempotently.

Razorpay is a sensible first India-focused adapter because its current gateway supports cards, UPI, netbanking and wallets. Stripe can be added as a second adapter; Stripe's current India documentation notes restrictions on local payment methods for Indian Stripe accounts, so it should not be treated as a drop-in replacement for UPI.

## AI design

The `/api/ai/analyze` route currently uses a deterministic fallback so the app works without an AI key. In production, replace the internal section with a server-side provider call that:

- receives the user's description
- retrieves admin-approved service/pricing/FAQ knowledge
- requests structured JSON
- validates the response
- never writes price/status/contract changes directly
- logs the AI recommendation separately from the final admin decision

## GitHub Pages note

The supplied knowledge-base document describes GitHub Pages as free static hosting for personal sites and a no-command-line GitHub workflow. That is useful for the websites this platform sells, but the marketplace itself requires a server/database/payment backend and therefore should not be deployed as a GitHub Pages-only application.

## Suggested next implementation phases

Phase 1: Supabase Auth + real dashboard queries + RLS tests  
Phase 2: contract snapshots + PDF + acceptance audit trail  
Phase 3: Razorpay webhooks + invoice generation + idempotency  
Phase 4: Realtime messaging + private file storage  
Phase 5: AI provider + admin knowledge base + evaluation tests  
Phase 6: admin CMS + analytics + notification jobs  
Phase 7: security hardening, observability, load testing and launch review
