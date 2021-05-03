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
  var scriptCreationDate = new Date(); // today
  var futureDate = new Date(scriptCreationDate.getTime() + (365 * 24 * 60 * 60 * 1000)); // one year

  var events = calendar.getEvents(scriptCreationDate, futureDate);
  
  var firstRun = ScriptProperties.getProperty("firstRun");
  var hour = 60;

  // iterate through events for today
  for (var i = 0; i < events.length; i++) {
    var event = events[i];

    // if ((event.getDateCreated() > scriptCreationDate) && event.isOwnedByMe()) {
      console.log("Event '" + event.getTitle() + "' created at " + event.getDateCreated());
      try {
        console.log("Set popup reminder for 3 weeks");
        event.addPopupReminder(hour * 24 * 7 * 3);
        console.log("Set popup reminder for 1 week");
        event.addPopupReminder(hour * 24 * 7);
        console.log("Set popup reminder for a day");
        event.addPopupReminder(hour * 24);
      } catch (e) {
        console.log(e);
      }
    // }
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
