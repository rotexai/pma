# pma

Internal project/task management, served at `internal.rotexai.com/pma`. Runs
[Vikunja](https://vikunja.io) (AGPLv3) - no feature is gated behind a paid
tier, and it authenticates against the `internal` Keycloak realm via OpenID
Connect (client `pma`).

This repo does **not** vendor Vikunja's source. Vikunja's frontend bakes its
router/asset base path in at build time, so the stock `vikunja/vikunja` image
can't be served from a subpath - see
[Running Vikunja in a Subdirectory](https://vikunja.io/docs/running-vikunja-in-a-subdirectory/).
`docker/Dockerfile.ci` clones a pinned upstream tag at build time and runs
Vikunja's own multi-stage build unmodified, except setting
`VIKUNJA_FRONTEND_BASE=/pma/` before the frontend build.

```bash
npm run build     # n/a - build-only repo, no local frontend
```

## Bumping the Vikunja version

Edit `ARG VIKUNJA_VERSION` at the top of `docker/Dockerfile.ci` to the new tag
(check https://github.com/go-vikunja/vikunja/tags), commit to `main`.
Woodpecker rebuilds the image and promotes the digest into
`manifest/clusters/rum/pma/kustomization.yaml` automatically, same as every
other service here.

## Auth

OIDC config lives in `manifest/clusters/rum/pma/configmap-patch.yaml`
(non-secret) and `manifest/clusters/rum/pma/pma-secrets.sealedsecret.yaml`
(client secret + DB credentials). The Keycloak client itself (`pma`, in the
`internal` realm) is created manually in the admin console - there's no
declarative realm config in this workspace.
