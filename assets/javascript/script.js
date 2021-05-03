let hitsIndex = 0;

let mealID = [];
var listTitle = document.querySelector("#recipe-name");
var meal_container = document.getElementById('#recipe-display');

$('#keyword-btn').on('click', function() {
    $('#recipe-name').empty();
    $('#recipe-ingredients').empty();
    $('#recipe-img').empty();

    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
    searchHistory(keyword);
});

var select = document.getElementById('select1');
function logValue() {
    var result = $(".uk-active").text();
    console.log(result);
    getMealDB(result);
}

function GetSelectedValue(){
    var e = document.getElementById("country");
    var result = e.options[e.selectedIndex].value;
    
    document.getElementById("result").innerHTML = result;
}

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

        let recipeLink = $('<a>').attr('href', data.hits[hitsIndex].recipe.url).attr('target', '_blank').text('Click here for recipe instructions');

        $('.link').append(recipeLink);

        // Saved Recipes
        let saveRecipeBtn = $('<button>').attr('id', 'save-recipe-btn').text('Save This Recipe');
        
        $('#recipe-name').append(saveRecipeBtn);

        $(saveRecipeBtn).on('click', function saveRecipe() {
            $('#saved-recipes').addClass('');
    
            let recipeEl = $('<button>').text(data.hits[hitsIndex].recipe.label);
            // append to the container div
            $('#saved-recipes').append(recipeEl);

            let recipeID = data.hits[hitsIndex].recipe.label;

            $(recipeEl).on('click', function reloadRecipe(){
                // runEdamam() but for a specific recipe
                $('#recipe-name').empty();
                $('#recipe-img').empty();
                $('#recipe-ingredients').empty();

                runEdamam(recipeID);
            });
        });
    })
    .catch((error) => {
        if (error) {
            $('#recipe-display').empty();
            UIkit.modal.alert('Recipe Not Found! Please try again.');
        }
        
    });
    
};

function nextRecipe() {
    
    let keyword = $('#keyword').val().trim();
    hitsIndex++;

    if (hitsIndex === 5) {
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
    
    // take the current keyword search term and place it at the beginning of an array
    // searchHistoryArray.unshift(keyword);
    // console.log(searchHistoryArray);
    var searchHistoryEl = document.querySelector("#previous-searches");
    searchHistoryEl.classList = "enter css styling classes here"

    var searchKeywordEl = document.createElement("h5");
    searchKeywordEl.textContent = keyword;

    // append to the container div
    searchHistoryEl.appendChild(searchKeywordEl);
}
// add a feature such that if the user hits a certain count of search queries, the button either disables or
// the div gets a scroll box (so they can have unlimited searches)
// scrollable div would use "overflow: scroll" in the css

//mealDB api logic:
var getMealDB = function (category) {
    //fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(function (response) {
    // response.json().then(function (data) {
    //    console.log(data);
    //});
    //});
    console.log('https://www.themealdb.com/api/json/v1/1/filter.php?c='+ category )
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c='+ category).then(function (response) {
        response.json().then(function (menu) {
            //saveMealID(menu);
            for (let j = 0; j < menu.meals.length; j++) {
                //var menuTitle= document.createElement("h2");
                var menuTitle = document.createElement('button');
                menuTitle.className = "menu-btn";
                menuTitle.setAttribute("menu-id", menu.meals[j].idMeal)
                menuTitle.innerHTML = menu.meals[j].strMeal;


                var menuIcon = document.createElement("img");
                menuIcon.setAttribute("src", menu.meals[j].strMealThumb);
                //menuTitle.textContent = menu.meals[j].strMeal;
                listTitle.appendChild(menuTitle);
                listTitle.appendChild(menuIcon);
                menuTitle.addEventListener("click", buttonClickHandler);
            }
            //displayRecipeOptions(menu);
        });
    });

}

var buttonClickHandler = function () {
    $("#recipe-name").empty();
    var menuDetail = event.target.getAttribute("menu-id");
    if (menuDetail) {
        displayRecipeOptions(menuDetail);
    }
}


function displayRecipeOptions(menu) {
    let apiUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='+ menu;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const ingredients = [];

            let recipeName = $('<h2>').addClass('title').text(data.meals[0].strMeal);
            $('#recipe-name').append(recipeName);

            console.log(recipeName);
            //console.log(data.meals[0].strMeal);

            let recipeImg = $('<img>').attr('src', data.meals[0].strMealThumb);
            $('#recipe-img').append(recipeImg);

            console.log(recipeImg);
            
           //const ingredients = [];
    // Get all ingredients from the object. Up to 20
    let ingredientsList = $('<ul>').addClass('list');
    var ingredientHeader = document.createElement("h2");
    ingredientHeader.classList.add("title");
    ingredientHeader.textContent = "Ingredients";
    $('#recipe-ingredients').append(ingredientHeader);
     for(let i=1; i<=20; i++) {
        if(data.meals[0][`strIngredient${i}`]) {
        ingredients.push(`${data.meals[0][`strIngredient${i}`]} - ${data.meals[0][`strMeasure${i}`]}`)
        } else {
      // Stop if no more ingredients
         break;
        }  
        
    }
feature/mealDb-edamam-merge
    for(let x=0; x<ingredients.length; x++){
        let ingredientItem = $('<li>').addClass('list-item').text(ingredients[x]);
        ingredientsList.append(ingredientItem);
        
    }
    $('#recipe-ingredients').append(ingredientsList);
         
    
    var recipeHeader = document.createElement("h2");
    recipeHeader.classList.add("title");
    recipeHeader.textContent = "Instructions";
    $('#recipe-ingredients').append(recipeHeader);
    
    let instructions = $('<p>').addClass('instr').text(data.meals[0].strInstructions);   
    $('#recipe-ingredients').append(instructions);
    }
 )}


//$("menu-btn").on("click", buttonClickHandler);


$("#edamam-btn").on("click", runEdamam);
$("#mealdb-btn").on("click", getMealDB);
//select.addEventListener('click', 'li', logValue);

$('#select1 li').click(function() {
    //Get the id of list items
     $("#recipe-name").empty();
     $("#recipe-img").empty();
     $("#ingredients").empty();
     $("#recipe-header").empty();
     $("#recipe-ingredients").empty();
     
     
      var value  = $(this).text();
      
    getMealDB(value);
  });


    })    

};    

