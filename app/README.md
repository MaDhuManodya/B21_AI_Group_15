# App folder

This folder is read by the **CI pipeline** ([`.github/workflows/cypress-tests.yml`](../.github/workflows/cypress-tests.yml)) to locate the QA Training App jar.

## Option A — Commit the jar (simplest)

Drop the jar here and commit it:

```
app/
└── qa-training-app.jar    ← the file CI looks for
```

> **Note:** This works for an academic / private repo. Don't commit large binaries to a public repo unless you're OK with the size.

## Option B — Download the jar at run time (cleaner)

Don't commit the jar. Instead, host it somewhere reachable (GitHub Release asset, S3, Drive direct link, etc.) and tell the workflow where to find it:

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions → Variables → New repository variable**
2. Name: `APP_JAR_URL`
3. Value: the public download URL of the jar
4. Save

The workflow will `curl` the URL into `qa-training-app.jar` at the start of each run.

## Option C — Build from source

If you ever have access to the QA Training App source code, you could add a build step to the workflow that compiles the jar before running tests. Out of scope for this assignment because the source isn't shared.

---

## What if I do nothing?

The workflow will fail with a clear error message telling you to pick Option A or B. No surprises.
