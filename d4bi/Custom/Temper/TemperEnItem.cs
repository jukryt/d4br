using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperEnItem : Item
    {
        public string? Class { get; set; }
        public string? Type { get; set; }
        public List<string> Values { get; set; } = [];
    }
}
