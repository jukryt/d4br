using Importer.Model;
using Importer.Report;

namespace Importer.Processor
{
    internal class ResourceChecker<T> where T : Item
    {
        private readonly ResourceCheck<T> _check;
        private readonly IMessageReporter _reporter;

        public ResourceChecker(string resourceName, ResourceCheck<T> check, IMessageReporter reporter)
        {
            _check = check;
            _reporter = new ReporterWrapper(resourceName, reporter);
        }

        public void CheckItems(List<T> items)
        {
            foreach (var checker in _check.Checkers)
                checker.CheckItems(items, _reporter);
        }

        private sealed class ReporterWrapper : IMessageReporter
        {
            private readonly string _resourceName;
            private readonly IMessageReporter _reporter;

            public ReporterWrapper(string resourceName, IMessageReporter reporter)
            {
                _resourceName = resourceName;
                _reporter = reporter;
            }

            public void WriteError(string message, string source = "")
            {
                _reporter.WriteError($"{_resourceName}. {message}", source);
            }

            public void WriteException(Exception exception, string source = "")
            {
                _reporter.WriteException(exception, source);
            }

            public void WriteMessage(string message, string source = "")
            {
                _reporter.WriteMessage($"{_resourceName}. {message}", source);
            }
        }
    }
}
