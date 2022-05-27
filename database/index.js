module.exports.init = function()
{
  const mongoose = require('mongoose');
  mongoose.connect('mongodb+srv://root:1234567891@cluster0.chlv1.mongodb.net/exceldata?retryWrites=true&w=majority')
  .then(function()
  {
    console.log("db is live")
  })
  .catch(function()
  {
    console.log("error in db connection")
  })
}