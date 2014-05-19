    /**
     * AngularJS module to process the login form.
     */
    var HealthyHomes = angular.module('HealthyHomes', ["checklist-model"]);

    HealthyHomes.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);

      HealthyHomes.controller('login', function ($scope, $http, $log, $timeout) {
        // Form submit handler.
        //var url = new String("schedule.html");
        $scope.submit = function(url) 
        {
          // Trigger validation flag.
          $scope.submitted = true;

          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.loginForm.$invalid) {
          $scope.message = 'Enter all required fields';
            return;
          }
           else 
        {
            $scope.message = '';
             $http.post(' http://testserver.comyr.com/login.php', {'uname': $scope.name, 'pswd': $scope.password}
                        ).success(function(data, status, headers, config) {
                            if (data.msg !== '')
                            {
                            sessionStorage.setItem('inspector', $scope.name);
                            window.location = "" + url;
                            $scope.message = data.msg;
                            }
                            else
                            {
                                $scope.message = data.error;
                            }
                        }).error(function(data, status) { 
                            $scope.message = data.error;
                        });
        }

        };
      });


      HealthyHomes.controller('schedule', function ($scope, $http, $log, $timeout) {

      $scope.message = 'Welcome ' + sessionStorage.getItem('inspector') ;

    //  $scope.loadSchedule = function(form) 
      //  {
            //alert("connecting");
            $http.post(' http://testserver.comyr.com/schedule.php', {'inspector': sessionStorage.getItem('inspector')}
                        ).success(function(data, status, headers, config) {
                             $scope.scheduler = data.schedule;
                        }).error(function(data, status) { 
                            $scope.message = 'error getting data';
                        });
        //};
    });

    HealthyHomes.controller('inspection', function ($scope, $http, $log, $timeout) {

    $scope.message = 'Welcome Inspector ' + sessionStorage.getItem('inspector') ;

       $http.post(' http://testserver.comyr.com/confidential.php', {'id': sessionStorage.getItem('inspectionHome')}
                        ).success(function(data, status, headers, config) {
                        //alert(data.msg);
                            if (data.msg !== '')
                            {
                             $scope.firstname = data.Fname;
                             $scope.lastname = data.Lname;
                             $scope.street = data.Street;
                             $scope.city = data.City;
                             $scope.zip = data.Zip;
                            }
                            else
                            {
                                $scope.message = '';
                            }
                        }).error(function(data, status) { 
                            $scope.message = 'error getting data';
                        });
    });

     HealthyHomes.controller('assessment', function ($scope, $http, $log, $timeout,$filter) {

     $scope.date = $filter("date")(Date.now(), 'yyyy-MM-dd');
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    
     $scope.time =  h + ":" + m;
    $scope.initial = sessionStorage.getItem('inspector');
    $scope.submit = function(url) 
  {
        
        // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and let AngularJS show validation errors.
      if ($scope.cover_sheet.$invalid) {
         
      $scope.message = 'Enter all required fields';
        return;
      }
       else 
       {
        
        $http.post('https://localhost/dbconnectphp/connect.php', {'utemp': $scope.temp, 'urh': $scope.rh, 'uprep': $scope.prep }
                    ).success(function(data, status, headers, config) {
                       // window.location = "" + url;
                        $scope.message = 'database updated';
                    }).error(function(data, status) { 
                        $scope.message = 'Error updating database';
                    });
        }
    };
        
});

 HealthyHomes.controller('genNeighbourChar', function ($scope, $http, $log, $timeout,$filter) {

    $scope.sources = [
    {id: 1, text: 'Busy Street'},
    {id: 2, text: 'Highway'},
    {id: 3, text: 'Interstate Highway'},
    {id: 4, text: 'Railroad'},
    {id: 5, text: 'Industrial'},
    {id: 6, text: 'Powerplant'},
    {id: 7, text: 'Retail'}
  ];

  $scope.user = {
    sources : []
  };

  $scope.user1 = {
    sources : []
  };
  var prev5 = sessionStorage.getItem('prev5');

     if(prev5 == 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page5'));
            $scope.user.sources = JSON.parse(data.gn1s);
            $scope.user1.sources = JSON.parse(data.gn2s);
            $scope.gn1text = data.gn1t;
            $scope.gn2text = data.gn2t;
        }

    $scope.next = function(url) 
    {
        if(sessionStorage.getItem('prev5') == 'true')
        {
            $scope.message = 'Already updated';
            window.location = "" + url;
        }
        else
        {
        var gn1_sources = JSON.stringify($scope.user.sources);
        var gn2_sources = JSON.stringify($scope.user1.sources);

         var storeData = JSON.stringify({'id': sessionStorage.getItem('inspectionHome'), 'gn1s' : gn1_sources, 'gn2s' : gn2_sources,'gn1t' : $scope.gn1text , 'gn2t' : $scope.gn2text});

        sessionStorage.setItem('page5', storeData);
        sessionStorage.setItem('prev5' , true);  
        //alert('Hello');
             $http.post(' http://testserver.comyr.com/gnchar.php', {'id': sessionStorage.getItem('inspectionHome'), 'gn1s' : gn1_sources, 'gn2s' : gn2_sources,                                                                'gn1t' : $scope.gn1text , 'gn2t' : $scope.gn2text , 'prevFlag' : sessionStorage.getItem('prev')}
                    ).success(function(data, status, headers, config) {
                            //alert('success');
                            $scope.message = 'Database Updated';
                            window.location = "" + url;
                        }).error(function(data, status) { 
                                $scope.message = 'Error connecting to database';
                               // alert('failed to connect to database');
                            });    
        }
    };

  });

 HealthyHomes.controller('buildingCharB1B2B3', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev6') == 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page6'));
            $scope.year_built = data.b1_year;
            $scope.built = data.b1_yoption;
            $scope.year_renovated = data.b2_year;
            $scope.desc = data.b2_desc;
            $scope.building = data.b3_type;
        }

        $scope.next = function(url) 
        {
          $scope.submitted = true;

            if($scope.built !== undefined) 
            $scope.radio = false;

            if($scope.building !== undefined)
             $scope.radio1 = false;

          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b1b2b3.$invalid) {

              if($scope.built === undefined)
               $scope.radio = true;

               if($scope.building === undefined)
                    $scope.radio1 = true;
          $scope.message = 'Enter all required fields';
            return;
          }
           else 
          {
               var storeData = JSON.stringify({
                'b1_year' : $scope.year_built, 
                'b1_yoption' : $scope.built, 
                'b2_year' : $scope.year_renovated, 
                'b2_desc' : $scope.desc , 
                'b3_type' : $scope.building
              });
               sessionStorage.setItem('page6',storeData);
               sessionStorage.setItem('prev6' , true); 
               window.location = "" + url;
          }

        };

    });
 HealthyHomes.controller('buildingCharB4B5', function ($scope, $http, $log, $timeout,$filter) {

        $scope.sources = [
        {id: 1, text: 'Roof Problems'},
        {id: 2, text: ' Missing siding/Brick'},
        {id: 3, text: 'Cracks in Foundation grade'},
        {id: 4, text: 'Visible sources of Leaks into home'},
        {id: 5, text: 'Standing water at Foundation'},
        {id: 6, text: 'Vents not screened'},
        {id: 7, text: 'Debris/Garbage'},
        {id: 8, text: 'Handrails on Stairs(if>3 steps)'}
      ];

         $scope.sources1 = [
        {id: 1, text: 'Space heaters'},
        {id: 2, text: ' Oil'},
        {id: 3, text: 'Wood/Fireplace'},
        {id: 4, text: 'Baseboards'},
        {id: 5, text: 'Natural gas'},
        {id: 6, text: 'Unvented combustion heaters'},
      ];


      $scope.user = {
        sources : []
      };

      $scope.user1 = {
        sources1 : []
      };

     if(sessionStorage.getItem('prev7') == 'true')
        {

            var data = JSON.parse(sessionStorage.getItem('page7'));

            $scope.user.sources = JSON.parse(data.B4obs);
            $scope.user1.sources1 = JSON.parse(data.B5sources);
            $scope.veg = data.B4veg;
            $scope.others = data.B5desc;
        }

     $scope.next = function(url) 
        {
          // Trigger validation flag.
            $scope.submitted = true;
            $scope.checkbox = false;
            $scope.checkbox1 = false;

          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b4b5.$invalid)
          {

               if(JSON.stringify($scope.user.sources) == "[]")
              {

                  $scope.checkbox = true;

              }
              if(JSON.stringify($scope.user1.sources1) == "[]")
              {
                   $scope.checkbox1 = true;
              }

          $scope.message = 'Enter all required fields';
            return;
          }
           else 
        {

            var B4_sources = JSON.stringify($scope.user.sources);
            var B5_sources = JSON.stringify($scope.user1.sources1);
            var B4_images = sessionStorage.getItem('B4ImageArray') ? sessionStorage.getItem('B4ImageArray') : '[]' ;
            var B5_images = sessionStorage.getItem('B5ImageArray') ? sessionStorage.getItem('B5ImageArray') : '[]' ;

            var storeData = JSON.stringify({'id': sessionStorage.getItem('inspectionHome'), 
              'B4obs' : B4_sources, 
              'B4veg' : $scope.veg,
              'B4images': B4_images,
              'B5sources' : B5_sources, 
              'B5desc' : $scope.others,
              'B5images': B5_images
            });

            sessionStorage.setItem('page7', storeData);
            sessionStorage.setItem('prev7' , true); 
            window.location = "" + url;   
        }


        };   
    });
    HealthyHomes.controller('buildingCharB6', function ($scope, $http, $log, $timeout,$filter) {


     if(sessionStorage.getItem('prev8') === 'true')
        {

            var data = JSON.parse(sessionStorage.getItem('page8'));

            $scope.built1 = data.B6_1;
            $scope.built2 = data.B6_2;
            $scope.built3 = data.B6_3;
            $scope.built4 = data.B6_vent_45s;
            $scope.built5 = data.B6_vent_60s; 
            $scope.built6 = data.B6_4;
            $scope.built7 = data.B6_CO_45s;
            $scope.built8 = data.B6_CO_60s;
            $scope.built9 = data.B6_5;

        }

        $scope.next = function(url) 
          {
          // Trigger validation flag.         
              $scope.submitted = true;

              $scope.radio = false;
              $scope.radio1 = false;
              $scope.radio2 = false;

          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b6.$invalid) {

              if($scope.built1 === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.built2 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.built3 === undefined)
              {
                  $scope.radio2 = true;
              }  

          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
              if ($scope.built6 === undefined)
              {
                  $scope.built6 = 'No option';
              }

              if ($scope.built9 === undefined)
              {
                  $scope.built9 = 'No option';
              }

              var B6_1images = sessionStorage.getItem('B6_1ImageArray') ? sessionStorage.getItem('B6_1ImageArray') : '[]' ;
              var B6_2images = sessionStorage.getItem('B6_2ImageArray') ? sessionStorage.getItem('B6_2ImageArray') : '[]' ;
              var B6_3images = sessionStorage.getItem('B6_3ImageArray') ? sessionStorage.getItem('B6_3ImageArray') : '[]' ;
              var B6_ventimages = sessionStorage.getItem('B6_ventImageArray') ? sessionStorage.getItem('B6_ventImageArray') : '[]' ;
              var B6_COimages = sessionStorage.getItem('B6_COImageArray') ? sessionStorage.getItem('B6_COImageArray') : '[]' ;
              var storeData = JSON.stringify({
                'id': sessionStorage.getItem('inspectionHome'),
                'B6_1' : $scope.built1,
                'B6_2' : $scope.built2,
                'B6_3' : $scope.built3, 
                'B6_vent_45s' : $scope.built4, 
                'B6_vent_60s' : $scope.built5, 
                'B6_4' :   $scope.built6,
                'B6_CO_45s' : $scope.built7,
                'B6_CO_60s' : $scope.built8,
                'B6_5' : $scope.built9,
                'B6_1images': B6_1images,
                'B6_2images': B6_2images,
                'B6_3images': B6_3images,
                'B6_ventimages': B6_ventimages,
                'B6_COimages': B6_COimages
              });

            sessionStorage.setItem('page8', storeData);
            sessionStorage.setItem('prev8' , true);  
            window.location = "" + url;   
          }

        };

    });

    HealthyHomes.controller('buildingCharB7', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev9') === 'true')
        {

            var data = JSON.parse(sessionStorage.getItem('page9'));

            $scope.built1 = data.B7_1;
            $scope.built2 = data.B7_2;
            $scope.built3 = data.B7_3;
            $scope.built10 = data.B7_4;
            $scope.built4 = data.B7_ventflow_45s;
            $scope.built5 = data.B7_ventflow_60s; 
            $scope.built7 = data.B7_CO_45s;
            $scope.built8 = data.B7_CO_60s;
        }

        $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;

             $scope.radio = false;
             $scope.radio1 = false;
             $scope.radio2 = false;
             $scope.radio3 = false;
            
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b7.$invalid) {

              if($scope.built1 === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.built2 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.built3 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.built10 === undefined)
              {
                  $scope.radio3 = true;
              } 

          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {

            var B7_1images = sessionStorage.getItem('B7_1ImageArray') ? sessionStorage.getItem('B7_1ImageArray') : '[]' ;
            var B7_2images = sessionStorage.getItem('B7_2ImageArray') ? sessionStorage.getItem('B7_2ImageArray') : '[]' ;
            var B7_3images = sessionStorage.getItem('B7_3ImageArray') ? sessionStorage.getItem('B7_3ImageArray') : '[]' ;
            var B7_4images = sessionStorage.getItem('B7_4ImageArray') ? sessionStorage.getItem('B7_4ImageArray') : '[]' ;
            var B7_ventimages = sessionStorage.getItem('B7_ventImageArray') ? sessionStorage.getItem('B7_ventImageArray') : '[]' ;
            var B7_COimages = sessionStorage.getItem('B7_COImageArray') ? sessionStorage.getItem('B7_COImageArray') : '[]' ;

            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'),
              'B7_1' : $scope.built1,
              'B7_2' : $scope.built2,
              'B7_3' : $scope.built3 ,
              'B7_4' : $scope.built10,
              'B7_ventflow_45s' : $scope.built4,
              'B7_ventflow_60s' :   $scope.built5,
              'B7_CO_45s' : $scope.built7,
              'B7_CO_60s' : $scope.built8,
              'B7_1images': B7_1images,
              'B7_2images': B7_2images,
              'B7_3images': B7_3images,
              'B7_4images': B7_4images,
              'B7_ventimages': B7_ventimages,
              'B7_COimages': B7_COimages
            });

            sessionStorage.setItem('page9', storeData);
            sessionStorage.setItem('prev9' , true);  
            window.location = "" + url;   
          }

        };

    });

  HealthyHomes.controller('buildingCharB8B9', function ($scope, $http, $log, $timeout,$filter) {


        if(sessionStorage.getItem('prev10') === 'true')
        {

            var data = JSON.parse(sessionStorage.getItem('page10'));

            $scope.built1 = data.B8_1;
            $scope.built2 = data.B8_2;
            $scope.built3 = data.B9_1;
            $scope.built4 = data.B9_2;

        }

        $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;

             $scope.radio = false;
             $scope.radio1 = false;
             $scope.radio2 = false;
             $scope.radio3 = false;



          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b8.$invalid) {

              if($scope.built1 === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.built2 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.built3 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.built4 === undefined)
              {
                  $scope.radio3 = true;
              } 

          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var B8_1images = sessionStorage.getItem('B8_1ImageArray') ? sessionStorage.getItem('B8_1ImageArray') : '[]' ;
            var B8_2images = sessionStorage.getItem('B8_2ImageArray') ? sessionStorage.getItem('B8_2ImageArray') : '[]' ;
            var B9_1images = sessionStorage.getItem('B9_1ImageArray') ? sessionStorage.getItem('B9_1ImageArray') : '[]' ;
            var B9_2images = sessionStorage.getItem('B9_2ImageArray') ? sessionStorage.getItem('B9_2ImageArray') : '[]' ;
               var storeData = JSON.stringify({
                'id': sessionStorage.getItem('inspectionHome'), 
                'B8_1' : $scope.built1, 
                'B8_2' : $scope.built2, 
                'B9_1' : $scope.built3 , 
                'B9_2' : $scope.built4,
                'B8_1images' : B8_1images,
                'B8_2images' : B8_2images,
                'B9_1images' : B9_1images,
                'B9_2images' : B9_2images
              });

              sessionStorage.setItem('page10', storeData);
              sessionStorage.setItem('prev10' , true);                  
              window.location = "" + url;   
          }

        };

    });

    HealthyHomes.controller('buildingCharB10', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev11') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page11'));
            $scope.built1 = data.B10_1;
            $scope.built2 = data.B10_2;
            $scope.built3 = data.B10_3;
            $scope.built4 = data.B10_4;
            $scope.built5 = data.B10_5;
            $scope.built6 = data.B10_6;
            $scope.after_15s = data.B10_15s;
            $scope.after_45s = data.B10_45s;
            $scope.wait = data.B10_30s; 
        }

         $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio = false;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
          $scope.radio5 = false;

          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b10.$invalid) {

              if($scope.built1 === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.built2 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.built3 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.built4 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.built5 === undefined)
              {
                  $scope.radio4 = true;
              } 

              if($scope.built6 === undefined)
              {
                  $scope.radio5 = true;
              } 
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var B10_1images = sessionStorage.getItem('B10_1ImageArray') ? sessionStorage.getItem('B10_1ImageArray') : '[]' ;
            var B10_2images = sessionStorage.getItem('B10_2ImageArray') ? sessionStorage.getItem('B10_2ImageArray') : '[]' ;
            var B10_3images = sessionStorage.getItem('B10_3ImageArray') ? sessionStorage.getItem('B10_3ImageArray') : '[]' ;
            var B10_4images = sessionStorage.getItem('B10_4ImageArray') ? sessionStorage.getItem('B10_4ImageArray') : '[]' ;
            var B10_5images = sessionStorage.getItem('B10_5ImageArray') ? sessionStorage.getItem('B10_5ImageArray') : '[]' ;
            var B10_6images = sessionStorage.getItem('B10_6ImageArray') ? sessionStorage.getItem('B10_6ImageArray') : '[]' ;
            var B10_7images = sessionStorage.getItem('B10_7ImageArray') ? sessionStorage.getItem('B10_7ImageArray') : '[]' ;
            var B10_8images = sessionStorage.getItem('B10_8ImageArray') ? sessionStorage.getItem('B10_8ImageArray') : '[]' ;

            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'), 
              'B10_1' : $scope.built1, 
              'B10_2' : $scope.built2, 
              'B10_3' : $scope.built3, 
              'B10_4' : $scope.built4, 
              'B10_5' : $scope.built5, 
              'B10_6' : $scope.built6,
              'B10_15s' : $scope.after_15s ,
              'B10_45s' : $scope.after_45s, 
              'B10_30s' : $scope.wait,
              'B10_1images' : B10_1images, 
              'B10_2images' : B10_2images,
              'B10_3images' : B10_3images,
              'B10_4images' : B10_4images,
              'B10_5images' : B10_5images,
              'B10_6images' : B10_6images,
              'B10_7images' : B10_7images,
              'B10_8images' : B10_8images
            });

            sessionStorage.setItem('page11', storeData);
            sessionStorage.setItem('prev11' , true);  
            window.location = "" + url;   
          }

        };

    });

