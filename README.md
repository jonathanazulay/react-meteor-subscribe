# react-meteor-subscribe
### A React higher order component for handling Meteor subscriptions

 [![npm version](https://img.shields.io/npm/v/react-meteor-subscribe.svg?style=flat-square)](https://www.npmjs.com/package/react-meteor-subscribe)

### What does this do?

`react-meteor-subscribe` subscribes views to meteor publications in a clear declarative way using a higher order component - similar to how Redux works with mapping your state to props. Whenever the component mounts the subscriptions are added, whenever it unmounts they are stopped. When parameters (calculated from props of parent) change, the subscription is updated with the new parameters.

It also passes a `subscriptions` prop to the wrapped view. This is an object with all the subscription names as keys and true/false values depending on if the subscription is ready or not.

#### Install
```bash
npm install --save react-meteor-subscribe
```
#### Usage

ViewContainer.js
```javascript
import subscribe from 'react-meteor-subscribe';
import CommentsView from './CommentsView';

let mapSubscriptionsToProps = (props) => ({
    // subscribe to `threadComments` and pass threadId to publisher
    threadComments: [props.threadId],
    // subscribe to the `userData` collection (profile of the logged in user), no arguments passed
    userData: []
});

// Wrap your view with the higher order component
export default subscribe(mapSubscriptionsToProps)(CommentsView);
```

CommentsView.jsx
```javascript
export default (props) => {
    return (
        <div className="comments">
            {
                props.subscriptions.threadComments ? (
                    // Collection is ready!
                    renderComments()
                ) : (
                    // Our threadComments collection is not ready yet, render a spinner
                    renderSpinner()
                )
            }
        </div>
    );
}
```

#### How do I subscribe to the same publication with different params?
At this time, not possible. Instead you should rewrite your publications to accept an array. Lets say you wanted to do this:
```javascript
Meteor.subscribe('userProfile', '26c56a887a2eb71e0adf2b81');
Meteor.subscribe('userProfile', '1b09ad3a888fc1948f2f6e47');
Meteor.subscribe('userProfile', '0b96bd5262f8a7bdcb09ff01');
```
instead, try to do this
```javascript
Meteor.subscribe('userProfile', [
    '26c56a887a2eb71e0adf2b81',
    '1b09ad3a888fc1948f2f6e47',
    '0b96bd5262f8a7bdcb09ff01'
]);
```

#### Disclaimer

This project is still work in progress but should work in most circumstances. Please open issues with any bugs you encounter! The API will probably change!
