//edamam api logic:
let hitsIndex = 0;

$('#keyword-btn').on('click', function() {
    $('#recipe-name').empty();
    $('#recipe-ingredients').empty();
    $('#recipe-img').empty();

    let keyword = $('#keyword').val().trim();

    runEdamam(keyword);
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

        $('#recipe-name').empty();
        $('#recipe-ingredients').empty();
        $('#recipe-img').empty();

        runEdamam(keyword);
    } else {
        $('#next-recipe-btn').disabled(true);
        console.log("btn disabled");
    }
     
 };
