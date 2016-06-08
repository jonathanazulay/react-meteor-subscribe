import {Component, default as React} from 'react';

export default function (mapSubscriptionsToProps) {
  return ComponentToWrap => {
    class MeteorConnect extends Component {
      constructor () {
        super();
        this.trackers = {};
        this.args = {};
      }

      componentDidUpdate () {
        this._updateSubs(mapSubscriptionsToProps(this.props));
      }

      componentWillMount () {
        this._updateSubs(mapSubscriptionsToProps(this.props));
      }

      componentWillUnmount () {
        this._unsubAll();
      }

      _updateSubs (newSubs) {
        for (var subName in this.trackers) {
          if (newSubs[subName] === undefined) {
            // It existed in the subscription map before but not anymore, so we should unsubscribe
            this.trackers[subName].stop();
            this._cleanupTracker(subName);
          }
        }

        // Add new or update old subscriptions with new args
        for (var subName in newSubs) {
          this.args[subName] = newSubs[subName];
          if (this.trackers[subName] === undefined) {
            this._createTracker(subName);
          } else {
            this.trackers[subName].invalidate();
          }
        }
      }

      _unsubAll () {
        for (var subName in this.trackers) {
          this.trackers[subName].stop();
        }
        this.trackers = {};
        this.args = {};
      }

      _cleanupTracker (name) {
        delete this.trackers[name];
        delete this.args[name];
      }

      _createTracker (name) {
        this.trackers[name] = Tracker.autorun(() => {
          Meteor.subscribe.apply(Meteor, [name, ...this.args[name]]);
        });
      }

      render () {
        return <ComponentToWrap {...this.props} /*TODO subscriptions={this.ready}*/ />
      }
    }

    return MeteorConnect;
  };
};
