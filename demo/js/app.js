/**
 * Created by VDESIDI on 7/29/2016.
 */

(function (fluid, $) {
    "use strict";

    fluid.defaults("fluid.routeComponent", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            hash: "",
            contentCache: {}
        },
        listeners: {
            onCreate: [
                {
                    func: "fluid.routeComponent.appendListeners",
                    args: ["{that}"]
                }
            ]
        },
        modelListeners: {
            hash: {
                func: "fluid.routeComponent.onHashChange",
                args: ["{that}", "{that}.model.hash"]
            }
        },
        allowedUrls: [],
        defaultUrl: "",
        routeTriggers: []
    });

    fluid.routeComponent.appendListeners = function (that) {
        fluid.each(that.options.routeTriggers, function (selector) {
            $(selector).on("click", function () {
                that.applier.change("hash", $(this).attr("href"));
            });
        });
    };

    fluid.routeComponent.onHashChange = function (that, hash) {
        var url = that.options.allowedUrls[hash];
        if (!url) {
            url = that.options.defaultUrl;
        }

        var key = (url).replace(/\./g, "-");
        if (that.model.contentCache[key]) {
            that.container.html(that.model.contentCache[key]);
        } else {
            $.get(url, {}, function (content) {
                that.applier.change("contentCache." + key, content);
                that.container.html(content);
            });
        }
    };

    fluid.routeComponent(".content-pane", {
        allowedUrls: {
            "#controllers/": "./pages/introduction.html",
            "#controllers/piano/": "./pages/controllers/piano.html",
            "#controllers/sliders/knob/": "./pages/controllers/sliders/knob.html",
            "#controllers/sliders/linear-slider/": "./pages/controllers/sliders/linear-slider.html"
        },
        defaultUrl: "./pages/introduction.html",
        routeTriggers: [
            ".demo-link"
        ],
        model: {
            hash: window.location.hash
        }
    });
})(fluid, $);