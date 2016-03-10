var checks;

var exitCodes = {
	NODE_VERSION_UNSUPPORTED: 231,
};

checks = {
	check: function check () {
		this.nodeVersion();
	},

	// Make sure the node version is supported
	nodeVersion: function checkNodeVersion (packagePath) {

		var packages = require(packagePath);

		// Tell users if their node version is not supported, and exit
		var semver = require('semver');

		if (!semver.satisfies(process.versions.node, packages.engines.node)) {
			console.error('\u001b[31mERROR: Unsupported version of Node');
			console.error('\u001b[31mkeystonejs-portal needs Node version ' + packages.engines.node
				+ ' you are using version ' + process.versions.node + '\u001b[0m\n');
			console.error('\u001b[32mPlease use some of this versions: ' + packages.engines.node + '\u001b[0m');

			process.exit(exitCodes.NODE_VERSION_UNSUPPORTED);
		}
	},
};

module.exports = checks;
