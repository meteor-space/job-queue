Space.jobQueue = Space.Module.define('Space.jobQueue', {

  requiredModules: ['Space.messaging'],

  configuration: Space.getenv.multi({
    jobQueue: {
      log: {
        enabled: ['SPACE_JQ_LOG_ENABLED', false, 'bool'],
        mode: ['SPACE_JQ_LOG_MODE', 'normal', 'string']
      },
      promoteInterval: ['SPACE_JQ_PROMOTE_INTERVAL', 15000, 'int'],
      serverInstanceQty: ['SPACE_JQ_SERVER_INSTANCE_QTY', 1, 'int'],
      remoteAccess: {
        enabled: ['SPACE_JQ_REMOTE_ACCESS_ENABLED', true, 'bool'],
        publish: ['SPACE_JQ_REMOTE_ACCESS_PUBLISH', true, 'bool']
      },
      stats: {
        jobServer: {
          publish: ['SPACE_JQ_STATS_JOB_SERVER_PUBLISH', false, 'bool']
        },
        connectedWorkers: {
          publish: ['SPACE_JQ_STATS_CONNECTED_WORKERS_PUBLISH', false, 'bool']
        }
      }
    }
  }),

  singletons: [
    'Space.jobQueue.JobServer',
    'Space.jobQueue.EventPublisher',
    'Space.jobQueue.Logger',
    'Space.jobQueue.Publications'
  ],

  // ============= LIFECYCLE =============

  onInitialize() {
    this.injector.map('JobCollection').to(JobCollection);
    this.injector.map('Job').to(Job);
  },

  onStart() {
    this.injector.get('Space.jobQueue.Jobs').startJobServer();
  },

  onStop() {
    this.injector.get('Space.jobQueue.Jobs').shutdownJobServer();
  },

  onReset() {
    this.injector.get('Space.jobQueue.Jobs').remove({});
    this.injector.get('Space.jobQueue.ConnectedWorkers').remove({});
    this.injector.get('Space.jobQueue.JobServerStats').remove({});
  }

});
