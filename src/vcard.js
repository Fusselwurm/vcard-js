/**
 * limitations:
 *   no escaping
 *   no folding
 */


var outputFuncs = {
	escapeVal: function (v) {
		// todo
	},
	paramToString: function (param) {
		var
			res = [],
			paramName,
			paramVal;

		for (paramName in param) {
			if (param.hasOwnProperty(paramName))  {
				paramVal = param[paramName];
				if (!Array.isArray(paramVal)) {
					paramVal = [paramVal];
				}
				res.push(paramName.toUpperCase() + '=' + paramVal.join(','));
			}
		}
		return res.length ? ';' + res.join(';') : '';
	},
	contentLine: function (group, name, param, value) {
		var line = '';
		if (group) {
			line += group + '.'
		}
		line += name.toUpperCase();
		line += outputFuncs.paramToString(param);

		if (!Array.isArray(value)) {
			value = [value];
		}

		line += ':' + value.join(';');
		return line;
	},
	head: function (version) {
		return 'BEGIN:VCARD\r\nVERSION:' + (version || '4.0');
	},
	foot: function () {
		return 'END:VCARD\r\n';
	}
};



/**
 *
 * @param data hash (object) with properties: group, name, param, value
 *
 * e.g. this JSON example:
 * @code
 * {
 *     name: 'email',
 *     param: {
 *         type: ['work', 'home']
 *     },
 *     value: 'fusselwurm@gmail.com'
 * }
 * @endcode
 *
 */
exports.createFromData = function (data, version) {
	return {
		getData: function () {
			return data;
		},
		getProperty: function (name) {
			return data[name];
		},
		getVersion: function () {
			return version;
		},
		/**
		 * get vCard string.
		 * @note does not do folding, yet
		 *
		 * @return string
		 */
		toVCard: function () {
			var
				f = outputFuncs;

			return f.head() + '\r\n' + data.map(function (d) {
				return f.contentLine(d.group, d.name, d.param, d.value);
			}).join('\r\n') + '\r\n' + f.foot();
		}

	};
};

/**
 *
 * @param vCard string contents of a single vcard
 */
exports.createFromVCard = function (vCard) {
	var
		// unfold, then split into logical lines
		lines = vCard.trim().replace(/\r\n\s+/, '').split('\r\n'),
		//
		// 0.. before VCARD:BEGIN,
		// 4.. within VCARD, before VERSION,
		// 5.. within VCARD,
		// 9.. AFTER VCARD:END
		scope = 0,
		data,
		version = '0';

	if (lines.shift().trim() !== 'BEGIN:VCARD') {
		throw new Error('vcard must have BEGIN:VCARD statement first');
	}

	if (lines.pop().trim() !== 'END:VCARD') {
		throw new Error('vcard must have END:VCARD statement last');
	}

	version = lines.shift().trim().match(/^version:([0-9\.]+)$/i);
	if (!version) {
		throw new Error('vcard must have VERSION statement directly after BEGIN');
	} else {
		version = version[1];
	}

	// great! now all other lines contain values:

	data = lines.map(function (line) {
		var linebits,
			tmp,
			tmp2,
			result = {};

		line = line.trim();
		if (!line) {
			// dont care for empty lines. at all.
			throw '*confused* waiiiit.. didnt I filter out those empty with the unfolding? I think I did.';
		}

		linebits = line.split(/:/, 2);

		// group, name, param
		tmp = linebits[0].split(';');

		tmp2 = tmp.shift().split('.', 2);
		result.name = tmp2.pop();
		if (tmp2.length) {
			result.group = tmp2.pop();
		}

		tmp.forEach(function (p) {
			var bits = p.split('=', 2);
			result.param = result.param || {};
			result.param[bits[0]] = bits[1].split(',');
		});

		// value
		result.value = linebits[1].split(',');
		return result;
	});
	return data;
};
