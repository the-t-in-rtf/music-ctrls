/**
 * Created by VDESIDI on 5/1/2016.
 */

(function(config, fluid, $) {
  var elementName = "piano";

  fluid.defaults("fluid." + config.frameworkName + "." + elementName, {
    gradeNames: ["fluid.viewComponent", "autoInit", "fluid.eventedComponent"],
    preInitFunction: "fluid." + config.frameworkName + "." + elementName + ".preInitFunction",
    postInitFunction: "fluid." + config.frameworkName + "." + elementName + ".postInitFunction",
    model: {
      color: "#009688"
    },
    events: {
      change: null,
      onChange: null,
      onClick: null
    }
  });

  fluid[config.frameworkName][elementName].preInitFunction = function (that) {
    that.container.html(htmlTempl.templates["src/templates/piano.html"]);
  };

  fluid[config.frameworkName][elementName].postInitFunction = function (that) {
    function updateValue(model) {
    }

    function validateOptions(options, input) {
      for (var key in options) {
        if (input[key] !== undefined) {
          options[key] = input[key];
        }
      }
    }

    validateOptions(that.model, that.options);
  };

})(config, fluid, $);