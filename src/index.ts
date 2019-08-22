/**
 * @license
 * Copyright 2019 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
/**
 * a cursor that returns an update function from a given function,
 * that applies the latter to the child portion of parent objects.
 *
 * @example
 * // with a stream:
 * const fooBarCursor = cursor(peekFooBar, pokeFooBar) // set cursor at .foo.bar
 *
 * of(
 *   { bar: { a: 1, foo: 3 }, b: 5 },
 *   { bar: { a: 2, foo: 5 }, b: 7 }
 * )
 * .pipe(
 *   tap(log('input:')),
 *   map(fooBarCursor(v => 2 * v)) // double value at .foo.bar
 * )
 * .subscribe(log('output:'))
 *
 * function peekFooBar(o: any) {
 *   return o && o.foo && o.foo.bar
 * }
 *
 * function pokeFooBar(v, o) {
 *   return Object.assign({}, o, {
 *     foo: Object.assign({}, o && o.foo, { bar: v })
 *   })
 * }
 */
export default function cursor<
  G extends (u?: any) => any,
  S extends (u?: Parameters<G>[0], v?: ReturnType<G>) => any
> (peek: G, poke: S = identity as any) {
  return function<
    I extends Parameters<G>[0],
    T extends any[] = [],
    O extends ReturnType<S> = I
  > (fn = identity as (v?: ReturnType<G>, ...tail: T) => Parameters<S>[1]) {
    return function (p?: I, ...args: T): O {
      const v = peek(p)
      const u = fn(v, ...args)
      return u === (v as any) ? (p as any) : poke(p, u)
    }
  }
}

export function propCursor<K extends string> (
  k: K
): <
  I extends Partial<Record<K, any>>,
  T extends any[] = [],
  O extends Record<K, any> = I
>(
  fn?: (v?: I[K], ...tail: T) => O[K]
) => (p?: I, ...args: T) => O {
  return cursor(peekProp(k), pokeProp(k)) as any
}

/**
 * a cursor that applies a given function to objects
 * and adds the result as a property in that object.
 */
export function into<K extends string> (
  key: K
): <
  I extends Partial<Record<K, any>>,
  T extends any[] = [],
  O extends Record<K, any> = I
>(
  fn?: (v?: I, ...tail: T) => O[K]
) => (p?: I, ...args: T) => O {
  return cursor(identity, pokeProp(key)) as any
}

export function peekProp<K extends string> (k: K) {
  return function<P extends Partial<Record<K, any>>> (p?: P): undefined | P[K] {
    return p ? p[k] : void 0
  }
}

export function pokeProp<K extends string> (k: K) {
  return function<P extends Partial<Record<K, any>>, V> (
    p: P,
    v?: V
  ): Omit<P, K> & Record<K, V> {
    if (p && p[k] === v && typeof v === 'undefined') {
      return p
    }
    const result = Object.assign(Object.create(null), p)
    result[k] = v
    return result
  }
}

export function identity<V> (v: V): V {
  return v
}
