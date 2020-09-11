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
   static getQuarter(d) {
    d = d || new Date();
    let m = Math.floor(d.getMonth() / 3) + 1;
    m -= m > 4 ? 4 : 0;
    let y = d.getFullYear() + (m == 1? 1 : 0);
    return [y,m].join('Q');
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
      let currentQuarter = this.getQuarter(null);
      let quarter = year + months[i].id;
      if (currentQuarter === quarter){
        break
      }
      periods.push({id: year + months[i].id, value: months[i].name + ' ' + year});
    }
    return periods;
  }
   static formatDateSimple(d1: Date) {
    let day = d1.getDate();
    let month = d1.getMonth() + 1;
    let year = d1.getFullYear();
     return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
  }
  static completeDataSet(ou, pe, ds){
    let completeDataSetRegistration: any;
    completeDataSetRegistration = {
      completeDataSetRegistrations: [
        {
          organisationUnit: ou,
          period: pe,
          dataSet: ds,
          date: UsefulFunctions.formatDateSimple(new Date())
        }
      ]
    };
    return completeDataSetRegistration;
  }
}
