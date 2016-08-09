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

    sisiliano.util.applyStyles = function (element, styles, restrictedStyles) {
        var stylesString = "";
        fluid.each(styles, function (value, key) {
            if (!restrictedStyles || restrictedStyles.indexOf(key.toLowerCase()) < 0) {
                stylesString += key + ":" + value + ";";
            }
        });
        element.attr("style", stylesString);
    };

    sisiliano.util.applyStylesToTheElement = function (element, styles, rules) {
        fluid.each(styles, function (value, key) {
            if (typeof value !== "object") {
                if (rules.attributes.indexOf(key) >= 0) {
                    if (key === "class") {
                        element.attr(key, element.attr(key) + " " + value);
                    } else {
                        element.attr(key, value);
                    }
                } else {
                    element.css(key, value);
                }
            }
        });

        if (styles.status) {
            var status = styles.status;
            if (typeof value !== "object") {
                status = [status];
            }

            fluid.each(status, function (statusKey) {
                sisiliano.util.applyStylesToTheElement(element, styles.statuses[statusKey], rules);
            });
        }
    };
})(fluid);
