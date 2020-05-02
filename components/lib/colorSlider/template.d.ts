/**
 * @type { {
 * render: (opts: { rotation: string | number }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts: { rotation: string | number }) => string
 * } }
 */
export const Template: {
    render: (opts: {
        rotation: string | number;
    }) => string;
    getHtml: (opts?: {
        [key: string]: any;
    }) => string;
    getCss: (opts: {
        rotation: string | number;
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
