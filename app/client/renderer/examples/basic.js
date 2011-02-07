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