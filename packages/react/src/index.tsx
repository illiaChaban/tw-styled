export * from "./style-fn";
export * from "./styled";
export * from "../../shared/merge-classes";
export * from "./with-style";

/**
 * 
 * @ settings.json for autocomplete & lint for TW extension
 * 
 *     "tailwindCSS.classAttributes": [
        "class",
        "className",
        "ngClass",
    ],
    "tailwindCSS.experimental.classRegex": [
        "tw`([^`]*)", // tw`...`
        // "tw\\.[^`]+`([^`]*)`", // tw.xxx<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        "tw\\(.*?\\)(?:<.*?>)?`([^`]*)`" // tw(Component)<xxx>`...`
    ]
 */
