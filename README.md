# Jobbportalen Demo/MVP

## Inlämningsuppgift i "Utveckling av webbapplikationer"

av Joakim Karud SYSÄ25M

## Funktioner

- Enkel sökfunktion
- Sida med alla lediga jobb eller se sökresutlat
- Skapa konto för arbetsgivare/arbetssökande
- Visa detaljer för ett jobb
- Logga in
- Bokmärka jobb som arbetsökande
- Ansöka jobb som arbetsökande
- skapa/redigera jobbannons som arbetsgivare
- arbetssökande kan se sin profil med bokmärkta jobb samt skickade ansökningar
- arbetsgivare kan se sin profil med egna jobbannonser samt inkomna ansökningar

---

## Design

- Semantisk HTML
- Egen webserver
- json-server för api/databas
- ES6 moduler
- DataClient för centraliserad kommunikation med json-server
- Enkel services-klass för samla återkommande kod och hålla koden läsbar och organiserad
- Centraliserat menysystem med header och footer
- mobile/desktop-anpassad enligt mobile-firstprincipen

---

## Övrigt

- kör `npm i` för att installera node modules
- kör `npm start` för att starta webservern
- kör `npm run api` i en ny terminal för att starta json-server
- skapa användarkonto för de olika rollerna eller logga in i webappen med befintliga konton som finnes i api.json
