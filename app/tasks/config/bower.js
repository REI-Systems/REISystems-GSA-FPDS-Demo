module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
        dest: '.tmp/public',
        js_dest: '.tmp/public/js/dependencies',
        css_dest: '.tmp/public/styles',
        fonts_dest: '.tmp/public/fonts/',
        options: {
          expand: true,
          keepExpandedHierarchy: false,
          ignorePackages: ['bootstrap-sass-official'],
          packageSpecific: {
              'jqwidgets': {
                  files: [
                      './jqwidgets/styles/jqx.base.css',
                      './jqwidgets/jqxcore.js',
                      './jqwidgets/jqxdata.js',
                      './jqwidgets/jqxbuttons.js',
                      './jqwidgets/jqxcheckbox.js',
                      './jqwidgets/jqxgrid.js',
                      './jqwidgets/jqxgrid.selection.js',
                      './jqwidgets/jqxmenu.js',
                      './jqwidgets/jqxscrollbar.js',
                      './jqwidgets/jqxgrid.sort.js',
                      './jqwidgets/jqxgrid.columnsresize.js',
                      './jqwidgets/jqxangular.js'
                  ]
              }
          }
        }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};