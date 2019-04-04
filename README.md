# react-micromodal

> React wrapper for [Micromodal.js](https://micromodal.now.sh/#)

[![NPM](https://img.shields.io/npm/v/react-micromodal.svg)](https://www.npmjs.com/package/react-micromodal) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-micromodal.js
```

## Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

import Modal from 'react-micromodal'

import './index.css'

export default class App extends React.Component {
  state = {
    show: false,
  }


  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: true })

      setTimeout(() => {
        this.setState({ show: false })
      }, 3000)
    }, 3000)

  }

  render() {
    const { show } = this.state
    return (
      <div className="App">
        <h1>Wait for it</h1>

        <Modal
          show={show}
          onShow={() => console.log('Showing!')}
          onClose={() => console.log('Closing down')}
          disableScroll={false}
          disableFocus={false}
          awaitCloseAnimation={false}
          debugMode={false}

        >
          <h1>Hello</h1>
        </Modal>
      </div>
    )
  }
}
```

Check out the [MicroModal Docs](https://micromodal.now.sh/#) for more information.

## License

MIT © [tiaanduplessis](https://github.com/tiaanduplessis)
