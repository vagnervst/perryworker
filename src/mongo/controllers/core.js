import chalk from 'chalk';

function ControllerCore(Model) {

  return {
    save: (spec, callback) => {
      return new Promise( (resolve, reject) => {
          let newDocument = new Model(spec);
          newDocument.save( (error, document) => {
            if( error ) {

              const DUPLICATE_KEY = 11000;
              if( error.code === DUPLICATE_KEY ) {

                Model.findOne(spec)
                .then( existentDocument => {
                  resolve(existentDocument);
                });

              } else {
                console.log( chalk.red('Mongo operation failed:') + ' ' + error );
              }

            } else {
              resolve( document );
            }
          });
      });
    },
    find: function(spec, callback) {
      return new Promise( (resolve, reject) => {
        Model.find(spec)
        .then( foundDocument => {
          resolve(foundDocument);
        })
        .catch( err => {
          console.log(chalk.red('Mongo operation failed:') + ' ' + err)
        });
      });
    }
  }
}

export default ControllerCore;
