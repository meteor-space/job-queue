describe("Space.jobQueue", function() {

  beforeEach(function() {
    this.myApp = new MyApp();
    this.eventBus = this.myApp.eventBus;
  });

  afterEach(function() {
    this.myApp.reset();
  });

  describe("Initialization", function() {

    it("makes injector mappings", function() {
      expect(this.myApp.injector.get('JobCollection')).to.exist
      expect(this.myApp.injector.get('Job')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerController')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.Jobs')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.ConnectedWorkers')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerStatsController')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerStats')).to.exist
    });

  });

  describe("Lifecycle", function() {

    it("Starts the jobServer when the module starts", function() {
      let jobServerStarted = sinon.spy();
      this.myApp.eventBus.subscribeTo('Space.jobQueue.JobServerStarted', jobServerStarted)
      this.myApp.start();
      expect(jobServerStarted).to.have.been.calledOnce
    });

    it("Stops the jobServer when the module stops", function() {
      let jobServerShutdown = sinon.spy();
      this.myApp.eventBus.subscribeTo('Space.jobQueue.JobServerShutdown', jobServerShutdown)
      this.myApp.start();
      this.myApp.stop();
      expect(jobServerShutdown).to.have.been.calledOnce
    });

  });

});
