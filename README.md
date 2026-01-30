# GHU Nettside

**Laget av:** Bamle

| Hva               | Fil / mappe | Hva det gjør                                                                                                                                                      |
|-------------------|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Startside         | `index.html` | Hovedinngang til nettsiden (bruker felles CSS/JS og tomme `<header>`/`<nav>` som fylles inn ved last).                                                            |
| Felles layout     | `Felles/header.html` | Innhold som injiseres i `<header>` (logo/tittel + søkefelt).                                                                                                      |
| Felles navigasjon | `Felles/nav.html` | Navigasjonscontainer (`<ul id="nav-ul">`) + footer. Lenker fylles inn fra `paths.json`.                                                                           |
| Navigasjonsdata   | `Felles/paths.json` | Tekst → URL for navigasjon (brukes til å bygge menyen dynamisk).                                                                                                  |
| Felles script     | `Felles/script.js` | Laster inn header/nav, bygger meny fra JSON, setter “active”-lenke, og filtrerer via søk.                                                                         |
| Felles styling    | `Felles/felles.css` | Global styling + layout (grid med header/nav/main, scrollbars, input-stil, nav-stiler).                                                                           |
| “Laget”-side      | `Laget/laget.html` | Side som bygger “roster” ved å lese `laget.json` og lage kort med lenke + iframe.                                                                                 |
| “Laget” styling   | `Laget/laget.css` | Styling for laget sin **roster**-side.                                                                                                                            |
| “Laget” data      | `Laget/laget.json` | `"Navn": "URL"` som brukes til å vise frem medlemmene av laget, dynamisk slik at man ikke behøver å legge inn alle seksjonene manuelt i hver eneste `.html` side. |
