<template lang="pug">
  #day
    .row
      router-link.button.right.prev-button(:to="nextDateURL") Next
      router-link.button.right.next-button(:to="prevDateURL") Prev
      router-link.button.button-primary.today-button.right(v-show="!isToday", :to="todayURL") Today
      .page-heading
        h1(:data-rating="rating") {{ formattedDate }}
      hr(:class="{ 'past-or-present' : pastOrPresent }")

    router-link.mobile-prev-arrow(:to="prevDateURL") &#10092;
    router-link.mobile-next-arrow(:to="nextDateURL") &#10093;

    .row.ratings(v-if="pastOrPresent")
      .col-xs-12
        p
          button(v-for="r in ratings", :class="rating == r ? 'button-primary' : ''", @click="updateRating(r)") {{ r }}
        hr


    .row
      .col-xs-12
        small.right.status(v-show="!!this.reflection && !!this.reflection.description", :title="createdAt.long") updated {{ createdAt.short }}
        h4 Reflection

        div(v-show="mentioned.length > 0")
          b People Mentioned:
          span
            router-link.mentioned(v-for="p in mentioned", :title="p.name.first + ' ' + p.name.last", :to="{ name: 'person', params: { name: p.name.unique }}") {{ p.name.nickname ? p.name.nickname : p.name.first }}

        textarea.reflection-editor(placeholder="Markdown is supported!", v-if="editingReflection", v-model="reflection.description", @blur="doneEditingReflection")
        div(title="Click to edit!", v-else, v-html="reflectionHTML", :class="'reflection' + (!this.reflection || !this.reflection.description ? ' none' : '')", @click="editingReflection = !editingReflection")

        hr
    
    .row
      hr
      router-link.button(to="/") Home
      router-link.button.right.prev-button(:to="nextDateURL") Next
      router-link.button.right.next-button(:to="prevDateURL") Prev
      router-link.button.button-primary.today-button.right(v-show="!isToday", :to="todayURL") Today
    

    .row  
      .col-xs-12.col-lg-7
        <h4 class="inline">Activities</h4><span v-show="activities.length > 0" class="status"> {{ activities.length }} total</span>
        ol
          i.status(v-if="activities.length == 0") No activities logged for this day!
          activity(v-else="v-else", v-for="a in activities", :activity="a", @remove="removeActivity")

      .col-xs-12.col-lg-5
        form.form#add-activity(@submit="addActivity")
          .row
            label(for="summary") Activity Summary
            input.form-control#summary(list="dailies", type="text", name="summary", v-model="newActivity.summary", autocomplete="off", placeholder="What did you do today?", required)
            datalist#dailies
              option(v-for="d in dailes", :value="d") {{d}}

          .row
            label(for="description") Activity Description
            textarea.form-control(id="description", placeholder="Why?", v-model="newActivity.description")

          .row
            label(for="startTime") Start/End Times (optional)
            input.form-control#startTime(type="text", v-model="newActivity.startTime", placeholder="9:10 AM")
            input.form-control#endTime(type="text", v-model="newActivity.endTime", placeholder="1:00 PM")
            button.button-primary.right Add

</template>

<script>
/* eslint-disable no-undef, eqeqeq */

import Activity from './Activity.vue'
import { markdown } from 'markdown'
import moment from 'moment'

