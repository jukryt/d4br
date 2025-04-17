using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperItem : ClassItem
    {
        public string? Type { get; set; }
        public List<TemperDetail> Details { get; set; } = [];

        internal TemperType InternalType { get; set; }
    }

    internal class TemperDetail
    {
        public TemperDetail(long id, string name)
        {
            Id = id;
            Names = [name];
        }

        public long Id { get; }
        public List<string> Names { get; }
    }
}
