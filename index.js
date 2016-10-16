module.exports = function (map, scope) {
  // Primer filtro, elemina espacios en blanco
  map = map.replace(/( )/g, '')
  // Se crea un arreglo de map para poder trabjarlo
  var map_arr = map.split('')
  // Segundo filtro, se revisa que después del
  // último elemento de un objeto no haya comas,
  // ya que JSON.parse no lo procesa
  map_arr.forEach(function (val, index, array) {
    if (val == ',' && array[index+1] == '}') {
      array.splice(index, 1)
    }
  })
  // Se aplica un mapeo al arreglo de map, que retorne
  // los elementos que componen un objeto como undefined,
  // y así poder trabjarlo mas fácil
  var map_arr_flags = map_arr.map(function (e) {
    if (e != '{' && e != '}' && e != ' ' && e != ':' && e != ',') {
      return e
    }
  })
  // Arreglo que almacenará todos las llaves y valores
  // de map
  var values =  []
  // acumulador para reintegrar los valores del arreglo map
  var value = ''

  // Se genera el arreglo de las llaves y valores de map
  map_arr_flags.forEach(function (val, index) {
    // Si el valor es distionto de undefined empieza
    // a acumularlo en en value
    if (val != undefined) {
      value += val
    } else {
       // De lo contrario revisa si value no esta
      // vacio ya que quiere decir q encontro undefined
      // y no acumulo nada
      if (value != ''){
        values.push(value)
      }
      // Se vacia value para que pueda acumular nuevamente
      value = ''
    }
  })

  // Se reintegra map, para poder
  // sustituir sus valores por los valores
  // que JSON.parse puede interpretar
  map = map_arr.join('')
  // Se recorre el arreglo values para comenzar
  // la tarea de remplazo
  values.forEach(function (val, index, array) {
    if(val != undefined) keys = val.split('.')
    if (keys.length > 1 && scope.hasOwnProperty(keys[0])) {
      new_val = get_value(scope, keys)
      map = replace(map, val, new_val)
    } else if (scope.hasOwnProperty(val)){
      if (val == array[index+1] && keys[0] == val){
        map = replace(map, val, scope[val], true)
        map = replace(map, val)
        array[index] = undefined
        array[index+1] = undefined
      } else {
        map = replace(map, val, scope[val])
      }
    } else {
      map = replace(map, val)
    }
  })
  // Se obtienen los valores anidados
  // de un objecto
  function get_value(obeject, keys) {
    keys.forEach(function (key) {
      obeject = obeject[key]
    })
      return obeject
  }

  // Se remplazan las llaves y valores del objecto
  // con los que se encuentran en el el arrglo values
  // recibe tres parametros de los cuales dos son
  // requeridos y el tercero es opcional
  function replace(str, rem, new_val, double) {
    // El valor con en el cual se va a remplazar
    var replace = ''
    if (new_val != null) {
      if (typeof(new_val) == 'number') {
        replace = new_val
      } else {
        replace = JSON.stringify(new_val)
      }
    } else {
      if ((/[0-9]/g).test(rem)) {
        replace = rem
      } else if((/"|'/g).test(rem)){
        replace = rem
      } else {
        replace = JSON.stringify(rem)
      }
    }
    if (double) {
      regexp = new RegExp(`(${rem}(?!:))`)
    } else {
      regexp = new RegExp(`(${rem})`)
    }
    str = str.replace(regexp, replace)
    return str
  }

  try {
    return JSON.parse(map)
  } catch (e) {
    console.log(e, map)
  }
}
