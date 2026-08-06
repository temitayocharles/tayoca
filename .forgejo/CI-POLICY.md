# CI execution policy

Forgejo Actions is the permanent CI authority for Tayoca.

- Use `forgejo-general` for ordinary validation and test jobs.
- Use `forgejo-container` for Docker builds and container-heavy jobs.
- GitHub-hosted runners are temporary fallback only and are not the default execution platform.
- GitHub remains a source mirror and deployment integration point where required, while CI evidence is produced by Forgejo Actions.
