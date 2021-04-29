var formEl = document.querySelector("#address-form");
var inputEl = document.querySelector("#address");
var selectEl = document.querySelector("#distance");
var breweryContainer = document.querySelector("#breweries");

var fetchApiData = function () {
    var apiUrl = "https://api.openbrewerydb.org/breweries?per_page=10";

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
        var breweryName = document.createElement("h3");
        breweryName.textContent = breweries[i].name;
        var breweryAddress = document.createElement("p");
        breweryAddress.textContent = breweries[i].street;
        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(breweryAddress);
        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryContainer.appendChild(breweryCard);
        }
    }
};

formEl.addEventListener("submit", formSubmit);
