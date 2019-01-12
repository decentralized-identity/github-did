const vorpal = require("vorpal")();

vorpal.command("foo", 'Outputs "bar".').action(function(args, callback) {
  this.log("bar");
  callback();
});

vorpal.delimiter("🐙 ").show();
