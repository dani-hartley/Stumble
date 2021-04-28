var formEl = document.querySelector("#address-form");
var inputEl = document.querySelector("#address");
var selectEl = document.querySelector("#distance");
var breweryContainer = document.querySelector("#breweries");

var fetchApiData = function () {
    var apiUrl = "https://api.openbrewerydb.org/breweries?per_page=5";

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => createCard(data));
};

var formSubmit = function (event) {
    event.preventDefault();
    fetchApiData();
};

var createCard = function (breweries) {
    for (var i = 0; i < breweries.length; i++) {
        var breweryCard = document.createElement("div");
        breweryCard.className = "brewery-card";
        breweryCard.textContent = breweries[i].name;
        breweryContainer.appendChild(breweryCard);
    }
};

formEl.addEventListener("submit", formSubmit);
