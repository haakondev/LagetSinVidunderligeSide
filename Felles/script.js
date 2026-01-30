function getBasePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);

    if (parts.length > 0 && parts[0].toLowerCase() === "ghunettside") {
        return "/GHUnettside";
    }
    return "";
}

const BASE = getBasePath();

function activelink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        if (currentPath === linkPath) {
            link.className = "active";
        }
    });
}

/* ---------- NO RESULT HELPERS ---------- */

function upsertNavNoResults(list, show) {
    const existing = document.getElementById("nav-no-results");

    if (show) {
        if (!existing) {
            const li = document.createElement("li");
            li.id = "nav-no-results";
            li.textContent = "Ingen søkeresultater";
            list.insertBefore(li, list.childNodes[0]);
        }
    } else {
        if (existing) existing.remove();
    }
}

function upsertMainNoResults(main, show) {
    const existing = document.getElementById("main-no-results");

    if (show) {
        if (!existing) {
            const p = document.createElement("p");
            p.id = "main-no-results";
            p.textContent = "Ingen søkeresultater";
            main.insertBefore(p, main.childNodes[0]);
            try {
                const tableHeader = document.getElementById("table-header");
                tableHeader.style.display = "none";
            } catch (e) {}
        }
    } else {
        if (existing) {
            existing.remove();
            try {
                const tableHeader = document.getElementById("table-header");
                tableHeader.style.display = "";
            } catch (e) {}
        }
    }
}

/* ---------- TABLE ROW FILTER ---------- */

function filterTablesInMain(main, input) {
    const tables = Array.from(main.querySelectorAll("table"));
    if (tables.length === 0) return null; // ingen tabell på siden

    let anyRowVisible = false;

    tables.forEach(table => {
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        let tableHasVisibleRow = false;

        rows.forEach(row => {
            const rowText = (row.innerText || "").toLowerCase();
            const show = input === "" || rowText.includes(input);

            row.style.display = show ? "" : "none";

            if (show) {
                tableHasVisibleRow = true;
                anyRowVisible = true;
            }
        });
    });

    return anyRowVisible;
}

/* ---------- SEARCH ---------- */

function search() {
    const input = document.getElementById("search-input").value.toLowerCase();

    /* NAV */
    const list = document.getElementById("nav-ul");
    const items = list.getElementsByTagName("li");

    let navVisibleCount = 0;

    for (let i = 0; i < items.length; i++) {
        const li = items[i];

        if (li.id === "nav-no-results") continue;

        const a = li.querySelector("a");
        const textValue = a ? a.innerText : li.innerText;

        if (textValue.toLowerCase().includes(input)) {
            li.style.display = "";
            navVisibleCount++;
        } else {
            li.style.display = "none";
        }
    }

    upsertNavNoResults(list, navVisibleCount === 0 && input !== "");

    /* MAIN */
    const main = document.querySelector("main");
    const sections = document.querySelectorAll("main .main-sections");

    // 1) Hvis siden har main-sections, behold seksjonslogikken
    if (sections.length > 0) {
        let mainVisibleCount = 0;

        sections.forEach(section => {
            const title = section.querySelector("h1")?.innerText || "";
            const headers = section.querySelector("h2")?.innerText || "";

            if (
                title.toLowerCase().includes(input) ||
                headers.toLowerCase().includes(input)
            ) {
                section.style.display = "";
                mainVisibleCount++;
            } else {
                section.style.display = "none";
            }
        });

        upsertMainNoResults(main, mainVisibleCount === 0 && input !== "");

    } else {
        // 2) Hvis siden har tabell(er): filtrer kun tabellrader
        const tableResult = filterTablesInMain(main, input);

        // 3) Hvis ingen tabell: fallback til "søk i main, skjul/vis innhold"
        if (tableResult === null) {
            const children = Array.from(main.children).filter(el =>
                !el.classList.contains("main-title") &&
                el.id !== "main-no-results"
            );

            if (input === "") {
                children.forEach(el => el.style.display = "");
                upsertMainNoResults(main, false);
            } else {
                const text = main.innerText.toLowerCase();

                if (text.includes(input)) {
                    children.forEach(el => el.style.display = "");
                    upsertMainNoResults(main, false);
                } else {
                    children.forEach(el => el.style.display = "none");
                    upsertMainNoResults(main, true);
                }
            }
        } else {
            // tabell finnes, vi har filtrert rader
            upsertMainNoResults(main, tableResult === false && input !== "");
        }
    }

    /* MAIN TITLES */
    const maintitles = document.querySelectorAll(".main-title");
    maintitles.forEach(title => {
        title.style.display = input === "" ? "" : "none";
    });
}

/* ---------- INIT ---------- */

async function init() {
    await fetch(`${BASE}/Felles/header.html`)
        .then(r => r.text())
        .then(html => {
            document.querySelector("header").innerHTML = html;
        });

    await fetch(`${BASE}/Felles/nav.html`)
        .then(r => r.text())
        .then(html => {
            document.querySelector("nav").innerHTML = html;
        });

    await fetch(`${BASE}/Felles/paths.json`)
        .then(r => r.json())
        .then(data => {
            const list = document.getElementById("nav-ul");

            for (const [text, href] of Object.entries(data)) {
                const li = document.createElement("li");
                const a = document.createElement("a");

                a.href = `${BASE}${href}`;
                a.textContent = text;

                li.appendChild(a);
                list.appendChild(li);
            }
        })
        .catch(err => console.error("Kunne ikke laste JSON:", err));

    activelink();

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", search);
    }
}

window.addEventListener("load", init);
