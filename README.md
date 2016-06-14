*API changed in 0.0.2!*
---

# react-meteor-subscribe
### A React higher order component for handling Meteor subscriptions

 [![npm version](https://img.shields.io/npm/v/react-meteor-subscribe.svg?style=flat-square)](https://www.npmjs.com/package/react-meteor-subscribe)

### What does this do?

`react-meteor-subscribe` subscribes views to meteor publications in a clear declarative way using a higher order component - similar to how Redux works with mapping your state to props. Whenever the component mounts the subscriptions are added, whenever it unmounts they are stopped. When parameters (calculated from props of parent) change, the subscription is updated with the new parameters.

It also passes props to the wrapped view about which subscriptions are ready or not.

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
    // subscribe to `threadComments` and pass threadId to publisher, map ready() to threadCommentsLoaded
    threadCommentsLoaded: ['threadComments', props.threadId],
    // subscribe to the `userData` collection (profile of the logged in user), no arguments passed
    userLoaded: ['userData']
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
                props.threadCommentsLoaded ? (
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

#### Disclaimer

This project is still work in progress but should work in most circumstances. Please open issues with any bugs you encounter!
