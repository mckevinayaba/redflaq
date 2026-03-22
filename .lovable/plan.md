

# Generate RedFlaq Feature-to-Role Access Matrix (PDF)

This is a document generation task — no codebase changes needed.

## What the document will contain

A comprehensive PDF mapping **every feature** in RedFlaq to its required **role** (Public, User, Support, Admin, Owner), covering:

1. **Public Pages** (22 routes) — accessible to everyone, no auth
2. **Auth Flow** (4 routes) — signup, verify, reset, login
3. **User Dashboard** (14 routes) — requires authenticated user
4. **Admin Panel** (14 routes) — role-gated per AdminSidebar config
5. **Database Tables** (27+ tables) — RLS policy breakdown per role (SELECT/INSERT/UPDATE/DELETE)
6. **Edge Functions** (26 functions) — who can invoke each
7. **WhatsApp Bot** — service-level access
8. **Special Bypasses** — admin/owner credit bypass for testing

Each feature row will show checkmarks for which roles have access, using the hierarchy: Public < User < Support < Admin < Owner.

## Technical approach

- Python script using `reportlab` to generate a structured multi-page PDF
- Color-coded access matrix (green checkmarks, red X marks)
- Grouped by feature category
- Output to `/mnt/documents/RedFlaq_Feature_Role_Matrix.pdf`
- QA via `pdftoppm` image conversion

