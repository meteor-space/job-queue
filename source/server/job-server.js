Space.jobQueue.JobServer = Space.Object.extend(Space.jobQueue, 'JobServer', {

  mixin: [
    Space.messaging.EventSubscribing
  ],

  dependencies: {
    _: 'underscore',
    configuration: 'configuration',
    injector: 'Injector',
    mongoInternals: 'MongoInternals',
    mongo: 'Mongo',
    jobCollection: 'JobCollection'
  },

  onDependenciesReady() {
    this._setupJobServerStatsCollection();
    this._setupJobCollection();
    this._setupConnectedWorkersCollection();
    Space.Object.prototype.onDependenciesReady.call(this);
  },

  eventSubscriptions() {
    return [{
      [Space.jobQueue.JobServerStarted]: this._onJobServerStarted,
      [Space.jobQueue.JobServerShutdown]: this._onJobServerShutdown
    }]
  },

  _setupJobCollection() {
    let jc;
    if(Space.jobQueue.JobServer._jobCollection) {
      jc = Space.jobQueue.JobServer._jobCollection;
    } else {
      let collectionName = Space.getenv('SPACE_JQ_COLLECTION_NAME', 'space_jobQueue_jobs');
      jc = new this.jobCollection(collectionName, this._jobCollectionOptions());
      Space.jobQueue.JobServer._jobCollection = jc;
    }
    this.injector.map('Space.jobQueue.Jobs').to(jc);
    this._setState({ stopped: jc.stopped });
    this._setPromoteInterval();
    jc.allow({
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
    })
  },

  _setupJobServerStatsCollection() {
    // In-memory collection tracks the current jobServer instance state
    let collection;
    if(Space.jobQueue.JobServer._jobServerStats) {
      collection = Space.jobQueue.JobServer._jobServerStats;
    } else {
      collection = new this.mongo.Collection('space_jobQueue_jobServerStats', { connection: null});
      Space.jobQueue.JobServer._jobServerStats = collection;
    }
    this.injector.map('Space.jobQueue.JobServerStats').to(collection);
  },

  _setupConnectedWorkersCollection() {
    // Distributed and persistent collection
    // Tracks worker clients connected to all job server instances
    let collection;
    if(Space.jobQueue.JobServer._connectedWorkers) {
      collection = Space.jobQueue.JobServer._connectedWorkers;
    } else {
      collection = new this.mongo.Collection('space_jobQueue_connectedClients');
      Space.jobQueue.JobServer._connectedWorkers = collection;
    }
    this.injector.map('Space.jobQueue.ConnectedWorkers').to(collection);
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
  },

  _setPromoteInterval() {
    // All instances trigger a promote check for redundancy and load balancing
    // If the startJobServer calls are staggered evenly
    // at least once instance should trigger at the configured interval \
    let instances = this.configuration.jobQueue.serverInstanceQty;
    let promoteInterval = this.configuration.jobQueue.promoteInterval;
    let interval = instances * promoteInterval;
    this.injector.get('Space.jobQueue.Jobs').promote(interval);
    this._setState({promoteInterval: interval});
  },

  _onJobServerStarted() {
    this._setState({stopped: this.injector.get('Space.jobQueue.Jobs').stopped});
  },

  _onJobServerShutdown() {
    this._setState({stopped: this.injector.get('Space.jobQueue.Jobs').stopped});
  },

  _setState(obj) {
    this.injector.get('Space.jobQueue.JobServerStats').upsert(
      {_id: 1}, { $set: obj}
    );
  }

});