HealthyHomes.controller('buildingCharB11', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev12') === 'true')
        {         
            var data = JSON.parse(sessionStorage.getItem('page12'));        
            $scope.select = data.B11_1;
            $scope.basement = data.B11_2; 
        }

        $scope.next = function(url) 
          {
          // Trigger validation flag.         
             $scope.submitted = true;  
             $scope.radio = false;
             $scope.radio1 = false;
             
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b11.$invalid) {

             if($scope.select === undefined)
              {
                  $scope.radio = true;
              }

          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
          
              if($scope.select === 'Yes' && $scope.basement === undefined)
              {
                    alert("teat:" + $scope.select);
                alert("test:" + $scope.basement);
                  $scope.radio1 = true;
              }
              else
              {
              
              var basement;

              if($scope.select === 'Yes')
                  basement = $scope.basement;
                  else
                    basement = 'null';
                
                var B11_1images = sessionStorage.getItem('B11_1ImageArray') ? sessionStorage.getItem('B11_1ImageArray') : '[]' ;
                var B11_2images = sessionStorage.getItem('B11_2ImageArray') ? sessionStorage.getItem('B11_2ImageArray') : '[]' ;
                
                var storeData = JSON.stringify({
                  'id': sessionStorage.getItem('inspectionHome'), 
                  'B11_1' : $scope.select, 
                  'B11_2' : basement,
                  'B11_1images': B11_1images,
                  'B11_2images': B11_2images
                });

                sessionStorage.setItem('prev12' , true);  
                sessionStorage.setItem('page12', storeData);
                window.location = "" + url;   
              }
          }

        };

    });

     HealthyHomes.controller('buildingCharB12B13', function ($scope, $http, $log, $timeout,$filter) {

         if(sessionStorage.getItem('prev13') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page13'));
             $scope.built1 = data.B12_1;
             $scope.built2 = data.B12_2;
             $scope.built3 = data.B12_3; 
             $scope.built4 = data.B12_4;
             $scope.built5 = data.B13_1;
           
        }
        $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;

             $scope.radio = false;
             $scope.radio1 = false;
             $scope.radio2 = false;
             $scope.radio3 = false;
             $scope.radio4 = false;
             $scope.radio5 = false;



          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.b12.$invalid) {

              if($scope.built1 === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.built2 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.built3 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.built4 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.built5 === undefined)
              {
                  $scope.radio4 = true;
              } 

             $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
              if($scope.built1 !== 'Yes')
              {
                    $scope.built2 = 'null';
                    $scope.built3 = 'null';
                    $scope.built4 = 'null';
              }

              var B12_1images = sessionStorage.getItem('B12_1ImageArray') ? sessionStorage.getItem('B12_1ImageArray') : '[]' ;
              var B12_2images = sessionStorage.getItem('B12_2ImageArray') ? sessionStorage.getItem('B12_2ImageArray') : '[]' ;
              var B12_3images = sessionStorage.getItem('B12_3ImageArray') ? sessionStorage.getItem('B12_3ImageArray') : '[]' ;
              var B12_4images = sessionStorage.getItem('B12_4ImageArray') ? sessionStorage.getItem('B12_4ImageArray') : '[]' ;
              var B13_1images = sessionStorage.getItem('B13_1ImageArray') ? sessionStorage.getItem('B13_1ImageArray') : '[]' ;

              var storeData = JSON.stringify({
                'id': sessionStorage.getItem('inspectionHome'), 
                'B12_1' : $scope.built1, 
                'B12_2' : $scope.built2,
                'B12_3' : $scope.built3,
                'B12_4' : $scope.built4,
                'B13_1' : $scope.built5,
                'B12_1Images': B12_1images,
                'B12_2Images': B12_2images,
                'B12_3Images': B12_3images,
                'B12_4Images': B12_4images,
                'B13_1Images': B13_1images
              });
                sessionStorage.setItem('page13', storeData);
                sessionStorage.setItem('prev13' , true);  
                
                
            var page5 = JSON.parse(sessionStorage.getItem('page5'));
            var page6 = JSON.parse(sessionStorage.getItem('page6'));
            var page7 = JSON.parse(sessionStorage.getItem('page7'));
            var page8 = JSON.parse(sessionStorage.getItem('page8'));
            var page9 = JSON.parse(sessionStorage.getItem('page9'));
            var page10 = JSON.parse(sessionStorage.getItem('page10'));
            var page11 = JSON.parse(sessionStorage.getItem('page11'));
            var page12 = JSON.parse(sessionStorage.getItem('page12'));
            var page13 = JSON.parse(sessionStorage.getItem('page13'));
            
             $http.post(' http://testserver.comyr.com/genCharConnect.php', {'id': sessionStorage.getItem('inspectionHome'),'gn1s' : page5.gn1s, 'gn2s' : page5.gn2s, 'gn1t' : page5.gn1t, 'gn2t' : page5.gn2t, 'b1_year' : page6.b1_year, 'b1_yoption' : page6.b1_yoption, 'b2_year' : page6.b2_year,
             'b2_desc' : page6.b2_desc, 'b3_type' : page6.b3_type, 'B4obs' : page7.B4obs , 'B4veg' : page7.B4veg, 'B5sources' : page7.B5sources, 'B5desc' : page7.B5desc, 'B6_1' : page8.B6_1, 'B6_2' : page8.B6_2, 'B6_3' : page8.B6_3, 'B6_vent_45s' : page8.B6_vent_45s, 'B6_vent_60s' : page8.B6_vent_60s, 'B6_4' : page8.B6_4, 
             'B6_CO_45s' : page8.B6_CO_45s, 'B6_CO_60s' : page8.B6_CO_60s, 'B6_5' : page8.B6_5, 'B7_1' : page9.B7_1, 'B7_2' : page9.B7_2, 
             'B7_3' : page9.B7_3, 'B7_4' : page9.B7_4, 'B7_ventflow_45s' : page9.B7_ventflow_45s, 'B7_ventflow_60s' : page9.B7_ventflow_60s, 'B7_CO_45s' : 
             page9.B7_CO_45s, 'B7_CO_60s' : page9.B7_CO_60s, 'B8_1' : page10.B8_1, 'B8_2' : page10.B8_2, 'B9_1' : page10.B9_1, 'B9_2' : page10.B9_2, 'B10_1' : page11.B10_1, 'B10_2' : page11.B10_2, 'B10_3' : page11.B10_3, 'B10_4' : page11.B10_4, 'B10_5' : page11.B10_5, 'B10_6' : page11.B10_6, 'B10_15s' : page11.B10_15s, 'B10_45s' : page11.B10_45s , 'B10_30s' : page11.B10_30s, 'B11_1' : page12.B11_1, 'B11_2' : page12.B11_2 , 'B12_1' : page13.B12_1, 'B12_2' : page13.B12_2, 'B12_3' : page13.B12_3, 'B12_4' : page13.B12_4, 'B13_1' : page13.B13_1 }
                        ).success(function(data, status, headers, config) {
                            $scope.message = "updated";
                            //alert("updated");
                        }).error(function(data, status) { 
                            $scope.message = "failed";
                            //alert("failed");
                        });
                
           window.location = "" + url;   
          }
        };
    });

