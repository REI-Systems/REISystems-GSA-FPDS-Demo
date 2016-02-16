/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 *
 * For more information see:
 *   https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  // !! Dependencies should primarily be handled by Bower
  // !! Angular is preloaded here to avoid modules loading first
  'js/dependencies/jquery/**/*.js',
  'js/dependencies/angular/angular.js',
  'js/dependencies/spin.js/spin.js',
  'js/dependencies/angular-spinner/angular-spinner.js',
  'js/dependencies/angular/**/*.js',
  'js/dependencies/jqwidgets/jqxcore.js',
  'js/dependencies/jqwidgets/jqxdata.js',
  'js/dependencies/jqwidgets/jqxbuttons.js',
  'js/dependencies/jqwidgets/jqxscrollbar.js',
  'js/dependencies/jqwidgets/jqxdropdownlist.js',
  'js/dependencies/jqwidgets/jqxmenu.js',
  'js/dependencies/jqwidgets/jqxgrid.js',
  'js/dependencies/jqwidgets/jqxgrid.pager.js',
  'js/dependencies/jqwidgets/jqxgrid.sort.js',
  'js/dependencies/jqwidgets/jqxgrid.filter.js',
  'js/dependencies/jqwidgets/jqxgrid.storage.js',
  'js/dependencies/jqwidgets/jqxgrid.columnsresize.js',
  'js/dependencies/jqwidgets/jqxgrid.columnsreorder.js',
  'js/dependencies/jqwidgets/jqxgrid.selection.js',
  'js/dependencies/jqwidgets/jqxpanel.js',
  'js/dependencies/jqwidgets/jqxcheckbox.js',
  'js/dependencies/jqwidgets/jqxtabs.js',
  'js/dependencies/jqwidgets/jqxlistbox.js',
  'js/dependencies/jqwidgets/jqxangular.js',
  'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];







// Default path for public folder (see documentation for more information)
var tmpPath = '.tmp/public/';

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(cssPath) {
  return require('path').join('.tmp/public/', cssPath);
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(jsPath) {
  return require('path').join('.tmp/public/', jsPath);
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(tplPath) {
  return require('path').join('assets/',tplPath);
});


