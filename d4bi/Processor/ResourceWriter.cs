using Importer.Model;
using Importer.Report;
using Importer.Serializer;
using System.Text;

namespace Importer.Processor
{
    internal class ResourceWriter<T> where T : Item
    {
        private readonly ResourceTarget<T> _target;
        private readonly string _workFolder;
        private readonly ProgressReporter _progressReporter;

        public ResourceWriter(ResourceTarget<T> target, string workFolder, ProgressReporter progressReporter)
        {
            _target = target;
            _workFolder = workFolder;
            _progressReporter = progressReporter;

            _progressReporter.IncrementMaxValue();
        }

        public async Task WriteAsync(IEnumerable<T> items)
        {
            _progressReporter.ReportNext("Save process...");

            var filePath = Path.Combine(_workFolder, _target.FileName);

            if (!string.IsNullOrEmpty(_workFolder))
                Directory.CreateDirectory(_workFolder);

            using var stream = new FileStream(filePath, FileMode.Create);
            using var writer = new StreamWriter(stream, new UTF8Encoding(false));
            var json = JsonSerializer.Serialize(items);
            await writer.WriteAsync(json);
        }
    }
}
