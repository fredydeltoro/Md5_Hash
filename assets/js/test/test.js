var hashmd5 = require('../../../index.js');
var assert = require('assert');

var tests = {
  uno:{
    map: `{DatosGenerales: {Nombre: data.nombre,}}`,
    scope:{data: {nombre: 'Alfredo',}},
    result: {DatosGenerales: {Nombre: 'Alfredo'}}
  },
  dos:{
    map: '{DatosGenerales: {Nombre: data.nombre, Apodos:data.apodos, escolaridad:data.escolaridad.primaria}, num: num, }',
    scope:{
      data: {
        nombre: 'Alfredo',
        apodos: ['elfello', 'fredy'],
        escolaridad:{
          primaria:'Alfredo v. Bonfil',
          secundaria: 'Cerro de las campanas',
          preparatoria: 'CETIS 142'
        }
      },
      num : 5
    },
    result: {DatosGenerales: {Nombre: 'Alfredo', Apodos:['elfello', 'fredy'], escolaridad:'Alfredo v. Bonfil'}, num: 5, }
  },
  tres:{
    map: '{DatosGenerales: {Nombre: data.nombre, Apodos:data.apodos, escolaridad:data.escolaridad.primaria}, num: num, }',
    result: {DatosGenerales: {Nombre: 'Alfredo', Apodos:['elfello', 'fredy'], escolaridad:'Alfredo v. Bonfil'}, num: 5, }
  },
  cuatro:{
    map: '{DatosGenerales: {Nombre: data.nombre, Apodos:data.apodos, escolaridad:data.escolaridad.primaria}, "edad": num, }',
    result: {DatosGenerales: {Nombre: 'Alfredo', Apodos:['elfello', 'fredy'], escolaridad:'Alfredo v. Bonfil'}, edad: 5, }
  },
  cinco:{
    map: '{DatosGenerales: {Nombre: data.nombre, data:data.apodos, escolaridad:data.escolaridad.primaria}, "edad": num, }',
    result: {DatosGenerales: {Nombre: 'Alfredo', data:['elfello', 'fredy'], escolaridad:'Alfredo v. Bonfil'}, edad: 5, }
  }
  }

describe('Hash Md5', function () {
  it('Debe regresar undefined', function () {
    assert.equal(undefined, hashmd5(tests.uno.map))
    assert.equal(undefined, hashmd5('asfa', 'asdfas'))
    assert.equal(undefined, hashmd5())
  })
  it('Debe retornar un objeto con los valores del scope', function () {
    assert.equal(JSON.stringify(tests.uno.result), JSON.stringify(hashmd5(tests.uno.map, tests.uno.scope)))
    assert.equal(JSON.stringify(tests.dos.result), JSON.stringify(hashmd5(tests.dos.map, tests.dos.scope)))
    assert.equal(JSON.stringify(tests.tres.result), JSON.stringify(hashmd5(tests.tres.map, tests.dos.scope)))
    assert.equal(JSON.stringify(tests.cuatro.result), JSON.stringify(hashmd5(tests.cuatro.map, tests.dos.scope)))
    assert.equal(JSON.stringify(tests.cinco.result), JSON.stringify(hashmd5(tests.cinco.map, tests.dos.scope)))
  })
})
