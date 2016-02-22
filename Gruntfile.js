module.exports = function(grunt){
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
        main: {
          files: [
            {expand: true, cwd: 'client/img' ,src: ['**'], dest: 'build/client/img'},
            {expand: true, cwd: 'client/js',  src: ['**/*.html'], dest: 'build/client/js/'},
            {expand: true, cwd: 'client/app',  src: ['**/*.html'], dest: 'build/client/app/'},
            {expand: true, cwd: 'client/site',  src: ['**'], dest: 'build/client/site/'},
            {expand: true, cwd: 'client/resources', src: ['**/*'], dest: 'build/client/resources/'},
            {src: ['server/**/*'], dest: 'build/'},
            {src: ['server.js','package.json'], dest: 'build/'}
            
          ],
        },
      },
      uglify: {
          options: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %>  <%= grunt.template.today("yyyy-mm-dd")%>\n <%= pkg.description %>\n by <%= pkg.author %> */\n'
          },
        	all: {
              files: [
                  {expand: true,cwd: 'client/app',src: ['**/*.js','!*.min.js'],dest: 'build/client/app',ext: '.min.js'},
                  {expand: true,cwd: 'client/js',src: ['**/*.js','!*.min.js'],dest: 'build/client/js',ext: '.min.js'}
                ]
          }
      },
      less: {
        development: {
          options: {
            compress: true,
            yuicompress: true,
            optimization: 2
          },
          files: {
            "build/client/css/style.css": "client/less/**/*.less"
          }
        }
      },
      jshint: {
        files: ['client/js/**/*.js', 'client/test/**/*.js','server/**/*.js'],
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      clean: ["build"],
      watch: {
        files: ['Gruntfile.js','client/less/**/*.less','client/js/**/*.js','client/app/**/*.js', '!*.min.js','server.js','server/**/*.js'],
        tasks: ['clean','jshint','less','uglify','copy']
      }
  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('build', ['clean','jshint', 'less','uglify','copy']);
  grunt.registerTask('default', ['build','watch']);
};