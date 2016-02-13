(function() {
  'use strict';

  describe('service mockarooData', function() {
    var mockarooData;
    var $httpBackend;
    var $log;

    beforeEach(module('angulp1'));
    beforeEach(inject(function(_mockarooData_, _$httpBackend_, _$log_) {
      mockarooData = _mockarooData_;
      $httpBackend = _$httpBackend_;
      $log = _$log_;
    }));

    it('should be registered', function() {
      expect(mockarooData).not.toEqual(null);
    });

    describe('apiHost variable', function() {
      it('should exist', function() {
        expect(mockarooData.apiHost).not.toEqual(null);
      });
    });

    describe('getCustomerData function', function() {
      it('should exist', function() {
        expect(mockarooData.getCustomerData).not.toEqual(null);
      });

      it('should return data', function() {
        $httpBackend.when('GET',  mockarooData.apiHost + '/download?key=015777f0&count=1').respond(200, [{pprt: 'value'}]);
        var data;
        mockarooData.getCustomerData(1).then(function(fetchedData) {
          data = fetchedData;
        });
        $httpBackend.flush();
        expect(data).toEqual(jasmine.any(Array));
        expect(data.length === 1).toBeTruthy();
        expect(data[0]).toEqual(jasmine.any(Object));
      });

      it('should define a limit per page as default value', function() {
        $httpBackend.when('GET',  mockarooData.apiHost + '/download?key=015777f0&count=5000').respond(200, new Array(30));
        var data;
        mockarooData.getCustomerData().then(function(fetchedData) {
          data = fetchedData;
        });
        $httpBackend.flush();
        expect(data).toEqual(jasmine.any(Array));
        expect(data.length === 30).toBeTruthy();
      });

      it('should log a error', function() {
        $httpBackend.when('GET',  mockarooData.apiHost + '/download?key=015777f0&count=1').respond(500);
        mockarooData.getCustomerData(1);
        $httpBackend.flush();
        expect($log.error.logs).toEqual(jasmine.stringMatching('XHR Failed for'));
      });
    });
  });
})();
