import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import Sortable from 'sortablejs'
import { Tasks } from '../../api/tasks.js';
import { loadI18n } from '../../startup/loadI18n'
import '../task/task.js';
import './todos.html';
import { asyncReactive } from '../utils/asyncReactive'

Template.todos.onCreated(function bodyOnCreated () {
  this.state = new ReactiveDict();
  this.sub = this.subscribe('tasks');
  this.i18nLoaded = asyncReactive(
    loadI18n({
      en: () => import('./i18n/en.json')
    })
  )
  this.autorun(() => {
    if (this.sub.ready()) {
      this.state.set('subReady', true);
    }
  })
});

Template.todos.helpers({
  i18nLoaded () {
    return Template.instance().i18nLoaded.get()
  },
  tasks () {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount () {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  isSubReady() {
    return Template.instance().state.get('subReady');
  }
});

Template.todos.events({
  async 'submit .new-task' (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    await Meteor.callAsync('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input' (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});
Template.todos.onRendered(function () {
  this.autorun((compute) => {
    if (this.sub.ready()) {
      // use timeout to prevent race condition
      setTimeout(() => {
        const list = document.getElementById('task-list');
        this.sortable = Sortable.create(list);
      }, 500)
      compute.stop()
    }
  })
})

Template.todos.onDestroyed(function () {
  this.sortable.destroy();
})