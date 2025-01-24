/// <reference lib="webworker" />
import * as moment from "moment-mini";

addEventListener('message', ({ data }) => {
  let i = 0;
  let dataMonths = [];
  dataMonths.push(
    {
      text: "Today",
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
    },
    {
      text: "Current Week",
      start_date: moment().startOf("week").format("YYYY-MM-DD"),
      end_date: moment().endOf("week").format("YYYY-MM-DD"),
    }
  );
  //Adding pervious and current month.
  do {
    dataMonths.push({
      text: moment().subtract(i, "month").format("MMMM"),
      start_date: moment()
        .subtract(i, "month")
        .startOf("month")
        .format("YYYY-MM-DD"),
      end_date: moment()
        .subtract(i, "month")
        .endOf("month")
        .format("YYYY-MM-DD"),
    });
    i++;
  } while (i < 2);
  postMessage(dataMonths);
});
