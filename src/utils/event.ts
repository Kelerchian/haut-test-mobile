export namespace SimpleEvent {
  type Listener<T> = (t: T) => unknown;

  export const make = <T extends unknown = void>() => {
    const subscribers = new Set<Listener<T>>();

    const subscribe = (fn: Listener<T>) => {
      subscribers.add(fn);
      return () => unsubscribe(fn);
    };

    const unsubscribe = (fn: Listener<T>) => {
      subscribers.delete(fn);
    };

    const clear = () => {
      subscribers.clear();
    };

    const publish = (t: T) =>
      Array.from(subscribers).forEach((listener) => {
        listener(t);
      });

    return {
      subscribe,
      unsubscribe,
      clear,
      publish,
    };
  };
}