HealthyHomes.controller('walkthrough_roomaudit_g', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev14') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page14'));
            $scope.choice = data.WT_g1;
            $scope.choice1 = data.WT_g2;
            $scope.choice2 = data.WT_g3;
            $scope.choice3= data.WT_g4;
            $scope.choice5 = data.WT_g5;
            $scope.cover = data.WT_g6;
            $scope.choice6 = data.WT_g7;
            $scope.dust = data.WT_g8;
            $scope.choice7 = data.WT_g9;
            $scope.choice8 = data.WT_g10;
            $scope.choice9 = data.WT_g11;
            $scope.choice10 = data.WT_g12;
            $scope.choice11 = data.WT_g13;
            $scope.choice12 = data.WT_g14;
        }

         $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio = false;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
          $scope.radio5 = false;
          $scope.radio6 = false;
          $scope.radio7 = false;
          $scope.radio8 = false;
          $scope.radio9 = false;
          $scope.radio10 = false;
          $scope.radio11 = false;
          $scope.radio12 = false;
          $scope.radio13 = false;


          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough.$invalid) {

              if($scope.choice === undefined)
              {
                  $scope.radio = true;
              }

              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice5 === undefined)
              {
                  $scope.radio4 = true;
              } 
               if($scope.cover === undefined)
              {
                  $scope.radio5 = true;
              } 
               if($scope.choice6 === undefined)
              {
                  $scope.radio6 = true;
              } 
               if($scope.dust === undefined)
              {
                  $scope.radio7 = true;
              } 
               if($scope.choice7 === undefined)
              {
                  $scope.radio8 = true;
              } 
               if($scope.choice8 === undefined)
              {
                  $scope.radio9 = true;
              } 
               if($scope.choice9 === undefined)
              {
                  $scope.radio10 = true;
              } 
              if($scope.choice10 === undefined)
              {
                  $scope.radio11 = true;
              } 
              if($scope.choice11 === undefined)
              {
                  $scope.radio12 = true;
              } 
              if($scope.choice12 === undefined)
              {
                  $scope.radio13 = true;
              } 
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var roomType = sessionStorage.getItem('RoomType');
            
            var roomNum;
            
            switch(roomType)
            {
                case "livingRoom":
                    roomNum = sessionStorage.getItem('livingRoom');
                    break;
                case "bedRoom":
                    roomNum = sessionStorage.getItem('bedRoom');
                    break;
                case "kitchen":
                    roomNum = sessionStorage.getItem('kitchen');
                    break;
            }
            
            
            var WT_g1images = sessionStorage.getItem('WT_g1ImageArray') ? sessionStorage.getItem('WT_g1ImageArray') : '[]' ;
            var WT_g2images = sessionStorage.getItem('WT_g2ImageArray') ? sessionStorage.getItem('WT_g2ImageArray') : '[]' ;
            var WT_g3images = sessionStorage.getItem('WT_g3ImageArray') ? sessionStorage.getItem('WT_g3ImageArray') : '[]' ;
            var WT_g4images = sessionStorage.getItem('WT_g4ImageArray') ? sessionStorage.getItem('WT_g4ImageArray') : '[]' ;
            var WT_g5images = sessionStorage.getItem('WT_g5ImageArray') ? sessionStorage.getItem('WT_g5ImageArray') : '[]' ;
            var WT_g6_covering_images = sessionStorage.getItem('WT_g6_coveringImageArray') ? sessionStorage.getItem('WT_c6_coveringImageArray') : '[]' ;
            var WT_g6_cords_images = sessionStorage.getItem('WT_g6_cordsImageArray') ? sessionStorage.getItem('WT_g6_cordsImageArray') : '[]' ;
            var WT_g7images = sessionStorage.getItem('WT_g7ImageArray') ? sessionStorage.getItem('WT_g7ImageArray') : '[]' ;
            var WT_g8_supply_vent_images = sessionStorage.getItem('WT_g8_supply_ventImageArray') ? sessionStorage.getItem('WT_g8_supply_ventImageArray') : '[]' ;
            var WT_g8_return_vent_images = sessionStorage.getItem('WT_g8_return_ventImageArray') ? sessionStorage.getItem('WT_g8_return_ventImageArray') : '[]' ;
            var WT_g9images = sessionStorage.getItem('WT_g9ImageArray') ? sessionStorage.getItem('WT_g9ImageArray') : '[]' ;
            var WT_g9_vent_out_images = sessionStorage.getItem('WT_g9_vent_outImageArray') ? sessionStorage.getItem('WT_g9_vent_outImageArray') : '[]' ;
            var WT_g9_suction_images = sessionStorage.getItem('WT_g9suctionImageArray') ? sessionStorage.getItem('WT_g9suctionImageArray') : '[]' ;
            var WT_g9_fan_frequency_images = sessionStorage.getItem('WT_g9_fan_frequencyImageArray') ? sessionStorage.getItem('WT_g9_fan_frequencyImageArray') : '[]' ;
            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'),
              'roomType' : roomType,
              'roomNum' : roomNum,
              'WT_g1' : $scope.choice, 
              'WT_g2' : $scope.choice1, 
              'WT_g3' : $scope.choice2, 
              'WT_g4' : $scope.choice3, 
              'WT_g5' : $scope.choice5, 
              'WT_g6' : $scope.cover,
              'WT_g7' : $scope.choice6 , 
              'WT_g8' :  $scope.dust,
              'WT_g9' : $scope.choice7,
              'WT_g10' : $scope.choice8,
              'WT_g11' : $scope.choice9, 
              'WT_g12' : $scope.choice10,
              'WT_g13' : $scope.choice11, 
              'WT_g14' : $scope.choice12,
              'WT_g1Images': WT_g1images,
              'WT_g2Images': WT_g2images,
              'WT_g3Images': WT_g3images,
              'WT_g4Images': WT_g4images,
              'WT_g5Images': WT_g5images,
              'WT_g6_coveringImages': WT_g6_covering_images,
              'WT_g6_cordsImages' : WT_g6_cords_images,
              'WT_g7Images': WT_g7images,
              'WT_g8_supply_ventImages' : WT_g8_supply_vent_images,
              'WT_g8_return_ventImages' : WT_g8_return_vent_images,
              'WT_g9Images': WT_g9images,
              'WT_g9_vent_outImages': WT_g9_vent_out_images,
              'WT_g9_suctionImages': WT_g9_suction_images,
              'WT_g9_fan_frequencyImages': WT_g9_fan_frequency_images
            });

            sessionStorage.setItem('page14', storeData);
            sessionStorage.setItem('prev14' , true);  
            window.location = "" + url;   
          }

        };

    });


