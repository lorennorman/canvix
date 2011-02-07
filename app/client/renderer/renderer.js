
var CR = (function()
{
  var canvas
    , context
    , currentCamera
    , renderStack = []

  var renderOnce = function()
  {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.transformation(function()
    {
      context.beginPath()
      context.rect(currentCamera.viewport.x,
                   currentCamera.viewport.y,
                   currentCamera.viewport.width,
                   currentCamera.viewport.height)
      context.clip()

      context.transformation(function()
      {
        context.translate(- currentCamera.x +
                          currentCamera.viewport.x +
                          currentCamera.viewport.width/2,
                          - currentCamera.y +
                          currentCamera.viewport.y +
                          currentCamera.viewport.height/2)

        _(renderStack).each(function(renderable)
        {
          renderable.render(context)
        })
      })

      context.strokeStyle = 'rgba(255,0,0,.5)'
      context.lineWidth   = 2
      context.strokeRect(currentCamera.viewport.x+1,
                         currentCamera.viewport.y+1,
                         currentCamera.viewport.width-2,
                         currentCamera.viewport.height-2)
      context.strokeRect(currentCamera.viewport.x +
                         currentCamera.viewport.width/2 - 5,
                         currentCamera.viewport.y +
                         currentCamera.viewport.height/2 - 1,
                         10, 2)
      context.strokeRect(currentCamera.viewport.x +
                         currentCamera.viewport.width/2 - 1,
                         currentCamera.viewport.y +
                         currentCamera.viewport.height/2 - 5,
                         2, 10)
    })
  }

  var setCamera = function(camera)
  {
    currentCamera = camera
  }

  return {
    renderStack: renderStack
  , initialize: function(canvasId, initFunction)
    {
      canvas  = document.getElementById(canvasId)
      context = CR.Context.create(canvas.getContext('2d'))
      setCamera(CR.Camera.create(
      { x: 0
      , y: 0
      , viewport:
        { x: 0
        , y: 0
        , width: canvas.width
        , height: canvas.height
        }
      }))

      initFunction()

      setTimeout(renderOnce, 200)
    }
  , loadStack: function(stackObject)
    {
      _(stackObject).each(function(stackOptions)
      {
        CR.Sprite.create(stackOptions)
      })
    }
  , render: renderOnce
  , setCamera: setCamera
  }

})()

//= require "context"
//= require "viewport"
//= require "camera"
//= require "sprite"

//= require "examples/example"