using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperItem : ClassItem
    {
        internal TemperType InternalType { get; set; }
        public string? Type { get; set; }
        public List<string> Values { get; set; } = [];
    }
}
