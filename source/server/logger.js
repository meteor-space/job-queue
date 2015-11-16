Space.Object.extend(Space.jobQueue, 'Logger', {

  dependencies: {
    log: 'log'
  },

  eventSubscriptions() {
    return [{
      'Space.jobQueue.JobServerStarted'() {
        this.log.info(`Job Server Started`);
      },
      'Space.jobQueue.JobServerShutdown'() {
        this.log.info(`Job Server shutdown`);
      },
      'Space.jobQueue.JobTakenByWorker'() {
        this.log.info(`Job taken by worker`);
      },
      'Space.jobQueue.JobRemoved'() {
        this.log.info(`Job removed`);
      },
      'Space.jobQueue.JobPaused'() {
        this.log.info(`Job paused`);
      },
      'Space.jobQueue.JobResumed'() {
        this.log.info(`Job resumed`);
      },
      'Space.jobQueue.JobReady'() {
        this.log.info(`Job ready`);
      },
      'Space.jobQueue.JobCancelled'() {
        this.log.warn(`Job cancelled`);
      },
      'Space.jobQueue.JobRestarted'() {
        this.log.info(`Job restarted`);
      },
      'Space.jobQueue.JobAdded'(event) {
        this.log.info(`${event.type} job added`);
      },
      'Space.jobQueue.JobRerun'() {
        this.log.info(`Job rerun`);
      },
      'Space.jobQueue.JobProgressed'() {
        this.log.info(`Job progressed`);
      },
      'Space.jobQueue.JobLogAdded'() {
        this.log.info(`Job log added`);
      },
      'Space.jobQueue.JobCompleted'() {
        this.log.info(`Job completed`);
      },
      'Space.jobQueue.JobFailed'() {
        this.log.warn(`Job failed`);
      }
    }]
  }

});

Space.jobQueue.Logger.mixin(Space.messaging.EventSubscribing);
