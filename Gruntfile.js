module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		uglify: {
			all_src: {
				options: {
					sourceMap: true,
					sourceMapName: 'public/js/newterracotta.map'
				},
				src: 'public/js/dev/babel/*.js',
				dest: 'public/js/newterracotta.all.min.js'
			}
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files:[
					{
						expand: true,
						cwd: 'public/js/dev',
						src: ['*.js'],
						dest: 'public/js/dev/babel'
					}
				]
			}
		},
		clean: ['public/js/dev/babel']
	} );

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );

	// Default task(s).
	grunt.registerTask( 'default', ['babel', 'uglify', 'clean'] );

};