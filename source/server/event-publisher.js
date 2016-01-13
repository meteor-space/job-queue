Space.Object.extend(Space.jobQueue, 'EventPublisher', {

  mixin: [
    Space.messaging.EventPublishing
  ],

  dependencies: {
    jobCollection: 'Space.jobQueue.Jobs'
  },

  onDependenciesReady() {
    this.jobCollection.events.on('call', (message) => {
      switch(message.method) {
        case 'startJobServer':
          this.publish(new Space.jobQueue.JobServerStarted({
            collection: this.jobCollection._name
          }));
          break;
        case 'shutdownJobServer':
          this.publish(new Space.jobQueue.JobServerShutdown({
            collection: this.jobCollection._name
          }));
          break;
        case 'getWork':
          this.publish(new Space.jobQueue.JobRequestedByWorker({
            collection: this.jobCollection._name,
            jobTypesRequested: message.params[0],
            connection: message.connection
          }));
          break;
        case 'jobRemove':
          this.publish(new Space.jobQueue.JobRemoved({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobPause':
          this.publish(new Space.jobQueue.JobPaused({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobResume':
          this.publish(new Space.jobQueue.JobResumed({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobCancel':
          this.publish(new Space.jobQueue.JobCancelled({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobRestart':
          this.publish(new Space.jobQueue.JobRestarted({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobSave':
          this.publish(new Space.jobQueue.JobAdded({
            collection: this.jobCollection._name,
            type: message.params[0].type
          }));
          break;
        case 'jobRerun':
          this.publish(new Space.jobQueue.JobRerun({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobProgress':
          this.publish(new Space.jobQueue.JobProgressed({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobLog':
          this.publish(new Space.jobQueue.JobLogAdded({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobDone':
          this.publish(new Space.jobQueue.JobCompleted({
            collection: this.jobCollection._name
          }));
          break;
        case 'jobFail':
          this.publish(new Space.jobQueue.JobFailed({
            collection: this.jobCollection._name
          }));
          break;
      }
    });
    Space.Object.prototype.onDependenciesReady.call(this);
  }

});
