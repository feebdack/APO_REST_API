'use strict';
console.log("Data Import Started.");
//var mongoose = require('mongoose'),
//    Pill = mongoose.model('Pills');

//var fs = require('fs');
var tsv = require('node-tsv-json');

var option = {input: "data/Single_Entry_Pill.txt", output:"data/output.json"}
//var stream = fs.createReadStream(__dirname + '/data/Single_Entry_Pill.txt');
var that = this;
var json;

//Creates or updates database with incoming JSON object.
//input_json_pill needs to be formated according to pill schema located at api/models/apoModel.js
exports.add_json_pill_to_db = function(input_json_pill){

    //Shows progress bar for completed database saves
    if(ubar == null){ubar = new progress_bar('[:bar] :percent',{
        complete: '=',
        incomplete: ' ',
        width: 50,
        renderThrottle: 100,
        total:pbar_length,
        callback:function(){setTimeout(process.exit(),1000)}
    })}

//Creates or updates database with incoming JSON object.
//input_json_pill needs to be formated according to pill schema located at api/models/apoModel.js
exports.add_json_pill_to_db = function(input_json_pill){

    //Shows progress bar for completed database saves
    if(ubar == null){ubar = new progress_bar('[:bar] :percent',{
        complete: '=',
        incomplete: ' ',
        width: 50,
        renderThrottle: 100,
        total:pbar_length,
        callback:function(){setTimeout(process.exit(),1000)}
    })}

    //Save the entries. Updates if existing
    Pill.findOneAndUpdate({pillID:input_json_pill.pillID},input_json_pill,function(err,result){
        if(err){throw err}
        else{
            if(!result){
                //Creates a new Pill object if none exists
                result = new Pill(input_json_pill);
            }
            //Saves Pill object (updated or new) into database
            result.save(function(error){
                if(error){throw error;}
                ubar.tick();
                ubar.render();
                //console.log("Saved");
            })
        }
    });
}

//Prepares JSON object into Pill Schema format
exports.save_json_array = function(input){
    console.log('Processing ' + input.length + ' entries');
    //Progress bar for completion
    pbar= new progress_bar('[:bar] :percent',{
        complete: '=',
        incomplete: ' ',
        width: 50,
        total:input.length,
        callback:function(){console.log("Waiting for DB connection..");}
    });
    this.pbar_length = input.length;

    //Loop through all objects, creating schema objects of all JSON pill objects
    for(var i = 0; i<input.length; i++){
        pbar.tick();
        pbar.render();
        var pill_obj = input[i];

        //JSON array of active ingredients and quantities
        //Parses through ingredients list, creating array of ingredients
        var active_ingredients_strings = pill_obj.spl_strength.split(";");
        var active_ingredients = JSON.stringify(active_ingredients_strings);
        //Json array of inactive ingredients
        var inactive_ingredient_strings = pill_obj.spl_inactive_ing_new.split(";");
        var inactive_ingredients = JSON.stringify(inactive_ingredient_strings);

        //Create a JSON object with only the necessary parameters
        var new_pill = {
            pillID: parseInt(pill_obj.ID),
            setid: pill_obj.setid,
            shape: pill_obj.splshape_text.split(" ")[0],
            imprint: pill_obj.splimprint_new,
            color: pill_obj.splcolor_text.split(" ")[0].split(";"),
            active_ingredient: active_ingredients_strings,
            inactive_ingredient: inactive_ingredient_strings,
            rxString: pill_obj.rxString_new,
            product_code: pill_obj.product_code,
            medicine_name:pill_obj.medicine_name,
            equal_product_code:pill_obj.equal_product_code,
            dea_schedule:pill_obj.dea_schedule_name,
            splimage:pill_obj.splimage
        }
        this.add_json_pill_to_db(new_pill);
    }
};


tsv(option,function(err,result){
    var saver = require('./data_import')
    if(err){
        console.log(error);
    }
    console.log("TSV File Read");
    pbar_length = result.length;
    saver.save_json_array(result);
});
