Space.jobQueue = Space.Module.define('Space.jobQueue', {

  requiredModules: ['Space.messaging'],

  dependencies: {
    mongoInternals: 'MongoInternals',
    _: 'underscore'
  },

  configuration: Space.getenv.multi({
    jobQueue: {
      log: {
        enabled: ['SPACE_JQ_LOG_ENABLED', true, 'bool']
      },
      serverStats: {
        enabled: ['SPACE_JQ_SERVER_STATS_ENABLED', true, 'bool'],
        publish: ['SPACE_JQ_SERVER_STATS_PUBLISH', true, 'bool']
      },
      remoteAccess: {
        enabled: ['SPACE_JQ_REMOTE_ACCESS_ENABLED', true, 'bool'],
        publish: ['SPACE_JQ_REMOTE_ACCESS_PUBLISH', true, 'bool']
      }
    }
  }),

  jobCollection: null,

  singletons: [
    'Space.jobQueue.Publications'
  ],

  // ============= LIFECYCLE =============

  onInitialize() {
    this.injector.map('JobCollection').to(JobCollection);
    this.injector.map('Job').to(Job);
    this.injector.map('Space.jobQueue.EventPublisher').asSingleton();
    if(this._isLogging())
      this.injector.map('Space.jobQueue.Logger').asSingleton();
    this._setupQueue();
  },

  afterInitialize() {
    this.injector.create('Space.jobQueue.EventPublisher');
    if(this._isLogging())
      this.injector.create('Space.jobQueue.Logger');
  },

  onStart() {
    this.injector.get('Space.jobQueue.Jobs').startJobServer();
    this._allowAccess();
  },

  onStop() {
    this.injector.get('Space.jobQueue.Jobs').shutdownJobServer();
  },

  onReset() {
    this.injector.get('Space.jobQueue.Jobs').remove({});
  },

  // ============= PRIVATE METHODS =============

  _setupQueue() {
    let collection;
    let JobCollection = this.injector.get('JobCollection');
    if(Space.jobQueue.jobCollection) {
      collection = Space.jobQueue.jobCollection
    } else {
      let collectionName = Space.getenv('SPACE_JQ_COLLECTION_NAME', 'space_jobQueue_jobs');
      collection = new JobCollection(collectionName, this._jobCollectionOptions());
      Space.jobQueue.jobCollection = collection;
    }
    this.injector.map('Space.jobQueue.Jobs').to(collection);
  },

  _isLogging() {
    return this.configuration.jobQueue.log.enabled
  },

  _allowAccess() {
    this.injector.get('Space.jobQueue.Jobs').allow({
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
