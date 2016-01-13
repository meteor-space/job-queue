describe("Space.jobQueue", function() {

  beforeEach(function() {
    this.myApp = new MyApp();
    let injector = this.myApp.injector;
    let job = injector.get('Job');
    this.jobCollection = injector.get('Space.jobQueue.Jobs');
    this.myJob = new job(this.jobCollection, 'myJobType', {
      someProp: 'someValue'
    });
    this.eventBus = this.myApp.eventBus;
  });

  afterEach(function() {
    this.myApp.reset();
  });

  describe("Job events", function() {

    it("reports when a job is requested by a worker", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobRequestedByWorker', spy);
      this.myApp.start();
      this.jobCollection.getWork('myJobType');
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is removed from the queue", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobRemoved', spy);
      this.myApp.start();
      this.myJob.save();
      this.myJob.cancel();
      this.myJob.remove();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is paused", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobPaused', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getJob(this.myJob._doc._id).pause();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is resumed", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobResumed', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getJob(this.myJob._doc._id).pause();
      this.jobCollection.getJob(this.myJob._doc._id).resume();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is cancelled", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobCancelled', spy);
      this.myApp.start();
      this.myJob.save();
      this.myJob.cancel();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is restarted", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobRestarted', spy);
      this.myApp.start();
      this.myJob.save();
      this.myJob.cancel();
      this.myJob.restart();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is added to the queue", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobAdded', spy);
      this.myApp.start();
      this.myJob.save();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is rerun", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobRerun', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getWork('myJobType')[0].done();
      this.myJob.rerun();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when jobs provide progress update", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobProgressed', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getWork('myJobType')[0].progress(50, 100);
      expect(spy).to.have.been.calledOnce
    });

    it("reports when jobs make a log entry", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobLogAdded', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getWork('myJobType')[0].log('Accessed supporting data');
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job is completed", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobCompleted', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getWork('myJobType')[0].done();
      expect(spy).to.have.been.calledOnce
    });

    it("reports when a job fails", function() {
      let spy = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobFailed', spy);
      this.myApp.start();
      this.myJob.save();
      this.jobCollection.getWork('myJobType')[0].fail();
      expect(spy).to.have.been.calledOnce
    });

  });

});
