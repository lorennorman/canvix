require.paths.unshift('node_modules')
var express = require('express')
  , app     = express.createServer()
  , _       = require('underscore')
  , solder  = require('solder')
  , path    = require('path')
  , exec    = require('child_process').exec
  , fs      = require('fs')

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
  var jsFilename = req.params.buildable_js_file
    , staticPath = 'public/javascript/' + jsFilename
    , buildPath  = 'app/client/' + jsFilename
    , buildDir   = buildPath.replace('.js', '')
    , serveJS    = function(jsString)
      {
        res.header('Content-Type', 'application/javascript')
        res.send(jsString)
      }
    , sendStatic = function()
      {
        res.sendfile(staticPath)
      }
    , buildThenSendStatic = function()
      {
        exec('sprocketize -C app/client ' + req.params.buildable_js_file,
          function(error, stdout, stderr)
          {
            if (error !== null) {
              console.log('exec error: ' + error);
            } else {
              fs.writeFile(staticPath, stdout, function(err, written)
              {
                if(err)
                {
                  console.log(err)
                  serveJS('alert("Failed to write static file: '+staticPath+'")')
                } else {
                  sendStatic()
                }
              })
            }
          }
        )
      }
    , ifStaticIsOlderThanBuildFilesElse = function(trueFunc, falseFunc)
      {
        var anyFilesInDirNewerThan = function(path, time)
        {
          var pathStat = fs.statSync(path)
          // verify dirPath is a directory
          if(pathStat.isDirectory())
          { 
            return _(fs.readdirSync(path)).any(function(filename)
            {
              return anyFilesInDirNewerThan(path+'/'+filename, time)
            })
          } else {
            return pathStat.mtime > time
          }
        }

        timeToBeat = fs.statSync(staticPath).mtime
        if(anyFilesInDirNewerThan(buildDir, timeToBeat))
        {
          trueFunc()
        } else {
          falseFunc()
        }
      }

  path.exists(buildPath, function(buildExists)
  {
    path.exists(staticPath, function(staticExists)
    {
      if(buildExists)
      {
        if(!staticExists)
        {
          buildThenSendStatic()
        } else {
          ifStaticIsOlderThanBuildFilesElse(buildThenSendStatic, sendStatic)
        }
      } else if(staticExists) {
        sendStatic()
      } else {
        // serve an error
        serveJS('alert("No file to build or serve: '+jsFilename+'")')
      }
    })
  })
})

/**
 * GO!
 */
app.listen(5000);

