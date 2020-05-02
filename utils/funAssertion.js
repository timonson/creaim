function deepEqual(x, y) {
  const message = `expected '${x}' to equal '${y}'`
  class customError extends Error {
    constructor(name, message) {
      super(message)
      this.name = name
      this.date = new Date()
    }
  }
  if (x === y) {
    return true
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length)
      throw new customError("AssertionError", message)

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop]))
          throw new customError("AssertionError", message)
      } else throw new customError("AssertionError", message)
    }

    return true
  } else throw new customError("AssertionError", message)
}

export { deepEqual }
