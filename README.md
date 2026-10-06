
# DevOps-A2

[![README activity](https://github.com/hambur0427/DevOps-A2/actions/workflows/update-readme.yml/badge.svg)](https://github.com/hambur0427/DevOps-A2/actions/workflows/update-readme.yml)
[![README markers](https://github.com/hambur0427/DevOps-A2/actions/workflows/check-readme-markers.yml/badge.svg)](https://github.com/hambur0427/DevOps-A2/actions/workflows/check-readme-markers.yml)

This repository demonstrates a least-privilege GitHub Actions workflow that keeps its activity summary current.

## Automated repository activity

<!-- ACTIVITY:START -->
Last refreshed: 2026-10-06 08:59:13 UTC

- Open issues: **4**
- Open pull requests: **0**

### Current open issues
- #4 [Test product search function](https://github.com/hambur0427/DevOps-A2/issues/4)
- #3 [Implement product search](https://github.com/hambur0427/DevOps-A2/issues/3)
- #2 [Create product posting form](https://github.com/hambur0427/DevOps-A2/issues/2)
- #1 [Create user login page](https://github.com/hambur0427/DevOps-A2/issues/1)
<!-- ACTIVITY:END -->

## Automation design

- `update-readme.yml` runs daily or on demand and commits an updated activity summary only when it changes.
- `check-readme-markers.yml` prevents removal of the protected README markers.
- `preview-readme.yml` comments the generated README diff on each pull request without committing it.
- No long-lived repository secret is stored: workflows use GitHub's short-lived `GITHUB_TOKEN`.
- API calls use rate-limit awareness and exponential retry logic.

## Issue and Project workflow

Work is tracked as GitHub Issues and added to the **DevOps-A2** GitHub Project. Pull requests use `Closes #<issue-number>` so GitHub closes the linked issue automatically after merge.
