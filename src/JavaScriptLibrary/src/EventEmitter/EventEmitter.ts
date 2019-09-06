export type EventEmitterListener<V> = (value: V) => void;

export class EventEmitter<T = string, V = any> {
  public listeners = new Map<T, EventEmitterListener<V>[]>();

  /**
   * Add a function to be called when a specific type of event is emitted.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */
  public addEventListener(type: T, listener: EventEmitterListener<V>) {
    const listeners = this.listeners.get(type) || [];

    this.listeners.set(type, [...listeners, listener]);
  }

  /**
   * Add a function to be called when a specific type of event is emitted.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */
  public on(type: T, listener: EventEmitterListener<V>) {
    this.addEventListener(type, listener);
  }

  /**
   * Remove an event listener that was previously added.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */
  public removeEventListener(type: T, listener: EventEmitterListener<V>) {
    const listeners = this.listeners.get(type) || [];

    this.listeners.set(type, listeners.filter(l => l !== listener));
  }

  /**
   * Remove an event listener that was previously added.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */
  public off(type: T, listener: EventEmitterListener<V>) {
    this.removeEventListener(type, listener);
  }

  /**
   * Emit an event of specific type, and supply what value to pass to the
   * listener.
   *
   * @param {T} type
   * @param {V} event
   * @returns
   * @memberof EventEmitter
   */
  public emit(type: T, value: V) {
    const listeners = this.listeners.get(type);

    if (!listeners) return;

    listeners.forEach(listener => {
      listener(value);
    });
  }
}
