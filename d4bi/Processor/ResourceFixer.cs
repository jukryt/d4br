using Importer.Logger;
using Importer.Model;

namespace Importer.Processor
{
    internal class ResourceFixer<T> where T : Item
    {
        private readonly ResourceFix<T> _fix;
        private readonly ILogger _logger;

        public ResourceFixer(string resourceName, ResourceFix<T> fix, ILogger logger)
        {
            _fix = fix;
            _logger = new LoggerWrapper(resourceName, logger);
        }

        public async Task FixItemsAsync(List<T> items)
        {
            foreach (var fixer in _fix.Fixers)
                await fixer.FixItemsAsync(items, _logger);
        }

        private sealed class LoggerWrapper : ILogger
        {
            private readonly string _resourceName;
            private readonly ILogger _logger;

            public LoggerWrapper(string resourceName, ILogger logger)
            {
                _resourceName = resourceName;
                _logger = logger;
            }

            public void WriteError(string message, string source = "")
            {
                _logger.WriteError($"{_resourceName}. {message}", source);
            }

            public void WriteException(Exception exception, string source = "")
            {
                _logger.WriteException(exception, source);
            }

            public void WriteMessage(string message, string source = "")
            {
                _logger.WriteMessage($"{_resourceName}. {message}", source);
            }
        }
    }
}
