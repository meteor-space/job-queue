Space.messaging.Publication.extend(Space.jobQueue, 'Publications', {

  dependencies: {
    queue: 'Space.jobQueue.Jobs',
    configuration: 'configuration',
    connectedWorkers: 'Space.jobQueue.ConnectedWorkers'
  },

  _publications: null,

  onDependenciesReady() {
    this._publications = [];
    this._connectedWorkers = [];
    let config = this.configuration.jobQueue;
    if(config.remoteAccess.publish) {
      this._publications.push({
        'space-jobQueue-ready-jobs': (context, options = {}) => {
          check(options, Object);
          // Logged in users only -> later will be capability-based
          if(context.userId === undefined) {
            throw new Meteor.Error('Unauthorised Access');
          }
          let connection = context.connection;
          this.connectedWorkers.upsert(connection.id, { $set: connection});

          context.onStop(() => {
            this.connectedWorkers.remove(context.connection.id);
          });

          let query = {status: 'ready'};
          if(options.type !== undefined) {
            query.type = options.type
          }
          return this.queue.find(query);
        }
      });
    }
    Space.messaging.Publication.prototype.onDependenciesReady.call(this);
  },

  publications() {
    return this._publications;
  }

});
