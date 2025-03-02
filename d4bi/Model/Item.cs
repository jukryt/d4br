using System.Diagnostics.CodeAnalysis;

namespace Importer.Model
{
    internal class Item
    {
        public long Id { get; set; }
        public string? Name { get; set; }
    }

    internal class ItemEqualityComparer : IEqualityComparer<Item>
    {
        public bool Equals(Item? x, Item? y)
        {
            if (x == null || y == null)
                return false;

            return x.Name == y.Name;
        }

        public int GetHashCode([DisallowNull] Item obj)
        {
            return obj.Name?.GetHashCode() ?? 0;
        }
    }
}
