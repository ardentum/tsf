'use strict';

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/form/");

  $stateProvider
    .state('form', {
      url: '/form/',
      templateUrl: 'form.html',
      controller: 'FormCtrl as form'
    })
    .state('form.one',{
      url: '/form/steps/one',
      templateUrl: 'stepOne.html',
      controller: 'StepOneCtrl as step'
    })
    .state('form.two',{
      url: '/form/steps/two',
      templateUrl: 'stepTwo.html',
      controller: 'StepTwoCtrl as step'
    });
})
.controller('FormCtrl', function ($scope, $state) {
  var form = this;

  form.steps = [
    {state: 'form.one', name: 'Step one'},
    {state: 'form.two', name: 'Step two'}
  ];

  form.continue = function () {
    form.toStep(form.steps[form.steps.indexOf(form.currentStep) + 1]);
  };

  form.back = function () {
    form.toStep(form.steps[form.steps.indexOf(form.currentStep) - 1]);
  };

  form.toStep = function (step, ignoreValidation) {
    if (!step) { return; }
    if (!ignoreValidation && !isStepBack(step) && form.form.$invalid) { return; }

    activateStep(step);
    $state.go(step.state);
  };

  form.toStep(form.steps[0], true);

  $scope.$on('$stateChangeSuccess', function (e, state) {
    var step = form.steps.filter(function (step) {
      return step.state === state.name;
    })[0];

    if (step) {
      activateStep(step);
    }
  });

  $scope.$watch('form.form.$valid', function (isFormValid) {
    form.currentStep.completed = isFormValid;
  });

  function activateStep (step) {
    if (form.currentStep) {
      form.currentStep.active = false
    }

    step.active = true;
    form.currentStep = step;
  }

  function isStepBack (step) {
    return form.steps.indexOf(step) < form.steps.indexOf(form.currentStep);
  }
})
.controller('StepOneCtrl', function ($state) {
  var step = this;
})
.controller('StepTwoCtrl', function ($state) {
  var step = this;
})
.directive('formProgress', function () {
  return {
    restrict: 'E',
    templateUrl: 'formProgress.html',
    scope: {
      steps: '=',
      onSelect: '&'
    },

    controllerAs: '$ctrl',
    controller: function () {}
  };
});