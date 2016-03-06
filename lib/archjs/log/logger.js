var keystone = require('../../../');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

// Powered by https://github.com/winstonjs/winston
var winston = require('winston');

var mailPath = keystone.get('email locals');

//
// Logging levels
//
var config = {
	levels: {
		error: 0,
		debug: 1,
		warn: 2,
		data: 3,
		info: 4,
		verbose: 5,
		silly: 6,
		custom: 7
	},
	colors: {
		error: 'red',
		debug: 'blue',
		warn: 'yellow',
		data: 'grey',
		info: 'green',
		verbose: 'cyan',
		silly: 'magenta',
		custom: 'white'
	}
};

var timestamp = function() {
	return moment().format();
};

var colorizedFormatter = function(options) {
	return winston.config.colorize(options.level, mailPath + '[' + options.timestamp() + '] ') +
		winston.config.colorize(options.level, options.level.toUpperCase() + ' ') +
		(undefined !== options.message ? winston.config.colorize(options.level, options.message) : '') +
		(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
};

var formatter = function(options) {
	return mailPath + '[' + options.timestamp() + '] ' +
		options.level.toUpperCase() + ' ' +
		(undefined !== options.message ? options.message : '') +
		(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
};
var logDir = __dirname + '../../../../../../log';

var logFile = path.join(logDir, 'logfile.log');
var exceptionFile = path.join(logDir, 'exceptions.log');

module.exports = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			colorize: true,
			level: 'custom',
			timestamp: timestamp,
			formatter: colorizedFormatter
		}),
		new (winston.transports.File)({
			filename: logFile,
			level: 'custom',
			json: false,
			logstash: false,
			timestamp: timestamp,
			formatter: formatter
		})
	],
	exceptionHandlers: [
		new (require('winston-daily-rotate-file'))({
			filename: exceptionFile,
			level: 'custom',
			timestamp: timestamp,
			formatter: formatter
		})
	],
	levels: config.levels,
	colors: config.colors
});
