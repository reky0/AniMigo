# Contributing to AniMigo

Thank you for your interest in contributing to AniMigo! We appreciate contributions from the community and welcome bug reports, feature suggestions, and code contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project follows a standard code of conduct. Be respectful, constructive, and professional in all interactions.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** - A descriptive title for the issue
- **Description** - Detailed description of the problem
- **Steps to reproduce** - Step-by-step instructions
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Screenshots** - If applicable
- **Environment** - Browser/OS/device information
- **AniMigo version** - Version or commit hash

### Suggesting Features

Feature suggestions are welcome! When proposing a feature:

- **Check existing issues** - Make sure it hasn't been suggested already
- **Explain the use case** - Why would this feature be useful?
- **Describe the solution** - How should it work?
- **Consider alternatives** - Are there other ways to achieve this?

### Code Contributions

We love code contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** from `develop`
3. **Make your changes** following our coding guidelines
4. **Test your changes** thoroughly
5. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Android Studio (for Android development)

### Getting Started

1. Clone your fork:
   ```bash
   git clone https://github.com/reky0/AniMigo.git
   cd AniMigo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Running Tests

```bash
npm test        # Run unit tests
npm run lint    # Check code style
```

## 💻 Coding Guidelines

### TypeScript/Angular

- Use **standalone components** (no NgModules)
- Follow **Angular style guide** conventions
- Use **TypeScript strict mode** features
- Prefer **readonly** for immutable properties
- Use **async/await** over callbacks where appropriate
- Implement **OnDestroy** and clean up subscriptions

### Component Structure

We follow the **Atomic Design** pattern:

- **Atoms** - Basic UI elements (buttons, inputs, badges)
- **Molecules** - Simple component combinations
- **Organisms** - Complex UI sections
- **Pages** - Route-level components

### Naming Conventions

- **Components**: PascalCase (e.g., `MediaListComponent`)
- **Files**: kebab-case (e.g., `media-list.component.ts`)
- **Variables/Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`)

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use
- **Line length**: Max 120 characters (soft limit)
- **Comments**: Use JSDoc for functions, clear inline comments for complex logic

Example:
```typescript
/**
 * Fetch user profile data from AniList
 * @param userId - The AniList user ID
 * @returns Observable containing user profile data
 */
getUserProfile(userId: number): Observable<UserProfile> {
  return this.apollo.query<UserProfileResponse>({
    query: GET_USER_PROFILE,
    variables: { userId }
  }).pipe(
    map(result => result.data.User)
  );
}
```

### SCSS/Styling

- Use **Ionic CSS variables** for theming
- Follow **BEM methodology** for custom classes
- Avoid inline styles
- Use **CSS custom properties** for reusable values
- Mobile-first responsive design

## 📝 Commit Guidelines

We follow conventional commits for clear history:

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(media-list): add infinite scroll pagination
fix(auth): resolve OAuth redirect on mobile
docs(readme): update installation instructions
style(components): format code according to style guide
refactor(api): simplify GraphQL query structure
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 50 characters
- Capitalize subject line
- No period at the end of subject line
- Separate subject from body with blank line
- Wrap body at 72 characters
- Explain what and why, not how

## 🔄 Pull Request Process

1. **Update your branch** with the latest from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run tests and linting**:
   ```bash
   npm test
   npm run lint
   ```

3. **Push to your fork**:
   ```bash
   git push origin your-feature-branch
   ```

4. **Create pull request** with:
   - Clear title following commit conventions
   - Description of changes
   - Screenshots/GIFs for UI changes
   - Reference to related issues (if any)
   - Checklist of completed items

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] Changes are backward compatible

### Review Process

- PRs require at least one approval
- Address all review comments
- Keep discussions constructive and professional
- Be patient - maintainers review PRs as time permits

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency** - Follow existing patterns
- **Simplicity** - Don't overcomplicate interfaces
- **Responsiveness** - Test on multiple screen sizes
- **Accessibility** - Consider all users
- **Performance** - Optimize for speed

### Color Usage

Stick to the established color palette:

- Primary: `#5D8FDD` (Soft Blue)
- Secondary: `#F29079` (Warm Coral)
- Tertiary: `#7EA8E8` (Sky Blue)

Use Ionic color variables when possible.

## 🌐 Localization

When adding new text:

- Use translation keys (when i18n is implemented)
- Keep text concise and clear
- Consider context for translators
- Avoid hardcoding strings

## 📱 Mobile Development

### Android Specific

- Test on both emulator and physical device
- Check different Android versions
- Verify deep linking functionality
- Test offline scenarios
- Consider battery/performance impact

### Responsive Design

- Mobile-first approach
- Test on various screen sizes
- Use Ionic's responsive utilities
- Verify touch targets are adequate (min 44x44px)

## ❓ Questions?

If you have questions about contributing:

- Check existing documentation
- Search closed issues
- Open a discussion on GitHub
- Reach out in an issue

## 📄 License Note

By contributing to AniMigo, you agree that your contributions will be licensed under the same CC BY-NC 4.0 license that covers the project.

---

Thank you for contributing to AniMigo! Your efforts help make this project better for everyone. 🎉
