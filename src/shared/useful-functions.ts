export class UsefulFunctions {

  constructor(){}

  static getMonthlyPeriod(year: number) {
    let periods: [{id: string, value: string}];
    let months = [
      {id: '01', name: 'January'},
      {id: '02', name: 'February'},
      {id: '03', name: 'March'},
      {id: '04', name: 'April'},
      {id: '05', name: 'May'},
      {id: '06', name: 'June'},
      {id: '07', name: 'July'},
      {id: '08', name: 'August'},
      {id: '09', name: 'September'},
      {id: '10', name: 'October'},
      {id: '11', name: 'November'},
      {id: '12', name: 'December'}
    ];
    for (let i = 0; i < months.length; i++) {
      periods.push({id: year + months[i].id, value: months[i].name + ' ' + year});
    }
    return periods;
  }

  static getQuarterlyPeriod(year: number) {
    let periods: any[] = [];
    let months = [
      {id: 'Q1', name: 'January - March'},
      {id: 'Q2', name: 'April - June'},
      {id: 'Q3', name: 'July - September'},
      {id: 'Q4', name: 'October - December'}
    ];
    for (let i = 0; i < months.length; i++) {
      periods.push({id: year + months[i].id, value: months[i].name + ' ' + year});
    }
    return periods;
  }
}
