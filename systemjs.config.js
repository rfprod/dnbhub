/*
*	SystemJS configuration for Angular 6
*/
(function (global) { // eslint-disable-line no-unused-vars

	var paths = {
		'npm:': './node_modules/'
	};
	// packages locations
	var map = {
		'app': 																	'./public/app',

		'rxjs': 																'npm:rxjs/bundles/rxjs.umd.js',
		'rxjs/ajax': 														'npm:rxjs/ajax',
		'rxjs/operators': 											'npm:rxjs/operators',
		'rxjs/testing': 												'npm:rxjs/testing',
		'rxjs/util': 														'npm:rxjs/util',
		'rxjs/webSocket': 											'npm:rxjs/webSocket',
		'rxjs/internal': 												'npm:rxjs/internal',

		'tslib': 																'npm:tslib/tslib.js',
		'traceur': 															'npm:traceur/bin',
		'@angular/animations': 									'npm:@angular/animations/bundles/animations.umd.js',
		'@angular/animations/browser': 					'npm:@angular/animations/bundles/animations-browser.umd.js',
		'@angular/core': 												'npm:@angular/core/bundles/core.umd.js',
		'@angular/common': 											'npm:@angular/common/bundles/common.umd.js',
		'@angular/common/http': 								'npm:@angular/common/bundles/common-http.umd.js',
		'@angular/compiler': 										'npm:@angular/compiler/bundles/compiler.umd.js',
		'@angular/forms': 											'npm:@angular/forms/bundles/forms.umd.js',
		'@angular/http': 												'npm:@angular/http/bundles/http.umd.js',
		'@angular/platform-browser': 						'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
		'@angular/platform-browser/animations':	'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
		'@angular/platform-browser-dynamic': 		'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
		'@angular/router': 											'npm:@angular/router/bundles/router.umd.js',
		'@angular/flex-layout': 								'npm:@angular/flex-layout/bundles/flex-layout.umd.js',
		'@angular/flex-layout/core': 						'npm:@angular/flex-layout/bundles/flex-layout-core.umd.js',
		'@angular/flex-layout/extended': 				'npm:@angular/flex-layout/bundles/flex-layout-extended.umd.js',
		'@angular/flex-layout/flex': 						'npm:@angular/flex-layout/bundles/flex-layout-flex.umd.js',
		'@angular/flex-layout/server': 					'npm:@angular/flex-layout/bundles/flex-layout-server.umd.js',
		'@angular/flex-layout/grid': 						'npm:@angular/flex-layout/bundles/flex-layout-grid.umd.js',
		'@angular/material': 										'npm:@angular/material/bundles/material.umd.js',
		'@angular/cdk': 												'npm:@angular/cdk/bundles/cdk.umd.js',
		'@angular/cdk/a11y': 										'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
		'@angular/cdk/accordion': 							'npm:@angular/cdk/bundles/cdk-accordion.umd.js',
		'@angular/cdk/bidi': 										'npm:@angular/cdk/bundles/cdk-bidi.umd.js',
		'@angular/cdk/coercion': 								'npm:@angular/cdk/bundles/cdk-coercion.umd.js',
		'@angular/cdk/collections': 						'npm:@angular/cdk/bundles/cdk-collections.umd.js',
		'@angular/cdk/keycodes': 								'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
		'@angular/cdk/layout': 									'npm:@angular/cdk/bundles/cdk-layout.umd.js',
		'@angular/cdk/observers': 							'npm:@angular/cdk/bundles/cdk-observers.umd.js',
		'@angular/cdk/overlay': 								'npm:@angular/cdk/bundles/cdk-overlay.umd.js',
		'@angular/cdk/platform': 								'npm:@angular/cdk/bundles/cdk-platform.umd.js',
		'@angular/cdk/portal': 									'npm:@angular/cdk/bundles/cdk-portal.umd.js',
		'@angular/cdk/rxjs': 										'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
		'@angular/cdk/scrolling': 							'npm:@angular/cdk/bundles/cdk-scrolling.umd.js',
		'@angular/cdk/stepper': 								'npm:@angular/cdk/bundles/cdk-stepper.umd.js',
		'@angular/cdk/table': 									'npm:@angular/cdk/bundles/cdk-table.umd.js',
		'@angular/cdk/text-field': 							'npm:@angular/cdk/bundles/cdk-text-field.umd.js',
		'@angular/cdk/tree': 										'npm:@angular/cdk/bundles/cdk-tree.umd.js',
		'@angular/material-moment-adapter': 		'npm:@angular/material-moment-adapter/bundles/material-moment-adapter.umd.js',
		'moment': 															'npm:moment/min/moment-with-locales.min.js' // reconfig reference: https://github.com/angular/material2/commit/9545427c73627f0cf91b5086efd5d727459fc44f
	};
	// how to load packages
	var packages = {
		'app': 													{ main: 'app', defaultExtension: 'js' },
		'traceur': 											{ main: 'traceur', defaultExtension: 'js' },

		'rxjs/ajax': 										{ main: 'index', defaultExtension: 'js' },
		'rxjs/operators': 							{ main: 'index', defaultExtension: 'js' },
		'rxjs/testing': 								{ main: 'index', defaultExtension: 'js' },
		'rxjs/util': 										{ main: 'index', defaultExtension: 'js' },
		'rxjs/webSocket': 							{ main: 'index', defaultExtension: 'js' },
		'rxjs/internal': 								{ main: 'Rx', defaultExtension: 'js' }
	};

	var config = {
		paths: paths,
		map: map,
		packages: packages
	};

	System.config(config);

})(this);
