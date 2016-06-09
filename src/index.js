(function (fluid) {
    "use strict";

    fluid.registerNamespace("fluid.sisiliano");

    fluid.sisiliano.templates = htmlTempl.templates;



    fluid.registerNamespace("fluid.sisiliano.util");
    fluid.sisiliano.util.templateCache = {};
    fluid.sisiliano.util.getTemplate = function (callback, url) {
        var template = fluid.sisiliano.util.templateCache[url];
        if (!template) {
            var source = htmlTempl.templates["src/controllers/piano/piano.html"];
            template = Handlebars.compile(source);
            fluid.sisiliano.util.templateCache[url] = template;
            callback(template);
        } else {
            callback(template);
        }
    };

    fluid.sisiliano.util.addClass = function(elm, className) {
        fluid.sisiliano.util.removeClass(elm, className);
        var oldClass = $(elm).attr("class");
        var newClass = oldClass + " " + className;
        $(elm).attr("class", newClass);
    };

    fluid.sisiliano.util.removeClass = function(elm, className) {
        var oldClass = $(elm).attr("class");
        var newClass = oldClass.replace(new RegExp(" " + className, "g"), "").replace(new RegExp(className, "g"), "");
        $(elm).attr("class", newClass);
    };

    fluid.sisiliano.util.getAngle = function(center, point) {
        var angle = (Math.atan(Math.pow(point.x - center.x, 2) / Math.pow(point.y - center.y, 2)) /Math.PI);
        if (center.x > point.x) {
            if (center.y > point.y) {
                angle = 1 - angle;
            }
        } else {
            if (center.y < point.y) {
                angle = 1 - angle;
            }

            angle += 1;
        }

        return angle;
    };

    fluid.sisiliano.util.isInsideTheCircle = function(center, radius, point) {
        var distanceFromTheCenter = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
        return distanceFromTheCenter <= radius;
    };
})(fluid);
