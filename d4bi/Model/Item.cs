namespace Importer.Model
{
    internal class Item
    {
        public long Id { get; set; }
        public string? Name { get; set; }
    }

    internal class ItemEqualComparer<T> : IEqualComparer<T> where T : Item
    {
        public virtual bool Equals(T x, T y)
        {
            return x.Id == y.Id ||
                x.Name == y.Name;
        }
    }
}
