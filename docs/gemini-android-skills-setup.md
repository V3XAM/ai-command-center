# Gemini CLI and Android Skills setup

This project is a PWA command center with Android Skills imported for AI-assisted Android development workflows.

## Project type

`ai-command-center` is currently a Progressive Web App. It is not a native Android Gradle project.

Core PWA files:

```text
index.html
style.css
script.js
manifest.json
sw.js
```

## Android Skills

The Android Skills package is stored in:

```text
android-skills/
```

Local Cloud Shell copies were prepared in:

```text
~/.gemini/skills/android-skills/
~/gemini-ui-host/.skills/android-skills/
~/AI_Command_Center_READY/.skills/android-skills/
```

Example skills:

```text
build/agp/agp-9-upgrade/SKILL.md
testing/testing-setup/SKILL.md
device-ai/appfunctions/SKILL.md
performance/r8-analyzer/SKILL.md
camera/camera1-to-camerax/SKILL.md
jetpack-compose/migration/migrate-xml-views-to-jetpack-compose/SKILL.md
system/edge-to-edge/SKILL.md
navigation/navigation-3/SKILL.md
xr/display-glasses-with-jetpack-compose-glimmer/SKILL.md
```

## Gemini CLI

Install Gemini CLI from the official Google package:

```bash
npm install -g @google/gemini-cli
```

Check installation:

```bash
command -v gemini
gemini --version
```

## Test commands

Basic CLI test:

```bash
cd ~/ai-command-center
gemini -p "Respond with exactly: GEMINI_CLI_OK"
```

Android Skill read test:

```bash
gemini -p "Read this file: /home/v3xam1999/.gemini/skills/android-skills/build/agp/agp-9-upgrade/SKILL.md. Summarize in Polish what this Android Skill is for in 5 bullet points."
```

Repository analysis test:

```bash
gemini -p "Analyze this repository. Tell me in Polish what type of project it is, what files are important, what is already working, and what should be improved next. Do not modify files yet."
```

## Current diagnosis

Gemini CLI identified this repository as a PWA / personal AI command center. Android Skills are available as supporting AI instructions, but they are not yet integrated into the PWA user interface.

## Next implementation steps

1. Keep this documentation as the baseline.
2. Add persistent checklist state with localStorage.
3. Add an Android Skills section in the UI.
4. Add copyable Gemini prompts for selected skills.
5. Add multi-note support.
6. Add a light/dark theme switcher.
