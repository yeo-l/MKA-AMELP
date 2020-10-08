export class UsefulFunctions {

  constructor(){}

  static getMonthlyPeriod(year: number): any {
    // tslint:disable-next-line:prefer-const
    let periods: [{id: string, value: string}];
    const months = [
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
   static getQuarter(d): string {
    d = d || new Date();
    let m = Math.floor(d.getMonth() / 3) + 1;
    m -= m > 4 ? 4 : 0;
    const y = d.getFullYear() + (m === 1 ? 1 : 0);
    return [y, m].join('Q');
  }
  static getQuarterlyPeriod(year: number): any {
    const periods: any[] = [];
    const months = [
      {id: 'Q1', name: 'October - December'},
      {id: 'Q2', name: 'January - March'},
      {id: 'Q3', name: 'April - June'},
      {id: 'Q4', name: 'July - September'}
    ];
    for (let i = 0; i < months.length; i++) {
      const currentQuarter = this.getQuarter(null);
      const quarter = year + months[i].id;
      if (currentQuarter === quarter){
        break;
      }
      periods.push({id: year + months[i].id, value: months[i].name + ' ' + year});
    }
    return periods;
  }
   static formatDateSimple(d1: Date): string {
    const day = d1.getDate();
    const month = d1.getMonth() + 1;
    const year = d1.getFullYear();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
  }
  static completeDataSet(ou, pe, ds): any {
    let completeDataSetRegistration: any;
    console.log(UsefulFunctions.formatDateSimple(new Date()));
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