export default {
  name: 'day',
  data: function () {
    return {
      activities: [], // This will store all the days activities
      newActivity: {}, // Placeholder for the form to add new activities
      reflection: {
        description: ''
      },
      people: [],
      dailes: [
        'Practiced Guitar',
        'Went to Work',
        'Reached out to ___',
        'Exercised'
      ],
      rating: null,
      ratings: ['Horrible', 'Bad', 'Okay', 'Good', 'Great'],
      editingReflection: false
    }
  },
  components: { 'activity': Activity },
  computed: {
    createdAt: function () {
      return {
        short: moment(this.reflection.updated_at).fromNow(),
        long: moment(this.reflection.updated_at).format('dddd, MMMM Do YYYY, h:mm a')
      }
    },
    pastOrPresent: function () {
      return moment(this.$route.params.date, 'YYYY-MM-DD').isSameOrBefore(moment().startOf('day'))
    },
    reflectionHTML: function () {
      const placeholder = this.rating ? `Why was this a ${this.rating.toLowerCase()} day?` : 'Click to add reflection.'
      return (!this.reflection || !this.reflection.description ? placeholder : this.tagDates(markdown.toHTML(this.reflection.description)))
    },
    formattedDate: function () {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).format('dddd, MMM Do YY')
    },
    nextDateURL: function () {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).add(1, 'days').format('YYYY-MM-DD')
    },
    prevDateURL: function () {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).subtract(1, 'days').format('YYYY-MM-DD')
    },
    isToday: function () {
      return this.$route.params.date == moment().format('YYYY-MM-DD')
    },
    todayURL: function () {
      return moment().format('YYYY-MM-DD')
    },
    mentioned: function () {
      let mentioned = []
      const _this = this

      this.reflection.description.split(' ').forEach(function (e) {
        if (e.indexOf('@') == 0) {
          const person = _this.people.find(p => { return p.name.unique == e.substring(1) })
          if (person && mentioned.indexOf(person) == -1) { mentioned.push(person) }
        }
      })

      return mentioned
    }
  },
  methods: {
    tagDates: function (text) {
      const _this = this

      const current = moment(this.$route.params.date, 'YYYY-MM-DD')
      return text.split(' ').map(function (e) {
        if (e.indexOf('@') == 0) {
          const word = e.substring(1).split('<')[0]
          const date = moment(word, 'YYYY-MM-DD')

          if (date.isValid()) { return `<b class='date-tag'><a title='${date.format('MMM Do YY')} | ${date.from(current)}' href='#/days/${date.format('YYYY-MM-DD')}'>${date.format('dddd')}</a></b>` }

          const person = _this.people.find(p => { return p.name.unique == word })
          if (person) { return `<b class='name-tag'><a title='${person.name.first + ' ' + person.name.last}' href='#/people/${person.name.unique}'>${person.name.nickname ? person.name.nickname : person.name.first}</a></b>` }
        }

        return e
      }).join(' ')
    },
    fetchData: function () {
      if (this.people.length === 0) {
        this.$http.get('/api/people').then(response => {
          if (response.body.people) this.people = response.body.people
          else this.people = []
        }, response => {
          alert('Error fetching people! ' + response.body.err)
        })
      }

      this.$http.get('/api/ratings/' + this.$route.params.date).then(response => {
        if (response.body.rating) this.rating = this.ratings[response.body.rating.value - 1]
        else this.rating = null
      }, response => {
        alert('Error fetching rating! ' + response.body.err)
      })

      this.$http.get('/api/activities/' + this.$route.params.date).then(response => {
        this.activities = response.body
      }, response => {
        alert('Error fetching activities! ' + response.body.err)
      })

      this.$http.get('/api/reflections/' + this.$route.params.date).then(response => {
        this.reflection = response.body.reflection
        if (!this.reflection) { this.reflection = {description: ''} }
      }, response => {
        alert('Error fetching reflection! ' + response.body.err)
      })
    },
    toggleAgenda: function () {
      this.showAgenda = !this.showAgenda
      localStorage.setItem('showAgenda', this.showAgenda.toString())
    },
    addActivity: function (event) {
      event.preventDefault() // Prevent the form from being submitted

      // Sends the new activity to the server and (if successful) gets it back and its it to the list
      this.$http.put('/api/activities/' + this.$route.params.date, this.newActivity).then(response => {
        this.activities.push(response.body)
      }, response => {
        alert('Error! ' + response.body.error)
      })

      this.newActivity = { summary: '', description: '' } // Reset the placeholder (also clears form)
    },
    removeActivity: function (a) {
      if (!confirm(`Are you sure you want to delete "${a.summary}"?`)) { return }

      this.$http.delete('/api/activities/' + this.$route.params.date, {body: { _id: a._id }}).then(response => {
        const index = this.activities.indexOf(a)
        this.activities.splice(index, 1)
      }, response => {
        alert('Error! ' + response.body.error)
      })
    },
    updateReflection: function (event) {
      this.$http.post('/api/reflections/' + this.$route.params.date, { reflection: this.reflection }).then(response => {
        if (response.body.success) {
          this.reflection = {description: ''}
        } else {
          this.reflection = response.body.reflection
        }
      }, response => {
        alert('Error! ' + response.body.error)
      })
    },
    doneEditingReflection: function (event) {
      this.editingReflection = false
      this.updateReflection()
    },
    updateRating: function (r) {
      const value = (r !== this.rating ? this.ratings.indexOf(r) + 1 : null)
      this.$http.post('/api/ratings/' + this.$route.params.date, { rating: { value } }).then(response => {
        if (response.body.success) {
          this.rating = null
        } else {
          this.rating = r
        }
      }, response => {
        alert('Error! ' + response.body.error)
      })
    }
  },
  mounted: function () {
    // const current = moment(this.$route.params.date, 'YYYY-MM-DD')
  },
  watch: {
    '$route' (to, from) {
      this.fetchData()
      this.editingReflection = false
      this.newActivity = { summary: '', description: '' }
    }
  },
  created: function () {
    // Before the element is rendered get the proper data
    this.fetchData()
  }
}
</script>

<style scoped>
#day {
  padding-top: 50px;
}

h1[data-rating='Horrible'] {
  text-shadow: 3px 3px 2px #ff9999;
}

h1[data-rating='Bad'] {
  text-shadow: 5px 5px 2px #ffe6e6;
}

h1[data-rating='Okay'] {
  text-shadow: 3px 3px 2px #ffffb3;
}

h1[data-rating='Good'] {
  text-shadow: 5px 5px 2px #d6f5d6;
}

h1[data-rating='Great'] {
  text-shadow: 2px 2px 2px #47d147;
}

.mobile-next-arrow, .mobile-prev-arrow {
  display: none;
  font-size: 2.2em;
  position: fixed;
  top: 40%;
  /*height: 15%;*/
  padding-top: 4%;
  padding-bottom: 5%;
  background-color: black;
  color: white;
}

@media only screen and (max-width : 768px) {
  h1 {
    text-align: center;
  }

  .next-button, .prev-button, .today-button {
    display: none;
  }

  .ratings button {
    padding-left: 10px;
    padding-right: 10px;
  }

  .mobile-next-arrow, .mobile-prev-arrow {
    display: initial;
    text-decoration: none;
    font-weight: bold;
  }

  .mobile-prev-arrow {
    left: 0px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-left: 5px;
    padding-right: 10px;
  }

  .mobile-next-arrow {
    right: 0px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 5px;
    padding-left: 10px;
  }
}

.button.today-button {
  padding-left: 10px;
  padding-right: 10px;
}

h4 {
  font-weight: bold;
}

hr.past-or-present {
  margin-bottom: 10px;
}

.ratings p {
  margin-bottom: 0;
  text-align: center;
}

.ratings hr {
  margin-top: 0;
}

.reflection-editor {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 1000px;
  height: 600px;
}

.reflection.none {
  color: grey;
  font-style: italic;
  cursor: pointer;
}

#summary, #description {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    max-height: 300px;
}

#startTime, #endTime {
    margin-right: 20px;
    width: 90px;
}
</style>
