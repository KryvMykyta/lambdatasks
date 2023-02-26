interface Array<T> {
  multiply(this: Array<number>, multiplier?: number): Array<number>;
  all(func: (v: T) => boolean): boolean;
  any(func: (v: T) => boolean): boolean;
  associateBy(this: { [key: string]: any }[], key: string, value?: string): Array<Object>;
  average(this: Array<number>): number;
  chunked(size: number): Array<Array<T>>;
  distinctBy(func?: Function): Array<Object>;
  filter1(func: (v: T) => boolean): Array<T>;
  filterIndexed(func: (v: T, u: T) => boolean): Array<T>;
  filterNot(func: (v: T) => boolean): Array<T>;
  find1(func: (v: T) => boolean): T;
  findLast(func: (v: T) => boolean): T;
  flatten(count?: number): Array<T>;
  fold(initial: any, func: Function): any;
  maxBy(func: Function): T;
  minBy(func: Function): T;
  count(key?: string): number;
  groupByKey(func: Function): { [key: string]: T };
}

console.log("multiply");
Array.prototype.multiply = function (multiplier = 10) {
  let resArray: Array<number> = [];
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
  let resultArray: Array<Object> = [];
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
  let resultArray: Array<T[]> = [];
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
    let resultArray: Array<T> = [];
    this.forEach((element: T) => resultArray.push(func(element)));
    return Array.from(new Set(resultArray));
  }
};
let arr = ["a", "A", "b", "B", "A", "a"];
console.log(arr.distinctBy());
console.log(arr.distinctBy((el: string) => el.toLowerCase()));


console.log("filter");
Array.prototype.filter1 = function <T>(func: (v: T) => boolean) {
  let resultArray: Array<T> = [];
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
  let resultArray: Array<T> = [];
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
  let resultArr: Array<T> = [];
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
    if (func(this[index])) return this[index];
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
  return reversed.find1(func);
};

console.log(
  testFind.findLast((el: number) => {
    return el % 2 === 0;
  })
);

// console.log("flatten");
// Array.prototype.flatten = function <T>(count = 0) {
//   const isIterable = (object: any) =>
//     object != null && typeof object[Symbol.iterator] === "function";
//   let resArr = this;
//   if (count !== 0) {
//     for (let i = 0; i < count; i++) {
//       let stepArr: Array<T> = [];
//       for (let element of resArr) {
//         if (isIterable(element)) {
//           for (let newEl of element) {
//             stepArr.push(newEl);
//           }
//         } else {
//           stepArr.push(element);
//         }
//       }
//       resArr = stepArr;
//     }
//   } else {
//     while (resArr.filter((el: T) => isIterable(el)).length !== 0) {
//       let stepArr: Array<T> = [];
//       for (let element of resArr) {
//         if (isIterable(element)) {
//           for (let newEl of element) {
//             stepArr.push(newEl);
//           }
//         } else {
//           stepArr.push(element);
//         }
//       }
//       resArr = stepArr;
//     }
//   }
//   return resArr;
// };

// console.log([1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]].flatten(1));

// console.log("fold");
// Array.prototype.fold = function (initial: any, func: Function) {
//   for (let el of this) {
//     initial = func(initial, el);
//   }
//   return initial;
// };

// console.log(
//   [1, 2, 3, 4, 5].fold(
//     1,
//     (initial: number, element: number) => initial * element
//   )
// );

// Array.prototype.maxBy = function (func: Function) {
//   let maxEl = this[0];
//   for (let el of this) {
//     if (func(el) > func(maxEl)) maxEl = el;
//   }
//   return maxEl;
// };

// Array.prototype.minBy = function (func: Function) {
//   let minEl = this[0];
//   for (let el of this) {
//     if (func(el) < func(minEl)) minEl = el;
//   }
//   return minEl;
// };

// Array.prototype.count = function (key?: string): number {
//   if (!key) {
//     return this.length;
//   } else {
//     let sum = 0;
//     for (let el of this) {
//       if (typeof el === typeof Object) {
//         if (Object.keys(el).includes(key)) {
//           if (!isNaN(Number(el[key]))) sum += Number(el[key]);
//         }
//       }
//     }
//     return sum;
//   }
// };

// Array.prototype.groupByKey = function (func: Function) {
//   let resObj: { [key: string]: any } = {};
//   for (let el of this) {
//     let res = func(el);
//     if (!Object.keys(resObj).includes(String(res))) {
//       resObj[res] = [el];
//     } else {
//       resObj[res].push(el);
//     }
//   }
//   return resObj;
// };

// let groupbytest = ["a", "abc", "ab", "def", "abcd"];
// console.log(groupbytest.groupByKey((el: any) => el.length));

// let object = [
//   {
//     name: "Alice",
//     Work: "Marketing",
//   },
//   {
//     name: "Bob",
//     Work: "Sales",
//   },
//   {
//     name: "Carol",
//     Work: "Marketing",
//   },
// ];

// console.log(object.groupByKey((el: any) => el.Work));
