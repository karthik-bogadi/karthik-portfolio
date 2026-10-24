# Karthik Kumar Bogadi — Portfolio

A modern, interactive developer portfolio showcasing my technical skills, projects, achievements, and journey as a backend-focused developer.

Built with a focus on clean design, smooth animations, responsive layouts, and engaging project storytelling.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Netlify / Vercel

## Features

- Animated hero section and interactive navigation
- Developer profile, technical skills, and interests
- Project showcase with descriptions, technology stacks, and repository links
- Education, experience, achievements, and certifications
- Coding statistics and problem-solving highlights
- Responsive design with smooth transitions and interactive elements
- Resume download and social profile links
- Contact section for professional inquiries

## Run Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone <your-repository-url>
cd <your-project-folder>
npm install
npm run dev
```

Open the local URL displayed in your terminal.

## Build and Preview

Build the production version:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
public/
├── animations/
├── profile-photo.jpg
├── profile-photo-about.jpg
└── Karthik_Kumar_Bogadi_Resume.pdf

src/
├── components/
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── HobbiesSection.tsx
│   ├── ProjectsSection.tsx
│   ├── BlogSection.tsx
│   ├── ContactSection.tsx
│   └── Navigation.tsx
├── config/
├── contexts/
├── hooks/
├── services/
├── utils/
├── App.tsx
└── main.tsx

netlify.toml
package.json
README.md
```

*Note: The structure above highlights the main project files; some files may vary as the project evolves.*

## Deployment

### Netlify

1. Push the project to GitHub.
2. Import the repository into Netlify.
3. Use `npm run build` as the build command.
4. Set `dist` as the publish directory.
5. Deploy the website.

The included `netlify.toml` provides the deployment configuration.

### Vercel

1. Import the GitHub repository into Vercel.
2. Select Vite as the framework preset.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Deploy the project.

## Future Improvements

- Email-enabled contact form
- Additional project previews and interactive experiences
- Further performance and accessibility improvements

## Author

**Karthik Kumar Bogadi**

- **GitHub:** https://github.com/karthik-bogadi

Explore my portfolio to learn more about my projects, technical interests, and development journey.