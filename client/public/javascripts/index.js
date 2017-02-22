$(() => {
    $('.event-calendar').fullCalendar({
        eventSources: ['/api/activities']
    });
});