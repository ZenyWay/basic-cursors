'use strict' /* eslint-env jasmine */
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
//
const cursor = require('../').cursor
const propCursor = require('../').propCursor
const map = require('rxjs/operators').map
const of = require('rxjs/observable/of').of

describe('cursor:', function () {
  describe('example: double value at `foo.bar` path in objects from stream', function () {
    let next = jasmine.createSpy('next')
    let error = jasmine.createSpy('error')
    let complete = jasmine.createSpy('complete')

    beforeEach(function () {
      // set cursor at .foo.bar
      const fooBarCursor = cursor(peekFooBar, pokeFooBar)

      of(
        { foo: { a: 1, bar: 3 }, b: 5 },
        { foo: { a: 2, bar: 5 }, b: 7 }
      )
      .pipe(
        map(fooBarCursor(v => 2 * v)) // double value at .foo.bar
      )
      .subscribe(next, error, complete)
    })
    it('runs as expected', function () {
      expect(next.calls.allArgs()).toEqual([
        [ { foo: { a: 1, bar: 6 }, b: 5 } ],
        [ { foo: { a: 2, bar: 10 }, b: 7 } ]
      ])
      expect(error).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalledTimes(1)
    })
  })
})

describe('shallowCursor:', function () {
  describe('example: incremete value of property `foo` in objects from stream', function () {
    let next = jasmine.createSpy('next')
    let error = jasmine.createSpy('error')
    let complete = jasmine.createSpy('complete')

    beforeEach(function () {
      // set cursor on foo property
      const fooCursor = propCursor('foo')

      of(
        { foo: 1, b: 5 },
        { foo: 7, b: 3 }
      )
      .pipe(
        map(fooCursor(v => v + 1)) // increment value of `foo` property
      )
      .subscribe(next, error, complete)
    })
    it('runs as expected', function () {
      expect(next.calls.allArgs()).toEqual([
        [ { foo: 2, b: 5 } ],
        [ { foo: 8, b: 3 } ]
      ])
      expect(error).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalledTimes(1)
    })
  })
})

function peekFooBar (o) {
  return o && o.foo && o.foo.bar
}

function pokeFooBar (v, o) {
  return Object.assign({}, o, {
    foo: Object.assign({}, o && o.foo, { bar: v })
  })
}
