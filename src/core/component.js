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
        listeners: {
            onCreate: {
                func: "sisiliano.component.onTemplateChange",
                args: ["{that}", "{that}.options.template"]
            },
            onReady: [
                {
                    func: "{that}.events.onColorChange.fire",
                    args: ["{that}", "{that}.model.color"]
                }
            ]
        }
    });

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