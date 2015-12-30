Space.Object.extend(Space.jobQueue, 'EventPublisher', {

  mixin: [
    Space.messaging.EventPublishing
  ],

  dependencies: {
    jobCollection: 'Space.jobQueue.Jobs'
  },

  onDependenciesReady() {
    var self = this;
    this.jobCollection.events.on('call', function (message) {
      switch(message.method) {
        case 'startJobServer':
          self.publish(new Space.jobQueue.JobServerStarted({
            collection: self.jobCollection._name
          }))
          break;
        case 'shutdownJobServer':
          self.publish(new Space.jobQueue.JobServerShutdown({
            collection: self.jobCollection._name
          }))
          break;
        case 'getWork':
          self.publish(new Space.jobQueue.JobTakenByWorker({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobRemove':
          this.publish(new Space.jobQueue.JobRemoved({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobPause':
          self.publish(new Space.jobQueue.JobPaused({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobResume':
          self.publish(new Space.jobQueue.JobResumed({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobReady':
          self.publish(new Space.jobQueue.JobReady({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobCancel':
          self.publish(new Space.jobQueue.JobCancelled({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobRestart':
          self.publish(new Space.jobQueue.JobRestarted({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobSave':
          self.publish(new Space.jobQueue.JobAdded({
            collection: self.jobCollection._name,
            type: message.params[0].type
          }))
          break;
        case 'jobRerun':
          self.publish(new Space.jobQueue.JobRerun({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobProgress':
          self.publish(new Space.jobQueue.JobProgressed({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobLog':
          self.publish(new Space.jobQueue.JobLogEntryMade({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobDone':
          self.publish(new Space.jobQueue.JobCompleted({
            collection: self.jobCollection._name
          }))
          break;
        case 'jobFail':
          self.publish(new Space.jobQueue.JobFailed({
            collection: self.jobCollection._name
          }))
          break;
      }
    });
  }

});
