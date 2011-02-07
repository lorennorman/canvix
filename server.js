require.paths.unshift('node_modules')
var express = require('express')
  , app     = express.createServer()
  , _       = require('underscore')
  , solder  = require('solder')
  , path    = require('path')
  , exec    = require('child_process').exec

/**
 * CONFIGURATION
 */
app.configure(function()
{
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

/**
 * ROUTES
 */
_(['renderer', 'demo', 'test']).each(function(action)
{
  app.get('/'+action, function(req, res)
  {
    res.render(action + '.jade')
  });
})

app.get('/', function(req, res)
{
  res.redirect('/renderer')
})

app.get('/javascript/:buildable_js_file', function(req, res)
{
  var staticPath = 'public/javascript/' + req.params.buildable_js_file
    , buildPath  = 'app/client/' + req.params.buildable_js_file

  path.exists(staticPath, function(exists)
  {
    if(exists)
    {
      res.sendfile(staticPath)
    } else {
      exec('sprocketize -C app/client ' + req.params.buildable_js_file,
        function(error, stdout, stderr)
        {
          if (error !== null) {
            console.log('exec error: ' + error);
          } else {
            res.header('Content-Type', 'application/javascript')
            res.send(stdout)
          }
        }
      )
    }
  })
})

/**
 * GO!
 */
app.listen(5000);

