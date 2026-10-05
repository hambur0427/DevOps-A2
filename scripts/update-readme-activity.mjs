import { readFile, writeFile } from "node:fs/promises";

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const readmePath = "README.md";
const startMarker = "<!-- ACTIVITY:START -->";
const endMarker = "<!-- ACTIVITY:END -->";

if (!repository || !token) throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required.");
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function api(path, attempt = 0) {
  const response = await fetch(`https://api.github.com${path}`, { headers: {
    Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "devops-a2-readme-automation",
  }});
  if (response.ok) return response.json();
  const retryable = response.status === 429 || response.status >= 500 ||
    (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0");
  if (!retryable || attempt >= 4) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  const resetAt = Number(response.headers.get("x-ratelimit-reset")) * 1000;
  const rateLimitDelay = Number.isFinite(resetAt) ? Math.max(0, resetAt - Date.now() + 1000) : 0;
  await sleep(Math.max(1000 * 2 ** attempt, Math.min(rateLimitDelay, 60_000)));
  return api(path, attempt + 1);
}

const [issues, pullRequests] = await Promise.all([
  api(`/repos/${repository}/issues?state=open&per_page=100`),
  api(`/repos/${repository}/pulls?state=open&per_page=100`),
]);
const openIssues = issues.filter((issue) => !issue.pull_request);
const now = new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
const section = [
  `Last refreshed: ${now}`, "", `- Open issues: **${openIssues.length}**`,
  `- Open pull requests: **${pullRequests.length}**`, "", "### Current open issues",
  ...(openIssues.length ? openIssues.slice(0, 10).map((issue) => `- #${issue.number} [${issue.title}](${issue.html_url})`) : ["- None"]),
].join("\n");
const readme = await readFile(readmePath, "utf8");
const start = readme.indexOf(startMarker);
const end = readme.indexOf(endMarker);
if (start === -1 || end === -1 || end < start) throw new Error("README activity markers are missing or malformed.");
const updated = `${readme.slice(0, start + startMarker.length)}\n${section}\n${readme.slice(end)}`;
await writeFile(readmePath, updated);
console.log(`README activity generated for ${openIssues.length} issue(s) and ${pullRequests.length} PR(s).`);
