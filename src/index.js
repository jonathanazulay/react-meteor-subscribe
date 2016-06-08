import {Component, default as React} from 'react';
import shallowArrayEquals from './utils/shallowArrayEquals';

export default function (mapSubscriptionsToProps) {
    return ComponentToWrap => {
        class MeteorConnect extends Component {
            constructor () {
                super();
                this.subscriptions = {};
                this.meteorHandles = {};
                this.ready = {};
            }

            updateSubs () {
                let newSubscriptions = this.getSubscriptions();
                let previousSubscriptions = this.subscriptions;
                let unchangedSubscriptions = {};

                for (var subscription in newSubscriptions) {
                    var newParams = newSubscriptions[subscription];
                    var previousParams = previousSubscriptions[subscription];
                    if (
                        previousParams !== undefined &&
                        shallowArrayEquals(newParams, previousParams)
                    ) {
                        unchangedSubscriptions[subscription] = newParams;
                    }
                }

                let filterUnchanged = (name) => unchangedSubscriptions[name] !== undefined;
                this.stopSubscriptions(previousSubscriptions, filterUnchanged);
                this.addSubscriptions(newSubscriptions, filterUnchanged);
            }

            getSubscriptions () {
                return mapSubscriptionsToProps(this.props);
            }

            componentDidUpdate () {
                this.updateSubs();
            }

            componentWillMount () {
                this.updateSubs();
            }

            componentWillUnmount () {
                this.stopSubscriptions(this.subscriptions);
            }

            addSubscriptions (subscriptions, filter) {
                if (!filter) { filter = () => false; }
                for (var sub in subscriptions) {
                    if (filter(sub)) { continue; }
                    this.addSubscription(sub, subscriptions[sub]);
                }
            }

            stopSubscriptions (subscriptions, filter) {
                if (!filter) { filter = () => false; }
                for (var sub in subscriptions) {
                    if (filter(sub)) { continue; }
                    this.stopSubscription(sub);
                }
            }

            addSubscription (name, args) {
                let handle = Meteor.subscribe.apply(Meteor, [name, ...args]);
                this.meteorHandles[name] = handle;
                this.subscriptions[name] = args;

                Tracker.autorun(() => {
                    if (handle.ready()) {
                        this.ready[name] = true;
                    } else {
                        this.ready[name] = false;
                    }
                    this.forceUpdate();
                });
            }

            stopSubscription (name) {
                this.meteorHandles[name].stop();
                delete this.meteorHandles[name];
                delete this.subscriptions[name];
                delete this.ready[name];
            }

            render () {
                return <ComponentToWrap {...this.props} subscriptions={this.ready} />
            }
        }

        return MeteorConnect;
    };
};
