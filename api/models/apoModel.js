'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PillSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    pillID: Number,
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
    userID: String,
    recent_search: {
        type: String
    }
})

module.exports = mongoose.model('Pills', PillSchema),
    mongoose.model('Users',UserSchema);
