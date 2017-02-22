$(() => {
  $('.event-calendar').fullCalendar({
    eventSources: ['/api/activities/events'],
    dayClick: (date) => {
      var dateString = date.format('YYYY-MM-DD');
      window.location.href = `/days/${dateString}`;
    }
  });
});

const date = window.location.href.split('/')[4].split('?')[0];

Vue.component('activity', {
  props: ['activity'],
  template: '<li class="activity"><span class="summary">{{ activity.summary }}</span><div class="description">{{ activity.description }}</div></li>'
});

/* The main app */
const activityApp = new Vue({
  el: '#activities',
  data: {
    activities: [], // This will store all the days activities
    newActivity: {} // Placeholder for the form to add new activities
  },
  beforeCreate: function() {
    // Before the element is rendered get the proper data
    this.$http.get('/api/activities/' + date).then(response => {
      this.activities = response.body;
    }, response => {
      alert('Error! ' + response.body.error);
    });
  },
  methods: {
    addActivity: function(event) {
      event.preventDefault(); // Prevent the form from being submitted

      // Sends the new activity to the server and (if successful) gets it back and its it to the list
      this.$http.put('/api/activities/' + date, this.newActivity).then(response => {
        this.activities.push(response.body);
      }, response => {
        alert('Error! ' + response.body.error);
      });

      this.newActivity = { summary: '', description: '' }; // Reset the placeholder (also clears form)
    }
  }
});