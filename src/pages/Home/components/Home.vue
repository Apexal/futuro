<template lang="pug">
  #home
    .row
      h1#title Futuro
      p#slogan For what is to be.
      hr

    .row
      .col-xs-12
        .calendar
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import fullCalendar from 'fullcalendar' // eslint-disable-line
import 'fullcalendar/dist/fullcalendar.min.css'

export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted: function () {
    const _this = this

    $('.calendar').fullCalendar({
      eventSources: ['/api/activities/events', '/api/reflections/events'],
      dayClick: (date) => {
        var dateString = date.format('YYYY-MM-DD')
        this.$router.push({ name: 'Day', params: { date: dateString } })
      },
      viewRender: function (view, element) {
        const colors = ['#ff9999', '#ffe6e6', '#ffffb3', '#d6f5d6', '#47d147']

        _this.$http.get(`/api/ratings?start=${view.start.format('YYYY-MM-DD')}&end=${view.end.format('YYYY-MM-DD')}`).then(response => {
          response.body.ratings.forEach((r) => {
            $(`td.fc-day[data-date="${moment(r.date).format('YYYY-MM-DD')}"]`).css('background-color', colors[r.value - 1]) // eslint-disable-line no-undef
          })
        }, response => {
          alert('Error fetching ratings! ' + response.body.err)
        })
      }
    })
  }
}
</script>

<style scoped>
#title { 
  font-size: 6em;
  text-align: center;
  text-shadow: 0 0 4px;
  padding-top: 30px;

  margin-bottom: 0;
  padding-bottom: 0;
}

#slogan {
  text-align: center;
  color: grey;
}

.calendar {
  max-width: 700px;
}
</style>
