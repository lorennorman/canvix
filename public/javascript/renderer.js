
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
        context.translate(- currentCamera.x * currentCamera.scale +
                          currentCamera.viewport.x +
                          currentCamera.viewport.width/2,
                          - currentCamera.y * currentCamera.scale +
                          currentCamera.viewport.y +
                          currentCamera.viewport.height/2)
        context.scale(currentCamera.scale, currentCamera.scale)

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

      initFunction && initFunction()

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

CR.Context = {}

CR.Context.create = function(basicGraphicsContext)
{
  basicGraphicsContext.transformation = function(transformedFunction)
  {
    basicGraphicsContext.save()
    transformedFunction(basicGraphicsContext)
    basicGraphicsContext.restore()
  }

  return basicGraphicsContext
}
CR.Camera = {}

CR.Camera.create = function(options)
{
  return _({}).extend(
    { x: 0
    , y: 0
    , scale: 1
    , viewport:
      { x: 0
      , y: 0
      , width: 800
      , height: 600
      }
    }, options)
}
CR.Sprite =
{ create: function(options, addToStack)
  {
    addToStack = _(addToStack).isUndefined() ? true : addToStack

    var img = new Image()
      , renderAnchor = options.renderAnchor || 'center'
      , x = options.x || 0
      , y = options.y || 0
      , angle = options.angle || 0
      , scaleX = options.scaleX || options.scale || 1
      , scaleY = options.scaleY || options.scale || 1
      , width = 0
      , height = 0

    img.onload = function()
    {
      width = img.width
      height = img.height
    }
    img.src = options.path;

    if(options.children)
    {
      var children = []
      _(options.children).each(function(childOptions)
      {
        children.push(CR.Sprite.create(childOptions, false))
      })
    }

    var doTranslation = function(ctx)
    {
      if(renderAnchor == 'center')
      {
        ctx.translate(-width/2 + x, -height/2 + y)
      }
      else if(renderAnchor == 'topLeft')
      {
        ctx.translate(x, y)
      }
    }

    var doRotation = function(ctx)
    {
      if(angle != 0)
      {
        ctx.rotate(angle)
      }
    }

    var doScale = function(ctx)
    {
      if(scaleX != 1 || scaleY != 1)
      {
        ctx.scale(scaleX, scaleY)
      }
    }

    var thisSprite =
    { children: children
    , x: x
    , y: y
    , render: function(ctx)
      {
        ctx.transformation(function()
        {
          doTranslation(ctx)
          doRotation(ctx)
          doScale(ctx)

          ctx.drawImage(img, 0, 0)
          _(children).each(function(child)
          {
            child.render(ctx)
          })
        })
      }
    , translate: function(dx, dy)
      {
        x += dx
        y += dy
      }
    , rotate: function(da)
      {
        angle += da
        angle = angle % 360
        if(angle < 0)
        {
          angle +=360
        }
      }
    , scale: function(dx, dy)
      {
        scaleX *= dx
        scaleY *= dy
      }
    }

    if(addToStack)
    {
      CR.renderStack.push(thisSprite)
    }

    return thisSprite
  }
}

CR.Example = {}

CR.Example.Basic =
[
  { name: 'background'
  , path: 'images/examples/background.png'
  , renderAnchor: 'topLeft'
  }
, { name: 'pipboy'
  , path: 'images/examples/pipboy.png'
  , x:    450
  , y:    275
  , children:
    [
      { name: 'green_wisp'
      , path: 'images/examples/green_wisp.png'
      , x:    150
      , y:    0
      , scale: .75
      }
    , { name: 'blue_wisp'
      , path: 'images/examples/blue_wisp.png'
      , x:    -150
      , y:    150
      , scale: 1.5
      , angle: -45
      }
    ]
  }
]
