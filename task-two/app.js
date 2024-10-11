// Define AngularJS app
var app = angular.module("eventSchedulerApp", []);

// Scheduler service to manage events
app.service("SchedulerService", function () {
  var events = [];

  // Overlap check
  function isOverlapping(newEvent) {
    return events.some(function (event) {
      return !(
        newEvent.end_time <= event.start_time ||
        newEvent.start_time >= event.end_time
      );
    });
  }

  // Add event to the schedule
  this.addEvent = function (newEvent) {
    if (
      newEvent.start_time >= newEvent.end_time ||
      newEvent.start_time < 0 ||
      newEvent.end_time > 23
    ) {
      return { success: false, message: "Invalid time range." };
    }

    if (!isOverlapping(newEvent)) {
      events.push(newEvent);
      return { success: true };
    } else {
      return {
        success: false,
        message: "Event overlaps with an existing event.",
      };
    }
  };

  // Get all events
  this.getEvents = function () {
    return events;
  };
});

app.controller("SchedulerController", function (SchedulerService) {
  var vm = this;

  vm.newEvent = {
    start_time: null,
    end_time: null,
  };

  vm.errorMessage = "";

  vm.addEvent = function () {
    var result = SchedulerService.addEvent(vm.newEvent);
    if (result.success) {
      vm.newEvent = { start_time: null, end_time: null };
      vm.errorMessage = "";
    } else {
      vm.errorMessage = result.message;
    }
  };

  vm.getEvents = function () {
    return SchedulerService.getEvents();
  };
});
