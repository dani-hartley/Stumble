var formEl = document.querySelector("#address-form");
var breweryContainer = document.querySelector("#breweries");

var fetchZipData = function (zip, distance) {
    var fetchUrl =
        "https://app.zipcodebase.com/api/v1/radius?apikey=52383d00-ac57-11eb-9e66-05f9bbc30029&code=" +
        zip +
        "&radius=" +
        distance +
        "&country=us&units=miles";

    fetch(fetchUrl)
        .then((response) => response.json())
        .then(function (data) {
            for (var i = 0; i < data.results.length; i++) {
                fetchApiData(data.results[i].code);
            }
        });
};

var fetchApiData = function (zip) {
    var apiUrl = "https://api.openbrewerydb.org/breweries?per_page=3&by_postal=" + zip;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => createCard(data));
};

var formSubmit = function (event) {
    event.preventDefault();
    breweryContainer.textContent = "";
    fetchZipData(document.querySelector("#search").value, document.querySelector("#distance").value);
};

var createCard = function (breweries) {
    for (var i = 0; i < breweries.length; i++) {
        var breweryCard = document.createElement("div");
        breweryCard.classList = "brewery-card card hoverable center-align col s12 m4 l2";
        var breweryName = document.createElement("span");
        breweryName.classList = "card-title";
        breweryName.textContent = breweries[i].name;
        var favButton = document.createElement("a");
        favButton.classList = "btn-floating halfway-fab waves-effect waves-light red";
        favButton.innerHTML = '<i class="material-icons">star_border</i>';

        var breweryAddress = document.createElement("p");
        breweryAddress.classList = "card-content";
        breweryAddress.textContent = breweries[i].street;
        var breweryType = document.createElement("p");
        breweryType.classList = "card-content";
        breweryType.textContent = breweries[i].brewery_type;
        breweryType.className = "brewery-type";
        var breweryBtn = document.createElement("button");
        breweryBtn.className = "addToFavBtn";
        breweryBtn.textContent = "Favorite";

        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(favButton);
        breweryCard.appendChild(breweryAddress);
        breweryCard.appendChild(breweryType);
        breweryCard.appendChild(breweryBtn);

        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryContainer.appendChild(breweryCard);
        }
    }
    //Save to local storage
    $(".addToFavBtn").on("click", function () {
        var savName = $(this).siblings(".brewery-name").text();
        var savAddress = $(this).siblings(".brewery-address").text();
        var savType = $(this).siblings(".brewery-type").text();
        console.log(savName, savAddress, savType);
        var favBrewery = {
            name: savName,
            address: savAddress,
            type: savType,
        };
        var savFavs = localStorage.getItem("savFavs");
        if (!savFavs) {
            savFavs = [];
        } else {
            savFavs = JSON.parse(savFavs);
        }

        savFavs.push(favBrewery);
        var newFav = JSON.stringify(savFavs);
        localStorage.setItem("favorite", newFav);
    });
};

formEl.addEventListener("submit", formSubmit);

/* Navbar */

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, { edge: "right" });
});
