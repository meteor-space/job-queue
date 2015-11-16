Space.Object.extend(Space.jobQueue, 'EventPublisher', {

  dependencies: {
    jobCollection: 'Space.jobQueue.Jobs'
  },

  onDependenciesReady() {
    var self = this;
    this.jobCollection.events.on('call', function (message) {
      switch(message.method) {
        case 'startJobServer':
          self._onStartJobServer(message);
          break;
        case 'shutdownJobServer':
          self._onShutdownJobServer(message);
          break;
        case 'getWork':
          self._onGetWork(message);
          break;
        case 'jobRemove':
          self._onJobRemove(message);
          break;
        case 'jobPause':
          self._onJobPause(message);
          break;
        case 'jobResume':
          self._onJobResume(message);
          break;
        case 'jobReady':
          self._onJobReady(message);
          break;
        case 'jobCancel':
          self._onJobCancel(message);
          break;
        case 'jobRestart':
          self._onJobRestart(message);
          break;
        case 'jobSave':
          self._onJobSave(message);
          break;
        case 'jobRerun':
          self._onJobRerun(message);
          break;
        case 'jobProgress':
          self._onJobProgress(message);
          break;
        case 'jobLog':
          self._onJobLog(message);
          break;
        case 'jobDone':
          self._onJobDone(message);
          break;
        case 'jobFail':
          self._onJobFail(message);
          break;
      }
    });
  },

  _onStartJobServer() {
    this.publish(new Space.jobQueue.JobServerStarted({
      collection: this.jobCollection._name
    }))
  },
  _onShutdownJobServer() {
    this.publish(new Space.jobQueue.JobServerShutdown({
      collection: this.jobCollection._name
    }))
  },
  _onGetWork(message) {
    this.publish(new Space.jobQueue.JobTakenByWorker({
      collection: this.jobCollection._name
    }))
  },
  _onJobRemove(message) {
    this.publish(new Space.jobQueue.JobRemoved({
      collection: this.jobCollection._name
    }))
  },
  _onJobPause(message) {
    this.publish(new Space.jobQueue.JobPaused({
      collection: this.jobCollection._name
    }))
  },
  _onJobResume(message) {
    this.publish(new Space.jobQueue.JobResumed({
      collection: this.jobCollection._name
    }))
  },
  _onJobReady(message) {
    this.publish(new Space.jobQueue.JobReady({
      collection: this.jobCollection._name
    }))
  },
  _onJobCancel(message) {
    this.publish(new Space.jobQueue.JobCancelled({
      collection: this.jobCollection._name
    }))
  },
  _onJobRestart(message) {
    this.publish(new Space.jobQueue.JobRestarted({
      collection: this.jobCollection._name
    }))
  },
  _onJobSave(message) {
    this.publish(new Space.jobQueue.JobAdded({
      collection: this.jobCollection._name,
      type: message.params[0].type
    }))
  },
  _onJobRerun(message) {
    this.publish(new Space.jobQueue.JobRerun({
      collection: this.jobCollection._name
    }))
  },
  _onJobProgress(message) {
    this.publish(new Space.jobQueue.JobProgressed({
      collection: this.jobCollection._name
    }))
  },
  _onJobLog(message) {
    this.publish(new Space.jobQueue.JobLogEntryMade({
      collection: this.jobCollection._name
    }))
  },
  _onJobDone(message) {
    this.publish(new Space.jobQueue.JobCompleted({
      collection: this.jobCollection._name
    }))
  },
  _onJobFail(message) {
    this.publish(new Space.jobQueue.JobFailed({
      collection: this.jobCollection._name
    }))
  }

});

Space.jobQueue.EventPublisher.mixin(Space.messaging.EventPublishing);
