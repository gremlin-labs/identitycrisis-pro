# Electron App Development Guidelines

## Tech Stack & Core Requirements
- **Framework**: Electron
- **Build Tool**: Vite
- **CSS Framework**: TailwindCSS 4
- **Icon Library**: Phosphor Icons

## General Principles

### Desktop-First Design
- This is a **desktop application**, not a website
- Do not implement mobile-specific layouts or media queries
- Design responsiveness should be limited to reasonable window resizing
- Consider desktop UI/UX patterns (menus, context menus, window controls)
- Take advantage of native OS capabilities where appropriate

### Code Quality & Organization
- No code duplication - extract reusable components and utilities
- Implement proper error handling for desktop-specific functions
- Document complex functions and components
- Use consistent naming conventions
- Reference the documentation in `/docs` and the `README.md` at project root
- Use TypeScript for type safety where possible

### UI/UX Guidelines

#### Styling
- **No inline CSS under any circumstances**
- All styling must use TailwindCSS classes
- Keep colors and styling separate from functional CSS
- Implement a proper theming system:
  - Use CSS variables for theme colors
  - Store theme configuration in a separate file
  - Design for easy theme swapping
  - Use semantic color names (e.g., `primary`, `secondary`, `accent`) rather than literal colors

#### Animations & Interactions
- Add delightful animations for enhanced user experience
- Use CSS transitions/animations for simple animations
- Consider libraries like Framer Motion for complex animations
- Animate:
  - Page transitions
  - Component mounting/unmounting
  - State changes
  - User interactions
- Ensure animations are performant and don't cause janky behavior

## Electron-Specific Best Practices

### Security
- Disable Node integration in renderer process when possible
- Use a Content Security Policy
- Validate input from IPC calls
- Keep Electron updated to latest stable version
- Use contextIsolation and worldSafeExecuteJavaScript

### Performance
- Avoid blocking the main process
- Use IPC sparingly and efficiently
- Consider process management for resource-intensive tasks
- Implement proper memory management
- Lazy load features/components when possible

### Native Integration
- Use preload scripts for secure access to Node APIs
- Properly handle file system operations asynchronously
- Implement proper window management
- Consider OS-specific behaviors and limitations
- Use native dialogs for file operations and important messages

### Application Lifecycle
- Handle window state preservation (size, position)
- Implement proper app update mechanisms
- Manage app close/minimize behavior appropriately
- Handle offline capabilities if required

## Vite Configuration Guidelines
- Configure Electron-specific plugins
- Set up proper build process for main and renderer processes
- Configure HMR for development
- Optimize asset management
- Set up environment-specific configurations

## TailwindCSS Implementation
- Configure TailwindCSS 4 properly for Electron context
- Create a consistent design system
- Implement custom theme extensions when needed
- Use JIT compilation for production builds
- Configure proper purging for production builds

## Project Structure
```
my-electron-app/
├── dist/                   # Built application files
├── src/
│   ├── main/               # Main process files
│   │   └── index.ts        # Main entry point
│   ├── preload/            # Preload scripts
│   │   └── index.ts        # Preload entry point
│   └── renderer/           # Renderer process files
│       ├── assets/         # Static assets
│       ├── components/     # Reusable UI components
│       ├── pages/          # Application pages/screens
│       ├── styles/         # Global styles & theme configuration
│       └── index.html      # HTML entry point
├── electron-builder.json   # Electron builder configuration
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── docs/                   # Project documentation
└── README.md               # Project overview
```

## Testing Guidelines
- Implement unit tests for critical functionality
- Set up E2E testing with Spectron or similar
- Test across different OS environments

## Deployment & Distribution
- Configure proper bundling with electron-builder
- Set up code signing for production builds
- Implement auto-update mechanisms
- Consider OS-specific installation behaviors

## Common Pitfalls to Avoid
- Don't treat the app like a website - consider desktop UX patterns
- Avoid synchronous IPC calls
- Don't ignore security best practices
- Don't make excessively responsive designs intended for mobile
- Don't mix inline CSS with TailwindCSS
- Don't duplicate code across renderer and main processes
- Don't block the main process with long-running operations

## Resources
- Always reference the documentation in `/docs` and the project `README.md`
- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Phosphor Icons Library](https://phosphoricons.com/)
