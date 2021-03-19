const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tools = require('../tools/date');

const EmployeeSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30,
        set: v => v.toLowerCase()
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30,
        set: v => v.toLowerCase()
    },
    isManager: {
        type: Boolean,
        default: false,
    },
    code_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: "00000000"
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    birth_date: {
        type: String,
        trim: true,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    age: {
        type: Number
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

EmployeeSchema.path('birth_date').validate(tools.dateValidate, 'invalid date');

EmployeeSchema.pre('save', function(next) {
    this.age = tools.calculateAge(this.birth_date)
    next()
});

EmployeeSchema.pre('updateOne', function(next) {
    delete this.getUpdate().age;
    if (this.getUpdate().birth_date)
        this.getUpdate().age = tools.calculateAge(this.getUpdate().birth_date)
    next()
});


module.exports = mongoose.model('Employee', EmployeeSchema);