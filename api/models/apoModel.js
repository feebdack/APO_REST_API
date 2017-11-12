'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PillSchema = new Schema({
    pillID: {
        type:Number,
        index:{unique:true}
    },
    setid: String,
    shape: {
        type: String,
        enum: ["","BULLET","CAPSULE", "CLOVER", "DIAMOND", "DOUBLE", "FREEFORM", "GEAR", "HEPTAGON", "HEXAGON", "OCTAGON", "OVAL", "PENTAGON", "RECTANGLE", "ROUND", "SEMI-CIRCLE","SQUARE", "TEAR", "TRAPEZOID", "TRIANGLE"]
    },
    imprint: [String],
    color: {
        type: [String],
        enum: ["","BLACK", "BLUE", "BROWN", "GRAY","GREEN","ORANGE","PINK","PURPLE","RED","TURQUOISE","WHITE","YELLOW"]
    },
    active_ingredient: [ String],
    inactive_ingredient:[ String ],
    rxString: String,
    product_code: String,
    medicine_name: String,
    equal_product_code: String,
    dosage_form: String,
    dea_schedule: String,
    splimage: String
});

var UserSchema = new Schema({
    userID: {
        type:String,
        index:{unique:true}
    },
    search_count: {
        type:Number,
        default:0
    },
    recent_search: [Number]
})

UserSchema.methods.increment_query = function(callback){
    this.search_count ++;
    this.save(callback);
}

module.exports = mongoose.model('Pills', PillSchema),
    mongoose.model('Users',UserSchema);
