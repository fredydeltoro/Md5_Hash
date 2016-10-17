module.exports = function (map, scope) {
  if (map == undefined || scope == undefined) {
    return ;
  }
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
    var regex = new RegExp(`(${val}(?="|:))`)
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
        // Si llave y valor se llaman igual, primero
        // se remplazo el valor por el valor del scope
        map = replace(map, val, scope[val], true)
        // Despues se trabaja con la llave para que
        // se parsee correctamente
        map = replace(map, val)
        // y ambos valores se transforman a undefined
        // para que no vuelvan a ser procesados
        array[index] = undefined
        array[index+1] = undefined
      } else if (regex.test(map)) {
          map = replace(map, val)
      } else {
        // Si la llave se llama distinto pero el valor
        // se encuentra en scope o no reconoce que la llave
        // y el valor se llaman igual por que vienen entre comillas
        map = replace(map, val, scope[val], true)
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
  // recibe cuatro parametros de los cuales dos son
  // requeridos y los ultimos dos son opcionales
  function replace(str, rem, new_val, double) {
    // El valor con en el cual se va a remplazar
    var replace = ''
    // Se verifica que new_val haya sido embiado
    if (new_val != null) {
      // Si el valor es numerico se remplaza sin ser procesado
      // para JSON.parse lo siga respetando como numerico
      if (typeof(new_val) == 'number') {
        replace = new_val
      } else {
        replace = JSON.stringify(new_val)
      }
    } else {
      // Igual que con new_val se hace la misma validación
      // solo que con una expresión regular ya que esta rem
      // viene como string
      if ((/[0-9]/g).test(rem)) {
        replace = rem
      } else if((/"|'/g).test(rem)){
        // Si ya vienen entre comillas ya no tiene caso
        // aplicar stringify
        replace = rem
      } else {
        replace = JSON.stringify(rem)
      }
    }
    if (double) {
      // Si el objeto tiene algun elemento donde la
      // llave y valor se llamen igual {num:num} o {"num":num}
      // se crea una expresión regular especial para este caso
      regexp = new RegExp(`(${rem}(?!"|:))`, 'g')
    } else {
      regexp = new RegExp(`(${rem})`)
    }
    // Se remplazan los elementos, según los
    // parametros evaluados anteriormente
    str = str.replace(regexp, replace)
    return str
  }

  try {
    if (typeof(JSON.parse(map)) == 'object') {
      return JSON.parse(map)
    }
  } catch (e) {
    console.log(e, map)
  }
}
