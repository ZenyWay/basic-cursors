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
import { propCursor } from '../'
import log from './console'
import compose from 'basic-compose'
import { of as observableOf } from 'rxjs'
import { map, tap } from 'rxjs/operators'

log('example:')('double value at `foo.bar` path in objects from stream (prop cursor)')

interface FooBar<T> {
  foo: { bar: T }
}
// set cursor at .foo.bar
const fooBarCursor: <T>(fn: (v?: any) => T) => (p?: FooBar<any>) => FooBar<T> =
  compose.into(0)(propCursor('foo'), propCursor('bar'))

observableOf(
  { foo: { a: 1, bar: 3 }, b: 5 },
  { foo: { a: 2, bar: 5 }, b: 7 }
)
.pipe(
  tap(log('input:')),
  map(fooBarCursor((v: any) => 2 * +v)) // double value at .foo.bar
)
.subscribe(log('output:'))