HealthyHomes.controller('walkthrough_roomaudit_s', function ($scope, $http, $log, $timeout,$filter) {

    if(sessionStorage.getItem('prev15') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page15'));
           $scope.choice1 = data.WT_s1;
           $scope.choice2 = data.WT_s2;
               $scope.choice3 = data.WT_s3;
               $scope.choice4 = data.WT_s4;
               $scope.choice5 = data.WT_s5;                  
               $scope.choice6 = data.WT_s6; 
               $scope.choice7 = data.WT_s7;
               $scope.choice8 = data.WT_s8;
               $scope.choice9  = data.WT_s9;                                             
               $scope.choice10 = data.WT_s10;
               $scope.choice11 = data.WT_s11;
               $scope.choice12 = data.WT_s12;
               $scope.choice13 = data.WT_s13;
               $scope.choice14 = data.WT_s14;
               $scope.choice15 = data.WT_s15;
               $scope.choice16 = data.WT_s16;
               $scope.choice17 = data.WT_s17;
               $scope.choice18 = data.WT_s18;
               $scope.choice19 = data.WT_s19;
               $scope.choice20 = data.WT_s20;
               $scope.choice21 = data.WT_s21;
           
        }

        
         $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio = false;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
          $scope.radio5 = false;
          $scope.radio6 = false;
          $scope.radio7 = false;
          $scope.radio8 = false;
          


          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_s.$invalid) {

              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio2 = true;
              } 

              if($scope.choice7 === undefined)
              {
                  $scope.radio3 = true;
              }  

              if($scope.choice10 === undefined)
              {
                  $scope.radio4 = true;
              }

              if($scope.choice13 === undefined)
              {
                  $scope.radio5 = true;
              } 
               if($scope.choice16 === undefined)
              {
                  $scope.radio6 = true;
              } 
               if($scope.choice18 === undefined)
              {
                  $scope.radio7 = true;
              } 
               if($scope.choice20 === undefined)
              {
                  $scope.radio8 = true;
              } 
               
              
          $scope.message = 'Enter all required fields';

            return;
          }
           
             else 
          {
               if($scope.choice1 !== 'Yes')
              {
                    $scope.choice2 = 'null';
                    $scope.choice3 = 'null';
                   
              }
               if($scope.choice4 !== 'Yes')
              {
                    $scope.choice5 = 'null';
                    $scope.choice6 = 'null';
                   
              }
               if($scope.choice7 !== 'Yes')
              {
                    $scope.choice8 = 'null';
                    $scope.choice9 = 'null';
                   
              }
               if($scope.choice10 !== 'Yes')
              {
                    $scope.choice11 = 'null';
                    $scope.choice12 = 'null';
                   
              }

               if($scope.choice13 !== 'Yes')
              {
                    $scope.choice14 = 'null';
                    $scope.choice15 = 'null';
                   
              }
               if($scope.choice16 !== 'Yes')
              {
                    $scope.choice17 = 'null';
                   
                   
              }
               if($scope.choice18 !== 'Yes')
              {
                    $scope.choice19 = 'null';
                   
                   
              }
              if($scope.choice20 !== 'Yes')
              {
                    $scope.choice21 = 'null';
                   
                   
              }
              var WT_s1images = sessionStorage.getItem('WT_s1ImageArray') ? sessionStorage.getItem('WT_s1ImageArray') : '[]' ;
              var WT_s2images = sessionStorage.getItem('WT_s2ImageArray') ? sessionStorage.getItem('WT_s2ImageArray') : '[]' ;
              var WT_s3images = sessionStorage.getItem('WT_s3ImageArray') ? sessionStorage.getItem('WT_s3ImageArray') : '[]' ;
              var WT_s4images = sessionStorage.getItem('WT_s4ImageArray') ? sessionStorage.getItem('WT_s4ImageArray') : '[]' ;
              var WT_s5images = sessionStorage.getItem('WT_s5ImageArray') ? sessionStorage.getItem('WT_s5ImageArray') : '[]' ;
              var WT_s6images = sessionStorage.getItem('WT_s6ImageArray') ? sessionStorage.getItem('WT_s6ImageArray') : '[]' ;
              var WT_s7images = sessionStorage.getItem('WT_s7ImageArray') ? sessionStorage.getItem('WT_s7ImageArray') : '[]' ;
              var WT_s8images = sessionStorage.getItem('WT_s8ImageArray') ? sessionStorage.getItem('WT_s8ImageArray') : '[]' ;
              var storeData = JSON.stringify({
                'id': sessionStorage.getItem('inspectionHome'),  
                'WT_s1' : $scope.choice1, 
                'WT_s2' : $scope.choice2, 
                'WT_s3' : $scope.choice3, 
                'WT_s4' : $scope.choice4, 
                'WT_s5' : $scope.choice5,
                'WT_s6' : $scope.choice6 , 
                'WT_s7' :  $scope.choice7, 
                'WT_s8' : $scope.choice8, 
                'WT_s9' : $scope.choice9,           
                'WT_s10' : $scope.choice10, 
                'WT_s11' : $scope.choice11, 
                'WT_s12' : $scope.choice12, 
                'WT_s13' : $scope.choice13, 
                'WT_s14' : $scope.choice14 , 
                'WT_s15' :  $scope.choice15, 
                'WT_s16' : $scope.choice16, 
                'WT_s17' : $scope.choice17, 
                'WT_s18' : $scope.choice18, 
                'WT_s19' : $scope.choice19, 
                'WT_s20' : $scope.choice20, 
                'WT_s21' : $scope.choice21, 
                'WT_s1Images' : WT_s1images,
                'WT_s2Images' : WT_s2images, 
                'WT_s3Images' : WT_s3images,
                'WT_s4Images' : WT_s4images,
                'WT_s5Images' : WT_s5images,
                'WT_s6Images' : WT_s6images,
                'WT_s7Images' : WT_s7images,
                'WT_s8Images' : WT_s8images
              });

            sessionStorage.setItem('page15', storeData);
            sessionStorage.setItem('prev15' , true);  
            window.location = "" + url;   
          }

        };

    });

