# Hackathon Demo and Judge Walkthrough

## Goal

In a short demo, show that ApnaRaasta uses Qloo as an essential cultural-intelligence input, then turns the result into a practical, verified three-step community pathway. Do not overclaim the product's effect on loneliness or friendship.

## Suggested 3-minute flow

### 1. Establish the problem (20–30 sec)

“Finding events is easy; figuring out which local activities fit your taste and how to start participating is harder. ApnaRaasta builds a pathway from cultural interests to verified local activities and recurring communities.”

### 2. Enter one real profile (30 sec)

Choose a concrete test profile from supported cultural interests and approved filters. Use a profile that was pre-tested against real Qloo data and the verified Pune catalogue. Don't use a made-up user review or fictional activity as evidence.

### 3. Show the live result (45 sec)

Show the three steps and explain:
- which user-selected preferences were used;
- which activity facts have source evidence;
- which fields are unknown rather than invented;
- how Qloo's actual cultural signals influenced candidates (when returned).

### 4. Show the benchmark (45 sec)

Run the same profile through baseline and Qloo arms. Explain that the baseline sees no Qloo output, while the Qloo arm receives the actual resolved signals/insights. Highlight observable differences only; if results are similar, say so. Point out the same candidate pool and hard constraints to make the comparison fair.

### 5. Show saving (20–30 sec)

Generate as guest, click save, sign in with Google, save, and open history. Don't spend demo time on auth setup if the network is unreliable; have the signed-in session ready but never use a fake screen to claim persistence.

### 6. Close on impact (15 sec)

“ApnaRaasta doesn't promise friendship; it reduces friction between what someone enjoys and a practical first step into a local community.”

## Demo reliability plan

- Pre-test Qloo entity resolution and one `/v2/insights` query in the production deployment.
- Prepare one or two tested profiles and note their expected data coverage, but regenerate live during the demo when possible.
- Have an honest fallback screen for provider downtime. A recorded video or cached output may supplement the demo but must be labeled as recorded/cached, not live.
- Refresh date-specific source records before judging. Prefer recurring/evergreen activities to reduce time-sensitive failure.
- Do not keep a raw Qloo API response in the public repository for a demo shortcut.
