
let hitsIndex = 0;
let meals = [];
let recipeTitle = document.querySelector("#recipe-name");
let meal_container = document.getElementById("#recipe-display");
let recipeDetailIndex = 0;


function clearBasicRecipeContents() {
    $("#recipe-name").empty();
    $("#recipe-img").empty();
    $("#recipe-ingredients").empty();
    $(".link").empty();
    $(".recipe-video").empty();
    $("#ingredients").empty();
    $("#recipe-header").empty();
    $("#video").empty();
}

var select = document.getElementById("select1");
function logValue() {
    var result = $(".search-criteria").text();
    getMealDB(result);

}

$("#keyword-btn").on("click", function () {
    clearBasicRecipeContents();

    var keyword = $("#keyword").val().trim();

    runEdamam(keyword);
    searchHistory(keyword);
});

function runEdamam(keyword) {

    var apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            var recipeName = $("<h2>").addClass("title").text(data.hits[hitsIndex].recipe.label);
            var nextButton = $("<button>").attr("id", "nxt-btn").text("Next Recipe");
            var previousButton = $("<button>").attr("id", "prev-btn").text("Previous Recipe");

            if (hitsIndex === 4) {
                // this is the attribute that disables the button
                // nextButton.prop("disabled", true).addClass('disabled');
                $(nextButton).attr('disabled', 'disabled').attr('id', 'disabled');
            }

            if (hitsIndex === 0) {
                // previousButton.prop("disabled", true).addClass('disabled');
                $(previousButton).attr('disabled', 'disabled').attr('id', 'disabled');
            }

            $("#recipe-name").append(recipeName, previousButton, nextButton);

            var recipeImg = $("<img>").attr("src", data.hits[hitsIndex].recipe.image);
            $("#recipe-img").append(recipeImg);
            // copied to compare 

            var ingredientsList = $("<ul>").addClass("list");
            for (
                var i = 0;
                i < data.hits[hitsIndex].recipe.ingredientLines.length;
                i++
            ) {
                var ingredientItem = $("<li>")
                    .addClass("list-item")
                    .text(data.hits[hitsIndex].recipe.ingredientLines[i]);

                ingredientsList.append(ingredientItem);
            }

            $("#recipe-ingredients").append(ingredientsList);

            var recipeLink = $("<a>")
                .attr("href", data.hits[hitsIndex].recipe.url)
                .attr("target", "_blank")
                .text("Click here for recipe instructions");

            $(".link").append(recipeLink);

            // Saved Recipes
            var saveRecipeBtn = $("<button>")
                .attr("id", "save-recipe-btn")
                .text("Save This Recipe");

            $("#recipe-name").append(saveRecipeBtn);

            $("#save-recipe-btn").on("click", function () {
                $(".saved-recipes").addClass("");

                var recipeEl = $("<button>").text(data.hits[hitsIndex].recipe.label).addClass("saved-recipe");
                // append to the container div
                $(".saved-recipes").append(recipeEl);

                var recipeID = data.hits[hitsIndex].recipe.label;

                $(recipeEl).on("click", function reloadRecipe() {
                    clearBasicRecipeContents();
                    runEdamam(recipeID);
                });
            });
        })
        .catch((error) => {
            if (error) {
                $("#recipe-display").empty();
                UIkit.modal.alert("Recipe Not Found! Please try a different keyword.");
            };
        });
}

function nextRecipe() {
    var keyword = $("#keyword").val().trim();
    hitsIndex++;
    runEdamam(keyword);
}

$("#recipe-name").on("click", "#nxt-btn", function () {
    clearBasicRecipeContents();

    nextRecipe();
});

function previousRecipe() {
    var keyword = $("#keyword").val().trim();
    hitsIndex--;
    runEdamam(keyword);
}

$("#recipe-name").on("click", "#prev-btn", function () {
    clearBasicRecipeContents();
    previousRecipe();
});

//  Previous Searches
// var searchHistoryArray = [];
// function searchHistory(keyword) {
//     // send the keyword to a user's local storage
//     localStorage.setItem("keyword", keyword);

//     let searchHistoryEl = document.querySelector("#previous-searches");
//     searchHistoryEl.classList = "";

//     let searchKeywordEl = document.createElement("button");
//     searchKeywordEl.textContent = keyword;


//     // append to the container div
//     searchHistoryEl.appendChild(searchKeywordEl);

//     $(searchKeywordEl).on("click", function reloadRecipe() {
//         clearBasicRecipeContents();
//         runEdamam(keyword);
//     });
// }