HealthyHomes.controller('walkthrough_roomaudit_pd', function ($scope, $http, $log, $timeout,$filter) {

        if(sessionStorage.getItem('prev16') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page16'));
            $scope.choice1 = data.WT_d1;
            $scope.choice2 = data.WT_d2;
            $scope.choice3 = data.WT_d3;
            $scope.choice4= data.WT_d4;
            
        }

         $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
         
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_pd.$invalid) {

             
              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio4 = true;
              } 
              
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var storeData = JSON.stringify({'id': sessionStorage.getItem('inspectionHome'), 'WT_d1' : $scope.choice1, 'WT_d2' : $scope.choice2, 
                                            'WT_d3' : $scope.choice3, 'WT_d4' : $scope.choice4});

            sessionStorage.setItem('page16', storeData);
            sessionStorage.setItem('prev16' , true);  
            window.location = "" + url;   
          }

        };

    });

HealthyHomes.controller('walkthrough_roomaudit_co', function ($scope, $http, $log, $timeout,$filter) {

    
        if(sessionStorage.getItem('prev17') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page17'));
            $scope.choice1 = data.WT_c1;
            $scope.choice2 = data.WT_c2;
            $scope.choice3 = data.WT_c3;
            $scope.choice4= data.WT_c4;
            $scope.choice5= data.WT_c5;
            $scope.choice6= data.WT_c6;
            $scope.choice7= data.WT_c7;
            $scope.choice8= data.WT_c8;
            
        }

         $scope.next = function(url) 
        {
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
          $scope.radio5 = false;
          $scope.radio6 = false;
          $scope.radio7 = false;
          $scope.radio8 = false;
          
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_co.$invalid) {

             
              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio4 = true;
              } 
              if($scope.choice5 === undefined)
              {
                  $scope.radio5 = true;
              } 

              if($scope.choice6 === undefined)
              {
                  $scope.radio6 = true;
              }  

              if($scope.choice7 === undefined)
              {
                  $scope.radio7 = true;
              }

              if($scope.choice8 === undefined)
              {
                  $scope.radio8 = true;
              } 
              
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var WT_c1images = sessionStorage.getItem('WT_c1ImageArray') ? sessionStorage.getItem('WT_c1ImageArray') : '[]' ;
            var WT_c2images = sessionStorage.getItem('WT_c2ImageArray') ? sessionStorage.getItem('WT_c2ImageArray') : '[]' ;
            var WT_c3images = sessionStorage.getItem('WT_c3ImageArray') ? sessionStorage.getItem('WT_c3ImageArray') : '[]' ;
            var WT_c4images = sessionStorage.getItem('WT_c4ImageArray') ? sessionStorage.getItem('WT_c4ImageArray') : '[]' ;
            var WT_c5images = sessionStorage.getItem('WT_c5ImageArray') ? sessionStorage.getItem('WT_c5ImageArray') : '[]' ;
            var WT_c6images = sessionStorage.getItem('WT_c6ImageArray') ? sessionStorage.getItem('WT_c6ImageArray') : '[]' ;
            var WT_c7images = sessionStorage.getItem('WT_c7ImageArray') ? sessionStorage.getItem('WT_c7ImageArray') : '[]' ;
            var WT_c8images = sessionStorage.getItem('WT_c8ImageArray') ? sessionStorage.getItem('WT_c8ImageArray') : '[]' ;
            
            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'), 
              'WT_c1' : $scope.choice1, 
              'WT_c2' : $scope.choice2, 
              'WT_c3' : $scope.choice3, 
              'WT_c4' : $scope.choice4, 
              'WT_c5' : $scope.choice5, 
              'WT_c6' : $scope.choice6, 
              'WT_c7' : $scope.choice7, 
              'WT_c8' : $scope.choice8,
              'WT_c1Images' : WT_c1images,
              'WT_c2Images' : WT_c2images, 
              'WT_c3Images' : WT_c3images,
              'WT_c4Images' : WT_c4images,
              'WT_c5Images' : WT_c5images,
              'WT_c6Images' : WT_c6images,
              'WT_c7Images' : WT_c7images,
              'WT_c8Images' : WT_c8images
            });

            sessionStorage.setItem('page17', storeData);
            sessionStorage.setItem('prev17' , true);  
            window.location = "" + url;   
          }

        };

    });


