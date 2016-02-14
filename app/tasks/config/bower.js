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
                      './jqwidgets/styles/jqx.ui-sunny.css',
                      './jqwidgets/styles/images/**',
                      './jqwidgets/jqxcore.js',
                      './jqwidgets/jqxdata.js',
                      './jqwidgets/jqxbuttons.js',
                      './jqwidgets/jqxscrollbar.js',
                      './jqwidgets/jqxlistbox.js',
                      './jqwidgets/jqxdropdownlist.js',
                      './jqwidgets/jqxmenu.js',
                      './jqwidgets/jqxgrid.js',
                      './jqwidgets/jqxgrid.pager.js',
                      './jqwidgets/jqxgrid.sort.js',
                      './jqwidgets/jqxgrid.filter.js',
                      './jqwidgets/jqxgrid.storage.js',
                      './jqwidgets/jqxgrid.columnsresize.js',
                      './jqwidgets/jqxgrid.columnsreorder.js',
                      './jqwidgets/jqxgrid.selection.js',
                      './jqwidgets/jqxpanel.js',
                      './jqwidgets/jqxcheckbox.js',
                      './jqwidgets/jqxangular.js'
                  ],
                  'images_dest': '.tmp/public/styles',
                   expand: false,
                   keepExpandedHierarchy: true,
              }
          }
        }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};