# basic-cursors

[![NPM](https://nodei.co/npm/basic-cursors.png?compact=true)](https://nodei.co/npm/basic-cursors/)

basic set of functional cursors:

- `cursor`: a generic cursor factory
- `propCursor`: a property cursor factory
- `into`: a cursor for upserting a property based on the complete object

these cursors can also be applied to reducers.
lightweight: 304 bytes gzip.

# Examples

see all [examples](./examples) in this directory.
run the examples [in your browser](https://cdn.rawgit.com/ZenyWay/basic-cursors/v2.2.0/examples/index.html).

`propCursor`:

```ts
// set cursor on foo property
const fooCursor = propCursor('foo')

Observable.of<{ foo: number; b: number }>({ foo: 1, b: 5 }, { foo: 7, b: 3 })
  .pipe(
    map(fooCursor(v => +v + 1)) // increment value of `foo` property
  )
  .subscribe(debug('output:'))
```

# API

```ts
export default function cursor<
  G extends (u?: any) => any,
  S extends (u?: Parameters<G>[0], v?: ReturnType<G>) => any
> (
  peek: G,
  poke?: S
): <
  I extends Parameters<G>[0],
  T extends any[] = [],
  O extends ReturnType<S> = I
>(
  fn?: (v?: ReturnType<G>, ...tail: T) => Parameters<S>[1]
) => (p?: I, ...args: T) => O

export declare function propCursor<K extends string> (
  k: K
): <
  I extends Partial<Record<K, any>>,
  T extends any[] = [],
  O extends Record<K, any> = I
>(
  fn?: (v?: I[K], ...tail: T) => O[K]
) => (p?: I, ...args: T) => O

export declare function into<K extends string> (
  key: K
): <
  I extends Partial<Record<K, any>>,
  T extends any[] = [],
  O extends Record<K, any> = I
>(
  fn?: (v?: I, ...tail: T) => O[K]
) => (p?: I, ...args: T) => O

export declare function peekProp<
  P extends Partial<Record<K, any>>,
  K extends string
> (k: K): (p?: P) => P[K]

export declare function pokeProp<
  P extends Partial<Record<K, any>>,
  V,
  K extends string
> (k: K): (p: P, v?: V) => Pick<P, Exclude<keyof P, K>> & Record<K, V>

export declare function identity<V> (v: V): V
```

# TypeScript

although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
modern code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License

Copyright 2019 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