HealthyHomes.controller('walkthrough_roomaudit_ps', function ($scope, $http, $log, $timeout,$filter) {

    
        if(sessionStorage.getItem('prev18') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page18'));
            $scope.choice1 = data.WT_p1;
            $scope.choice2 = data.WT_p2;
            $scope.choice3 = data.WT_p3;
            $scope.choice4= data.WT_p4;
            $scope.choice5= data.WT_p5;
            $scope.choice6= data.WT_p6;
            $scope.choice7= data.WT_p7;
            
        }

         $scope.next = function(url) 
        {
            
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
          $scope.radio5 = false;
          $scope.radio6 = false;
          $scope.radio7 = false;
          
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_ps.$invalid) {

             
              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio4 = true;
              } 
              if($scope.choice5 === undefined)
              {
                  $scope.radio5 = true;
              } 

              if($scope.choice6 === undefined)
              {
                  $scope.radio6 = true;
              }  

              if($scope.choice7 === undefined)
              {
                  $scope.radio7 = true;
              }

              
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var WT_p1images = sessionStorage.getItem('WT_p1ImageArray') ? sessionStorage.getItem('WT_p1ImageArray') : '[]' ;
            var WT_p2images = sessionStorage.getItem('WT_p2ImageArray') ? sessionStorage.getItem('WT_p2ImageArray') : '[]' ;
            var WT_p3images = sessionStorage.getItem('WT_p3ImageArray') ? sessionStorage.getItem('WT_p3ImageArray') : '[]' ;
            var WT_p4images = sessionStorage.getItem('WT_p4ImageArray') ? sessionStorage.getItem('WT_p4ImageArray') : '[]' ;
            var WT_p5images = sessionStorage.getItem('WT_p5ImageArray') ? sessionStorage.getItem('WT_p5ImageArray') : '[]' ;
            var WT_p6images = sessionStorage.getItem('WT_p6ImageArray') ? sessionStorage.getItem('WT_p6ImageArray') : '[]' ;
            var WT_p7images = sessionStorage.getItem('WT_p7ImageArray') ? sessionStorage.getItem('WT_p7ImageArray') : '[]' ;
            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'), 
              'WT_p1' : $scope.choice1, 
              'WT_p2' : $scope.choice2, 
              'WT_p3' : $scope.choice3, 
              'WT_p4' : $scope.choice4, 
              'WT_p5' : $scope.choice5,
              'WT_p6' : $scope.choice6, 
              'WT_p7' : $scope.choice7,
              'WT_p1Images' : WT_p1images,
              'WT_p2Images' : WT_p2images, 
              'WT_p3Images' : WT_p3images,
              'WT_p4Images' : WT_p4images,
              'WT_p5Images' : WT_p5images,
              'WT_p6Images' : WT_p6images,
              'WT_p7Images' : WT_p7images
            });

            sessionStorage.setItem('page18', storeData);
            sessionStorage.setItem('prev18' , true);  
            window.location = "" + url;   
          }

        };

    });

