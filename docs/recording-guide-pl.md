# Przewodnik tworzenia materiałów wizualnych - GIF-y i Screenshoty

*Krok po kroku jak nagrać najlepsze GIF-y i screenshoty dla case study*

---

## 🎬 Narzędzia (Darmowe)

### Do GIF-ów:
- **Windows:** ScreenToGif (https://www.screentogif.com/)
- **Mac:** Kap (https://getkap.co/)
- **Linux:** Peek (https://github.com/phw/peek)
- **Cross-platform:** LICEcap (https://www.cockos.com/licecap/)

### Do Screenshotów:
- **Windows:** Win + Shift + S (wbudowane)
- **Mac:** Cmd + Shift + 4 (wbudowane)
- **Browser:** Chrome DevTools (F12 → Cmd/Ctrl + Shift + P → "Capture screenshot")

### Do Edycji:
- **Kompresja GIF:** https://ezgif.com/optimize
- **Edycja obrazów:** Figma (za darmo), Canva, lub GIMP

---

## 📸 Screenshoty do zrobienia

### 1. Kanban Board - Pełny widok ⭐⭐⭐

**Przygotowanie:**
1. Zaloguj się do demo: https://orbitask-manager-1.onrender.com/
   - Email: test@gmail.com
   - Hasło: 12test34
2. Stwórz przynajmniej 3-4 taski w każdej kolumnie
3. Ustaw różne priorytety (niski, średni, wysoki, pilny)
4. Dodaj różne projekty z różnymi kolorami
5. Ustaw light theme (jeśli masz dark)

**Nagrywanie:**
1. Powiększ okno przeglądarki do 1920x1080
2. Otwórz widok Kanban
3. Upewnij się że widać wszystkie 4 kolumny
4. Zrób screenshot (Win+Shift+S lub Cmd+Shift+4)
5. Zapisz jako: `kanban-board-light.png`

**Powtórz dla dark theme:**
- Przełącz na dark theme
- Zrób ten sam screenshot
- Zapisz jako: `kanban-board-dark.png`

### 2. Task Detail Modal ⭐⭐

**Przygotowanie:**
1. Stwórz task z wszystkimi polami wypełnionymi:
   - Tytuł: "Implement user authentication"
   - Opis: "Add JWT-based auth with login/register"
   - Status: In Progress
   - Priorytet: High
   - Due date: za tydzień
   - Tags: "authentication, security, backend"
   - Projekt: jakiś kolorowy projekt

**Nagrywanie:**
1. Kliknij na ten task żeby otworzyć modal
2. Poczekaj aż się w pełni załaduje
3. Screenshot modala
4. Zapisz jako: `task-detail.png`

### 3. Projects Page ⭐⭐

**Przygotowanie:**
1. Stwórz 4-6 projektów z różnymi kolorami
2. Różne nazwy (np. "Website Redesign", "Mobile App", "Marketing Campaign")
3. Dodaj opisy do projektów

**Nagrywanie:**
1. Przejdź na stronę Projects
2. Upewnij się że widać grid/lista projektów
3. Screenshot całej strony
4. Zapisz jako: `projects-page.png`

### 4. Mobile View ⭐

**Przygotowanie:**
1. Otwórz Chrome DevTools (F12)
2. Kliknij ikonę mobile device toggle (Ctrl+Shift+M)
3. Wybierz iPhone 12 Pro lub podobne
4. Odśwież stronę

**Nagrywanie:**
1. Otwórz menu mobile (hamburger icon)
2. Screenshot z otwartym menu
3. Zapisz jako: `mobile-view.png`

### 5. Filters w akcji ⭐

**Nagrywanie:**
1. Widok Kanban z otwartymi filtrami
2. Zaznacz kilka filtrów (status, priorytet, projekt)
3. Screenshot
4. Zapisz jako: `filters-active.png`

---

## 🎥 GIF-y do nagrania

### 1. tRPC Type Safety (NAJWAŻNIEJSZY) ⭐⭐⭐

**Cel:** Pokazać że zmiana typu na backendzie natychmiast powoduje błąd na frontendzie.

**Setup:**
1. Otwórz VS Code z projektem
2. Otwórz dwa pliki obok siebie:
   - Lewy: `backend/src/schemas/task.schema.ts`
   - Prawy: `frontend/src/features/tasks/hooks/useTasks.ts`
3. Uruchom `npm run dev` w obu folderach

**Nagrywanie (15-20 sekund):**
```
Akcja 1: (5s)
- Pokaż cursor na backend schema
- Zmień enum priority: dodaj nową wartość 'critical'
  
Akcja 2: (5s)
- Przejdź na frontend
- Pokaż czerwone podkreślenie TypeScript error
- Hover nad errorem (pokazuje komunikat)

Akcja 3: (5-10s)
- Zacznij wpisywać 'critical' w komponencie
- Pokaż autocomplete (pokazuje nową wartość!)
- Wybierz z autocomplete
- Error znika ✅
```

**Tips:**
- Nagraj w 60 FPS dla płynności
- Zwolnij cursor movements (nie machaj chaotycznie)
- Poczekaj 1 sekundę na początku i końcu (łatwiej wyciąć)

**Eksport:**
- Format: GIF lub MP4
- Max rozmiar: 5MB
- Optymalizuj na ezgif.com jeśli za duży

### 2. Kanban Drag & Drop ⭐⭐⭐

**Cel:** Pokazać płynny drag & drop + że buttony wewnątrz kart działają.

**Setup:**
1. Otwórz demo w przeglądarce
2. Widok Kanban z przynajmniej 2 taskami w każdej kolumnie
3. Okno 1920x1080
4. Light theme (lepiej widać animacje)

**Nagrywanie (10-15 sekund):**
```
Akcja 1: (3s)
- Złap task z "To Do"
- Przeciągnij płynnie do "In Progress"
- Puść
- Poczekaj na animację

Akcja 2: (3s)
- Hover nad innym taskiem
- Kliknij "Edit" button (nie przeciągaj!)
- Modal się otwiera

Akcja 3: (3s)
- Zamknij modal
- Przeciągnij task z "In Progress" do "Done"
- Poczekaj na animację
```

**Tips:**
- Powoli przeciągaj (zbyt szybko wygląda chaotycznie)
- Wyraźnie pokaż hover state
- Poczekaj na animacje (nie spieszenie!)

### 3. Filter z Debouncing ⭐⭐

**Cel:** Pokazać że search jest debounced, inne filtry instant.

**Setup:**
1. Otwórz demo
2. Otwórz Chrome DevTools → Network tab
3. Filter: tylko XHR/Fetch requests
4. Wyczyść network log
5. Widok Kanban lub List z szukajką

**Nagrywanie (15-20 sekund):**
```
Akcja 1: (5s)
- Wyczyść network log
- Zaznacz checkbox filter (np. "High priority")
- Pokaż że request poleciał NATYCHMIAST (1 request)

Akcja 2: (8s)
- Wyczyść network log
- Wpisz szybko w search: "implement auth"
  (litera po literze, szybko)
- Pokaż że requests pojawiają się dopiero po przestaniu pisać
- Final: tylko 1-2 requesty zamiast 14!

Akcja 3: (3s)
- Pokaż wyniki filtrowania
```

**Tips:**
- Network tab musi być widoczny
- Wpisuj szybko ale czytelnie
- Podświetl liczbę requestów w edycji

### 4. Optimistic Updates ⭐⭐

**Cel:** Pokazać instant UI update mimo wolnego API.

**Setup:**
1. Otwórz demo
2. Chrome DevTools → Network → Throttling
3. Ustaw "Slow 3G" lub "Fast 3G"
4. Widok Kanban

**Nagrywanie (10-15 sekund):**
```
Akcja 1: (2s)
- Pokaż Network throttling ustawiony na Slow 3G

Akcja 2: (5s)
- Przeciągnij task do innej kolumny
- Task NATYCHMIAST się przesuwa (optimistic!)
- W Network tab pokazuje się pending request

Akcja 3: (5s)
- Request kończy się po kilku sekundach
- Task pozostaje w nowej kolumnie (success!)
```

**Alternative (error scenario):**
- Ustaw offline mode w DevTools
- Przeciągnij task
- Pokaż że wraca do poprzedniej kolumny (rollback!)
- Pokaż error toast

### 5. Theme Toggle ⭐

**Cel:** Pokazać smooth transition między light/dark theme.

**Setup:**
1. Otwórz demo
2. Ensure smooth animations enabled
3. Start on light theme

**Nagrywanie (5-10 sekund):**
```
Akcja 1: (2s)
- Pokaż interface w light theme

Akcja 2: (3s)
- Kliknij theme toggle (słońce/księżyc icon)
- Smooth transition do dark theme
- Wszystko się zmienia jednocześnie

Akcja 3: (2s)
- Toggle z powrotem na light
- Smooth transition
```

**Tips:**
- Poczekaj sekundę po każdym toggle
- Pokaż różne strony (Kanban, Projects)

### 6. Responsive Layout ⭐

**Cel:** Pokazać że layout się adaptuje.

**Setup:**
1. Otwórz demo w Chrome
2. Maximize window (1920x1080)
3. Otwórz DevTools (docked to side)

**Nagrywanie (10-15 sekund):**
```
Akcja 1: (5s)
- Pokaż desktop layout
- Powoli zmniejszaj okno (drag edge)
- Layout się zmienia (sidebar → hamburger menu)

Akcja 2: (5s)
- W mobile view, otwórz hamburger menu
- Pokaż navigation
- Zamknij menu

Akcja 3: (3s)
- Powiększ z powrotem
- Layout wraca do desktop
```

---

## ✂️ Edycja GIF-ów

### Kompresja (WAŻNE!)

GIF-y mogą być ogromne. Zoptymalizuj:

1. **Idź na:** https://ezgif.com/optimize
2. **Upload** swój GIF
3. **Ustawienia:**
   - Compression level: 35-50
   - Colors: 128-256 (zależnie od GIF-a)
4. **Optimize!**
5. **Download** zoptymalizowany GIF

**Cel:** < 5MB per GIF, ideally 2-3MB.

### Crop i Trim

Jeśli GIF ma zbędne części:

1. **ezgif.com/crop** - wytnij niepotrzebne brzegi
2. **ezgif.com/cut** - wytnij początek/koniec
3. **ezgif.com/resize** - zmień rozmiar (720p często wystarczy)

### Dodaj opóźnienie

Dla lepszej pętli:

1. **ezgif.com/add-text** - opcjonalnie dodaj tekst
2. **ezgif.com/speed** - zwolnij/przyspiesz
3. Dodaj 1-2s delay na końcu przed loop

---

## 📐 Wymiary i Format

### Screenshoty:
- **Rozdzielczość:** 1920x1080 (lub wyższa)
- **Format:** PNG (lossless)
- **Aspect ratio:** 16:9

### GIF-y:
- **Rozdzielczość:** 1280x720 (720p wystarczy)
- **FPS:** 30-60 (30 dla prostych, 60 dla drag&drop)
- **Format:** GIF lub MP4 (MP4 lepiej dla strony web)
- **Rozmiar:** < 5MB każdy

### Dla LinkedIn:
- **Aspect ratio:** 1:1 (kwadrat) lub 16:9
- **Max rozmiar:** 5MB
- **Video format:** MP4 preferred

---

## 🎨 Styling Tips

### Przed nagraniem:

1. **Wyczyść desktop**
   - Zamknij niepotrzebne zakładki
   - Wyczyść bookmarks bar
   - Ukryj rozszerzenia Chrome

2. **Ustaw spójny theme**
   - VS Code: dark theme (lepiej na screenshotach)
   - Browser: light lub dark (konsekwentnie)
   - OS: ukryj notifications

3. **Ustaw font size**
   - VS Code: zoom 120-150%
   - Browser: zoom 100%

4. **Wyłącz personal info**
   - Email w header
   - User avatar (użyj test account)
   - Sensitive data w taskach

### Podczas nagrania:

1. **Smooth cursor**
   - Nie machaj chaotycznie
   - Celuj przed kliknięciem
   - Poczekaj sekundę po akcji

2. **Clear actions**
   - Jedna akcja na raz
   - Wyraźne clicks
   - Pauzy między akcjami

3. **Wait for animations**
   - Nie przerywaj w połowie
   - Poczekaj na load states
   - Smooth transitions

---

## ✅ Checklist przed publikacją

### Każdy screenshot:
- [ ] Wysoka jakość (1920x1080+)
- [ ] Brak osobistych danych
- [ ] Spójny theme (light lub dark)
- [ ] Wyraźnie widać funkcjonalność
- [ ] Saved with descriptive name

### Każdy GIF:
- [ ] < 5MB rozmiar
- [ ] Smooth playback (30+ FPS)
- [ ] Clear actions (nie za szybki)
- [ ] 1s pause na początku/końcu
- [ ] Zoptymalizowany (ezgif.com)
- [ ] Loop działa płynnie

### Ogólne:
- [ ] Wszystkie narzędzia zainstalowane
- [ ] Demo działa poprawnie
- [ ] Test account gotowy
- [ ] Przykładowe dane w demo
- [ ] DevTools gotowe (dla tech GIF-ów)

---

## 🚀 Quick Start - 30 minut

**Nie masz czasu na wszystko? Zrób te 3:**

1. **Kanban Drag & Drop GIF** (10 min)
   - Najefektowniejszy wizualnie
   - Pokazuje główną funkcję
   - Łatwy do nagrania

2. **Kanban Screenshot Light + Dark** (5 min)
   - Szybki do zrobienia
   - Pokazuje interface
   - Dwa w cenie jednego

3. **tRPC Type Safety GIF** (15 min)
   - Najbardziej techniczny
   - Wow factor dla dev-ów
   - Unikalny (mało kto to pokazuje)

**Z tymi trzema możesz już publikować case study!**

---

## 📱 Gdzie użyć tych materiałów

### Portfolio Website:
```html
<!-- Hero section -->
<video autoplay loop muted playsinline>
  <source src="kanban-drag-drop.mp4">
</video>

<!-- Tech section -->
<img src="trpc-type-safety.gif" alt="tRPC demo">

<!-- Features section -->
<img src="kanban-board-light.png" alt="Kanban">
<img src="kanban-board-dark.png" alt="Dark theme">
```

### LinkedIn Post:
- 1 GIF (kanban lub type safety)
- Max 5MB
- 16:9 aspect ratio

### GitHub README:
```markdown
## Features

### Kanban Board
![Kanban Board](docs/images/kanban-board-light.png)

### Drag & Drop
![Drag & Drop Demo](docs/images/kanban-drag-drop.gif)
```

### Case Study PDF:
- Wysokiej jakości PNG
- 300 DPI
- Embed w dokumencie

---

**Gotowy? Powodzenia! 🎬**

Jeśli masz pytania lub coś nie działa, sprawdź FAQ w głównym README.
