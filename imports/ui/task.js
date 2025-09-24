import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './task.html';

Template.task.helpers({
  isOwner () {
    return this.owner === Meteor.userId();
  }
});

Template.task.events({
  async 'click .toggle-checked' () {
    // Set the checked property to the opposite of its current value
    await Meteor.callAsync('tasks.setChecked', this._id, !this.checked);
  },
  async 'click .delete' () {
    await Meteor.callAsync('tasks.remove', this._id);
  },
  async 'click .toggle-private' () {
    await Meteor.callAsync('tasks.setPrivate', this._id, !this.private);
  }
});
