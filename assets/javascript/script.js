let hitsIndex = 0;
let meals = [];
let recipeTitle = document.querySelector("#recipe-name");
let meal_container = document.getElementById("#recipe-display");
let recipeDetail;

function clearBasicRecipeContents() {
  $("#recipe-name").empty();
  $("#recipe-img").empty();
  $("#recipe-ingredients").empty();
  $(".link").empty();
  $(".recipe-video").empty();
}

$("#keyword-btn").on("click", function () {
  clearBasicRecipeContents();

  let keyword = $("#keyword").val().trim();

  runEdamam(keyword);
  searchHistory(keyword);
});

function runEdamam(keyword) {
  let apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      let recipeName = $("<h2>").addClass("title").text(data.hits[hitsIndex].recipe.label);
      let nextButton = $("<button>").attr("id", "nxt-btn").text("Next Recipe");
      let previousButton = $("<button>").attr("id", "prev-btn").text("Previous Recipe");

      if (hitsIndex === 4) {
        nextButton.prop("disabled", true).addClass('disabled');
      }

      if (hitsIndex === 0) {
        previousButton.prop("disabled", true).addClass('disabled');
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

      $("#recipe-ingredients").append(ingredientsList);

      let recipeLink = $("<a>")
        .attr("href", data.hits[hitsIndex].recipe.url)
        .attr("target", "_blank")
        .text("Click here for recipe instructions");

      $(".link").append(recipeLink);

      // Saved Recipes
      let saveRecipeBtn = $("<button>")
        .attr("id", "save-recipe-btn")
        .text("Save This Recipe");

      $("#recipe-name").append(saveRecipeBtn);

      $(saveRecipeBtn).on("click", function saveRecipe() {
        $("#saved-recipes").addClass("");

        let recipeEl = $("<button>").text(data.hits[hitsIndex].recipe.label);
        // append to the container div
        $("#saved-recipes").append(recipeEl);

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

//  Previous Searches
let searchHistoryArray = [];
function searchHistory(keyword) {
  // send the keyword to a user's local storage
  localStorage.setItem("keyword", keyword);

  let searchHistoryEl = document.querySelector("#previous-searches");
  searchHistoryEl.classList = "enter css styling classes here";

  let searchKeywordEl = document.createElement("button");
  searchKeywordEl.textContent = keyword;

  // append to the container div
  searchHistoryEl.appendChild(searchKeywordEl);

  $(searchKeywordEl).on("click", function reloadRecipe() {
    clearBasicRecipeContents();
    runEdamam(keyword);
  });
}

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
        let menuTitle = document.createElement("button");
        menuTitle.className = "menu-btn";
        menuTitle.setAttribute("menu-id", menu.meals[j].idMeal);
        menuTitle.innerHTML = menu.meals[j].strMeal;
        let menuIcon = document.createElement("img");
        menuIcon.setAttribute("src", menu.meals[j].strMealThumb);
        recipeTitle.appendChild(menuTitle);
        recipeTitle.appendChild(menuIcon);
        menuTitle.addEventListener("click", buttonClickHandler);
      }
    });
  });
};

let buttonClickHandler = function () {
  $("#recipe-name").empty();
  recipeDetail = event.target.getAttribute("menu-id");
  if (recipeDetail) {
    displayRecipeOptions(recipeDetail);
  }
};

function displayRecipeOptions(menu) {
  let apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + menu;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const ingredients = [];

      let recipeName = $('<h2 id="meal-id" data-mealid="' + menu + '">')
        .addClass("title")
        .text(data.meals[0].strMeal);
      let nextButton = $("<button>").attr("id", "next-btn").text("Next Recipe");
      let previousButton = $("<button>")
        .attr("id", "previous-btn")
        .text("Previous Recipe");

      if (menu === meals[meals.length - 1]) {
        nextButton.prop("disabled", true).addClass("disabled");
      }

      if (menu === meals[0]) {
        previousButton.prop("disabled", true).addClass("disabled");
      }

      $("#recipe-name").append(recipeName, previousButton, nextButton);

      let recipeImage = $("<img>").attr("src", data.meals[0].strMealThumb);
      $("#recipe-img").append(recipeImage);
      // Get all ingredients from the object. Up to 20
      let ingredientsList = $("<ul>").addClass("list");
      let ingredientHeader = document.createElement("h2");
      ingredientHeader.classList.add("title");
      ingredientHeader.textContent = "Ingredients";
      $("#recipe-ingredients").append(ingredientHeader);
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
        let ingredientItem = $("<li>")
          .addClass("list-item")
          .text(ingredients[x]);
        ingredientsList.append(ingredientItem);
      }
      $("#recipe-ingredients").append(ingredientsList);
      let recipeHeader = document.createElement("h2");
      recipeHeader.classList.add("title");
      recipeHeader.textContent = "Instructions";
      $("#recipe-ingredients").append(recipeHeader);

      let instructions = $("<p>")
        .addClass("instr")
        .text(data.meals[0].strInstructions);
      $("#recipe-ingredients").append(instructions);

      // added 249-260 from Chitra's
      let videoHeader = document.createElement("h2");
      videoHeader.classList.add("title");
      videoHeader.textContent = "Video Recipe";
      let test = data.meals[0].strYoutube.slice(-11);
      $("#video").append(videoHeader);
      let iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + test;
      iframe.width = "420";
      iframe.height = "315";
      $("#video").append(iframe);
    });
}

function previousRecipemealDB() {
  recipeDetail = meals[meals.indexOf(recipeDetail) - 1];
  displayRecipeOptions(recipeDetail);
}

$("#recipe-name").on("click", "#previous-btn", function () {
  clearBasicRecipeContents();
  previousRecipemealDB();
});

function nextRecipemealDB() {
  recipeDetail = meals[meals.indexOf(recipeDetail) + 1];
  displayRecipeOptions(recipeDetail);
}

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
