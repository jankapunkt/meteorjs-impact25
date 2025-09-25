import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SHA512 } from '../../api/SHA512'
import './task.html';
import { loadI18n } from '../../startup/loadI18n'
import { asyncReactive } from '../utils/asyncReactive'

const i18nLoaded = asyncReactive(loadI18n({
  en: () => import('./i18n/en.json'),
}))

Template.task.helpers({
  loadComplete() {
    return i18nLoaded.get();
  },
  isOwner () {
    return this.owner === Meteor.userId();
  },
  async isValid () {
    try {
      console.debug('....')
      console.debug('this', this.hash)
      console.debug('that', await SHA512(`${this.createdAt.getTime()}${this.text}`))
      return this.hash === await SHA512(`${this.createdAt.getTime()}${this.text}`)
    } catch (e) {
      console.debug(e)
      return false;
    }
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
