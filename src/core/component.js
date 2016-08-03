/**
 * Created by VDESIDI on 7/23/2016.
 */
(function (fluid) {
    "use strict";
    
    fluid.defaults("sisiliano.component", {
        gradeNames: ["sisiliano.util.colorable", "sisiliano.util.ariaDescription", "fluid.viewComponent"],
        model: {
            template: ""
        },
        events: {
            onReady: null
        },
        selectors: {
            svg: "svg"
        },
        listeners: {
            onCreate: [
                {
                    func: "sisiliano.component.onTemplateChange",
                    args: ["{that}", "{that}.options.template"]
                },
                {
                    func: "sisiliano.component.onInit",
                    args: ["{that}"]
                }
            ],
            onReady: [
                {
                    func: "{that}.events.onColorChange.fire",
                    args: ["{that}", "{that}.model.color"]
                }
            ]
        }
    });

    sisiliano.component.onInit = function (that) {
        that.container.attr("tabindex", 0);
        that.container.addClass("sisiliano");

        //A fix for https://github.com/dinukadesilva/music-ctrls/issues/59
        that.locate("svg").mousedown(function (evt) {
            evt.preventDefault();
            that.container.focus();
        });
    };

    sisiliano.component.onTemplateChange = function (that, template) {
        if (!template) {
            that.events.onReady.fire();
        } else {
            that.applier.change("id", "fluid-sisiliano-id-" + that.id);
            sisiliano.util.getTemplate(function (template) {
                var html = template(that.model);
                that.container.html(html);
                that.events.onReady.fire();
            }, template);
        }
    };
})(fluid);