export { isHTMLElement, convertDashToCamel, convertCamelToDash, coupleSettersAndGettersToAttributes, makeElementEditableSanely, findElementInEventPath, changeCss, loadCss, };
declare function isHTMLElement(element: unknown): element is HTMLElement;
declare function convertDashToCamel(str: string): string;
declare function convertCamelToDash(str: string): string;
declare function coupleSettersAndGettersToAttributes(thisObj: HTMLElement, camelCasePropsAsStrings: string[]): void;
declare function makeElementEditableSanely(element: HTMLElement, callback?: (element: HTMLElement) => void): void;
declare function findElementInEventPath(event: Event, searchTag: string): HTMLElement | null;
declare function loadCss(path: string, target?: HTMLHeadElement): Promise<unknown>;
declare function changeCss(element: Element, cssMap: [string, string][]): void;
