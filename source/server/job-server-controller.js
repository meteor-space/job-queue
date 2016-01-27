Space.Object.extend('Space.jobQueue.JobServerController', {

  dependencies: {
    _: 'underscore',
    configuration: 'configuration',
    injector: 'Injector',
    mongoInternals: 'MongoInternals',
    jobCollection: 'JobCollection'
  },

  jobs: null,

  mixin: [
    Space.messaging.CommandHandling,
    Space.messaging.EventPublishing
  ],

  onDependenciesReady() {
    this._setupJobCollection();
    this._setPromoteInterval();
    this._allowAccess();
  },

  _setupJobCollection() {
    let jc;
    if(Space.jobQueue.JobServerController.jobCollection !== undefined) {
      jc = Space.jobQueue.JobServerController.jobCollection;
    } else {
      let name = Space.getenv('SPACE_JQ_COLLECTION_NAME', 'space_jobQueue_jobs');
      jc = new this.jobCollection(name, this._jobCollectionOptions());
      Space.jobQueue.JobServerController.jobCollection = jc;
    }
    this.jobs = jc;
    this.injector.map('Space.jobQueue.Jobs').to(jc);
  },

  _setPromoteInterval(command) {
    // All instances trigger a promote check for redundancy and load balancing
    // If the startJobServer calls are staggered evenly
    // at least once instance should trigger at the configured interval;
    let instances = this.configuration.jobQueue.serverInstanceQty;
    let promoteInterval = this.configuration.jobQueue.promoteInterval;
    let interval = instances * promoteInterval;
    this.jobs.promote(interval);
    this.publish(new Space.jobQueue.JobServerPromoteIntervalSet({
      collection: this.jobs._name,
      interval: interval
    }));
  },

  _allowAccess() {
    this.jobs.allow({
      worker(userId, method, params) {
        if(userId) {
          return true
        } else {
          return false
        }
      },
      creator(userId, method, params) {
        if(userId) {
          return true
        } else {
          return false
        }
      }
    });
  },

  _jobCollectionOptions() {
    let options = { noCollectionSuffix: true};
    if(this._externalMongo()) {
      let driverOptions = {};
      if(this._externalMongoNeedsOplog()) {
        this._.extend(driverOptions, { oplogUrl: Space.getenv('SPACE_JQ_MONGO_OPLOG_URL') });
      }
      let mongoUrl = Space.getenv('SPACE_JQ_MONGO_URL');
      let driver = new this.mongoInternals.RemoteCollectionDriver(mongoUrl, driverOptions);
      this._.extend(options, { _driver: driver });
    }
    return options
  },

  _externalMongo() {
    if(Space.getenv('SPACE_JQ_MONGO_URL', '').length > 0) return true;
  },

  _externalMongoNeedsOplog() {
    if(Space.getenv('SPACE_JQ_MONGO_OPLOG_URL', '').length > 0) return true;
  }

});
