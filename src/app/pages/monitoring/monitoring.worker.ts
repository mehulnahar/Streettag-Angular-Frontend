/// <reference lib="webworker" />
import * as moment from "moment-mini";


addEventListener('message', ({ data }) => {
  let i = 0;
  let Months = [];
    do {
      Months.push({
        month_text: moment().subtract(i, "month").format("MMMM"),
        month_num: moment().subtract(i, "month").format("M"),
        year: moment().subtract(i, "month").format("YYYY"),
      });
      i++;
    } while (i < 2);
  postMessage(Months);
});
