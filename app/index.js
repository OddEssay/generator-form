'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var clc = require('cli-color');
var _ = require('underscore');

var answers = [];
var prompts = [
	{
		name: 'inputName',
		message: 'What is the ' + clc.green('name attribute') + ' of this input?'
	}, {
		name: 'inputLabel',
		message: 'What is the input ' + clc.green('label') + '?'
	}, {
		name: 'inputType',
		message: 'What type of input is this?',
		type: 'list',
		choices: [
			{ name: 'Text', value: 'text' },
			{ name: 'Text Area', value: 'textarea' },
			{ name: 'Radio Buttons', value: 'radio' },
			{ name: 'Multi Select (HTML)', value: 'select' },
			{ name: 'Multi Select (Select2)', value: 'select2' }
		],
		default: 'text'
	}, {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to ' + clc.green('add another') + ' input?',
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
	var textAreaTemplate =  _.template('<label for="<%= inputName %>"><%= inputLabel %></label><textarea id="<%= inputName %>" name="<%= inputName %>" ></textarea>'    );
	var radioTemplate = _.template('<label for="<%= inputName %>"><%= inputLabel %></label><input type="<%= inputType %>" id="<%= inputName %>" name="<%= inputName %>" vale="" />');
	var selectTemplate = _.template('<label for="<%= inputName %>"><%= inputLabel %></label><select name="<%= inputName %>" id="<%= inputName %>"><option value=""></option></select>');
	var select2Template = _.template('<label for="<%= inputName %>"><%= inputLabel %></label><select name="<%= inputName %>" id="<%= inputName %>"><option value=""></option></select>');


	var scriptContent = '';

	console.log('<form>');
	_.each(answers, function(a) {
		switch(a.inputType){
			case 'text': {
				console.log(inputTemplate(a));
				break;
			}
			case 'textarea': {
				console.log(textAreaTemplate(a));
				break;
			}
			case 'radio': {
				console.log(radioTemplate(a));
				break;
			}
			case 'select': {
				console.log(selectTemplate(a));
				break;
			}	
			case 'select2':{
				console.log(select2Template(a));
				scriptContent = scriptContent + "$('#" + a.inputName + "').select2();\n";
				break;
			}
		}
	} );
	console.log('<input type="submit" />');
	console.log('</form>');
	if(scriptContent){
		console.log('<script type="javascript">');
		console.log(scriptContent);
		console.log('</script>');
	}
}
