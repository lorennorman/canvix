$(function(){
  CR.initialize('renderer', function()
  {

    CR.loadStack(CR.Example.Basic)

    var cam = CR.Camera.create(
    { x: CR.renderStack[1].x
    , y: CR.renderStack[1].y
    , viewport:
      { x: 100
      , y: 10
      , width: 650
      , height: 550
      }
    })
    CR.setCamera(cam)

    var right = 1
      , down  = 1
    // setInterval(function()
    // {
    //   cam.x += 3*right
    //   if(cam.x > 800 || cam.x < 0)
    //   {
    //     right *= -1
    //     Math.max(Math.min(800, cam.x), 0)
    //   }
    // 
    //   cam.y += 2*down
    //   if(cam.y > 600 || cam.y < 0)
    //   {
    //     down *= -1
    //     Math.max(Math.min(600, cam.y), 0)
    //   }
    // 
    //   _(CR.renderStack[1].children).each(function(child)
    //   {
    //     child.rotate(.10)
    //   })
    //   // CR.renderStack[1].scale(1.02,1.02)
    //   CR.render()
    // }, 25)

  })
})