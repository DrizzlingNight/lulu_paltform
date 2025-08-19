/*
用法：
let foo = new Enum({a: 1, b: 2, c: 3});

foo.a               // 1
foo["a"]            // 1

foo.getName(foo.a)  // a

Objects.keys(foo)   // ["a", "b", "c"]
Objects.values(foo) // [1, 2, 3]
 */

export class Enum {
  constructor(kv) {
    Object.defineProperty(this, "vk", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: {},
    });

    for (let k in kv) {
      let v = kv[k];
      Object.defineProperty(this, k, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: v,
      });
      if (this.vk[v]) {
        throw new Error(
          `duplicate value ${v} with multiple keys ${this.vk[v]} ${k}`
        )
      } else {
        this.vk[v] = k
      }
    }
  }

  getName(v) {
    return this.vk[v]
  }
}
