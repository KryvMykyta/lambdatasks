const info = require("../utils/getdate.js");

test("Monday 18:00:00, 0.5hour", () => {
  const date = new Date("23 January 2023 18:00");
  const time = 0.5 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 18:30");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Monday 18:00:00, 1hour", () => {
  const date = new Date("23 January 2023 18:00");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 19:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Monday 18:00:00, 1.5hour", () => {
  const date = new Date("23 January 2023 18:00");
  const time = 1.5 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("24 January 2023 12:30");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Friday 18:00:00, 1.5hour", () => {
  const date = new Date("20 January 2023 18:00");
  const time = 1.5 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 12:30");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Friday 12:00:00, 3hour", () => {
  const date = new Date("20 January 2023 12:00");
  const time = 3 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("20 January 2023 15:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Friday 19:00:00, 1hour", () => {
  const date = new Date("20 January 2023 19:00");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 13:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Monday 19:30:00, 1hour", () => {
  const date = new Date("23 January 2023 19:30");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("24 January 2023 13:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Monday 11:00:00, 1hour", () => {
  const date = new Date("23 January 2023 11:00");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 13:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Saturday 11:00:00, 1hour", () => {
  const date = new Date("21 January 2023 11:00");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 13:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Sunday 20:00:00, 1hour", () => {
  const date = new Date("22 January 2023 20:00");
  const time = 1 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("23 January 2023 13:00");
  expect(deadline.getTime()).toBe(result.getTime());
});

test("Sunday 16:00:00, 64hour", () => {
  const date = new Date("22 January 2023 16:00");
  const time = 64 * 3600 * 1000;
  const deadline = info.getDeadline(date, time);
  const result = new Date("2 February 2023 17:00");
  expect(deadline.getTime()).toBe(result.getTime());
});
