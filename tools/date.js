const JDate = require('jalali-date');

function dateValidate(dateString) {
    const date = dateString.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
    if (date) {
        const year = dateString.substring(0, 4);
        const month = date[1]
        const day = date[2]
        if (month == 12 && day == 30 && JDate.isLeapYear(year))
            return true
        return day <= JDate.daysInMonth(year, month)
    }
    return false
}

function isAfter(dateString1, dateString2) {
    const date1 = dateString1.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
    const date2 = dateString2.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
    const year1 = dateString1.substring(0, 4);
    const month1 = date1[1]
    const day1 = date1[2]
    const year2 = dateString2.substring(0, 4);
    const month2 = date2[1]
    const day2 = date2[2]
    if (year2 > year1)
        return true
    if (year2 == year1) {
        if (month2 > month1)
            return true
        if (month2 == month1 && day2 >= day1)
            return true
    }
    return false
}

function calculateAge(dateString) {
    const date = dateString.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
    year = dateString.substring(0, 4);
    month = date[1]
    day = date[2]
    const today = new JDate;
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const thisDay = today.getDay();
    if (thisMonth > month || (thisMonth == month && thisDay >= day))
        return thisYear - year
    return thisYear - year - 1
}

module.exports = { dateValidate, calculateAge, isAfter };