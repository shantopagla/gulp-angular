(function() {
  'use strict';

  angular
    .module('angulp1')
    .factory('mockarooData', mockarooData);
  /** @ngInject */
  function mockarooData($log, $http) {
    var apiHost = 'https://mockaroo.com/e7995d70/';
    //https://mockaroo.com/e7995d70/download?count=5000&key=015777f0
    var service = {
      apiHost: apiHost,
      getCustomerData: getCustomerData
    };

    return service;

    function getCustomerData(limit) {
      if (!limit) {
        limit = 50;
      }

      return $http.get(apiHost + '/download?key=015777f0&count=' + limit)
        .then(getCustomerDataComplete)
        .catch(getCustomerDataFailed);

      function getCustomerDataComplete(response) {
        return response.data;
      }

      function getCustomerDataFailed(error) {
        $log.error('XHR Failed for getCustomerData.\n' + angular.toJson(error.data, true));
        var sampleData={
          "id": "3f096d23eac24df39a437ddead9402d8",
          "gender": "Male",
          "first_name": "Benjamin",
          "last_name": "Moreno",
          "email": "bmoreno0@illinois.edu",
          "signed_up": {
            "date": "11/15/2015"
          },
          "viewed_profile": {
            "date": "11/2/2015"
          },
          "viewed_item": {
            "date": "10/14/2015"
          },
          "purchased_item": {
            "date": "11/29/2015",
            "color": "Red"
          },
          "company_name": "Yoveo",
          "job_title": "Electrical Engineer"
        }
        return sampleData;
      }
    }
  }
})();