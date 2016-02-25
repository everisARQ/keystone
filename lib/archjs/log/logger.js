var winston = require('winston');
var moment = require('moment');

module.exports = new (winston.Logger)({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({
			timestamp: function() {
				return moment().format();
			},
			formatter: function(options) {
				// Return string will be passed to logger.
				return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
					(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
			}
		})
		//new (winston.transports.File)({ filename: 'somefile.log' })
	]
});
