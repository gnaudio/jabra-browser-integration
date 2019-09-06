import { EventEmitter } from "./EventEmitter";

describe("EventEmitter as instance", () => {
  it("properly created new EventEmitter", () => {
    const eventEmitter = new EventEmitter();

    expect(eventEmitter).toBeInstanceOf(EventEmitter);
    expect(eventEmitter).toHaveProperty("addEventListener");
    expect(eventEmitter).toHaveProperty("removeEventListener");
    expect(eventEmitter).toHaveProperty("on");
    expect(eventEmitter).toHaveProperty("off");
    expect(eventEmitter).toHaveProperty("emit");
  });

  it("allows a class to extend it", () => {
    class Foo extends EventEmitter {}

    const foo = new Foo();

    expect(foo).toBeInstanceOf(EventEmitter);
    expect(foo).toHaveProperty("addEventListener");
    expect(foo).toHaveProperty("removeEventListener");
    expect(foo).toHaveProperty("on");
    expect(foo).toHaveProperty("off");
    expect(foo).toHaveProperty("emit");
  });

  it("properly adds event listener", () => {
    const events = new EventEmitter();

    const listener1 = (event: any) => {};
    const listener2 = (event: any) => {};

    events.addEventListener("foo", listener1);

    // @ts-ignore
    expect(events.listeners.has("foo")).toBe(true);
    // @ts-ignore
    expect(events.listeners.get("foo").length).toBe(1);

    events.addEventListener("foo", listener2);

    // @ts-ignore
    expect(events.listeners.get("foo").length).toBe(2);
    // @ts-ignore
    expect(events.listeners.get("foo")[0]).toBe(listener1);
    // @ts-ignore
    expect(events.listeners.get("foo")[1]).toBe(listener2);
  });

  it("properly removes event listener", () => {
    const events = new EventEmitter();

    const listener1 = (event: any) => {};
    const listener2 = (event: any) => {};

    events.addEventListener("foo", listener1);
    events.addEventListener("foo", listener2);
    events.removeEventListener("foo", listener1);

    // @ts-ignore
    expect(events.listeners.get("foo").length).toBe(1);
    // @ts-ignore
    expect(events.listeners.get("foo")[0]).toBe(listener2);
  });

  it("properly triggers event listener", () => {
    const events = new EventEmitter();

    let called = false;

    const listener = (event: string) => {
      called = true;

      expect(event).toBe("test");
    };

    events.addEventListener("foo", listener);
    events.emit("foo", "test");

    expect(called).toBe(true);
  });
});