HealthyHomes.controller('walkthrough_roomaudit_n', function ($scope, $http, $log, $timeout,$filter) {

    
        if(sessionStorage.getItem('prev19') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page19'));
            $scope.choice1 = data.WT_n1;
            $scope.choice2 = data.WT_n2;
            $scope.choice3 = data.WT_n3;
            $scope.choice4= data.WT_n4;
            
        }

         $scope.next = function(url) 
        {
            
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
         
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_n.$invalid) {

             
              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio4 = true;
              } 
              
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var WT_n1images = sessionStorage.getItem('WT_n1ImageArray') ? sessionStorage.getItem('WT_n1ImageArray') : '[]' ;
            var WT_n2images = sessionStorage.getItem('WT_n2ImageArray') ? sessionStorage.getItem('WT_n2ImageArray') : '[]' ;
            var WT_n3images = sessionStorage.getItem('WT_n3ImageArray') ? sessionStorage.getItem('WT_n3ImageArray') : '[]' ;
            var WT_n4images = sessionStorage.getItem('WT_n4ImageArray') ? sessionStorage.getItem('WT_n4ImageArray') : '[]' ;
            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'), 
              'WT_n1' : $scope.choice1, 
              'WT_n2' : $scope.choice2, 
              'WT_n3' : $scope.choice3, 
              'WT_n4' : $scope.choice4,
              'WT_n1Images' : WT_n1images,
              'WT_n2Images' : WT_n2images, 
              'WT_n3Images' : WT_n3images,
              'WT_n4Images' : WT_n4images
            });

            sessionStorage.setItem('page19', storeData);
            sessionStorage.setItem('prev19' , true);  
            window.location = "" + url;   
          }

        };

    });

