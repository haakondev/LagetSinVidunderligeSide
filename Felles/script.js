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

function search() {
    const input = document.getElementById("search-input").value.toLowerCase();

    /* NAV */
    const list = document.getElementById("nav-ul");
    const items = list.getElementsByTagName("li");

    let navVisibleCount = 0;

    for (let i = 0; i < items.length; i++) {
        const a = items[i].getElementsByTagName("a")[0];
        const textValue = a.textContent || a.innerText;

        if (textValue.toLowerCase().includes(input)) {
            items[i].style.display = "";
            navVisibleCount++;
        } else {
            items[i].style.display = "none";
        }
    }

    handleNoResults(
        navVisibleCount,
        input,
        "nav-no-results",
        list
    );

    /* MAIN */
    const sections = document.querySelectorAll("main .main-sections");

    let mainVisibleCount = 0;

    sections.forEach(section => {
        const title = section.querySelector("h1")?.innerText || "";
        const sectionheaders = section.querySelector("h2")?.innerText || "";

        if (
            title.toLowerCase().includes(input) ||
            sectionheaders.toLowerCase().includes(input)
        ) {
            section.style.display = "";
            mainVisibleCount++;
        } else {
            section.style.display = "none";
        }
    });

    handleNoResults(
        mainVisibleCount,
        input,
        "main-no-results",
        document.querySelector("main")
    );

    /* MAIN TITLES */
    const maintitles = document.querySelectorAll(".main-title");

    maintitles.forEach(maintitle => {
        maintitle.style.display = input === "" ? "" : "none";
    });
}

/* Shared helper */
function handleNoResults(visibleCount, input, id, parent) {
    const existing = document.getElementById(id);

    if (visibleCount === 0 && input !== "") {
        if (!existing) {
            const msg = document.createElement("p");
            msg.id = id;
            msg.textContent = "Ingen søkeresultater";
            parent.appendChild(msg);
        }
    } else {
        if (existing) {
            existing.remove();
        }
    }
}



function getBasePath() {
    // GitHub Pages project site: /<repo-navn>/...
    // Lokal: /
    const parts = window.location.pathname.split("/").filter(Boolean);

    // Hvis du ser /GHUnettside/ i pathen, bruk den som base
    if (parts.length > 0 && parts[0].toLowerCase() === "ghunettside") {
        return "/GHUnettside";
    }
    return "";
}

const BASE = getBasePath();

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

                a.href = `${BASE}${href}`;   // her er nøkkelen
                a.textContent = text;

                li.appendChild(a);
                list.appendChild(li);
            }
        })
        .catch(err => console.error("Kunne ikke laste JSON:", err));

    activelink();
}
window.addEventListener("load", init);



