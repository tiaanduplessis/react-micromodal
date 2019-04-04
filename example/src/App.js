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