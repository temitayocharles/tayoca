# Tayoca Forgejo operations note — 2026-09-20

This note records repository-operation guidance for future Tayoca execution after the Forgejo MCP and canonical SSH repair work completed outside this repository.

## Current repository execution contract

- Use feature branches for all repository writes.
- Use the Forgejo file APIs with the current blob SHA for file updates.
- Open normal pull requests and merge normally after validation.
- Do not force-merge or bypass protections to work around stale Forgejo PR metadata.
- If a new PR reports `mergeable=false` while the branch is clean and required status is green, treat it as stale PR metadata. Close and reopen the PR record on the same feature branch rather than force-merging it.
- Delete temporary branches after merge when they are clearly superseded and not serving as durable evidence branches.

## Forgejo MCP repair evidence

- Forgejo MCP source PR: `temitayocharles/forgejo-mcp#12`
- Forgejo MCP merge SHA: `d96e43ed3c6f283d076b98e2597aab2b4e690318`
- GitOps promotion PR: `temitayocharles/homelab-gitops#1564`
- GitOps merge SHA: `7504c15884030c3a3743183f48acf48b2287922e`
- Reconciled MCP image: `forgejo.tayoca.com/temitayocharles/forgejo-mcp@sha256:24774cca2b7be36b94517c0524b0e0f8f2d4645d755bf097085d1382123b7371`
- Runtime build version: `sha-d96e43ed3c6f283d076b98e2597aab2b4e690318`

The repaired live MCP surface includes `create_branch`, `create_file`, `get_file_content`, `update_file`, `delete_file`, `delete_branch`, `create_pull_request`, and `merge_pull_request`.

## Canonical SSH transport boundary

Forgejo itself, its Kubernetes Service, its endpoint wiring, and its Cloudflare tunnel route were verified healthy. The canonical SSH hostname is:

```text
`git-ssh.tayoca.com`
```

Raw SSH to TCP/22 may fail because the hostname is Cloudflare Access-protected. The supported transport is Cloudflare Access SSH:

```bash
ssh -T \
  -o 'ProxyCommand=cloudflared access ssh --hostname %h' \
  git@git-ssh.tayoca.com
```

Expected successful transport behavior is a Forgejo SSH authentication response, such as key acceptance or `Permission denied (publickey)`. It should not fail with `No route to host` or close during Cloudflare Access key exchange.

## Safety boundary

No Forgejo data, SSH keys, tunnel credentials, or broad runtime database state should be mutated for normal Tayoca repo execution. Treat future SSH failures first as Cloudflare Access session or identity-policy issues unless internal Forgejo health, `forgejo-ssh` Service readiness, or the tunnel route evidence changes.
