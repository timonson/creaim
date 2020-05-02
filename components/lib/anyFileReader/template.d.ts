/**
 * @type { {
 * render: (opts?: { label: string  }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { label: string  }) => string
 * } }
 */
export const Template: {
    render: (opts?: {
        label: string;
    }) => string;
    getHtml: (opts?: {
        [key: string]: any;
    }) => string;
    getCss: (opts?: {
        label: string;
    }) => string;
};
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
declare function getHtml(opts?: {
    [key: string]: any;
}): string;
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
declare function getCss(opts?: {
    [key: string]: any;
}): string;
export {};
