//edamam api logic:
let hitsIndex = 0;
// let keyword = $('#keyword').val().trim();

// nico's edamam api
// id = 16faf740
// key = 7e13ce2d929e6839de8e33e08b528146

$('#keyword-btn').on('click', function() {
    $('#recipe-name').html('');
    $('#recipe-ingredients').html('');
    $('#recipe-img').html('');

    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
    searchHistory(keyword);
});

function runEdamam(keyword) {
    let apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

    fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        //let recipeHits = data.hits;
        let recipeName = $('<h2>').addClass('title').text(data.hits[hitsIndex].recipe.label);
        $('#recipe-name').append(recipeName);

        let recipeImg = $('<img>').attr('src', data.hits[hitsIndex].recipe.image);
        $('#recipe-img').append(recipeImg);

        let ingredientsList = $('<ul>').addClass('list');
        for (let i = 0; i < data.hits[hitsIndex].recipe.ingredientLines.length; i++) {
            let ingredientItem = $('<li>').addClass('list-item').text(data.hits[hitsIndex].recipe.ingredientLines[i]);

            ingredientsList.append(ingredientItem);
        }
        $('#recipe-ingredients').append(ingredientsList);

    });
};

$('#next-recipe-btn').on('click', nextRecipe);

 function nextRecipe() {
    let keyword = $('#keyword').val().trim();

    if (hitsIndex <= 9) {
        hitsIndex++

        $('#recipe-name').html('');
        $('#recipe-ingredients').html('');
        $('#recipe-img').html('');

        runEdamam(keyword);
    } else {
        $('#next-recipe-btn').disabled = true;
        console.log("btn disabled");
    }
     
 };

//  Previous Searches

let searchHistoryArray = [];
function searchHistory (keyword) {
    // send the keyword to a user's local storage
    localStorage.setItem("keyword", keyword);
    console.log(keyword);
    
    // take the current keyword search term and place it at the beginning of an array
    // searchHistoryArray.unshift(keyword);
    // console.log(searchHistoryArray);

    // for (let i = 0; i < searchHistoryArray.length; i++) {
        var searchHistoryEl = document.querySelector("#previous-searches");
        searchHistoryEl.classList = "enter css styling classes here"

        var searchKeywordEl = document.createElement("h5");
        searchKeywordEl.textContent = keyword;
        console.log(keyword);

        // append to the container div
        searchHistoryEl.appendChild(searchKeywordEl);
    // }
}
// add a feature such that if the user hits a certain count of search queries, the button either disables or
// the div gets a scroll box (so they can have unlimited searches)

// Saved Recipes

function saveRecipe (saveThis) {
    
    var savedRecipesEl = document.querySelector("#saved-recipes");
    savedRecipesEl.classList = "enter css styling classes here"

    var recipeEl = document.createElement("button");
    recipeEl.textContent = recipeName;

    // append to the container div
    savedRecipesEl.appendChild(recipeEl);
}
// need to make a save button when you render a recipe
// need to make a button in saveRecipe() that will render that recipe




console.log("search history worked");
//mealDB api logic:
// var getMealDB = function () {
//     fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian').then(function(response) {
//     response.json().then(function(data) {
//     console.log(data);
//   });
// });
// }

// $("#edamam-btn").on("click", runEdamam);
// $("#mealdb-btn").on("click", getMealDB);