//mealDB api logic:
let getMealDB = function (category) {
    fetch(
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category
    ).then(function (response) {
        response.json().then(function (menu) {
            meals = [];
            for (let j = 0; j < menu.meals.length; j++) {
                // save meal id for all items in the search
                meals.push(menu.meals[j].idMeal);
            }
            displayRecipeOptions(meals[0]);
            
        });
    });
}

function displayRecipeOptions(menu) {

    var apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + menu;

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            $('#bg').addClass('bg-after');
            const ingredients = [];
            //display recipe title, buttons, images
            var recipeName = $('<h2>')
                .addClass("title")
                .text(data.meals[0].strMeal);
            var nextButton = $("<button>").attr("id", "next-btn").text("Next Recipe");
            var previousButton = $("<button>")
                .attr("id", "previous-btn")
                .text("Previous Recipe");
            var saveRecipeBtn = $("<button>")
                .attr("id", "save-recipe-btn")
                .text("Save This Recipe");

            $("#recipe-name").append(saveRecipeBtn);
            //disable next button if we have reached end of array  
            if (menu === meals[meals.length - 1]) {
                // nextButton.prop("disabled", true).addClass("disabled");
                $(nextButton).attr('disabled', 'disabled').attr('id', 'disabled');
            }
            //disable previous button if we have reached beginning of array
            if (menu === meals[0]) {
                // previousButton.prop("disabled", true).addClass("disabled");
                $(previousButton).attr('disabled', 'disabled').attr('id', 'disabled');
            }

            $("#recipe-name").append(recipeName, previousButton, nextButton);

            var recipeImage = $("<img>").attr("src", data.meals[0].strMealThumb);
            $("#recipe-img").append(recipeImage);
            // Get all ingredients from the object. Up to 20
            var ingredientsList = $("<ul>").addClass("list");
            let ingredientHeader = $("<h2>").addClass("title").text("Ingredients");
            $("#recipe-ingredients").append(ingredientHeader);

            //get all the ingredients from the API
            for (let i = 1; i <= 20; i++) {
                if (data.meals[0][`strIngredient${i}`]) {
                    ingredients.push(
                        `${data.meals[0][`strIngredient${i}`]} - ${
                        data.meals[0][`strMeasure${i}`]
                        }`
                    );
                } else {
                    // Stop if no more ingredients
                    break;
                }
            }

            for (let x = 0; x < ingredients.length; x++) {
                var ingredientItem = $("<li>")
                    .addClass("list-item")
                    .text(ingredients[x]);
                ingredientsList.append(ingredientItem);
            }

            //create title for ingredient and display all ingredients
            $("#recipe-ingredients").append(ingredientsList);
            let recipeHeader = $("<h2>").addClass("title").text("Instructions");
            $("#recipe-ingredients").append(recipeHeader);

            //get recipe instruction from API and display it
            var instructions = $("<p>")
                .addClass("instr")
                .text(data.meals[0].strInstructions);
            $("#recipe-ingredients").append(instructions);

            //get the video URL and display it
            let videoHeader = $("<h2>").addClass("title").text("Video Recipe");
            var test = data.meals[0].strYoutube.slice(-11);
            $("#video").append(videoHeader);
            var iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube.com/embed/" + test;
            iframe.width = "420";
            iframe.height = "315";
            $("#video").append(iframe);

            $("#save-recipe-btn").on("click", function () {
                $(".saved-recipes").addClass("");

                let recipeEl = $("<button>")
                  .text(data.meals[0].strMeal)
                  .addClass("saved-recipe");
                // append to the container div
                $(".saved-recipes").append(recipeEl);

                let recipeID = data.meals[0].idMeal;

                $(recipeEl).on("click", function reloadRecipe() {
                    clearBasicRecipeContents();
                    displayRecipeOptions(recipeID);
                });
            });
        });
}

function previousRecipemealDB() {
    if (recipeDetailIndex ===0){
        return displayRecipeOptions(meals[0]);
    }
    recipeDetailIndex --;
    displayRecipeOptions(meals[recipeDetailIndex]);
}

function nextRecipemealDB() {
    recipeDetailIndex ++;
    displayRecipeOptions(meals[recipeDetailIndex]);
}

$("#recipe-name").on("click", "#previous-btn", function () {
    clearBasicRecipeContents();
    previousRecipemealDB();
});

$("#recipe-name").on("click", "#next-btn", function () {
    clearBasicRecipeContents();
    nextRecipemealDB();
});

$("#select1 li").click(function () {
    //Get the id of list items
    clearBasicRecipeContents();
    let value = $(this).text();
    getMealDB(value);
});
