const express = require("express");
const router = express.Router();
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const tools = require('../tools/date');

router.get('/', (req, res) => {
    let page = req.query.pageno
    if (!req.query.pageno)
        page = 1;
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        if (req.query.from) {
            if (!tools.dateValidate(req.query.from) || !tools.dateValidate(req.query.to) || !tools.isAfter(req.query.from, req.query.to))
                res.status(400).send();

            companies = companies.filter(company => {
                if (tools.isAfter(req.query.from, company.CreationDate) && tools.isAfter(company.CreationDate, req.query.to))
                    return company;
            });
        }
        if (isNaN(page) || page < 1 || (companies.length + 6 <= page * 6 && page != 1))
            res.status(404).send()
        res.render('company', { companies: companies.slice((page - 1) * 6, page * 6), companiesSize: companies.length })
    });
});

router.get('/company/:companyId/', (req, res) => {
    let page = req.query.pageno
    if (!req.query.pageno)
        page = 1;
    Company.findOne({ _id: req.params.companyId }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        Employee.find({ company: req.params.companyId }, (err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            if (isNaN(page) || page < 1 || (employees.length + 6 <= page * 6 && page != 1))
                res.status(404).send()
            res.render('employee', { company, employees: employees.slice((page - 1) * 6, page * 6), employeesSize: employees.length })
        });
    });
});

router.get('/all', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(companies);
    });
});

router.get('/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(company);
    })
});

router.put('/', (req, res) => {
    const newCompany = new Company(req.body);
    newCompany.save((err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(company);
    })
});

router.post('/:id', (req, res) => {
    Company.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true, useFindAndModify: false }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(company);
    })
});

router.delete('/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        company.deleteOne((err, result) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json({ company, msg: "success" });
        })
    })

});

module.exports = router;