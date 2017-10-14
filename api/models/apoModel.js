'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PillSchema = new Schema({
    _id: Schema.ObjectId,
    pillID: Number,
    setid: String,
    shape: {
        type: String,
        enum: ["Bullet","Capsule", "Clover", "Diamond", "Double", "Freeform", "Gear", "Heptagon", "Hexagon", "Octagon", "Oval", "Pentagon", "Rectangle", "Round", "Semi-circle","Square", "Tear", "Trapezoid", "Triangle"]
    },
    imprint: String,
    color: {
        type: String,
        enum: ["Black", "Blue", "Brown", "Gray","Green","Orange","Pink","Purple","Red","Turquoise","White","Yellow"]
    },
    active_ingredient: [ {name: String, amount: Number}],
    inactive_ingredient:[{name: String, amount: Number}],
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
