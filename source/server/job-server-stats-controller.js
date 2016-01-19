Space.Object.extend('Space.jobQueue.JobServerStatsController', {

  dependencies: {
    injector: 'Injector',
    mongo: 'Mongo'
  },

  stats: null,
  connectedWorkers: null,

  mixin: [
    Space.messaging.EventSubscribing
  ],

  onDependenciesReady() {
    this._setupCollection();
    this._setupConnectedWorkersCollection();
  },

  eventSubscriptions() {
    return [{
      [Space.jobQueue.JobServerStarted]: this._onJobServerStarted,
      [Space.jobQueue.JobServerShutdown]: this._onJobServerShutdown,
      [Space.jobQueue.JobServerPromoteIntervalSet]: this._onJobServerPromoteIntervalSet
    }]
  },

  _setupCollection() {
    // In-memory collection tracks the current jobServer instance state
    let collection;
    if(Space.jobQueue.JobServerStatsController.prototype.statsCollection !== undefined) {
      collection = Space.jobQueue.JobServerStatsController.prototype.statsCollection;
    } else {
      collection = new this.mongo.Collection('space_jobQueue_jobServerStats', { connection: null });
      Space.jobQueue.JobServerStatsController.prototype.statsCollection = collection;
    }
    this.stats = collection;
    this.injector.map('Space.jobQueue.JobServerStats').to(collection);
  },

  _setupConnectedWorkersCollection() {
    // Distributed and persistent collection
    // Tracks worker clients connected to all job server instances
    let collection;
    if(Space.jobQueue.JobServerStatsController.prototype.connectedWorkersCollection) {
      collection = Space.jobQueue.JobServerStatsController.prototype.connectedWorkersCollection;
    } else {
      collection = new this.mongo.Collection('space_jobQueue_connectedClients');
      Space.jobQueue.JobServerStatsController.prototype.connectedWorkersCollection = collection;
    }
    this.connectedWorkers = collection;
    this.injector.map('Space.jobQueue.ConnectedWorkers').to(collection);
  },

  _onJobServerStarted() {
    this._setState({ stopped: false });
  },

  _onJobServerShutdown() {
    this._setState({ stopped: true });
  },

  _onJobServerPromoteIntervalSet(event) {
    this._setState({ promoteInterval: event.interval });
  },

  _setState(obj) {
    this.stats.upsert(
      { _id: 1 }, { $set: obj }
    );
  }

});