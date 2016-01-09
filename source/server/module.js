Space.jobQueue = Space.Module.define('Space.jobQueue', {

  requiredModules: ['Space.messaging'],

  configuration: Space.getenv.multi({
    jobQueue: {
      log: {
        enabled: ['SPACE_JQ_LOG_ENABLED', true, 'bool']
      },
      remoteAccess: {
        enabled: ['SPACE_JQ_REMOTE_ACCESS_ENABLED', true, 'bool'],
        publish: ['SPACE_JQ_REMOTE_ACCESS_PUBLISH', true, 'bool']
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

  onStop() {
    this.injector.get('Space.jobQueue.Jobs').shutdownJobServer();
  },

  onReset() {
    this.injector.get('Space.jobQueue.Jobs').remove({});
    this.injector.get('Space.jobQueue.ConnectedWorkers').remove({});
  }

});
