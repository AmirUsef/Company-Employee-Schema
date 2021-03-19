const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tools = require('../tools/date');
const Employee = require('./Employee');

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 2,
        maxlength: 30,
        set: v => v.toLowerCase()
    },
    registration_number: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    state: {
        type: String,
        trim: true,
        set: v => v.toLowerCase()
    },
    city: {
        type: String,
        trim: true,
        set: v => v.toLowerCase()
    },
    phone_number: {
        type: String,
        minlength: 5,
        maxlength: 12,
        trim: true
    },
    CreationDate: {
        type: String,
        trim: true,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

CompanySchema.path('CreationDate').validate(tools.dateValidate, 'invalid date');

CompanySchema.pre('deleteOne', { document: true, query: false }, function() {
    Employee.deleteMany({ company: this._id }, (err, employees) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
    });
});

module.exports = mongoose.model('Company', CompanySchema);