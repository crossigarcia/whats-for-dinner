function runAjax(){
    const ajaxUrl = "https://api.edamam.com/search?q=";
    const app_id = "&app_id=16faf740";
    const appKEY = "&app_key=7e13ce2d929e6839de8e33e08b528146";
    
    let query;
    
    $.ajax({
        url: ajaxUrl+query+app_id+appKEY,
        method: "GET"
    }).then(function(response){
        console.log("AJAX Resopnse: ", response);

        let hitsArray = response.hits;
        let i = 0;
        for(i; i < hitsArray.length; i++){
            console.log("hits array ", hitsArray[i]);
        }
    })
}