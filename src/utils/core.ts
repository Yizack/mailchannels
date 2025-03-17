/**
 * Creates instances of an array of classes with the same constructor signature.
 */
export const createInstances = <K, T extends (new (signature: K) => object)[]>(
  signature: K,
  instances: readonly [...T]
) => {
  return instances.map((Instance) => new Instance(signature)) as { [K in keyof T]: InstanceType<T[K]> };
};

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

/**
 * Extracts all methods from an array of class instances.
 */
export const extractMethods = <T extends object[]>(instances: T) => {
  const methods = {} as UnionToIntersection<{ [K in keyof T]: Pick<T[K], keyof T[K]> }[number]>;
  for (const instance of instances) {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
    for (const method of names) {
      if (method === "constructor") continue;
      const methodName = method as keyof typeof instance;
      const methodFn = instance[methodName] as unknown as Function;
      if (typeof methodFn !== "function") continue;
      (methods as Record<string, Function>)[method] = methodFn.bind(instance);
    }
  }
  return methods;
};
