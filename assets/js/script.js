// necessary document elements
var formEl = document.querySelector("#address-form");
var breweryRow = document.querySelector("#brewery-row");
var favoritesSide = document.querySelector("#slide-out");
var clearButton = document.querySelector("#clearAll");

var fetchZipData = function (zip, distance) {
    // fetch zip codes from zipcodebase
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
    // fetch brewery data from openbrewerydb
    var apiUrl = "https://api.openbrewerydb.org/breweries?by_postal=" + zip;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                console.info("data: ", data);
                createCard(data);
            }
        });
};

var createCard = function (breweries) {
    console.info("breweries: ", breweries);
    var postalCode = breweries[0].postal_code.split("-");
    var zipCodeId = postalCode[0];
    var zipClass = `brewery-zip-${zipCodeId}`;

    for (var i = 0; i < breweries.length; i++) {
        var breweryClass = document.createElement("div");
        breweryClass.className = "col s12 m4 l2";
        var breweryCard = document.createElement("div");
        breweryCard.className = "brewery-card card small hoverable brown lighten-4";
        var breweryName = document.createElement("span");
        breweryName.textContent = breweries[i].name;
        breweryName.className = "brewery-name card-title";
        var breweryAddress = document.createElement("p");
        breweryAddress.className = "brewery-address card-content";
        breweryAddress.textContent = breweries[i].street;
        var breweryType = document.createElement("p");
        var breweryTypeReturn = breweries[i].brewery_type;
        var typeText = breweryTypeReturn.toUpperCase();
        breweryType.textContent = "Brewery Type: " + typeText;
        breweryType.className = "brewery-type";
        var breweryBtn = document.createElement("a");
        breweryBtn.className = `addToFavBtn btn-floating halfway-fab waves-effect waves-light red ${zipClass}`;
        var starFavorite = document.createElement("i");
        starFavorite.className = "material-icons";
        starFavorite.textContent = "star_border";

        breweryClass.appendChild(breweryCard);
        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(breweryAddress);
        breweryCard.appendChild(breweryType);
        breweryCard.appendChild(breweryBtn);
        breweryBtn.appendChild(starFavorite);

        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryRow.appendChild(breweryClass);
        }
    }

    // Save to local storage
    $(`.${zipClass}`).on("click", function () {
        this.children[0].innerHTML = "star";
        var saveName = $(this).siblings(".brewery-name").text();
        var saveAddress = $(this).siblings(".brewery-address").text();
        var saveType = $(this).siblings(".brewery-type").text();
        var favoriteBrewery = {
            name: saveName,
            address: saveAddress,
            type: saveType,
        };
        var saveFavorites = localStorage.getItem("saveFavorites");
        if (saveFavorites === null) {
            saveFavorites = [];
        } else {
            saveFavorites = JSON.parse(saveFavorites);
        }
        saveFavorites.push(favoriteBrewery);
        var newFav = JSON.stringify(saveFavorites);
        localStorage.setItem("saveFavorites", newFav);
        favoritesDisplay();
    });
};

function favoritesDisplay() {
    $("li[id=fav-brewery").remove();
    $("div[class=divider").remove();
    var saveFavorites = localStorage.getItem("saveFavorites");
    saveFavorites = JSON.parse(saveFavorites);

    // Display Local Storage
    if (saveFavorites !== null) {
        for (var i = 0; i < saveFavorites.length; i++) {
            var divider = document.createElement("li");
            divider.innerHTML = '<div class="divider"></div>';
            var createLi = document.createElement("li");
            createLi.setAttribute("id", "fav-brewery");
            createLi.innerText =
                saveFavorites[i].name + ": \n" + saveFavorites[i].address + "\n" + "(" + saveFavorites[i].type + ")";
            favoritesSide.append(divider);
            favoritesSide.appendChild(createLi);
        }
    }
}

var formSubmit = function (event) {
    // Passes data to APIs
    event.preventDefault();
    breweryRow.textContent = "";
    fetchZipData(document.querySelector("#search").value, document.querySelector("#distance").value);
};

// Submit form
formEl.addEventListener("submit", formSubmit);

// Clear Local Storage
clearButton.addEventListener("click", function clearFavs() {
    window.localStorage.clear();
    $("li[id=fav-brewery").remove();
    $("div[class=divider").remove();
});

// Navbar init

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});

favoritesDisplay();
