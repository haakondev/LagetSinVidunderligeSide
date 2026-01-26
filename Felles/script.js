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

    for (let i = 0; i < items.length; i++) {
        const a = items[i].getElementsByTagName("a")[0];
        const textValue = a.textContent || a.innerText;

        if (textValue.toLowerCase().indexOf(input) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }

    /* MAIN */
    const sections = document.querySelectorAll("main .main-sections");

    sections.forEach(section => {
        const title = section.querySelector("h1")?.innerText || "";

        if (title.toLowerCase().indexOf(input) > -1) {
            section.style.display = "";
        } else {
            section.style.display = "none";
        }
    });
}


async function init() {
    await fetch("../Felles/header.html")
        .then(response => response.text())
        .then(html => {
            const header = document.querySelector("header");
            header.innerHTML = html;
        });
    await fetch("../Felles/nav.html")
        .then(response => response.text())
        .then(html => {
            const header = document.querySelector("nav");
            header.innerHTML = html;
        });
    await fetch("../Felles/paths.json")
        .then(res => res.json())
        .then(data => {

            const list = document.getElementById("nav-ul");

            for (const [text, href] of Object.entries(data)) {
                const li = document.createElement("li");
                const a = document.createElement("a");

                a.href = href;
                a.textContent = text;

                li.appendChild(a);
                list.appendChild(li);
            }
        })
        .catch(err => console.error("Kunne ikke laste JSON:", err));

    await activelink();
}
window.addEventListener("load", init);




