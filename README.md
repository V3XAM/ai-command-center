# AI Command Center Mobile

Gotowa prosta aplikacja PWA w stylu Gemini-inspired.

## Co zawiera

- pełny mobilny interfejs,
- dolne menu: Start, AI, Laby, Admin, Linux, Notatki,
- boczne menu,
- przyciski do otwierania narzędzi,
- kopiowanie komend,
- lokalne notatki,
- manifest PWA,
- service worker,
- zaimportowane Android Skills w katalogu `android-skills/`,
- dokumentację uruchomienia Gemini CLI z Android Skills.

## Uruchomienie

Otwórz `index.html` w Chrome albo uruchom przez lokalny serwer:

```bash
python3 -m http.server 8080
```

## Instalacja na Androidzie

Chrome → trzy kropki → Dodaj do ekranu głównego.

## Gemini CLI + Android Skills

Repozytorium zawiera katalog `android-skills/` z zaimportowanymi Android Skills. Są to instrukcje dla agentów AI, które pomagają przy pracy z projektami Android, między innymi przy migracji do AGP 9, Jetpack Compose, testach, R8, CameraX, Navigation 3 i edge-to-edge.

Szczegółowa instrukcja konfiguracji znajduje się tutaj:

```text
docs/gemini-android-skills-setup.md
```

Szybki test Gemini CLI:

```bash
cd ~/ai-command-center
gemini -p "Respond with exactly: GEMINI_CLI_OK"
```

Test odczytu przykładowego Android Skill:

```bash
gemini -p "Read this file: /home/v3xam1999/.gemini/skills/android-skills/build/agp/agp-9-upgrade/SKILL.md. Summarize in Polish what this Android Skill is for in 5 bullet points."
```

## Bezpieczeństwo

Aplikacja nie zawiera kluczy API, haseł ani danych logowania.

Nie commituj do repozytorium:

- `GEMINI_API_KEY`,
- kodów OAuth,
- tokenów GitHub,
- plików `.env`,
- prywatnych konfiguracji kont Google Cloud.

Jeśli klucz API został przypadkowo wklejony publicznie lub zapisany w repozytorium, należy go unieważnić i wygenerować nowy.

## Prawa autorskie i własność intelektualna

Copyright (c) 2026 Mateusz Śliwiński. All rights reserved.

Ten projekt, w tym kod źródłowy, układ interfejsu, koncepcja aplikacji, dokumentacja, elementy graficzne, nazwa projektu oraz powiązane materiały, stanowią własność intelektualną Mateusza Śliwińskiego, o ile wyraźnie nie wskazano inaczej.

Publiczne udostępnienie repozytorium nie oznacza udzielenia licencji open source. Zabronione jest kopiowanie, modyfikowanie, redystrybuowanie, publikowanie, hostowanie, sprzedawanie, sublicencjonowanie, wykorzystywanie komercyjne oraz tworzenie prac zależnych bez wcześniejszej pisemnej zgody właściciela praw.

Szczegółowe warunki znajdują się w plikach `LICENSE` oraz `NOTICE.md`.
