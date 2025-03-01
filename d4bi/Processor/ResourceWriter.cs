using Importer.Model;
using Importer.Serializer;
using System.Text;

namespace Importer.Processor
{
    internal class ResourceWriter<T> where T : Item
    {
        private readonly ResourceTarget<T> _target;
        private readonly string _workFolder;

        public ResourceWriter(ResourceTarget<T> target, string workFolder)
        {
            _target = target;
            _workFolder = workFolder;
        }

        public async Task WriteAsync(IEnumerable<T> items)
        {
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
