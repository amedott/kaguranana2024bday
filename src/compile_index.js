const TEMPLATE = "./src/index.handlebars"
const RESPONSES = "./src/response.csv"

const handlebars = require('handlebars');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const template_source = fs.readFileSync(TEMPLATE).toString();

var messages = [];

const content = fs.readFileSync(RESPONSES);
const records = parse(content, { from_line: 2 });

records.map(record => {
    let twitter = record[2];

    if (!twitter.startsWith("@")) {
        twitter = `@${twitter}`;
    }

    message_row = {
        timestamp: record[0],
        name: record[1],
        twitter: twitter.trim(),
        content: record[3]
    };

    messages.push(message_row);
});

handlebars.registerHelper('breaklines', function(text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new handlebars.SafeString(text);
});

var compiled = handlebars.compile(template_source);
var html = compiled(
    { messages: messages }
);

console.log(html);