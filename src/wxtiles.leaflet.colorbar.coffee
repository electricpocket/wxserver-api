#
# * L.Control.Scale is used for displaying metric/imperial scale on the map.
# 
L.Control.WXTileColorBar = L.Control.extend
	options:
		position: 'bottomright'
		# big or small
		size: 'small'
		# vert or horiz
		orientation: 'horiz'
	
	initialize: (config, options) ->
		@_config = config
		@setField @_config.fields[0]
		L.Control.prototype.initialize.call @, options

	onAdd: (map) ->
		@_map = map
		@_map
			.on 'wxfieldchange', @_fieldChange, @
			.on 'wxfieldremove', @_fieldRemove, @
		container = L.DomUtil.create 'div', 'leaflet-control-colorbar'
		@_img = L.DomUtil.create 'img', 'leaflet-control-colorbar-img', container
		@redraw()
		container
	
	onRemove: (map) ->
		@_map
			.off 'wxfieldchange', @_fieldChange, @
			.off 'wxfieldremove', @_fieldRemove, @
	
	setField: (field) ->
		@_field = field
		@redraw()
	
	getField: ->
		@_field
	
	_fieldChange: (field) ->
		@setField field
	
	_fieldRemove: ->
		@setField null
	
	redraw: ->
		return if !@_img?
		if !@_field
			@_img.style.display = 'none'
		else
			@_img.style.display = 'inline'
			@_img.src = "#{@_config.url}colorbar/#{@_field.name}/#{@options.size}/#{@options.orientation}"

L.control.wxTileColorBar = (config, options) ->
	new L.Control.WXTileColorBar config, options