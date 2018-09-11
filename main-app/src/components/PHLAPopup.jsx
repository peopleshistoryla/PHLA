import {DivOverlay, withLeaflet, LeafletProvider} from 'react-leaflet'
import { Popup as LeafletPopup } from 'leaflet';
import React from 'react'
import StoryOverlay from './StoryOverlay';
class PHLAPopup extends DivOverlay {
    constructor(props){
        super(props)
    }
    createLeafletElement(props){
        var p = this.getOptions(props)
        p.className = props.customClass;
        const el = new LeafletPopup(p, props.leaflet.popupContainer);
        this.contextValue = { ...props.leaflet, popupContainer: el }
        return el;
    }
    
    componentDidMount() {
        const { position } = this.props
        const { map, popupContainer } = this.props.leaflet
        const el = this.leafletElement
    
        if (map != null) {
          map.on({
            popupopen: this.onPopupOpen,
            popupclose: this.onPopupClose,
          })
        }
    
        if (popupContainer) {
          // Attach to container component
          popupContainer.bindPopup(el)
        } else {
          // Attach to a Map
          if (position) {
            el.setLatLng(position)
          }
          el.openOn(map)
        }
      }
    
      componentWillUnmount() {
        const { map } = this.props.leaflet
    
        if (map != null) {
          map.off({
            popupopen: this.onPopupOpen,
            popupclose: this.onPopupClose,
          })
          map.removeLayer(this.leafletElement)
        }
    
        super.componentWillUnmount()
      }
    
      onPopupOpen = ({ popup }) => {
        if (popup === this.leafletElement) {
          this.onOpen()
        }
      }
    
      onPopupClose = ({ popup }) => {
        if (popup === this.leafletElement) {
          this.onClose()
        }
      }
    
      onRender = () => {
        if (this.props.autoPan !== false && this.leafletElement.isOpen()) {
          if (this.leafletElement._map && this.leafletElement._map._panAnim) {
            this.leafletElement._map._panAnim = undefined
          }
          this.leafletElement._adjustPan()
        }
      }
    
}

export default withLeaflet(PHLAPopup)
