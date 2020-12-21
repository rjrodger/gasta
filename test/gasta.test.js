/* Copyright (c) 2018-2020 Richard Rodger and other contributors, MIT License */
'use strict'

const Fs = require('fs')

const Gasta = require('..')

let Lab = require('@hapi/lab')
Lab = null != Lab.script ? Lab : require('hapi-lab-shim')

const Code = require('@hapi/code')

const lab = (exports.lab = Lab.script())
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('gasta', function () {
  it('compiled', async () => {
    if ('undefined' === typeof window) {
      expect(
        Fs.statSync(__dirname + '/../gasta.ts').mtimeMs,
        'TYPESCRIPT COMPILATION FAILED - SEE WATCH'
      ).most(Fs.statSync(__dirname + '/../dist/gasta.js').mtimeMs)
    }
  })

  it('readme', async () => {})

  it('happy', async () => {
    let g0 = Gasta()
    expect(g0).exists()
  })


  it('intern.read', async () => {
    let read = Gasta.intern.read
    expect(read).function()

    let rs = (s) => read(s.split(/\s+/g))
    
    expect(rs('( a )')).equals(['a'])
    expect(rs('( a b )')).equals(['a','b'])
    expect(rs('( a ( b c ) )')).equals(['a',['b','c']])
  })


  it('intern.ctx', async () => {
    let ctx = Gasta.intern.ctx
    expect(ctx).function()

    // smush down the prototypes
    let allkeys = (o) => {for(let p in o) o[p] = o[p]; return o}
    let ac = (...rest) => allkeys((ctx(...rest)))
    
    expect(ac()).equal({})
    expect(ac({a:1})).equal({a:1})
    expect(ac(ctx({a:1}))).equal({a:1})
    expect(ac(ctx(ctx({a:1})))).equal({a:1})

    expect(ac({a:1},['x'],[2])).equal({a:1,x:2})
    expect(ac({a:1},['x','y'],[2,3])).equal({a:1,x:2,y:3})
    expect(ac({a:1},['x'],[2,3])).equal({a:1,x:2})
    expect(ac({a:1},['x','y'],[2])).equal({a:1,x:2,y:undefined})

    let c0 = ctx({a:1})
    c0.b = 2
    expect(allkeys(c0)).equal({a:1,b:2})
    
  })


  it('intern.resolve.basic', async () => {
    let rv = Gasta.intern.resolve
    expect(rv).function()

    let read = Gasta.intern.read
    let rs = (s,c) => rv(read(s.split(/\s+/g)),c||{})
    let n = (n,f) => (f.n=n,f)

    //let nn = n(1,(x)=>x*x)
    //console.log('N',nn, nn(2))
    
    expect(await rv(1,{})).equals(1)
    expect(await rv('a',{a:2})).equals(2)

    expect(await rv(['a',2],{a:(x)=>x*x})).equals(4)
    expect(await rs('( a 2 )',{'2':2,a:(x)=>x*x})).equals(4)

    expect(await rs('( a 2 a 3 )',{
      '2':2,
      '3':3,
      a:n(1,(x)=>x*x)
    })).equals([4,9])

    expect(await rs('( + a 2 a 3 )',{
      '2':2,
      '3':3,
      '+':(x,y)=>x+y,
      a:n(1,(x)=>x*x)
    })).equals(13)

  })
  
})
