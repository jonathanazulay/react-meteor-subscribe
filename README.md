# react-meteor-subscribe
### A React higher order component for handling Meteor subscriptions

#### Usage

ViewContainer.js
```javascript
import subscribe from 'meteor-redux';
import CommentsView from './CommentsView';
let mapSubscriptionsToProps (props) => ({
    threadComments: [props.threadId],
    thread: [props.threadId]
});
export default subscribe(mapSubscriptionsToProps)(CommentsView);
```
