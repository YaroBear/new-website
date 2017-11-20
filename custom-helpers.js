const Handlebars = require('hbs');

Handlebars.registerHelper("everyOther", function (index, amount, scope) {
    if ( ++index % amount) 
        return scope.inverse(this);
    else 
        return scope.fn(this);
});

/* 
{{#each item}}
	{{#everyOther @index amount}}
		Some html
	{{else}}
		Some other html
	{{/everyother}}
{{/each}}
*/

Handlebars.registerHelper('formatPostTime', function (date) {
	var newDate = new Date(date);
	var formatted = newDate.getMonth() + "/" + newDate.getDate() + "/" + newDate.getFullYear();
	return formatted;
});

module.exports = Handlebars;