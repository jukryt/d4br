using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperItem : ClassItem
    {
        public string? Type { get; set; }
        public List<string> Values { get; set; } = [];

        internal TemperType InternalType { get; set; }
    }
}
