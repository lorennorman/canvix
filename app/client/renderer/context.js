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