//edamam api logic:
let hitsIndex = 0;
// let keyword = $('#keyword').val().trim();

// nico's edamam api
// id = 16faf740
// key = 7e13ce2d929e6839de8e33e08b528146

$('#keyword-btn').on('click', function() {
    $('#recipe-name').empty();
    $('#recipe-ingredients').empty();
    $('#recipe-img').empty();

    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
    searchHistory(keyword);
});

function runEdamam(keyword) {
    let apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

    fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        let recipeName = $('<h2>').addClass('title').text(data.hits[hitsIndex].recipe.label);
        let nextButton = $('<button>').attr('id', 'nxt-btn').text('Next Recipe');
        let previousButton = $('<button>').attr('id', 'prev-btn').text('Previous Recipe');

        $('#recipe-name').append(recipeName, previousButton, nextButton);

        let recipeImg = $('<img>').attr('src', data.hits[hitsIndex].recipe.image);
        $('#recipe-img').append(recipeImg);

        let ingredientsList = $('<ul>').addClass('list');
        for (let i = 0; i < data.hits[hitsIndex].recipe.ingredientLines.length; i++) {
            let ingredientItem = $('<li>').addClass('list-item').text(data.hits[hitsIndex].recipe.ingredientLines[i]);

            ingredientsList.append(ingredientItem);
        }
        $('#recipe-ingredients').append(ingredientsList);

        let recipeLink = $('<a>').attr('href', data.hits[hitsIndex].recipe.url).text('Click here for recipe instructions');

        $('.link').append(recipeLink);

        // Saved Recipes

        // trying to create an ID for edamam, which doesn't have explicit IDs
        let recipeID = data.hits[hitsIndex].recipe.label;
        console.log("your recipe query was = " + recipeID);

        let saveRecipeBtn = document.createElement("button");
        saveRecipeBtn.innerHTML = "Save This Recipe";
        recipeName.append(saveRecipeBtn);

        $(saveRecipeBtn).on('click', function saveRecipe() {
            var savedRecipesEl = document.querySelector("#saved-recipes");
            savedRecipesEl.classList = "enter css styling classes here";
        
            var recipeEl = document.createElement("button");
            recipeEl.textContent = data.hits[hitsIndex].recipe.label;
        
            // append to the container div
            savedRecipesEl.appendChild(recipeEl);

            $(recipeEl).on('click', function reloadRecipe(){
                // runEdamam() but for a specific recipe

                // clear the current contents
                $('#recipe-name').empty();
                $('#recipe-img').empty();
                $('#recipe-ingredients').empty();

                // producing the result again?
                fetch(`https://api.edamam.com/search?q=${recipeID}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`)
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
            });
        });
    })
    .catch((error) => {
        console.log(`error: ${error}`);
        if (error) {
            // $('#recipe-display').empty();
            //trigger modal "an error ocurred, please try your search again"
        }
        
    });
    
};

 function nextRecipe() {
    
    let keyword = $('#keyword').val().trim();
    hitsIndex++;

    if (hitsIndex === 9) {
        hitsIndex = 0;
        runEdamam(keyword);
    } else {
        runEdamam(keyword);
    }
     
 };

 $('#recipe-name').on('click', '#nxt-btn', function() {
    $('#recipe-name').empty();
    $('#recipe-ingredients').empty();
    $('#recipe-img').empty();
    $('.link').empty();

    nextRecipe();

 });

 function previousRecipe() {
     let keyword = $('#keyword').val().trim();
     hitsIndex--;
     runEdamam(keyword);
 };

 $('#recipe-name').on('click', '#prev-btn', function() {
    $('#recipe-name').empty();
    $('#recipe-ingredients').empty();
    $('#recipe-img').empty();
    $('.link').empty();

    previousRecipe();
 });

//  Previous Searches

let searchHistoryArray = [];
function searchHistory (keyword) {
    // send the keyword to a user's local storage
    localStorage.setItem("keyword", keyword);
    console.log(keyword);
    
    // take the current keyword search term and place it at the beginning of an array
    // searchHistoryArray.unshift(keyword);
    // console.log(searchHistoryArray);
    var searchHistoryEl = document.querySelector("#previous-searches");
    searchHistoryEl.classList = "enter css styling classes here"

    var searchKeywordEl = document.createElement("h5");
    searchKeywordEl.textContent = keyword;
    console.log(keyword);

    // append to the container div
    searchHistoryEl.appendChild(searchKeywordEl);
}
// add a feature such that if the user hits a certain count of search queries, the button either disables or
// the div gets a scroll box (so they can have unlimited searches)
// scrollable div would use "overflow: scroll" in the css






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
