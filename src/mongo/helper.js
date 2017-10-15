function Helpers() {

  function isPromise(obj) {
    return ( obj && obj.then !== undefined );
  }

  function isArray(obj) {
    return ( obj && obj.constructor === Array );
  }

  function findPromises(obj) {

    let foundPromises = [];
    if( isArray(obj) ) {

      for( let i = 0; i < obj.length; i += 1 ) {
        if( isPromise(obj[i]) ) {
          foundPromises.push( obj[i] );
        }
      }

    } else {
      if( isPromise(obj) ) {
        foundPromises.push( obj );
      }
    }

    return foundPromises;
  }

  return {
    /**
      @param {Object} spec
      @param {Object} spec.obj
      @param {Object} spec.controller
    */
    resolve: function( spec, callback ) {

      let propertiesWithPromises = [];
      for( let property in spec.obj ) {
        let foundPromises = findPromises(spec.obj[property]);
        if( foundPromises.length > 0 ) {
          propertiesWithPromises.push({ promises: Promise.all( findPromises(spec.obj[property]) ), property });
        }
      }

      let promises = propertiesWithPromises.map( item => item.promises );

      return Promise.all(promises)
      .then( mongoItems => {

        for(let i = 0; i < propertiesWithPromises.length; i += 1) {
          spec.obj[propertiesWithPromises[i].property] = mongoItems[i].map( item => item._id );
        }

        spec.controller.save(spec.obj)
        .then( mongoItem => {

          if( callback ) {
            callback(mongoItem);
          }

        })
        .catch( err => console.log(err));
      });
      
    }
  }
}

export default Helpers;
