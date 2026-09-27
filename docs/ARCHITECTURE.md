# Architecture and business workflow

## Roles

- Customer: owns profile, orders, projects, requirements, messages, acceptances and reviews.
- Admin: controls catalog, prices, contracts, project status, refunds, reviews, AI knowledge and content.
- System: payment webhooks, notification jobs, audit events and AI analysis.

## Customer flow

Landing → service selection → requirements → AI analysis → admin-approved quote → order review → contract snapshot → acceptance → server-created payment order → gateway → verified webhook → project activation → dashboard/messages → review → delivery.

## Admin flow

Lead/order → requirement review → scope adjustment → price confirmation → contract issuance → payment verification → project start → milestone updates → client review → revisions → delivery → review request.

## Payment invariants

1. Amount is loaded from the database, never trusted from the browser.
2. Contract must be accepted before checkout.
3. Gateway order ID is stored against the internal payment/order.
4. Webhook signatures are verified.
5. Webhook processing is idempotent.
6. Only a verified captured payment can activate the project.
7. Refunds are admin-controlled and audited.

## Contract invariants

The customer accepts a versioned immutable snapshot, not a mutable template. Updating a template never changes previously accepted contracts.

## Messaging invariants

Every conversation belongs to one project. Customers can access only conversations for projects they own. Attachments use private object storage and short-lived signed URLs.

## AI invariants

AI output is advisory. The server validates structured output, stores it as an analysis record, and never lets model output mutate price, legal terms, project status or refund state.
