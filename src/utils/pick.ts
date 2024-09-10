/**
 * Create an object composed of the picked object properties
 * @param object
 * @param keys
 * @returns object
 */
const pick = (object:{[key:string]:unknown}, keys: string[]) => {
  return keys.reduce((obj:{[key:string]:unknown}, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
