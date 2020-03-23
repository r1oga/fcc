/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      try {
        const input = req.query.input.toLowerCase();
        const initNum = convertHandler.getNum(input);
        const initUnit = convertHandler.getUnit(input);
        const returnNum = convertHandler.convert(initNum, initUnit);
        const returnUnit = convertHandler.getReturnUnit(initUnit);
        const toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
        if (!returnNum) {
          res.send('invalid number')
        }
        res.json({
          initNum,
          initUnit,
          returnUnit,
          returnNum,
          string: toString
        })
      } catch(err) {
        if (err.message.includes('ratio')) {
          res.send('invalid unit')
        } else {
          console.log(err.message)
        }
      }
      
    });
    
};
