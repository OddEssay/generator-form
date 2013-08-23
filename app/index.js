'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('underscore');

var answers = [];
var prompts = [
	{
		name: 'inputName',
		message: 'What is the name attribute of this input?'
	}, {
		name: 'inputLabel',
		message: 'What is the input label?'
	}, {
		name: 'inputType',
		message: 'What type of input is this?',
		default: 'text'
	}, {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to add another answer?',
    default: false
}];

var FormGenerator = module.exports = function FormGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FormGenerator, yeoman.generators.Base);

FormGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

	this._ask(prompts,cb);
};
FormGenerator.prototype._ask = function ask(prompts,cb) {
	this.prompt(prompts, function(props){
		answers.push({inputName: props.inputName, inputLabel: props.inputLabel, inputType: props.inputType});
		if(props.again){
			this._ask(prompts,cb);
		} else {
			cb();
		}

	}.bind(this));
}
FormGenerator.prototype.display = function display() {
	var inputTemplate = _.template('<label for="<%= inputName %>"><%= inputLabel %></label><input type="<%= inputType %>" id="<%= inputName %>" name="<%= inputName %>" />');
	console.log('<form>');
	_.each(answers, function(a) { console.log(inputTemplate(a)); } );
	console.log('</form>');
}
