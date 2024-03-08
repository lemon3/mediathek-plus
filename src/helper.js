/**
 * checks if the given parameter is a function
 * @param  {any} fun - The parameter to test.
 * @return {boolean} true if it is a function and false if not.
 */
export const isFunction = (fun) => !!fun && 'function' === typeof fun;

/**
 * wrap a given HTML object with another
 * @param  {object} el - HTML object to wrap
 * @param  {object} wrapper - HTML object that should wrap the el
 * @return {any} The wrapper object containing the el or false if there was an error
 */
export const wrap = (el, wrapper) => {
  if (undefined === el) {
    return false;
  }

  // make array
  if (undefined === el[0]) {
    el = [el];
  }

  const first = el[0];

  // add element to dom
  first.parentNode.insertBefore(wrapper, first);

  el.forEach((elem) => {
    wrapper.appendChild(elem);
  });
  return wrapper;
};

/**
 * add properties and style attributes to a given HTML object
 * @param  {object} el - The HTML object to add properties and styles too.
 * @param  {object} properties - An object with vaild HTML properties
 * @param  {object} style - An object with valid CSS styles
 * @return {object} HTML object with the applied properties and styles
 */
export const addProps = (el, properties, style) => {
  if (properties) {
    for (let prop in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, prop)) {
        el.setAttribute(prop, properties[prop]);
      }
    }
  }
  if (style) {
    for (let s in style) {
      if (Object.prototype.hasOwnProperty.call(style, s)) {
        el.style[s] = style[s];
      }
    }
  }
  return el;
};

/**
 * Helper for creating an HTML object
 * @param  {string} el - The tag-name for an HTML object, eg.: 'div'
 * @param  {objet} properties - An Object with valid HTML properties
 * @param  {objet} style - An Object with valid style definitions
 * @return {object} The created element with applied properties and styles
 */
export const createEl = (el, properties, style) =>
  addProps(document.createElement(el), properties, style);

export const enableConsole = (name = 'cs', context = window) => {
  var theFrame = document.createElement('iframe');
  theFrame.src = 'about:blank';
  theFrame.style.display = 'none';
  document.body.appendChild(theFrame);
  const cw = theFrame.contentWindow.console;
  return (context[name] = cw);
};

export class Storage {
  constructor() {}

  get(name, value) {
    let ls = localStorage.getItem(name);
    if (!ls) {
      return false;
    }
    let data = JSON.parse(ls);
    if (value) {
      return data[value];
    }
    return data;
  }

  set(name, data) {
    const current = this.get(name) || {};
    // extend
    const extendedData = { ...current, ...data };
    let str = JSON.stringify(extendedData);
    localStorage.setItem(name, str);
  }
}
