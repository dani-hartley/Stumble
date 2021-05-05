var formEl = document.querySelector("#address-form");
var inputEl = document.querySelector("#search");
var selectEl = document.querySelector("#distance");
var breweryContainer = document.querySelector("#brewery-class");
var breweryRow = document.querySelector("#brewery-row");
var breweryClass = document.querySelector("#brewery-class");
var favSide = document.getElementById("slide-out");

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
    fetchZipData(document.querySelector("#search").value, document.querySelector("#distance").value);
};

var createCard = function (breweries) {
    for (var i = 0; i < breweries.length; i++) {
        var breweryCard = document.createElement("div");
        breweryCard.className = "brewery-card card hoverable";
        var breweryName = document.createElement("span");
        breweryName.textContent = breweries[i].name;
        breweryName.className = "brewery-name card-title";
        var breweryAddress = document.createElement("p");
        breweryAddress.className = "brewery-address";
        breweryAddress.textContent = breweries[i].street;
        var breweryType = document.createElement("p");
        breweryType.textContent = breweries[i].brewery_type;
        breweryType.className = "brewery-type";
        var breweryBtn = document.createElement("a");
        breweryBtn.className = "addToFavBtn btn-floating halfway-fab waves-effect waves-light red";
        var starFav = document.createElement("i");
        starFav.className = "material-icons";
        starFav.textContent = "star_border";

        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(breweryAddress);
        breweryCard.appendChild(breweryType);
        breweryCard.appendChild(breweryBtn);
        breweryBtn.appendChild(starFav);

        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryContainer.appendChild(breweryCard);
        }
    }
    //Save to local storage
    $(".addToFavBtn").on("click", function () {
        console.log(this.children[0].innerHTML);
        this.children[0].innerHTML = "star";
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
        favDisplay();
    });
};

function favDisplay() {
    var savFav = localStorage.getItem("savFavs");
    savFav = JSON.parse(savFav);

    //Display Local Storage
    if (savFav !== null) {
        for (var i = 0; i < savFav.length; i++) {
            var createLi = document.createElement("li");
            createLi.innerText = savFav[i].name + ": " + savFav[i].address + "(" + savFav[i].type + ")";
            favSide.appendChild(createLi);
        }
    }
}

formEl.addEventListener("submit", formSubmit);

$(".addToFavBtn").on("click", function () {
    // console.log((this).children[0].innerHTML);
    this.children[0].innerHTML = "star";
    var savName = $(this).siblings(".brewery-name").text();
    var savAddress = $(this).siblings(".brewery-address").text();
    var savType = $(this).siblings(".brewery-type").text();
    // console.log(savName, savAddress, savType);
    var favBrewery = {
        name: savName,
        address: savAddress,
        type: savType,
    };
    var savFavs = localStorage.getItem("savFavs");
    if (savFavs === null) {
        savFavs = [];
    } else {
        savFavs = JSON.parse(savFavs);
    }
    savFavs.push(favBrewery);
    console.log(savFavs);
    var newFav = JSON.stringify(savFavs);
    localStorage.setItem("savFavs", newFav);
    console.log(newFav);
    favDisplay();
});

/* Navbar */

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});
