/**
 * Created by VDESIDI on 7/23/2016.
 */
(function (fluid) {
    "use strict";
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
