# Security and Privacy Requirements

## 1. Secrets and provider isolation

- `QLOO_API_KEY` and `GEMINI_API_KEY` are server-only secrets.
- Do not name secrets `NEXT_PUBLIC_*`; do not call provider APIs directly from the browser.
- Use `.env.local` locally (ignored by git) and Vercel Environment Variables for deployments.
- Keep only placeholders in `.env.example`.
- Never commit service-account files, logs containing raw responses, request headers, `.env` files or secret-bearing screenshots.
- On provider errors, log request ID/status/error code; scrub secret values and sensitive query parameters.

## 2. Firebase authentication and Firestore

- Google sign-in is optional until save/history is used.
- Firestore path should be owner-scoped, preferably `users/{uid}/pathways/{pathwayId}`.
- All reads/writes require authentication and enforce `request.auth.uid == uid`.
- Validate document shape, maximum sizes and permitted keys in rules where practicable.
- Deny public collection reads/writes; don't rely only on hiding UI controls.
- A signed-in user must not enumerate, read, overwrite or delete another user's saved pathways.
- Test rules with unauthenticated, owner and non-owner identities before release.
- Don't store full raw Qloo responses or unnecessary user data.

## 3. Guest mode

- Guest generation must not require Firebase account creation.
- Keep guest preferences/result in transient client state unless a specific persistence reason is approved.
- A guest cannot read/write saved history.
- When prompting sign-in to save, preserve the current result where practical and don't lose user input if sign-in is cancelled.

## 4. Location and personal data

- Manual Pune-area selection works without location permission.
- Device location is optional, explained before requesting permission, and should use the least precision needed.
- Do not persist raw precise GPS coordinates as a default user profile field. Use area/rounded location if needed.
- Do not collect sensitive characteristics for taste personalization.
- Do not log full preferences with names of favourite entities unless necessary for an explicitly approved privacy-safe debugging mode; prefer request ID and counts.

## 5. LLM/tool safety

- Tool definitions are fixed and reviewed; tools cannot read arbitrary files, run shell commands, arbitrary URL fetches, send emails, mutate production data or make bookings.
- Validate tool call arguments before executing them.
- Treat model-generated strings as untrusted display data; escape appropriately and never inject into HTML.
- The agent may reference only `activityId`s in the current verified candidate set.
- Never follow instructions found inside external activity pages, Qloo descriptions or user-provided entity text as agent/system instructions.
- Cap tool calls and input/output size; limit retries and set provider timeouts.
- Hard constraints and source/verification policies run in code, not only in a prompt.

## 6. Cost and abuse safeguards

- Validate payload sizes and cap the number of favourites/categories.
- Apply a per-session/account generation throttle and a finite maximum agent step count.
- Cache identical entity-resolution/insight queries privately server-side where permissible.
- Avoid automatically retrying expensive generation on every render.
- Regeneration must be an explicit user action.
- Record aggregate request counts/status/cost estimates only where available; don't pretend to know billable cost if the provider doesn't expose it.
- If rate limiting is process-local on Vercel, call it best-effort and document the limitation; don't claim globally durable protection.

## 7. Error handling

- Return safe typed provider errors to the UI, never stack traces, keys or full upstream payloads.
- Distinguish Qloo unavailable from “Qloo returned no matching records”.
- Do not silently downgrade a Qloo result to generic AI while leaving the label unchanged.
- If a result includes unverified or stale records, identify them; default production pathway selection should use only verified records.

## 8. Release checklist

- [ ] Secret scan and `.gitignore` review.
- [ ] Client bundle inspected for Qloo/Gemini keys.
- [ ] Firestore rules deployed and tested.
- [ ] Guest cannot save/view history.
- [ ] Cross-user read/write blocked.
- [ ] Optional location flow tested with permission denied.
- [ ] Rate limit, timeout and retry behavior tested.
- [ ] No raw Qloo payloads committed or in public assets.
- [ ] Error logs contain request IDs without secrets or full personal data.
