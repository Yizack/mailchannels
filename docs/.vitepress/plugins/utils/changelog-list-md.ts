import { execSync } from "node:child_process";

const REPO_URL = "https://github.com/Yizack/mailchannels";

interface GitCommit {
  hash: string;
  date: string;
  message: string;
  author: string;
  version?: string;
}

interface VersionGroup {
  version: string;
  commits: GitCommit[];
}

// Cache for git history to avoid running git commands repeatedly
const historyCache = new Map<string, GitCommit[]>();
const versionCache = new Map<string, string>();

// Get the version (tag) for a specific commit
const getVersionForCommit = (commitHash: string): string | undefined => {
  if (versionCache.has(commitHash)) {
    return versionCache.get(commitHash);
  }

  try {
    // Find the tag that contains this commit
    const tag = execSync(`git describe --tags --abbrev=0 ${commitHash}`, {
      encoding: "utf8",
      cwd: process.cwd()
    }).trim();

    versionCache.set(commitHash, tag);
    return tag;
  }
  catch {
    return undefined;
  }
};

const getGitHistory = (filePath: string, limit = 50): GitCommit[] => {
  // Check cache first
  if (historyCache.has(filePath)) {
    return historyCache.get(filePath)!;
  }

  try {
    // Execute git log command with custom format
    // %H - commit hash
    // %aI - author date in ISO format
    // %s - commit subject (message)
    // %an - author name
    const gitCommand = `git log -n ${limit} --pretty=format:"%H|%aI|%s|%an" -- ${filePath}`;
    const output = execSync(gitCommand, { encoding: "utf8", cwd: process.cwd() });

    if (!output.trim()) {
      return [];
    }

    const commits = output.trim().split("\n")
      .map((line) => {
        const [hash, date, message, author] = line.split("|");
        const fullHash = hash || "";
        const version = getVersionForCommit(fullHash);

        return {
          hash: fullHash.substring(0, 7), // Short hash
          date: new Date(date || "").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }),
          message: message || "",
          author: author || "",
          version
        };
      })
      .filter((commit) => {
        // Only include commits that start with "feat:" or "fix:"
        const msg = commit.message.trim().toLowerCase();
        return msg.startsWith("feat") || msg.startsWith("fix") || msg.includes("refactor");
      });

    historyCache.set(filePath, commits);
    return commits;
  }
  catch (error) {
    console.error(`Error getting git history for ${filePath}:`, error);
    return [];
  }
};

// Group commits by version
const groupByVersion = (commits: GitCommit[]): VersionGroup[] => {
  const groups = new Map<string, GitCommit[]>();

  for (const commit of commits) {
    const version = commit.version || "Unreleased";
    if (!groups.has(version)) {
      groups.set(version, []);
    }
    groups.get(version)!.push(commit);
  }

  // Convert to array and sort by version (newest first)
  return Array.from(groups.entries())
    .map(([version, commits]) => ({ version, commits }))
    .sort((a, b) => {
      if (a.version === "Unreleased") return -1;
      if (b.version === "Unreleased") return 1;
      return b.version.localeCompare(a.version, undefined, { numeric: true });
    });
};

export const getChangelog = (filePath: string): string => {
  const commits = getGitHistory(filePath);

  if (!commits.length) {
    return "*No commit history available.*";
  }

  const groups = groupByVersion(commits);

  const changelog = groups
    .map(({ version, commits }) => {
      // Get the date of the first commit in this version
      const versionDate = commits[0]?.date || "";
      const dateFormatted = versionDate ? `<small style="color: var(--vp-c-text-2)">on ${versionDate}</small>` : "";
      const versionHeader = `- <a href="${REPO_URL}/releases/tag/${version}" target="_blank"><Badge>${version}</Badge></a> ${dateFormatted}\n`;
      const commitsList = commits
        .map(({ hash, message }) => {
          const formattedMessage = message.replace(/#(\d+)/g, (match, prNumber) => {
            return `[#${prNumber}](${REPO_URL}/pull/${prNumber})`;
          });
          return `   - [\`${hash}\`](${REPO_URL}/commit/${hash}) <span style="color: var(--vp-c-text-2)">—</span> ${formattedMessage}`;
        })
        .join("\n");
      return versionHeader + commitsList;
    })
    .join("\n\n");

  return `<div class="changelog-list">\n\n${changelog}\n\n</div>`;
};
