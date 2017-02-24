<template>
  <div id="day">
    <div class="row">
      <router-link class="button right" :to="nextDateURL">Next</router-link>
      <router-link class="button right" :to="prevDateURL">Prev</router-link>
      <router-link v-show="!isToday" class="button button=primary right" :to="todayURL">Today</router-link>
      <h1>{{ formattedDate }}</h1>
      <hr>
    </div>
    <div class="row">
      <textarea class="reflection-editor" v-if="editingReflection" v-model="reflection.description" @blur="doneEditingReflection"></textarea>
      <p v-else v-html="reflectionHTML" :class="'reflection' + (!this.reflection || !this.reflection.description ? ' none' : '')" @click="editingReflection = !editingReflection"></p>

      <hr>
    </div>
    <div class="row">
      <div class="seven columns"><i v-show="activities.length > 0" class="status">{{ activities.length }} total</i>
        <ol><i v-if="activities.length == 0" class="status">No activities logged for this day!</i>
          <activity v-else="v-else" v-for="a in activities" :activity="a" @remove="removeActivity"></activity>
        </ol>
      </div>
      <div class="five columns">
        <form id="add-activity" @submit="addActivity">
          <div class="row">
            <label for="summary">Activity Summary</label>
            <input id="summary" type="text" name="summary" v-model="newActivity.summary" placeholder="What did you do today?" required="required"/>
          </div>
          <div class="row">
            <label for="description">Activity Description</label>
            <textarea id="description" placeholder="Why?" v-model="newActivity.description"></textarea>
          </div>
          <div class="row">
            <label for="startTime">Start/End Times (optional)</label>
            <input id="startTime" type="text" v-model="newActivity.startTime" placeholder="9:10 AM"/>
            <input id="endTime" type="text" v-model="newActivity.endTime" placeholder="1:00 PM"/>
            <button class="button-primary right">Add</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <hr/>
      <router-link class="button" to="/">Home</router-link>
    </div>
  </div>
</template>

<script>
import Activity from './components/Activity.vue'
import { markdown } from 'markdown'

export default {
  name: 'day',
  data: function(){
    return {
      activities: [], // This will store all the days activities
      newActivity: {}, // Placeholder for the form to add new activities
      reflection: {
        description: ''
      },
      editingReflection: false
    };
  },
  components: { 'activity': Activity },
  computed: {
    reflectionHTML: function() {
      return (!this.reflection || !this.reflection.description ? 'Click to add reflection.' : markdown.toHTML(this.reflection.description));
    },
    formattedDate: function() {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).format('dddd, MMM Do YY');
    },
    nextDateURL: function() {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).add(1, 'days').format('YYYY-MM-DD');
    },
    prevDateURL: function() {
      return moment(this.$route.params.date, 'YYYY-MM-DD', true).subtract(1, 'days').format('YYYY-MM-DD');
    },
    isToday: function() {
      return this.$route.params.date == moment().format('YYYY-MM-DD');
    },
    todayURL: function() {
      return moment().format('YYYY-MM-DD');
    }
  },
  methods: {
    fetchData: function() {
      this.$http.get('/api/activities/' + this.$route.params.date).then(response => {
        this.activities = response.body;
      }, response => {
        alert('Error! ' + response.body.error);
      });

      this.$http.get('/api/reflections/' + this.$route.params.date).then(response => {
        this.reflection = response.body.reflection;
        if(!this.reflection) this.reflection = {description: ''};
      }, response => {
        alert('Error! ' + response.body.error);
      });
    },
    toggleAgenda: function() {
      this.showAgenda = !this.showAgenda;
      localStorage.setItem('showAgenda', this.showAgenda.toString());
    },
    addActivity: function(event) {
      event.preventDefault(); // Prevent the form from being submitted

      // Sends the new activity to the server and (if successful) gets it back and its it to the list
      this.$http.put('/api/activities/' + this.$route.params.date, this.newActivity).then(response => {
        this.activities.push(response.body);
      }, response => {
        alert('Error! ' + response.body.error);
      });

      this.newActivity = { summary: '', description: '' }; // Reset the placeholder (also clears form)
    },
    removeActivity: function(a) {
      if(!confirm(`Are you sure you want to delete "${a.summary}"?`)) return;
      
      this.$http.delete('/api/activities/' + this.$route.params.date, {body: { _id: a._id }}).then(response => {
        const index = this.activities.indexOf(a);
        this.activities.splice(index, 1);
      }, response => {
        alert('Error! ' + response.body.error);
      });
    },
    updateReflection: function(event) {
      if(!this.reflection.description) return;
      this.$http.post('/api/reflections/' + this.$route.params.date, { reflection: this.reflection }).then(response => {
        this.reflection = response.body.reflection;
      }, response => {
        alert('Error! ' + response.body.error);
      });
    },
    doneEditingReflection: function(event) {
      this.editingReflection = false;
      this.updateReflection();
    }
  },
  watch: {
    '$route' (to, from) {
      this.fetchData();
      this.newActivity = { summary: '', description: '' };
    }
  },
  created: function() {
    // Before the element is rendered get the proper data
    this.fetchData();
  },
}
</script>

<style scoped>
#day {
  padding-top: 50px;
}

.reflection-editor {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 500px;
}

.status {
    color: grey;
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
