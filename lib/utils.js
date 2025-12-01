export function createJsonldPrettyPrinter({preferOrder}) {
  return (key, value) => {
    let result = value;
    if(value instanceof Object && !(value instanceof Array)) {
      let sortedKeys = Object.keys(value).sort();
      let prettyKeys = [];

      for(let pkey of preferOrder) {
        if(value[pkey] !== undefined) {
          prettyKeys.push(pkey);
        }
      }
      for(let skey of sortedKeys) {
        if(!preferOrder.includes(skey)) {
          prettyKeys.push(skey);
        }
      }

      result = prettyKeys.reduce((sorted, key) => {
        sorted[key] = value[key];
        return sorted;
      }, {});
    }

    return result;
  }
}

export function getObjectByIdSuffix({didDocument, suffix}) {
  let rval = undefined;
  for(let property of Object.keys(didDocument)) {
    if(!Array.isArray(didDocument[property])) {
      continue;
    }
    for(let entry of didDocument[property]) {
      if(typeof entry !== 'object') {
        continue;
      }
      const idSuffix =
        entry.id.slice(entry.id.length - suffix.length, entry.id.length);
      if(suffix === idSuffix) {
        rval = entry;
      }
    }
  }

  return rval;
}

export function deleteObjectByIdSuffix({didDocument, suffix}) {
  let rval = undefined;
  for(let property of Object.keys(didDocument)) {
    if(!Array.isArray(didDocument[property])) {
      continue;
    }

    didDocument[property] = didDocument[property].filter((entry) => {
      if(typeof entry !== 'object') {
        return true;
      }
      const idSuffix =
        entry.id.slice(entry.id.length - suffix.length, entry.id.length);
      if(suffix !== idSuffix) {
        return true;
      } else {
        rval = entry;
        return false;
      }
    })
  }

  return rval;
}

export default {
  createJsonldPrettyPrinter,
  deleteObjectByIdSuffix,
  getObjectByIdSuffix
};
