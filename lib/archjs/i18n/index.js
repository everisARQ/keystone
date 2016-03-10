var i18n = require('i18n');
var path = require('path');
var assign = require('object-assign');

const DEFAULT_OPTS = {
	locales: ['en'],
	defaultLocale: 'en',
	cookie: 'language',
	queryParameter: 'lang',
	updateFiles: false
};

module.exports = function (keystone) {
	var languageOptions = keystone.get('language options');
	languageOptions = (languageOptions !== undefined && !languageOptions.disable) ? languageOptions : {};

	var i18nOptions = assign({
		locales: languageOptions['supported languages'] || DEFAULT_OPTS.locales,
		cookie: languageOptions['language cookie'] || DEFAULT_OPTS.cookie,
		queryParameter: languageOptions['language query name'] || DEFAULT_OPTS.queryParameter,
		register: keystone,
	}, keystone.get('i18n options') || {});

	if (i18nOptions.defaultLocale !== undefined && i18nOptions.locales.indexOf(i18nOptions.defaultLocale) === -1) {
		throw new Error('Default locale "' + i18nOptions.defaultLocale + '" is not within supported locales [' + i18n.getLocales() + ']');
	}

	i18n.configure(i18nOptions);

	return i18n.init;
};
