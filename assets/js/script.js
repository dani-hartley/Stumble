var formEl = document.querySelector("#address-form");
var inputEl = document.querySelector("#search");
var selectEl = document.querySelector("#distance");
// var breweryContainer = document.querySelector("#brewery-class");
var breweryRow = document.querySelector("#brewery-row");
// var breweryClass = document.querySelector("#brewery-class");
var favSide = document.querySelector("#slide-out");
var clear = document.querySelector("#clearAll");
var favBrew = document.querySelector("#fav-brewery");

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
            // console.log('data.results: ', data.results);
            // console.log('data.results.length: ', data.results.length);
            for (var i = 0; i < data.results.length; i++) {
                fetchApiData(data.results[i].code);
            }
        });
    // console.log('DOES THIS ONE HIT PLEASE HIT')
};

var fetchApiData = function (zip) {
    var apiUrl = "https://api.openbrewerydb.org/breweries?by_postal=" + zip;
    // console.log('how many tiems does fetchApiData get called?');
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                console.info('data: ', data);
                createCard(data) //Created if to only run createCard if it had a zip
            }
        });
};


var formSubmit = function (event) {
    event.preventDefault();
    breweryRow.textContent = "";
    fetchZipData(document.querySelector("#search").value, document.querySelector("#distance").value);
};

// $('#julianTest').on('click', function () {
//     console.log('JULIAN TEST WORKING SO FAR')
// })
// $('#julianTest').on('click', function () {
//     console.log('what happens if I add a second on click handler?');
// })

var createCard = function (breweries) {
    console.info('breweries: ', breweries);
    var postalCode = breweries[0].postal_code.split('-');
    var zipCodeId = postalCode[0];
    var zipClass = `brewery-zip-${zipCodeId}`;
    for (var i = 0; i < breweries.length; i++) {
        var breweryClass = document.createElement("div")
        breweryClass.className = "col s2 m2";
        var breweryCard = document.createElement("div");
        breweryCard.className = "brewery-card card hoverable brown lighten-4";
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
        var starFav = document.createElement("i");
        starFav.className = "material-icons";
        starFav.textContent = "star_border";

        breweryClass.appendChild(breweryCard);
        breweryCard.appendChild(breweryName);
        breweryCard.appendChild(breweryAddress);
        breweryCard.appendChild(breweryType);
        breweryCard.appendChild(breweryBtn);
        breweryBtn.appendChild(starFav);

        //Some breweries have no address data, so we check for it before appending anything
        if (breweries[i].street) {
            breweryRow.appendChild(breweryClass);
        }
    }
    // Save to local storage
    // console.log('how many times does this line run 86')
    $(`.${zipClass}`).on("click", function () {
        // console.log('what is this: ', this)
        // console.log('How many times')
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
        // console.log(savFavs);
        var newFav = JSON.stringify(savFavs);
        localStorage.setItem("savFavs", newFav);
        // console.log(newFav);
        favDisplay();
    });
};

function favDisplay() {
    var savFavs = localStorage.getItem("savFavs");
    savFavs = JSON.parse(savFavs);

    //Display Local Storage
    if (savFavs !== null) {
        for (var i = 0; i < savFavs.length; i++) {
            var createLi = document.createElement("li");
            createLi.setAttribute("id", "fav-brewery");
            //Need to look at formating for sidenav
            // var createA = document.createElement("a");
            // createA.setAttribute("href", "#!");
            // createA.className = "favorites";
            createLi.innerText = savFavs[i].name + ": " + savFavs[i].address + "\n" + "(" + savFavs[i].type + ")";

            // createLi.appendChild(createA);
            favSide.appendChild(createLi);
        }
    }
};

var favBrew = document.querySelector("#fav-brewery");

//Clear Local Storage
clear.addEventListener("click", function clearFavs() {
    window.localStorage.clear();
    $("li[id=fav-brewery").remove();
});

formEl.addEventListener("submit", formSubmit);

/* Navbar */

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});



favDisplay();