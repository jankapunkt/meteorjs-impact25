import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('tasks', function tasksPublication() {
      return Tasks.find({
        $or: [
          { private: { $ne: true } },
          { owner: this.userId },
        ],
      });
    });
  }

Meteor.methods({
  async 'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await Tasks.insertAsync({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: await Meteor.users.findOneAsync(this.userId).username,
    });
  },
  async 'tasks.remove'(taskId) {
    check(taskId, String);

    const task = await Tasks.findOneAsync(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    await Tasks.removeAsync(taskId);
  },
  async 'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = await Tasks.findOneAsync(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    await Tasks.updateAsync(taskId, { $set: { checked: setChecked } });
    },
    async 'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
        const task = await Tasks.findOneAsync(taskId);
    
        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
          throw new Meteor.Error('not-authorized');
        }
    
        await Tasks.updateAsync(taskId, { $set: { private: setToPrivate } });
      },
});