interface Array<T> {
  multiply(this: Array<number>, multiplier?: number): Array<number>;
  all(func: (v: T) => boolean): boolean;
  any(func: (v: T) => boolean): boolean;
  associateBy(key: string, value?: string): Array<Object>;
  average(this: Array<number>): number;
  chunked(size: number): Array<Array<T>>;
  distinctBy(func?: Function): Array<Object>;
  filter(func: (v: T) => boolean): Array<T>;
  filterIndexed(func: (v: T, u: T) => boolean): Array<T>;
  filterNot(func: (v: T) => boolean): Array<T>;
  find(func: (v: T) => boolean): T;
  findLast(func: (v: T) => boolean): T;
  flatten(count?: number): Array<T>;
  fold(initial: any, func: Function): any;
  maxBy(func: Function): T;
  minBy(func: Function): T;
  count(key?: string): number;
  groupByKey(func: Function): { [key: string]: T };
}

console.log("multiply");
Array.prototype.multiply = function (this: Array<number>, multiplier = 10) {
  let resArray: Array<number> = [];
  for (let el of this) {
    resArray.push(el * multiplier);
  }
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
Array.prototype.all = function (func): /*func is boolean*/ boolean {
  for (let el of this) {
    if (!func(el)) return false;
  }
  return true;
};
console.log(
  [1, 2, 3, 4, 5].all((value: number) => {
    return value > 3;
  })
);

console.log("any");
Array.prototype.any = function (func): /*func is boolean*/ boolean {
  for (let el of this) {
    if (func(el)) return true;
  }
  return false;
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
    for (let element of this) {
      let newKey = element[key];
      let obj: { [key: string]: any } = {};
      obj[newKey] = element;
      resultArray.push(obj);
    }
  } else {
    for (let element of this) {
      let newKey = element[key];
      let newValue = element[value];
      let obj: { [key: string]: any } = {};
      obj[newKey] = newValue;
      resultArray.push(obj);
    }
  }
  return resultArray;
};
let array = [
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
  let resArray: Array<T[]> = [];
  let stepArray: Array<T> = [];
  for (let element of this) {
    if (stepArray.length === size) {
      resArray.push(stepArray);
      stepArray = [];
    }
    stepArray.push(element);
  }
  resArray.push(stepArray);
  return resArray;
};

let words = "one two three four five six seven eight nine ten".split(" ");
console.log(words.chunked(1));

console.log("distinct");
Array.prototype.distinctBy = function <T>(func?: Function) {
  if (!func) {
    return Array.from(new Set(this));
  } else {
    let resArr: Array<T> = [];
    this.map((el) => resArr.push(func(el)));
    return Array.from(new Set(resArr));
  }
};
let arr = ["a", "A", "b", "B", "A", "a"];
console.log(arr.distinctBy());
console.log(arr.distinctBy((el: string) => el.toLowerCase()));

Array.prototype.filter = function <T>(func: Function) {
  let resArr: Array<T> = [];
  this.map((el) => {
    if (func(el)) resArr.push(el);
  });
  return resArr;
};

let testFilter = [1, 2, 3, 4, 5, 6, 7];
console.log(
  testFilter.filter((el: number) => {
    return el % 2 === 0;
  })
);

console.log("filterIndexed");
Array.prototype.filterIndexed = function <T>(func: Function) {
  let resArr: Array<T> = [];
  for (let index = 0; index < this.length; index++) {
    if (func(index, this[index])) {
      resArr.push(this[index]);
    }
  }
  return resArr;
};

let testFilterIndexed = [0, 1, 2, 3, 4, 8, 6];
console.log(
  testFilterIndexed.filterIndexed((index: number, element: any) => {
    return index === element;
  })
);

console.log("filterNot");
Array.prototype.filterNot = function <T>(func: Function) {
  let resArr: Array<T> = [];
  this.map((el) => {
    if (!func(el)) resArr.push(el);
  });
  return resArr;
};

console.log(
  testFilter.filterNot((el: number) => {
    return el % 3 === 0;
  })
);

console.log("find");
Array.prototype.find = function (func: Function) {
  for (let index = 0; index < this.length; index++) {
    if (func(this[index])) return this[index];
  }
  return null;
};

let testFind = [1, 2, 3, 4, 5, 6, 7];
console.log(
  testFind.find((el: number) => {
    return el % 2 !== 0;
  })
);

console.log("findLast");
Array.prototype.findLast = function (func: Function) {
  let reversed = this.reverse();
  return reversed.find(func);
};

console.log(
  testFind.findLast((el: number) => {
    return el % 2 === 0;
  })
);

console.log("flatten");
Array.prototype.flatten = function <T>(count = 0) {
  const isIterable = (object: any) =>
    object != null && typeof object[Symbol.iterator] === "function";
  let resArr = this;
  if (count !== 0) {
    for (let i = 0; i < count; i++) {
      let stepArr: Array<T> = [];
      for (let element of resArr) {
        if (isIterable(element)) {
          for (let newEl of element) {
            stepArr.push(newEl);
          }
        } else {
          stepArr.push(element);
        }
      }
      resArr = stepArr;
    }
  } else {
    while (resArr.filter((el: T) => isIterable(el)).length !== 0) {
      let stepArr: Array<T> = [];
      for (let element of resArr) {
        if (isIterable(element)) {
          for (let newEl of element) {
            stepArr.push(newEl);
          }
        } else {
          stepArr.push(element);
        }
      }
      resArr = stepArr;
    }
  }
  return resArr;
};

console.log([1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]].flatten(1));

console.log("fold");
Array.prototype.fold = function (initial: any, func: Function) {
  for (let el of this) {
    initial = func(initial, el);
  }
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
  for (let el of this) {
    if (func(el) > func(maxEl)) maxEl = el;
  }
  return maxEl;
};

Array.prototype.minBy = function (func: Function) {
  let minEl = this[0];
  for (let el of this) {
    if (func(el) < func(minEl)) minEl = el;
  }
  return minEl;
};

Array.prototype.count = function (key?: string): number {
  if (!key) {
    return this.length;
  } else {
    let sum = 0;
    for (let el of this) {
      if (typeof el === typeof Object) {
        if (Object.keys(el).includes(key)) {
          if (!isNaN(Number(el[key]))) sum += Number(el[key]);
        }
      }
    }
    return sum;
  }
};

Array.prototype.groupByKey = function (func: Function) {
  let resObj: { [key: string]: any } = {};
  for (let el of this) {
    let res = func(el);
    if (!Object.keys(resObj).includes(String(res))) {
      resObj[res] = [el];
    } else {
      resObj[res].push(el);
    }
  }
  return resObj;
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
