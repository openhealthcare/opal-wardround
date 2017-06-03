module.exports = function(config){
  var opalPath = process.env.OPAL_LOCATION;
  var karmaDefaults = require(opalPath + '/opal/tests/js_config/karma_defaults.js');
  var baseDir = __dirname + '/..';
  var coverageFiles = [
    __dirname+'/../wardround/static/js/wardround/*.js',
    __dirname+'/../wardround/static/js/wardround/controllers/*.js',
    __dirname+'/../wardround/static/js/wardround/services/*.js'
  ];
    var includedFiles = [
      __dirname+'/../wardround/static/js/wardround/*.js',
      __dirname+'/../wardround/static/js/wardround/controllers/*.js',
      __dirname+'/../wardround/static/js/wardround/services/*.js',
      __dirname+'/../wardround/static/js/test/*.js',
  ];

  var defaultConfig = karmaDefaults(includedFiles, baseDir, coverageFiles);
  config.set(defaultConfig);
};
