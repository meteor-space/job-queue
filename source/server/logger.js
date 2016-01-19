Space.Object.extend('Space.jobQueue.Logger', {

  mixin: [
    Space.messaging.EventSubscribing
  ],

  dependencies: {
    configuration: 'configuration',
    log: 'log'
  },

  _state: null,
  _mode: null,
  _eventSubscriptions: null,

  onDependenciesReady() {
    let config = this.configuration.jobQueue;
    this._mode = config.log.mode;
    this._eventSubscriptions = [];
    if(config.log.enabled) {
      this._state = 'enabled';
      this._eventSubscriptions.push({
        [Space.jobQueue.JobServerStarted](event) {
          this._log('info', `Job Server Started`, event);
        },
        [Space.jobQueue.JobServerShutdown](event) {
          this._log('info', `Job Server shutdown`, event);
        },
        [Space.jobQueue.JobRequestedByWorker](event) {
          this._log('info', `Job requested by worker`, event);
        },
        [Space.jobQueue.JobRemoved](event) {
          this._log('info', `Job removed`, event);
        },
        [Space.jobQueue.JobPaused](event) {
          this._log('info', `Job paused`, event);
        },
        [Space.jobQueue.JobResumed](event) {
          this._log('info', `Job resumed`, event);
        },
        [Space.jobQueue.JobsReady](event) {
          this._log('info', `Previously waiting job/s are now ready`, event);
        },
        [Space.jobQueue.JobCancelled](event) {
          this._log('warning', `Job cancelled`, event);
        },
        [Space.jobQueue.JobRestarted](event) {
          this._log('info', `Job restarted`, event);
        },
        [Space.jobQueue.JobAdded](event) {
          this._log('info', `${event.type} job added`, event);
        },
        [Space.jobQueue.JobRerun](event) {
          this._log('info', `Job rerun`, event);
        },
        [Space.jobQueue.JobProgressed](event) {
          this._log('info', `Job progressed`, event);
        },
        [Space.jobQueue.JobLogAdded](event) {
          this._log('info', `Job log added`, event);
        },
        [Space.jobQueue.JobCompleted](event) {
          this._log('info', `Job completed`, event);
        },
        [Space.jobQueue.JobFailed](event) {
          this._log('warning', `Job failed`, event);
        }
      })
    }
    Space.Object.prototype.onDependenciesReady.call(this);
  },

  eventSubscriptions() {
    return this._eventSubscriptions
  },

  _log(type, message, event) {
    let messageElements = ['Space.jobQueue'];
    messageElements.push(event.collection);
    messageElements.push(message);
    if(this._mode === 'full') {
      this.log[type](messageElements.join(' : '), event)
    } else {
      this.log[type](messageElements.join(' : '))
    }
  }

});
