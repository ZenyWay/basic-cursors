# basic-cursors
[![NPM](https://nodei.co/npm/basic-cursors.png?compact=true)](https://nodei.co/npm/basic-cursors/)

basic set of functional cursors:
* `cursor`: a generic cursor factory
* `propCursor`: a property cursor factory
* `into`: a cursor for upserting a property based on the complete object

# Examples
see all [examples](./examples) in this directory.
run the examples [in your browser](https://cdn.rawgit.com/ZenyWay/basic-cursors/v1.0.0/examples/index.html).

`propCursor`:
```ts
// set cursor on foo property
const fooCursor = propCursor<{},number>('foo')

of(
  { foo: 1, b: 5 },
  { foo: 7, b: 3 }
)
.pipe(
  map(fooCursor(v => v + 1)) // increment value of `foo` property
)
.subscribe(debug('output:'))
```

generic `cursor`:
```ts
// set cursor at .foo.bar
const fooBarCursor = cursor(peekFooBar, pokeFooBar)

of(
  { foo: { a: 1, bar: 3 }, b: 5 },
  { foo: { a: 2, bar: 5 }, b: 7 }
)
.pipe(
  map(fooBarCursor(v => 2 * v)) // double value at .foo.bar
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
declare function cursor<P, C = {}, V = C, O = P & Prop<C>>(
  peek: (p: P) => C,
  poke: (v: V, p: P) => O = (v: V, p: P) => v // default to identity function
): (fn: (c: C) => V) => (p: P) => O

declare function propCursor<P, C = {}, V = C>(
  k: string
): (fn: (c: C) => V) => (p: P) => P & { [x: string]: V }

declare function into<P, V>(
  key: string
): (fn: (c: P) => V) => (p: P) => P & Prop<V>

interface Prop<V> {
  [k: string]: V
}
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
