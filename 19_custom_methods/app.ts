interface Array<T> {
  multiply(this: Array<number>, multiplier?: number): Array<number>;
  all(this: Array<T>, func: (v: T) => boolean): boolean;
  any(this: Array<T>, func: (v: T) => boolean): boolean;
  associateBy(this: { [key: string]: any }[], key: string, value?: string): Array<Object>;
  average(this: Array<number>): number;
  chunked(this: Array<T>, size: number): Array<Array<T>>;
  distinctBy(this: Array<T>, func?: Function): Array<Object>;
  filter1(this: Array<T>, func: (v: T) => boolean): Array<T>;
  filterIndexed(this: Array<T>, func: (v: T, u: T) => boolean): Array<T>;
  filterNot(this: Array<T>, func: (v: T) => boolean): Array<T>;
  find1(this: Array<T>, func: (v: T) => boolean): T;
  findLast(this: Array<T>, func: (v: T) => boolean): T;
  flatten(this: Array<T>, count?: number): Array<T>;
  fold(this: Array<T>, initial: any, func: Function): any;
  maxBy(this: Array<T>, func: Function): T;
  minBy(this: Array<T>, func: Function): T;
  count(this: Array<T>, key?: string): number;
  groupByKey(this: Array<T>, func: Function): { [key: string]: T[] };
}

console.log("multiply");
Array.prototype.multiply = function (multiplier = 10) {
  const resArray: Array<number> = [];
  this.forEach((element) => {
    resArray.push(element * multiplier);
  });
  return resArray;
};
console.log([1, 2, 3, 4, 5].multiply(2));

console.log("average");
Array.prototype.average = function (): number {
  let sum = 0;
  this.map((value) => (sum += value));
  return sum / this.length;
};
console.log([1, 2, 3, 4, 5].average());

console.log("all");
Array.prototype.all = function <T>(func: (v: T) => boolean): boolean {
  let isAll = true;
  this.forEach((element: T) => {
    if (!func(element)) isAll = false;
  });
  return isAll;
};
console.log(
  [1, 2, 3, 4, 5].all((value: number) => {
    return value > 3;
  })
);

console.log("any");
Array.prototype.any = function <T>(func: (v: T) => boolean): boolean {
  let isAny = false;
  this.forEach((element: T) => {
    if (func(element)) isAny = true;
  });
  return isAny;
};
console.log(
  [1, 2, 3, 4, 5].any((value: number) => {
    return value > 3;
  })
);

console.log("associateBy");
Array.prototype.associateBy = function (key: string, value: string) {
  const resultArray: Array<Object> = [];
  if (!value) {
    this.forEach((element) => {
      const newKey = element[key];
      const resultObject: { [key: string]: any } = {};
      resultObject[newKey] = element;
      resultArray.push(resultObject);
    });
    return resultArray;
  }
  this.forEach((element) => {
    const newKey = element[key];
    const newValue = element[value];
    const resultObject: { [key: string]: any } = {};
    resultObject[newKey] = newValue;
    resultArray.push(resultObject);
  });
  return resultArray;
};
const array = [
  { emoji: "1", sad: "sad1" },
  { emoji: "2", sad: "sad2" },
  { emoji: "3", sad: "sad3" },
  { emoji: "4", sad: "sad4" },
  { emoji: "5", sad: "sad5" },
  { emoji: "6", sad: "sad6" },
];
console.log(array.associateBy("emoji"));
console.log(array.associateBy("emoji", "sad"));

console.log("chunked");
Array.prototype.chunked = function <T>(size: number) {
  const resultArray: Array<T[]> = [];
  let stepArray: Array<T> = [];
  this.forEach((element: T) => {
    if (stepArray.length === size) {
      resultArray.push(stepArray);
      stepArray = [];
    }
    stepArray.push(element);
  })
  resultArray.push(stepArray);
  return resultArray;
};

let words = "one two three four five six seven eight nine ten".split(" ");
console.log(words.chunked(3));

console.log("distinct");
Array.prototype.distinctBy = function <T>(func?: Function) {
  if (!func) {
    return Array.from(new Set(this));
  } else {
    const resultArray: Array<T> = [];
    this.forEach((element: T) => resultArray.push(func(element)));
    return Array.from(new Set(resultArray));
  }
};
let arr = ["a", "A", "b", "B", "A", "a"];
console.log(arr.distinctBy());
console.log(arr.distinctBy((el: string) => el.toLowerCase()));


console.log("filter");
Array.prototype.filter1 = function <T>(func: (v: T) => boolean) {
  const resultArray: Array<T> = [];
  this.forEach((element: T) => {
    if (func(element)) resultArray.push(element);
  });
  return resultArray;
};

