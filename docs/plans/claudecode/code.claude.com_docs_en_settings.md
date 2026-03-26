
**URL:** https://code.claude.com/docs/en/settings

---

Skip to main content
Claude Code Docs home page
English
Search...
Ctrl K
Ask AI
Claude Developer Platform
Claude Code on the Web
Getting started
Build with Claude Code
Deployment
Administration
Configuration
Reference
Resources
Configuration
Settings
Permissions
Sandboxing
Terminal configuration
Model configuration
Speed up responses with fast mode
Voice dictation
Output styles
Customize status line
Customize keyboard shortcuts
On this page
Configuration scopes
Available scopes
When to use each scope
How scopes interact
What uses scopes
Settings files
Available settings
Global config settings
Worktree settings
Permission settings
Permission rule syntax
Sandbox settings
Sandbox path prefixes
Attribution settings
File suggestion settings
Hook configuration
Settings precedence
Verify active settings
Key points about the configuration system
System prompt
Excluding sensitive files
Subagent configuration
Plugin configuration
Plugin settings
enabledPlugins
extraKnownMarketplaces
strictKnownMarketplaces
Managing plugins
Environment variables
Tools available to Claude
See also
CONFIGURATION
Claude Code settings
Copy page

Configure Claude Code with global and project-level settings, and environment variables.

Claude Code offers a variety of settings to configure its behavior to meet your needs. You can configure Claude Code by running the /config command when using the interactive REPL, which opens a tabbed Settings interface where you can view status information and modify configuration options.
​
Configuration scopes
Claude Code uses a scope system to determine where configurations apply and who they’re shared with. Understanding scopes helps you decide how to configure Claude Code for personal use, team collaboration, or enterprise deployment.
​
Available scopes
Scope	Location	Who it affects	Shared with team?
Managed	Server-managed settings, plist / registry, or system-level managed-settings.json	All users on the machine	Yes (deployed by IT)
User	~/.claude/ directory	You, across all projects	No
Project	.claude/ in repository	All collaborators on this repository	Yes (committed to git)
Local	.claude/settings.local.json	You, in this repository only	No (gitignored)
​
When to use each scope
Managed scope is for:
Security policies that must be enforced organization-wide
Compliance requirements that can’t be overridden
Standardized configurations deployed by IT/DevOps
User scope is best for:
Personal preferences you want everywhere (themes, editor settings)
Tools and plugins you use across all projects
API keys and authentication (stored securely)
Project scope is best for:
Team-shared settings (permissions, hooks, MCP servers)
Plugins the whole team should have
Standardizing tooling across collaborators
Local scope is best for:
Personal overrides for a specific project
Testing configurations before sharing with the team
Machine-specific settings that won’t work for others
​
How scopes interact
When the same setting is configured in multiple scopes, more specific scopes take precedence:
Managed (highest) - can’t be overridden by anything
Command line arguments - temporary session overrides
Local - overrides project and user settings
Project - overrides user settings
User (lowest) - applies when nothing else specifies the setting
For example, if a permission is allowed in user settings but denied in project settings, the project setting takes precedence and the permission is blocked.
​
What uses scopes
Scopes apply to many Claude Code features:
Feature	User location	Project location	Local location
Settings	~/.claude/settings.json	.claude/settings.json	.claude/settings.local.json
Subagents	~/.claude/agents/	.claude/agents/	None
MCP servers	~/.claude.json	.mcp.json	~/.claude.json (per-project)
Plugins	~/.claude/settings.json	.claude/settings.json	.claude/settings.local.json
CLAUDE.md	~/.claude/CLAUDE.md	CLAUDE.md or .claude/CLAUDE.md	None
​
Settings files
The settings.json file is the official mechanism for configuring Claude Code through hierarchical settings:
User settings are defined in ~/.claude/settings.json and apply to all projects.
Project settings are saved in your project directory:
.claude/settings.json for settings that are checked into source control and shared with your team
.claude/settings.local.json for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore .claude/settings.local.json when it is created.
Managed settings: For organizations that need centralized control, Claude Code supports multiple delivery mechanisms for managed settings. All use the same JSON format and cannot be overridden by user or project settings:
Server-managed settings: delivered from Anthropic’s servers via the Claude.ai admin console. See server-managed settings.
MDM/OS-level policies: delivered through native device management on macOS and Windows:
macOS: com.anthropic.claudecode managed preferences domain (deployed via configuration profiles in Jamf, Kandji, or other MDM tools)
Windows: HKLM\SOFTWARE\Policies\ClaudeCode registry key with a Settings value (REG_SZ or REG_EXPAND_SZ) containing JSON (deployed via Group Policy or Intune)
Windows (user-level): HKCU\SOFTWARE\Policies\ClaudeCode (lowest policy priority, only used when no admin-level source exists)
File-based: managed-settings.json and managed-mcp.json deployed to system directories:
macOS: /Library/Application Support/ClaudeCode/
Linux and WSL: /etc/claude-code/
Windows: C:\Program Files\ClaudeCode\
The legacy Windows path C:\ProgramData\ClaudeCode\managed-settings.json is no longer supported as of v2.1.75. Administrators who deployed settings to that location must migrate files to C:\Program Files\ClaudeCode\managed-settings.json.
File-based managed settings also support a drop-in directory at managed-settings.d/ in the same system directory alongside managed-settings.json. This lets separate teams deploy independent policy fragments without coordinating edits to a single file.
Following the systemd convention, managed-settings.json is merged first as the base, then all *.json files in the drop-in directory are sorted alphabetically and merged on top. Later files override earlier ones for scalar values; arrays are concatenated and de-duplicated; objects are deep-merged. Hidden files starting with . are ignored.
Use numeric prefixes to control merge order, for example 10-telemetry.json and 20-security.json.
See managed settings and Managed MCP configuration for details.
Managed deployments can also restrict plugin marketplace additions using strictKnownMarketplaces. For more information, see Managed marketplace restrictions.
Other configuration is stored in ~/.claude.json. This file contains your preferences (theme, notification settings, editor mode), OAuth session, MCP server configurations for user and local scopes, per-project state (allowed tools, trust settings), and various caches. Project-scoped MCP servers are stored separately in .mcp.json.
Claude Code automatically creates timestamped backups of configuration files and retains the five most recent backups to prevent data loss.
Example settings.json
Report incorrect code
Copy
Ask AI
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}

