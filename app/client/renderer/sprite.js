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
          // ctx.strokeStyle = 'rgba(255, 0, 0, .65)'
          // ctx.strokeRect(0, 0, width, height)
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