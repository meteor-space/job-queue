Space.messaging.Publication.extend(Space.jobQueue, 'Publications', {

  dependencies: {
    queue: 'Space.jobQueue.Jobs',
    configuration: 'configuration',
    jobServerStats: 'Space.jobQueue.JobServerStats',
    connectedWorkers: 'Space.jobQueue.ConnectedWorkers',
    log: 'log'
  },

  _publications: null,

  onDependenciesReady() {
    this._publications = [];
    this._connectedWorkers = [];
    let config = this.configuration.jobQueue;

    if(config.remoteAccess.publish) {
      this._publications.push({
        'space-jobQueue-ready-jobs': (context, options) => {
          if(context.userId === null || context.userId === undefined) {
            context.stop();
            throw new Meteor.Error('Unauthorised Access');
          }

          let connection = context.connection;

          if(this._userIsWorker(context.userId)){
            check(options, Match.Optional({lastSessionId: String }));
            let lastSessionId = options.lastSessionId;
            this.log.info(`Space.jobQueue Worker subscribed to space-jobQueue-ready-jobs`);

            // Use the last session ID to cleanup any orphaned tracking docs
            if(lastSessionId != '' && this._isOrphaned(lastSessionId)) {
              this.log.info(`Cleaning up orphaned ConnectedWorkers session ${lastSessionId}`);
              this._clearWorkerSession(lastSessionId);
            }

            this._addWorkerSession(connection);

          } else {
            this.log.info(`Non-worker subscription made to space-jobQueue-ready-jobs`);
          }

          context.onStop(() => {
            if(context.userId !== undefined && this._userIsWorker(context.userId))
              this._clearWorkerSession(connection.id);
          });

          let query = {status: 'ready'};
          if(options.type !== undefined) {
            query.type = options.type
          }
          let cursor = this.queue.find(query);
          return cursor
        }
      });
    }

    if(config.stats.jobServer.publish) {
      this._publications.push({
        'space-jobQueue-job-server-stats': (context, options = {}) => {
          check(options, Object);
          // Logged in users only -> later will be capability-based
          if(context.userId === undefined) {
            throw new Meteor.Error('Unauthorised Access');
          }
          return this.jobServerStats.find();
        }
      });
    }

    if(config.stats.connectedWorkers.publish) {
      this._publications.push({
        'space-jobQueue-connected-workers': (context, options = {}) => {
          check(options, Object);
          // Logged in users only -> later will be capability-based
          if(context.userId === undefined) {
            throw new Meteor.Error('Unauthorised Access');
          }
          return this.connectedWorkers.find();
        }
      });
    }
    Space.messaging.Publication.prototype.onDependenciesReady.call(this);
  },

  publications() {
    return this._publications;
  },

  _userIsWorker(userId) {
    // Todo: Add alanning:roles
    //this.roles.userIsInRole(userId, ['subscribe-to-job-queue'])
    return true
  },

  _isOrphaned(sessionId) {
    if(this.connectedWorkers.find({ _id: sessionId }).count() > 0) {
      this.log.debug(`Orphaned Space.jobQueue.ConnectedWorkers document
      correlated by connection/session id ${sessionId} found`);
      return true;
    }
  },

  _clearWorkerSession(id) {
    this.connectedWorkers.remove({ _id: id });
    this.log.debug(`Worker connection/session id ${id}
    removed from Space.jobQueue.ConnectedWorkers`);
  },

  _addWorkerSession(connection) {
    check(connection, Match.ObjectIncluding({id: String}));
    this.connectedWorkers.insert({
      _id: connection.id,
      connection: connection
    });
    this.log.debug(`Worker connection/session id ${connection.id}
    added to Space.jobQueue.ConnectedWorkers`);
  }

});
