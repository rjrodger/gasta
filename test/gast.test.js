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

  it('readme', async () => {
  })

  it('happy', async () => {
    let g0 = Gasta()
    expect(g0).exists()
  })

})
