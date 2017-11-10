
var bitcoinCalculator = angular.module('bitcoinCalculator', ['nvd3ChartDirectives'])
    .config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{a').endSymbol('a}');
      });
  bitcoinCalculator.controller('bitcoinController', function($scope, $http){
    // calling the api, grabbing the value for USD, appending it to the dom
    $http.get("https://bitpay.com/api/rates")
    .success(function(data){
      $scope.rates = data;
      for(var i=0;i<data.length;i++){
        if (data[i].code == "USD"){
          $scope.currRate = data[i].rate;
        }
      }
      $scope.initialAmt = 5000;
      $scope.newAmt = function(price){
        return price/$scope.currRate * $scope.initialAmt;
      };
      $scope.profit = function(price){
        return price/$scope.currRate * $scope.initialAmt - $scope.initialAmt;
      };
    });
    $scope.xAxisTickFormatFunction = function(){
      return function(date){
        return d3.time.format('%x')(new Date(date));
      };
    };
    
    $http.get("https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-01-09&end=2017-11-09")
      .success(function(data){
        $scope.bitCoinHistory = [];
        Object.keys(data.bpi).forEach(function(key,index){
          priceValue = data.bpi[key];
          dateValue = key;
          dateValueArray = dateValue.split("-");
          year = dateValueArray[0];
          month = dateValueArray[1];
          day = dateValueArray[2];
          dateObject = new Date(year,month,day).getTime();
          dataPair = [dateObject, priceValue];
          $scope.bitCoinHistory.push(dataPair);
        });
        $scope.bitcoinHistoricalData = [{
          "key": "Prices",
          "values": $scope.bitCoinHistory
        }];
      });
  });


