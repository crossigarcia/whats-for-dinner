$('#keyword-btn').on('click', function() {
    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
});

function runEdamam(keyword) {
    let apiUrl = `https://api.edamam.com/search?q=${keyword}&app_id=f97b44b8&app_key=0ab78a3d00b18729a51ba6b69ee857d0`;

    fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        let recipeName = $('<h2>').addClass('title').text(data.hits[0].recipe.label);
        $('#recipe-name').append(recipeName);

        // let recipeImg = $('<img>').

        let ingredientsList = $('<ul>').addClass('list')
        for (let i = 0; i < data.hits[0].recipe.ingredientLines.length; i++) {
            let ingredientItem = $('<li>').addClass('list-item').text(data.hits[0].recipe.ingredientLines[i]);

            ingredientsList.append(ingredientItem);
        }

        $('#recipe-ingredients').append(ingredientsList);

    });
};


// function runEdamam(){
//     console.log("runEdamam is running");
//     const edamamUrl = "https://api.edamam.com/search?q=";
//     const app_id = "&app_id=16faf740";
//     const appKEY = "&app_key=7e13ce2d929e6839de8e33e08b528146";
    
//     let query;

//     $.ajax({
//         url: edamamUrl+query+app_id+appKEY,
//         method: "GET"
//     }).then(function(response){
//         console.log("AJAX Resopnse: ", response);

//         // let hitsArray = response.hits;
//         // let i = 0;
//         // for(i; i < hitsArray.length; i++){
//         //     console.log("hits array ", hitsArray[i]);
//         // }
//     })
// };

var getMealDB = function () {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian').then(function(response) {
    response.json().then(function(data) {
    console.log(data);
  });
});
}

$("#edamam-btn").on("click", runEdamam);
$("#mealdb-btn").on("click", getMealDB);