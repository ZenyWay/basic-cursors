# basic-cursors
[![NPM](https://nodei.co/npm/basic-cursors.png?compact=true)](https://nodei.co/npm/basic-cursors/)

basic set of functional cursors:
* `cursor`: a generic cursor factory
* `propCursor`: a property cursor factory
* `into`: a cursor for upserting a property based on the complete object

these cursors can also be applied to reducers.

# Examples
see all [examples](./examples) in this directory.
run the examples [in your browser](https://cdn.rawgit.com/ZenyWay/basic-cursors/v2.2.0/examples/index.html).

`propCursor`:
```ts
// set cursor on foo property
const fooCursor = propCursor('foo')

Observable.of(
  { foo: 1, b: 5 },
  { foo: 7, b: 3 }
)
.pipe(
  map(fooCursor((v?: any) => +v + 1)) // increment value of `foo` property
)
.subscribe(debug('output:'))
```

generic `cursor`:
```ts
// set cursor at .foo.bar
const fooBarCursor = cursor(peekFooBar, pokeFooBar)
// alternatively, using compose, e.g. from the 'basic-compose' module:
// const fooBarCursor = compose(propCursor('foo'), propCursor('bar'))

Observable.of(
  { foo: { a: 1, bar: 3 }, b: 5 },
  { foo: { a: 2, bar: 5 }, b: 7 }
)
.pipe(
  map(fooBarCursor((v?: any) => 2 * +v)) // double value at .foo.bar
)
.subscribe(debug('output:'))

function peekFooBar (o: any) {
  return o && o.foo && o.foo.bar
}

function pokeFooBar (v, o) {
  return Object.assign({}, o, {
    foo: Object.assign({}, o && o.foo, { bar: v })
  })
}
```

# API
```ts
export default function cursor<I, C, O = I, D = C>(
  peek: (p?: I) => C,
  poke?: (p: I, c?: D) => O
): (fn?: (c?: C, ...args: any[]) => D) => (p?: I, ...args: any[]) => O

export declare function propCursor<K extends string>(k: K): PropCursor<K>
export declare type PropCursor<K extends string> =
  <P extends Partial<Record<K, P[K]>>, V>(
    fn: (v: P[K], ...args: any[]) => V
  ) => (p?: P, ...args: any[]) => P & Record<K, V>

export declare function into<K extends string>(key: K): IntoCursor<K>
export declare type IntoCursor<K extends string> =
  <P extends Partial<Record<K, P[K]>>, V>(
    fn: (p: P, ...args: any[]) => V
  ) => (p?: P, ...args: any[]) => P & Record<K, V>

export declare function peekProp<K extends string>(
  k: K
): <P extends Partial<Record<K, P[K]>>>(p?: P) => P[K]

export declare function pokeProp<K extends string>(
  k: K
): <P, V>(p: P & Partial<Record<K, any>>, v?: V) => P & Record<K, V>

export declare function identity<V>(v: V): V
```

# TypeScript
although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
modern code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License
Copyright 2018 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
