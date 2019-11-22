Install:

`npm i`

Run

`npm start`

Build
`npm run build`

Run tests

`npm test`

Extra notes

- I'm assuming for this task that the anchor element is a regular block/inline element and doesn't have quirks such as _float: left;_ or _position: fixed;_
- Behaviour of multiple sticky elements is not defined in the task
- Z-Index is not generated for injected elements which could become an issue, also margins are not taken into account which could be fixed with box-sizing
- There is no watch for parent element changes which could be done using MutationObserver
- I do not use _async/await_ syntax in tests because I don't want to promisify setTimeout manually and don't want to introduce an extra dependency such as _bluebird_
- There is no particular reason why _expect_ Chai syntax is used for tests instead of _should_
- Sticky blocks could be positioned with _transform: translateY;_ instead which allows to remove wrapper div, rendering could be optimized with _will-change: transform_
