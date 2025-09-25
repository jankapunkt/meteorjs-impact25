import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import '@fortawesome/fontawesome-free/css/svg-with-js.css'
import './icon.html'
import './icon.css'

const cache = new ReactiveDict()
const loadIcon = async (name) => {
  if (name && typeof cache.get(name) === 'undefined') {
    cache.set(name, '')
    const href = Meteor.absoluteUrl(`/icons/${name}.svg`)
    const response = await fetch(href)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const svg = await response.text()
    if (svg.startsWith('<svg')) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svg, 'image/svg+xml')
      const svgElement = doc.documentElement
      const path = svgElement.querySelector('path')
      const vb = svgElement.getAttribute('viewBox')
      cache.set(name, path.getAttribute('d'))
      cache.set(`${name}-vb`, vb ? vb : '0 0 512 512')
    }
    else {
      throw new Error('Invalid SVG response')
    }
  }

  return { path: cache.get(name), viewBox: cache.get(`${name}-vb`) ?? '0 0 512 512' }
}

Template.icon.onCreated(function () {
  this.state = new ReactiveDict()
})

Template.icon.onRendered(function () {
  const instance = this
  instance.autorun(async () => {
    const data = Template.currentData()
    const atts = { ...data }
    const name = atts.name
    // build class names from flags
    const fw = atts.fw ? 'fa-fw' : ''
    const pulse = atts.pulse ? 'fa-spin-pulse' : ''
    const spinning = atts.spinning ? 'fa-spin' : ''
    const actualClass = atts.class || ''
    const colorClass = atts.color ? `var(--bs-${atts.color})` : 'currentColor'
    const faType = (atts.solid) ? 'fas' : 'far'
    // rebuilding the class attribute
    // and delete the flag attributes
    const classnames = `icon fa ${faType} ${fw} ${spinning} ${pulse} ${actualClass}`
    delete atts.fw
    delete atts.color
    delete atts.pulse
    delete atts.spinning
    instance.state.set({ atts, classnames, colorClass, iconName: name })
  })

  instance.autorun(() => {
    const data = Template.currentData()
    const name = data?.name
    loadIcon(name).then(({ path, viewBox }) =>instance.state.set({ path, viewBox })).catch(console.error)
  })
})

Template.icon.helpers({
  attributes () {
    return Template.instance().state.get('atts')
  },
  classnames () {
    return Template.instance().state.get('classnames')
  },
  href () {
    return Template.instance().state.get('href')
  },
  iconName () {
    return  Template.instance().state.get('iconName')
  },
  viewBox () {
    const instance = Template.instance()
    return  Template.instance().state.get('viewBox') ?? '0 0 512 512'
  },
  iconData () {
    return {
      class: Template.instance().state.get('classnames') ?? ''
    }
  },
  path () {
    return Template.instance().state.get('path') ?? '' // 'M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z'
  }
})
