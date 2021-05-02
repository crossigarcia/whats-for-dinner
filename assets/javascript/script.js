//edamam api logic:
let hitsIndex = 0;
let mealID = [];
var listTitle = document.querySelector("#recipe-name");
var meal_container = document.getElementById('#recipe-steps');
//var fetchID = document.getElementById("recipe-title");

$('#keyword-btn').on('click', function () {
    $('#recipe-name').html('');
    $('#recipe-ingredients').html('');
    $('#recipe-img').html('');

    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
});

function runEdamam(keyword) {
    let apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            //let recipeHits = data.hits;
            let recipeName = $('<h2>').addClass('title').text(data.meals[hitsIndex].recipe.label);
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

//mealDB api logic:
var getMealDB = function () {
    //fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(function (response) {
    // response.json().then(function (data) {
    //    console.log(data);
    //});
    //});

    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian').then(function (response) {
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
    var menuDetail = event.target.getAttribute("menu-id");
    console.log(menuDetail);
    if (menuDetail) {
        $("#recipe-name").empty();
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
            //console.log(data.meals[0].strMealThumb);

            // Get all ingredients from the object. Up to 20
            
            // for(let i=1; i<=20; i++) {
            //     let strIngredient = "strIngredient"+i;
            //     console.log (strIngredient);  
            //     //if(data.meals[0].strIngredient != "" || data.meals[0].strIngredient != "null"){
            //       ingredients.push(data.meals[0].strIngredient)
            //       console.log(ingredients);
            //       console.log(data.meals[0].strIngredient1);
                
    
              //}


              
           // }

           //const ingredients = [];
    // Get all ingredients from the object. Up to 20
     for(let i=1; i<=20; i++) {
        if(data.meals[0][`strIngredient${i}`]) {
        ingredients.push(`${data.meals[0][`strIngredient${i}`]} - ${data.meals[0][`strMeasure${i}`]}`)
        console.log(ingredients);
        } else {
      // Stop if no more ingredients
         break;
        }
        
    }

    })    

}    


//$("menu-btn").on("click", buttonClickHandler);


$("#edamam-btn").on("click", runEdamam);
$("#mealdb-btn").on("click", getMealDB);