The $schema line in the example above points to the official JSON schema for Claude Code settings. Adding it to your settings.json enables autocomplete and inline validation in VS Code, Cursor, and any other editor that supports JSON schema validation.
​
Available settings
settings.json supports a number of options:
Key	Description	Example
apiKeyHelper	Custom script, to be executed in /bin/sh, to generate an auth value. This value will be sent as X-Api-Key and Authorization: Bearer headers for model requests	/bin/generate_temp_api_key.sh
autoMemoryDirectory	Custom directory for auto memory storage. Accepts ~/-expanded paths. Not accepted in project settings (.claude/settings.json) to prevent shared repos from redirecting memory writes to sensitive locations. Accepted from policy, local, and user settings	"~/my-memory-dir"
cleanupPeriodDays	Sessions inactive for longer than this period are deleted at startup (default: 30 days).

Setting to 0 deletes all existing transcripts at startup and disables session persistence entirely. No new .jsonl files are written, /resume shows no conversations, and hooks receive an empty transcript_path.	20
companyAnnouncements	Announcement to display to users at startup. If multiple announcements are provided, they will be cycled through at random.	["Welcome to Acme Corp! Review our code guidelines at docs.acme.com"]
env	Environment variables that will be applied to every session	{"FOO": "bar"}
attribution	Customize attribution for git commits and pull requests. See Attribution settings	{"commit": "🤖 Generated with Claude Code", "pr": ""}
includeCoAuthoredBy	Deprecated: Use attribution instead. Whether to include the co-authored-by Claude byline in git commits and pull requests (default: true)	false
includeGitInstructions	Include built-in commit and PR workflow instructions and the git status snapshot in Claude’s system prompt (default: true). Set to false to remove both, for example when using your own git workflow skills. The CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS environment variable takes precedence over this setting when set	false
permissions	See table below for structure of permissions.	
autoMode	Customize what the auto mode classifier blocks and allows. Contains environment, allow, and soft_deny arrays of prose rules. See Configure the auto mode classifier. Not read from shared project settings	{"environment": ["Trusted repo: github.example.com/acme"]}
disableAutoMode	Set to "disable" to prevent auto mode from being activated. Removes auto from the Shift+Tab cycle and rejects --permission-mode auto at startup. Most useful in managed settings where users cannot override it	"disable"
useAutoModeDuringPlan	Whether plan mode uses auto mode semantics when auto mode is available. Default: true. Not read from shared project settings. Appears in /config as “Use auto mode during plan”	false
hooks	Configure custom commands to run at lifecycle events. See hooks documentation for format	See hooks
disableAllHooks	Disable all hooks and any custom status line	true
allowManagedHooksOnly	(Managed settings only) Prevent loading of user, project, and plugin hooks. Only allows managed hooks and SDK hooks. See Hook configuration	true
allowedHttpHookUrls	Allowlist of URL patterns that HTTP hooks may target. Supports * as a wildcard. When set, hooks with non-matching URLs are blocked. Undefined = no restriction, empty array = block all HTTP hooks. Arrays merge across settings sources. See Hook configuration	["https://hooks.example.com/*"]
httpHookAllowedEnvVars	Allowlist of environment variable names HTTP hooks may interpolate into headers. When set, each hook’s effective allowedEnvVars is the intersection with this list. Undefined = no restriction. Arrays merge across settings sources. See Hook configuration	["MY_TOKEN", "HOOK_SECRET"]
allowManagedPermissionRulesOnly	(Managed settings only) Prevent user and project settings from defining allow, ask, or deny permission rules. Only rules in managed settings apply. See Managed-only settings	true
allowManagedMcpServersOnly	(Managed settings only) Only allowedMcpServers from managed settings are respected. deniedMcpServers still merges from all sources. Users can still add MCP servers, but only the admin-defined allowlist applies. See Managed MCP configuration	true
model	Override the default model to use for Claude Code	"claude-sonnet-4-6"
availableModels	Restrict which models users can select via /model, --model, Config tool, or ANTHROPIC_MODEL. Does not affect the Default option. See Restrict model selection	["sonnet", "haiku"]