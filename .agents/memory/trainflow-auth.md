---
name: TrainFlow auth setup
description: Session-based authentication pattern — trainer email+password, student magic token
---

Auth uses express-session (SESSION_SECRET env var). No Supabase by user decision.

- Trainers: POST /api/auth/trainer/login and /api/auth/trainer/register with email + password
- Students: POST /api/auth/student/magic with token (random 32-byte hex, 7-day expiry, one-time use)
- Magic tokens stored in magic_tokens table with expiresAt and usedAt columns
- Password hashing: Node.js crypto scrypt (NOT bcrypt — bcrypt requires pnpm approve-builds)

**Why:** User explicitly declined Supabase. bcrypt has build script issues in pnpm monorepo.

**How to apply:** Always use `import { scrypt, randomBytes } from "crypto"` for password ops. For new student accounts, generate magic token in the same transaction as the profile insert.
