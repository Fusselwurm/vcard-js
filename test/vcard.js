
var
//	console = require('console'),
	vcard = require('../src/vcard.js'),
	v;

console.log("I'm here");

v = vcard.createFromData([{
		name: 'fn',
		value: 'Moritz Schmidt'
	},{
		name: 'n',
		value: ['Schmidt', 'Moritz']
	}
]);

console.log(v.toVCard());
