type IClassResponse = {
  espb: string;
  nazivPredmeta: string;
  polozilo: number;
  profesor: string;
};

type IClass = {
  espb: string;
  className: string;
  passed: number;
  professor: string;
};

class RafClass {
  constructor(data: IClass) {
    // @ts-ignore
    this.espb = data.espb;
    // @ts-ignore
    this.className = data.className;
    // @ts-ignore
    this.passed = data.passed;
    // @ts-ignore
    this.professor = data.professor;
  }

  static buildFromResponse(data: IClassResponse) {
    return new RafClass({
      espb: data.espb,
      className: data.nazivPredmeta,
      passed: data.polozilo,
      professor: data.profesor,
    });
  }
}

export { RafClass };
