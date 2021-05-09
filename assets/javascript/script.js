let hitsIndex = 0;
let meals = [];
let recipeTitle = document.querySelector("#recipe-name");
let meal_container = document.getElementById("#recipe-display");
let recipeDetailIndex = 0;

// function to clear divs when loading new info
function clearBasicRecipeContents() {
  $("#recipe-name").empty();
  $("#recipe-img").empty();
  $("#recipe-ingredients").empty();
  $(".recipe-video").empty();
  $("#ingredients").empty();
  $("#recipe-header").empty();
  $("#video").empty();
  $("#recipe-instructions").empty();
}

// on click function to run edamam logic
$("#keyword-btn").on("click", function () {
  clearBasicRecipeContents();

  let keyword = $("#keyword").val().trim();

  runEdamam(keyword);
  searchHistory(keyword);
});

// edamam api logic
function runEdamam(keyword) {
  var apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      $("#bg").addClass("bg-after");

      let recipeName = $("<h2>")
        .addClass("title")
        .text(data.hits[hitsIndex].recipe.label);
      let nextButton = $("<button>").attr("id", "nxt-btn").text("Next Recipe");
      let previousButton = $("<button>")
        .attr("id", "prev-btn")
        .text("Previous Recipe");

      if (hitsIndex === 4) {
        $(nextButton).attr("disabled", "disabled").attr("id", "disabled");
      }

      if (hitsIndex === 0) {
        $(previousButton).attr("disabled", "disabled").attr("id", "disabled");
      }

      $("#recipe-name").append(recipeName, previousButton, nextButton);

      let recipeImg = $("<img>").attr("src", data.hits[hitsIndex].recipe.image);
      $("#recipe-img").append(recipeImg);

      let ingredientsList = $("<ul>").addClass("list");
      for (
        let i = 0;
        i < data.hits[hitsIndex].recipe.ingredientLines.length;
        i++
      ) {
        let ingredientItem = $("<li>")
          .addClass("list-item")
          .text(data.hits[hitsIndex].recipe.ingredientLines[i]);

        ingredientsList.append(ingredientItem);
      }

      let ingredientsTitle = $("<h2>").addClass("title").text("Ingredients");

      $("#recipe-ingredients").append(ingredientsTitle, ingredientsList);

      let recipeLink = $("<a>")
        .attr("href", data.hits[hitsIndex].recipe.url)
        .attr("target", "_blank")
        .text("Click here for recipe instructions")
        .addClass("link");

      $("#recipe-instructions").append(recipeLink);

      // Saved Recipes
      let saveRecipeBtn = $("<button>")
        .attr("id", "save-recipe-btn")
        .text("Save This Recipe");

      $("#recipe-name").append(saveRecipeBtn);

      $("#save-recipe-btn").on("click", function () {
        $(".saved-recipes").addClass("");

        let recipeEl = $("<button>")
          .text(data.hits[hitsIndex].recipe.label)
          .addClass("saved-recipe");
        // append to the container div
        $(".saved-recipes").append(recipeEl);

        let recipeID = data.hits[hitsIndex].recipe.label;

        $(recipeEl).on("click", function reloadRecipe() {
          clearBasicRecipeContents();
          runEdamam(recipeID);
        });
      });
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        $("#recipe-display").empty();
        UIkit.modal.alert("Recipe Not Found! Please try a different keyword.");
      }
    });
}
// functions targeting nexr and previous buttons
function nextRecipe() {
  let keyword = $("#keyword").val().trim();
  hitsIndex++;
  runEdamam(keyword);
}

$("#recipe-name").on("click", "#nxt-btn", function () {
  clearBasicRecipeContents();

  nextRecipe();
});

function previousRecipe() {
  let keyword = $("#keyword").val().trim();
  hitsIndex--;
  runEdamam(keyword);
}

$("#recipe-name").on("click", "#prev-btn", function () {
  clearBasicRecipeContents();
  previousRecipe();
});

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
};

function displayRecipeOptions(menu) {
  var apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + menu;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      $("#bg").addClass("bg-after");
      const ingredients = [];
      //display recipe title, buttons, images
      var recipeName = $("<h2>").addClass("title").text(data.meals[0].strMeal);
      var nextButton = $("<button>").attr("id", "next-btn").text("Next Recipe");
      var previousButton = $("<button>")
        .attr("id", "previous-btn")
        .text("Previous Recipe");
      var saveRecipeBtn = $("<button>")
        .attr("id", "save-recipe-btn")
        .text("Save This Recipe");

      //disable next button if we have reached end of array
      if (menu === meals[meals.length - 1]) {
        $(nextButton).attr("disabled", "disabled").attr("id", "disabled");
      }
      //disable previous button if we have reached beginning of array
      if (menu === meals[0]) {
        $(previousButton).attr("disabled", "disabled").attr("id", "disabled");
      }

      $("#recipe-name").append(
        recipeName,
        previousButton,
        nextButton,
        saveRecipeBtn
      );

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

      //get recipe instruction from API and display it
      var instructions = $("<p>")
        .addClass("instr")
        .text(data.meals[0].strInstructions);

      $("#recipe-instructions").append(recipeHeader, instructions);

      //get the video URL and display it
      let videoHeader = $("<h2>")
        .addClass("title video-title")
        .text("Video Recipe");
      var test = data.meals[0].strYoutube.slice(-11);
      $("#video").append(videoHeader);
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + test;
      $("iframe").addClass("video-display");
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
  if (recipeDetailIndex === 0) {
    return displayRecipeOptions(meals[0]);
  }
  recipeDetailIndex--;
  displayRecipeOptions(meals[recipeDetailIndex]);
}

function nextRecipemealDB() {
  recipeDetailIndex++;
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
