/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
export const Template: {
    render: (opts?: {
        [key: string]: any;
    }) => string;
    getCss: (opts?: {
        [key: string]: any;
    }) => string;
};
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
declare function getCss(opts?: {
    [key: string]: any;
}): string;
export {};
