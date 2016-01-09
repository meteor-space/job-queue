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

  _state: null,
  _jobCollection: null,
  _connectedWorkers: null,

  onDependenciesReady() {
    this._setupJobCollection();
    this._setupConnectedWorkersCollection();
    this.state = this.injector.get('Space.jobQueue.Jobs').stopped ? 'stopped' : 'running';
    Space.Object.prototype.onDependenciesReady.call(this);
  },

  eventSubscriptions() {
    return [{
      [Space.jobQueue.JobServerStarted]: this._onJobServerStarted,
      [Space.jobQueue.JobServerShutdown]: this._onJobServerShutdown
    }]
  },

  _onJobServerStarted() {
    if(this.is('running'))
      throw new Space.jobQueue.InconsistentStateError('started','running');
    this._state = 'running';
  },

  _onJobServerShutdown() {
    if(this.is('stopped'))
      throw new Space.jobQueue.InconsistentStateError('shutdown','stopped');
    this._state = 'stopped';
  },

  is(expectedState) {
    if(this._state === expectedState) return true;
  },

  _setupJobCollection() {
    let collection;
    if(Space.jobQueue.JobServer._jobCollection) {
      collection = Space.jobQueue.JobServer._jobCollection
    } else {
      let collectionName = Space.getenv('SPACE_JQ_COLLECTION_NAME', 'space_jobQueue_jobs');
      collection = new this.jobCollection(collectionName, this._jobCollectionOptions());
      Space.jobQueue.JobServer._jobCollection = collection;
    }
    this.injector.map('Space.jobQueue.Jobs').to(collection);
  },

  _setupConnectedWorkersCollection() {
    this._connectedWorkers = new this.mongo.Collection('space_jobQueue_connectedClients')
    this.injector.map('Space.jobQueue.ConnectedWorkers').to(this._connectedWorkers);
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
