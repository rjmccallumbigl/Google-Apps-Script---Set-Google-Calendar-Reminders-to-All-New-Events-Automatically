/****************************************************************************************************************************************
*
* Add reminders for all new calendar events
*
* Directions
* 1. Create a new Google Script file (e.g. go to script.new)
* 2. Delete the text and replace it with this code
* 3. Run SetCalendarReminders(). Accept permissions. Any new events on your primary calendar 
      will automatically update with the new reminders.
* 4. To stop this behavior, click on the Triggers for this script and delete the trigger.
*
****************************************************************************************************************************************/

function SetCalendarReminders() {

  // Declare variables
  var calendar = CalendarApp.getDefaultCalendar();
  var events = calendar.getEventsForDay(new Date());
  var scriptCreationDate = new Date('April 28, 2021 8:00:00 -0500'); // Setting to 8am on the day I created this script, can be modified
  var firstRun = ScriptProperties.getProperty("firstRun");
  var hour = 60;

  // iterate through events for today
  for (var i = 0; i < events.length; i++) {
    var event = events[i];

    if ((event.getDateCreated() > scriptCreationDate) && event.isOwnedByMe()) {
      console.log("Event '" + event.getTitle() + "' created at " + event.getDateCreated());
      try {
        console.log("Set popup reminder for an hour");
        event.addPopupReminder(hour);
        console.log("Set popup reminder for 4 hours");
        event.addPopupReminder(hour * 4);
        console.log("Set popup reminder for 12 hours");
        event.addPopupReminder(hour * 12);
        console.log("Set popup reminder for a day");
        event.addPopupReminder(hour * 24);
      } catch (e) {
        console.log(e);
      }
    }
  }

  // Set trigger if this is our firstRun
  if (firstRun == null) {
    console.log("Trigger has not been set");
    setTrigger();
    ScriptProperties.setProperty("firstRun", "Trigger has been set");
  }
  console.log("Trigger has been set");
}

/****************************************************************************************************************************************
*
* Deletes all triggers in the current project so we don't repeat trigger, then recreate trigger
*
****************************************************************************************************************************************/
function setTrigger() {

  // Get triggers
  var triggers = ScriptApp.getProjectTriggers();

  // Delete triggers
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  console.log("Deleted old trigger(s)");

  // Recreate calendar trigger
  ScriptApp.newTrigger('SetCalendarReminders').forUserCalendar(Session.getEffectiveUser().getEmail()).onEventUpdated().create();
}