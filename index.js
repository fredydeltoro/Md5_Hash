module.exports = function (map, scope) {
  // Primer filtro, elemina espacios en blanco
  map = map.replace(/( )/g, '')
  // Segundo filtro, se revisa que después del
  // último elemento de un objeto no haya comas,
  // ya que JSON.parse no lo procesa
  map = map.replace(/,(?=})/g, '')
  // Se guarda map ya que quedo mas limpio
  // para sus posterior uso
  var new_map = map
  // Se retiran los elementos que componen un
  // objecto para solo dejar las llaves y valores de este
  map = map.replace(/[{},:]/g, ' ')
  // Se eliminan los espacios vacios de los extremos
  map = map.trim()
  // Se genera un arreglo de valores y llaves
  // y se eliminan espacios de el
  var values =  map.split(' ')
  values.forEach((val, index, array) => {
    if (val == '')
      array.splice(index, 1)
  })

  // Se reintegra map, para poder
  // sustituir sus valores por los valores
  // que JSON.parse puede interpretar
  map = new_map
  // Se recorre el arreglo values para comenzar
  // la tarea de remplazo
  values.forEach((val, index, array) => {
    // Se crea un arreglo de los valores que tienen
    // dot notation para poder acceder a sus valores
    // si estan en scope
    if(val != undefined) keys = val.split('.')
    // Si la longitud del arreglo es mayor a uno es
    // decir que se hace referencia a valores anidados
    // llama a la funcion get_value para obtener esos valores
    // y son remplazados en map
    if (keys.length > 1 && scope.hasOwnProperty(keys[0])) {
      new_val = get_value(scope, keys)
      map = replace(map, val, new_val)
    } // Si no es valor anidado pero esta en scope
      // se hace la busqueda del valor y se remplaza en map
    else if (scope.hasOwnProperty(val)){
      if (val == array[index+1]){
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
    keys.forEach(key => {
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
