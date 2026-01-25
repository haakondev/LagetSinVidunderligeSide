
fetch("../paths.json")
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

