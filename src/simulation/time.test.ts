import { createDate } from "../utils/date";
import {
  calucluateDifference,
  getElapsedSimTime,
  simMinuteToRealMillis
} from "./time";

describe("Simulation and Real-time conversion", () => {
  it("should calulate time difference", () => {
    const start = createDate([10, 0, 0, 0]);
    const current = createDate([11, 0, 0, 0]);

    expect(calucluateDifference(start, current)).toBe(3600000);
  });

  it("should convert 1 SIM minute to 1 REAL second", () => {
    expect(simMinuteToRealMillis(30)).toBe(1000);
  });

  it("should convert 1 SIM minute to 2 REAL second", () => {
    expect(simMinuteToRealMillis(15)).toBe(2000);
  });

  it("should convert 1 SIM minute to 1 REAL minute", () => {
    expect(simMinuteToRealMillis(0)).toBe(60000);
  });
});

describe("Time Conversion", () => {
  let start: Date;
  beforeEach(() => {
    start = createDate([10, 0, 0, 0]);
    expect(start.getHours()).toBe(10);
  });

  it("convert elapsed real-time to sim time", () => {
    const factors = [
      { factor: 60, result: "00:02:00" },
      { factor: 30, result: "00:01:00" },
      { factor: 15, result: "00:00:30" },
      { factor: 7.5, result: "00:00:15" },
      { factor: 0, result: "00:00:01" }
    ];

    factors.forEach(({ factor, result }) => {
      const elapsed = createDate([10, 0, 1, 0]); // 1 minute
      const elapsedSim: Date = getElapsedSimTime(factor, start, elapsed);
      expect(elapsedSim.toLocaleTimeString()).toBe(result);
    });
  });
});
