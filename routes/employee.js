const express = require("express");
const router = express.Router();
const Employee = require('../models/Employee');

router.get('/all', (req, res) => {
    Employee.find({}, (err, employees) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employees);
    });
});

router.get('/:id', (req, res) => {
    Employee.findOne({ _id: req.params.id }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employee);
    })
});

router.put('/', (req, res) => {
    Employee.find({ company: req.body.company, isManager: true }, (err, employees) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        if (req.body.isManager == 'true' && employees.length > 0)
            return res.status(500).json({ msg: "Server Error :)", err: "company already has a manager" })
        const newEmployee = new Employee(req.body);
        newEmployee.save((err, employee) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json(employee);
        })
    });
});

router.post('/:id', (req, res) => {
    Employee.findOne({ _id: req.params.id }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        Employee.find({ company: employee.company, isManager: true }, (err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            if (req.body.isManager == 'true' && employees.length >= 1 && employees[0]._id != req.params.id)
                return res.status(500).json({ msg: "Server Error :)", err: "company already has a manager" })
            employee.updateOne(req.body, { new: true, runValidators: true, useFindAndModify: false }, (err, result) => {
                if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                res.json(employee);
            })
        })

    })
})

router.delete('/:id', (req, res) => {
    Employee.findOneAndDelete({ _id: req.params.id }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json({ employee, msg: "success" });
    })
});

module.exports = router;