# Git Contribution Guide

Welcome contributors! 👋  
This guide will help you understand the complete Git workflow used in this project.  
If you're making your first contribution, follow the steps carefully.

---

# 1. Fork the Repository

Forking creates a copy of the repository under your GitHub account.

### Steps
1. Open the original repository.
2. Click the **Fork** button on the top-right corner.
3. GitHub will create a copy in your account.

> [!TIP]
> Always fork the repository before making changes.

---

# 2. Clone Your Fork Locally

Clone your forked repository to your local machine.

```bash
git clone https://github.com/your-username/repository-name.git
```

Move into the project directory:

```bash
cd repository-name
```

---

# 3. Add Upstream Remote

The upstream remote connects your local repository to the original project repository.

```bash
git remote add upstream https://github.com/original-owner/repository-name.git
```

Verify remotes:

```bash
git remote -v
```

You should see:

- `origin` → your fork
- `upstream` → original repository

> [!IMPORTANT]
> Upstream helps you keep your fork updated with the latest project changes.

---

# 4. Sync Latest Changes

Before starting new work, pull the latest updates from the original repository.

```bash
git pull upstream master
```

If the project uses `main` instead of `master`:

```bash
git pull upstream main
```

---

# 5. Create a New Branch

Never work directly on the `main` or `master` branch.

Create a separate branch for every issue or feature.

```bash
git checkout -b feature/your-feature-name
```

Example:

```bash
git checkout -b feature/navbar-fix
```

For bug fixes:

```bash
git checkout -b bug/login-error-fix
```

> [!WARNING]
> Do not push changes directly to the main development branch.

---

# 6. Make Your Changes

Now you can:
- Add new files
- Modify existing files
- Fix bugs
- Improve documentation

After completing your work, check changed files:

```bash
git status
```

---

# 7. Stage Changes

Stage all modified files:

```bash
git add .
```

Or stage a specific file:

```bash
git add filename
```

---

# 8. Commit Changes

Write meaningful commit messages.

### Good Commit Messages

```bash
git commit -m "docs: add Git contribution guide"
```

```bash
git commit -m "fix: resolve navbar alignment issue"
```

```bash
git commit -m "feat: add dark mode support"
```

### Avoid Bad Commit Messages

❌ `updated file`  
❌ `changes made`  
❌ `final final fix`

> [!TIP]
> Clear commit messages make project history easier to understand.

---

# 9. Push Changes

Push your branch to your GitHub fork.

```bash
git push origin feature/your-feature-name
```

Example:

```bash
git push origin feature/navbar-fix
```

---

# 10. Create a Pull Request (PR)

1. Open your fork on GitHub.
2. Click **Compare & Pull Request**.
3. Add a proper title and description.
4. Submit the PR to the correct branch.

### Example PR Title

```text
docs: add beginner-friendly Git guide
```

---

# 11. Resolve Merge Conflicts

Sometimes your branch may conflict with the latest project changes.

Pull latest changes first:

```bash
git pull upstream master
```

Fix conflicts manually in the affected files.

After resolving:

```bash
git add .
git commit -m "fix: resolve merge conflicts"
```

---

# 12. Squash Multiple Commits

If you made many unnecessary commits, squash them into one clean commit.

Start interactive rebase:

```bash
git rebase -i HEAD~3
```

Replace `3` with the number of commits you want to combine.

> [!IMPORTANT]
> Squashing keeps commit history clean and professional.

---

# 13. Best Practices

✅ Pull latest upstream changes before starting work  
✅ Use separate branches for every issue  
✅ Write clean and readable code  
✅ Use semantic commit messages  
✅ Test your changes before pushing  
✅ Read project contribution guidelines carefully

---

# 14. Common Mistakes to Avoid

❌ Working directly on `main` or `master`  
❌ Creating huge pull requests  
❌ Writing unclear commit messages  
❌ Ignoring merge conflicts  
❌ Pushing unnecessary files

---

# 15. Need Help?

If you get stuck:
- Read the project documentation
- Ask maintainers politely
- Search GitHub Discussions or Issues
- Learn gradually — everyone starts somewhere 🚀

Happy Contributing! 🎉