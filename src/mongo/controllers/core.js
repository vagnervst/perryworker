import chalk from 'chalk';
import Promise from 'bluebird';

function ControllerCore(Model) {

  return {
    save: (spec) => {
      return Model.findOne(spec)
      .then( foundDocument => {

        if( foundDocument ) {
          return foundDocument;
        }

        let newDocument = new Model(spec);
        return newDocument.save()
        .then( result => result )
        .catch( err => console.log(chalk.red('Mongo Operation: ') + err));
      });
    }
  }
}

export default ControllerCore;
