# Task 3 implementation report

Status: `DONE_WITH_CONCERNS`

## Execution result

Implemented the reusable strict article-contract inspector in
`tests/java-course-content.test.mjs`. New or migrated pages opt into the
contract through `ARTICLE_CONTRACT_MANIFEST.entries`; legacy pages continue to
use their existing checks until a later task explicitly adds a route.

The inspector now validates complete frontmatter (`title`, `date`,
`category`, `tags`, `description`), the exact H2 sequence, an operation-named
H3, an immediate purpose sentence, executable Java/SQL/Redis CLI examples,
concrete initial state, concrete transition, and an observable result. The
`DANGEROUS_MYSQL_REDIS_TOKENS` vocabulary detects dangerous SQL/Redis
operations and requires a nearby explicit risk/boundary statement. Keyed
`UPDATE`/`DELETE` examples and ordinary `DEL user:7` examples remain safe;
broad writes, `FLUSHALL`, `KEYS`, and large-key deletion are gated.

## RED evidence

After adding the tests and four fixtures but before implementing the inspector:

```text
node --test tests/java-course-content.test.mjs --test-name-pattern="article contract|example state|danger boundary"
→ 3 failed: ReferenceError: inspectArticleContract is not defined
```

## GREEN and regression evidence

Final focused run after commit:

```text
node --test --test-name-pattern="article contract|example state|danger boundary" tests/java-course-content.test.mjs
→ 4 pass, 0 fail
```

Relevant content suite:

```text
node --test tests/java-course-content.test.mjs
→ 39 pass, 0 fail
```

Full repository suite:

```text
corepack pnpm@9.15.9 test
→ 75 pass, 1 fail
```

The one failure is the pre-existing `tests/open-source-data.test.mjs` source
text assertion that still requires `getItems("courses/java")`; Task 1 changed
the Java sidebar to `getJavaCourseItems()`, and updating that unrelated test is
outside Task 3 ownership. `git diff --check` passed.

Fixture-specific assertions:

- `only-final-output.md` fails only with `[example:state]` because it contains
  only a final output comment.
- `template-comment.md` fails only with `[example:template]` for
  `执行后得到预期结果`.
- `missing-purpose.md` fails only with `[example:purpose]`.
- `danger-without-warning.md` fails only with `[danger:boundary]` for
  unbounded `FLUSHALL`.

## Commit and files

- Commit: `1bd3e45c3` (`test(java): enforce searchable stateful examples`)
- `tests/java-course-content.test.mjs`
- `tests/fixtures/java-course/only-final-output.md`
- `tests/fixtures/java-course/template-comment.md`
- `tests/fixtures/java-course/missing-purpose.md`
- `tests/fixtures/java-course/danger-without-warning.md`

## Concerns

1. `ARTICLE_CONTRACT_MANIFEST.entries` is intentionally empty in this task;
   Tasks 4–13 must append their new/migrated/materially rewritten route
   metadata there rather than broadening the scope implicitly.
2. The repository-wide stale sidebar assertion remains red as described above;
   no unrelated test file was modified.
3. A VitePress build was not part of the Task 3 brief and remains pending the
   shared dependency setup used by later content tasks.

## Review fix round 1

Status: `DONE_WITH_CONCERNS`

The danger scanner now lexes comments and string literals out of SQL, Redis,
shell, and Java executable text before matching operations. Java strings are
re-scanned only when passed to JDBC execution methods or Redis script/template
execution. `UPDATE`/`DELETE` now reject missing or tautological predicates,
including `WHERE TRUE`, `1 = 1`, and tautologies combined with `OR`.

Danger matches retain their code-block line and are checked independently in a
small adjacent window. A boundary must contain an explicit risk, limit, or
avoidance statement plus evidence for that operation (for example `WHERE`, a
key scope, lock handling, or backup/recovery). H3 names now correlate with
executable Java calls, constructors, annotations, or known SQL/Redis command
patterns; arbitrary identifiers such as `Foo` and `NotAnApi` fail.

The regression matrix covers KEYS, broad and big-key DEL/UNLINK, broad
UPDATE/DELETE, lock/backup, SQL/Redis comments and literals, JDBC and Redis
Java strings, tautologies, local positive boundaries, and per-occurrence
association. The four persisted negative fixtures now assert the exact single
issue type they intend to exercise.

Review fix verification:

