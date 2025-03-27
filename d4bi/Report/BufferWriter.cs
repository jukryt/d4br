namespace Importer.Report
{
    internal class BufferWriter : IWriter
    {
        private readonly IWriter _writer;
        private readonly List<string> _buffer;
        private readonly object _lock;

        public BufferWriter(IWriter writer)
        {
            _writer = writer;
            _buffer = [];
            _lock = new();
        }

        public int MessageCount => _buffer.Count;

        public void WriteLine(string message)
        {
            lock (_lock)
                _buffer.Add(message);
        }

        public void Flush()
        {
            lock (_lock)
            {
                var buffer = _buffer.ToList();
                _buffer.Clear();
                foreach (var message in buffer)
                    _writer.WriteLine(message);
            }
        }
    }
}
