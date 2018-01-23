import { addMilliseconds } from "date-fns";

import {
  calucluateDifference,
  realMillisToSimMillis,
  realSecondToSimMillis,
  simMinutesToRealSeconds,
  simMinuteToRealMillis
} from "./time";

describe("lets figure this out", () => {
  it("should be 1 sim minute", () => {
    expect(realMillisToSimMillis(30, 1000)).toBe(60000);
  });

  it("should be 1 sim second", () => {
    expect(realMillisToSimMillis(0, 1000)).toBe(1000);
  });
});

describe("Simulation and Real-time conversion", () => {
  describe("speed factor 30", () => {
    it("1 minute SIM === 1 second REAL", () => {
      expect(simMinuteToRealMillis(30)).toBe(1000);
    });

    it.skip("1 second REAL === 1 min SIM", () => {
      expect(realSecondToSimMillis(30)).toBe(60 * 1000);
    });
  });

  describe("speed factor 15", () => {
    it("2 minute SIM === 1 second REAL", () => {
      expect(simMinuteToRealMillis(15)).toBe(2000);
    });

    it.skip("1 second REAL === 2 minute SIM", () => {
      expect(realSecondToSimMillis(15)).toBe(60 * 2000);
    });
  });

  describe("speed factor 0", () => {
    it("1 minute SIM === 1 minute REAL", () => {
      expect(simMinuteToRealMillis(0)).toBe(60 * 1000);
    });

    it.skip("1 minute REAL === 1 min SIM", () => {
      expect(realSecondToSimMillis(0)).toBe(60 * 1000);
    });
  });

  it("should calulate time difference", () => {
    const start = new Date();
    start.setHours(10, 0, 0, 0);

    const current = new Date();
    current.setHours(11, 0, 0, 0);

    expect(calucluateDifference(start, current)).toBe(3600000);
  });

  describe("factor 30 -> Start time 10:00:00", () => {
    const start = new Date();
    const simTime = new Date();
    beforeEach(() => {
      start.setHours(10, 0, 0, 0);
      simTime.setHours(0, 0, 0, 0);
      expect(start.getHours()).toBe(10);
      expect(simTime.getHours()).toBe(0);
    });

    it.skip("Real elapsed 1 Min === 1 hour SIM", () => {
      const factors = [30];

      factors.forEach(factor => {
        const speed = simMinuteToRealMillis(factor);
        console.log(speed);
        const elapsed = new Date(); // 1 minute
        elapsed.setHours(10, 0, 1, 0);

        // sim time should be 01:00 am
        const elapsedMillis = calucluateDifference(start, elapsed);
        expect(elapsedMillis).toBe(1000); // 1 second

        // convert elapsed time into sim time
        console.log(simTime.toLocaleTimeString());
        const addedSimTime = addMilliseconds(simTime, elapsedMillis * speed);
        console.log(addedSimTime.toLocaleTimeString());
        expect(addedSimTime.getHours()).toBe(1); // 1 min = 1 hour -> 01:00:00
      });
    });
  });
});
