using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperItem : ClassItem
    {
        public string? Type { get; set; }
        public List<TemperValue> Values { get; set; } = [];

        internal TemperType InternalType { get; set; }
    }

    internal class TemperValue
    {
        public TemperValue(long id, string name)
        {
            Id = id;
            Names = [name];
        }

        public long Id { get; set; }
        public List<string> Names { get; set; }
    }
}
