/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import MM from 'micromodal'
import MicroModal from './'

describe('MicroModal', () => {
  let container
  let modal
  let props

  const render = (updates = {}) => {
    props = { ...props, ...updates }
    modal = ReactDOM.render(
      <MicroModal {...props}><button>{props.children}</button></MicroModal>,
      container
    )
    return modal.el
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    props = { show: false, children: 'Initial content', onShow: jest.fn(), onClose: jest.fn() }
    jest.spyOn(MM, 'show')
    jest.spyOn(MM, 'close')
  })

  afterEach(() => {
    // Exercise the real library, and release its listeners before removing DOM.
    if (modal && modal.el.getAttribute('aria-hidden') === 'false') MM.close()
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
    MM.show.mockRestore()
    MM.close.mockRestore()
    modal = null
  })

  it('does not close an uninitialized modal on repeated hidden renders', () => {
    const el = render()
    expect(() => render({ children: 'Updated content' })).not.toThrow()
    render({ show: undefined })
    render({ show: false })

    expect(MM.show).not.toHaveBeenCalled()
    expect(MM.close).not.toHaveBeenCalled()
    expect(el.textContent).toBe('Updated content')
    expect(el.classList.contains('is-open')).toBe(false)
  })

  it('opens after mounting when initially shown, then closes safely', () => {
    const el = render({ show: true })
    expect(document.body.contains(el)).toBe(true)
    expect(el.classList.contains('is-open')).toBe(true)
    expect(el.getAttribute('aria-hidden')).toBe('false')
    expect(document.activeElement).toBe(el.querySelector('button'))
    expect(MM.show).toHaveBeenCalledTimes(1)
    expect(props.onShow).toHaveBeenCalledWith(el)

    render({ show: false })
    expect(el.getAttribute('aria-hidden')).toBe('true')
    expect(el.classList.contains('is-open')).toBe(false)
    expect(MM.close).toHaveBeenCalledTimes(1)
    expect(props.onClose).toHaveBeenCalledWith(el)
  })

  it('opens and closes only on visibility transitions while updating children', () => {
    const el = render()
    const onShow = jest.fn(node => expect(node.textContent).toBe('Visible content'))
    render({ show: true, children: 'Visible content', onShow })
    render({ show: true, children: 'Still visible' })

    expect(el.textContent).toBe('Still visible')
    expect(MM.show).toHaveBeenCalledTimes(1)
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(MM.close).not.toHaveBeenCalled()

    render({ show: false })
    render({ show: false, children: 'Still hidden' })
    expect(el.textContent).toBe('Still hidden')
    expect(MM.close).toHaveBeenCalledTimes(1)
    expect(props.onClose).toHaveBeenCalledTimes(1)

    render({ show: true, children: 'Visible content' })
    expect(MM.show).toHaveBeenCalledTimes(2)
    expect(onShow).toHaveBeenCalledTimes(2)
  })

  it('uses the latest configuration when opening without reopening for other props', () => {
    render()
    const onShow = jest.fn()
    const onClose = jest.fn()
    render({ disableFocus: true, onShow, onClose, debugMode: true })
    expect(MM.show).not.toHaveBeenCalled()

    const el = render({ show: true })
    expect(MM.show).toHaveBeenLastCalledWith(modal.id, expect.objectContaining({
      disableFocus: true, onShow, onClose, debugMode: true
    }))
    expect(document.activeElement).not.toBe(el.querySelector('button'))
    render({ disableFocus: false })
    expect(MM.show).toHaveBeenCalledTimes(1)
    render({ show: false })
    expect(onClose).toHaveBeenCalledTimes(1)
    render({ show: true })
    expect(MM.show).toHaveBeenLastCalledWith(modal.id, expect.objectContaining({ disableFocus: false }))
    expect(document.activeElement).toBe(el.querySelector('button'))
  })

  it('removes a never-opened portal on unmount without closing a modal', () => {
    const el = render()
    expect(() => ReactDOM.unmountComponentAtNode(container)).not.toThrow()
    expect(document.body.contains(el)).toBe(false)
    expect(MM.close).not.toHaveBeenCalled()
  })

  it('preserves custom roots and classes through opening, closing and unmounting', () => {
    const root = document.createElement('section')
    document.body.appendChild(root)
    const el = render({ root, className: 'modal custom' })
    expect(el.parentNode).toBe(root)
    expect(el.classList.contains('custom')).toBe(true)
    render({ show: true })
    render({ show: false })
    ReactDOM.unmountComponentAtNode(container)
    expect(root.contains(el)).toBe(false)
    expect(MM.close).toHaveBeenCalledTimes(1)
    document.body.removeChild(root)
  })
})
