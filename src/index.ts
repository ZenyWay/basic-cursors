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
 * @template P parent type
 * @template C child type
 * @template V mapped child type
 * @template O output type
 * @param {(parent: P) => C} peek
 * @param {(child: V, parent: P) => O} poke
 * @return {(fn: (child: C) => V) => (p: P) => O} a cursor
 * that returns an update function from a given function,
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
export function cursor <P,C={},V=C,O=P&Prop<C>>(
  peek: (p: P) => C,
  poke = identity as (v: V, p: P) => O
) {
	return function (fn: (c: C) => V) {
		return function (p: P) {
			return poke(fn(peek(p)), p)
		}
	}
}

export interface Prop<V> {
  [k: string]: V
}

export function propCursor <P,C={},V=C>(k: string) {
	return cursor<P,C,V,P&{[x: string]: V}>(peekProp(k), pokeProp(k))
}

/**
 * @template P
 * @template V
 * @param {string} key
 * @returns {(fn: (p: P) => V) => (p: P) => P & Prop<V>}
 * a cursor that applies a given function to objects
 * and adds the result as a property in that object.
 */
export function into <P,V>(key: string) {
	return cursor<P,P,V,P&Prop<V>>(identity, pokeProp(key))
}

export function peekProp (k: string) {
	return function <V,O>(o: O): V {
		return o[k]
	}
}

export function pokeProp (k: string) {
	return function <V,O>(v: V, o: O): O&Prop<V> {
		return Object.assign({}, o, { [k]: v })
	}
}

export function identity <V>(v: V): V { return v }
