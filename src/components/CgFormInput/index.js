export const CgFormInputModeInsert = "CgFormInputModeInsert"
export const CgFormInputModeEdit = "CgFormInputModeEdit"
export const CgFormInputModeCopy = "CgFormInputModeCopy"
export const CgFormInputModeView = "CgFormInputModeView"

import jsb from "@sandwich-go/jsb";

export function calcLabelWidth(schema) {
    let longestTextWidth = jsb.longestTextWidth(schema.map(function (element) {
        return `${element.name}`;
    }))
    const extraWidth = new Map();
    for (const item of schema) {
        if (item['tips']) {
            extraWidth.set("tips", true)
        }
        if (item['required']) {
            extraWidth.set("required", true)
        }
    }
    return `${longestTextWidth + extraWidth.size * 20}px`
}