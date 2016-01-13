describe("Space.jobQueue - Integration", function () {

  MyApp = Space.Application.define('MyApp', {
    requiredModules: ['Space.jobQueue']
  });

  beforeEach(function () {
    this.myApp = new MyApp()
  });

  afterEach(function () {
    this.myApp.reset();
  });

  describe("Initialization", function () {

    it("makes injector mappings", function () {
      expect(this.myApp.injector.get('JobCollection')).to.exist
      expect(this.myApp.injector.get('Job')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerController')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.Jobs')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.ConnectedWorkers')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerStatsController')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.JobServerStats')).to.exist
    });

  });

});
