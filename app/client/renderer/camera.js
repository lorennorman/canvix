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