```text
corepack pnpm@9.15.9 exec node --test --test-name-pattern="article contract checks|example state|danger boundary requires|danger and executable|danger boundaries|operation H3|article contract manifest" tests/java-course-content.test.mjs
→ 7 pass, 0 fail

corepack pnpm@9.15.9 exec node --test tests/java-course-content.test.mjs
→ 42 pass, 0 fail

corepack pnpm@9.15.9 test
→ 78 pass, 1 fail
```

The remaining full-suite failure is the pre-existing
`tests/open-source-data.test.mjs` assertion that still expects the old
`getItems("courses/java")` sidebar source after Task 1 moved Java to
`getJavaCourseItems()`. `git diff --check` passed.

Commit: `b4bd17db8` (`test(java): harden article quality gates`)

### Review fix round 1 completion

Status: `DONE_WITH_CONCERNS`

Commit `b4bd17db8` closes the first review findings in the article contract
gate:

- Each API H3 now requires one or two complete purpose sentences immediately
  before its example. Java/SQL/Redis operations are correlated to the actual
  executable API or command so arbitrary identifiers and mismatched commands
  fail the searchable-heading rule.
- Comments are not required for routine declarations, assignments, or direct
  calls. The strict gate rejects a comment that exactly restates adjacent
  executable code while retaining concrete input, meaningful transition,
  side-effect/boundary, and output evidence. The four original negative
  fixtures assert exact issue-type arrays; a fifth fixture isolates a
  tautological comment.
- SQL, Redis CLI, shell Redis commands, and Java JDBC/Redis script strings are
  lexed so comments and literal values are not mistaken for commands. SQL
  `UPDATE`/`DELETE` requires a bounded predicate; missing predicates and
  tautologies under `OR` fail, while `FALSE` and an extra tautology under a
  selective `AND` do not count as broad writes.
- Each executable danger occurrence receives its own adjacent check. The
  boundary must mention the matching operation and include operation-specific
  scope or impact evidence; a nearby warning for `SCAN`, `KEYS`, backup, or a
  different write/lock command cannot satisfy it.
- The regression matrix includes positive and negative cases for keyed and
  broad SQL writes, Redis `KEYS`/`DEL`/`UNLINK`, lock/backup boundaries,
  comments/literals, JDBC/Redis Java strings and variables, Redis CLI options,
  operation-name correlation, exact fixture issue counts, and useful
  multi-step collection state comments.

Verification after the fix commit:

```text
corepack pnpm@9.15.9 exec node --test --test-name-pattern="article contract checks|article contract rejects tautological|danger boundary requires|danger and executable|danger boundaries|operation H3|article contract manifest" tests/java-course-content.test.mjs
→ 8 pass, 0 fail

corepack pnpm@9.15.9 exec node --test tests/java-course-content.test.mjs
→ 44 pass, 0 fail

corepack pnpm@9.15.9 test
→ 80 pass, 1 fail (pre-existing stale sidebar source assertion in tests/open-source-data.test.mjs)

git diff --check
→ pass
```

The remaining full-suite failure is `tests/open-source-data.test.mjs` expecting
`getItems("courses/java")`; Task 1 now supplies the Java sidebar through
`getJavaCourseItems()`. The ownership brief excludes that unrelated test file.

### Review fix round 2

Status: `DONE_WITH_CONCERNS`

SQL WHERE analysis now retains quoted literals in a same-length semantic mask
while still excluding comments. Boolean splitting respects quotes and
parentheses, and recognizes equal string, numeric, and boolean comparisons in
OR branches. The Java scanner associates SQL/Redis literal occurrences with
the actual execution-call line, handles literal concatenation and text blocks,
and conservatively requires an execution-line boundary for dynamic SQL
construction. H3 receiver checks reject an unrelated `Foo.get` while allowing
receiver types and actual calls to agree. Comment checks retain literal
arguments for tautological restatement detection and reject only enumerated
no-information phrases; arbitrary informative comments remain accepted.

Verification:

```text
corepack pnpm@9.15.9 exec node --test --test-name-pattern="article contract checks|article contract rejects tautological|danger boundary requires|danger and executable|danger boundaries|operation H3|article contract manifest" tests/java-course-content.test.mjs
→ 8 pass, 0 fail

corepack pnpm@9.15.9 exec node --test tests/java-course-content.test.mjs
→ 44 pass, 0 fail

corepack pnpm@9.15.9 test
→ 80 pass, 1 fail (the known stale sidebar-source assertion in tests/open-source-data.test.mjs)

git diff --check
→ pass
```

Commit: pending.
