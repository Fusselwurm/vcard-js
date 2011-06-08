/**
 * what do I want?
 *
 * create a file from data
 *
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
 * @param data hash (object) with properties: group, name, param, value,
 */
exports.createFromData = function (data) {
	return {
		getData: function () {
			return data;
		},
		getProperty: function (name) {
			return data[name];
		},
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
 * @param data (string) vcard contents
 */
exports.createFromVCard = function (data) {

};
