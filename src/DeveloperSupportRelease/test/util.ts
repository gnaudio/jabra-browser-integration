/**
 * For type-safe string name lookup of properties/method names.
 * 
 * @internal 
 * @hidden
 */
export const nameof = <T>(name: keyof T) => name;