HealthyHomes.controller('walkthrough_roomaudit_l', function ($scope, $http, $log, $timeout,$filter) {

    
        if(sessionStorage.getItem('prev20') === 'true')
        {
            var data = JSON.parse(sessionStorage.getItem('page20'));
            $scope.choice1 = data.WT_l1;
            $scope.choice2 = data.WT_l2;
            $scope.choice3 = data.WT_l3;
            $scope.choice4 = data.WT_l4;
            
        }

         $scope.next = function(url) 
        {
            
          // Trigger validation flag.         
          $scope.submitted = true;
          $scope.radio1 = false;
          $scope.radio2 = false;
          $scope.radio3 = false;
          $scope.radio4 = false;
         
          // If form is invalid, return and let AngularJS show validation errors.
          if ($scope.walkthrough_l.$invalid) {

             
              if($scope.choice1 === undefined)
              {
                  $scope.radio1 = true;
              } 

              if($scope.choice2 === undefined)
              {
                  $scope.radio2 = true;
              }  

              if($scope.choice3 === undefined)
              {
                  $scope.radio3 = true;
              }

              if($scope.choice4 === undefined)
              {
                  $scope.radio4 = true;
              } 
              
              
          $scope.message = 'Enter all required fields';

            return;
          }
           else 
          {
            var WT_l1images = sessionStorage.getItem('WT_l1ImageArray') ? sessionStorage.getItem('WT_l1ImageArray') : '[]' ;
            var WT_l2images = sessionStorage.getItem('WT_l2ImageArray') ? sessionStorage.getItem('WT_l2ImageArray') : '[]' ;
            var WT_l3images = sessionStorage.getItem('WT_l3ImageArray') ? sessionStorage.getItem('WT_l3ImageArray') : '[]' ;
            var WT_l4images = sessionStorage.getItem('WT_l4ImageArray') ? sessionStorage.getItem('WT_l4ImageArray') : '[]' ;

            var storeData = JSON.stringify({
              'id': sessionStorage.getItem('inspectionHome'), 
              'WT_l1' : $scope.choice1, 
              'WT_l2' : $scope.choice2, 
              'WT_l3' : $scope.choice3, 
              'WT_l4' : $scope.choice4,
              'WT_l1Images' : WT_l1images,
              'WT_l2Images' : WT_l2images, 
              'WT_l3Images' : WT_l3images,
              'WT_l4Images' : WT_l4images
            });

            sessionStorage.setItem('page20', storeData);
            sessionStorage.setItem('prev20' , true); 
            
            var page14 = JSON.parse(sessionStorage.getItem('page14'));
            var page15 = JSON.parse(sessionStorage.getItem('page15'));
            var page16 = JSON.parse(sessionStorage.getItem('page16'));
            var page17 = JSON.parse(sessionStorage.getItem('page17'));
            var page18 = JSON.parse(sessionStorage.getItem('page18'));
            var page19 = JSON.parse(sessionStorage.getItem('page19'));
            var page20 = JSON.parse(sessionStorage.getItem('page20'));
             $http.post(' http://testserver.comyr.com/connect.php', {'id': sessionStorage.getItem('inspectionHome'), 'roomType' : page14.roomType, 'roomNum' : page14.roomNum , 'WT_n1' : page19.WT_n1, 'WT_n2' : page19.WT_n2, 'WT_n3' : page19.WT_n3, 'WT_n4' : page19.WT_n4, 'WT_l1': page20.WT_l1, 'WT_l2': page20.WT_l2,'WT_l3': page20.WT_l3, 'WT_l4': page20.WT_l4, 'WT_p1' : page18.WT_p1,
             'WT_p2' : page18.WT_p2,'WT_p3' : page18.WT_p3,'WT_p4' : page18.WT_p4,'WT_p5' : page18.WT_p5, 'WT_p6' : page18.WT_p6, 'WT_p7' : page18.WT_p7,
             'WT_c1' : page17.WT_c1,'WT_c2' : page17.WT_c2,'WT_c3' : page17.WT_c3,'WT_c4' : page17.WT_c4, 'WT_c5' : page17.WT_c5, 'WT_c6' : page17.WT_c6,
             'WT_c7' : page17.WT_c7, 'WT_c8' : page17.WT_c8, 'WT_d1' : page16.WT_d1, 'WT_d2' : page16.WT_d2, 'WT_d3' : page16.WT_d3, 'WT_d4' : page16.WT_d4,
             'WT_s1' : page15.WT_s1, 'WT_s2' : page15.WT_s2, 'WT_s3' : page15.WT_s3, 'WT_s4' : page15.WT_s4,'WT_s5' : page15.WT_s5, 'WT_s6' : page15.WT_s6, 'WT_s7' : page15.WT_s7, 'WT_s8' : page15.WT_s8,'WT_s9' : page15.WT_s9, 'WT_s10' : page15.WT_s10, 'WT_s11' : page15.WT_s11, 'WT_s12' : page15.WT_s12, 'WT_s13' : page15.WT_s13, 'WT_s14' : page15.WT_s14, 'WT_s15' : page15.WT_s15, 'WT_s16' : page15.WT_s16, 'WT_s17' : page15.WT_s17, 'WT_s18' : page15.WT_s18, 'WT_s19' : page15.WT_s19, 'WT_s20' : page15.WT_s20,'WT_s21' : page15.WT_s21, 'WT_g1' : page14.WT_g1, 'WT_g2' : page14.WT_g2, 'WT_g3' : page14.WT_g3, 'WT_g4' : page14.WT_g4,'WT_g5' : page14.WT_g5, 'WT_g6' : page14.WT_g6, 'WT_g7' : page14.WT_g7, 'WT_g8' : page14.WT_g8,'WT_g9' : page14.WT_g9, 'WT_g10' : page14.WT_g10, 'WT_g11' : page14.WT_g11, 'WT_g12' : page14.WT_g12, 'WT_g13' : page14.WT_g13, 'WT_g14' : page14.WT_g14}
                        ).success(function(data, status, headers, config) {
                            $scope.message = "updated";
                        }).error(function(data, status) { 
                            $scope.message = "failed";
                        });

            
          window.location = "" + url;   
          }

        };

    });
    
    
    HealthyHomes.controller('walkthrough_roomselect', function ($scope, $http, $log, $timeout,$filter) {

            var data = JSON.parse(sessionStorage.getItem('page6'));
            $scope.building_type = data.b3_type;
            
            $scope.roomSlected = function(option,url){
                
                
                switch(option)
                {
                    case 1:
                        var count = (sessionStorage.getItem('livingRoom') === null) ? 0 : parseInt(sessionStorage.getItem('livingRoom'), radix);
                        count = count + 1;
                        sessionStorage.setItem('livingRoom',count);
                        sessionStorage.setItem('RoomType','livingRoom');
                        break;
                    case 2:
                        var count1 = (sessionStorage.getItem('bedRoom') === null) ? 0 : parseInt(sessionStorage.getItem('bedRoom'),radix);
                        count1 = count1 + 1;
                        sessionStorage.setItem('bedRoom',count1);
                        sessionStorage.setItem('RoomType','bedRoom');
                        break;
                    case 3:
                        var count2 = (sessionStorage.getItem('kitchen') === null) ? 0 : parseInt(sessionStorage.getItem('kitchen'), radix);
                        count2 = count2 + 1;
                        sessionStorage.setItem('kitchen',count2);
                        sessionStorage.setItem('RoomType','kitchen');
                }
                
                window.location = "" + url;
            
            };
    });




    