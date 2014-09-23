/* ngFoobar, (c) 2014 Jonathan Welzel - http://jonwelzel.com/ng-foobar
 * @license MIT */

'use strict';
angular.module('ngFoobar.provider', ['ngFoobar.directive'])
  .provider('ngFoobar', function () {
    this.version = '0.0.1';

    this.success = {
      color: '#3C763D',
      background: '#DFF0D8',
      border: '#D6E9C6'
    };

    this.warning = {
      color: '#C09853',
      background: '#FCF8E3',
      border: '#FBEED5'
    };

    this.info = {
      color: '#1E90FF',
      background: '#FFF',
      border: '#EBEBEB'
    };

    this.error = {
      color: '#B94A48',
      background: '#F2DEDE',
      border: '#EED3D7'
    };

    this.colors = [];
    this.colors['success'] = this.success;
    this.colors['warning'] = this.warning;
    this.colors['info'] = this.info;
    this.colors['error'] = this.error;

    this.$get = ['$document', '$window', '$compile', '$rootScope', '$timeout',
      function ($document, $window, $compile, $rootScope, $timeout) {
        var Colors = this.colors,
            $scope = $rootScope,
            $body  = $document.find('body');
        var Settings = this.settings = {
          autoClose: true,
          displayTime: 3,
          barSelector: '[role="bar"]'
        };
        var ngFoobarEl = $compile('<ng-foobar></ng-foobar>')($scope);
        var animation;
        $body.append(ngFoobarEl);
        return {
          show: function(context, message) {
            ngFoobarEl.children('.message').html(message);
            ngFoobarEl.children(Settings.barSelector).css({color: Colors[context].color,
                                                           backgroundColor: Colors[context].background,
                                                           borderBottom: '1px solid ' + Colors[context].border})
            var self = this;
            self.animate(function () {
              ngFoobarEl.children().css('opacity', '0.95');
            }, 100);
          },
          hide: function () {
            ngFoobarEl.children().css('opacity', '0');
            var self = this;
            self.animate(function () {
              progressbarEl.children().css('width', '0%');
              self.animate(function () {
                self.show();
              }, 500);
            }, 500);
          },
          animate: function(fn, time) {
            if(animation) { $timeout.cancel(animation); }
            animation = $timeout(fn, time);
          },
          configure: function(options) {
            var key, value;
            for (key in options) {
              value = options[key];
              if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
            }
            return this;
          }
        };
      }
    ];
  });

angular.module('ngFoobar.directive', [])
  .directive('ngFoobar', ['$window', function ($window) {
    var directiveObj = {
      replace: true,
      restrict: 'E',
      link: function ($scope, $element, $attrs) {
        $element.bind('click', $scope.hide());
      },
      template: '<div class="bar" role="bar"><div class="message"></div></div>'
    };

    return directiveObj;
  }]);

angular.module('ngFoobar', ['ngFoobar.directive', 'ngFoobar.provider']);
