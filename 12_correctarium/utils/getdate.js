function setNextDay(date) {
  date.setHours(12);
  date.setMinutes(0);
  date.setSeconds(0);
}

function setDayEnd(date) {
  date.setHours(19);
  date.setMinutes(0);
  date.setSeconds(0);
}

function getDeadline(deadline, time) {
  while (time !== 0) {
    if (deadline.getDay() == 6 || deadline.getDay() == 7) {
      deadline.setDate(deadline.getDate() + 7 - deadline.getDay() + 1);
      setNextDay(deadline);
    } else {
      if (deadline.getHours() >= 19) {
        deadline.setDate(deadline.getDate() + 1);
        setNextDay(deadline);
      } else if (deadline.getHours() < 12) {
        setNextDay(deadline);
      } else {
        let newDate = new Date(deadline);
        setDayEnd(newDate);
        if (time > newDate - deadline) {
          time -= newDate - deadline;
          deadline.setDate(deadline.getDate() + 1);
          setNextDay(deadline);
        } else if (time === newDate - deadline) {
          time -= newDate - deadline;
          setDayEnd(deadline);
          return deadline;
        } else {
          deadline.setTime(deadline.getTime() + time);
          time = 0;
          return deadline;
        }
      }
    }
  }
}

function getPrice(data) {
  let price = 0;
  if (data.lan === "en") {
    price = data.count * 0.12;
  } else {
    price = data.count * 0.05;
  }

  if (data.mimetype === "other") {
    price = price * 1.2;
  }

  if (data.lan === "en" && price < 120) {
    price = 120;
  }

  if (data.lan !== "en" && price < 50) {
    price = 50;
  }
  return Math.floor(price);
}

function getTimeNeeded(data) {
  let time = 0;
  //time in hours
  if (data.lan === "en") {
    time = data.count / 333;
  } else {
    time = data.count / 1333;
  }

  if (data.mimetype === "other") {
    time = time * 1.2;
  }

  time = 0.5 + time;

  if (time < 1) {
    time = 1;
  }

  //time in milliseconds
  return Math.round(time * 100) / 100;
}

function getOrderDetails(requestBody) {
  const cost = getPrice(requestBody);
  const time = getTimeNeeded(requestBody);
  const date = getDeadline(new Date(), time * 3600 * 1000);
  return {
    price: cost,
    time: time,
    deadline: date.getTime(),
    deadline_date: date.toISOString(),
  };
}

module.exports = {
  getOrderDetails,
  getPrice,
  getTimeNeeded,
  getDeadline,
};
