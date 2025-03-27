using Importer.Model;
using Importer.Report;

namespace Importer.Processor
{
    internal class ResourceFixer<T> where T : Item
    {
        private readonly ResourceFix<T> _fix;
        private readonly IMessageReporter _reporter;

        public ResourceFixer(string resourceName, ResourceFix<T> fix, IMessageReporter reporter)
        {
            _fix = fix;
            _reporter = new ReporterWrapper(resourceName, reporter);
        }

        public async Task FixItemsAsync(List<T> items)
        {
            foreach (var fixer in _fix.Fixers)
                await fixer.FixItemsAsync(items, _reporter);
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
