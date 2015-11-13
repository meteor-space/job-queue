
Space.jobQueue = Space.Module.define('Space.jobQueue', {

  Dependencies: {
    mongoInternals: 'MongoInternals'
  },

  jobsCollection: null,

  // ============= LIFECYCLE =============

  onInitialize: function() {
    this.injector.map('JobCollection').to(JobCollection);
    this.injector.map('Job').to(Job);
  },

  afterInitialize: function(){
    this._setupQueue();
    this._allowAccess();
  },

  onStart: function(){
    this.injector.get('Space.jobQueue.Jobs').startJobServer();
  },

  onStop: function(){
    this.injector.get('Space.jobQueue.Jobs').shutdownJobServer();
  },

  onReset: function(){
    this.injector.get('Space.jobQueue.Jobs').remove({});
  },

  // ============= PRIVATE METHODS =============

  _setupQueue: function() {
    var Collection;
    if(Space.jobQueue.jobsCollection){
      Collection = Space.jobQueue.jobsCollection
    } else {
      var colletionName = Space.getenv('SPACE_JOBQUEUE_COLLECTION_NAME', 'space_jobQueue')
      Collection = new JobCollection(colletionName, this._collectionOptions());
      Space.jobQueue.jobsCollection = Collection;
    }
    this.injector.map('Space.jobQueue.Jobs').to(Collection);
  },

  _allowAccess: function(){
    this.injector.get('Space.jobQueue.Jobs').allow({
      worker: function (userId, method, params){
        if(userId){
          return true
        } else {
          return false
        }
      },
      creator: function (userId, method, params){
        if(userId){
          return true
        } else {
          return false
        }
      }
    })
  },

  _collectionOptions: function() {
    var driverOptions;
    if(this._externalMongo()) {
      if(this._externalMongoNeedsOplog()) {
        driverOptions = {oplogUrl: Space.getenv('SPACE_JOBQUEUE_MONGO_OPLOG_URL')};
      } else {
        driverOptions = {};
      }
      var mongoUrl = Space.getenv('SPACE_JOBQUEUE_MONGO_URL');
      return {_driver: new this.mongoInternals.RemoteCollectionDriver(mongoUrl, driverOptions)};
    } else {
      return {}
    }
  },

  _externalMongo: function(){
    if(Space.getenv('SPACE_JOBQUEUE_MONGO_URL', '').length > 0) return true;
  },

  _externalMongoNeedsOplog: function(){
    if(Space.getenv('SPACE_JOBQUEUE_MONGO_OPLOG_URL', '').length > 0) return true;
  }

});
