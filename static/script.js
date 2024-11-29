window.onload = function () {
    const BASE_URL = "https://dbpcsportsday2024.onrender.com";

    // Hide preloader after 4 seconds
    setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
    }, 4000);

    // Fetch house points on page load and then update every 10 seconds
    fetchHousePoints();
    setInterval(fetchHousePoints, 60000);

    function fetchHousePoints() {
        fetch(`${BASE_URL}/house_points`)
            .then((response) => response.json())
            .then((data) => {
                console.log("House points data:", data);
                if (data) {
                    document.getElementById("redBox").innerText = data.Red;
                    document.getElementById("blueBox").innerText = data.Blue;
                    document.getElementById("greenBox").innerText = data.Green;
                    document.getElementById("yellowBox").innerText = data.Yellow;
                } else {
                    console.error("Invalid house points data received.");
                }
            })
            .catch((error) => {
                console.error("Error fetching house points:", error);
            });
    }

    document.getElementById("event-selector").addEventListener("change", function () {
        const selectedEvent = this.value;
        const tableContainer = document.querySelector(".table-container");
        const dataTableBody = document.querySelector("#data-table tbody");
        const errorMessage = document.getElementById("error-message");

        if (!tableContainer || !dataTableBody || !errorMessage) {
            console.error("One or more required elements are missing from the page.");
            return;
        }

        dataTableBody.innerHTML = "";
        tableContainer.style.display = "none";

        if (!selectedEvent) {
            errorMessage.style.display = "none";
            return;
        }

        fetch(`${BASE_URL}/events_data`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Events data:", data);

                const eventResults = data[selectedEvent];
                if (!eventResults || eventResults.length === 0) {
                    errorMessage.style.display = "block";
                    tableContainer.style.display = "none";
                    return;
                }

                errorMessage.style.display = "none";

                eventResults.forEach((entry) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${entry.position}</td>
                        <td>${entry.house}</td>
                        <td>${entry.name}</td>
                        <td>${entry.points}</td>
                    `;
                    dataTableBody.appendChild(row);
                });

                tableContainer.style.display = "block";
            })
            .catch((error) => {
                console.error("Error during fetch:", error);
                errorMessage.style.display = "block";
                tableContainer.style.display = "none";
            });
    });

    function showError(message) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        errorMessage.innerText = message;
    }
};
