import * as jabra from "./core";

describe("CoreEventHandling", () => {
    it("Can identify array arguments", () => {
        let events = jabra._getEvents(["device attached", "device detached"]);
        expect(events.length).toBe(2);
    });
  });