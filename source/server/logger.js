Space.Object.extend(Space.jobQueue, 'Logger', {

  mixin: [
    Space.messaging.EventSubscribing
  ],

  dependencies: {
    configuration: 'configuration',
    log: 'log'
  },

  _state: null,
  _eventSubscriptions: null,

  onDependenciesReady() {
    this._eventSubscriptions = [];
    let config = this.configuration.jobQueue;
    if(config.log.enabled) {
      this._state = 'enabled';
      this._eventSubscriptions.push({
        [Space.jobQueue.JobServerStarted]() {
          this.log.info(`Job Server Started`);
        },
        [Space.jobQueue.JobServerShutdown]() {
          this.log.info(`Job Server shutdown`);
        },
        [Space.jobQueue.JobRequestedByWorker]() {
          this.log.info(`Job requested by worker`);
        },
        [Space.jobQueue.JobRemoved]() {
          this.log.info(`Job removed`);
        },
        [Space.jobQueue.JobPaused]() {
          this.log.info(`Job paused`);
        },
        [Space.jobQueue.JobResumed]() {
          this.log.info(`Job resumed`);
        },
        [Space.jobQueue.JobsReady](event) {
          this.log.info(`Previously waiting job/s are now ready`, event);
        },
        [Space.jobQueue.JobCancelled]() {
          this.log.warning(`Job cancelled`);
        },
        [Space.jobQueue.JobRestarted]() {
          this.log.info(`Job restarted`);
        },
        [Space.jobQueue.JobAdded](event) {
          this.log.info(`${event.type} job added`);
        },
        [Space.jobQueue.JobRerun]() {
          this.log.info(`Job rerun`);
        },
        [Space.jobQueue.JobProgressed]() {
          this.log.info(`Job progressed`);
        },
        [Space.jobQueue.JobLogAdded]() {
          this.log.info(`Job log added`);
        },
        [Space.jobQueue.JobCompleted]() {
          this.log.info(`Job completed`);
        },
        [Space.jobQueue.JobFailed]() {
          this.log.warning(`Job failed`);
        }
      })
    }
    Space.Object.prototype.onDependenciesReady.call(this);
  },

  eventSubscriptions() {
    return this._eventSubscriptions
  }

});
