var formEl = document.querySelector("#address-form");
var inputEl = document.querySelector("#address");
var selectEl = document.querySelector("#distance");
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
    var apiUrl = "https://api.openbrewerydb.org/breweries?by_postal=" + zip;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => createCard(data));
};

var formSubmit = function (event) {
    event.preventDefault();
    breweryContainer.textContent = "";
    fetchZipData(document.querySelector("#address").value, document.querySelector("#distance").value);
};

var createCard = function (breweries) {
    for (var i = 0; i < breweries.length; i++) {
        var breweryCard = document.createElement("div");
        breweryCard.className = "brewery-card";
        var breweryName = document.createElement("h3");
        breweryName.textContent = breweries[i].name;
        breweryName.className = "brewery-name";
        var breweryAddress = document.createElement("p");
        breweryAddress.className = "brewery-address";
        breweryAddress.textContent = breweries[i].street;
        var breweryType = document.createElement("p");
        breweryType.textContent = breweries[i].brewery_type;
        breweryType.className = "brewery-type";
        var breweryBtn = document.createElement("button");
        breweryBtn.className = "addToFavBtn";
        breweryBtn.textContent = "Favorite";


        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(breweryAddress);
        breweryCard.appendChild(breweryType);
        breweryCard.appendChild(breweryBtn);

        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryContainer.appendChild(breweryCard);
        }
    }
    //Save to local storage
    $('.addToFavBtn').on('click', function () {
        var savName = $(this).siblings(".brewery-name").text();
        var savAddress = $(this).siblings(".brewery-address").text();
        var savType = $(this).siblings(".brewery-type").text();
        console.log(savName, savAddress, savType)
        var favBrewery = {
            name: savName,
            address: savAddress,
            type: savType
        };
        var savFavs = localStorage.getItem('savFavs');
        if (!savFavs) {
            savFavs = [];
        } else {
            savFavs = JSON.parse(savFavs);
        }

        savFavs.push(favBrewery);
        var newFav = JSON.stringify(savFavs);
        localStorage.setItem("favorite", newFav);
    })

};



formEl.addEventListener("submit", formSubmit);
