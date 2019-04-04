import { Component } from 'react'
import ReactDOM from 'react-dom'
import MM from 'micromodal'
import uid from 'pico-uid'

import './styles.css'

class MicroModal extends Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
    this.id = uid()
    this.el.id = this.id
    this.el.classList.add(...this.props.className.split(' '))
  }

  static defaultProps = {
    className: 'modal',
    root: document.body,
    onShow: () => { },
    onClose: () => { },
    disableScroll: false,
    disableFocus: false,
    awaitCloseAnimation: false,
    debugMode: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.show) {
      MM.show(this.id, {
        ...nextProps,
      })
    } else {
      MM.close(this.id)
    }

    return true
  }

  componentDidMount() {
    this.props.root.appendChild(this.el)
  }

  componentWillUnmount() {
    this.props.root.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default MicroModal
