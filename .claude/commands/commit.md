---
description: add and commit your changes in git
allow-tool: Bash(git status:*), Bash(git add:*), Bash(git commit), Bash(git push), Read, Write
---

# Overview
Add and commit changes in git following conventional commit message format.

## Steps
<!-- this doe go to the model, try ! to not consune so many tokens -->
1. Run `git status` to see what changed
2. Run `git add .` to stage all changes
3. Choose a commit message following this convention:
   - `feat: <description>` — new feature
   - `fix: <description>` — bug fix
   - `chore: <description>` — maintenance task
4. Run `git commit -m "<message>"`
5. Run `git push` to push to remote
