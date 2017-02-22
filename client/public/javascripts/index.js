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
  template: '<li>{{ activity.description }}</li>'
});

const activityApp = new Vue({
  el: '#activities',
  data: {
    activities: [{ text: 'Test'}]
  },
  beforeCreate: function() {
    this.$http.get('/api/activities/' + date).then(response => {
      this.activities = response.body;
    }, response => {
      alert('Error!');
    });
  },
  computed: {
    
  }
});