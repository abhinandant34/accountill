import {ACCOUNT_NAMES} from "../actions/constants";
import React from "react";

export function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function toOptions(options) {
    return options.map((option) => {
        return <option value={option}>{option}</option>;
    })
}
