/**
 * @license
 * Copyright 2018 Stephane M. Catala
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
;
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
export default function cursor<I,C,O=I,D=C>(
  peek: (p?: I) => C,
  poke = identity as (p: I, c?: D) => O
) {
  return function (
    fn = identity as (c?: C, ...args: any[]) => D
  ) {
    return function (p?: I, ...args: any[]): O {
      const v = peek(p)
      const u = fn(v, ...args)
      return u === v as any ? p as any : poke(p, u)
    }
  }
}

export function propCursor <K extends string>(k: K): PropCursor<K> {
  return cursor(peekProp(k), pokeProp(k))
}

export type PropCursor<K extends string> =
  <P extends Partial<Record<K, P[K]>>, V>(
    fn: (v: P[K], ...args: any[]) => V
  ) => (p?: P, ...args: any[]) => P & Record<K, V>

/**
 * a cursor that applies a given function to objects
 * and adds the result as a property in that object.
 */
export function into <K extends string>(key: K): IntoCursor<K> {
  return cursor(
    identity as <P extends Partial<Record<K,P[K]>>>(p: P) => P[K],
    pokeProp(key)
  )
}

export type IntoCursor<K extends string> =
  <P extends Partial<Record<K, P[K]>>, V>(
    fn: (p: P, ...args: any[]) => V
  ) => (p?: P, ...args: any[]) => P & Record<K,V>

export function peekProp <K extends string>(k: K) {
  return function <P extends Partial<Record<K,P[K]>>>(p?: P): P[K] {
    return typeof p === 'object' && p !== null ? p[k] : void 0
  }
}

export function pokeProp <K extends string>(k: K) {
  return function <P, V>(p: P & Partial<Record<K,any>>, v?: V): P & Record<K,V> {
    return (p && p[k]) === v as any
      ? p as P & Record<K,V>
      : Object.assign({} as P & Record<K,V>, p, { [k]: v })
  }
}

export function identity <V>(v: V): V { return v }
