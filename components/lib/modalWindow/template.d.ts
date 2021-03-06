/**
 * @type { {
 * render: (opts?: { padding?:string, width?:string }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { padding?:string, width?:string }) => string
 * } }
 */
export const Template: {
    render: (opts?: {
        padding?: string;
        width?: string;
    }) => string;
    getHtml: (opts?: {
        [key: string]: any;
    }) => string;
    getCss: (opts?: {
        padding?: string;
        width?: string;
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
