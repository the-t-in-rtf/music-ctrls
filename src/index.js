(function (fluid) {
    "use strict";

    fluid.registerNamespace("sisiliano");

    sisiliano.templates = htmlTempl.templates;



    fluid.registerNamespace("sisiliano.util");
    sisiliano.util.templateCache = {};
    sisiliano.util.getTemplate = function (callback, url) {
        var template = sisiliano.util.templateCache[url];
        if (!template) {
            var source = htmlTempl.templates[url];
            template = Handlebars.compile(source);
            sisiliano.util.templateCache[url] = template;
            callback(template);
        } else {
            callback(template);
        }
    };

    sisiliano.util.addClass = function(elm, className) {
        sisiliano.util.removeClass(elm, className);
        var oldClass = $(elm).attr("class");
        var newClass = oldClass + " " + className;
        $(elm).attr("class", newClass);
    };

    sisiliano.util.removeClass = function(elm, className) {
        var oldClass = $(elm).attr("class");
        var newClass = oldClass.replace(new RegExp(" " + className, "g"), "").replace(new RegExp(className, "g"), "");
        $(elm).attr("class", newClass);
    };

    sisiliano.util.getAngle = function(center, point) {
        var angle = Math.atan(Math.abs((point.x - center.x) / (point.y - center.y))) / (2 * Math.PI);
        if (center.x > point.x) {
            if (center.y > point.y) {
                angle = 0.5 - angle;
            }
        } else {
            if (center.y < point.y) {
                angle = 0.5 - angle;
            }

            angle += 0.5;
        }

        return angle;
    };

    sisiliano.util.isInsideTheCircle = function(center, radius, point) {
        var distanceFromTheCenter = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
        return distanceFromTheCenter <= radius;
    };

    fluid.defaults("sisiliano.util.ariaDescription", {
        gradeNames: "fluid.component",
        ariaDescription: "",
        listeners: {
            onCreate: {
                func: "sisiliano.util.ariaDescription.onCreate",
                args: ["{that}"]
            }
        }
    });

    sisiliano.util.ariaDescription.onCreate = function (that) {
        var descriptionsPane = $("#sisiliano-component-guide-descriptions");
        if (descriptionsPane.length === 0) {
            descriptionsPane = $("<div id='sisiliano-component-guide-descriptions' style='visibility: hidden'></div>");
            $("body").append(descriptionsPane);
        }

        var descriptionElementIdOfTheComponent = (that.typeName.replace(/\./g, "-") + "-guide-description").toLowerCase();
        var descriptionElementOfTheComponent = $("#" + descriptionElementIdOfTheComponent);
        if (descriptionElementOfTheComponent.length === 0) {
            descriptionElementOfTheComponent = $("<div id='" + descriptionElementIdOfTheComponent + "'>" + that.options.ariaDescription + "</div>");
            descriptionsPane.append(descriptionElementOfTheComponent);
        }

        that.container.attr("aria-describedby", descriptionElementIdOfTheComponent);
    };
})(fluid);
