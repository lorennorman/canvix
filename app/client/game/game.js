var Game = {}

Game.initialize = function(initFunc)
{
  CR.initialize('game_canvas')
  var camera = CR.Camera.create(
  { x: 225
  , y: 225
  })

  CR.setCamera(camera)

  document.onkeydown = function(event)
  {
    console.log(event)
    var moveAmount = 25
    var defaultAction = true
    switch(event.keyCode)
    {
      case 37:
        camera.x -= moveAmount
        defaultAction = false
        break
      case 38:
        if(event.shiftKey)
        {
          camera.scale *= 1.2
        } else {
          camera.y -= moveAmount
        }
        defaultAction = false
        break
      case 39:
        camera.x += moveAmount
        defaultAction = false
        break
      case 40:
        if(event.shiftKey)
        {
          camera.scale *= 0.8
        } else {
          camera.y += moveAmount
        }
        defaultAction = false
        break
    }
    CR.render()

    return defaultAction
  }

  var terrainMap = Game.TerrainSet.Basic

  var initObject =
  { setTerrainMap: function(tMap)
    {
      terrainMap = tMap
    }
  , loadLevel: function(array2D)
    {
      _(array2D).each(function(column, colNum)
      {
        _(column).each(function(cell, rowNum)
        {
          CR.Sprite.create(
          { x: rowNum*50
          , y: colNum*50
          , renderAnchor: 'topLeft'
          , path: terrainMap[cell]
          })
        })
      })
    }
  }

  initFunc(initObject)
}

//= require "terrain/terrain"