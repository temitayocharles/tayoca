# Book access v1.1 cutover evidence — 2026-09-19

## Finding

The existing `Tayoca Books | Subscriber Access Gateway v1` workflow declares its webhook authentication as `none`, but its Webhook node also had `options.ignoreBots=true`.

Clean GitHub-hosted probes showed that both the original book path and a cloned fresh path returned:

- HTTP 403
- `WWW-Authenticate: Basic realm="Webhook"`
- body `Authorization data is wrong!`

The same n8n edge returned HTTP 200 for the public reviews webhook, so the condition was not a global n8n or Cloudflare Basic-auth policy.

A cloned workflow was published as:

- ID: `d34GqqLxHunOOYDz`
- Name: `Tayoca Books | Subscriber Access Gateway v1.1`
- Webhook path: `tayoca/books/access-v2`

The clone preserves the original entitlement hashing, active-entitlement lookup, active-subscriber verification, artifact integrity check, binary response, and deny branch.

After removing only the `ignoreBots` option from the cloned Webhook node, a clean external request with an invalid 64-character token returned the workflow's intended controlled denial:

`{"ok":false,"error":"access_denied"}`

with HTTP 403 and **without** a Basic-auth challenge.

## Cutover

The public stable customer URL remains:

`https://tayoca.com/access/book?token=...`

Only the internal Vercel rewrite target changes from:

`https://n8n.tayoca.com/webhook/tayoca/books/access`

to:

`https://n8n.tayoca.com/webhook/tayoca/books/access-v2`

This preserves all existing printed/customer-facing access links.

## Rollback

Rollback is a one-line rewrite reversal to the original `tayoca/books/access` target. Do not archive the v1 workflow until the v1.1 path is certified with an authorized positive entitlement and the canonical Forgejo state records the cutover.


## Preview certification

Vercel deployment `dpl_G3ipA35RgrMQknuWf5U48oqtNgT6` built commit `09924d49c7d5fb1939cbbc66ddcd41d1e34612c3` as `READY`.

A protected-preview request to:

`/access/book?token=<invalid-64-character-token>`

returned:

- HTTP **403**
- `Content-Type: application/json`
- body `{"ok":false,"error":"access_denied"}`
- no `WWW-Authenticate` Basic challenge

This proves the stable Tayoca route reaches the v1.1 entitlement workflow and preserves fail-closed invalid-token behavior.

## Forgejo hostname migration evidence

The Tayoca-specific Cloudflare DNS credential confirms:

- `forgejo.tayoca.com` is a proxied CNAME to `8481ad36-ec4e-41a0-8891-00ae45c69a0c.cfargotunnel.com`
- `n8n.tayoca.com` is a proxied CNAME to the same tunnel

A direct request to `https://forgejo.tayoca.com/api/v1/version` reached Forgejo and returned the expected authenticated-API denial for an anonymous request. The legacy `forgejo.tca-infraforge.site` probe failed TLS from the same test environment.

The v1.1 book gateway currently reads its protected artifact from `https://forgejo.tayoca.com/... ` and continues to source its Forgejo credential from the server-side `FORGEJO_TOKEN` environment variable.
