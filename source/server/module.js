Space.jobQueue = Space.Module.define('Space.jobQueue', {

  requiredModules: ['Space.messaging'],

  dependencies: {
    mongoInternals: 'MongoInternals'
  },

  configuration: Space.getenv.multi({
    jobQueue: {
      log: {
        enabled: ['SPACE_JQ_LOG_ENABLED', true, 'bool']
      }
    }
  }),

  jobCollection: null,

  // ============= LIFECYCLE =============

  onInitialize() {
    this.injector.map('JobCollection').to(JobCollection);
    this.injector.map('Job').to(Job);
    this.injector.map('Space.jobQueue.EventPublisher').asSingleton();
    if(this._isLogging())
      this.injector.map('Space.jobQueue.Logger').asSingleton()
    this._setupQueue();
  },

  afterInitialize() {
    this.injector.create('Space.jobQueue.EventPublisher');
    if(this._isLogging())
      this.injector.create('Space.jobQueue.Logger')
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
    var Collection;
    var JobCollection = this.injector.get('JobCollection');
    if(Space.jobQueue.jobCollection) {
      Collection = Space.jobQueue.jobCollection
    } else {
      var colletionName = Space.getenv('SPACE_JQ_COLLECTION_NAME', 'space_jobQueue')
      Collection = new JobCollection(colletionName, this._collectionOptions());
      Space.jobQueue.jobCollection = Collection;
    }
    this.injector.map('Space.jobQueue.Jobs').to(Collection);
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

  _collectionOptions() {
    var driverOptions;
    if(this._externalMongo()) {
      if(this._externalMongoNeedsOplog()) {
        driverOptions = {oplogUrl: Space.getenv('SPACE_JQ_MONGO_OPLOG_URL')};
      } else {
        driverOptions = {};
      }
      var mongoUrl = Space.getenv('SPACE_JQ_MONGO_URL');
      return {_driver: new this.mongoInternals.RemoteCollectionDriver(mongoUrl, driverOptions)};
    } else {
      return {}
    }
  },

  _externalMongo() {
    if(Space.getenv('SPACE_JQ_MONGO_URL', '').length > 0) return true;
  },

  _externalMongoNeedsOplog() {
    if(Space.getenv('SPACE_JQ_MONGO_OPLOG_URL', '').length > 0) return true;
  }

});
