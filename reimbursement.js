{
    "use strict";

    const set1 = [
      {
        cityCost: "low",
        startDate: "9/1/15",
        endDate: "9/3/15"
      }
    ];
    const set2 = [
      {
        cityCost: "low",
        startDate: "9/1/15",
        endDate: "9/1/15"
      },
      {
        cityCost: "high",
        startDate: "9/2/15",
        endDate: "9/6/15"
      },
      {
        cityCost: "low",
        startDate: "9/6/15",
        endDate: "9/8/15"
      }
    ];
    const set3 = [
      {
        cityCost: "low",
        startDate: "9/1/15",
        endDate: "9/3/15"
      },
      {
        cityCost: "high",
        startDate: "9/5/15",
        endDate: "9/7/15"
      },
      {
        cityCost: "high",
        startDate: "9/8/15",
        endDate: "9/8/15"
      }
    ];
    const set4 = [
      {
        cityCost: "low",
        startDate: "9/1/15",
        endDate: "9/1/15"
      },
      {
        cityCost: "low",
        startDate: "9/1/15",
        endDate: "9/1/15"
      },
      {
        cityCost: "high",
        startDate: "9/2/15",
        endDate: "9/2/15"
      },
      {
        cityCost: "high",
        startDate: "9/2/15",
        endDate: "9/3/15"
      }
    ];

    function calculateReimbursement(set) {
      // determine number of projects in set
      const numProjects = set.length;

      // return 0, no projects exist in the set
      if (!numProjects) return 0;

      // get dates & rates for each project in the set
      const projects = getProjectDatesAndRates(set);

      // get rate for each project date in the set
      const dates = getSetDatesAndRates(projects);

      // get reimbursement total for the set
      const reimbursement = getReimbursementTotal(dates);

      // return set's reimbursement total
      return reimbursement;
    }

    function getProjectDatesAndRates(set) {
      // determine number of projects in set
      const numProjects = set.length;

      let projects = [];

      // set inital dates to dates of first project in set
      let setStartDate = set[0].startDate;
      let setEndDate = set[0].endDate;

      // determine start date & end date of set
      for (const project of set) {
        setStartDate = getEarliestDate(project.startDate, setStartDate);
        setEndDate = getLatestDate(project.endDate, setEndDate);
      }

      // iterate through each project in the set
      for (let p = 0; p < numProjects; p++) {
        // set project rates
        const travelDayRate = set[p].cityCost === "low" ? 45 : 55;
        const fullDayRate = set[p].cityCost === "low" ? 75 : 85;

        // determine num of days in project, adding 1 for start date
        const numProjectDays =
          countNumOfDays(set[p].startDate, set[p].endDate) + 1;

        let proj = {};

        // iterate through each day in the project
        for (let d = 0; d < numProjectDays; d++) {
          // get current project date
          const date = new Date(set[p].startDate).getDate() + d;

          // determine if the date matches the set's start or end date
          if (
            (set[p].startDate === setStartDate && d === 0) ||
            (set[p].endDate === setEndDate && d === numProjectDays - 1)
          ) {
            // set travel rate to project date
            proj[date] = travelDayRate;
          } else {
            // set full rate to project date
            proj[date] = fullDayRate;
          }

          // if at beginning of proj && not at beginning of set && not already a travel day
          if (
            d === 0 && 
            p !== 0 && 
            proj[date] != travelDayRate
          ) {
            // determine if there is a gap behind the current proj date
            if (
              (date - 1) !== new Date(set[p - 1].endDate).getDate() &&
              date !== new Date(set[p - 1].endDate).getDate()
            ) {
              // overwrite project date with the travel rate
              proj[date] = travelDayRate;
            }
          }

          // if at end of proj && not at end of set && not already a travel day
          if (
            d === numProjectDays - 1 &&
            p !== numProjects - 1 &&
            proj[date] != travelDayRate
          ) {
            // determine if there is a gap ahead of the current proj date
            if (
              date + 1 !== new Date(set[p + 1].startDate).getDate() &&
              date !== new Date(set[p + 1].startDate).getDate()
            ) {
              // set travel rate to project date
              proj[date] = travelDayRate;
            }
          }
        }
        // add project to projects array
        projects.push(proj);
      }

      // return set of projects w/dates & rates
      return projects;
    }

    function getSetDatesAndRates(projects) {
      let dates = {};

      // iterate through projects
      projects.forEach(function(project) {
        // get project dates & rates
        const projectDatesAndRates = Object.entries(project);

        // iterate through project dates
        for (let [date, rate] of projectDatesAndRates) {
          // determine if rate for date already exists
          if (dates[date])
            // compare rates & save highest
            rate = dates[date] > rate ? dates[date] : rate;

          // set rate for date
          dates[date] = rate;
        }
      });

      // return set of dates w/rates
      return dates;
    }

    function getReimbursementTotal(dates) {
      // get rates
      const rates = Object.values(dates);
      // return reimbursement total
      return rates.reduce((total, rate) => total + rate);
    }

    function countNumOfDays(date1, date2) {
      // calculate the number of milliseconds in one day
      const oneDay = 24 * 60 * 60 * 1000;

      // convert dates to milliseconds
      date1 = new Date(date1).getTime();
      date2 = new Date(date2).getTime();

      // calculate the date difference in milliseconds
      const dateDifference = Math.abs(date1 - date2);

      // convert dateDifference milliseconds back to days
      const numOfDays = Math.round(dateDifference / oneDay);

      // return number of days between dates
      return numOfDays;
    }

    function getEarliestDate(date1, date2) {
      // convert dates to milliseconds
      const d1 = new Date(date1).getTime();
      const d2 = new Date(date2).getTime();

      // compare milliseconds & return earlier date
      return d1 < d2 ? date1 : date2;
    }

    function getLatestDate(date1, date2) {
      // convert dates to milliseconds
      const d1 = new Date(date1).getTime();
      const d2 = new Date(date2).getTime();

      // compare milliseconds & return later date
      return d1 > d2 ? date1 : date2;
    }

    console.log(`Set 1: ${calculateReimbursement(set1)}`);
    console.log(`Set 2: ${calculateReimbursement(set2)}`);
    console.log(`Set 3: ${calculateReimbursement(set3)}`);
    console.log(`Set 4: ${calculateReimbursement(set4)}`);
  }