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

  onInitialize: function () {
    this.injector.map('JobCollection').to(JobCollection);
    this.injector.map('Job').to(Job);
    this.injector.map('Space.jobQueue.EventPublisher').asSingleton();
    if(this._isLogging())
      this.injector.map('Space.jobQueue.Logger').asSingleton()
  },

  afterInitialize: function () {
    this._setupQueue();
    this.injector.create('Space.jobQueue.EventPublisher');
    if(this._isLogging())
      this.injector.create('Space.jobQueue.Logger')
  },

  onStart: function () {
    this.injector.get('Space.jobQueue.Jobs').startJobServer();
    this._allowAccess();
  },

  onStop: function () {
    this.injector.get('Space.jobQueue.Jobs').shutdownJobServer();
  },

  onReset: function () {
    this.injector.get('Space.jobQueue.Jobs').remove({});
  },

  // ============= PRIVATE METHODS =============

  _setupQueue: function () {
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

  _isLogging: function () {
    return this.configuration.jobQueue.log.enabled
  },

  _allowAccess: function () {
    this.injector.get('Space.jobQueue.Jobs').allow({
      worker: function (userId, method, params) {
        if(userId) {
          return true
        } else {
          return false
        }
      },
      creator: function (userId, method, params) {
        if(userId) {
          return true
        } else {
          return false
        }
      }
    })
  },

  _collectionOptions: function () {
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

  _externalMongo: function () {
    if(Space.getenv('SPACE_JQ_MONGO_URL', '').length > 0) return true;
  },

  _externalMongoNeedsOplog: function () {
    if(Space.getenv('SPACE_JQ_MONGO_OPLOG_URL', '').length > 0) return true;
  }

});
