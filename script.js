document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");
    const input = document.getElementById("wordInput");
    const errorMessage = document.getElementById("errorMessage");
    const resultsSection = document.getElementById("resultsSection");

    const wordTitle = document.getElementById("wordTitle");
    const phonetic = document.getElementById("phonetic");
    const definition = document.getElementById("definition");
    const example = document.getElementById("example");
    const synonymsList = document.getElementById("synonymsList");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const word = input.value.trim();

        if (word === "") {
            showError("Please enter a word.");
            return;
        }

        fetchWordData(word);
    });

    function fetchWordData(word) {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.title === "No Definitions Found") {
                    showError("Word not found. Try another one.");
                    return;
                }
                displayData(data[0]);
            })
            .catch(() => {
                showError("Failed to fetch data. Check your connection.");
            });
    }

    function displayData(data) {
        errorMessage.textContent = "";
        resultsSection.classList.remove("hidden");

        wordTitle.textContent = data.word;
        phonetic.textContent = data.phonetic || "No phonetic available";

        const meaning = data.meanings[0];
        definition.textContent = meaning.definitions[0].definition || "No definition available";

        example.textContent = meaning.definitions[0].example || "No example available";

        // Synonyms
        synonymsList.innerHTML = "";
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            meaning.synonyms.slice(0, 5).forEach(syn => {
                const li = document.createElement("li");
                li.textContent = syn;
                synonymsList.appendChild(li);
            });
        } else {
            synonymsList.innerHTML = "<li>No synonyms available</li>";
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        resultsSection.classList.add("hidden");
    }
});