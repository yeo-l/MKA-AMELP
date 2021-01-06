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
    // const y = d.getFullYear() + (m === 1 ? 1 : 0);
    const y = d.getFullYear() + (m === 0 ? 1 : 0);
    return [y, m].join('Q');
  }
  static getPeriodFromQuarter(quarter: string){
    const year = quarter.split('Q')[0];
    const periods = {
      Q4:{firstDate: year +'-10-01', lastDate: year +'-12-31'},
      Q1:{firstDate: year +'-01-01', lastDate: year +'-03-31'},
      Q2:{firstDate: year +'-04-01', lastDate: year +'-06-30'},
      Q3:{firstDate: year +'-07-01', lastDate: year +'-09-30'}
    };
    return periods['Q' + quarter.split('Q')[1]]
  }
  static getQuarterlyPeriod(year: number): any {
    const periods: any[] = [];
    const months = [
      {id: 'Q4', name: 'October - December'},
      {id: 'Q1', name: 'January - March'},
      {id: 'Q2', name: 'April - June'},
      {id: 'Q3', name: 'July - September'}
    ];

    for (let i = 0; i < months.length; i++) {
      if (months[i].id === 'Q4') {
        periods.push({id: (year - 1) + months[i].id, value: months[i].name + ' ' + (year - 1)});
      } else {
        periods.push({id: year + months[i].id, value: months[i].name + ' ' + year});
      }
    }
    const currentQuarter = this.getQuarter(null);
    const result = periods.filter(p => p.id === currentQuarter);
    if (result.length) {
      const index: number = periods.indexOf(result[0]);
      if (index !== -1) {
        periods.splice(index);
      }
    }
    // if (currentQuarter === quarter){
    //   break;
    // }
    // console.log('current quarter',currentQuarter);
    // console.log('current year',year);
    // console.log('period',periods);
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
    // console.log(UsefulFunctions.formatDateSimple(new Date()));
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

  static getFiscalYear(period): string {
    const values = period.split('Q');
    // console.log(values);
    if (values.length !== 2) {
      return '';
    }
    const year = parseInt(values[0], 10);
    if (values[1] === '4') {
      return 'Q1-FY' + (year + 1);
    } else if (values[1] === '1') {
      return 'Q2-FY' + year;
    } else if (values[1] === '2') {
      return 'Q3-FY' + year;
    } else if (values[1] === '3') {
      return 'Q4-FY' + year;
    }
  }
}
