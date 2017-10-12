import mongoose from 'mongoose';
import chalk from 'chalk';

import models from './models';

mongoose.connect( 'mongodb://localhost/perryworker', { useMongoClient: true } );
mongoose.Promise = global.Promise;

console.log( chalk.green('PerryWorker') + ' started running...' );

mongoose.connection.close();