let testFilter = [1, 2, 3, 4, 5, 6, 7];
console.log(
  testFilter.filter1((el: number) => {
    return el % 2 === 0;
  })
);

console.log("filterIndexed");
Array.prototype.filterIndexed = function <T>(func: (v: number, u: T) => boolean) {
  const resultArray: Array<T> = [];
  for (let index = 0; index < this.length; index++) {
    if (func(index, this[index])) {
      resultArray.push(this[index]);
    }
  }
  return resultArray;
};

let testFilterIndexed = [0, 1, 2, 3, 4, 8, 6];
console.log(
  testFilterIndexed.filterIndexed((index: number, element: any) => {
    return index === element;
  })
);

console.log("filterNot");
Array.prototype.filterNot = function <T>(func: (v: T) => boolean) {
  const resultArr: Array<T> = [];
  this.map((element: T) => {
    if (!func(element)) resultArr.push(element);
  });
  return resultArr;
};

console.log(
  testFilter.filterNot((el: number) => {
    return el % 3 === 0;
  })
);

console.log("find");
Array.prototype.find1 = function <T>(func: (v: T) => boolean) {
  for (let index = 0; index < this.length; index++) {
    if (func(this[index])) return index;
  }
  return null;
};

let testFind = [1, 2, 3, 4, 5, 6, 7];
console.log(
  testFind.find1((el: number) => {
    return el % 2 !== 0;
  })
);

console.log("findLast");
Array.prototype.findLast = function (func: (v: number) => boolean) {
  const reversed = this.reverse();
  return this.length - reversed.find1(func) - 1;
};

console.log(
  testFind.findLast((el: number) => {
    return el % 2 === 0;
  })
);

console.log("flatten");
Array.prototype.flatten = function (count = 0) {
  const isIterable = (object: any) =>
    object != null && typeof object[Symbol.iterator] === "function";
  let resArr : Array<any> = this;
  if (count !== 0) {
    for (let i = 0; i < count; i++) {
      const stepArr : Array<any> = [];
      resArr.forEach(element => {
        if(isIterable(element)) {
          element.forEach((newElement: any) => {
            stepArr.push(newElement)
          });
        }else {
          stepArr.push(element)
        }
      });
      resArr = stepArr;
    }
  } else {
    while (resArr.filter((el: any) => isIterable(el)).length !== 0) {
      const stepArr : Array<any> = [];
      resArr.forEach(element => {
        if(isIterable(element)) {
          element.forEach((newElement: any) => {
            stepArr.push(newElement)
          });
        }else {
          stepArr.push(element)
        }
      });
      resArr = stepArr;
    }
  }
  return resArr;
};

console.log([1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]].flatten(1));

console.log("fold");
Array.prototype.fold = function (initial: any, func: Function) {
  this.forEach((element: any) => {
    initial = func(initial, element);
  });
  return initial;
};

console.log(
  [1, 2, 3, 4, 5].fold(
    1,
    (initial: number, element: number) => initial * element
  )
);

Array.prototype.maxBy = function (func: Function) {
  let maxEl = this[0];
  this.forEach((element: any) => {
    if (func(element) > func(maxEl)) maxEl = element;
  });
  return maxEl;
};

Array.prototype.minBy = function (func: Function) {
  let minEl = this[0];
  this.forEach((element: any) => {
    if (func(element) < func(minEl)) minEl = element;
  });
  return minEl;
};

Array.prototype.count = function (key?: string): number {
  if (!key) {
    return this.length;
  } else {
    let sum = 0;
    this.forEach(element => {
      if (typeof element === typeof Object) {
        if (Object.keys(element).includes(key)) {
          if (!isNaN(Number(element[key]))) sum += Number(element[key]);
        }
      }
    })
    return sum;
  }
};

Array.prototype.groupByKey = function<T>(func: Function) {
  let resultObject: { [key: string]: T[] } = {};

  this.forEach((element: T) => {
    const result = func(element);
    if (!Object.keys(resultObject).includes(String(result))) {
      resultObject[result] = [element];
    } else {
      resultObject[result].push(element);
    }
  })
  return resultObject;
};

let groupbytest = ["a", "abc", "ab", "def", "abcd"];
console.log(groupbytest.groupByKey((el: any) => el.length));

let object = [
  {
    name: "Alice",
    Work: "Marketing",
  },
  {
    name: "Bob",
    Work: "Sales",
  },
  {
    name: "Carol",
    Work: "Marketing",
  },
];

console.log(object.groupByKey((el: any) => el.Work));
