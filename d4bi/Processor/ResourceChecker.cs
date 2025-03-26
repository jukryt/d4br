using Importer.Logger;
using Importer.Model;

namespace Importer.Processor
{
    internal class ResourceChecker<T> where T : Item
    {
        private readonly ResourceCheck<T> _check;
        private readonly ILogger _logger;

        public ResourceChecker(string resourceName, ResourceCheck<T> check, ILogger logger)
        {
            _check = check;
            _logger = new LoggerWrapper(resourceName, logger);
        }

        public void CheckItems(List<T> items)
        {
            foreach (var checker in _check.Checkers)
                checker.CheckItems(items, _logger);
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
