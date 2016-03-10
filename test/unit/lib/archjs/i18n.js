var sinon = require('sinon');
var assign = require('object-assign');
var must = require('must');
var path = require('path');

function noop () {
}

function mockRequest (acceptLanguage, storedLanguage) {
	var args = [].slice.call(arguments);
	var options = typeof args[0] === 'object' ? args[0] : {};

	if (Object.keys(options).length) {
		acceptLanguage = options.acceptLanguage;
	}

	return assign({
		locals: {},
		headers: {
			'accept-language': acceptLanguage
		},
		cookies: {
			language: storedLanguage
		},
		query: {},
		cookie: noop()
	}, options);
};

function mockResponse () {
	return {
		redirect: sinon.spy(),
		cookie: sinon.spy()
	};
}

function keystoneOptions (options) {
	options = assign({}, options);
	return {
		get: function (key) {
			return options[key];
		}
	};
}

describe('i18n', function () {


	i18n = undefined;

	beforeEach(function () {
		i18n = require('../../../../lib/archjs/i18n');
	});

	afterEach(function () {
		delete i18n;
	});

	it('should be configured with default options', function () {
		var keystone = keystoneOptions({'i18n': true});

		must(keystone.getLocales).be.undefined();

		var middleware = i18n(keystone);

		must(keystone.getLocales).be.a.function();
		must(keystone.getLocales()).not.be.empty();
		must(keystone.getLocales()).must.eql(['en']);

		middleware(mockRequest(), mockResponse(), noop());

		must(keystone.getLocale()).must.eql('en');
	});

	it('should be configured with keystone "language options" property', function () {
		var keystone = keystoneOptions({
			'language options': {
				'supported languages': ['en', 'es']
			},
			'i18n': true
		});

		var middleware = i18n(keystone);

		must(keystone.getLocales()).not.be.empty();
		must(keystone.getLocales()).must.eql(['en', 'es']);

		middleware(mockRequest(), mockResponse(), noop());

		must(keystone.getLocale()).must.eql('en');
	});

	it('should be configured with keystone "i18n options" property', function () {
		var keystone = keystoneOptions({
			'i18n': true,
			'i18n options': {
				locales: ['en', 'es'],
				defaultLocale: 'es'
			}
		});

		var middleware = i18n(keystone);

		must(keystone.getLocales()).not.be.empty();
		must(keystone.getLocales()).must.eql(['en', 'es']);

		middleware(mockRequest(), mockResponse(), noop());

		must(keystone.getLocale()).must.eql('es');
	});

	it('"i18n options" should override "language options"', function () {

		var keystone = keystoneOptions({
			'language options': {
				'supported languages': ['en']
			},
			'i18n': true,
			'i18n options': {
				locales: ['en', 'es'],
				defaultLocale: 'es'
			}
		});

		var middleware = i18n(keystone);

		must(keystone.getLocales()).not.be.empty();
		must(keystone.getLocales()).must.eql(['en', 'es']);

		middleware(mockRequest(), mockResponse(), noop());

		must(keystone.getLocale()).must.eql('es');
	});

	it('should throw an error when the defaultLocale is not within supported locales', function () {

		var keystone = keystoneOptions({
			'language options': {
				'supported languages': ['en', 'es']
			},
			'i18n': true,
			'i18n options': {
				defaultLocale: 'ca'
			}
		});

		try {
			i18n(keystone);
			must.fail()
		} catch (err) {
			must(err.message).to.eql('Default locale "ca" is not within supported locales [en,es]');
		}
	});

});
