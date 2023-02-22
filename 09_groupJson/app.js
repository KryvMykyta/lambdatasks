import fs from "fs";

const getUniqueIds = (weekends) => {
  const uniqueIds = Array.from(
    new Set(
      weekends.reduce(
        (resultArray, weekendRecord) => [
          ...resultArray,
          weekendRecord.user._id,
        ],
        []
      )
    )
  );
  return uniqueIds;
};

const reformatJson = (oldFileName, newFileName) => {
  const weekends = JSON.parse(
    fs.readFileSync(oldFileName, { encoding: "utf-8" })
  );
  const uniqueIds = getUniqueIds(weekends);
  let grouppedWeekends = [];
  uniqueIds.map((id) => {
    const weekendRecordsOfUser = weekends.filter(
      (weekendRecord) => id === weekendRecord.user._id
    );
    const userName = weekendRecordsOfUser[0].user.name;
    let weekendsGroupped = [];
    weekendRecordsOfUser.map((weekendRecord) => {
      weekendsGroupped.push({
        startDate: weekendRecord.startDate,
        endDate: weekendRecord.endDate,
      });
    });
    grouppedWeekends.push({
      _id: id,
      name: userName,
      weekends: weekendsGroupped,
    });
  });
  fs.writeFileSync(newFileName, JSON.stringify(grouppedWeekends, null, "\t"));
};

reformatJson("old.json", "new.json");
