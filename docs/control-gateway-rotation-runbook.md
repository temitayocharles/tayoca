# Tayoca control gateway credential rotation

The live gateway currently has an embedded shared authorization value. Treat that value as compromised and never copy it into source, logs, tickets, chat, or a replacement secret record.

## Safety invariants

- The replacement credential is generated inside Forgejo Actions and is never an input to the workflow.
- Vault writes are restricted to `temitayo/staging/platform-tools/n8n/tayoca-control-gateway` by an exact-path JWT policy.
- Vercel authentication is delegated through the existing Composio connected account; the workflow never obtains a raw Vercel credential.
- The first bootstrap phase stages the candidate in Vault only. It does not change Vercel or the live n8n Deployment.
- The live gateway must accept the old embedded credential and the new environment-backed credential concurrently before Vercel is switched.
- The embedded credential is removed only after an authorized request with the new credential succeeds and an invalid credential still fails closed.

## Ordered rollout

1. Merge and reconcile the dedicated Vault JWT policy/role.
2. Make `COMPOSIO_API_KEY` available to the Tayoca Forgejo Actions workflow through the existing ESO-to-Actions bootstrap boundary.
3. Dispatch `control-gateway-secret-bootstrap.yml` on protected `main` with a unique non-secret `request_id`. This generates and stages the replacement at the dedicated Vault path and verifies the Composio/Vercel route without changing Vercel.
4. Reconcile the dedicated `n8n-tayoca-control-gateway` ExternalSecret.
5. Add `TAYOCA_CONTROL_GATEWAY_TOKEN` to the authoritative `n8n-direct-deploy` source and perform a controlled direct deployment so the variable exists in the n8n process.
6. Update and publish the gateway workflow so authorization accepts either the existing embedded credential or `$env.TAYOCA_CONTROL_GATEWAY_TOKEN`. Verify both authorized behavior and fail-closed behavior.
7. Use the staged candidate from inside trusted automation to call Composio `VERCEL_EDIT_PROJECT_ENV` for the existing sensitive Vercel env record. Never print the request body or response value.
8. Verify the Vercel control center can call the gateway successfully using the new credential.
9. Update and publish the gateway a second time so it accepts only `$env.TAYOCA_CONTROL_GATEWAY_TOKEN`; the embedded credential must no longer appear in workflow code.
10. Mark the dedicated Vault record `active` with non-secret rotation metadata and record only hashes/IDs in reconciliation evidence.

## Rollback

Before step 7, rollback is simply to leave Vercel unchanged and keep the old gateway behavior. Between steps 7 and 9, the gateway accepts both credentials, so Vercel may be switched back if verification fails. After step 9, rollback requires restoring the dual-acceptance workflow version, not reusing or redistributing the compromised credential.
